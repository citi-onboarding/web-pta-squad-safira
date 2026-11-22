const WALL_CLOCK_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/;
const ABSOLUTE_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/;

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

function partsFromMatch(match: RegExpMatchArray): DateParts {
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6]),
    millisecond: Number((match[7] ?? "0").padEnd(3, "0")),
  };
}

function wallClockTimestamp(parts: DateParts): number {
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  date.setUTCHours(parts.hour, parts.minute, parts.second, parts.millisecond);

  if (
    date.getUTCFullYear() !== parts.year ||
    date.getUTCMonth() !== parts.month - 1 ||
    date.getUTCDate() !== parts.day ||
    date.getUTCHours() !== parts.hour ||
    date.getUTCMinutes() !== parts.minute ||
    date.getUTCSeconds() !== parts.second ||
    date.getUTCMilliseconds() !== parts.millisecond
  ) {
    throw new RangeError("The date contains invalid calendar values.");
  }

  return date.getTime();
}

export function parseWallClock(iso: string): number {
  const match = iso.match(WALL_CLOCK_PATTERN);

  if (!match) {
    throw new TypeError(
      "Wall-clock dates must use YYYY-MM-DDTHH:mm:ss(.SSS) without a timezone.",
    );
  }

  return wallClockTimestamp(partsFromMatch(match));
}

export function parseAbsolute(iso: string): number {
  const match = iso.match(ABSOLUTE_PATTERN);

  if (!match) {
    throw new TypeError(
      "Absolute dates must include Z or an explicit numeric timezone offset.",
    );
  }

  wallClockTimestamp(partsFromMatch(match));
  const timestamp = Date.parse(iso);

  if (!Number.isFinite(timestamp)) {
    throw new RangeError("The absolute date is invalid.");
  }

  return timestamp;
}
