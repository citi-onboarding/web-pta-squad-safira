import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/shared/testing/msw/server";

import { API_URL, sessionsByRole } from "./auth-test-data";
import { renderGuardedRoute } from "./route-guards";

describe("ProtectedRoute", () => {
  it("sends a visitor without a session to the sign-in screen and keeps the requested page", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () =>
        HttpResponse.json(
          { message: "Authentication required." },
          { status: 401 },
        ),
      ),
    );

    renderGuardedRoute("/clientes?busca=abc");

    expect(
      await screen.findByRole("heading", { name: "Sign-in screen" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Requested: /clientes?busca=abc"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Clients content")).not.toBeInTheDocument();
  });

  it("shows the page to a signed-in user", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () =>
        HttpResponse.json(sessionsByRole.VENDEDOR),
      ),
    );

    renderGuardedRoute("/clientes");

    expect(
      await screen.findByRole("heading", { name: "Clients content" }),
    ).toBeInTheDocument();
  });

  it("shows nothing from the page while the session is unknown", async () => {
    let requested = false;
    let answer: () => void = () => undefined;
    server.use(
      http.get(`${API_URL}/auth/me`, async () => {
        requested = true;
        await new Promise<void>((resolve) => {
          answer = resolve;
        });
        return HttpResponse.json(sessionsByRole.VENDEDOR);
      }),
    );

    renderGuardedRoute("/clientes");

    // Wait until the back end received the request, so the session is
    // really unknown and `answer` releases the pending response.
    await waitFor(() => expect(requested).toBe(true));
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.queryByText("Clients content")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign-in screen")).not.toBeInTheDocument();

    answer();
    expect(
      await screen.findByRole("heading", { name: "Clients content" }),
    ).toBeInTheDocument();
  });

  it("shows the generic failure message when the session check fails", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () =>
        HttpResponse.json({ message: "Internal error." }, { status: 500 }),
      ),
    );

    renderGuardedRoute("/clientes");

    expect(
      await screen.findByText("Não foi possível entrar. Tente novamente."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Clients content")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign-in screen")).not.toBeInTheDocument();
  });
});
