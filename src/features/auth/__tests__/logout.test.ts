import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/shared/testing/msw/server";

import { logout } from "../api/logout";
import { API_URL, createTestClient } from "./auth-test-data";

describe("logout", () => {
  it("asks the back end to end the session and accepts the empty 204 answer", async () => {
    let called = false;
    server.use(
      http.post(`${API_URL}/auth/logout`, () => {
        called = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await expect(logout(createTestClient())).resolves.toBeUndefined();
    expect(called).toBe(true);
  });
});
