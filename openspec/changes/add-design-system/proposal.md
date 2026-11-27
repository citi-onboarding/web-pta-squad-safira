## Why

The prototype is a deliberately plain wireframe: it defines screens, content, flow and states, but not the look. Every screen of Sprints 1 to 3 needs the same base pieces, and without a shared design system each task would restyle them on its own and the portal would drift. This change (backlog task FRONT-02) builds that base and redoes the sign-in screen with it, which is the visual proposal sent to DistriLux by 30/11/2026. It is done when the screens of Sprints 1 and 2 can be built only with these pieces.

## What Changes

- Adopt shadcn/ui as the component foundation of the portal and record the design-system choice for the portal and the manager app in ADR-001.
- Add the design tokens (colors, typography, spacing, radius) to `src/shared/styles/globals.css`, each with a light and a dark value, following `DESIGN.md`.
- Add a light and a dark theme with a theme switch. The first theme follows the system; the user's choice is remembered.
- Add the base components in `src/shared/components/ui/`, each with normal, focus, disabled and error states and at least one test: button, text field, select, table, card, status chip (client status and order/credit status), banner, loading, empty, error with "Tentar de novo", ERP sync indicator, modal and back link ("← Clientes").
- Add one money formatter that always shows `R$ 1.234,56`, including negative values (RN-13, RN-01).
- Style the application shell from FRONT-01: header (logo, sync indicator, name and role, theme switch), side menu with the active item, content area; responsive down to the phone, where the menu becomes a select.
- Redo the sign-in screen with the approved identity and the base components.
- Write `DESIGN.md` at the repository root: tokens, component patterns, and the loading, empty and error states.
- Fill the `context` block of `openspec/config.yaml` with the DistriLux domain and remove the template text from `README.md` and `index.html`.
- In the manager app repository (`mobile-pta-squad-safira`): replace the template icons, splash and tokens with the brand ones.

### In scope

- Everything listed above, in the web portal and, for brand assets and tokens only, in the manager app.
- Contrast AA and visible keyboard focus in both themes; labelled fields; modal closes with Esc.
- Layouts that work at 390 px without horizontal scrolling.

### Out of scope

- The screens that use these pieces (Clientes = FRONT-03, Painel = FRONT-07, etc.).
- Real ERP sync data: the sync indicator shows what it receives; the data comes from BACK-04 and later screens.
- Manager app components and screens (MOB tasks).
- Risk (Alto/Médio/Baixo) and contract situation chips: they first appear in Sprint 3 and are designed with FRONT-10 and FRONT-09.
- Any change to the back-end API.

## Impact

- Business: the visual proposal sent to DistriLux comes from this change; every later screen depends on it.
- Security: none. The sign-in error keeps not revealing which field is wrong (US-001). The theme choice in the browser holds no personal data. Demo shortcuts must use fake accounts only (open question 1).
- API contract: none.
- Dependencies: the packages shadcn/ui needs (`clsx`, `tailwind-merge`, `class-variance-authority`, the Radix primitives of the components used) and the Inter font in both repositories.

### Decisions already taken

Approved with the squad manager on 26/11. Sources: "DistriLux — Proposta visual" and "DistriLux — Brand guidelines 1.0" (proposta visual).

- Concept: Recife tiles drawn with power distribution cables, only on identity screens (sign-in, app opening, empty states), never behind text, tables, numbers or forms.
- Palette: Marinho DistriLux `#0E2A5C`, Azul Capibaribe `#1D4FB8`, Celeste `#3E8BF0`, Bruma `#BCD3F5`, Porcelana `#F1F5FC`, Névoa `#D6DFEE`, Ardósia `#4A5A78`, and Pitanga `#C62839` for errors only (error background `#FCE6E9`; `#FF8C96` in the dark theme). No green or yellow: other states are told apart by fill, outline, icon and text.
- Typeface in code: Inter. The logo is an SVG file and is never retyped.
- Components: 4 px corners; buttons and fields 40 to 48 px high; 2 px Azul Capibaribe focus ring; cards only when they group something.
- Sign-in: brand panel on the left (same in both themes), form on the right. Error: alert with icon and Pitanga outline, both fields with a red border, never saying which one is wrong. While signing in, the button reads "Entrando…". Empty or invalid fields are checked by the portal itself, with messages under each field, instead of the browser's balloon.
- Theme switch: an on/off switch that reads "ON" in the light theme (the light is on) and "OFF" in the dark theme, named "Ativar tema escuro" / "Ativar tema claro"; on the sign-in screen in the top-right corner of the form side, in the signed-in area next to the user menu.
- Status chips: Ativo with a solid Marinho outline and a check, no fill; Bloqueado with a Bruma fill and a lock; Inativo with a dashed outline. Order and credit statuses follow the brand guide (Enviado, Em análise, Barrado: crédito, Rascunho, Erro de envio).
- Uppercase only in small captions of numbers, without extra letter spacing; every other label in sentence case.
- App icon, splash and favicon use the DistriLux logo (squad manager, 26/11): the stacked negative version on Marinho for square formats (app icon, adaptive icon, favicon) and the version with the light on "LUX" on Marinho for the splash.
- Demo mode: the prototype shortcuts and "Simular" controls of the sign-in screen appear only in a demo build.

### Dependencies

- Logo and tile SVGs: delivered (26/11) in `src/shared/assets/brand/`.

### Open questions

This is the single numbered list; `design.md`, `DESIGN.md` and ADR-001 refer to these numbers.

1. Demo shortcuts: whether they fill email and password or only the email, and in which environment the demo build runs. Blocks only task 3.11.
