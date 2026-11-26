import { queryOptions, useQuery } from "@tanstack/react-query";

import type { ApiClient } from "@/shared/lib/api/create-client";

import { getSession } from "../api/get-session";
import { useAuthApiClient } from "../components/auth-api-client-context";

export const sessionQueryKey = ["auth", "session"] as const;

export function sessionQueryOptions(client: ApiClient) {
  return queryOptions({
    queryKey: sessionQueryKey,
    queryFn: () => getSession(client),
    retry: false,
  });
}

export function useSessao() {
  const client = useAuthApiClient();

  return useQuery(sessionQueryOptions(client));
}
