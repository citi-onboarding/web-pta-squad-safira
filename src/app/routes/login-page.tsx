import { useLocation, useNavigate } from "react-router-dom";

import { LoginForm } from "@/features/auth/components/login-form";
import { initialPathFor } from "@/features/auth/types/role-access";
import type { Session } from "@/features/auth/types/session";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string } | null;

  function handleSignedIn(session: Session) {
    const requested = state?.from;
    const target =
      requested && requested !== "/entrar"
        ? requested
        : initialPathFor(session.papel);

    void navigate(target, { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <LoginForm onSignedIn={handleSignedIn} />
    </main>
  );
}
