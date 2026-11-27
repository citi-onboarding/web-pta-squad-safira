import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ErrorState } from "../error-state";

describe("ErrorState", () => {
  it("announces what went wrong", () => {
    render(
      <ErrorState
        message="Não foi possível carregar os clientes."
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os clientes.",
    );
  });

  it("loads again when the person presses Tentar de novo", async () => {
    const onRetry = vi.fn();
    render(
      <ErrorState
        message="Não foi possível carregar os clientes."
        onRetry={onRetry}
      />,
    );

    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Tentar de novo" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
