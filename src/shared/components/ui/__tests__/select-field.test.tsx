import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SelectField } from "../select-field";

const OPTIONS = [
  { value: "/clientes", label: "Clientes" },
  { value: "/pedidos", label: "Meus pedidos" },
];

describe("SelectField", () => {
  it("is found by its visible label and lists its options", () => {
    render(
      <SelectField
        label="Ir para"
        options={OPTIONS}
        defaultValue="/clientes"
      />,
    );

    const select = screen.getByRole("combobox", { name: "Ir para" });
    expect(select).toHaveValue("/clientes");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Clientes",
      "Meus pedidos",
    ]);
  });

  it("reports the chosen option", async () => {
    const onChange = vi.fn();
    render(
      <SelectField
        label="Ir para"
        options={OPTIONS}
        defaultValue="/clientes"
        onChange={(event) => onChange(event.target.value)}
      />,
    );

    await userEvent
      .setup()
      .selectOptions(
        screen.getByRole("combobox", { name: "Ir para" }),
        "Meus pedidos",
      );

    expect(onChange).toHaveBeenCalledWith("/pedidos");
  });

  it("marks itself invalid and announces its error message", () => {
    render(
      <SelectField
        label="Carteira"
        options={OPTIONS}
        error="Escolha uma carteira"
      />,
    );

    const select = screen.getByRole("combobox", { name: "Carteira" });
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAccessibleDescription("Escolha uma carteira");
    expect(screen.getByRole("alert")).toHaveTextContent("Escolha uma carteira");
  });

  it("cannot be changed while disabled", () => {
    render(<SelectField label="Ir para" options={OPTIONS} disabled />);

    expect(screen.getByRole("combobox", { name: "Ir para" })).toBeDisabled();
  });
});
