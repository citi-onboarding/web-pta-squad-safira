# Architecture

## Dependency direction

```text
src/app → src/features → src/shared
```

### `src/app`

Owns application composition: React Router, providers, route-level pages, global styles, and integration of independent features. It may import features and shared modules.

### `src/features/<feature>`

Owns one business capability. A feature may contain API fetchers, query options, components, schemas, types, and tests. It may import shared modules and its own files, but never another feature or `src/app`.

### `src/shared`

Owns domain-independent infrastructure and primitives, including the API client, environment contract, Query client defaults, date-time helpers, common UI, and test infrastructure. It must not import app or feature code.

## Routing

Routes are composed in `src/app/router.tsx` with React Router. Route pages remain in `src/app/routes`. Nginx and compatible static hosts must fall back to `index.html` so direct navigation to a browser route works.

## Server state

TanStack Query owns remote server state. Query keys must be stable and include every input that changes the response. Feature query options receive an `ApiClient`, which keeps network behavior testable and prevents features from depending on a global transport singleton.

## External data

Every external API response is validated with Zod at the feature boundary. HTTP failures use `ApiError`; valid HTTP responses that violate a schema use `ApiContractError`.

## Environment and security

This repository builds a browser-only SPA. Every `VITE_*` value is public and frozen into the generated bundle. Secrets and protected server behavior must live in a separate backend.

## Naming and imports

- Files and folders use kebab-case.
- Test folders may use the conventional `__tests__` name.
- Barrel `index.ts` files are prohibited.
- Concrete files are imported through `@/*` or a direct relative path.

The architecture policy is executable through ESLint and validated against versioned fixtures in `tests/architecture`.
