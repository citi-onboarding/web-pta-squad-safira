import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/shared/lib/cn";

type BackLinkProps = {
  to: string;
  // The screen the link goes back to, e.g. "Clientes". Without it: "Voltar".
  label?: string;
  className?: string;
};

// "← Clientes" on screen, "Voltar para Clientes" for screen readers.
export function BackLink({ to, label, className }: BackLinkProps) {
  return (
    <Link
      to={to}
      aria-label={label ? `Voltar para ${label}` : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-tile text-body font-medium text-primary underline-offset-4 hover:underline",
        className,
      )}
    >
      <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
      {label ?? "Voltar"}
    </Link>
  );
}
