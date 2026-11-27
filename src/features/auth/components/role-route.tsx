import { Outlet, useLocation } from "react-router-dom";

import { useSessao } from "../queries/session-query";
import { canOpen } from "../types/role-access";
import { AccessDenied } from "./access-denied";

export function RoleRoute() {
  const location = useLocation();
  const session = useSessao();

  if (!session.data) {
    return null;
  }

  if (!canOpen(session.data.papel, location.pathname)) {
    return <AccessDenied />;
  }

  return <Outlet />;
}
