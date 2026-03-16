# Local Approvals

## Purpose

This document defines how Sail Tracker models club-specific operational permissions.

A local approval is not the same as a public certification.

- a certification comes from an external body and represents a skill the person holds regardless of club
- a local approval is a decision made by the club that this person may operate in this context under these conditions

Local approvals exist because clubs have operational knowledge about their members, their waters, and their vessels that no external body can provide.

## Why This Area Matters

Without a structured model for local approvals, clubs fall back on informal systems:

- verbal approvals that nobody can audit
- spreadsheets that go stale
- role assignments that bundle eligibility with unrelated permissions
- no clear record of what was granted and why

The product should replace those patterns with an explicit, auditable, lifecycle-managed model.

## Scope

This area owns:

- local approval definitions (what the club grants)
- operating limit dimensions attached to approvals
- responsible-sailor eligibility rules
- approval workflow layers
- approval lifecycle states
- one-off exceptions and their boundaries
- grant authority model

This area does not own:

- certification definitions or the catalog of external qualifications
- skill recognition or informal experience records
- the trip departure validation logic itself
- vessel identity or vessel-side restrictions
- membership identity or role bundles

Those remain in their own areas.

## Aggregate Root

`local_approval` -- a club-granted operational permission that allows a person to act as responsible sailor in a specific context, with operating limit dimensions and a lifecycle state.

## Who Uses It

- qualification managers granting, reviewing, and revoking approvals
- responsible sailors checking their eligibility for a vessel or trip type
- trip operators seeing why a departure is blocked by a missing approval
- club administrators auditing exception history

## Requires

- [membership-and-onboarding.md](../members/membership-and-onboarding.md) -- person identity to hold the approval
- [vessel-registry.md](../fleet/vessel-registry.md) -- vessel and class scope for approval dimensions
- [certifications-and-catalog.md](certifications-and-catalog.md) -- certifications referenced as prerequisites

## Enhanced By

- [trip-departure-and-validation.md](../trips/trip-departure-and-validation.md) -- responsible-sailor validation at departure
- [vessel-classes-and-restrictions.md](../fleet/vessel-classes-and-restrictions.md) -- class-level approval scope

## Key Concepts

### Local Approval

A club-granted operational permission that allows a person to act as responsible sailor in a specific context.

A local approval is tenant-scoped. It carries meaning only within the club that issued it.

### Operating Limit Dimensions

Each approval may carry limits that constrain how broadly it applies. The product should support these dimensions:

- **Vessel scope** — specific vessel, vessel class, or all vessels
- **Area scope** — defined sailing area or zone
- **Time scope** — valid from, valid until, or seasonal restrictions
- **Crew requirements** — minimum crew count, required crew qualifications
- **Weather limits** — wind range, visibility, sea state ceilings
- **Supervision requirement** — must operate with a named supervisor or approved observer present
- **Trip type scope** — day sailing only, no overnights, no racing, no commercial trips

A person may hold an approval that is valid in all dimensions simultaneously, or only in a narrow combination of them.

### Responsible-Sailor Eligibility

A person is eligible to act as responsible sailor for a given trip when all of the following hold:

- active membership in the tenant
- the operational permission to create or depart a trip (`trip.depart`)
- a local approval that covers the vessel, area, trip type, and other applicable dimensions
- all required certifications referenced by that approval are current
- no operating limit in the approval blocks the planned trip

If any condition fails, the person is not eligible for that trip. Departure validation will block.

### Grant Authority

Grant authority is the tenant-defined permission to define, grant, review, and revoke local approvals and exceptions.

This is a permission, not a hardcoded role. The product should not assume that only a person titled "instructor" or "board member" holds this authority.

Examples:

- `approval.grant_local`
- `approval.revoke_local`
- `approval.grant_exception`

These permissions may be bundled into a Qualification Manager role, but the permission is the real source of truth.

### Club Levels As Labels

Some clubs assign internal sailing levels (e.g., "Level 1", "Solo Certified", "Cruising Member").

These levels are labels on top of explicit approval meaning. The product should not treat a level string as the authorization logic itself. The operating limits and eligibility rules are the truth; the level label is a communication convenience.

## Approval Workflow

The approval lifecycle follows these stages:

1. **Submit** — a person or administrator submits an approval request for review
2. **Verify** — required certifications and prerequisites are confirmed as present and current
3. **Evaluate** — the person with grant authority reviews the case and decides
4. **Grant with limits** — the approval is issued, with applicable operating limit dimensions attached
5. **Review, renew, or revoke** — the approval is revisited when it expires or when the club's rules change

## Approval Lifecycle States

- **Active** — the approval is valid and the person may use it for eligible trips
- **Expired** — the approval has passed its validity date or a required certification has lapsed
- **Revoked** — the approval was withdrawn explicitly before expiry, with an audit record

An expired approval is not the same as a revoked one. The product should distinguish them and record the reason for revocation separately.

## Exception Model

### What An Exception Is

A one-off exception is an explicit grant that allows a specific action despite the normal approval rules not being fully satisfied.

Examples:

- allow a member to depart as responsible sailor for one specific trip, even though their formal local approval is still pending
- allow a trip to use a vessel outside the normally approved area, for a specific justified occasion

### What An Exception Is Not

An exception is not a silent workaround. It is not a shortcut that bypasses the model invisibly.

An exception does not:

- become a permanent approval
- carry over to future trips
- silently upgrade the person's standing

The product must keep exceptions clearly separate from approvals.

### Exception Recording

Every granted exception must record:

- what rule or approval was overridden
- who granted the exception
- when the exception was granted
- which trip or action it applies to
- an optional reason or note

This record must remain auditable after the trip completes.

### Exception Boundaries

Exceptions may override:

- a missing local approval for a specific trip
- an operating limit dimension for a specific trip (e.g., area, time, supervision)

Exceptions may not override:

- required certifications that carry legal weight (e.g., VHF license, first aid if mandated)
- vessel out-of-service status
- vessel capacity limits
- platform-level rules

The club may configure which dimensions are exceptionable and which are hard limits.

## Relationship To Departure Validation

Departure validation assumes approvals are already present and correct for a normal trip.

The exception path activates only when departure validation finds a blocking condition that a person with grant authority has explicitly chosen to override.

That means:

- optimize for the normal case (data up to date, approval present, trip departs cleanly)
- treat exception as an explicit act, not a convenience escape

See [trip-departure-and-validation.md](../trips/trip-departure-and-validation.md).

## Business Rules

- A local approval is tenant-scoped and carries no meaning outside the issuing club.
- A person must hold an active local approval covering all applicable dimensions to be eligible as responsible sailor.
- An approval must reference which certifications are required; those certifications must be current for the approval to remain active.
- Grant authority is permission-based, not role-hardcoded.
- Approval lifecycle states are active, expired, and revoked. These are distinct and must not be conflated.
- A revoked approval must record a reason and the identity of the revoker.
- An exception is scoped to a specific trip or action. It does not modify the person's standing or create a new approval.
- Every exception must be recorded with what was overridden, who granted it, when, and for which trip.
- Exceptions may not override hard limits such as required legal certifications or vessel out-of-service status.
- Club levels are labels. The operating limits attached to approvals are the authoritative eligibility logic.
- The product must optimize for the normal case. Exceptions must feel deliberate, not routine.

## Cross-References

- [certifications-and-catalog.md](certifications-and-catalog.md)
- [skills-and-recognition.md](skills-and-recognition.md)
- [membership-and-onboarding.md](../members/membership-and-onboarding.md)
- [permissions-and-roles.md](../members/permissions-and-roles.md)
- [trip-departure-and-validation.md](../trips/trip-departure-and-validation.md)
- [vessel-registry.md](../fleet/vessel-registry.md)
- [vessel-classes-and-restrictions.md](../fleet/vessel-classes-and-restrictions.md)
- [tenant-settings.md](../../platform/tenant-settings.md)
