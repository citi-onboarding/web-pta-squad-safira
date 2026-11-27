import { screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { renderWithAuth } from "@/features/auth/__tests__/render-with-auth";

import { LoginPage } from "./login-page";

beforeEach(() => {
  document.documentElement.classList.remove("dark");
});

function renderPage() {
  return renderWithAuth(
    <MemoryRouter initialEntries={["/entrar"]}>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  it("shows the brand panel next to the form", () => {
    renderPage();

    const panel = screen.getByRole("complementary");
    expect(within(panel).getByRole("img", { name: "DistriLux" })).toBeVisible();
    expect(
      within(panel).getByText("Portal de pedidos da DistriLux"),
    ).toBeVisible();
    expect(
      within(panel).getByText(
        "Carteira, limite de crédito e pedidos num só lugar, sincronizados com o ERP",
      ),
    ).toBeVisible();
    expect(
      within(panel).getByText("DistriLux Materiais Elétricos · Recife"),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 1, name: "Entrar no portal" }),
    ).toBeInTheDocument();
  });

  it("announces only the logo, not the tile drawing", () => {
    renderPage();

    expect(
      screen.getAllByRole("img").map((img) => img.getAttribute("alt")),
    ).toEqual(["DistriLux"]);
  });

  it("puts the theme switch on the form side, never on the brand panel", () => {
    renderPage();

    const themeButton = screen.getByRole("button", {
      name: "Ativar tema escuro",
    });
    expect(screen.getByRole("complementary")).not.toContainElement(themeButton);
  });
});
