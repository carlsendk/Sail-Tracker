# Invitations And Onboarding

## Purpose

This document defines how people enter Sail Tracker and become usable participants in a tenant.

It covers the main entry paths for:

- first tenant owner
- invited members
- platform-created access
- later self-serve member onboarding

The goal is to make identity, membership, and permissions become operationally useful without mixing all entry paths into one generic signup flow.

## Why This Area Matters

The product needs to support several very different ways a person may appear:

- the first club owner created during bootstrap
- an invited member joining an existing club
- an instructor or admin belonging to multiple clubs
- a guest participating on a trip without joining

If those paths are collapsed into one onboarding flow, the product will either become too rigid or too confusing.

## Core Outcome

The product should make it easy to answer:

- how does a new club owner enter the system
- how does an existing member join a tenant
- when does a person get membership versus only an account
- when does a person receive permission bundles
- what is the minimum path to become operationally usable

## Scope

This area covers:

- invitation flows
- first-login onboarding
- membership creation at join time
- tenant-specific join paths
- bootstrap owner entry path
- later self-serve join patterns

This area does not own:

- guest participation on trip manifests
- qualification granting
- permission model semantics
- tenant bootstrap process in full

Those remain in connected docs.

## Core Principle

The product should treat onboarding as several distinct entry flows, not one universal signup.

The main distinction is:

- account creation
- profile completion
- tenant membership creation
- permission bundle assignment

Those may happen together or separately depending on the flow.

## Entry Paths

### 1. Bootstrap Owner Entry

This is the first person for a new tenant.

Typical flow:

- platform or bootstrap process creates the tenant
- the designated owner receives access
- first login creates or confirms platform identity
- tenant membership is created
- owner permission bundle is assigned

This should be the shortest path to an operational club owner.

### 2. Tenant Invitation

This is the normal member-administered join path.

Typical flow:

- tenant admin invites by email
- invited person accepts
- account is created or linked
- tenant membership is created
- default or selected permission bundle is assigned

This should support both:

- first-time users
- existing platform users joining another tenant

### 3. Platform-Assisted Access

This is for special cases such as:

- platform admin setup help
- support bootstrap
- later controlled migration or import flows

This should stay distinct from ordinary member invitation.

### 4. Self-Serve Join Later

Some clubs may later want self-serve join or request-to-join flows.

That should remain optional and tenant-controlled.

The product should not assume self-serve join is always enabled.

## Onboarding Stages

The useful stages are:

- `invited`
- `account linked or created`
- `profile minimally ready`
- `tenant membership active`
- `permission bundle assigned`
- `operationally usable`

The system should be able to tell which step is missing.

## Minimum Operational Readiness For A Person

The minimum useful end state for a member is usually:

- can sign in
- has a tenant membership
- has the required permission bundle for their intended actions
- has enough profile data for the club's operational use

Not every person needs the same depth immediately.

Examples:

- a trip operator may need more operational readiness than a read-only member
- a future responsible sailor will also need qualification and approval, but that is not part of onboarding itself

## Existing User Joining Another Tenant

This is an important flow.

The system should support:

- one account
- multiple tenant memberships
- different permission bundles per tenant

So an existing user joining another club should not be forced through a full fresh signup experience.

## Invitation Model

An invitation should normally carry:

- target tenant
- invited email
- intended bundle or role later if useful
- inviter
- invitation expiry later if useful

Useful outcomes:

- accepted
- expired
- revoked

## Profile Completion During Onboarding

The product should avoid forcing every optional profile field during the first join.

Useful approach:

- collect only the minimum needed at join time
- allow tenant policy to require more later
- allow the member to complete profile data in stages

This keeps the join flow lighter while still supporting operational quality.

## Relationship To Memberships And Identity

Memberships and identity define what a person and a tenant membership are.

This document defines how that relationship gets created through onboarding flows.

See also [`memberships-and-identity.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/memberships-and-identity.md).

## Relationship To Permissions And Role Bundles

Onboarding should assign or connect the relevant permission bundle, but should not redefine permission semantics.

Examples:

- owner invite gets tenant owner bundle
- normal member invite gets member or operator bundle later if used

See also [`permissions-and-role-bundles.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/permissions-and-role-bundles.md).

## Relationship To Tenant Bootstrap

Tenant bootstrap is the broader flow that creates a usable tenant.

This document focuses on the person-entry side of that process.

That is why it should come before `tenant-bootstrap-and-setup.md`.

## Relationship To Guests

Guests should remain separate from onboarding.

Important rule:

- a guest on a manifest is not automatically a member
- a guest does not need to pass through onboarding just to appear on a trip

If a guest later becomes a real member, that should be a deliberate conversion path.

## Business Rules

- A person may have one platform identity and multiple tenant memberships.
- Invitation should create or connect tenant membership, not duplicate the person.
- Permission bundles should attach when membership becomes active.
- Bootstrap owner flow should be distinct from ordinary invitation flow.
- Self-serve join should be optional and tenant-controlled.
- Guests should remain outside onboarding unless deliberately converted into members.

## Product Outcome

If this area is working well, the club should experience:

- less confusion about how people get into the system
- faster tenant setup
- cleaner member administration
- smoother multi-tenant participation for shared users
- less friction between identity, permissions, and operational use
