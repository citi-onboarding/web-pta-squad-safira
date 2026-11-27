import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TextField } from "../text-field";

describe("TextField", () => {
  it("is found by its visible label", () => {
    render(<TextField label="E-mail" type="email" name="email" />);

    expect(screen.getByText("E-mail")).toBeVisible();
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");
  });

  it("accepts typing and can be reached with the keyboard", async () => {
    render(<TextField label="E-mail" name="email" />);
    const user = userEvent.setup();

    await user.tab();
    const field = screen.getByLabelText("E-mail");
    expect(field).toHaveFocus();

    await user.keyboard("ana@distrilux.com.br");
    expect(field).toHaveValue("ana@distrilux.com.br");
  });

  it("marks itself invalid and announces its error message", () => {
    render(
      <TextField
        label="Quantidade"
        name="quantidade"
        error="Use número inteiro maior que zero"
      />,
    );

    const field = screen.getByLabelText("Quantidade");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(
      "Use número inteiro maior que zero",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Use número inteiro maior que zero",
    );
  });

  it("can be marked invalid without its own message", () => {
    render(<TextField label="Senha" name="senha" invalid />);

    expect(screen.getByLabelText("Senha")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not accept typing while disabled", async () => {
    render(<TextField label="E-mail" name="email" disabled />);

    const field = screen.getByLabelText("E-mail");
    await userEvent.setup().type(field, "ana");

    expect(field).toBeDisabled();
    expect(field).toHaveValue("");
  });
});
