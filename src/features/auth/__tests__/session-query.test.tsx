import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/shared/testing/msw/server";

import { useSessao } from "../queries/session-query";
import { API_URL, sessionsByRole } from "./auth-test-data";
import { renderHookWithAuth } from "./render-with-auth";

describe("useSessao", () => {
  it("returns the signed-in user", async () => {
    server.use(
      http.get(`${API_URL}/auth/me`, () =>
        HttpResponse.json(sessionsByRole.FINANCEIRO),
      ),
    );

    const { result } = renderHookWithAuth(() => useSessao());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(sessionsByRole.FINANCEIRO);
  });

  it("treats a 401 answer as no session, without an error and without retrying", async () => {
    let requests = 0;
    server.use(
      http.get(`${API_URL}/auth/me`, () => {
        requests += 1;
        return HttpResponse.json(
          { message: "Authentication required." },
          { status: 401 },
        );
      }),
    );

    const { result } = renderHookWithAuth(() => useSessao());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(requests).toBe(1);
  });
});
