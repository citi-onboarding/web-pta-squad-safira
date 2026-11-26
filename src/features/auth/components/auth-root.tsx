import { useState } from "react";
import { Outlet } from "react-router-dom";

import { createAuthApiClient } from "../api/auth-api-client";
import { AuthApiClientProvider } from "./auth-api-client-provider";

// Creates the credentialed API client once, when the routes mount, and gives
// it to every route below.
export function AuthRoot() {
  const [client] = useState(createAuthApiClient);

  return (
    <AuthApiClientProvider client={client}>
      <Outlet />
    </AuthApiClientProvider>
  );
}
