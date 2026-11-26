import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSessao } from "../queries/session-query";

export function ProtectedRoute() {
  const location = useLocation();
  const session = useSessao();

  if (session.isPending) {
    return null;
  }

  if (!session.data) {
    return (
      <Navigate
        to="/entrar"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
