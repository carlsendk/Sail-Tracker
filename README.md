# Sail Tracker

Foundation-first repository for a multi-tenant sailing club platform.

## Current Baseline

- `Next.js` with `React` and `TypeScript`
- `pnpm` workspace
- hello-world app under `apps/web`
- package placeholders for domain, application, infrastructure, UI, and testkit
- architecture docs under `docs/`
- GitHub Actions CI
- `Dockerfile` for runtime parity

## Local Development

1. Use Node.js `22` from `.nvmrc`.
2. Run `corepack enable` if `pnpm` is not already available on your machine.
3. Install dependencies with `pnpm install`.
4. Copy `.env.example` to `.env.local` and fill in the current values you need.
5. Run `pnpm hooks:install` to enable repository Git hooks.
6. Start the app with `pnpm dev`.
7. Open `http://127.0.0.1:3002`.

The installed hooks enforce:
- `pnpm validate` before commit
- Conventional Commit subjects in `git commit`

## Scripts

- `pnpm dev`
- `pnpm validate`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Docs

Start with `docs/README.md`.
For day-to-day work, use `docs/developer-guide.md`.

## Releases

This repository uses Semantic Versioning and GitHub-based release automation.
See `docs/developer-guide.md` for commit and release conventions.
