import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "@/shared/lib/theme";

import { ThemeSwitch } from "../theme-switch";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("ThemeSwitch", () => {
  it("offers the dark theme while the light theme is on", () => {
    render(<ThemeSwitch />);

    expect(
      screen.getByRole("button", { name: "Ativar tema escuro" }),
    ).toBeInTheDocument();
  });

  it("offers the light theme while the dark theme is on", () => {
    document.documentElement.classList.add("dark");
    render(<ThemeSwitch />);

    expect(
      screen.getByRole("button", { name: "Ativar tema claro" }),
    ).toBeInTheDocument();
  });

  it("changes the theme at once, renames itself and keeps the choice", async () => {
    render(<ThemeSwitch />);

    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Ativar tema escuro" }));

    expect(document.documentElement).toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: "Ativar tema claro" }),
    ).toBeInTheDocument();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it.each(["{Enter}", " "])("works with the keyboard (%s)", async (key) => {
    render(<ThemeSwitch />);
    const user = userEvent.setup();

    await user.tab();
    expect(
      screen.getByRole("button", { name: "Ativar tema escuro" }),
    ).toHaveFocus();
    await user.keyboard(key);

    expect(document.documentElement).toHaveClass("dark");
  });
});
