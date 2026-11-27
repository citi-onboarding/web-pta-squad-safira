## 1. SDD

- [x] 1.1 Write `proposal.md`, `specs/design-system/spec.md` and `design.md`, and run `pnpm exec openspec validate add-design-system --strict`
- [x] 1.2 Record the approved visual identity and the squad manager's answers (theme switch, demo mode, chips, captions)
- [x] 1.3 Write ADR-001 and `DESIGN.md`
- [x] 1.4 Add the logo and tile SVGs to `src/shared/assets/brand/`
- [ ] 1.5 Get the answer to open question 1 (demo accounts) of `proposal.md`

## 2. Red (developer writes the failing tests)

Component tests live in `src/shared/components/ui/__tests__/`, one file per component at least.

- [ ] 2.1 Money formatter: positive, zero, negative (client C0044) and large values
- [ ] 2.2 Button: disabled and in-progress do not run the action; focusable with the keyboard
- [ ] 2.3 Text field and select: label linked to the control; error marks it invalid and is announced; disabled does not accept input
- [ ] 2.4 Status chip: the three client statuses and the order/credit statuses render their text and icon; only error statuses use the error variant; Ativo has no fill
- [ ] 2.5 Banner: information and error show icon and text; error is announced
- [ ] 2.6 Loading, empty, error with "Tentar de novo": loading is announced; empty shows its message; error shows its message and "Tentar de novo" calls the retry function
- [ ] 2.7 Table and card: table has a header row and numeric cells aligned right; at phone width rows render as stacked cards with the same information; card renders its title and content
- [ ] 2.8 Sync indicator: available ("Sincronizado com o ERP em 19/11/2026 14:02") and unavailable ("ERP fora do ar · dados de 19/11/2026 14:02") with icon
- [ ] 2.9 Modal: Esc and cancel close it; focus stays inside; focus returns to the trigger
- [ ] 2.10 Theme: follows the system without a stored choice; the button "Ativar tema escuro" switches and is renamed "Ativar tema claro"; the choice survives a reload; keyboard works; storage failure falls back to the system
- [ ] 2.11 Shell: header shows logo, sync indicator, name and role and theme switch; current menu entry is highlighted; FRONT-01 shell tests keep passing
- [ ] 2.12 Sign-in: brand panel texts and logo name; tile hidden from screen readers; theme button on the form side; error alert with both fields invalid; "Entrando…" while pending; update FRONT-01 tests only where these change them
- [ ] 2.13 Demo mode: no shortcuts or "Simular" outside demo mode; shown in demo mode; "Erro" shows the error state without calling the back end
- [ ] 2.14 Run `pnpm test` and confirm every new test fails for the expected reason

## 3. Green (minimal production code)

- [ ] 3.1 Run `shadcn init` with `components.json` aliases `@/shared/components/ui` and `@/shared/lib/cn`
- [ ] 3.2 Add the tokens from `DESIGN.md` (light on `:root`, dark on `.dark`) and the Inter font to `src/shared/styles/globals.css`; derive the missing dark values and check them
- [ ] 3.3 Add the money formatter in `src/shared/lib/`
- [ ] 3.4 Add button, text field, select, table, card, status chip, banner and modal with the shadcn CLI and adapt them to the tokens
- [ ] 3.5 Add loading, empty, error with "Tentar de novo" and the sync indicator
- [ ] 3.6 Add the theme logic, the theme switch and the inline script in `index.html`
- [ ] 3.7 Redo the sign-in screen with the components, the brand panel and the theme switch
- [ ] 3.8 Style the application shell
- [ ] 3.9 Add `VITE_DEMO_MODE` to the env schema and `.env.example` (default `false`)
- [ ] 3.10 Add the "Simular" controls behind `VITE_DEMO_MODE`
- [ ] 3.11 Add the demo shortcuts behind `VITE_DEMO_MODE` (after open question 1)

## 4. Refactor

- [ ] 4.1 Remove duplicated classes and raw colors; keep every test green
- [ ] 4.2 Polish the visual with the `unslop` and `impeccable` skills, with `DESIGN.md` and the brand guide as the source of truth; when a suggestion conflicts with the approved identity, the identity wins

## 5. Consolidation

- [ ] 5.1 Playwright + axe for the sign-in screen and a signed-in screen: desktop and 390 px, light and dark
- [ ] 5.2 Compare the sign-in screen with the approved design, light and dark
- [ ] 5.3 Fill the `context` block of `openspec/config.yaml` with the DistriLux domain
- [ ] 5.4 Remove the template text from `README.md` and `index.html`, and add the favicon (stacked negative logo on Marinho)
- [ ] 5.5 Run `pnpm format:check`, `pnpm verify`, `pnpm test:coverage`, `pnpm build` and `pnpm test:e2e`
- [ ] 5.6 Write `docs/changes/add-design-system.md`

## 6. Manager app (`mobile-pta-squad-safira`, separate branch and pull request)

- [ ] 6.1 Replace the template values in `src/styles/tokens.json` with the brand tokens and Barlow with Inter (`src/providers/app-providers.tsx`)
- [ ] 6.2 Update `app.json`: splash and adaptive icon background colors
- [ ] 6.3 Replace `icon.png`, `adaptive-icon.png`, `splash-icon.png` and `favicon.png` with the logo (stacked negative on Marinho; splash with the light on "LUX")
- [ ] 6.4 Run the app's checks and write its change summary
