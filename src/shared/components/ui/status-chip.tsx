import {
  Check,
  CircleMinus,
  Clock,
  Lock,
  PencilLine,
  TriangleAlert,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

export type ClientStatus = "ATIVO" | "BLOQUEADO" | "INATIVO";

export type OrderStatus =
  | "RASCUNHO"
  | "ENVIANDO"
  | "ENVIADO_AO_ERP"
  | "ERRO_DE_ENVIO"
  | "BLOQUEADO_POR_CREDITO"
  | "AGUARDANDO_FINANCEIRO"
  | "APROVADO"
  | "RECUSADO";

export type ChipStatus = ClientStatus | OrderStatus;

type Appearance = "outline" | "filled" | "tinted" | "dashed" | "error";

// Red is only for errors; the other statuses are told apart by fill,
// outline and icon (DESIGN.md, "Status chip").
const CHIPS: Record<
  ChipStatus,
  { text: string; icon: LucideIcon; appearance: Appearance }
> = {
  ATIVO: { text: "Ativo", icon: Check, appearance: "outline" },
  BLOQUEADO: { text: "Bloqueado", icon: Lock, appearance: "tinted" },
  INATIVO: { text: "Inativo", icon: CircleMinus, appearance: "dashed" },
  RASCUNHO: { text: "Rascunho", icon: PencilLine, appearance: "dashed" },
  ENVIANDO: { text: "Enviando", icon: PencilLine, appearance: "dashed" },
  ENVIADO_AO_ERP: { text: "Enviado ao ERP", icon: Check, appearance: "filled" },
  APROVADO: { text: "Aprovado", icon: Check, appearance: "filled" },
  AGUARDANDO_FINANCEIRO: {
    text: "Aguardando financeiro",
    icon: Clock,
    appearance: "outline",
  },
  BLOQUEADO_POR_CREDITO: {
    text: "Bloqueado por crédito",
    icon: TriangleAlert,
    appearance: "tinted",
  },
  ERRO_DE_ENVIO: { text: "Erro de envio", icon: X, appearance: "error" },
  RECUSADO: { text: "Recusado", icon: X, appearance: "error" },
};

const APPEARANCE_CLASSES: Record<Appearance, string> = {
  outline: "border-foreground text-foreground",
  filled: "border-foreground bg-foreground text-background",
  tinted: "border-highlight bg-highlight text-highlight-fg",
  dashed: "border-dashed border-muted text-foreground",
  error: "border-danger bg-danger-surface text-danger",
};

type StatusChipProps = {
  status: ChipStatus;
  className?: string;
};

export function StatusChip({ status, className }: StatusChipProps) {
  const { text, icon: Icon, appearance } = CHIPS[status];

  return (
    <span
      data-appearance={appearance}
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-tile border px-2 text-caption font-semibold whitespace-nowrap",
        APPEARANCE_CLASSES[appearance],
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {text}
    </span>
  );
}
