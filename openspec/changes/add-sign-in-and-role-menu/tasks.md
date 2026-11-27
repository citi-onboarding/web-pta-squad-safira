## 1. SDD

- [x] 1.1 Write `proposal.md`, `specs/auth/spec.md`, and `design.md`, and run `pnpm exec openspec validate add-sign-in-and-role-menu --strict`
- [ ] 1.2 Send the open questions 1 to 8 of `proposal.md` to the squad manager. The code follows the provisional behavior recorded there; update the change (and the code, when an answer differs) as answers arrive
- [x] 1.3 Run `pnpm gen:feature auth` and remove or rename the generated example files that the design does not use

## 2. Red (developer writes the failing tests)

- [x] 2.1 Write unit tests for the contract and API calls: `login`, `getSession` (user and 401 → `null`), and `logout` send the right relative paths and validate responses with the Zod schemas
- [x] 2.2 Write unit tests for the sign-in form: fields, texts, required fields block the request, in-progress button, and "E-mail ou senha incorretos" on 401
- [x] 2.3 Write unit tests for the role table: menu entries and initial page of each of the four roles
- [x] 2.4 Write unit tests for routing: no session → sign-in screen; return to the requested page after sign-in; initial page per role; access denied message for a page outside the role
- [x] 2.4.1 Route guards inside the feature: no session → sign-in screen keeping the requested page, nothing shown while the session is unknown, access denied for a page outside the role
- [x] 2.5 Write unit tests for the app shell: each role sees exactly its menu and "Sair"; "Sair" calls the back end, clears the cache, and shows the sign-in screen; going back after sign-out shows the sign-in screen
- [x] 2.6 Run `pnpm test` and confirm every new test fails for the expected reason

## 3. Green (minimal production code)

- [x] 3.1 Add `types/session.ts`, `api/login.ts`, `api/get-session.ts`, `api/logout.ts`, and the auth API client with `credentials: "include"`
- [x] 3.2 Add `queries/session-query.ts` with `useSessao`
- [x] 3.2.1 Add `queries/sign-in-mutation.ts` (`useSignIn`) and split the API client context into `components/auth-api-client-context.ts` and `components/auth-api-client-provider.tsx` (not in the original plan: the form only renders, and the lint rule `react-refresh/only-export-components` requires the split)
- [x] 3.3 Add `types/role-access.ts`
- [x] 3.4 Add `components/login-form.tsx`, `components/protected-route.tsx`, the role check, and the access-denied message
- [x] 3.4.1 Add `components/access-denied.tsx` and `components/role-route.tsx` (the role check)
- [x] 3.5 Add `src/app/routes/login-page.tsx`, the five placeholder pages, and `src/app/layout/app-shell.tsx`, and update `src/app/router.tsx` (the only existing file changed)
- [x] 3.5.1 Add `src/features/auth/components/auth-root.tsx` (creates the credentialed client once, when the routes mount; a client created at module load would keep the original `fetch`) and `src/features/auth/queries/sign-out-mutation.ts` (`useSignOut`: calls the back end, then clears the query cache)
- [x] 3.6 Run `pnpm test` until every test passes

- [x] 3.7 Fresh start on sign-in (found in review): test that a successful sign-in discards responses kept from before it, then clear the query cache in `queries/sign-in-mutation.ts`

## 4. Refactor

- [x] 4.1 Improve names, remove duplication, and keep each component render-only, with every test still green
- [x] 4.2 Run `pnpm typecheck` and `pnpm lint`

## 5. End to end

- [x] 5.1 Add Playwright + axe tests with `page.route`: sign-in per role shows the right menu, wrong password message, access denied, sign-out and browser back
- [x] 5.2 Run `pnpm test:e2e`

## 6. Consolidation

- [x] 6.1 Manual check against the real back end (`feat/authAndUsers`): the four seeded users sign in and see the correct menu; capture screenshots of the error and loading states (saved outside the repository, to attach when the pull request is opened)
- [x] 6.2 Run `pnpm format:check`, `pnpm verify` (includes typecheck, lint, tests, and `openspec validate --strict`), `pnpm test:coverage`, and `pnpm build`
- [x] 6.3 Write `docs/changes/add-sign-in-and-role-menu.md` from `docs/templates/change.md` and evaluate the ADR candidate from `design.md`
- [ ] 6.4 Open the pull request to `develop` listing the provisional decisions and open questions

## 7. Review of pull request #10

- [x] 7.1 Update the spec, design, and open questions for the accepted suggestions: generic sign-in failure message, sign-out failure message, "Carregando..." and failed session check on protected pages, and `/` redirect
- [x] 7.2 Red: developer writes the failing tests and runs them
- [x] 7.3 Green: minimal production code; update `router.test.tsx`, `providers.test.tsx`, and `e2e/application.spec.ts` only where they asserted the boilerplate home page
- [x] 7.4 Refactor, all gates, and the change summary
