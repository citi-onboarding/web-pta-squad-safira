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

type FieldErrors = { email?: string; senha?: string };

// A simple shape check; the back end decides whether the account exists.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The portal checks the fields itself instead of the browser's balloon,
// which cannot be styled and looks different in every browser.
function checkFields(email: string, senha: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Preencha o e-mail.";
  } else if (!EMAIL_SHAPE.test(email.trim())) {
    errors.email = "Digite um e-mail válido, como nome@distrilux.com.br.";
  }
  if (!senha) {
    errors.senha = "Preencha a senha.";
  }

  return errors;
}

type LoginFormProps = {
  onSignedIn: (session: Session) => void;
  // Shows the prototype controls (demo builds only).
  demoMode?: boolean;
};

export function LoginForm({ onSignedIn, demoMode = false }: LoginFormProps) {
  const signIn = useSignIn();
  const [simulated, setSimulated] = useState<SimulatedState>("normal");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
    const email = String(data.get("email") ?? "");
    const senha = String(data.get("senha") ?? "");
    const errors = checkFields(email, senha);
    setFieldErrors(errors);

    if (errors.email || errors.senha) {
      signIn.reset();
      return;
    }

    signIn.mutate(
      { email: email.trim(), senha },
      { onSuccess: (session) => onSignedIn(session) },
    );
  }

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  }

  function handleSimulate(state: SimulatedState) {
    signIn.reset();
    setFieldErrors({});
    setSimulated(state);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <div className="mb-4 flex flex-col gap-1.5">
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
        error={fieldErrors.email}
        onChange={() => clearFieldError("email")}
      />
      <TextField
        label="Senha"
        name="senha"
        type="password"
        autoComplete="current-password"
        required
        invalid={showError}
        error={fieldErrors.senha}
        onChange={() => clearFieldError("senha")}
      />

      <Button type="submit" loading={pending} className="mt-2">
        {pending ? "Entrando…" : "Entrar"}
      </Button>

      {demoMode ? (
        <DemoControls state={simulated} onChange={handleSimulate} />
      ) : null}
    </form>
  );
}
