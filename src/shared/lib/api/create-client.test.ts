import { z } from "zod";
import { describe, expect, it, vi } from "vitest";

import { createApiClient } from "./create-client";
import { ApiContractError, ApiError } from "./errors";

const userSchema = z.object({ id: z.string(), name: z.string() });

describe("createApiClient", () => {
  it("parses successful responses and query parameters", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ id: "1", name: "Ada" }));
    const client = createApiClient({
      baseUrl: "https://api.example.com/v1",
      fetch: fetchMock,
    });

    await expect(
      client.request("/users", {
        schema: userSchema,
        params: { active: true, tag: ["admin", "staff"], empty: null },
      }),
    ).resolves.toEqual({ id: "1", name: "Ada" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example.com/v1/users?active=true&tag=admin&tag=staff",
    );
    expect(init?.credentials).toBe("same-origin");
  });

  it("adds auth headers while allowing request headers to override them", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));
    const client = createApiClient({
      baseUrl: "https://api.example.com",
      getAuthHeaders: async () => ({ Authorization: "Bearer default" }),
      fetch: fetchMock,
    });

    await client.request("users/1", {
      method: "DELETE",
      schema: z.undefined(),
      headers: { Authorization: "Bearer override" },
    });

    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get("Authorization")).toBe("Bearer override");
  });

  it("throws ApiError with the raw response body", async () => {
    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetch: vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          Response.json(
            { message: "User not found", code: "USER_NOT_FOUND" },
            { status: 404 },
          ),
        ),
    });

    const promise = client.request("users/404", { schema: userSchema });

    await expect(promise).rejects.toMatchObject({
      name: "ApiError",
      message: "User not found",
      status: 404,
      url: "https://api.example.com/users/404",
      body: { message: "User not found", code: "USER_NOT_FOUND" },
    });
  });

  it("preserves non-JSON bodies and uses a status fallback message", async () => {
    const client = createApiClient({
      baseUrl: "https://api.example.com/",
      credentials: "omit",
      fetch: vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          new Response("Gateway unavailable", { status: 502 }),
        ),
    });

    await expect(
      client.request("status", { schema: z.unknown() }),
    ).rejects.toMatchObject({
      message: "API request failed with status 502.",
      body: "Gateway unavailable",
    });
  });

  it("serializes JSON request bodies", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ id: "1", name: "Ada" }));
    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock,
    });

    await client.request("users", {
      method: "POST",
      body: { name: "Ada" },
      schema: userSchema,
    });

    const init = fetchMock.mock.calls[0][1];
    expect(new Headers(init?.headers).get("Content-Type")).toBe(
      "application/json",
    );
    expect(init?.body).toBe('{"name":"Ada"}');
  });

  it("throws ApiContractError for an invalid success payload", async () => {
    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetch: vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({ id: 1, name: "Ada" })),
    });

    const promise = client.request("users/1", { schema: userSchema });

    await expect(promise).rejects.toBeInstanceOf(ApiContractError);
    await expect(promise).rejects.toMatchObject({ status: 200 });
  });

  it("runs the unauthorized hook without hiding the API error", async () => {
    const hookError = new Error("Refresh failed");
    const onUnauthorized = vi.fn().mockRejectedValue(hookError);
    const client = createApiClient({
      baseUrl: "https://api.example.com",
      onUnauthorized,
      fetch: vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          Response.json({ message: "Unauthorized" }, { status: 401 }),
        ),
    });

    const promise = client.request("profile", { schema: userSchema });

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({
      status: 401,
      cause: hookError,
    });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("combines caller abort signals with the configured timeout", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          if (init?.signal?.aborted) {
            reject(init.signal.reason);
            return;
          }

          init?.signal?.addEventListener(
            "abort",
            () => reject(init.signal?.reason),
            { once: true },
          );
        }),
    );
    const client = createApiClient({
      baseUrl: "https://api.example.com",
      timeoutMs: 5,
      fetch: fetchMock,
    });

    await expect(
      client.request("slow", { schema: z.unknown() }),
    ).rejects.toHaveProperty("name", "TimeoutError");

    const controller = new AbortController();
    controller.abort(new DOMException("Cancelled", "AbortError"));
    await expect(
      client.request("cancelled", {
        schema: z.unknown(),
        signal: controller.signal,
      }),
    ).rejects.toHaveProperty("name", "AbortError");
  });

  it("preserves network errors and rejects absolute request URLs", async () => {
    const networkError = new TypeError("Network unavailable");
    const client = createApiClient({
      baseUrl: "https://api.example.com",
      fetch: vi.fn<typeof fetch>().mockRejectedValue(networkError),
    });

    await expect(client.request("users", { schema: userSchema })).rejects.toBe(
      networkError,
    );
    await expect(
      client.request("https://malicious.example/users", { schema: userSchema }),
    ).rejects.toThrow("relative URLs");
  });
});
