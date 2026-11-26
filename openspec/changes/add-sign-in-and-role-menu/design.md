## Context

See `proposal.md` for motivation and scope and `specs/auth/spec.md` for the required behavior.

Current state of the repository (boilerplate only, no feature yet):

- `src/shared/lib/api/create-client.ts` builds an `ApiClient` from a base URL (`VITE_API_URL`, default `http://localhost:3001`). Request paths must be relative. It sends `credentials: "same-origin"` unless the caller passes another value.
- `src/shared/lib/query/create-query-client.ts` creates the TanStack Query client (`retry: 1`, `staleTime: 60_000`).
- `src/app/router.tsx` has a boilerplate home page at `/`; `src/app/router.test.tsx` and `e2e/application.spec.ts` assert its heading.
- Existing files are changed only when FRONT-01 asks for it explicitly or the feature cannot work without it. Only `src/app/router.tsx` meets that bar.
- Unit tests run with MSW and `onUnhandledRequest: "error"`; Playwright runs against `vite preview` with no back end.
- The back end (BACK-01) keeps the session in the HttpOnly cookie `distrilux_session` (SameSite=Lax) and allows CORS with credentials from `http://localhost:5173`.

Constraints from `AGENTS.md`: features never import other features; `src/app` composes routes and providers; components only render; `api/*.ts` functions receive an injected `ApiClient`; API responses are validated with Zod at the feature boundary.

## Goals / Non-Goals

**Goals:**

- One source of truth for "who is signed in": the TanStack Query cache entry of `GET /auth/me`.
- One declarative table that says, per role, which menu entries exist, which addresses they may open, and which page is their initial page, so later tasks only add rows.
- Every requirement scenario covered by a unit test; sign-in, role menu, access denial, and sign-out covered end to end.

**Non-Goals:**

- Final visuals (FRONT-02 design system).
- Real destination screens (placeholders only).
- Handling session expiry while a page is open beyond what the 401 answer of `GET /auth/me` already gives.

## Decisions

### D1. Session cookie through an auth-owned API client

The `auth` feature exposes `createAuthApiClient()`, which calls `createBrowserApiClient({ credentials: "include" })`. `src/app/router.tsx` creates it once and passes it down through a small React context owned by the feature (`AuthApiClientProvider` / `useAuthApiClient`), placed in a pathless root route around the sign-in and protected routes. `src/app/providers.tsx` is not changed. Tests render the same provider with a client built by `createApiClient` against the MSW base URL.

- _Why_: the front end (`:5173`) and the API (`:3001`) are different origins, so the browser only sends the cookie with `include`. The user chose not to change `src/shared`.
- _Rejected_: changing the default in `src/shared/lib/api/create-client.ts` (affects every feature; decision deferred to the squad manager); a module-level singleton imported by components (breaks the injection rule).
- _Trade-off_: the next features that call authenticated routes need a client with credentials too. This is recorded for the squad manager; promoting it to `src/shared` later is a small, separate change.

### D2. Contract types and API functions

- `types/session.ts`: Zod schemas `roleSchema` (`VENDEDOR | GERENTE | FINANCEIRO | ADMINISTRADOR`), `sessionSchema` (`{ id, nome, papel }`), and `credentialsSchema` (`{ email, senha }`), copied from the BACK-01 `openapi.json`.
- `api/login.ts` (`login`), `api/get-session.ts` (`getSession`), `api/logout.ts` (`logout`): one function per file, each receiving the `ApiClient`, with relative paths `auth/login`, `auth/me`, `auth/logout`.
- `getSession` turns a 401 `ApiError` into `null`; any other error is rethrown.
- _Why one file per call_: matches the files `pnpm gen:feature` generates. FRONT-01 lists only `api/login.ts`; the two extra files are within the same folder.
- _Rejected_: putting all three calls in `login.ts` (the name would not describe `logout` and `getSession`).

### D3. Session query and sign-in / sign-out mutations

- `queries/session-query.ts`: `sessionQueryOptions(client)` with key `["auth", "session"]` and `retry: false` (a 401 is not retried because it already resolves to `null`); `useSessao()` wraps `useQuery` with the injected client.
- Sign-in uses `useMutation`. On success it writes the returned user into `["auth", "session"]` with `setQueryData` (no extra `GET /auth/me` round trip) and navigates. On a 401 `ApiError` the form shows "E-mail ou senha incorretos". The pending state of the mutation drives the button (`disabled`, `aria-busy`, label kept as "Entrar").
- Sign-out calls `logout`, then `queryClient.clear()`, then navigates to `/entrar` with `replace: true`.
- _Rejected_: storing the user in React state or `localStorage` (duplicates server state, forbidden by `AGENTS.md`).

### D4. Role table

`types/role-access.ts` (in the feature) holds, per role, the ordered menu entries `{ path, label }`; the first entry is the initial page. The allowed addresses of a role are exactly its menu entries.

| Role          | Menu (in order)                               | Initial page              |
| ------------- | --------------------------------------------- | ------------------------- |
| VENDEDOR      | `/clientes` Clientes, `/pedidos` Meus pedidos | `/clientes`               |
| GERENTE       | `/painel` Painel do comercial                 | `/painel`                 |
| FINANCEIRO    | `/fila` Fila do financeiro                    | `/fila`                   |
| ADMINISTRADOR | `/usuarios` Usuários                          | `/usuarios` (provisional) |

- _Why_: menu, redirection, and access denial cannot drift apart because they read the same rows.
- _Rejected_: a separate `allowedRoles` list on each route (two places to update per page).
- _Limit_: an address is allowed only when it matches a menu entry exactly, so a future detail page such as `/clientes/123` needs this rule widened by the task that adds it.

### D5. Route composition in `src/app/router.tsx`

```
/                       HomePage (boilerplate, unchanged)
(pathless)              AuthApiClientProvider
  /entrar                 LoginPage (public)
  (pathless)              ProtectedRoute -> no session: <Navigate to="/entrar" state={{ from }} replace />
    (pathless)              AppShell (menu + Sair + <Outlet />)
      (pathless)              RoleRoute -> role not allowed: "Você não tem acesso a esta página"
        /clientes, /pedidos, /painel, /fila, /usuarios
*                       NotFoundPage (unchanged)
```

- `ProtectedRoute` renders nothing while the session query is pending, so no protected content flashes before the answer.
- After sign-in, the login page navigates to `state.from` when present and not `/entrar`; otherwise to the role's initial page. If `state.from` is outside the role, the access-denied message appears there, as the spec requires.
- `ProtectedRoute`, `RoleRoute`, and the access-denied message live in `src/features/auth/components/`; `AppShell` and the pages live in `src/app/`.
- The `/` and `*` routes keep their current pages, so `router.test.tsx` and `e2e/application.spec.ts` stay as they are.

### D6. Placeholder destination pages

`src/app/routes/` gets `clients-page.tsx`, `my-orders-page.tsx`, `sales-dashboard-page.tsx`, `finance-queue-page.tsx`, and `users-page.tsx`, each rendering only an `<h1>` with the menu label. The task that owns each screen replaces it.

### D7. Browser back after sign-out

`queryClient.clear()` removes every cached response, and `navigate("/entrar", { replace: true })` replaces the current history entry. Going back lands on an earlier protected page, `ProtectedRoute` asks `GET /auth/me` again, gets 401, and redirects to `/entrar`. Nothing renders while that request is pending (D5).

### D8. Tests

- Unit (Vitest + Testing Library + MSW): MSW handlers answer `http://localhost:3001/auth/*`; the system under test (form, routes, shell) is rendered for real with `createMemoryRouter(routes)` and a fresh query client per test.
- End to end (Playwright + axe): `page.route("**/auth/**")` answers the API inside the browser, including the CORS headers `Access-Control-Allow-Origin: http://127.0.0.1:4173` and `Access-Control-Allow-Credentials: true`, because the preview server and the API base URL are different origins.

## Risks / Trade-offs

- [The simulated API in tests drifts from BACK-01] → schemas are copied from `openapi.json`, and the manual check with the four seeded users against the real back end is part of the tasks.
- [Other features forget `credentials: "include"`] → recorded in the change summary and the pull request for the squad manager.
- [Provisional decisions (administrator home, placeholder pages) are later reversed] → each is a single row or a single file to change; both are listed in the pull request.
- [The e2e build uses `VITE_API_URL` default `http://localhost:3001`] → `page.route` matches by path, so the host does not matter.

## Migration Plan

Not applicable: front-end only, no data or contract change. Rollback is reverting the pull request.

## Open Questions

- What a signed-in user sees when opening `/entrar` (proposal, open question 3). Until answered, the sign-in screen is shown normally.
- What the sign-in screen shows when the back end is unreachable or answers with an error other than 401 (proposal, open question 4). Until answered, the button leaves the in-progress state and no message is shown.
- Whether the access-control table and credentialed client should become shared infrastructure (ADR candidate, evaluated during Consolidation).
- What `/` should show (proposal, open question 5). Until answered, it keeps the boilerplate page.
