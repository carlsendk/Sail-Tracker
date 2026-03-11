# ADR 001: Default Platform Stack

## Status

Accepted

## Date

2026-03-11

## Decision

Use the following default platform stack for the initial Sail Tracker foundation:

- `GitHub`
- `Vercel`
- `Supabase`
- `React`
- `TypeScript`

## Context

The project needs:

- a straightforward local-to-cloud workflow
- strong support for a web-based PWA
- a simple path for preview deployments
- a database and auth platform suitable for a multi-tenant application
- an implementation stack that remains productive for a growing application

## Rationale

- `GitHub` provides the collaboration and CI anchor.
- `Vercel` keeps frontend deployment simple and works well with GitHub.
- `Supabase` provides Postgres, authentication, storage, and a strong tenant-isolation foundation.
- `React` is the agreed UI technology for the app.
- `TypeScript` provides consistency across the codebase.

## Consequences

### Positive

- Faster setup for local development and hello-world deployment
- Clear default path for CI and preview environments
- Reduced need for custom backend setup in the first phase

### Negative

- The project becomes more opinionated about hosting and backend choices early.
- Some domain and infrastructure boundaries must be preserved carefully to avoid excessive platform coupling.

## Follow-Up Decisions

- Monorepo tooling choice
- package manager choice
- test runner choice
- i18n library choice
- auth and tenant-resolution implementation details
