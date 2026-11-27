import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Banner } from "../banner";

describe("Banner", () => {
  it("announces an error message with an icon and its text", () => {
    const { container } = render(
      <Banner tone="error">E-mail ou senha incorretos.</Banner>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "E-mail ou senha incorretos.",
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("shows an information message politely, with an icon and its text", () => {
    const { container } = render(
      <Banner tone="info">3 contratos vencem este mês.</Banner>,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "3 contratos vencem este mês.",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
