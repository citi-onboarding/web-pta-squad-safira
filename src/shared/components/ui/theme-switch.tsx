import { useState } from "react";

import { cn } from "@/shared/lib/cn";
import { applyTheme, getAppliedTheme, storeTheme } from "@/shared/lib/theme";

type ThemeSwitchProps = {
  className?: string;
};

// A light switch, because DistriLux is light: "ON" in the light theme (the
// light is on), "OFF" in the dark theme, with the knob sliding to the right.
// It stays a button named after what it does, so screen readers hear
// "Ativar tema escuro" or "Ativar tema claro", and the same text shows as a
// tooltip. ON/OFF is drawn by CSS (generated content), not written as text:
// visible text inside the button would have to be part of its name (WCAG
// 2.5.3). The theme applied on load comes from index.html.
export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const [theme, setTheme] = useState(getAppliedTheme);
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Ativar tema escuro" : "Ativar tema claro";

  function handleClick() {
    applyTheme(next);
    storeTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      data-light={theme === "dark" ? "off" : "on"}
      className={cn(
        // The drawing stays 32 px tall; the invisible ::after grows the touch area to 40 px.
        "relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-tile border border-input bg-surface p-[3px] transition-colors after:absolute after:-inset-1 hover:border-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-6 w-8 items-center justify-center rounded-[2px] bg-primary text-[0.625rem] leading-none font-bold text-primary-fg transition-transform duration-200 before:content-['ON'] motion-reduce:transition-none",
          theme === "dark" && "translate-x-6 before:content-['OFF']",
        )}
      />
    </button>
  );
}
