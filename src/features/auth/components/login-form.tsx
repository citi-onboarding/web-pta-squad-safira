import { useId } from "react";
import type { FormEvent } from "react";

import { ApiError } from "@/shared/lib/api/errors";

import { useSignIn } from "../queries/sign-in-mutation";
import type { Session } from "../types/session";

type LoginFormProps = {
  onSignedIn: (session: Session) => void;
};

export function LoginForm({ onSignedIn }: LoginFormProps) {
  const emailId = useId();
  const passwordId = useId();
  const signIn = useSignIn();
  const credentialsRejected =
    signIn.error instanceof ApiError && signIn.error.status === 401;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (signIn.isPending) {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded border p-6"
    >
      <p className="text-center text-lg font-bold">DistriLux</p>
      <h1 className="text-center text-xl font-semibold">Entrar no portal</h1>
      <p className="text-center text-sm">
        Use o e-mail e a senha da DistriLux.
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor={emailId}>E-mail</label>
        <input
          id={emailId}
          name="email"
          type="email"
          placeholder="nome@distrilux.com.br"
          autoComplete="username"
          required
          className="rounded border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={passwordId}>Senha</label>
        <input
          id={passwordId}
          name="senha"
          type="password"
          autoComplete="current-password"
          required
          className="rounded border px-3 py-2"
        />
      </div>

      {credentialsRejected ? (
        <p role="alert" className="text-sm text-red-700">
          E-mail ou senha incorretos
        </p>
      ) : null}

      <button
        type="submit"
        disabled={signIn.isPending}
        aria-busy={signIn.isPending}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-60"
      >
        Entrar
      </button>
    </form>
  );
}
