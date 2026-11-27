import { http, HttpResponse } from "msw";
import { z } from "zod";
import { describe, expect, it } from "vitest";

import { server } from "@/shared/testing/msw/server";

import { createAuthApiClient } from "../api/auth-api-client";

describe("createAuthApiClient", () => {
  it("sends the session cookie with every request", async () => {
    let credentials: RequestCredentials | undefined;
    server.use(
      http.get("*/auth/me", ({ request }) => {
        credentials = request.credentials;
        return HttpResponse.json({});
      }),
    );

    await createAuthApiClient().request("auth/me", { schema: z.unknown() });

    expect(credentials).toBe("include");
  });
});
