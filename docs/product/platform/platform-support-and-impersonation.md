# Platform Support And Impersonation

## Purpose

This document defines how platform-level support access should work across tenants in Sail Tracker.

It exists because real support needs sometimes require visibility into a tenant’s state, but the product must not weaken tenant isolation, privacy, or auditability just to make support convenient.

## Why This Area Matters

The platform already assumes:

- multiple tenants
- platform admins
- tenant owners
- permission-based access

But the product still needs a clear answer to:

- when platform support may access tenant context
- what “impersonation” actually means
- what should be audited
- what should require explicit reason or approval

Without that clarity, the product risks one of two bad outcomes:

- support is too weak to solve real problems
- support is too broad and quietly bypasses tenant trust

## Core Product Outcome

The product should make it easy to answer:

- what support actions are possible across tenants
- who performed them
- why they were performed
- whether they were read-only or mutating
- whether the tenant can later review that access

## Scope

This area covers:

- platform support access to tenant context
- support visibility versus impersonation
- reason capture and audit requirements
- support actions that are read-only versus state-changing
- reviewability of support access later

This area does not own:

- general platform administration
- tenant-local permissions
- ordinary tenant operations
- hidden bypasses outside the permission model

## Core Principle

Support access should be explicit, minimal, auditable, and purpose-bound.

That means:

- no silent cross-tenant browsing
- no casual use of production data for curiosity
- no support action without traceability
- no hidden “god mode” that bypasses product rules invisibly

## Support Access Levels

The cleanest model is to distinguish several support levels.

### 1. Platform Metadata Access

Access to platform-level tenant information without entering tenant business data deeply.

Examples:

- tenant exists
- tenant domain configuration
- tenant lifecycle state
- feature or configuration status later

This is the least sensitive support level.

### 2. Tenant Context Read Access

Support can inspect tenant state in order to help diagnose a problem.

Examples:

- tenant configuration
- failed setup state
- missing or inconsistent records
- visible workflow state

This should still be scoped and auditable.

### 3. Impersonation Or Act-As Access

Support temporarily enters the product as if operating within the tenant context, often to reproduce or diagnose a user-facing issue.

This is more sensitive than normal read access because it changes how the product behaves and what is visible.

### 4. Support Mutation Access

Support changes tenant state to fix or complete something.

Examples:

- correct a broken bootstrap state
- repair a configuration issue
- help complete a blocked platform-level setup step

This should be rarer and more tightly controlled than ordinary inspection.

## Visibility Versus Impersonation

These must stay distinct.

### Support Visibility

Support can inspect information directly as a support user with support-specific affordances and audit context.

This is preferable when:

- reading configuration
- diagnosing data shape
- reviewing a failed workflow

### Impersonation

Support temporarily experiences the tenant context as another user or role would.

This is preferable when:

- reproducing a permissions issue
- verifying an onboarding problem
- confirming what a tenant owner or member actually sees

The product should not treat these as the same thing.

## Recommended Rule For Impersonation

Impersonation should be:

- explicit
- time-bound
- reason-tagged
- auditable
- visually obvious in the UI later

Support should not quietly “become” another user without the product making that state visible.

## Audit Requirements

Every support access event should be reviewable later.

At minimum, the audit model should capture:

- who performed the access
- when the access started
- when it ended later
- which tenant was involved
- what support mode was used
- reason or ticket reference later
- whether any state was changed

This is one of the most important product guarantees in a multi-tenant system.

## Tenant Trust Model

Tenants should be able to trust that support access is exceptional, not normal.

Good product behavior later may include:

- tenant-visible audit log of support access
- indication that a platform support session occurred
- clear distinction between internal admin work and tenant-owner activity

The product does not need to expose every low-level system detail, but it should not hide the fact that support entered tenant context.

## Permission Model Relationship

Platform support access must still live inside the permission model.

That means:

- support access is granted through platform-scoped permissions
- support visibility and impersonation may be separate permissions
- mutation support should be even more restricted

Examples later:

- `platform.support.read`
- `platform.support.impersonate`
- `platform.support.mutate`

This keeps support actions aligned with the same permission-first approach used elsewhere in the product.

## Relationship To Platform Administration

Platform administration defines who may perform support actions and under what conditions.

This document focuses on the support boundary itself:

- how support works
- what types exist
- what must be auditable

It should remain connected to, but separate from, the broader platform administration area.

## Relationship To Tenant Owners

Tenant owners should remain the normal administrative authority inside a club.

Platform support should not replace them for ordinary local administration.

Support is appropriate for:

- platform-created tenant issues
- broken setup states
- permission or onboarding diagnosis
- platform-level troubleshooting

Support is not the normal route for:

- everyday club operations
- casual tenant configuration changes
- routine use of the tenant as if it belonged to the platform team

## Read Versus Mutating Support

The product should treat mutating support more carefully than read-only support.

Good distinction:

- read-only support helps inspect and understand
- mutating support changes tenant state

Mutating support should likely require:

- stronger permission
- clearer justification
- stronger audit markers

## Support Session Model

If support sessions exist later, the product should make them bounded.

Useful session properties include:

- started by a platform admin
- attached to tenant
- attached to reason
- explicit end
- visible support mode while active

This helps avoid indefinite “temporary” access that becomes normal practice.

## Business Rules

- Platform support access must be explicit and auditable.
- Support visibility and impersonation must remain distinct concepts.
- Platform support permissions must remain separate from tenant-local permissions.
- Mutating support access should be more restricted than read-only inspection.
- Tenant isolation should not be bypassed silently for convenience.
- Support activity should be reviewable later by the platform and, where appropriate, by the affected tenant.
