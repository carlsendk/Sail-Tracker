# Supabase Bootstrap Baseline

This document defines the minimal Supabase setup that supports a tenant-aware hello world without blocking later product work.

## Goal

Create the smallest viable data and bootstrap model that supports:

- tenant resolution by subdomain or custom domain
- one platform admin
- one real tenant
- one demo tenant
- tenant ownership
- future extension into permissions and member identity

This is not the full application schema.

## Minimal First Scope

The first Supabase-backed version only needs to answer these questions:

- which tenant is this request for
- does this tenant exist and is it active
- who is the initial platform admin
- who owns the tenant

Everything else can grow from there.

## Minimal Initial Tables

Start with these tables:

1. `tenants`
2. `tenant_domains`
3. `profiles`
4. `memberships`
5. `roles`
6. `permissions`
7. `role_permissions`
8. `membership_roles`
9. `profile_roles`

This is slightly more than the bare minimum, but it avoids repainting the foundation once permissions are wired in.

## Table Intent

### `tenants`

Purpose:

- one row per club

Initial fields:

- `id`
- `slug`
- `name`
- `status`
- `default_locale`
- `created_at`
- `updated_at`

Notes:

- `slug` is used for the initial `club` and `demo` tenants
- `status` should support at least `active` and `suspended`

### `tenant_domains`

Purpose:

- resolve requests to a tenant by hostname

Initial fields:

- `id`
- `tenant_id`
- `hostname`
- `is_primary`
- `is_custom`
- `created_at`

Notes:

- `club.localhost` and `demo.localhost` can be the first development examples
- later custom domains fit here without changing tenant identity

### `profiles`

Purpose:

- application-level profile for an authenticated user

Initial fields:

- `id`
- `auth_user_id`
- `email`
- `display_name`
- `preferred_locale`
- `created_at`
- `updated_at`

Notes:

- `auth_user_id` should map to Supabase Auth users
- keep this light for now

### `memberships`

Purpose:

- connect a profile to a tenant

Initial fields:

- `id`
- `tenant_id`
- `profile_id`
- `status`
- `created_at`
- `updated_at`

Notes:

- one profile can belong to multiple tenants later
- tenant ownership should not live directly on the profile

### `roles`

Purpose:

- define role bundles

Initial fields:

- `id`
- `scope`
- `key`
- `name`
- `is_system`

Notes:

- initial system roles: `platform_admin`, `tenant_owner`
- `scope` should distinguish `platform` and `tenant`

### `permissions`

Purpose:

- define explicit permissions

Initial fields:

- `id`
- `scope`
- `key`
- `name`

### `role_permissions`

Purpose:

- map permissions to a role

Initial fields:

- `role_id`
- `permission_id`

### `membership_roles`

Purpose:

- assign a role bundle to a membership

Initial fields:

- `membership_id`
- `role_id`

Notes:

- for platform roles, either allow a platform-scoped membership record or introduce a later dedicated assignment table

### `profile_roles`

Purpose:

- assign platform-scoped role bundles directly to a profile

Initial fields:

- `profile_id`
- `role_id`

## Minimal Seed Data

Seed in SQL:

- `roles`
- `permissions`
- `role_permissions`
- `tenants`
- `tenant_domains`

Seed in a bootstrap script or controlled setup step:

- initial profile for `PLATFORM_ADMIN_EMAIL`
- memberships for `club` and `demo`
- role assignment for the initial owner memberships
- platform admin assignment

Why split it this way:

- stable reference data fits SQL migrations well
- user bootstrap depends on environment-specific email values

## Initial Seed Content

### Tenants

- `club`
- `demo`

### Domains

Development examples:

- `club.localhost`
- `demo.localhost`

Later production examples:

- `club.<root-domain>`
- `demo.<root-domain>`

### Roles

- `platform_admin`
- `tenant_owner`

### Permissions

Minimum initial permissions:

- `platform.tenants.manage`
- `platform.admins.manage`
- `tenant.settings.manage`
- `tenant.members.manage`
- `tenant.roles.manage`
- `tenant.permissions.manage`

## How `PLATFORM_ADMIN_EMAIL` Is Used

Use `PLATFORM_ADMIN_EMAIL` only for bootstrap.

High-level flow:

1. find or create the auth user
2. create or update the matching profile
3. assign platform admin privileges
4. create memberships in `club` and `demo` if desired
5. assign `tenant_owner` for the baseline tenants

This keeps the environment-specific user creation outside static SQL seed files.

The current bootstrap script is:

- `pnpm bootstrap:supabase`

## Tenant Resolution

Resolve tenant in this order:

1. exact hostname match in `tenant_domains`
2. fallback handling for local development if explicitly allowed
3. reject unresolved tenant context

For local development:

- prefer hostnames such as `club.localhost:3002` and `demo.localhost:3002`
- if browser or OS setup makes that awkward, allow a temporary dev fallback later, but do not build the core model around query-string or path-based tenant identification

## Development Vs Production Environment Mapping

Development:

- Supabase project: `sail-tracker-dev`
- tenant hostnames: `club.localhost`, `demo.localhost`
- `PLATFORM_ADMIN_EMAIL` points to the initial development admin

Production:

- Supabase project: `sail-tracker-prod`
- tenant hostnames use the real root domain or approved custom domains
- `PLATFORM_ADMIN_EMAIL` only used during first bootstrap or controlled recovery

## What We Do Not Need Yet

- trip tables
- boats
- qualification records
- invitation workflows
- custom role builder
- full RLS policy design

Those can be added after tenant resolution and baseline identity are working.

## First Implementation Sequence

1. create initial migration for the minimal tables
2. seed roles, permissions, tenants, and domains
3. add bootstrap step for `PLATFORM_ADMIN_EMAIL`
4. add tenant resolution helper in the app shell
5. render tenant-aware hello world

## Success Condition

The first Supabase milestone is successful when:

- the app can resolve `club` and `demo`
- the app can confirm tenant status from Supabase
- the app can identify the initial platform admin and tenant owners
- the hello-world screen can display the resolved tenant context
