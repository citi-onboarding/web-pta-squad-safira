import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { ApiContractError, ApiError } from "@/shared/lib/api/errors";
import { server } from "@/shared/testing/msw/server";

import { login } from "../api/login";
import { API_URL, createTestClient, sessionsByRole } from "./auth-test-data";

const credentials = { email: "patricia@distrilux.test", senha: "secret" };
const session = sessionsByRole.VENDEDOR;

describe("login", () => {
  it("sends the email and password to the sign-in route and returns the signed-in user", async () => {
    let receivedBody: unknown;
    server.use(
      http.post(`${API_URL}/auth/login`, async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json(session);
      }),
    );

    await expect(login(createTestClient(), credentials)).resolves.toEqual(
      session,
    );
    expect(receivedBody).toEqual(credentials);
  });

  it("rejects with the 401 answer when the back end refuses the credentials", async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () =>
        HttpResponse.json(
          { message: "Invalid email or password." },
          { status: 401 },
        ),
      ),
    );

    const error = await login(createTestClient(), credentials).catch(
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 401 });
  });

  it("rejects a response whose role is outside the contract", async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () =>
        HttpResponse.json({ ...session, papel: "DIRETOR" }),
      ),
    );

    await expect(login(createTestClient(), credentials)).rejects.toBeInstanceOf(
      ApiContractError,
    );
  });
});
