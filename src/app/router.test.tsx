import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { env } from "@/shared/lib/env/env";
import { createQueryClient } from "@/shared/lib/query/create-query-client";
import { server } from "@/shared/testing/msw/server";

import { routes } from "./router";

describe("application router", () => {
  it("sends the root route to the sign-in screen without a session", async () => {
    server.use(
      http.get(`${env.VITE_API_URL}/auth/me`, () =>
        HttpResponse.json({}, { status: 401 }),
      ),
    );
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });

    render(
      <QueryClientProvider client={createQueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole("heading", { name: "Entrar no portal" }),
    ).toBeInTheDocument();
  });

  it("renders the not-found route", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/missing-route"],
    });

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
  });
});
