import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("says what is empty", () => {
    render(<EmptyState message="Nenhum cliente encontrado na sua busca." />);

    expect(
      screen.getByText("Nenhum cliente encontrado na sua busca."),
    ).toBeVisible();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps the tile drawing away from screen readers", () => {
    render(<EmptyState message="Nenhum documento para revisar" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("offers its action when it has one", async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        message="Nenhum documento para revisar"
        action={{ label: "Atualizar", onClick }}
      />,
    );

    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Atualizar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
