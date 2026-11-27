import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "../modal";

function Harness({ onAction = vi.fn() }: { onAction?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Recusar
      </button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Recusar pedido"
        cancelLabel="Voltar"
        actionLabel="Recusar pedido"
        onAction={onAction}
      >
        <label htmlFor="motivo">Motivo</label>
        <textarea id="motivo" />
      </Modal>
    </>
  );
}

async function openModal() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Recusar" }));
  await screen.findByRole("dialog", { name: "Recusar pedido" });
  return user;
}

describe("Modal", () => {
  it("closes with Esc and gives the focus back to the button that opened it", async () => {
    render(<Harness />);
    const user = await openModal();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recusar" })).toHaveFocus();
  });

  it("closes with the cancel action", async () => {
    render(<Harness />);
    const user = await openModal();

    await user.click(screen.getByRole("button", { name: "Voltar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("runs its action", async () => {
    const onAction = vi.fn();
    render(<Harness onAction={onAction} />);
    const user = await openModal();

    await user.click(screen.getByRole("button", { name: "Recusar pedido" }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("keeps the keyboard focus inside while open", async () => {
    render(<Harness />);
    const user = await openModal();
    const dialog = screen.getByRole("dialog", { name: "Recusar pedido" });

    for (let step = 0; step < 6; step += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });
});
