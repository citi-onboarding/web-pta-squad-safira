import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useRef } from "react";
import type { ReactNode } from "react";

import { Button } from "./button";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  cancelLabel?: string;
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
  actionLoading?: boolean;
};

// Radix keeps the focus inside and closes on Esc. The screen controls the
// opening, so the modal itself remembers who had the focus and gives it back.
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  cancelLabel = "Cancelar",
  actionLabel,
  onAction,
  actionDisabled = false,
  actionLoading = false,
}: ModalProps) {
  const returnFocusTo = useRef<HTMLElement | null>(null);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay" />
        <Dialog.Content
          onOpenAutoFocus={() => {
            returnFocusTo.current =
              document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusTo.current?.focus();
          }}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-5 overflow-y-auto rounded-tile border bg-surface p-6 text-foreground shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-title-2 font-bold">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="-mt-2 -mr-3 shrink-0 rounded-tile p-3 text-muted transition-colors hover:bg-highlight/40 hover:text-foreground"
              aria-label="Fechar"
            >
              <X aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </div>
          {description ? (
            <Dialog.Description className="text-body text-muted">
              {description}
            </Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}
          {children}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </Dialog.Close>
            <Button
              onClick={onAction}
              disabled={actionDisabled}
              loading={actionLoading}
            >
              {actionLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
