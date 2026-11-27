---
version: alpha
name: DistriLux Portal de Pedidos
description: Visual standard of the DistriLux order portal (web) and manager app, from "DistriLux — Brand guidelines 1.0" (proposta visual), approved on 2026-11-26.
colors:
  # Brand palette
  marinho: "#0E2A5C"
  capibaribe: "#1D4FB8"
  celeste: "#3E8BF0"
  bruma: "#BCD3F5"
  porcelana: "#F1F5FC"
  nevoa: "#D6DFEE"
  ardosia: "#4A5A78"
  pitanga: "#C62839"
  # Light theme (default)
  primary: "{colors.capibaribe}"
  on-primary: "{colors.porcelana}"
  background: "{colors.porcelana}"
  surface: "#FFFFFF"
  on-surface: "{colors.marinho}"
  muted: "{colors.ardosia}"
  border: "{colors.nevoa}"
  input: "#7C8BA8"
  highlight: "{colors.bruma}"
  on-highlight: "{colors.marinho}"
  disabled: "{colors.nevoa}"
  on-disabled: "{colors.ardosia}"
  error: "{colors.pitanga}"
  error-surface: "#FCE6E9"
  focus: "{colors.capibaribe}"
  glow: "{colors.celeste}"
  brand-panel: "{colors.marinho}"
  on-brand-panel: "{colors.porcelana}"
  # Dark theme
  dark-primary: "{colors.bruma}"
  dark-on-primary: "{colors.marinho}"
  dark-background: "{colors.marinho}"
  dark-surface: "#142F63"
  dark-on-surface: "{colors.porcelana}"
  dark-muted: "#A9BCDB"
  dark-border: "#2C4677"
  dark-input: "#6F86B3"
  dark-highlight: "#1D3E78"
  dark-on-highlight: "{colors.porcelana}"
  dark-error: "#FF8C96"
  dark-error-surface: "#3B1B3A"
  dark-focus: "{colors.bruma}"
typography:
  title-1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
  title-2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
  title-3:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 24px
  body-strong:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 600
    lineHeight: 24px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
  number:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 24px
    fontFeature: '"tnum" 1'
rounded:
  tile: 4px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  control-height: 44px
  touch-target: 40px
  focus-ring: 2px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.tile}"
    height: 44px
    padding: 20px
  button-primary-dark:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.disabled}"
    textColor: "{colors.on-disabled}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.tile}"
    height: 44px
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.tile}"
    height: 44px
  text-field-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-on-surface}"
  chip-filled:
    backgroundColor: "{colors.marinho}"
    textColor: "{colors.porcelana}"
    typography: "{typography.caption}"
    rounded: "{rounded.tile}"
    height: 24px
  chip-tinted:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    typography: "{typography.caption}"
    rounded: "{rounded.tile}"
  chip-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error}"
    typography: "{typography.caption}"
    rounded: "{rounded.tile}"
  banner-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error}"
    rounded: "{rounded.tile}"
  banner-error-dark:
    backgroundColor: "{colors.dark-error-surface}"
    textColor: "{colors.dark-error}"
  banner-info:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    rounded: "{rounded.tile}"
  text-field-outline:
    backgroundColor: "{colors.input}"
    height: 1px
  text-field-outline-dark:
    backgroundColor: "{colors.dark-input}"
    height: 1px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  divider-dark:
    backgroundColor: "{colors.dark-border}"
    height: 1px
  menu-item-active:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    rounded: "{rounded.tile}"
    height: 40px
  menu-item-active-dark:
    backgroundColor: "{colors.dark-highlight}"
    textColor: "{colors.dark-on-highlight}"
  tile-wire-glow:
    textColor: "{colors.glow}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.tile}"
  card-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-on-surface}"
  brand-panel:
    backgroundColor: "{colors.brand-panel}"
    textColor: "{colors.on-brand-panel}"
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
  page-muted-text:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted}"
  page-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-on-surface}"
  page-dark-muted-text:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-muted}"
---

# DESIGN.md · DistriLux Portal

The visual standard of the portal, for people and for AI agents (including the `unslop` and `impeccable` skills). Read it before creating or changing any screen. It follows the open [DESIGN.md format](https://github.com/google-labs-code/design.md): the tokens in the front matter above are the normative values, and the sections below explain how to apply them. Check it with `npx @google/design.md lint DESIGN.md`.

> Status: approved identity (26/11/2026). Source: "DistriLux — Brand guidelines 1.0 (proposta visual)". When this file and a skill suggestion disagree, this file wins. Items marked **TBD** are still open.

## Overview

A wall of Recife tiles drawn with power distribution cables: bundles of three wires that run together, bend and pass from one tile to the next, like DistriLux taking electrical material to clients in eight states. Serious in content, light in manner. The client asked for its dark blue, a serious but approachable tone, and trust without distance.

- The prototype owns the content; the brand guide owns the look. Never drop an element of the prototype.
- It is an internal work tool: clarity and speed come before decoration.
- Components come from shadcn/ui, kept in `src/shared/components/ui/` (ADR-001). The manager app uses the same token values in its own token file (`src/styles/tokens.json` in the `mobile-pta-squad-safira` repository).
- Two themes, light and dark. Without a stored choice the portal follows the system; the theme switch changes it and the choice is kept in the browser. In code, the light values live on `:root` and the dark ones (the `dark-*` tokens) on `.dark`, in `src/shared/styles/globals.css`.
- Theme switch: an on/off switch, like a light switch (DistriLux is light). The knob reads "ON" in the light theme (the light is on) and "OFF" in the dark theme, sliding to the right; 4 px corners. It is a button with an accessible name that says what it does ("Ativar tema escuro" / "Ativar tema claro"), also shown as a tooltip. On the sign-in screen, top-right corner of the form side, never on the brand panel. In the signed-in area, next to the user menu.

## Colors

### Palette

| Name              | Hex       | Use                                                                 |
| ----------------- | --------- | ------------------------------------------------------------------- |
| Marinho DistriLux | `#0E2A5C` | The company color. Logo, brand panel, main text                     |
| Azul Capibaribe   | `#1D4FB8` | Primary button, links, highlights, focus ring                       |
| Celeste           | `#3E8BF0` | Cable glow, charts, illustration, titles above 24 px. Never in body |
| Bruma             | `#BCD3F5` | Highlight backgrounds, status, selection, tile grout                |
| Porcelana         | `#F1F5FC` | The brand white. Page background, tile glaze                        |
| Névoa             | `#D6DFEE` | Lines, borders, fields                                              |
| Ardósia           | `#4A5A78` | Secondary text, captions, icons                                     |
| Pitanga           | `#C62839` | Errors only: alert, field border, icon                              |

Blues, and red only for errors. Whites and grays are always bluish. No green or yellow: every other state is told apart by fill, outline, icon and text. The word always appears; color is never the only clue. Celeste and Bruma on light backgrounds have about 3:1 contrast: never use them for text there.

### Tokens

Components use semantic tokens only, never raw hex values.

| Token                    | Light                | Dark                             |
| ------------------------ | -------------------- | -------------------------------- |
| `--color-background`     | Porcelana `#F1F5FC`  | Marinho `#0E2A5C`                |
| `--color-surface`        | `#FFFFFF`            | `#142F63`                        |
| `--color-foreground`     | Marinho `#0E2A5C`    | Porcelana `#F1F5FC`              |
| `--color-muted`          | Ardósia `#4A5A78`    | `#A9BCDB`                        |
| `--color-border`         | Névoa `#D6DFEE`      | `#2C4677`                        |
| `--color-primary`        | Capibaribe `#1D4FB8` | Bruma `#BCD3F5`                  |
| `--color-primary-fg`     | Porcelana `#F1F5FC`  | Marinho `#0E2A5C`                |
| `--color-highlight`      | Bruma `#BCD3F5`      | `#1D3E78`                        |
| `--color-glow`           | Celeste `#3E8BF0`    | Celeste `#3E8BF0`                |
| `--color-danger`         | Pitanga `#C62839`    | `#FF8C96`                        |
| `--color-danger-surface` | `#FCE6E9`            | `#3B1B3A`                        |
| `--color-focus`          | Capibaribe `#1D4FB8` | Bruma `#BCD3F5`                  |
| `--color-brand-panel`    | Marinho `#0E2A5C`    | Marinho `#0E2A5C` (same in both) |

Field outlines use `--color-input`: `#7C8BA8` (light) and `#6F86B3` (dark). Névoa is too faint for the 3:1 a field outline needs (1.3:1 on white), so it stays for dividers and table lines.

The dark values not given by the brand guide were derived from the palette and checked: text 11.9:1, secondary text 6.7:1, primary button 9.2:1, error text 6.7:1, focus ring 9.2:1, field outline 3.5:1.

All text/background pairs must reach WCAG AA contrast in both themes. Switch themes only through tokens, never with `dark:` classes on raw colors.

## Typography

- In code the typeface is **Inter** (the brand face, Neue Haas Grotesk, is paid; the guide allows Inter with the same rules). Weights: Regular, Medium, Bold.
- Numbers (money, codes, CNPJ, quantities) use tabular figures (`font-variant-numeric: tabular-nums`) and are aligned right in tables.
- Uppercase only in small captions of numbers ("CRÉDITO DISPONÍVEL"), without extra letter spacing. Every other label uses sentence case ("Crédito disponível").
- The logo is never typed: always the SVG file (it is drawn from Eurostile Extended, used nowhere else).

| Role    | Guide (print)             | Screen (token)                     |
| ------- | ------------------------- | ---------------------------------- |
| Title 1 | 40/44 pt Bold             | 32/40 px Bold (`text-title-1`)     |
| Title 2 | 24/28 pt Bold             | 24/32 px Bold (`text-title-2`)     |
| Title 3 | 14/18 pt Medium           | 16/24 px Semibold (`text-title-3`) |
| Body    | 10/14 pt Regular          | 15/24 px Regular (`text-body`)     |
| Caption | 7.5/10 pt Bold, uppercase | 12/16 px Semibold (`text-caption`) |

The guide's sizes are in pt, for print; the screen scale keeps its hierarchy and weights at sizes readable on a phone.

## Layout

- Spacing scale: multiples of 4 px (`spacing.unit`), constant across screens.
- Height: buttons and fields from 40 to 48 px (44 px by default), comfortable touch area on the phone.
- Work screens keep only the logic of the tile: regular grid, 4 px corners, constant spacing. No tile drawing.

### Application shell

- Header: logo (`logo-horizontal.svg`, or the negative version in the dark theme), ERP sync indicator, the person's name and role, theme switch next to the user menu.
- Side menu with the entries of the person's role, the current one highlighted, and "Sair" at the end.
- Content area with constant spacing; no tile drawing on work screens.
- On the phone (390 px) the side menu becomes a select below the header.

### Phone (390 px)

- Client search and order screens work at 390 px without horizontal scrolling.
- The side menu becomes a selector on the phone.
- Touch targets at least 40 px high.

## Elevation & Depth

The interface is flat. Hierarchy comes from tonal layers (Porcelana page, white surfaces; Marinho page and `dark-surface` in the dark theme), thin borders and type weight, not shadows. The only shadow is under the modal, over a darkened backdrop. The only glow is the soft Celeste light on the tile wires, on identity screens.

## Shapes

- Corners: 4 px (`rounded.tile`) on buttons, fields, chips, cards and the modal, like the edge of a tile. No pills, no large radii.
- Focus: 2 px outline (`spacing.focus-ring`) in Azul Capibaribe, Bruma in the dark theme, always visible with the keyboard.

## Components

Live in `src/shared/components/ui/`. Features and screens use them; they never restyle them. Every component has the normal, focus, disabled and error states that apply to it.

- **Button:** primary, secondary (outline), text, disabled, in progress. Light: primary Capibaribe with Porcelana text. Dark: primary Bruma with Marinho text, secondary outline Porcelana.
- **Text field and select:** label always visible above; error shows a Pitanga border and a message with an icon, and marks the control invalid.
- **Status chip:** text always visible, plus fill, outline and icon. Red only for errors.

| Family       | Status                   | Text in the portal  | Told apart by                                         |
| ------------ | ------------------------ | ------------------- | ----------------------------------------------------- |
| Client       | Ativo                    | "Ativo"             | Solid Marinho outline, check, no fill                 |
| Client       | Bloqueado                | "Bloqueado"         | Bruma fill, lock                                      |
| Client       | Inativo                  | "Inativo"           | Dashed outline                                        |
| Order/credit | Enviado ao ERP, Aprovado | as in the prototype | Filled Marinho, check                                 |
| Order/credit | Aguardando financeiro    | as in the prototype | Capibaribe outline, clock ("Em análise" in the guide) |
| Order/credit | Bloqueado por crédito    | as in the prototype | Bruma fill, warning triangle ("Barrado: crédito")     |
| Order/credit | Rascunho, Enviando       | as in the prototype | Dashed outline, pencil                                |
| Order/credit | Erro de envio, Recusado  | as in the prototype | Pitanga outline and text on Pitanga light, cross      |

- **Banner:** information (Bruma background, info icon) and error (Pitanga light background, Pitanga outline and icon, announced to screen readers). Always icon plus text.
- **Card:** only when it groups something.
- **Table:** header row, numeric columns aligned right with tabular figures; on 390 px rows become stacked cards (as in the prototype).
- **Modal:** darkened backdrop, title, cancel and action buttons; Esc closes it; focus stays inside and returns to the trigger.
- **ERP sync indicator (header):** "Sincronizado com o ERP em 19/11/2026 14:02" with a check icon, or "ERP fora do ar · dados de 19/11/2026 14:02" with a warning icon. The prototype's green dot becomes an icon: there is no green.
- **Back link:** an arrow and the destination ("← Clientes", "← Voltar"), announced as "Voltar para Clientes". Used at the top of inner screens.
- **Theme switch:** see Overview.

### States

- **Loading:** announced to screen readers; keeps the size of the content so the layout does not jump.
- **Empty:** one whole 2×2 tile figure, a sentence that says what is empty ("Nenhum cliente encontrado na sua busca.") and, when there is one, the action.
- **Error:** says what happened and what to do, never technical codes, with a "Tentar de novo" button.
- **Disabled action:** shows the reason next to it (e.g. "+ Novo pedido" for a blocked client, RN-02).

## Do's and Don'ts

- Do use a card only when it really groups something. Never a box around a single element.
- Do fit the amount of information to the size of each component.
- Do keep red (Pitanga) for errors only, always with an icon and text.
- Don't use purple, gradients (except the light on top of "LUX" in the logo), glows outside the brand drawing, gradient text, emoji labels, "Novo ✨" badges, pulsing elements or uneven spacing.
- Don't use circuit-board imagery.
- Don't put the tile behind text, tables, numbers or forms.
- Don't write raw colors in components; use the tokens.

## Logo

- Horizontal version for the portal; stacked version for square or narrow spaces.
- Minimum size on screen: 160 px wide (horizontal), 72 px (stacked).
- App icon, adaptive icon and favicon: the stacked negative logo on Marinho. Splash: the version with the light on "LUX" on Marinho. At favicon size the logo is below its minimum; check that it still reads in the browser tab.
- Clear space: at least ½X on every side (X = logo height); at least 1X from the tile wall.
- On the dark brand panel the logo is all Porcelana and only the top of "LUX" fades into the background. That is its only effect: no glow, shadow or outline.

## The tile

- Used only on identity screens: sign-in, app opening, empty states. Never behind text, tables, numbers or forms.
- Built from four mirrored pieces (2×2 figure). Cables always continue from one piece to the next; no loose ends.
- One color combination per piece: Louça (Porcelana background, Marinho wires; the default), Noturna (Marinho background, Porcelana wires) or Bruma (Bruma background, Marinho wires, no glow).
- On screen the wires have a soft Celeste glow. No gradient, no shadow.
- Empty states: one whole figure, then the message and the action.
- Decorative: hidden from screen readers.

## Brand assets

Files in `src/shared/assets/brand/`. Use them as they are; never redraw or retype.

| File                                                         | Use                                                               |
| ------------------------------------------------------------ | ----------------------------------------------------------------- |
| `logo-horizontal.svg`                                        | Marinho, on light backgrounds (header)                            |
| `logo-horizontal-negativa.svg`                               | Porcelana, on dark backgrounds                                    |
| `logo-horizontal-luz.svg`                                    | Porcelana with the light on "LUX": sign-in panel, app opening     |
| `logo-empilhada.svg`, `logo-empilhada-negativa.svg`          | Square or narrow spaces                                           |
| `azulejo-figura-2x2-louca.svg`, `azulejo-peca-louca.svg`     | Louça tile, the default                                           |
| `azulejo-figura-2x2-noturna.svg`, `azulejo-peca-noturna.svg` | Noturna tile                                                      |
| `azulejo-figura-2x2-fios.svg`, `azulejo-peca-fios.svg`       | Wires only, over a Porcelana background in CSS, to apply the glow |

- Sign-in strip: repeat the 2×2 figure as a background (`background-size: 220px 220px`), a strip 220 px wide on the right of the brand panel.
- Cable glow (screen only): `filter: drop-shadow(0 0 2px rgba(62,139,240,.85)) drop-shadow(0 0 6px rgba(62,139,240,.4));` on the wires layer only, never on the background.
- The tile SVGs carry `role="img"` and a label; when used as an `<img>` they must get an empty `alt` and `aria-hidden`, or be used as CSS backgrounds.

## Sign-in screen

- Brand panel on the left, in Marinho: logo in Porcelana with the light on "LUX", a strip of tiles from top to bottom (Louça, soft glow), the title "Portal de pedidos da DistriLux", the text "Carteira, limite de crédito e pedidos num só lugar, sincronizados com o ERP" and the signature "DistriLux Materiais Elétricos · Recife". The panel does not change with the theme.
- Form on the right: "Entrar no portal", "Use o e-mail e a senha da DistriLux.", E-mail, Senha, Entrar.
- Error: alert "E-mail ou senha incorretos." with icon and Pitanga outline, and both fields with a red border, never saying which one is wrong.
- Field checks: the portal checks the fields itself, never with the browser's balloon. Messages under the field, with icon and Pitanga border: "Preencha o e-mail.", "Preencha a senha.", "Digite um e-mail válido, como nome@distrilux.com.br.".
- Signing in: the button reads "Entrando…" and is disabled until the answer.
- Prototype shortcuts ("Gerente comercial", "Financeiro") and "Simular Normal / Erro / Entrando": only in demo mode (`VITE_DEMO_MODE=true`), below a divider. The normal build does not show them.

## Money

- Always `R$ 1.234,56` (RN-13). The API sends cents; convert only in the shared money formatter.
- Negative amounts are possible (available limit below zero, client C0044) and show with a minus sign, `-R$ 500,00`, plus an icon and text. Never rely on color alone.

## Accessibility

- Every field has a label. Errors use `role="alert"` and mark the fields invalid.
- Everything works with the keyboard; focus is always visible.
- Contrast AA in both themes.

## Voice

- Brazilian Portuguese, simple and for management. Short sentences, verb first, numbers when there are numbers. No jargon, no exclamation marks, never blame the user.
- Write "Pedido barrado: crédito insuficiente.", not "Erro de validação no limite creditício do cliente.".
- Error messages say what happened and what to do, without exposing details.
