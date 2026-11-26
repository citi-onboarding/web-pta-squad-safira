import { createContext, useContext } from "react";

import type { ApiClient } from "@/shared/lib/api/create-client";

export const AuthApiClientContext = createContext<ApiClient | null>(null);

export function useAuthApiClient(): ApiClient {
  const client = useContext(AuthApiClientContext);

  if (!client) {
    throw new Error(
      "useAuthApiClient must be used inside AuthApiClientProvider.",
    );
  }

  return client;
}
