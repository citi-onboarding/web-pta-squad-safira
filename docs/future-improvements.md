# Future Improvements

These improvements are intentionally deferred. They require repository ownership, service credentials, a team workflow, or a product-specific decision that the boilerplate cannot choose safely in advance.

## Product capabilities

Authentication, authorization, React Hook Form, a component system, local global state, internationalization, Storybook, Sentry, and product analytics remain opt-in. Add them only when a real product establishes requirements and ownership.

SSR, Server Components, server-side SEO, and Backend for Frontend behavior are outside this SPA boilerplate. Use a server-capable framework or dedicated service instead of adding hidden server responsibilities to Vite.

## GitHub repository settings

### Template repository

Enable **Template repository** under GitHub repository settings so new projects can start with **Use this template** and an independent Git history.

### Branch protection or rulesets

Protect `main` after the required team workflow is known. Recommended starting rules include required pull requests, required CI checks, blocked force pushes, and at least one approval for team-owned repositories.

### CodeQL default setup

Enable GitHub CodeQL default setup for JavaScript and TypeScript when the repository visibility and GitHub plan support it. Prefer the low-maintenance default setup before adding a custom workflow.

### Dependency review

Enable the dependency graph and add dependency review enforcement for pull requests when the repository is eligible. This prevents newly introduced vulnerable dependencies.

## Community and governance files

### `SECURITY.md`

Add a private vulnerability-reporting process when a maintainer email, GitHub private reporting workflow, or security contact exists. Do not publish placeholder contact information.

### License

Choose and add a license before encouraging public reuse. The maintainer must deliberately select the legal terms; the boilerplate does not assume MIT or another license.

### Issue forms

Add bug-report and feature-request forms under `.github/ISSUE_TEMPLATE/` when the repository begins accepting public issues.

### `CODEOWNERS`

Add owners only after a valid GitHub user or team with write access is known. A placeholder would provide a false expectation of review enforcement.

## AI-assisted workflows

### GitHub Copilot instructions

Add `.github/copilot-instructions.md` only when the team actively uses Copilot surfaces that need it. Keep `AGENTS.md` as the durable source of repository conventions and avoid copying instructions that can drift.

### Codex pull request review

Consider `openai/codex-action` or Codex Code Review after API-key ownership, cost, trusted triggers, prompt-injection handling, and output review are defined. Treat AI review as supplemental feedback rather than a required deterministic gate.

If an automated workflow is introduced, store focused prompts under `.github/codex/prompts/`, grant read-only permissions by default, and never pass untrusted pull request text directly into privileged instructions.

## Optional automation

Release automation, Commitlint, changelog generation, stale-issue bots, deployment workflows, and a second dependency-update service remain excluded until a real release or maintenance process requires them.
