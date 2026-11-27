import { createBrowserApiClient } from "@/shared/lib/api/client";

export function createAuthApiClient() {
  return createBrowserApiClient({ credentials: "include" });
}
