import { useLocation, useNavigate } from "react-router-dom";

import { LoginForm } from "@/features/auth/components/login-form";
import { initialPathFor } from "@/features/auth/types/role-access";
import type { Session } from "@/features/auth/types/session";
import logoLight from "@/shared/assets/brand/logo-horizontal-luz.svg";
import tileWires from "@/shared/assets/brand/azulejo-figura-2x2-fios.svg";
import { ThemeSwitch } from "@/shared/components/ui/theme-switch";
import { env } from "@/shared/lib/env/env";

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
    <div className="grid min-h-screen bg-background md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Brand panel: the same colors in both themes (DESIGN.md). */}
      <aside className="flex bg-brand-panel text-brand-panel-fg">
        <div className="flex flex-1 flex-col justify-between gap-8 px-6 py-8 md:px-10 md:py-12">
          <img
            src={logoLight}
            alt="DistriLux"
            className="h-auto w-40 md:w-48"
          />
          <div className="flex flex-col gap-3">
            <p className="max-w-xs text-title-2 font-bold">
              Portal de pedidos da DistriLux
            </p>
            <p className="max-w-xs text-body text-brand-panel-fg/80">
              Carteira, limite de crédito e pedidos num só lugar, sincronizados
              com o ERP
            </p>
            <p className="mt-6 text-caption text-brand-panel-fg/70">
              DistriLux Materiais Elétricos · Recife
            </p>
          </div>
        </div>
        {/* Decorative tile strip: a CSS background, invisible to screen readers. */}
        <div
          aria-hidden="true"
          className="hidden w-[220px] shrink-0 bg-porcelana lg:block"
        >
          <div
            className="size-full tile-glow"
            style={{
              backgroundImage: `url(${tileWires})`,
              backgroundSize: "220px 220px",
            }}
          />
        </div>
      </aside>

      <main className="relative flex items-center justify-center px-6 py-12 md:px-12">
        <ThemeSwitch className="absolute top-4 right-4" />
        <LoginForm onSignedIn={handleSignedIn} demoMode={env.VITE_DEMO_MODE} />
      </main>
    </div>
  );
}
