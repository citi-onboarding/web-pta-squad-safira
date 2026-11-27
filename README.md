# DistriLux Portal de Pedidos

Web portal of DistriLux's internal order system, built by Squad Safira in CITi's PTA Tech 26.2. Sellers find the clients of their portfolio, check the available credit and send orders to the ERP once; the sales manager, finance and the administrator each get the screens of their role. The portal talks only to its own API (`backend-pta-squad-safira`), never to the ERP.

The visual standard is [DESIGN.md](DESIGN.md), and architecture decisions are in [docs/adr/](docs/adr/README.md). The project started from CITi's React + Vite boilerplate, which provides the architectural boundaries, routing, server-state management, testing, CI and static delivery listed below.

## Included

- React 19 and Vite
- React Router with home, route error, and not-found states
- TanStack Query with conservative shared defaults
- TypeScript strict mode
- Tailwind CSS 4 through the official Vite plugin
- ESLint architecture boundaries, kebab-case naming, and no barrel files
- Zod-validated public environment variables and API contracts
- Extensible Fetch API client with timeout, abort, auth hooks, and typed errors
- Vitest, Testing Library, MSW, V8 coverage, Playwright, and axe
- Prettier, Husky, lint-staged, and a basic GitHub Actions check
- Static Docker delivery through an unprivileged Nginx image
- Project initializer, feature generator, and removable example

## Requirements

- Node.js 22.12 or later
- pnpm 12 or later (enable it with `corepack enable`)
- Docker for container validation

## Local setup

```bash
git clone https://github.com/citi-onboarding/web-pta-squad-safira.git
cd web-pta-squad-safira
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Development is available at [http://localhost:5173](http://localhost:5173).
Point `VITE_API_URL` at the backend API. Before opening a pull request, run
`pnpm format:check`, `pnpm verify`, and `pnpm build`.

### Windows notes

- Use pnpm 12 for this repository. If `pnpm --version` prints an older major, or
  a commit hook fails with `pnpm` not recognized, install it once with
  `npm install -g pnpm@12.5.1` (or run `corepack enable` from an administrator
  terminal) and open a new terminal.
- Docker Desktop must be running before `docker compose` or the integration
  tests.

## Architecture

```text
src/app       Router, providers, routes, and application composition
    ↓
src/features  Independent business capabilities
    ↓
src/shared    Domain-independent infrastructure and primitives
```

ESLint enforces the direction. Features cannot import other features, and shared code cannot import app or feature code. Import concrete modules directly instead of creating `index.ts` barrels.

Read [docs/architecture.md](docs/architecture.md) for the rules and [docs/boilerplate-guide.md](docs/boilerplate-guide.md) for the complete Portuguese guide.

## Environment

All frontend environment values are public and embedded during `vite build`:

| Variable        | Default                       | Purpose                        |
| --------------- | ----------------------------- | ------------------------------ |
| `VITE_APP_NAME` | `DistriLux Portal de Pedidos` | Browser title and display name |
| `VITE_APP_URL`  | `http://localhost:5173`       | Public application URL         |
| `VITE_API_URL`  | `http://localhost:3001`       | pta-api base URL (no path)     |

Never store secrets in `VITE_*` variables. Private keys, privileged credentials, HTTP-only cookie handling, and other protected behavior belong in the backend.

## API and server state

Create the browser adapter and pass it to feature fetchers:

```ts
import { createBrowserApiClient } from "@/shared/lib/api/client";

const apiClient = createBrowserApiClient({
  getAuthHeaders: async () => ({ Authorization: "Bearer <token>" }),
});
```

The core does not implement login, token storage, refresh, redirects, or toast notifications. Features validate external responses with Zod and may expose TanStack Query options while keeping the API client injectable.

## Commands

| Command                           | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                        | Start Vite on port 5173                                          |
| `pnpm build`                      | Type-check and create `dist`                                     |
| `pnpm preview`                    | Preview `dist` on port 4173                                      |
| `pnpm verify`                     | Type-check, lint, and test                                       |
| `pnpm test:coverage`              | Run coverage gates                                               |
| `pnpm test:e2e`                   | Run Chromium and axe against the production build                |
| `pnpm gen:feature <name>`         | Generate a feature with API, query options, component, and tests |
| `pnpm remove:example`             | Safely remove the marked example feature                         |
| `pnpm init:project --name "Name"` | Customize a repository created from this template                |
| `pnpm skills:sync`                | Regenerate the Claude Code mirror of the CITi agent skills       |

## Agent skills

The CITi workflow skills live in `.agents/skills/citi-*`, which is their only authored copy. Codex reads that directory directly. Claude Code discovers skills only under `.claude/skills/`, so the repository generates a mirror there.

That mirror is generated output and is not committed. `pnpm install` and `pnpm install --frozen-lockfile` produce it through `prepare`, so **a clone where dependencies were never installed shows no CITi skills in Claude Code**. Run `pnpm install`, or `pnpm skills:sync` on its own, and they appear.

Edit the skills in `.agents/skills/`, never in the mirror — `pnpm skills:check` fails when the two diverge.

## Static delivery and Docker

The production build is a static SPA. The included Nginx configuration:

- serves generated assets from `dist`;
- falls back to `index.html` for browser routes;
- caches hashed assets for one year;
- exposes `/health.json` with caching disabled.

`/health.json` only confirms that frontend files are being served. Backend and external dependency health must be monitored by their own services.

```bash
docker build -t distrilux-portal-web .
docker run --rm -p 3000:8080 distrilux-portal-web
```

## Repository setup

Branch rules, required CI checks and code owners are described in [CONTRIBUTING.md](CONTRIBUTING.md).

See [docs/future-improvements.md](docs/future-improvements.md) for intentionally deferred repository and product decisions.
