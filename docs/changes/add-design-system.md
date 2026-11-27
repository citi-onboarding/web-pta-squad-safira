---
change_id: add-design-system
date: 2026-11-27
status: in-progress # in-progress | shipped | deprecated
owners: [Beatriz]
tags: [front-end, design-system]
related_adrs: [ADR-001]
openspec_change: openspec/changes/add-design-system/
---

# Design system, DESIGN.md and sign-in screen redone (FRONT-02)

## Objective

Give every portal screen one shared visual base (tokens, components, states and the application shell) built on the visual identity approved on 2026-11-26, and redo the sign-in screen with it as the visual proposal sent to DistriLux by 30/11/2026.

## Change made

- Tokens in `src/shared/styles/globals.css`: the brand palette, semantic colors with a light and a dark value, the screen type scale, the 4 px corner and the cable glow. Values follow `DESIGN.md`, which now uses the open DESIGN.md format (YAML tokens plus sections) and passes `npx @google/design.md lint` with no errors or warnings.
- Base components in `src/shared/components/ui/`, following the shadcn/ui source: button, text field, native select, status chip (client and order/credit statuses), banner, loading, empty and error-with-retry states, data table with stacked phone cards, card, ERP sync indicator, modal and theme switch.
- Shared helpers: `formatMoney` (cents to `R$ 1.234,56`), `formatDateTime` (Recife time), theme logic, and `cn`.
- Light and dark themes: an inline script in `index.html` applies the stored choice or the system preference before the first paint; the theme switch changes it and keeps it in the browser.
- Sign-in screen redone with the brand panel (logo, tile strip, texts), the credential error as an alert with both fields marked invalid, "Entrando…" while waiting, and the prototype controls behind `VITE_DEMO_MODE`.
- Application shell styled: header with logo, name and role and theme switch; menu with the current page highlighted; a select menu on the phone.
- Brand assets in `src/shared/assets/brand/`, favicon in `public/favicon.svg`, and the template text removed from `README.md`, `index.html` and `openspec/config.yaml`.
- The visual was polished with the `unslop` and `impeccable` skills, keeping every value from `DESIGN.md`.

## Resulting behavior

- Every money amount reads `R$ 1.234,56`, negative amounts included.
- Statuses show their text and icon; red appears only for errors.
- The portal opens in the system theme on the first visit and keeps the person's choice afterwards.
- The sign-in screen shows the brand panel next to the form; a wrong email or password shows "E-mail ou senha incorretos." and marks both fields, without saying which one is wrong.
- Signed-in screens show the logo, the person's name and role, the theme switch and the role menu; on a 390 px phone the menu becomes a select and nothing scrolls sideways.
- Outside demo mode no prototype control is shown.

## Impact

- Every later screen (FRONT-03 onwards) is built with these components and tokens.
- No change to the back-end API. The ERP sync indicator is ready as a component; the header shows it once an API exposes the sync data (BACK-04).
- New dependencies: `clsx`, `tailwind-merge`, `class-variance-authority`, `radix-ui`, `lucide-react` and `@fontsource-variable/inter`.
- Three FRONT-01 tests were updated where the redo changes them: the logo moved to the page, the in-progress button reads "Entrando…", and the error test also checks both fields.
- `.impeccable/` (local cache of the design skill, already ignored by Git) was added to `.prettierignore`.

## Validations executed

- `pnpm test`: 42 files, 200 tests passed.
- `pnpm test:coverage`: 97.8 % of lines; `src/shared/lib` at 100 %.
- `pnpm typecheck` and `pnpm lint`: no errors.
- `pnpm format:check`: all files formatted.
- `pnpm exec openspec validate --all --strict`: 2 changes valid.
- `pnpm build`: succeeded.
- `pnpm test:e2e`: 20 tests passed, including axe with no violations on the sign-in screen and a signed-in screen, in the light and dark themes, at desktop and 390 px, with no horizontal scrolling.
- `npx @google/design.md lint DESIGN.md`: 0 errors, 0 warnings.

## Related artifacts

- Proposal: `openspec/changes/add-design-system/proposal.md`
- Specification: `openspec/changes/add-design-system/specs/design-system/spec.md`
- Design: `openspec/changes/add-design-system/design.md`
- Tasks: `openspec/changes/add-design-system/tasks.md`
- ADR: `docs/adr/ADR-001-design-system.md`
- Visual standard: `DESIGN.md`

## Usage

- Build screens only with the components in `src/shared/components/ui/` and the semantic Tailwind classes from the tokens (`bg-surface`, `text-muted`, `text-danger`, `rounded-tile`, ...). Never write raw colors.
- Show money with `formatMoney(cents)` and dates with `formatDateTime(timestamp)`.
- Demo build: `VITE_DEMO_MODE=true pnpm build` (or `pnpm dev`) shows the prototype controls on the sign-in screen.

## Implementation notes

- The ADR file name follows the task card (`ADR-001-design-system.md`); `docs/adr/README.md` suggests `0001-...`.
- The shadcn registry was not reachable from the development environment, so the component source was taken from the shadcn/ui GitHub repository, the same code the CLI copies.
- The demo shortcuts fill in only the email of the seed accounts; this was decided without consulting the squad manager because of the tight deadline and can be revisited. The manager app tokens, font, icons and splash (tasks 6.x) go in a separate pull request in `mobile-pta-squad-safira`.
- At 16 px the favicon is below the logo's minimum size; it reads at 32 px and above.
