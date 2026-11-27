# DESIGN.md · DistriLux Portal

The visual standard of the portal, for people and for AI agents (including the `unslop` and `impeccable` skills). Read it before creating or changing any screen.

> Status: approved identity (26/11/2026). Source: "DistriLux — Brand guidelines 1.0 (proposta visual)". When this file and a skill suggestion disagree, this file wins. Items marked **TBD** are still open.

## Concept

A wall of Recife tiles drawn with power distribution cables: bundles of three wires that run together, bend and pass from one tile to the next, like DistriLux taking electrical material to clients in eight states. Serious in content, light in manner.

## Principles

- The prototype owns the content; the brand guide owns the look. Never drop an element of the prototype.
- It is an internal work tool: clarity and speed come before decoration.
- Use a card only when it really groups something. Never a box around a single element.
- The amount of information must fit the size of each component.
- No AI-looking UI: no purple, no gradients (except the light on top of "LUX" in the logo), no glows outside the brand drawing, no gradient text, no emoji labels, no "Novo ✨" badges, no pulsing elements, no uneven spacing.
- No circuit-board imagery.

## Foundation

- Components come from shadcn/ui, generated into `src/shared/components/ui/` (ADR-001). The manager app uses the same token values through `mobile-pta-squad-safira/src/styles/tokens.json`.
- Two themes, light and dark. Without a stored choice the portal follows the system; the theme switch changes it and the choice is kept in the browser.
- Theme switch: an on/off switch (4 px corners, knob with a sun in the light theme and a moon in the dark one, sliding to the right in the dark theme). It is a button with an accessible name that says what it does ("Ativar tema escuro" / "Ativar tema claro"). On the sign-in screen, top-right corner of the form side, never on the brand panel. In the signed-in area, next to the user menu.

## Palette

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

## Tokens

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

## Spacing, shape and density

- Corners: 4 px on buttons, fields and chips, like the edge of a tile (`rounded-tile`).
- Height: buttons and fields from 40 to 48 px, comfortable touch area on the phone.
- Focus: 2 px Azul Capibaribe outline, always visible with the keyboard.
- Spacing scale: multiples of 4 px, constant across screens.
- Work screens keep only the logic of the tile: regular grid, 4 px corners, constant spacing. No tile drawing.

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
- **Theme switch:** icon button, see Foundation.

## States

- **Loading:** announced to screen readers; keeps the size of the content so the layout does not jump.
- **Empty:** one whole 2×2 tile figure, a sentence that says what is empty ("Nenhum cliente encontrado na sua busca.") and, when there is one, the action.
- **Error:** says what happened and what to do, never technical codes, with a "Tentar de novo" button.
- **Disabled action:** shows the reason next to it (e.g. "+ Novo pedido" for a blocked client, RN-02).

## Application shell

- Header: logo (`logo-horizontal.svg`, or the negative version in the dark theme), ERP sync indicator, the person's name and role, theme switch next to the user menu.
- Side menu with the entries of the person's role, the current one highlighted, and "Sair" at the end.
- Content area with constant spacing; no tile drawing on work screens.
- On the phone (390 px) the side menu becomes a select below the header.

## Sign-in screen

- Brand panel on the left, in Marinho: logo in Porcelana with the light on "LUX", a strip of tiles from top to bottom (Louça, soft glow), the title "Portal de pedidos da DistriLux", the text "Carteira, limite de crédito e pedidos num só lugar, sincronizados com o ERP" and the signature "DistriLux Materiais Elétricos · Recife". The panel does not change with the theme.
- Form on the right: "Entrar no portal", "Use o e-mail e a senha da DistriLux.", E-mail, Senha, Entrar.
- Error: alert "E-mail ou senha incorretos." with icon and Pitanga outline, and both fields with a red border, never saying which one is wrong.
- Signing in: the button reads "Entrando…" and is disabled until the answer.
- Prototype shortcuts ("Gerente comercial", "Financeiro") and "Simular Normal / Erro / Entrando": only in demo mode (`VITE_DEMO_MODE=true`), below a divider. The normal build does not show them.

## Money

- Always `R$ 1.234,56` (RN-13). The API sends cents; convert only in the shared money formatter.
- Negative amounts are possible (available limit below zero, client C0044) and show with a minus sign, `-R$ 500,00`, plus an icon and text. Never rely on color alone.

## Phone (390 px)

- Client search and order screens work at 390 px without horizontal scrolling.
- The side menu becomes a selector on the phone.
- Touch targets at least 40 px high.

## Accessibility

- Every field has a label. Errors use `role="alert"` and mark the fields invalid.
- Everything works with the keyboard; focus is always visible.
- Contrast AA in both themes.

## Voice

- Brazilian Portuguese, simple and for management. Short sentences, verb first, numbers when there are numbers. No jargon, no exclamation marks, never blame the user.
- Write "Pedido barrado: crédito insuficiente.", not "Erro de validação no limite creditício do cliente.".
- Error messages say what happened and what to do, without exposing details.
