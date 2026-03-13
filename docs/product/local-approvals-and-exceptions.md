# Local Approvals And Exceptions

## Purpose

This document defines how a club grants local operational approvals and how it handles exceptional departures or overrides.

It separates two different ideas:

- normal local approval
- one-off exception

The goal is to keep the product registration-first and validation-first, while still supporting the real-world cases where a club needs to make an explicit exception.

## Why This Area Matters

Many clubs do not rely only on public certificates.
They also apply local operational judgment.

Examples:

- a member may sail only inside a local bay
- a member may use training dinghies but not larger vessels
- a member may sail only with supervision
- a leader may allow one specific trip despite a missing normal approval

If the system does not distinguish between normal approval and special exception, clubs will either:

- overuse free-text workarounds
- or get trapped in unnecessary workflow friction

## Core Outcome

The product should make it easy to answer:

- what this club normally allows a person to do
- what operating limits apply
- whether a departure is allowed because of a normal approval or a special exception
- who granted that exception and why

## Scope

This area covers:

- tenant-scoped operational approvals
- approval dimensions and limits
- grant and review authority
- one-off exceptions
- operational override boundaries
- audit expectations for exceptions

This area does not own:

- public certification catalogs
- person identity
- trip lifecycle
- trip validation as a whole
- tenant permission bundles in general

Those remain in their own areas.

## Core Principle

The default mode of the product should be:

- clubs register approvals in advance
- trip validation checks those approvals
- normal valid trips depart without special approval flow

Exceptions should exist, but they should be explicit and less common than ordinary approvals.

## Normal Local Approval

A local approval is a tenant-scoped operational permission granted to a person.

Examples:

- may sail training dinghies in local waters
- may take vessel class X out without supervision
- may lead day trips but not overnight trips
- may use a named vessel only with a second qualified person onboard

This is the approval layer the product should trust during normal trip validation.

## Approval Dimensions

Local approvals should support explicit dimensions such as:

- vessel scope
- vessel class scope
- area scope
- time or daylight limits
- supervision requirements
- trip type limits
- guest or crew limits later

This keeps approvals meaningful and explainable.

## Grant Authority

The product should not hardcode one title like "trainer" or "leader" as the only approver.

Instead, the system should allow tenant-defined permission to:

- define approval rules
- grant local approvals
- review or revoke local approvals
- issue one-off exceptions

This keeps the product permission-based while still fitting club language.

## Approval Lifecycle

Useful lifecycle stages for a local approval include:

- `draft` or proposed later if needed
- `active`
- `expired`
- `revoked`

The simplest useful baseline is `active`, `expired`, and `revoked`.

## One-Off Exceptions

A one-off exception is not the same as a local approval.

A one-off exception means:

- the person does not fully satisfy the normal rule set
- the club still allows one specific operational action
- the decision should be explicit and auditable

Examples:

- allow this one trip to depart with a named responsible sailor
- allow departure despite a non-standard supervision arrangement
- allow a narrow temporary exception for one vessel and one time window

## Exception Boundaries

The product should allow exceptions only where the club intends them.

Examples of possible exception boundaries:

- may override missing local approval
- may not override vessel out-of-service state
- may not override severe safety-critical blocking conditions later
- may override a warning-level issue that the tenant treats as exceptional but allowable

This should connect to tenant settings and departure validation.

## Exception Recording

If an exception is granted, the product should preserve:

- what was overridden
- who granted it
- when it was granted
- what trip or action it applied to
- optional reason or note

This should be easy to capture and easy to review later.

## Relationship To Departure Validation

Departure validation should assume local approvals are already present in the normal case.

If validation fails because required approval is missing, the product may support an explicit exception path where tenant policy allows it.

Important rule:

- exceptions should be explicit departures from the normal approval model
- they should not silently become normal approval records unless the club chooses to convert them later

See also [`trip-validation-and-departure-rules.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-validation-and-departure-rules.md).

## Relationship To Qualification Model

Qualification Model defines the broader qualification family.

This document goes deeper on:

- tenant-local operational approvals
- how they are granted
- how exceptions differ from approvals

Important rule:

- external certificates may support a local approval
- badges may support progression
- but the local approval remains the operational fact the trip workflow trusts

## Relationship To Tenant Settings

Tenant settings should be able to influence:

- who may grant local approvals
- who may grant exceptions
- which kinds of exceptions are allowed
- whether reasons are mandatory
- whether some exceptions require secondary review later

Tenant settings should not turn every normal departure into a manual approval workflow.

## Relationship To Audit And Reporting

Normal approvals and exceptions should both be reportable later, but they are not the same thing.

Useful future reporting questions include:

- how many active local approvals exist
- how many departures used exceptions
- which exception types are most common
- which vessels or contexts generate the most overrides

That reporting should help clubs improve the normal rule set over time.

## Business Rules

- Local approvals belong to exactly one tenant.
- Local approvals should express operational meaning, not only informal labels.
- Normal trip validation should rely on active local approvals where relevant.
- One-off exceptions should be scoped to a specific operational action, trip, or narrow context.
- Exceptions should be explicit, auditable, and less common than normal approvals.
- An exception should not silently become a standing approval.
- Tenants should be able to decide who may grant approvals and who may grant exceptions.

## Product Outcome

If this area is working well, the club should experience:

- clearer local operating rules
- fewer manual workarounds
- safer handling of unusual cases
- a trustworthy distinction between "normally approved" and "allowed this one time"
