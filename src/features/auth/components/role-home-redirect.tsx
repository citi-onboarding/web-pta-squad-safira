import { Navigate } from "react-router-dom";

import { useSessao } from "../queries/session-query";
import { initialPathFor } from "../types/role-access";

export function RoleHomeRedirect() {
  const session = useSessao();

  if (!session.data) {
    return null;
  }

  return <Navigate to={initialPathFor(session.data.papel)} replace />;
}
