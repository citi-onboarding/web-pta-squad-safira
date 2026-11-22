import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppProviders } from "./providers";

describe("AppProviders", () => {
  it("composes routing and server-state providers", () => {
    render(<AppProviders />);

    expect(
      screen.getByRole("heading", {
        name: /start with enforced architecture/i,
      }),
    ).toBeInTheDocument();
  });
});
