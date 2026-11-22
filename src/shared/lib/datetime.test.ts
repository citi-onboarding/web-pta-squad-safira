import { describe, expect, it } from "vitest";

import { parseAbsolute, parseWallClock } from "./datetime";

describe("parseWallClock", () => {
  it("preserves calendar fields independently of the machine timezone", () => {
    expect(parseWallClock("2024-05-10T12:30:45.12")).toBe(
      Date.UTC(2024, 4, 10, 12, 30, 45, 120),
    );
  });

  it("accepts leap days and rejects invalid calendar values", () => {
    expect(parseWallClock("2024-02-29T00:00:00")).toBe(Date.UTC(2024, 1, 29));
    expect(() => parseWallClock("2023-02-29T00:00:00")).toThrow(RangeError);
    expect(() => parseWallClock("2024-01-01T00:00:00Z")).toThrow(TypeError);
  });
});

describe("parseAbsolute", () => {
  it("converts Z and explicit offsets to Unix milliseconds", () => {
    expect(parseAbsolute("2024-01-01T00:00:00Z")).toBe(Date.UTC(2024, 0, 1));
    expect(parseAbsolute("2024-01-01T00:00:00-03:00")).toBe(
      Date.UTC(2024, 0, 1, 3),
    );
  });

  it("rejects missing offsets and invalid calendar values", () => {
    expect(() => parseAbsolute("2024-01-01T00:00:00")).toThrow(TypeError);
    expect(() => parseAbsolute("2024-02-30T00:00:00Z")).toThrow(RangeError);
    expect(() => parseAbsolute("2024-01-01T00:00:00+99:00")).toThrow(
      "absolute date is invalid",
    );
  });
});
