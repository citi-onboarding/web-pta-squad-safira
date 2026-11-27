import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusChip } from "../status-chip";
import type { ChipStatus } from "../status-chip";

const CASES: [ChipStatus, string, string][] = [
  ["ATIVO", "Ativo", "outline"],
  ["BLOQUEADO", "Bloqueado", "tinted"],
  ["INATIVO", "Inativo", "dashed"],
  ["RASCUNHO", "Rascunho", "dashed"],
  ["ENVIANDO", "Enviando", "dashed"],
  ["ENVIADO_AO_ERP", "Enviado ao ERP", "filled"],
  ["APROVADO", "Aprovado", "filled"],
  ["AGUARDANDO_FINANCEIRO", "Aguardando financeiro", "outline"],
  ["BLOQUEADO_POR_CREDITO", "Bloqueado por crédito", "tinted"],
  ["ERRO_DE_ENVIO", "Erro de envio", "error"],
  ["RECUSADO", "Recusado", "error"],
];

describe("StatusChip", () => {
  it.each(CASES)("shows %s as the text %s with an icon", (status, text) => {
    const { container } = render(<StatusChip status={status} />);

    expect(screen.getByText(text)).toBeVisible();
    const icon = container.querySelector("svg");
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it.each(CASES)("draws %s with the %s look", (status, _text, appearance) => {
    const { container } = render(<StatusChip status={status} />);

    expect(container.firstElementChild).toHaveAttribute(
      "data-appearance",
      appearance,
    );
  });

  it("uses the error look only for error statuses", () => {
    const errors = CASES.filter(
      ([, , appearance]) => appearance === "error",
    ).map(([status]) => status);

    expect(errors).toEqual(["ERRO_DE_ENVIO", "RECUSADO"]);
  });

  it("draws an active client differently from a sent order", () => {
    render(
      <>
        <StatusChip status="ATIVO" />
        <StatusChip status="ENVIADO_AO_ERP" />
      </>,
    );

    expect(
      screen.getByText("Ativo").closest("[data-appearance]"),
    ).toHaveAttribute("data-appearance", "outline");
    expect(
      screen.getByText("Enviado ao ERP").closest("[data-appearance]"),
    ).toHaveAttribute("data-appearance", "filled");
  });
});
