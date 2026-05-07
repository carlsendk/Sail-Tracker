# Tenant Bootstrap And Setup

## Purpose

This document defines how a new tenant becomes a usable club in Sail Tracker.

It focuses on the first setup journey from:

- tenant created
- first owner gets access
- baseline data exists
- club can start operating

The goal is to make the first real club setup predictable without forcing every long-term admin concern into the bootstrap flow.

## Why This Area Matters

The product already assumes:

- one platform admin
- one real tenant
- one demo tenant

But the product still needs a clear model for how a tenant becomes operationally usable.

Without that, these questions stay fuzzy:

- who creates the tenant
- how the first owner gets in
- what minimum setup is required
- what comes from platform seed versus club setup

## Core Outcome

The product should make it easy to answer:

- how a tenant is created
- how the first owner is established
- what minimum records and defaults are created
- when a tenant is considered ready for real use

## Scope

This area covers:

- tenant creation baseline
- owner bootstrap
- baseline tenant defaults
- demo versus real tenant expectations
- minimum usable setup state

This area does not own:

- detailed invitation flow
- long-term tenant administration
- qualification semantics
- trip workflow semantics

Those remain in connected docs.

## Core Principle

Bootstrap should produce a usable tenant with the minimum stable baseline.

That means:

- enough structure to operate
- no fake completeness
- no need to configure everything before first use

The product should separate:

- platform bootstrap responsibility
- first owner entry
- later tenant administration

## Bootstrap Actors

The main actors are:

- `platform_admin`
  Creates or provisions the tenant.
- `first tenant owner`
  Receives the tenant and performs initial club-specific setup.

Bootstrap should not assume a broad set of tenant users already exists.

## Minimum Bootstrap Output

A new usable tenant should include at least:

- tenant record
- tenant slug and domain baseline
- active tenant state
- first tenant owner membership
- owner permission bundle
- baseline tenant configuration

The tenant does not need every optional catalog, vessel, or member before it is considered created.

## Bootstrap Sequence

The clean sequence is:

1. create the tenant
2. assign initial owner identity
3. create owner tenant membership
4. assign owner permission bundle
5. attach baseline tenant defaults
6. mark tenant ready for first owner setup

After that, the first owner can:

- configure club settings
- invite members
- add vessels
- adopt qualification catalogs
- enable or tune workflows

## Real Tenant Versus Demo Tenant

The product should distinguish these clearly.

### Real Tenant

Real tenant bootstrap should be minimal and obviously real-use oriented.

That means:

- no fake trip history by default
- no noisy sample data
- just enough structure to let the owner continue setup

### Demo Tenant

Demo tenant bootstrap should include richer sample content for:

- previews
- walkthroughs
- testing
- manual evaluation

That means bootstrap rules are shared, but the seeded depth differs.

## Baseline Tenant Defaults

A newly created tenant should receive stable defaults such as:

- default locale
- default calendar/feed baseline
- default permission bundle availability
- baseline trip workflow settings
- baseline catalog adoption state later

These defaults should make the club operable without pretending every decision is already customized.

## Owner Bootstrap

The first owner path should be explicit and short.

Typical outcome:

- owner receives access
- owner signs in
- owner completes minimum personal setup
- owner lands in a setup-ready tenant

The owner should not need platform admin intervention for normal next steps after successful bootstrap.

See also [`membership-and-onboarding.md`](../domains/members/membership-and-onboarding.md).

## Setup Milestones

A useful setup progression is:

- `tenant created`
- `owner active`
- `baseline defaults attached`
- `club setup in progress`
- `operationally ready`

Examples of "operationally ready" later may include:

- at least one vessel exists
- at least one owner can create trips
- basic workflow settings are usable

The exact threshold can evolve, but the progression should stay understandable.

## Relationship To Platform Administration

Platform administration owns:

- tenant creation authority
- domain and lifecycle controls
- demo tenant management

This document focuses on the product flow after that platform action creates a tenant.

See also [`platform-administration.md`](./platform-administration.md).

## Relationship To Tenant Settings

Tenant settings own the longer-lived club configuration after bootstrap.

This includes:

- trip settings
- catalogs
- defaults
- reference data

Bootstrap should establish the starting point, not replace tenant administration.

See also [`tenant-settings.md`](./tenant-settings.md).

## Relationship To Permissions

Bootstrap must assign the first owner enough authority to continue setup safely.

That means:

- owner membership exists
- owner permission bundle exists
- bootstrap does not rely on ad hoc hidden access

See also [`permissions-and-roles.md`](../domains/members/permissions-and-roles.md).

## Relationship To Seeded Data

Some data should come from the platform as shared baseline or reference:

- public certification catalogs later
- demo content for the demo tenant

Other data should remain tenant-owned from the start:

- club members
- vessels
- local approvals
- tenant-specific defaults

Bootstrap should keep that distinction obvious.

## Business Rules

- Every tenant must have at least one tenant owner after bootstrap.
- Real tenant bootstrap should remain minimal and not depend on rich demo data.
- Demo tenant bootstrap may include richer seeded content.
- Bootstrap should assign permissions through normal permission bundles, not hidden exceptions.
- A tenant should be usable after bootstrap even if deeper configuration is still incomplete.
- Tenant bootstrap should stay separate from long-term tenant administration.

## Product Outcome

If this area is working well, the product should experience:

- clearer tenant creation responsibilities
- faster first-owner setup
- less confusion between platform and tenant administration
- a cleaner path from new tenant to first real operational use
