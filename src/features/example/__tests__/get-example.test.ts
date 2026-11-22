import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { createApiClient } from "@/shared/lib/api/create-client";
import { server } from "@/shared/testing/msw/server";

import { getExamples } from "../api/get-example";

describe("getExamples", () => {
  it("validates data returned by the API", async () => {
    server.use(
      http.get("http://localhost:3001/api/v1/example-items", () =>
        HttpResponse.json([
          {
            id: "0b0f5f7e-5f0e-4a39-9d2c-3f3c5c0e1a11",
            name: "Feature-based architecture",
            description: null,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ]),
      ),
    );
    const client = createApiClient({ baseUrl: "http://localhost:3001" });

    await expect(getExamples(client)).resolves.toMatchObject([
      { name: "Feature-based architecture", description: null },
    ]);
  });
});
