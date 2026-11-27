import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { ApiError } from "@/shared/lib/api/errors";
import { server } from "@/shared/testing/msw/server";

import { getSession } from "../api/get-session";
import { API_URL, createTestClient, sessionsByRole } from "./auth-test-data";

const session = sessionsByRole.GERENTE;

describe("getSession", () => {
  it("returns the signed-in user", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () => HttpResponse.json(session)),
    );

    await expect(getSession(createTestClient())).resolves.toEqual(session);
  });

  it("returns null when there is no session", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () =>
        HttpResponse.json(
          { message: "Authentication required." },
          { status: 401 },
        ),
      ),
    );

    await expect(getSession(createTestClient())).resolves.toBeNull();
  });

  it("keeps any other failure as an error", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () =>
        HttpResponse.json({ message: "Internal error." }, { status: 500 }),
      ),
    );

    const error = await getSession(createTestClient()).catch(
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500 });
  });
});
