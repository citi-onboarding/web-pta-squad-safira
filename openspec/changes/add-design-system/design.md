## Context

- Stack fixed by the boilerplate: React + Vite + Tailwind v4. Shared code lives in `src/shared/`, which must not import features or `src/app`. File names are kebab-case and barrel `index.ts` files are not allowed.
- The application shell (`src/app/layout/app-shell.tsx`) and the sign-in screen (`src/app/routes/login-page.tsx`, `src/features/auth/components/login-form.tsx`) already exist from FRONT-01, unstyled.
- The visual identity is approved (proposal, "Decisions already taken"). Every visual value still goes through tokens, so later adjustments touch one file.
- The manager app (`mobile-pta-squad-safira`) already uses NativeWind with a single token file (`src/styles/tokens.json`, rule R6).

## Decisions

### D1. shadcn/ui as the portal's component foundation

Components follow the shadcn/ui source (new-york-v4) and are committed. The shadcn registry site was not reachable from the development environment, so the source was taken from the shadcn GitHub repository, the same code the CLI copies; `components.json` is in place for later `shadcn add` runs. `components.json` points the aliases to the project layers:

- `ui` → `@/shared/components/ui`
- `utils` → `@/shared/lib/cn` (the `cn()` helper that merges Tailwind classes)

Only the components this change needs are added: button, input, label, table, card, badge (status chip), alert (banner), dialog (modal). Generated files are squad-owned and may be edited. The select is a styled native `<select>` instead of the shadcn select: it is the control the phone menu needs, it gets the phone's own picker, and it is fully accessible without extra code. Loading, empty, error-with-retry, the data table with its phone cards, and the sync indicator are written by the squad on top of them. See ADR-001.

### D2. Tokens as CSS variables with two values

Tokens live in `src/shared/styles/globals.css` with semantic names (`--color-surface`, `--color-danger`, ...). Light values sit on `:root`, dark values on `.dark`, and `@theme inline` exposes them to Tailwind. Components use only semantic classes, never raw colors.

### D3. Theme selection

- The theme is applied by the `dark` class on the root element (shadcn convention, works with Tailwind's `dark:` variant).
- Without a stored choice, the theme follows `prefers-color-scheme`.
- The switch is an on/off switch, like a light switch: it reads "ON" in the light theme (the light is on) and "OFF" in the dark theme. It stays a button named after what it does ("Ativar tema escuro" / "Ativar tema claro"), with the same text as a tooltip, so the ON/OFF metaphor never has to be guessed. It sits on the form side of the sign-in screen (top-right corner) and next to the user menu in the header, never on the brand panel.
- The choice is stored in `localStorage`. Reads and writes are wrapped in `try/catch`; when storage is unavailable the app falls back to the system preference.
- A small inline script in `index.html` applies the class before React renders, so the page does not flash the wrong theme.
- The theme is client-only state; it does not go through TanStack Query.

### D4. Money formatting

One function in `src/shared/lib/` receives cents (the ERP works in cents, RN-13) and uses `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`. Negative values are valid (RN-01, client C0044).

### D5. Status chips

One chip component with two families of variants. The text is always rendered; fill, outline and icon tell the statuses apart, and red is reserved for errors.

- Client: Ativo (solid Marinho outline, check, no fill), Bloqueado (Bruma fill, lock), Inativo (dashed outline).
- Order and credit, from the brand guide: Enviado ao ERP and Aprovado (filled, check), Aguardando financeiro (outline, clock, "Em análise" in the guide), Bloqueado por crédito (Bruma fill, warning triangle, "Barrado: crédito"), Rascunho and Enviando (dashed, pencil), Erro de envio and Recusado (Pitanga, cross).

### D6. Messages, states and the sync indicator

- Banner: information (Bruma) and error (Pitanga, `role="alert"`), always icon plus text.
- Loading announces itself with `role="status"` and keeps the layout size. Empty shows the 2×2 tile figure, a message and an optional action. Error shows the message and a "Tentar de novo" button that calls the retry function it receives.
- The sync indicator receives the last sync time and whether the ERP is available, and formats the date as `DD/MM/YYYY HH:mm` in Recife time (`America/Recife`), so every person sees the same time as the company. It does not fetch anything.

### D7. Modal

Built on the shadcn dialog (Radix): focus trap, Esc closes, focus returns to the trigger, darkened backdrop, cancel and action buttons.

### D8. Application shell

`app-shell.tsx` keeps its behavior from FRONT-01 (role menu, sign-out) and gains the header (logo, name and role, theme switch), the highlighted current entry, and the phone layout where the menu becomes a select below the header, inside the same navigation landmark. Its existing tests keep passing. The header reserves the place of the sync indicator; it is wired when there is sync data to show (BACK-04 and the screens that read it), since no API exposes it yet.

### D9. Sign-in redo

The redo adds the brand panel and changes markup and classes. The credential error becomes an alert at the top of the form with both fields marked invalid, and the in-progress button reads "Entrando…". The browser's own validation balloon ("Preencha este campo.") cannot be styled and differs in every browser, so the form turns it off (`noValidate`) and checks the fields itself, showing the messages under each field in the portal's style. As before, nothing is sent while a field is empty. Texts, fields, the 401 message and the redirection behavior from FRONT-01 stay the same. FRONT-01 tests keep passing, except the ones that check the button while signing in, which are updated to "Entrando…".

### D9.1 Back link

`back-link.tsx` in `src/shared/components/ui/` wraps the router's `Link`: an arrow icon hidden from screen readers, the destination name, and a hidden "Voltar para" prefix, so the link is announced as "Voltar para Clientes". It covers the "← Clientes", "← Voltar" and "← [cliente]" links of the prototype's inner screens.

### D10. Demo mode

A build-time flag `VITE_DEMO_MODE` (validated by the env schema, default `false`) turns on the prototype shortcuts and the "Simular" controls on the sign-in screen. With the flag off, those controls are not rendered. FRONT-01 left the prototype's "Ver como" out instead of putting it behind a flag, so this is the first demo-only control; later demo controls should reuse the same flag.

### D11. Brand assets

The logo and tile SVGs live in `src/shared/assets/brand/`. The logo is rendered as an image named "DistriLux"; the tile strip is a CSS background built from `azulejo-figura-2x2-fios.svg` over Porcelana, so it is invisible to screen readers. The cable glow is a `drop-shadow` filter applied only to the wires layer.

### D12. Manager app

The app keeps NativeWind and its single token file. This change only replaces the template values with the brand ones (colors, Inter instead of Barlow, radius), the icons and the splash. App components are left to the MOB tasks, which reuse the same token names.

### D13. Template leftovers

`openspec/config.yaml` gets the DistriLux domain in its `context` block. `README.md` and `index.html` lose the template text (boilerplate description, `vite-boilerplate` image and repository names, "Vite Boilerplate" title).

## Rejected alternatives

- Own components written from scratch on Tailwind: full control, but focus handling, keyboard and ARIA would have to be written and tested by hand for every interactive piece.
- Packaged libraries (MUI, Chakra): bring their own look and theme system, which competes with Tailwind and with the brand.
- A route-level demo page instead of a flag: keeps the real sign-in clean, but duplicates the screen and drifts from it.
- Theme stored on the server per user: survives across devices, but needs an API change outside this task's scope.
- A component library for the app now: the app has no screens yet; choosing one belongs to the MOB tasks.

## Risks and trade-offs

- Celeste and Bruma have low contrast on light backgrounds (about 3:1): only for glow, charts, illustration and large titles, never for body text.
- Dark-theme values are only partly given by the brand guide: the derived ones must be checked with axe in both themes.
- The task is large for one change. Order of work: tokens and components first, then the sign-in screen (the visual proposal), then the shell, then the template leftovers and the app.
- Demo shortcuts may put demo credentials in the browser bundle (every `VITE_*` value is public). Acceptable only for fake demo accounts and only in the demo build (open question 1).
- Generated shadcn code becomes squad code: updates from shadcn are not automatic.
