## Summary

Describe the problem and the chosen solution.

## Test evidence

- [ ] `pnpm verify`
- [ ] Relevant integration or E2E tests
- [ ] Manual verification, when applicable

## Screenshots

Add before/after screenshots for visual changes, or write "Not applicable".

## Risk and rollout

Describe compatibility concerns, migrations, environment variables, or rollback steps.

## Checklist

- [ ] The change follows the app → features → shared dependency direction.
- [ ] New API data is validated at runtime.
- [ ] Query keys include every input that changes the response.
- [ ] No secrets or private values are exposed through `VITE_*` variables.
- [ ] User-facing states cover loading, errors, and empty data when relevant.
- [ ] Documentation and `.env.example` are updated when required.
