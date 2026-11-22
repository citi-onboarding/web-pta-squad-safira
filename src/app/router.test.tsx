import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { routes } from "./router";

describe("application router", () => {
  it("renders the home route", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole("heading", {
        name: /start with enforced architecture/i,
      }),
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
