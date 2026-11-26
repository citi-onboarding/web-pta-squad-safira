import { QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { env } from "@/shared/lib/env/env";
import { createQueryClient } from "@/shared/lib/query/create-query-client";
import { server } from "@/shared/testing/msw/server";

import { routes } from "./router";

type Session = { id: string; nome: string; papel: string };

const PASSWORD = "secret";
const usersByEmail: Record<string, Session> = {
  "patricia@distrilux.test": {
    id: "3f1c2a4e-8b7d-4c6a-9e2f-1a2b3c4d5e6f",
    nome: "Patrícia",
    papel: "VENDEDOR",
  },
  "fernanda@distrilux.test": {
    id: "7a2b4c6d-1e3f-4a5b-8c7d-9e0f1a2b3c4d",
    nome: "Fernanda Cavalcanti",
    papel: "GERENTE",
  },
  "sergio@distrilux.test": {
    id: "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
    nome: "Sérgio Barros",
    papel: "FINANCEIRO",
  },
  "lucas@distrilux.test": {
    id: "c4d5e6f7-a8b9-4c0d-9e1f-2a3b4c5d6e7f",
    nome: "Lucas Moura",
    papel: "ADMINISTRADOR",
  },
};

// Simulates the BACK-01 session: sign-in sets it, sign-out removes it.
let currentSession: Session | null = null;
let logoutCalls = 0;

beforeEach(() => {
  currentSession = null;
  logoutCalls = 0;
  server.use(
    http.get(`${env.VITE_API_URL}/auth/me`, () =>
      currentSession
        ? HttpResponse.json(currentSession)
        : HttpResponse.json(
            { message: "Authentication required." },
            { status: 401 },
          ),
    ),
    http.post(`${env.VITE_API_URL}/auth/login`, async ({ request }) => {
      const body = (await request.json()) as { email: string; senha: string };
      const user = usersByEmail[body.email];

      if (!user || body.senha !== PASSWORD) {
        return HttpResponse.json(
          { message: "Invalid email or password." },
          { status: 401 },
        );
      }

      currentSession = user;
      return HttpResponse.json(user);
    }),
    http.post(`${env.VITE_API_URL}/auth/logout`, () => {
      logoutCalls += 1;
      currentSession = null;
      return new HttpResponse(null, { status: 204 });
    }),
  );
});

function renderApp(initialEntries: string[], initialIndex?: number) {
  const router = createMemoryRouter(routes, { initialEntries, initialIndex });
  const queryClient = createQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return { router };
}

async function signIn(email: string) {
  const user = userEvent.setup();

  await screen.findByRole("heading", { name: "Entrar no portal" });
  await user.type(screen.getByLabelText("E-mail"), email);
  await user.type(screen.getByLabelText("Senha"), PASSWORD);
  await user.click(screen.getByRole("button", { name: "Entrar" }));

  return user;
}

function signInAs(email: string) {
  currentSession = usersByEmail[email];
}

describe("sign-in and redirection", () => {
  it.each([
    ["patricia@distrilux.test", "Clientes"],
    ["fernanda@distrilux.test", "Painel do comercial"],
    ["sergio@distrilux.test", "Fila do financeiro"],
    ["lucas@distrilux.test", "Usuários"],
  ])("sends %s to the initial page %s", async (email, page) => {
    renderApp(["/entrar"]);

    await signIn(email);

    expect(
      await screen.findByRole("heading", { level: 1, name: page }),
    ).toBeInTheDocument();
  });

  it("returns to the page requested before signing in", async () => {
    renderApp(["/pedidos"]);

    await signIn("patricia@distrilux.test");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Meus pedidos" }),
    ).toBeInTheDocument();
  });

  it("shows the access-denied message when the requested page is outside the role", async () => {
    renderApp(["/usuarios"]);

    await signIn("patricia@distrilux.test");

    expect(
      await screen.findByText("Você não tem acesso a esta página"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 1, name: "Usuários" }),
    ).not.toBeInTheDocument();
  });
});

describe("menu by role", () => {
  it.each([
    ["patricia@distrilux.test", "/clientes", ["Clientes", "Meus pedidos"]],
    ["fernanda@distrilux.test", "/painel", ["Painel do comercial"]],
    ["sergio@distrilux.test", "/fila", ["Fila do financeiro"]],
    ["lucas@distrilux.test", "/usuarios", ["Usuários"]],
  ])("shows %s only the entries of their role", async (email, path, items) => {
    signInAs(email);
    renderApp([path]);

    const menu = await screen.findByRole("navigation");
    const links = within(menu).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual(items);
    expect(
      within(menu).getByRole("button", { name: "Sair" }),
    ).toBeInTheDocument();
  });
});

describe("sign out", () => {
  it("ends the session in the back end and shows the sign-in screen", async () => {
    signInAs("fernanda@distrilux.test");
    renderApp(["/painel"]);
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: "Sair" }));

    expect(
      await screen.findByRole("heading", { name: "Entrar no portal" }),
    ).toBeInTheDocument();
    expect(logoutCalls).toBe(1);
  });

  it("shows no data from the ended session when going back in the browser", async () => {
    signInAs("patricia@distrilux.test");
    const { router } = renderApp(["/clientes", "/pedidos"], 1);
    const user = userEvent.setup();

    await screen.findByRole("heading", { level: 1, name: "Meus pedidos" });
    await user.click(screen.getByRole("button", { name: "Sair" }));
    await screen.findByRole("heading", { name: "Entrar no portal" });

    await act(() => router.navigate(-1));

    expect(
      await screen.findByRole("heading", { name: "Entrar no portal" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 1, name: "Clientes" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("hides a page the browser restores from memory after the session ended", async () => {
    signInAs("patricia@distrilux.test");
    renderApp(["/clientes"]);
    await screen.findByRole("heading", { level: 1, name: "Clientes" });

    // The session ended elsewhere (for example "Sair" in a later page load),
    // and the browser now shows this kept page again without reloading it.
    currentSession = null;
    act(() => {
      window.dispatchEvent(
        new PageTransitionEvent("pageshow", { persisted: true }),
      );
    });

    expect(
      await screen.findByRole("heading", { name: "Entrar no portal" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 1, name: "Clientes" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
