# Environment And Cloud Setup Baseline

This document defines the initial environment strategy for Sail Tracker.

## Goals

- Keep local setup simple.
- Keep cloud project naming predictable.
- Avoid ad hoc environment variable drift.
- Make it obvious how Vercel and Supabase should map to this repository.

## Environment Files

The repository should keep:

- `.env.example` for documented variables
- `.env.local` for local development only

Never commit real secrets.

## Initial Environment Variables

Current baseline variables are documented in `.env.example`.

They cover:

- app identity
- supported locales
- tenant routing defaults
- Supabase connection values
- initial platform admin bootstrap

See `docs/architecture/supabase-bootstrap.md` for how these values map to the first Supabase setup.

## Local Development Baseline

For now:

- local development uses the web app running natively
- Supabase can point to a hosted project first
- local Supabase is a later option, not a day-1 requirement

This keeps the first setup path short while preserving room for a fuller local environment later.

## Vercel Naming

Recommended initial naming:

- Vercel project: `sail-tracker-web`
- production domain: root project domain later
- preview deployments: default Vercel preview URLs

Recommended Vercel environments:

- `Production`
- `Preview`
- `Development`

## Supabase Naming

Recommended initial project split:

- development project: `sail-tracker-dev`
- production project: `sail-tracker-prod`

If a separate staging environment is needed later:

- staging project: `sail-tracker-staging`

## Tenant Seed Baseline

Initial tenant seed assumptions:

- real tenant slug: `club`
- demo tenant slug: `demo`

These are placeholders and can be renamed once the first real club identity is finalized.

See `docs/architecture/tenant-bootstrap.md` for the initial bootstrap sequence and ownership baseline.

## Language Baseline

Initial supported locales:

- `en`
- `da`

Use English as the technical default and keep Danish ready from day 0.

## Admin Bootstrap Baseline

The environment should support bootstrapping:

- one initial platform admin
- one real tenant
- one demo tenant

The detailed bootstrap implementation can come later, but the environment model should leave room for it now.

## Open Questions

- whether Vercel project-per-app remains sufficient if the repo grows beyond one frontend
- when to add local Supabase to the default onboarding path
- whether tenant domain configuration belongs in app settings, platform settings, or both
