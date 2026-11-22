import { describe, expect, it } from "vitest";

import { env } from "./env";
import { parseEnvironment } from "./schema";

describe("environment", () => {
  it("uses safe public defaults", () => {
    expect(env.VITE_API_URL).toBe("http://localhost:3001");
    expect(parseEnvironment({})).toEqual({
      VITE_APP_NAME: "Vite Boilerplate",
      VITE_APP_URL: "http://localhost:5173",
      VITE_API_URL: "http://localhost:3001",
    });
  });

  it("accepts explicit public values", () => {
    expect(
      parseEnvironment({
        VITE_APP_NAME: "Operations Console",
        VITE_APP_URL: "https://app.example.com",
        VITE_API_URL: "https://api.example.com",
      }),
    ).toEqual({
      VITE_APP_NAME: "Operations Console",
      VITE_APP_URL: "https://app.example.com",
      VITE_API_URL: "https://api.example.com",
    });
  });

  it("rejects invalid public values", () => {
    expect(() => parseEnvironment({ VITE_API_URL: "not-a-url" })).toThrow(
      "Invalid environment variables",
    );
  });
});
