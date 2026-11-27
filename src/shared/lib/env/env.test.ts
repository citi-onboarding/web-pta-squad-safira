import { describe, expect, it } from "vitest";

import { env } from "./env";
import { parseEnvironment } from "./schema";

describe("environment", () => {
  it("uses safe public defaults", () => {
    expect(env.VITE_API_URL).toBe("http://localhost:3001");
    expect(parseEnvironment({})).toEqual({
      VITE_APP_NAME: "DistriLux Portal de Pedidos",
      VITE_APP_URL: "http://localhost:5173",
      VITE_API_URL: "http://localhost:3001",
      VITE_DEMO_MODE: false,
    });
  });

  it("accepts explicit public values", () => {
    expect(
      parseEnvironment({
        VITE_APP_NAME: "Operations Console",
        VITE_APP_URL: "https://app.example.com",
        VITE_API_URL: "https://api.example.com",
        VITE_DEMO_MODE: "true",
      }),
    ).toEqual({
      VITE_APP_NAME: "Operations Console",
      VITE_APP_URL: "https://app.example.com",
      VITE_API_URL: "https://api.example.com",
      VITE_DEMO_MODE: true,
    });
  });

  it("keeps demo mode off unless it is explicitly turned on", () => {
    expect(parseEnvironment({ VITE_DEMO_MODE: "false" }).VITE_DEMO_MODE).toBe(
      false,
    );
    expect(parseEnvironment({ VITE_DEMO_MODE: "" }).VITE_DEMO_MODE).toBe(false);
  });

  it("rejects invalid public values", () => {
    expect(() => parseEnvironment({ VITE_API_URL: "not-a-url" })).toThrow(
      "Invalid environment variables",
    );
  });
});
