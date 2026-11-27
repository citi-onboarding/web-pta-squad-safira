import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { createAuthApiClient } from "../api/auth-api-client";
import { sessionQueryKey } from "../queries/session-query";
import { AuthApiClientProvider } from "./auth-api-client-provider";

// Creates the credentialed API client once, when the routes mount, and gives
// it to every route below.
export function AuthRoot() {
  const [client] = useState(createAuthApiClient);
  const queryClient = useQueryClient();

  useEffect(() => {
    // The browser may show this page again from its back/forward cache after
    // the session ended. Forget the kept session so protected pages hide at
    // once and ask the back end again.
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        void queryClient.resetQueries({ queryKey: sessionQueryKey });
      }
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [queryClient]);

  return (
    <AuthApiClientProvider client={client}>
      <Outlet />
    </AuthApiClientProvider>
  );
}
