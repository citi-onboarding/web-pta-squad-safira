import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { RouteErrorPage } from "./route-error-page";

describe("RouteErrorPage", () => {
  it("renders a route response without exposing internal details", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const router = createMemoryRouter(
      [
        {
          path: "/",
          loader: () => {
            throw new Response(null, {
              status: 503,
              statusText: "Unavailable",
            });
          },
          element: <div />,
          errorElement: <RouteErrorPage />,
        },
      ],
      { initialEntries: ["/"] },
    );

    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(screen.getByText("503 Unavailable")).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
