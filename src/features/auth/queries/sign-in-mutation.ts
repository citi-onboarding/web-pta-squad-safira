import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "../api/login";
import { useAuthApiClient } from "../components/auth-api-client-context";
import type { Credentials } from "../types/session";
import { sessionQueryKey } from "./session-query";

export function useSignIn() {
  const client = useAuthApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Credentials) => login(client, credentials),
    onSuccess: (session) => {
      queryClient.setQueryData(sessionQueryKey, session);
    },
  });
}
