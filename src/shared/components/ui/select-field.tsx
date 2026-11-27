import { ChevronDown } from "lucide-react";
import { useId } from "react";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

import { FieldMessage } from "./field-message";

export type SelectOption = { value: string; label: string };

type SelectFieldProps = Omit<ComponentProps<"select">, "id" | "children"> & {
  label: string;
  options: readonly SelectOption[];
  error?: string;
  // Keeps the label for screen readers only (e.g. the phone menu).
  hideLabel?: boolean;
};

// A native select: on the phone it opens the device's own picker.
export function SelectField({
  label,
  options,
  error,
  hideLabel = false,
  className,
  ...props
}: SelectFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-caption font-semibold text-foreground",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : undefined}
          className="h-11 w-full cursor-pointer appearance-none rounded-tile border border-input bg-surface pr-10 pl-3 text-body text-foreground transition-colors enabled:hover:border-muted disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-fg aria-invalid:border-danger aria-invalid:shadow-[inset_0_0_0_1px_var(--danger)]"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
        />
      </div>
      {error ? <FieldMessage id={messageId}>{error}</FieldMessage> : null}
    </div>
  );
}
