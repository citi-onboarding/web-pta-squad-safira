import { LoaderCircle } from "lucide-react";

import { cn } from "@/shared/lib/cn";

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({
  label = "Carregando…",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-32 items-center justify-center gap-2 text-body text-muted",
        className,
      )}
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-4 animate-spin motion-reduce:animate-none"
      />
      {label}
    </div>
  );
}
