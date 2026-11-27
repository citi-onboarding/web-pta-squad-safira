import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/shared/testing/msw/server";

import { API_URL, sessionsByRole } from "./auth-test-data";
import { renderGuardedRoute } from "./route-guards";

describe("RoleRoute", () => {
  it("shows the access-denied message instead of a page outside the role", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () =>
        HttpResponse.json(sessionsByRole.VENDEDOR),
      ),
    );

    renderGuardedRoute("/usuarios");

    expect(
      await screen.findByText("Você não tem acesso a esta página"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Users content")).not.toBeInTheDocument();
  });

  it("shows a page that belongs to the role", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () =>
        HttpResponse.json(sessionsByRole.VENDEDOR),
      ),
    );

    renderGuardedRoute("/clientes");

    expect(
      await screen.findByRole("heading", { name: "Clients content" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Você não tem acesso a esta página"),
    ).not.toBeInTheDocument();
  });
});
