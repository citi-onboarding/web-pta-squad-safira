import type { ReactNode } from "react";

import type { ApiClient } from "@/shared/lib/api/create-client";

import { AuthApiClientContext } from "./auth-api-client-context";

type AuthApiClientProviderProps = {
  client: ApiClient;
  children: ReactNode;
};

export function AuthApiClientProvider({
  client,
  children,
}: AuthApiClientProviderProps) {
  return (
    <AuthApiClientContext.Provider value={client}>
      {children}
    </AuthApiClientContext.Provider>
  );
}
