export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "distrilux-theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// The person's own choice wins; without one, the portal follows the system.
export function getPreferredTheme(): Theme {
  return readStoredTheme() ?? (systemPrefersDark() ? "dark" : "light");
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Without storage the choice lasts only until the page reloads.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function getAppliedTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
