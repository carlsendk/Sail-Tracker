# Repo And Workflow Baseline

This document defines how the repository should be structured and how work should flow before feature implementation begins.

## Goals

- Prove the developer workflow with a hello-world application.
- Keep local development simple.
- Ensure pull requests are validated automatically.
- Make architecture and feature growth predictable.

## Baseline Stack

- `GitHub` for repository hosting, pull requests, and CI integration
- `Vercel` for app hosting and preview deployment
- `Supabase` for database, auth, and storage
- `Next.js` with `React` and `TypeScript` for application code
- `pnpm` for package management
- `Vitest` for the first unit-test baseline

## Initial Repository Shape

Use a structure that can grow into a larger app:

```text
/apps
  /web
/packages
  /domain
  /application
  /infrastructure
  /ui
  /testkit
/docs
/.codex/skills
```

For the first hello-world setup, some package folders may exist only as placeholders or README-level stubs.

## Chosen Defaults

- package manager: `pnpm`
- app framework: `Next.js`
- UI layer: `React`
- language: `TypeScript`
- first test runner: `Vitest`
- local workflow: native local development first
- container workflow: add a `Dockerfile` for parity, but do not require Docker for day-to-day frontend work

## Local Development

The local workflow should support:

- cloning the repository
- installing dependencies
- starting the web app
- running lint and tests
- loading documented environment variables
- seeding local baseline tenant data later

The first milestone is a working hello-world app with a documented setup path.

Docker is a secondary workflow for parity and future deployment confidence, not the default inner loop.

See `docs/architecture/environment-and-cloud.md` for the initial environment, Vercel, and Supabase conventions.

## Git Workflow

- Use feature branches for changes.
- Use pull requests for review.
- Keep changes small and vertical when possible.
- Commit often in logical units so the history stays readable and reversible.
- Protect the main branch once CI exists.

## CI Baseline

GitHub Actions should eventually validate:

- install
- typecheck
- lint
- tests
- build

The first CI iteration can be minimal, but it should prove the end-to-end repository workflow with the hello-world app.

## Documentation Workflow

- Store architecture decisions under `docs/architecture`.
- Store ADRs under `docs/decisions`.
- Store future product and BDD feature specs under `docs/product`.
- Update docs when a design decision changes, not weeks later.

## Suggested Near-Term Milestones

1. Create the base repo structure.
2. Add the hello-world React and TypeScript app.
3. Add local run instructions.
4. Add initial GitHub Actions for build validation.
5. Add preview deployment integration.
6. Add local seed strategy for real and demo tenants.
7. Add documented environment and cloud naming conventions.

## Non-Goals For The First Scaffold

- Full product feature implementation
- Finalized onboarding or invitation flow
- Advanced role catalog
- Production-grade offline sync

## Open Questions

- whether preview deployments should be required on every pull request from day 1
- when to introduce local Supabase into the default setup path
