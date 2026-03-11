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
5. Start the app with `pnpm dev`.
6. Open `http://localhost:3000`.

## Scripts

- `pnpm dev`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Docs

Start with `docs/README.md`.
For day-to-day work, use `docs/developer-guide.md`.
