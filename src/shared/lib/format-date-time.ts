const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Recife",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// Shows a moment as DD/MM/YYYY HH:mm in DistriLux's own time (Recife), so
// everyone sees the same time as the company.
export function formatDateTime(timestamp: number): string {
  const parts = Object.fromEntries(
    dateTimeFormat
      .formatToParts(timestamp)
      .map((part) => [part.type, part.value]),
  );

  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}
