# Permissions And Roles

## Purpose

This document defines how Sail Tracker should represent authorization.

The core rule is:

- permissions are the real source of truth
- roles are reusable bundles of permissions

This keeps the product flexible enough for different clubs without hardcoding every behavior to one title such as "skipper", "trainer", or "admin".

## Why This Area Matters

Different clubs use different language for authority and responsibility.

Examples:

- owner
- club admin
- trainer
- instructor
- vessel-responsible member
- qualified member
- trip operator

If the product treats those labels as the real authorization model, the system will become brittle quickly.

The product instead needs to answer:

- what may this person do
- in which tenant
- at which scope
- through which bundle of permissions

## Core Outcome

The product should make it easy to answer:

- what actions a person can perform
- which permission bundle gave them that authority
- whether the authority is platform-wide or tenant-scoped
- which bundles a club uses by default
- which permissions matter for operational actions such as trips, approvals, and membership management

## Scope

This area covers:

- permission definitions
- role or bundle definitions
- platform-scope versus tenant-scope access
- assignment of bundles to people or memberships
- guidance for operational and admin permission families

This area does not own:

- person identity
- qualification meaning
- vessel rules
- trip validation rules
- tenant configuration details themselves

Those remain in their own areas.

## Aggregate Root

`permission_bundle` -- a named, reusable group of permissions that can be assigned to a platform identity or tenant membership.

## Who Uses It

- tenant owners assigning permission bundles to members
- platform administrators managing platform-scoped access
- club administrators deciding which bundles to adopt or customize
- all users implicitly, as every action is gated by permissions

## Requires

- [membership-and-onboarding.md](membership-and-onboarding.md) -- tenant membership to attach permissions to

## Enhanced By

- [tenant-settings.md](../../platform/tenant-settings.md) -- bundle adoption and label customization
- [local-approvals.md](../qualifications/local-approvals.md) -- operational eligibility (distinct from workflow permission)

## Core Principle

Permissions should represent actions.

Examples:

- `trip.create`
- `trip.depart`
- `membership.manage`
- `approval.grant_local`
- `tenant.configure`

Role bundles should group those actions into useful default packages.

Examples:

- `tenant_owner`
- `trip_operator`
- `qualification_manager`

That means role names are convenience and communication tools, not the deepest source of truth.

## Permission Scopes

The product should distinguish at least two scopes:

### Platform Scope

Platform-scoped permissions apply above any single tenant.

Examples:

- create tenant
- manage platform admins
- manage domain mapping
- support tenant bootstrap

These should be rare and tightly controlled.

### Tenant Scope

Tenant-scoped permissions apply only within one club.

Examples:

- manage members
- configure tenant settings
- create and operate trips
- grant local approvals
- manage vessels and assets

These should attach to tenant membership, not just to the global account.

## Role Bundle Model

The cleanest model is:

- define permissions individually
- define reusable bundles
- assign bundles to platform identity or tenant membership as appropriate

This gives the system:

- explicit actions
- human-friendly package names
- easier customization later

## Suggested Permission Families

The exact set will evolve, but the families should stay clear.

### Platform Administration

Examples:

- `platform.tenant.create`
- `platform.tenant.manage`
- `platform.admin.manage`
- `platform.support.access`

### Tenant Administration

Examples:

- `tenant.configure`
- `membership.manage`
- `membership.invite`
- `permissions.assign`

### Trip Operations

Examples:

- `trip.create`
- `trip.update`
- `trip.depart`
- `trip.complete`
- `trip.cancel`
- `trip.view_all`

### Qualification And Approval

Examples:

- `qualification.catalog.manage`
- `qualification.record.manage`
- `approval.grant_local`
- `approval.revoke_local`
- `approval.grant_exception`

### Fleet And Assets

Examples:

- `fleet.manage`
- `asset.manage`
- `asset.lend`
- `asset.book`

## Suggested Default Role Bundles

These should be treated as defaults, not permanent law.

### Platform Admin

Platform-scoped bundle for:

- tenant creation
- platform support
- platform admin management

### Tenant Owner

Tenant-scoped bundle for broad club control.

Likely includes:

- tenant configuration
- membership management
- permission assignment
- trip oversight
- qualification and approval administration
- fleet and asset administration

### Trip Operator

Operational bundle for people who can create and run trips.

Likely includes:

- create trip
- edit trip
- depart trip
- complete trip

This should still be separate from qualification eligibility.

### Qualification Manager

Administrative bundle for people who maintain qualification records and approvals.

Likely includes:

- manage qualification records
- grant local approvals
- revoke local approvals

### Asset Or Fleet Manager

Administrative bundle for people who manage boats, equipment, or shared resources.

Likely includes:

- manage vessels
- manage assets
- manage bookings or lending

## Permission Assignment Model

Platform permissions should attach to platform-level identity.

Tenant permissions should attach to tenant membership.

This matters because the same person may:

- be a platform admin
- be a tenant owner in one club
- be only a normal member in another club

The system should support that without confusion.

## Operational Roles Versus Eligibility

This distinction is critical:

- permission says whether a person may use or administer a workflow
- qualification or local approval says whether a person may act as responsible sailor for a given vessel or context

Examples:

- a person may have `trip.create` but still not be eligible to sail a specific vessel
- a person may hold a local sailing approval but not have permission to manage memberships

This separation should remain visible throughout the product.

## Relationship To Memberships And Identity

Memberships and identity define who the person is and which tenant they belong to.

This area defines what those memberships are allowed to do.

See also [membership-and-onboarding.md](membership-and-onboarding.md).

## Relationship To Tenant Settings

Tenant settings may later allow clubs to:

- adopt default bundles
- rename bundle labels in club language
- decide who may assign bundles
- decide whether some permissions are more tightly restricted

But tenant settings should not remove the underlying permission model.

## Relationship To Local Approvals

Local approvals and exceptions are operational eligibility facts, not generic permission bundles.

Important rule:

- the permission to grant an approval is authorization
- the approval itself is operational eligibility

See also [local-approvals.md](../qualifications/local-approvals.md).

## Business Rules

- Permissions should represent actions, not job titles.
- Role bundles should group permissions without replacing them as the source of truth.
- Platform-scoped permissions should stay separate from tenant-scoped permissions.
- Tenant-scoped permissions should attach to tenant membership.
- The same person may hold different bundles in different tenants.
- Workflow permission should remain separate from sailing eligibility.
- Clubs may use their own language for bundles, but the system should preserve stable permission semantics underneath.

## Product Outcome

If this area is working well, the product should feel:

- easier to configure across different clubs
- safer to administer
- clearer about who may do what
- more stable as the product grows
