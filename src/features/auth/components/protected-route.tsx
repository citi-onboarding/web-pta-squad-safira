import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSessao } from "../queries/session-query";
import { SIGN_IN_FAILURE_MESSAGE } from "../types/auth-messages";

export function ProtectedRoute() {
  const location = useLocation();
  const session = useSessao();

  if (session.isPending) {
    return <p role="status">Carregando...</p>;
  }

  if (session.isError) {
    return <p role="alert">{SIGN_IN_FAILURE_MESSAGE}</p>;
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
