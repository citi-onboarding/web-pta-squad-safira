import { z } from "zod";

import { ApiContractError, ApiError } from "./errors";

const DEFAULT_TIMEOUT_MS = 10_000;

type QueryValue = string | number | boolean;

export type ApiClientConfig = {
  baseUrl: string;
  timeoutMs?: number;
  credentials?: RequestCredentials;
  getAuthHeaders?: () => HeadersInit | Promise<HeadersInit>;
  onUnauthorized?: (response: Response) => void | Promise<void>;
  fetch?: typeof globalThis.fetch;
};

export type RequestOptions<TSchema extends z.ZodType> = Omit<
  RequestInit,
  "body" | "credentials" | "signal"
> & {
  schema: TSchema;
  body?: unknown;
  params?: Record<
    string,
    QueryValue | readonly QueryValue[] | null | undefined
  >;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export type ApiClient = {
  request<TSchema extends z.ZodType>(
    path: string,
    options: RequestOptions<TSchema>,
  ): Promise<z.output<TSchema>>;
};

function createUrl(
  baseUrl: URL,
  path: string,
  params: RequestOptions<z.ZodType>["params"],
) {
  if (!path || path.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(path)) {
    throw new TypeError("API request paths must be relative URLs.");
  }

  const url = new URL(path.replace(/^\/+/, ""), baseUrl);

  for (const [key, rawValue] of Object.entries(params ?? {})) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    for (const value of values) {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    }
  }

  return url;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function errorMessage(response: Response, body: unknown): string {
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }

  return (
    response.statusText || `API request failed with status ${response.status}.`
  );
}

function createRequestSignal(
  signal: AbortSignal | undefined,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const abortFromCaller = () => controller.abort(signal?.reason);
  const timeout = setTimeout(
    () =>
      controller.abort(
        new DOMException(
          `API request timed out after ${timeoutMs} milliseconds.`,
          "TimeoutError",
        ),
      ),
    timeoutMs,
  );

  if (signal?.aborted) {
    abortFromCaller();
  } else {
    signal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup() {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abortFromCaller);
    },
  };
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const baseUrl = new URL(
    config.baseUrl.endsWith("/") ? config.baseUrl : `${config.baseUrl}/`,
  );
  const fetchImplementation = config.fetch ?? globalThis.fetch.bind(globalThis);

  return {
    async request<TSchema extends z.ZodType>(
      path: string,
      options: RequestOptions<TSchema>,
    ): Promise<z.output<TSchema>> {
      const {
        schema,
        body,
        params,
        signal,
        timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        headers: requestHeaders,
        ...requestInit
      } = options;
      const url = createUrl(baseUrl, path, params);
      const headers = new Headers(await config.getAuthHeaders?.());

      new Headers(requestHeaders).forEach((value, key) =>
        headers.set(key, value),
      );

      if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
      }

      if (body !== undefined && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const requestSignal = createRequestSignal(signal, timeoutMs);
      let response: Response;

      try {
        response = await fetchImplementation(url, {
          ...requestInit,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          credentials: config.credentials ?? "same-origin",
          signal: requestSignal.signal,
        });
      } finally {
        requestSignal.cleanup();
      }
      const unauthorizedResponse =
        response.status === 401 ? response.clone() : null;
      const responseBody = await readResponseBody(response);
      let unauthorizedCause: unknown;

      if (unauthorizedResponse && config.onUnauthorized) {
        try {
          await config.onUnauthorized(unauthorizedResponse);
        } catch (error) {
          unauthorizedCause = error;
        }
      }

      if (!response.ok) {
        throw new ApiError(errorMessage(response, responseBody), {
          status: response.status,
          url: url.toString(),
          body: responseBody,
          cause: unauthorizedCause,
        });
      }

      const parsedBody = schema.safeParse(responseBody);

      if (!parsedBody.success) {
        throw new ApiContractError("API response did not match its contract.", {
          status: response.status,
          url: url.toString(),
          body: responseBody,
          issues: parsedBody.error.issues,
        });
      }

      return parsedBody.data;
    },
  };
}
