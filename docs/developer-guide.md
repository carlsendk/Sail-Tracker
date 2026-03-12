# Developer Guide

This guide explains how to work in the Sail Tracker repository today.

## Purpose

Use this guide for:

- local setup
- day-to-day development workflow
- validation commands
- commit and pull request discipline
- knowing where to put code and documentation

For architectural decisions, start with `docs/README.md`.

## Current Stack

- `Next.js`
- `React`
- `TypeScript`
- `pnpm`
- `Vitest`
- `GitHub Actions`
- `Dockerfile` for runtime parity

## Repository Shape

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

Current intent:

- `apps/web`: running frontend and app shell
- `packages/domain`: domain model and core business rules
- `packages/application`: use cases and orchestration
- `packages/infrastructure`: adapters such as Supabase integration
- `packages/ui`: shared UI code when it becomes justified
- `packages/testkit`: fixtures and shared test helpers

## Local Setup

1. Use Node.js `22` from `.nvmrc`.
2. Run `corepack enable` if `pnpm` is not already installed on your machine.
3. Run `pnpm install`.
4. Copy `.env.example` to `.env.local`.
5. Fill in the environment values you currently need.
6. Run `pnpm dev`.
7. Open `http://127.0.0.1:3002`.

## Validation Commands

Run these before pushing meaningful changes:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm bootstrap:supabase` when the first Supabase project is configured

If `pnpm` is not available globally, use:

- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm test`
- `corepack pnpm build`

## Daily Workflow

1. Pull the latest `main`.
2. Create a small feature branch.
3. Read the relevant docs before changing code.
4. Make one logical change at a time.
5. Validate locally.
6. Commit in small units.
7. Open a pull request.

## Commit Discipline

Commit often in logical units.

Good commit boundaries:

- one architecture or docs decision
- one scaffold improvement
- one feature slice
- one test fix
- one refactor with no behavior change

Avoid mixing these in one commit:

- repo tooling changes
- architecture decisions
- feature implementation
- broad formatting-only changes

## How To Add New Work

### Add Architecture Or Product Context

- architecture decisions go in `docs/architecture`
- ADRs go in `docs/decisions`
- future feature specs go in `docs/product`

### Add Code

- put business rules in `packages/domain`
- put use-case orchestration in `packages/application`
- keep external service integration in `packages/infrastructure`
- keep the app shell and route-level behavior in `apps/web`

### Add Features

Before adding a real feature:

1. define the slice in product or BDD terms
2. confirm domain terms and permissions
3. add or update docs if the design changes
4. implement the smallest vertical slice
5. add tests at the right layer

## Documentation Source Of Truth

Read these first:

1. `docs/architecture/nfrs.md`
2. `docs/architecture/tenant-model.md`
3. `docs/architecture/tenant-bootstrap.md`
4. `docs/architecture/permissions-model.md`
5. `docs/architecture/i18n.md`
6. `docs/architecture/environment-and-cloud.md`
7. `docs/architecture/repo-workflow.md`

## Skills

Project-specific Codex skills live under `.codex/skills`.

Current skills cover:

- BDD feature slicing
- DDD and multi-tenant modeling
- platform stack conventions
- SOLID and KISS implementation rules

Use them when shaping or implementing work so the repo stays internally consistent.

## Environment Notes

- `.env.example` is the documented baseline
- `.env.local` is for local-only values
- do not commit secrets
- local Supabase is not required yet
- the first hosted bootstrap path uses `pnpm bootstrap:supabase`

## Docker

Docker exists for parity, not as the primary inner loop.

Current expectation:

- develop natively
- use the `Dockerfile` when container validation is useful
- do not force Docker for routine frontend iteration

## Current Baseline Status

As of now, the repository already has:

- a hello-world app
- passing lint
- passing typecheck
- passing tests
- passing production build

## Next Expected Areas

The next likely pieces of work are:

- Supabase bootstrap design
- environment mapping for cloud setup
- tenant seed and ownership implementation
- Vercel project setup
