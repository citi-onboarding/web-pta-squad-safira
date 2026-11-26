import type { ApiClient } from "@/shared/lib/api/create-client";
import { ApiError } from "@/shared/lib/api/errors";

import { sessionSchema } from "../types/session";
import type { Session } from "../types/session";

export async function getSession(client: ApiClient): Promise<Session | null> {
  try {
    return await client.request("auth/me", { schema: sessionSchema });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
}
