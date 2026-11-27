import tileLouca from "@/shared/assets/brand/azulejo-figura-2x2-louca.svg";
import tileNoturna from "@/shared/assets/brand/azulejo-figura-2x2-noturna.svg";
import { cn } from "@/shared/lib/cn";

import { Button } from "./button";

type EmptyStateProps = {
  message: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
};

// One whole tile figure, the message and, when there is one, the action.
export function EmptyState({
  message,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 px-4 py-10 text-center",
        className,
      )}
    >
      <img
        src={tileLouca}
        alt=""
        aria-hidden="true"
        className="mb-2 size-20 dark:hidden"
      />
      <img
        src={tileNoturna}
        alt=""
        aria-hidden="true"
        className="mb-2 hidden size-20 dark:block"
      />
      <p className="text-title-3 font-semibold text-foreground">{message}</p>
      {description ? (
        <p className="max-w-sm text-body text-muted">{description}</p>
      ) : null}
      {action ? (
        <Button variant="secondary" onClick={action.onClick} className="mt-3">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
