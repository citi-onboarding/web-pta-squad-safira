import { LogOut } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useSessao } from "@/features/auth/queries/session-query";
import { useSignOut } from "@/features/auth/queries/sign-out-mutation";
import { menuByRole } from "@/features/auth/types/role-access";
import type { Role } from "@/features/auth/types/session";
import logo from "@/shared/assets/brand/logo-horizontal.svg";
import { SelectField } from "@/shared/components/ui/select-field";
import { ThemeSwitch } from "@/shared/components/ui/theme-switch";
import { cn } from "@/shared/lib/cn";

const ROLE_LABELS: Record<Role, string> = {
  VENDEDOR: "Vendedor",
  GERENTE: "Gerente comercial",
  FINANCEIRO: "Financeiro",
  ADMINISTRADOR: "Administrador (TI)",
};

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSessao();
  const signOut = useSignOut();

  if (!session.data) {
    return null;
  }

  const menu = menuByRole[session.data.papel];
  const current =
    menu.find((entry) => entry.path === location.pathname)?.path ??
    menu[0].path;

  function handleSignOut() {
    signOut.mutate(undefined, {
      onSuccess: () => {
        void navigate("/entrar", { replace: true });
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between gap-4 border-b bg-surface px-4 md:px-6">
        {/* The logo follows the theme color through a mask (DESIGN.md, "Logo"). */}
        <span
          role="img"
          aria-label="DistriLux"
          className="block aspect-[762/87] w-40 shrink-0 bg-foreground"
          style={{
            maskImage: `url(${logo})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskImage: `url(${logo})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
        {/* The ERP sync indicator goes here once there is sync data (BACK-04). */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex min-w-0 flex-col items-end leading-tight">
            <span className="max-w-full truncate text-body font-semibold">
              {session.data.nome}
            </span>
            <span className="max-w-full truncate text-caption text-muted">
              {ROLE_LABELS[session.data.papel]}
            </span>
          </div>
          <ThemeSwitch />
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <nav
          aria-label="Menu"
          className="flex items-end gap-3 border-b bg-surface px-4 py-3 md:w-60 md:flex-col md:items-stretch md:border-r md:border-b-0 md:px-3 md:py-5"
        >
          <SelectField
            label="Ir para"
            hideLabel
            options={menu.map((entry) => ({
              value: entry.path,
              label: entry.label,
            }))}
            value={current}
            onChange={(event) => void navigate(event.target.value)}
            className="flex-1 md:hidden"
          />
          <ul className="hidden flex-col gap-1 md:flex">
            {menu.map((entry) => (
              <li key={entry.path}>
                <NavLink
                  to={entry.path}
                  className={({ isActive }) =>
                    cn(
                      "flex h-10 items-center rounded-tile px-3 font-medium text-muted transition-colors hover:bg-highlight/40 hover:text-foreground",
                      isActive &&
                        "bg-highlight font-semibold text-highlight-fg hover:bg-highlight hover:text-highlight-fg",
                    )
                  }
                >
                  {entry.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* The divider lives on the wrapper so the button text stays centered. */}
          <div className="shrink-0 md:mt-auto md:border-t md:pt-3">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signOut.isPending}
              className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-tile px-3 font-medium text-muted transition-colors hover:bg-highlight/40 hover:text-foreground disabled:cursor-not-allowed disabled:text-disabled-fg disabled:hover:bg-transparent md:h-10"
            >
              <LogOut aria-hidden="true" className="size-4" />
              Sair
            </button>
          </div>
        </nav>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
