import { describe, expect, it } from "vitest";

import { parseAbsolute } from "./datetime";
import { formatDateTime } from "./format-date-time";

describe("formatDateTime", () => {
  it("shows the date and time in Recife time as DD/MM/YYYY HH:mm", () => {
    const timestamp = parseAbsolute("2026-11-19T17:02:00Z");

    expect(formatDateTime(timestamp)).toBe("19/11/2026 14:02");
  });

  it("pads day, month, hour and minute with zeros", () => {
    const timestamp = parseAbsolute("2026-03-05T11:07:00Z");

    expect(formatDateTime(timestamp)).toBe("05/03/2026 08:07");
  });

  it("changes the day when Recife is still on the previous day", () => {
    const timestamp = parseAbsolute("2026-12-01T01:30:00Z");

    expect(formatDateTime(timestamp)).toBe("30/11/2026 22:30");
  });
});
