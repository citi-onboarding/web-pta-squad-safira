import type { ApiClient } from "@/shared/lib/api/create-client";

import { sessionSchema } from "../types/session";
import type { Credentials } from "../types/session";

export function login(client: ApiClient, credentials: Credentials) {
  return client.request("auth/login", {
    method: "POST",
    body: credentials,
    schema: sessionSchema,
  });
}
