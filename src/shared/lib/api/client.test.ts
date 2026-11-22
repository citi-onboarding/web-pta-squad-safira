import { z } from "zod";
import { describe, expect, it, vi } from "vitest";

import { createBrowserApiClient } from "./client";

describe("createBrowserApiClient", () => {
  it("uses the validated public API URL by default", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ ok: true }));
    const client = createBrowserApiClient({ fetch: fetchMock });

    await client.request("status", { schema: z.object({ ok: z.boolean() }) });

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      "http://localhost:3001/status",
    );
  });
});
