import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { BackLink } from "../back-link";

function renderAt(ui: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={["/clientes/C0012"]}>
      <Routes>
        <Route path="/clientes/:code" element={ui} />
        <Route path="/clientes" element={<h1>Lista de clientes</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BackLink", () => {
  it("shows the arrow and the destination, announced as Voltar para", () => {
    renderAt(<BackLink to="/clientes" label="Clientes" />);

    const link = screen.getByRole("link", { name: "Voltar para Clientes" });
    expect(link).toHaveAttribute("href", "/clientes");
    expect(link).toHaveTextContent("Clientes");
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("opens the destination", async () => {
    renderAt(<BackLink to="/clientes" label="Clientes" />);

    await userEvent
      .setup()
      .click(screen.getByRole("link", { name: "Voltar para Clientes" }));

    expect(
      screen.getByRole("heading", { name: "Lista de clientes" }),
    ).toBeInTheDocument();
  });

  it("reads Voltar without a destination name", () => {
    renderAt(<BackLink to="/clientes" />);

    expect(screen.getByRole("link", { name: "Voltar" })).toHaveTextContent(
      "Voltar",
    );
  });
});
