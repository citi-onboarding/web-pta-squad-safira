import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

export function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-tile border border-input bg-surface px-3 text-body text-foreground transition-colors placeholder:text-muted/80 enabled:hover:border-muted disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-fg aria-invalid:border-danger aria-invalid:shadow-[inset_0_0_0_1px_var(--danger)]",
        className,
      )}
      {...props}
    />
  );
}
