import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { server } from "@/shared/testing/msw/server";

import { LoginForm } from "../components/login-form";
import { sessionQueryKey } from "../queries/session-query";
import { API_URL, sessionsByRole } from "./auth-test-data";
import { renderWithAuth } from "./render-with-auth";

const EMAIL = "patricia@distrilux.test";
const PASSWORD = "secret";

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();

  if (email) {
    await user.type(screen.getByLabelText("E-mail"), email);
  }
  if (password) {
    await user.type(screen.getByLabelText("Senha"), password);
  }
  await user.click(screen.getByRole("button", { name: "Entrar" }));

  return user;
}

describe("LoginForm", () => {
  // The logo moved to the brand panel of the sign-in page (FRONT-02).
  it("shows the title, text, both fields, and the Entrar button", () => {
    renderWithAuth(<LoginForm onSignedIn={vi.fn()} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Entrar no portal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Use o e-mail e a senha da DistriLux."),
    ).toBeInTheDocument();

    const email = screen.getByLabelText("E-mail");
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("placeholder", "nome@distrilux.com.br");
    expect(email).toBeRequired();

    const password = screen.getByLabelText("Senha");
    expect(password).toHaveAttribute("type", "password");
    expect(password).toBeRequired();

    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
  });

  it.each([
    ["the email", "", PASSWORD],
    ["the password", EMAIL, ""],
  ])(
    "does not send a sign-in request when %s is empty",
    async (_field, email, password) => {
      let requests = 0;
      server.use(
        http.post(`${API_URL}/auth/login`, () => {
          requests += 1;
          return HttpResponse.json(sessionsByRole.VENDEDOR);
        }),
      );
      renderWithAuth(<LoginForm onSignedIn={vi.fn()} />);

      await fillAndSubmit(email, password);

      expect(requests).toBe(0);
    },
  );

  it("shows the in-progress state and accepts no second submission while waiting", async () => {
    let requests = 0;
    let answer: () => void = () => undefined;
    server.use(
      http.post(`${API_URL}/auth/login`, async () => {
        requests += 1;
        await new Promise<void>((resolve) => {
          answer = resolve;
        });
        return HttpResponse.json(sessionsByRole.VENDEDOR);
      }),
    );
    renderWithAuth(<LoginForm onSignedIn={vi.fn()} />);

    const user = await fillAndSubmit(EMAIL, PASSWORD);

    const button = await screen.findByRole("button", { name: "Entrando…" });
    await waitFor(() => expect(button).toBeDisabled());
    expect(button).toHaveAttribute("aria-busy", "true");

    await user.click(button);
    expect(requests).toBe(1);

    answer();
  });

  it("shows the credential error without saying which field was wrong", async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () =>
        HttpResponse.json(
          { message: "Invalid email or password." },
          { status: 401 },
        ),
      ),
    );
    const onSignedIn = vi.fn();
    renderWithAuth(<LoginForm onSignedIn={onSignedIn} />);

    await fillAndSubmit(EMAIL, "wrong");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "E-mail ou senha incorretos.",
    );
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByLabelText("E-mail")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Senha")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
    expect(onSignedIn).not.toHaveBeenCalled();
  });

  it("keeps the signed-in user as the current session and notifies the page", async () => {
    let receivedBody: unknown;
    server.use(
      http.post(`${API_URL}/auth/login`, async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json(sessionsByRole.VENDEDOR);
      }),
    );
    const onSignedIn = vi.fn();
    const { queryClient } = renderWithAuth(
      <LoginForm onSignedIn={onSignedIn} />,
    );

    await fillAndSubmit(EMAIL, PASSWORD);

    await waitFor(() =>
      expect(onSignedIn).toHaveBeenCalledWith(sessionsByRole.VENDEDOR),
    );
    expect(receivedBody).toEqual({ email: EMAIL, senha: PASSWORD });
    expect(queryClient.getQueryData(sessionQueryKey)).toEqual(
      sessionsByRole.VENDEDOR,
    );
  });

  it("discards responses kept from a previous session when a sign-in succeeds", async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () =>
        HttpResponse.json(sessionsByRole.VENDEDOR),
      ),
    );
    const onSignedIn = vi.fn();
    const { queryClient } = renderWithAuth(
      <LoginForm onSignedIn={onSignedIn} />,
    );
    const previousKey = ["previous-user-data"];
    queryClient.setQueryData(previousKey, { owner: "previous user" });

    await fillAndSubmit(EMAIL, PASSWORD);

    await waitFor(() => expect(onSignedIn).toHaveBeenCalled());
    expect(queryClient.getQueryData(previousKey)).toBeUndefined();
    expect(queryClient.getQueryData(sessionQueryKey)).toEqual(
      sessionsByRole.VENDEDOR,
    );
  });
});

describe("LoginForm in demo mode", () => {
  it("shows no prototype controls outside demo mode", () => {
    renderWithAuth(<LoginForm onSignedIn={vi.fn()} />);

    expect(
      screen.queryByRole("group", { name: "Simular" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Atalhos do protótipo")).not.toBeInTheDocument();
  });

  it("shows the Simular controls in demo mode", () => {
    renderWithAuth(<LoginForm onSignedIn={vi.fn()} demoMode />);

    const simulate = screen.getByRole("group", { name: "Simular" });
    expect(
      within(simulate)
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual(["Normal", "Erro", "Entrando"]);
  });

  it("shows the credential error state without calling the back end", async () => {
    let requests = 0;
    server.use(
      http.post(`${API_URL}/auth/login`, () => {
        requests += 1;
        return HttpResponse.json(sessionsByRole.VENDEDOR);
      }),
    );
    renderWithAuth(<LoginForm onSignedIn={vi.fn()} demoMode />);
    const user = userEvent.setup();
    const simulate = screen.getByRole("group", { name: "Simular" });

    await user.click(within(simulate).getByRole("button", { name: "Erro" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "E-mail ou senha incorretos.",
    );
    expect(screen.getByLabelText("E-mail")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(requests).toBe(0);

    await user.click(within(simulate).getByRole("button", { name: "Normal" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the signing-in state without calling the back end", async () => {
    renderWithAuth(<LoginForm onSignedIn={vi.fn()} demoMode />);
    const simulate = screen.getByRole("group", { name: "Simular" });

    await userEvent
      .setup()
      .click(within(simulate).getByRole("button", { name: "Entrando" }));

    expect(screen.getByRole("button", { name: "Entrando…" })).toBeDisabled();
  });
});
