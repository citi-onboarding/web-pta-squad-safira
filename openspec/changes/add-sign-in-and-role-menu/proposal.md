## Why

The portal has no entry point: nobody can sign in, and no page knows who the user is or what their role allows. This change delivers the sign-in screen, the session awareness, the role-based menu, and the protected routes that every authenticated screen (FRONT-03 onwards) depends on. It consumes the authentication API already delivered by BACK-01.

## What Changes

- Add the sign-in screen (US-001): logo, email and password fields, a "Entrar" button with a loading state, and an inline credential error.
- Read the current session from the back end (`GET /auth/me`) and treat "no session" as a normal state, not as an error.
- Protect authenticated routes: without a session the user is sent to the sign-in screen and, after signing in, returns to the page originally requested.
- Send each role to its own initial page after sign-in when no page was requested.
- Show a menu that lists only the entries the signed-in role may use.
- Show "Você não tem acesso a esta página" instead of the page when the role may not open a route.
- Add a "Sair" action that ends the session in the back end and discards every cached server response, so the browser back button shows no data.
- Send the session cookie on API calls: the front end (`localhost:5173`) and the API (`localhost:3001`) are on different origins, so browser API calls must include credentials.
- Replace the boilerplate home page and update its end-to-end test.

### In scope

- Roles and menu entries exactly as stated in FRONT-01:
  - VENDEDOR: Clientes, Meus pedidos.
  - GERENTE: Painel.
  - FINANCEIRO: Fila.
  - ADMINISTRADOR: Usuários.
- Unit tests (Vitest, Testing Library, MSW) for the form, role redirection, and protected routes.
- Playwright + axe tests with API responses simulated in the browser (`page.route`).

### Out of scope

- The prototype's "Ver como" button (demonstration only, per FRONT-01).
- Menu entries in the prototype that belong to later tasks.
- The real destination screens (Clientes = FRONT-03, Painel = FRONT-07, Usuários = FRONT-12, Sincronização = FRONT-11, Fila = FRONT-16).
- The team design system (FRONT-02); visuals stay simple until then.
- Any change to the back-end API.

### Open questions (waiting for the squad manager)

1. Initial page of ADMINISTRADOR: FRONT-01 says "Usuários" in one place and "TI para a sincronização" in another; the prototype opens on "Usuários". Provisionally "Usuários" until answered.
2. Whether temporary placeholder pages may stand in for destination screens that do not exist yet. Provisionally, each destination is a page showing only its title, to be replaced by the task that owns it.
3. What a signed-in user sees when opening the sign-in screen. Not specified until answered.
4. What the sign-in screen shows when the back end is unreachable or answers with an error other than 401. Not specified until answered.

### Decisions already taken

- Texts follow the prototype ("Entrar no portal", "Painel do comercial", "Fila do financeiro"), restricted to the menu entries listed in FRONT-01.
- Empty fields are blocked by the browser's required-field validation; no new message is introduced.
- The session cookie is enabled inside the `auth` feature; shared code in `src/shared` is not changed.
- Page addresses follow the prototype: `/entrar`, `/clientes`, `/pedidos`, `/painel`, `/fila`, `/usuarios`; `/` leads to the role's initial page.

## Capabilities

### New Capabilities

- `auth`: signing in, reading the current session, signing out, role-based navigation, and access denial for routes outside the signed-in role.

### Modified Capabilities

None.

## Impact

- **Business**: unblocks FRONT-03 and every authenticated screen; the four seeded users (one per role) must sign in and see the correct menu.
- **Security**: the session lives only in the HttpOnly cookie set by the back end; the front end never stores tokens. The credential error never reveals whether the email or the password was wrong. Signing out clears the query cache so no previous user's data remains in memory.
- **API contract**: consumes `POST /auth/login` (`{ email, senha }` → `{ id, nome, papel }`, 401 on bad credentials), `GET /auth/me` (`{ id, nome, papel }`, 401 without session), and `POST /auth/logout` (204), as published in the BACK-01 `openapi.json`. No contract change.
- **Code**: new `src/features/auth/`; new `src/app/layout/app-shell.tsx` and `src/app/routes/login-page.tsx`; changes to `src/app/router.tsx`; the `auth` feature creates its API client with `credentials: "include"` (no change to `src/shared`); `e2e/` gains sign-in tests and the home-page test changes.
- **Dependencies**: none new.
