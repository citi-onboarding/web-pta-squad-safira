import { Moon, Sun } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/cn";
import { applyTheme, getAppliedTheme, storeTheme } from "@/shared/lib/theme";

type ThemeSwitchProps = {
  className?: string;
};

// An on/off switch: the knob shows the current theme and slides to the right
// in the dark theme. It stays a button named after what it does, so screen
// readers hear "Ativar tema escuro" or "Ativar tema claro". The theme applied
// on load comes from index.html (stored choice or system preference).
export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const [theme, setTheme] = useState(getAppliedTheme);
  const next = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Moon : Sun;

  function handleClick() {
    applyTheme(next);
    storeTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={next === "dark" ? "Ativar tema escuro" : "Ativar tema claro"}
      className={cn(
        "inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-tile border border-input bg-surface p-[3px] hover:border-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-6 items-center justify-center rounded-[2px] bg-primary text-primary-fg transition-transform duration-200 motion-reduce:transition-none",
          theme === "dark" && "translate-x-6",
        )}
      >
        <Icon className="size-3.5" />
      </span>
    </button>
  );
}
