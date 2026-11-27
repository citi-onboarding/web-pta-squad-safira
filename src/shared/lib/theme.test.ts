import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyTheme,
  getAppliedTheme,
  getPreferredTheme,
  storeTheme,
  THEME_STORAGE_KEY,
} from "./theme";

function mockSystemPrefersDark(prefersDark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)" && prefersDark,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getPreferredTheme", () => {
  it("follows the system when there is no stored choice", () => {
    mockSystemPrefersDark(true);
    expect(getPreferredTheme()).toBe("dark");

    mockSystemPrefersDark(false);
    expect(getPreferredTheme()).toBe("light");
  });

  it("prefers the stored choice over the system", () => {
    mockSystemPrefersDark(false);
    localStorage.setItem(THEME_STORAGE_KEY, "dark");

    expect(getPreferredTheme()).toBe("dark");
  });

  it("ignores an unknown stored value", () => {
    mockSystemPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, "purple");

    expect(getPreferredTheme()).toBe("dark");
  });

  it("falls back to the system when the browser storage is unavailable", () => {
    mockSystemPrefersDark(true);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });

    expect(getPreferredTheme()).toBe("dark");
  });
});

describe("applyTheme and getAppliedTheme", () => {
  it("puts the dark class on the root element only for the dark theme", () => {
    applyTheme("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(getAppliedTheme()).toBe("dark");

    applyTheme("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(getAppliedTheme()).toBe("light");
  });
});

describe("storeTheme", () => {
  it("keeps the choice so it survives a reload", () => {
    mockSystemPrefersDark(false);

    storeTheme("dark");

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(getPreferredTheme()).toBe("dark");
  });

  it("does not break when the browser storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });

    expect(() => storeTheme("dark")).not.toThrow();
  });
});
