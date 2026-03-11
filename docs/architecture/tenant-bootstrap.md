# Tenant Bootstrap Baseline

This document defines the initial bootstrap and seed strategy for tenants, memberships, and top-level administration.

## Goals

- Make the first environment predictable.
- Keep demo and real-tenant data clearly separated.
- Ensure the first platform admin and first tenant owners are well-defined.
- Leave room for a fuller onboarding flow later without reworking the foundation.

## Initial Bootstrap Targets

The first usable environment should include:

- one platform admin
- one real tenant
- one demo tenant

These records should exist consistently in development and production bootstrapping, even if their exact contents differ by environment.

## Platform Admin Bootstrap

Initial assumptions:

- one initial platform admin is created from `PLATFORM_ADMIN_EMAIL`
- platform admins are not tied to a single tenant
- more platform admins can be added later through application workflows

The initial bootstrap should assign platform permissions directly or through the `platform_admin` role bundle.

## Tenant Bootstrap

Create these two baseline tenants:

### Real Tenant

- slug: `club`
- purpose: first real operating tenant placeholder
- state: `active`
- seeded minimally

The real tenant should start with just enough data to validate setup paths without pretending to be demo content.

### Demo Tenant

- slug: `demo`
- purpose: onboarding, product demonstration, preview environments, and manual testing
- state: `active`
- seeded with realistic sample data

The demo tenant should feel like a believable sailing club environment, not empty scaffolding.

## Ownership Bootstrap

- The real tenant must have at least one `tenant_owner`.
- The demo tenant must have at least one `tenant_owner`.
- In the first bootstrap design, the same account may temporarily own both tenants if needed.
- Ownership remains tenant-scoped even if the same user belongs to multiple tenants.

## Membership Bootstrap

At minimum, bootstrap should create:

- one platform admin identity
- one owner membership for the real tenant
- one owner membership for the demo tenant

Optional later expansion:

- additional demo members
- role variations inside the demo tenant
- qualification and vessel sample data

## Seed Data Rules

- Seed data must always include tenant IDs explicitly.
- Seed data must never rely on implicit global context.
- Demo data should be safe to expose in previews and test environments.
- Real-tenant seed data should stay minimal and obviously non-demo.

## Demo Tenant Content Guidelines

The demo tenant should eventually include:

- a recognizable tenant name
- a few vessels
- a few members
- sample trip history
- localized content patterns for `en` and `da`

The purpose is to demonstrate the intended shape of the app without revealing any real organization data.

## Provisioning Flow Assumptions

For now, the intended high-level order is:

1. create or identify the platform admin
2. create the real tenant
3. create the demo tenant
4. create tenant-owner memberships
5. attach baseline tenant configuration
6. load demo-only sample data

This is a planning sequence, not yet an implementation script.

## Future Workflow Direction

Later, creating a tenant should:

- create the tenant
- assign the creator as the first tenant owner
- attach baseline permissions
- create default tenant configuration

That workflow is intentionally not implemented yet, but the bootstrap model should align with it.

## Open Questions

- Whether the same identity should own both `club` and `demo` in the first production bootstrap.
- Whether the real tenant should exist in preview environments or only in development and production.
- Whether demo tenant data should be resettable on demand.
