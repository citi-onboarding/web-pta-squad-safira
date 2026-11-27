import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-tile px-5 text-body font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-fg hover:bg-primary/90 disabled:bg-disabled disabled:text-disabled-fg",
        secondary:
          "border border-primary bg-transparent text-primary hover:bg-highlight/40 disabled:border-disabled disabled:text-disabled-fg dark:border-foreground dark:text-foreground",
        text: "h-auto px-0 font-medium text-primary underline underline-offset-4 hover:no-underline disabled:text-disabled-fg",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    // The action is running: the button cannot be pressed again.
    loading?: boolean;
  };

export function Button({
  className,
  variant = "primary",
  loading = false,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
