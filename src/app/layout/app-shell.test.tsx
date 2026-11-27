import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { env } from "@/shared/lib/env/env";
import { createQueryClient } from "@/shared/lib/query/create-query-client";
import { server } from "@/shared/testing/msw/server";

import { routes } from "../router";

type Session = { id: string; nome: string; papel: string };

const SESSIONS: Record<string, Session> = {
  VENDEDOR: {
    id: "3f1c2a4e-8b7d-4c6a-9e2f-1a2b3c4d5e6f",
    nome: "Patrícia Lins",
    papel: "VENDEDOR",
  },
  GERENTE: {
    id: "7a2b4c6d-1e3f-4a5b-8c7d-9e0f1a2b3c4d",
    nome: "Fernanda Cavalcanti",
    papel: "GERENTE",
  },
  FINANCEIRO: {
    id: "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
    nome: "Sérgio Barros",
    papel: "FINANCEIRO",
  },
  ADMINISTRADOR: {
    id: "c4d5e6f7-a8b9-4c0d-9e1f-2a3b4c5d6e7f",
    nome: "Lucas Moura",
    papel: "ADMINISTRADOR",
  },
};

let currentSession: Session | null = null;

beforeEach(() => {
  currentSession = null;
  document.documentElement.classList.remove("dark");
  server.use(
    http.get(`${env.VITE_API_URL}/auth/me`, () =>
      currentSession
        ? HttpResponse.json(currentSession)
        : HttpResponse.json(
            { message: "Authentication required." },
            { status: 401 },
          ),
    ),
  );
});

function renderAt(path: string, role: keyof typeof SESSIONS) {
  currentSession = SESSIONS[role];
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return { router };
}

describe("signed-in layout", () => {
  it.each([
    ["VENDEDOR", "/clientes", "Patrícia Lins", "Vendedor"],
    ["GERENTE", "/painel", "Fernanda Cavalcanti", "Gerente comercial"],
    ["FINANCEIRO", "/fila", "Sérgio Barros", "Financeiro"],
    ["ADMINISTRADOR", "/usuarios", "Lucas Moura", "Administrador (TI)"],
  ] as const)(
    "shows the logo, the name and role and the theme switch in the header (%s)",
    async (role, path, name, roleLabel) => {
      renderAt(path, role);

      const header = await screen.findByRole("banner");
      expect(
        within(header).getByRole("img", { name: "DistriLux" }),
      ).toBeVisible();
      expect(within(header).getByText(name)).toBeVisible();
      expect(within(header).getByText(roleLabel)).toBeVisible();
      expect(
        within(header).getByRole("button", { name: "Ativar tema escuro" }),
      ).toBeInTheDocument();
    },
  );

  it("highlights the current page in the menu", async () => {
    renderAt("/pedidos", "VENDEDOR");

    const menu = await screen.findByRole("navigation");
    expect(
      within(menu).getByRole("link", { name: "Meus pedidos" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(menu).getByRole("link", { name: "Clientes" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("offers the menu as a select for the phone, which goes to the chosen page", async () => {
    renderAt("/clientes", "VENDEDOR");

    const menu = await screen.findByRole("navigation");
    const select = within(menu).getByRole("combobox", { name: "Ir para" });
    expect(select).toHaveValue("/clientes");
    expect(
      within(select)
        .getAllByRole("option")
        .map((o) => o.textContent),
    ).toEqual(["Clientes", "Meus pedidos"]);

    await userEvent.setup().selectOptions(select, "Meus pedidos");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Meus pedidos" }),
    ).toBeInTheDocument();
  });
});
