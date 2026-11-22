# Repository instructions

## Conventions

- Keep repository code, comments, documentation, errors, and test names in English. `docs/boilerplate-guide.md` is an intentional Portuguese-language exception.
- Use Node.js 22 and pnpm. Do not replace the package manager or lockfile.
- Use kebab-case for files and folders.
- Import concrete files directly. Do not create barrel `index.ts` files.
- Dependencies flow from `src/app` to `src/features` to `src/shared`.
- A feature must not import another feature. Promote genuinely shared code to `src/shared`.
- Keep routing and provider composition in `src/app`.
- Use TanStack Query for remote server state. Do not duplicate query results in a client-state store.
- Validate external API responses with Zod at the feature endpoint boundary.
- Use `parseWallClock` or `parseAbsolute` for API date strings; do not parse ambiguous ISO strings directly.

## Browser and security boundaries

- Treat every `VITE_*` value as public because Vite embeds it in the browser bundle.
- Never place secrets, private API keys, privileged credentials, or protected backend logic in this repository.
- Keep authentication behavior outside the transport core. Use `getAuthHeaders` when a product chooses Bearer authentication.
- API request paths must remain relative so credentials cannot be sent to an untrusted origin.
- The static `/health.json` file verifies frontend asset delivery only; it is not backend or dependency health.

## OpenSpec and documentation

- The repository uses a dual-folder structure: `openspec/` for executable specifications and `docs/` for change summaries and architectural decisions.
- Every feature, behavior change, or relevant decision must start with an OpenSpec change inside `openspec/changes/<change-id>/`.
- Directory mapping inside OpenSpec (`openspec/specs/` and `openspec/changes/`) must be grouped strictly by business capability, matching the feature name in `src/features/<feature>` when one exists — never by route, component, or hook name.
- The AI must obtain instructions using `openspec instructions` before filling out each artifact.
- Before archiving an OpenSpec change, create or update a summary file in `docs/changes/<change-id>.md`.
- Create an ADR in `docs/adr/` — following `docs/adr/README.md` — whenever there is an architectural decision, relevant trade-off, or cross-cutting impact. Do not introduce a different ADR format.
- Do not archive a change without passing tests, typecheck, lint, and `openspec validate --strict`.
- Before archiving an OpenSpec change, always obtain explicit user confirmation immediately before moving the change to the archive. Previous confirmations for validation warnings or spec synchronization do not count as archive confirmation.
- All documentation in `docs/changes/` must use `docs/templates/change.md`; every ADR in `docs/adr/` must use `docs/templates/adr.md`.
- Do not remove mandatory sections from the templates; fill in "Not applicable" when necessary.

## SDD (Specification-Driven Development) Flow

- Read and parse the current OpenSpec artifacts before proposing or writing any code.
- Production code and automated tests must directly map to the requirements, invariants, and scenarios defined in the OpenSpec.
- If you discover missing edge cases, ambiguities, or technical constraints during development, halt coding and update the OpenSpec first.
- The specification is the single source of truth; code is merely the implementation of the specification.

## TDD (Test-Driven Development) Flow

- **Strict Red-Green-Refactor cycle:** You must strictly follow TDD principles.
- **Pause and Confirm:** Do not advance to the next TDD phase (e.g., from Red to Green, or Green to Refactor) without explicit confirmation from the user.
- **Phase Explanation (in Portuguese):** Before asking for confirmation to proceed, you must explain entirely in Portuguese everything that will be implemented or changed in the upcoming phase.
- **Red:** Write the automated tests for the new behavior, feature, or bugfix **before** writing any production code, using Vitest and Testing Library. Use MSW only to simulate HTTP responses, never to mock the component or hook under test. Run the tests to confirm they fail (this proves the test is valid and testing the right thing).
- **Green:** Write the minimal amount of production code required to make the failing tests pass.
- **Refactor:** Improve the code structure, readability, and performance without changing its behavior, ensuring all tests remain green.
- Never write production code without an accompanying test that validates it.
- Never mock the system under test; only mock external dependencies (HTTP, time, browser APIs) when strictly necessary.
- Add or update a Playwright + axe test when the change is user-visible or touches routing, per the existing rule in `## Verification`.

## Architecture & Testability

- **Dependency Injection:** Components and hooks do not instantiate the HTTP transport directly. `api/*.ts` functions and TanStack Query options receive an `ApiClient` by injection, enabling fast, isolated unit testing — this is already the pattern `pnpm gen:feature` scaffolds.
- **Single Responsibility Principle:** A component only renders; a query/hook only orchestrates data fetching and cache; an `api/*.ts` function only calls the injected transport.

## Verification

- During development, run the narrowest relevant test first.
- Before handing off changes, run `pnpm format:check`, `pnpm verify`, `pnpm test:coverage`, and `pnpm build`.
- Run `pnpm test:e2e` for user-visible or routing changes.
- Build and run the Docker image when changing static delivery or Nginx behavior.
- Keep pre-commit checks fast; full quality gates belong in CI.

## Agent skills

- `.agents/skills/citi-*` holds the CITi workflow skills and is their single source. Codex reads it directly; Claude Code only discovers skills under `.claude/skills/`.
- `.claude/skills/citi-*` is a generated, git-ignored mirror. `pnpm install` regenerates it through `prepare`. Edit the source, then run `pnpm skills:sync` — never edit the mirror.
- `openspec-*` skills in both trees are generated by the OpenSpec CLI. Regenerate with `pnpm exec openspec init --tools claude,codex`; never edit them by hand.
- Use `citi-playbook` to route, `citi-task-spec` to bound a demand, `citi-tdd-cycle` to implement, `citi-verify-scope` to pick and run gates, `citi-close-change` to write the change summary and evaluate an ADR, `citi-review-change` to review, and `citi-prepare-pr` to write the pull request.
- Skills cite the rules in this file and in `openspec/config.yaml`; they do not restate them. `pnpm skills:check` fails when a rule is copied instead of cited.

## Code review rules

- Flag secrets, access tokens, personal data, or private environment values committed to browser code or logs.
- Flag external API data used without runtime validation at its feature boundary.
- Flag features that import other features or shared code that imports application layers.
- Flag query keys that are unstable or omit inputs that change the response.
- Flag repository scripts that delete or overwrite paths before validating every expected marker and target.
- Flag ADRs created for local, reversible changes, and cross-cutting or hard-to-reverse decisions shipped without one.
