import { env } from "@/shared/lib/env/env";

import { createApiClient } from "./create-client";
import type { ApiClientConfig } from "./create-client";

type BrowserApiClientConfig = Omit<ApiClientConfig, "baseUrl"> & {
  baseUrl?: string;
};

export function createBrowserApiClient(config: BrowserApiClientConfig = {}) {
  return createApiClient({
    ...config,
    baseUrl: config.baseUrl ?? env.VITE_API_URL,
  });
}
