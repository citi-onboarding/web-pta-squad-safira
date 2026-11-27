---
name: distrilux-ui
description: Build or review a screen, a component, or any visual change of the DistriLux portal following DESIGN.md and the shared components in src/shared/components/ui — semantic tokens instead of raw colors, loading, empty and error states, Portuguese copy in the brand voice, the 390 px phone and the dark theme, and every element of the client's prototype. Use whenever a task touches what people see in the portal (a new screen, a layout, a component, interface copy, a visual review). It covers only the interface; the workflow steps stay with the citi-* skills.
argument-hint: "[tela, componente ou caminho do arquivo]"
---

# DistriLux UI

Screens of this portal are built from one design system, so that each new task
looks like the DistriLux and not like a fresh guess. `DESIGN.md` at the
repository root owns every visual rule and value; this skill applies them while
a screen is built or reviewed. It cites `DESIGN.md` sections instead of
repeating them, so the rules live in one place.

Speak Brazilian Portuguese with the person — see
`../citi-playbook/references/language.md`.

## Where this skill sits

The CITi skills own the workflow. This skill only adds the interface layer
inside the steps they drive, and never replaces or skips them:

| Moment              | Who leads                               | What this skill adds                                                |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------- |
| Bounding the demand | `citi-task-spec`                        | which prototype screen and which `DESIGN.md` sections apply         |
| Specification       | `openspec-propose`                      | observable states and copy from the prototype, written as scenarios |
| Tests and code      | `citi-tdd-cycle` (with its checkpoints) | how the screen is composed from the shared components               |
| Gates               | `citi-verify-scope`                     | the visual pass below, before the gates                             |
| Review              | `citi-review-change`                    | the interface review below, beside the repository rules             |

The `unslop` and `impeccable` skills only polish. When one of their suggestions
contradicts `DESIGN.md`, `DESIGN.md` wins: report the conflict, do not apply it.

## Before touching a screen

1. Read `DESIGN.md`: Overview, Colors, Typography, Components, States,
   Do's and Don'ts, plus any section named after the screen (for example
   "Sign-in screen").
2. List `src/shared/components/ui/` and read the components the screen will
   need. They are the vocabulary; a screen is a composition of them.
3. Find the screen in the client's prototype (and in the squad's prototype
   checklist, when the person has it). Per `DESIGN.md` Overview, the prototype
   owns the content: list every element the screen must show before writing it.
4. Read the active OpenSpec change. Its scenarios decide the behavior; this
   skill decides only how it looks.

## Building

- Compose from `src/shared/components/ui/`. A piece that does not exist yet is
  added there, with its own test, as a scenario of the change — never styled
  ad hoc inside a feature, where the next screen cannot reuse it.
- Style only with the semantic token classes listed in `DESIGN.md` Colors and
  Shapes. A raw color, a new radius or a `dark:` class on a raw color is a bug.
- Every region that loads data has the three states of `DESIGN.md` States,
  with the texts the prototype or the change gives.
- Money through `formatMoney`, dates and times through `formatDateTime`
  (`src/shared/lib/`). Never format them inline.
- Statuses through `StatusChip`; its meaning rules are in `DESIGN.md`
  Components.
- Interface copy follows `DESIGN.md` Voice and keeps the prototype's words.
  Never invent numbers, names or messages the prototype or the change do not
  give: ask.
- Accessibility per `DESIGN.md` Accessibility: every field labelled, every
  control named, errors announced, decorative drawings hidden.
- The tile drawing appears only where `DESIGN.md` "The tile" allows it.

## Visual pass (before `citi-verify-scope`)

1. Open the screen with `pnpm dev`: desktop and 390 px, light and dark theme.
2. Check: nothing scrolls sideways at 390 px; text reads in both themes; the
   keyboard focus shows on every control when pressing Tab; no element of the
   prototype is missing.
3. A routed screen gets a Playwright + axe test in both themes and widths, as
   `e2e/design-system.spec.ts` does. `citi-verify-scope` decides which gates run.
4. Report in Portuguese: which shared components the screen uses, any component
   added, and any departure from `DESIGN.md` with its reason.

## Interface review

When asked to review a screen or a diff for the interface, report findings in
Portuguese, most serious first, each with `arquivo:linha` and the `DESIGN.md`
section it breaks: raw colors or radii, a hand-made copy of a shared component,
a missing loading/empty/error state, copy that leaves the prototype or the
voice, red used for something that is not an error, a missing check at 390 px
or in the dark theme. Leave the other repository rules to `citi-review-change`.

## The manager app follows this file

The manager app (`mobile-pta-squad-safira`) has its own `distrilux-ui` skill,
which reads this `DESIGN.md` from the sibling folder and compares its colors
with the app's `src/styles/tokens.json`. The app copies the values, not the
file, so a change here does not reach the app by itself.

When a change edits a brand value in `DESIGN.md` (a palette color, a light
theme color, the typeface or the corner), tell the person that the manager app
needs the same value in `src/styles/tokens.json`, in its own pull request in
that repository, and list each value that changed. Do not edit the other
repository from here.

## When DESIGN.md has no answer

Stop and ask the person; do not invent a rule. When a new rule is agreed, the
same change updates `DESIGN.md` and runs `npx @google/design.md lint DESIGN.md`.
The identity itself (palette, type, logo, tile) changes only with the squad
manager's approval.
