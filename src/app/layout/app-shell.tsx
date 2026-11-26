import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useSessao } from "@/features/auth/queries/session-query";
import { useSignOut } from "@/features/auth/queries/sign-out-mutation";
import { menuByRole } from "@/features/auth/types/role-access";

export function AppShell() {
  const navigate = useNavigate();
  const session = useSessao();
  const signOut = useSignOut();

  if (!session.data) {
    return null;
  }

  function handleSignOut() {
    signOut.mutate(undefined, {
      onSuccess: () => {
        void navigate("/entrar", { replace: true });
      },
    });
  }

  return (
    <div className="flex min-h-screen">
      <nav className="flex w-56 flex-col gap-2 border-r p-4">
        {menuByRole[session.data.papel].map((entry) => (
          <NavLink key={entry.path} to={entry.path}>
            {entry.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signOut.isPending}
          className="mt-4 border-t pt-2 text-left"
        >
          Sair
        </button>
      </nav>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
