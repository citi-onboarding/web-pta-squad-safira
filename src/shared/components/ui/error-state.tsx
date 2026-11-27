import { CircleAlert, RefreshCw } from "lucide-react";

import { cn } from "@/shared/lib/cn";

import { Button } from "./button";

type ErrorStateProps = {
  // What happened and what to do, without technical codes.
  message: string;
  onRetry: () => void;
  className?: string;
};

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 px-4 py-10 text-center",
        className,
      )}
    >
      <p
        role="alert"
        className="flex items-start gap-2 text-body font-semibold text-danger"
      >
        <CircleAlert aria-hidden="true" className="mt-1 size-4 shrink-0" />
        {message}
      </p>
      <Button variant="secondary" onClick={onRetry} className="mt-3">
        <RefreshCw aria-hidden="true" />
        Tentar de novo
      </Button>
    </div>
  );
}
