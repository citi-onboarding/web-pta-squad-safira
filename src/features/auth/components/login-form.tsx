import { useState } from "react";
import type { FormEvent } from "react";

import { Banner } from "@/shared/components/ui/banner";
import { Button } from "@/shared/components/ui/button";
import { TextField } from "@/shared/components/ui/text-field";
import { ApiError } from "@/shared/lib/api/errors";

import { useSignIn } from "../queries/sign-in-mutation";
import type { Session } from "../types/session";
import { DemoControls } from "./demo-controls";
import type { SimulatedState } from "./demo-controls";

type LoginFormProps = {
  onSignedIn: (session: Session) => void;
  // Shows the prototype controls (demo builds only).
  demoMode?: boolean;
};

export function LoginForm({ onSignedIn, demoMode = false }: LoginFormProps) {
  const signIn = useSignIn();
  const [simulated, setSimulated] = useState<SimulatedState>("normal");
  const credentialsRejected =
    signIn.error instanceof ApiError && signIn.error.status === 401;
  const showError =
    simulated === "error" || (simulated === "normal" && credentialsRejected);
  const pending = simulated === "pending" || signIn.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending || simulated !== "normal") {
      return;
    }

    const data = new FormData(event.currentTarget);
    signIn.mutate(
      {
        email: String(data.get("email")),
        senha: String(data.get("senha")),
      },
      { onSuccess: (session) => onSignedIn(session) },
    );
  }

  function handleSimulate(state: SimulatedState) {
    signIn.reset();
    setSimulated(state);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-title-1 font-bold">Entrar no portal</h1>
        <p className="text-muted">Use o e-mail e a senha da DistriLux.</p>
      </div>

      {showError ? (
        // Never says which of the two was wrong (US-001).
        <Banner tone="error">E-mail ou senha incorretos.</Banner>
      ) : null}

      <TextField
        label="E-mail"
        name="email"
        type="email"
        placeholder="nome@distrilux.com.br"
        autoComplete="username"
        required
        invalid={showError}
      />
      <TextField
        label="Senha"
        name="senha"
        type="password"
        autoComplete="current-password"
        required
        invalid={showError}
      />

      <Button type="submit" loading={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>

      {demoMode ? (
        <DemoControls state={simulated} onChange={handleSimulate} />
      ) : null}
    </form>
  );
}
