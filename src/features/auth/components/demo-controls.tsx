import { useId } from "react";

import { cn } from "@/shared/lib/cn";

export type SimulatedState = "normal" | "error" | "pending";

const STATES: { value: SimulatedState; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "error", label: "Erro" },
  { value: "pending", label: "Entrando" },
];

// Seed accounts of the back end (fake people). Only the email is filled in:
// no password is ever written in the front end, whose code is public.
// Decided without the squad manager because of the deadline; see the proposal.
const SHORTCUTS: { label: string; email: string }[] = [
  { label: "Gerente comercial", email: "fernanda@distrilux.test" },
  { label: "Financeiro", email: "sergio@distrilux.test" },
];

type DemoControlsProps = {
  state: SimulatedState;
  onChange: (state: SimulatedState) => void;
  onShortcut: (email: string) => void;
};

// Prototype controls, rendered only in demo builds (VITE_DEMO_MODE).
export function DemoControls({
  state,
  onChange,
  onShortcut,
}: DemoControlsProps) {
  const labelId = useId();
  const shortcutsId = useId();

  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          id={shortcutsId}
          className="text-caption font-semibold text-muted"
        >
          Atalhos do protótipo
        </span>
        <div role="group" aria-labelledby={shortcutsId} className="flex gap-3">
          {SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut.email}
              type="button"
              onClick={() => onShortcut(shortcut.email)}
              className="h-8 cursor-pointer text-caption font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              {shortcut.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span id={labelId} className="text-caption font-semibold text-muted">
          Simular
        </span>
        <div role="group" aria-labelledby={labelId} className="flex gap-1">
          {STATES.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={state === option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-8 cursor-pointer rounded-tile border px-2.5 text-caption font-medium",
                state === option.value
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
