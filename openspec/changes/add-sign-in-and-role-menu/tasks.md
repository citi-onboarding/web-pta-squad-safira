## 1. SDD

- [x] 1.1 Write `proposal.md`, `specs/auth/spec.md`, and `design.md`, and run `pnpm exec openspec validate add-sign-in-and-role-menu --strict`
- [ ] 1.2 Send the open questions (administrator home, placeholder pages, signed-in user on `/entrar`, non-401 sign-in failures, shared credentialed client) to the squad manager and update the change with each answer before the related code is written
- [ ] 1.3 Run `pnpm gen:feature auth` and remove or rename the generated example files that the design does not use

## 2. Red (developer writes the failing tests)

- [ ] 2.1 Write unit tests for the contract and API calls: `login`, `getSession` (user and 401 → `null`), and `logout` send the right relative paths and validate responses with the Zod schemas
- [ ] 2.2 Write unit tests for the sign-in form: fields, texts, required fields block the request, in-progress button, and "E-mail ou senha incorretos" on 401
- [ ] 2.3 Write unit tests for the role table: menu entries and initial page of each of the four roles
- [ ] 2.4 Write unit tests for routing: no session → sign-in screen; return to the requested page after sign-in; initial page per role; `/` → initial page; access denied message for a page outside the role
- [ ] 2.5 Write unit tests for the app shell: each role sees exactly its menu and "Sair"; "Sair" calls the back end, clears the cache, and shows the sign-in screen; going back after sign-out shows the sign-in screen
- [ ] 2.6 Update `src/app/router.test.tsx` for the removed boilerplate home page
- [ ] 2.7 Run `pnpm test` and confirm every new test fails for the expected reason

## 3. Green (minimal production code)

- [ ] 3.1 Add `types/session.ts`, `api/login.ts`, `api/get-session.ts`, `api/logout.ts`, and the auth API client with `credentials: "include"`
- [ ] 3.2 Add `queries/session-query.ts` with `useSessao`
- [ ] 3.3 Add `types/role-access.ts`
- [ ] 3.4 Add `components/login-form.tsx`, `components/protected-route.tsx`, the role check, and the access-denied message
- [ ] 3.5 Add `src/app/routes/login-page.tsx`, the five placeholder pages, `src/app/layout/app-shell.tsx`, and update `src/app/router.tsx` and `src/app/providers.tsx`; remove `src/app/routes/home-page.tsx`
- [ ] 3.6 Run `pnpm test` until every test passes

## 4. Refactor

- [ ] 4.1 Improve names, remove duplication, and keep each component render-only, with every test still green
- [ ] 4.2 Run `pnpm typecheck` and `pnpm lint`

## 5. End to end

- [ ] 5.1 Update `e2e/application.spec.ts` for the removed home page
- [ ] 5.2 Add Playwright + axe tests with `page.route`: sign-in per role shows the right menu, wrong password message, access denied, sign-out and browser back
- [ ] 5.3 Run `pnpm test:e2e`

## 6. Consolidation

- [ ] 6.1 Manual check against the real back end (`feat/authAndUsers`): the four seeded users sign in and see the correct menu; capture screenshots of the error and loading states for the pull request
- [ ] 6.2 Run `pnpm format:check`, `pnpm verify` (includes typecheck, lint, tests, and `openspec validate --strict`), `pnpm test:coverage`, and `pnpm build`
- [ ] 6.3 Write `docs/changes/add-sign-in-and-role-menu.md` from `docs/templates/change.md` and evaluate the ADR candidate from `design.md`
- [ ] 6.4 Open the pull request to `develop` listing the provisional decisions and open questions
