---
change_id: add-sign-in-and-role-menu
date: 2026-11-25
status: in-progress
owners: [Luana Allatta Guerra]
tags: [auth, routing, front-01]
related_adrs: []
openspec_change: openspec/changes/add-sign-in-and-role-menu/
---

# Sign-in screen, role menu, and protected routes (FRONT-01)

## Objective

Give the portal its entry point: staff sign in with email and password, each role sees only its own menu and initial page, and pages outside a session or a role are not shown. It consumes the BACK-01 authentication API and unblocks FRONT-03 and every authenticated screen.

## Change made

- New `src/features/auth/` feature:
  - `types/session.ts`: Zod schemas for the role, the session (`{ id, nome, papel }`), and the credentials (`{ email, senha }`), copied from the BACK-01 `openapi.json`.
  - `api/login.ts`, `api/get-session.ts` (a 401 becomes `null`), `api/logout.ts`, and `api/auth-api-client.ts` (`credentials: "include"`, so the session cookie travels between `localhost:5173` and `localhost:3001`).
  - `queries/session-query.ts` (`useSessao`, key `["auth", "session"]`, no retry), `queries/sign-in-mutation.ts` (on success, clears the whole query cache and then keeps the new user), and `queries/sign-out-mutation.ts` (logs out, then clears the whole query cache).
  - `types/role-access.ts`: one table with each role's menu entries; the first entry is the initial page, and the entries are the only addresses the role may open.
  - `components/`: `login-form.tsx`, `protected-route.tsx`, `role-route.tsx`, `access-denied.tsx`, `auth-root.tsx`, and the API client context and provider.
- New in `src/app/`: `routes/login-page.tsx`, `layout/app-shell.tsx`, and five placeholder pages (`clients-page.tsx`, `my-orders-page.tsx`, `sales-dashboard-page.tsx`, `finance-queue-page.tsx`, `users-page.tsx`) that show only their title.
- `src/app/router.tsx` gains `/entrar` and the protected routes; after the PR #10 review, `/` is a protected route that redirects to the role's initial page (`components/role-home-redirect.tsx`). `*` and the error page are unchanged.
- After the PR #10 review, other failures show "Não foi possível entrar. Tente novamente." (constant in `types/auth-messages.ts`) on the sign-in screen and on protected pages, protected pages show "Carregando..." while the session is checked, and a failed "Sair" shows "Não foi possível sair. Tente novamente.".
- `auth-root.tsx` listens to `pageshow`: when the browser restores a page from its back/forward cache, the kept session is reset, so the page hides and the back end is asked again. The manual check against the real back end found this case; automated browsers disable that cache by default.

## Resulting behavior

- `/entrar` shows the logo, "Entrar no portal", "Use o e-mail e a senha da DistriLux.", the required "E-mail" and "Senha" fields, and the "Entrar" button.
- A successful sign-in discards every response kept from before it, so data from a session that ended without "Sair" (expired, or another person on the same browser) is never shown.
- While signing in, the button is disabled and marked busy; a 401 shows "E-mail ou senha incorretos" without saying which field was wrong; any other failure (another error status or no connection) shows "Não foi possível entrar. Tente novamente.".
- Protected pages show "Carregando..." while the session is checked; if the check fails for a reason other than "no session", they show "Não foi possível entrar. Tente novamente." instead of the page.
- `/` leads to the role's initial page, or to `/entrar` without a session.
- If "Sair" fails, the user stays on the page and sees "Não foi possível sair. Tente novamente.".
- After signing in, the user goes to the page requested before signing in or, if none, to the role's initial page: VENDEDOR → Clientes, GERENTE → Painel do comercial, FINANCEIRO → Fila do financeiro, ADMINISTRADOR → Usuários (provisional).
- The menu lists only the role's entries and "Sair".
- Without a session, every protected page sends the visitor to `/entrar`; a page outside the role shows "Você não tem acesso a esta página".
- "Sair" ends the session in the back end, clears every cached response, and shows `/entrar`; going back in the browser, including to a page restored from the browser cache, shows the sign-in screen and no data.

## Impact

- Consumes `POST /auth/login`, `GET /auth/me`, and `POST /auth/logout` from BACK-01 without changing the contract. The BACK-01 back end must allow CORS with credentials from the front-end origin (it does for `http://localhost:5173`).
- Features that call authenticated routes later also need a client with `credentials: "include"`; today only `auth` creates one (open question 5 below).
- Placeholder pages and the administrator's initial page are provisional; the tasks that own each screen replace them.
- Boilerplate files: `providers.tsx`, `home-page.tsx`, `nginx.conf`, and `playwright.config.ts` are unchanged; `home-page.tsx` is no longer routed. Three boilerplate tests that asserted the example home page were updated only in that assertion: `src/app/router.test.tsx` and `src/app/providers.test.tsx` now expect the sign-in screen at `/` without a session, and the first test of `e2e/application.spec.ts` runs axe on `/entrar`.

## Validations executed

Run on 2026-11-25 on branch `feat/loginAndRoleMenu`:

- `pnpm format:check`: all files use Prettier code style.
- `pnpm verify` (typecheck, lint, tests, `openspec validate --all --strict`, skills check): passed; 24 test files, 112 tests; OpenSpec 1 passed, 0 failed.
- `pnpm test:coverage`: 112 tests passed; all files 97.45% statements, 92.37% branches, 97.4% functions, 97.42% lines. The drop comes from the boilerplate `home-page.tsx`, which is no longer routed or tested. Uncovered lines in this change are defensive guards: the missing-provider error in `auth-api-client-context.ts`, the second-submit guard in `login-form.tsx`, the no-session guard in `role-route.tsx`, and the non-restored `pageshow` branch in `auth-root.tsx`.
- `pnpm build`: passed.
- `pnpm test:e2e`: 11 passed (8 sign-in tests with axe, 3 in `application.spec.ts`).
- Manual check against the real BACK-01 back end (branch `feat/authAndUsers`) with the four seeded users: each reached the right initial page and menu; access denied, wrong password, sign-out with one and two browser back presses, and reload all behaved as specified. Screenshots of the error and loading states were captured, to be attached when the pull request is opened.

## Related artifacts

- Proposal: `openspec/changes/add-sign-in-and-role-menu/proposal.md`
- Specification: `openspec/changes/add-sign-in-and-role-menu/specs/auth/spec.md`
- Design: `openspec/changes/add-sign-in-and-role-menu/design.md`
- Tasks: `openspec/changes/add-sign-in-and-role-menu/tasks.md`
- ADR: Not applicable. The decisions are local to the `auth` feature and reversible (the credentialed client and the role table live in the feature; the router only gained routes). Whether the credentialed client becomes shared infrastructure for every feature is still an open question for the squad manager; that decision would warrant an ADR.

## Usage

1. Run the BACK-01 back end (`feat/authAndUsers`) on port 3001 with the seed applied.
2. Run `pnpm dev` in this repository and open `http://localhost:5173/entrar` (use `localhost`, which is the origin the back end allows).
3. Sign in with a seeded user (`patricia`, `fernanda`, `sergio`, or `lucas`, all `@distrilux.test`, password from `SEED_PASSWORD` in the back end `.env`).

## Implementation notes

- Dependency: BACK-01 lives in the back-end repository (pull request #13, still open). This branch is based on `develop` and has no front-end branch to merge.
- Create API clients inside components or tests, never at module load: the client keeps the `fetch` it sees when created, so a module-level client ignores MSW in tests.
- An address is allowed only when it matches a menu entry exactly; a future detail page such as `/clientes/123` needs that rule widened by the task that adds it.
- Visuals are minimal until the design system (FRONT-02).
- Open questions for the squad manager, numbered as in `proposal.md`, with the provisional behavior in parentheses:
  1. Initial page of ADMINISTRADOR: "Usuários" or "Sincronização" (Usuários).
  2. Placeholder destination pages (title only).
  3. Signed-in user opening `/entrar` (the sign-in screen is shown).
  4. Errors other than 401 or no connection (after the PR #10 review: "Não foi possível entrar. Tente novamente." on the sign-in screen and on protected pages, and "Carregando..." while the session is checked).
  5. Credentialed API client as the default for every feature (only in `auth`).
  6. End-to-end tests with the API simulated by `page.route` (done this way).
  7. What `/` should show (after the PR #10 review: the role's initial page, or `/entrar` without a session).
  8. "Sair" failing (after the PR #10 review: the user stays on the page and sees "Não foi possível sair. Tente novamente.").
