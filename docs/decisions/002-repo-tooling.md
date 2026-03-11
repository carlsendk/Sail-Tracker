# ADR 002: Initial Repository Tooling

## Status

Accepted

## Date

2026-03-11

## Decision

Use the following repository tooling baseline:

- `pnpm` as the package manager
- `Next.js` as the application framework
- `React` and `TypeScript` for the web app
- `Vitest` for the first automated test baseline
- native local development as the default inner loop
- a `Dockerfile` for parity, but not Docker-first development

## Context

The project needs a fast and low-friction workflow for:

- local hello-world development
- repository validation in GitHub Actions
- deployment alignment with Vercel
- future multi-package growth without heavy monorepo tooling on day 1

## Rationale

- `pnpm` is fast and works well for workspaces.
- `Next.js` aligns with Vercel and the agreed React stack.
- `TypeScript` keeps contracts explicit across the app and future packages.
- `Vitest` provides a lightweight first test baseline.
- Native local development keeps frontend iteration fast.
- A `Dockerfile` improves parity and future deployment flexibility without slowing the default workflow.

## Consequences

### Positive

- Fast local iteration
- Simple CI workflow
- Clear path to grow into a larger workspace
- Early container support without forcing every developer into Docker

### Negative

- Container-first teams may need an additional compose setup later.
- Additional repo tooling decisions may still be needed as complexity grows.

## Follow-Up Decisions

- when to add local Supabase to the default dev path
- whether to add Playwright as part of the first end-to-end baseline
- whether monorepo orchestration tooling is needed later
