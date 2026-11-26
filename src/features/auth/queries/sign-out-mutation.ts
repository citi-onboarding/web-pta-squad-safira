import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../api/logout";
import { useAuthApiClient } from "../components/auth-api-client-context";

export function useSignOut() {
  const client = useAuthApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(client),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
