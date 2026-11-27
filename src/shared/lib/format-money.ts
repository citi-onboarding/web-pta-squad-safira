const moneyFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// The ERP works in cents (RN-13); every amount on screen goes through here.
export function formatMoney(cents: number): string {
  return moneyFormat.format(cents / 100);
}
