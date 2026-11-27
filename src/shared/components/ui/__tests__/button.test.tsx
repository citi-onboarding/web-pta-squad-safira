import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button";

describe("Button", () => {
  it("runs its action when pressed", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Entrar</Button>);

    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Entrar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("can be reached with the keyboard and pressed with Enter", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Entrar</Button>);
    const user = userEvent.setup();

    await user.tab();
    expect(screen.getByRole("button", { name: "Entrar" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does nothing while disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Enviar pedido
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Enviar pedido" });
    await userEvent.setup().click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not run again while its action is in progress", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} loading>
        Entrando…
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Entrando…" });
    await userEvent.setup().click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(["primary", "secondary", "text"] as const)(
    "renders the %s variant as a button",
    (variant) => {
      render(<Button variant={variant}>Cancelar</Button>);

      expect(screen.getByRole("button", { name: "Cancelar" })).toHaveAttribute(
        "data-variant",
        variant,
      );
    },
  );
});
