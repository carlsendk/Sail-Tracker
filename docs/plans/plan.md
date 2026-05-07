# Local Development And Deployment Plan

This plan captures the next environment and delivery work for Sail Tracker.

## Goal

Establish a reproducible local development setup with Supabase, then add a safe production deployment flow where database changes and web deployment move together.

## Current Findings

1. Local Supabase is partially configured but not a supported workflow.
2. The bootstrap script currently assumes hosted Supabase secret keys.
3. CI validates the app only and does not validate database migrations or seed data.
4. There is no production deploy workflow that coordinates Supabase migrations with Vercel deployment.
5. The repository still has minor drift between the documented env contract and compatibility fallbacks in code.

## Principles

- Prefer one reproducible local path over ad hoc hosted-only development.
- Keep hosted and local Supabase differences explicit in env handling.
- Validate database state in CI before adding production deployment automation.
- Apply database changes before production web deploys.
- Keep rollout steps small and reversible.

## Phase 0: Code Quality Foundation

Establish the code-quality bar that every subsequent change must clear before this codebase has product code in it.

Scope:

- TypeScript strict mode at the most aggressive level the codebase tolerates (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`)
- ESLint flat config with type-aware rules: typescript-eslint strict + stylistic, react, react-hooks, jsx-a11y/strict, @next/next, import, unicorn, sonarjs, promise, deprecation, regexp, security, no-secrets, anti-trojan-source, jsdoc, perfectionist, no-only-tests, react-refresh, mdx, vitest, testing-library, jest-dom, playwright, @eslint-community/eslint-comments, unused-imports, package-json, yml
- Architectural-boundary enforcement via `eslint-plugin-boundaries` matching the `packages/{domain,application,infrastructure,ui,testkit}` + `apps/web` layout
- Custom rules: no inline SVG (use `packages/ui/src/icons/`), `data-testid` required on interactive elements outside test files
- Prettier (formatting) and Stylelint (CSS) configured and enforced
- markdownlint + cspell + markdown-link-check on the `/docs` tree
- syncpack + manypkg for monorepo dependency consistency
- Pre-commit hooks via husky + lint-staged
- Conventional Commits enforced via commitlint, which feeds the existing Release Please workflow (`.github/workflows/release-please.yml` + `.release-please-config.json`) — every `feat:`/`fix:` commit on `main` updates `CHANGELOG.md` and bumps `release-please-manifest.json` automatically. Future product code in `packages/*` may need release-please's monorepo mode; address that when product-tier work begins, not in Phase 0.
- Vitest + React Testing Library + Playwright wired up; coverage thresholds set
- knip + dependency-cruiser for unused-export and circular-dep detection
- gitleaks + audit-ci + CodeQL for secrets, vuln, and security scanning in CI
- CI workflow runs lint, typecheck, test, knip, dep-cruise, markdownlint, cspell, gitleaks, audit
- Branch protection on main requires the CI checks

Success condition:

- `pnpm validate` runs lint + typecheck + test locally and matches CI
- Any PR that violates a rule fails CI
- Conventions documented in `docs/architecture/code-quality.md`

## Phase 1: Local Supabase As A Supported Dev Path

Deliver a working local path based on the Supabase CLI.

Scope:

- add documented scripts for `supabase start`, `supabase stop`, `supabase status`, and `supabase db reset`
- document the local ports and local Studio usage
- document how migrations and `supabase/seed.sql` are applied locally
- make the bootstrap flow work against local Supabase as well as hosted Supabase

Success condition:

- a new developer can start local Supabase, reset the database, bootstrap baseline data, and run the web app without pointing at a hosted project

## Phase 2: Environment Contract Cleanup

Make environment handling explicit for both hosted and local modes.

Scope:

- define the hosted env contract using `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`
- define the local env contract using CLI-provided local credentials where required
- add a small resolver layer so the app and bootstrap logic can choose the correct key set by environment
- remove unnecessary legacy fallbacks once the supported local path is clear

Success condition:

- there is one documented env contract for hosted development and one for local development, with no ambiguity about which keys are expected

## Phase 3: Database Validation In CI

Add database validation before production deployment automation.

Scope:

- install and run Supabase CLI in GitHub Actions
- start local Supabase in CI
- run migrations and seed data on a fresh local database
- execute application checks against that database-backed environment

Success condition:

- CI fails if migrations, seed data, bootstrap, or database-dependent app behavior are broken

## Phase 4: Production Deployment Flow

Add a GitHub-driven production deployment pipeline.

Scope:

- define the promotion rule, likely merge to `main`
- run validation before deploy
- apply Supabase migrations to production
- run a post-migration smoke check
- deploy the web app to Vercel after database changes succeed
- document rollback expectations for failed migrations or failed web deploys

Success condition:

- a production release updates both Supabase and Vercel in the correct order with clear failure boundaries

## Recommended Implementation Order

1. add local Supabase scripts and docs
2. update env resolution to support hosted and local setups cleanly
3. add CI database validation
4. add production deploy automation

## Open Questions

- whether local development should default to local Supabase or keep hosted Supabase as an allowed fallback
- whether GitHub Actions should fully own Vercel production deployment or only gate Vercel’s native Git integration
- whether preview environments should eventually get isolated Supabase branches or continue using a shared development project

## Documentation Hosting

- The `/docs` hierarchy now hydrates through the main Next.js app using Nextra, so the Markdown under `docs/` can be previewed at `http://localhost:3030/docs` (and the route already appears in the current `app` shell).
- We intentionally keep the rendered layout simple for now (just a TOC + article shell) to unblock the workflow while Supabase, tenant, and CI automation are being nailed down.
- Follow-up work: add theme polish, hook up the curated navigation, and align the Doc UX with the platform stack once the underlying routes are stable.
