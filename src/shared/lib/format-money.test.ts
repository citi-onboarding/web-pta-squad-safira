import { describe, expect, it } from "vitest";

import { formatMoney } from "./format-money";

// Intl uses a non-breaking space after "R$" so the symbol never wraps alone.
function visible(text: string) {
  return text.replace(/\u00a0/g, " ");
}

describe("formatMoney", () => {
  it.each([
    [123456, "R$ 1.234,56"],
    [0, "R$ 0,00"],
    [5, "R$ 0,05"],
    [123456789012, "R$ 1.234.567.890,12"],
  ])("shows %i cents as %s", (cents, expected) => {
    expect(visible(formatMoney(cents))).toBe(expected);
  });

  it("shows a negative amount with a minus sign (available limit below zero, client C0044)", () => {
    expect(visible(formatMoney(-50000))).toBe("-R$ 500,00");
  });

  it("keeps the symbol and the number together on one line", () => {
    expect(formatMoney(100)).toContain("R$\u00a0");
  });
});
