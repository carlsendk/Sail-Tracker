# Platform Baseline

Use this reference when clarifying the default stack for Sail Tracker.

## Required Accounts

- `GitHub`: repository hosting, pull requests, branch protections, and integration point for deployment.
- `Vercel`: hosts the React web app and preview environments.
- `Supabase`: provides Postgres, Auth, Storage, and tenant-safe row-level security.

## Why This Stack

- `React` is the default UI technology for the PWA.
- `TypeScript` keeps domain and UI contracts explicit.
- `Supabase` removes a large amount of backend setup for multi-tenant auth and persistence.
- `Vercel` keeps deployment simple for a frontend-heavy product.
- `GitHub` keeps review and delivery simple.

## Constraints

- Keep the first version deployable with only these three external accounts.
- Avoid adding custom backend hosting unless there is a proven limitation.
- Keep core domain logic portable so the stack can evolve later without rewriting business rules.
