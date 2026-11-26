import { z } from "zod";

import type { ApiClient } from "@/shared/lib/api/create-client";

export function logout(client: ApiClient) {
  return client.request("auth/logout", {
    method: "POST",
    schema: z.undefined(),
  });
}
