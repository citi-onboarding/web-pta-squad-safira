# Contributing

Thank you for improving the Vite boilerplate. Keep changes reusable, focused, and independent of product-specific assumptions.

## Requirements

- Node.js 22.12 or later
- pnpm 12 or later (enable it with `corepack enable`)
- Git
- Chromium installed through Playwright for end-to-end tests
- Docker when changing container behavior

## Package manager

This repository uses pnpm, pinned in the `packageManager` field. Run
`corepack enable` once; Corepack then resolves the exact pinned version, so
there is no global pnpm to keep in sync. The `preinstall` script refuses any
other package manager, and `pnpm-lock.yaml` is the only lockfile.

Project-level pnpm settings live in `pnpm-workspace.yaml`, not in
`package.json`. Dependency build scripts are disabled by default: when an
install reports ignored build scripts, decide case by case with
`pnpm approve-builds` and leave a comment saying why each one is allowed or
denied.

## Local setup

Clone the repository and install the locked dependencies:

```bash
git clone https://github.com/gabrielrlc/vite-boilerplate.git
cd vite-boilerplate
pnpm install --frozen-lockfile
cp .env.example .env.local
```

Start development with:

```bash
pnpm dev
```

Do not run `pnpm init:project` when contributing to the boilerplate itself. That command is intended for repositories created from this template.

## Agent skills

The development flow is available as agent skills, which run the same steps and
read this repository's own rules instead of restating them: `citi-playbook`
routes, `citi-task-spec` bounds the demand, `openspec-propose` creates the
planning artifacts, `citi-tdd-cycle` implements, `citi-verify-scope` runs the
right gates, `citi-close-change` writes the change summary and evaluates the
ADR, `citi-review-change` reviews, `citi-prepare-pr` writes the pull request,
and `openspec-archive-change` archives. They work in Claude Code (`/name`) and
in Codex (`$name`).

The skills live in `.agents/skills/`; `.claude/skills/` mirrors them for Claude
Code. After editing one, run `pnpm skills:sync`. When regenerating the
OpenSpec skills, always pass both targets — the selection is stored in a global
profile, so omitting one produces a different tree for the next person:

```bash
pnpm exec openspec init --tools claude,codex
```

`pnpm skills:check` verifies that both agents can discover every skill; it is
part of `pnpm verify`.

## Branches and commits

Create a focused branch from `main`. Keep commits small enough to review and use an imperative commit subject that explains the outcome.

Do not mix formatting-only changes, dependency upgrades, and unrelated product behavior in the same pull request.

## Architecture

Dependencies flow in one direction:

```text
src/app → src/features → src/shared
```

- Compose routes and features in `src/app`.
- Keep business capabilities isolated under `src/features`.
- Put only domain-independent infrastructure and primitives in `src/shared`.
- Import concrete files directly; do not create barrel `index.ts` files.
- Use kebab-case for new files and folders.
- Validate external data with Zod at the boundary where it enters the application.

Read `docs/architecture.md` and `docs/boilerplate-guide.md` before changing a shared convention.

## Tests

Place feature tests in the feature's `__tests__` folder. Keep shared-library tests next to the implementation. Use root `tests/` only for repository architecture, generators, and other boilerplate tooling.

Use injected `fetch` implementations for API transport tests and MSW for feature-level HTTP integration tests.

Run the narrowest relevant test while developing. Before opening a pull request, run:

```bash
pnpm format:check
pnpm verify
pnpm test:coverage
pnpm build
```

Run `pnpm test:e2e` for UI, routing, accessibility, or static-delivery changes. Build and start the Docker image when changing `Dockerfile`, `nginx.conf`, or the health file.

## Documentation and environment changes

Update `.env.example` whenever a variable is added, renamed, or removed. Never commit real credentials or local `.env*` files.

Update README and focused guides when behavior or contributor workflows change. Repository documentation remains in English except for the intentional Portuguese guide at `docs/boilerplate-guide.md`.

Record consequential, durable technical decisions in `docs/adr/` using the provided template.

## Pull requests

Complete the pull request template with:

- A concise problem and solution summary
- Test evidence
- Screenshots for visual changes
- Compatibility, migration, and rollback considerations

Keep generated files, lockfile changes, and documentation synchronized with the implementation. CI must pass before merge.
