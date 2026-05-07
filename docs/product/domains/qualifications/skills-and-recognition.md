# Skills And Recognition

## What Problem Does This Solve?

Sailing clubs want to track what members have learned, which capabilities they have developed, and which external or internal badges they have earned — without those facts automatically controlling who may operate a vessel.

Without a distinct model for skills and recognition, clubs face two failure modes:

- Recognition collapses into permissions, making every badge a gate and creating unnecessary friction.
- Recognition is tracked nowhere, making progression and learning invisible.

This area provides a home for tracked capabilities and earned recognition that is separate from operational permission-granting.

## Who Uses It?

- Members who want to see their own learning progress, earned badges, and tracked skills.
- Instructors and qualification managers who record skills and award badges after training or assessments.
- Club administrators who configure the local skill catalog and badge catalog.
- The system, when surfacing member profiles or informing local approval decisions.

## What Does It Own?

- Skill definitions: trackable sailing capabilities with a name, description, and optional competency notes.
- Skill records: a record that a specific member holds a specific skill, with source and date.
- Badge definitions: title, source system (official or tenant-local), description, and optional skill or learning outcomes.
- Earned badge records: which badge, when earned, awarded by whom or which system, optional notes.
- Badge catalogs: the official DDS catalog, tenant-local catalogs, and the coexistence of both.
- Badge usage rules: recognition display, learning progression markers, scout or youth milestones, profile visibility.
- Tenant configuration of which skills and badges are tracked locally.

## What Does It NOT Own?

- Operational sailing permission or departure eligibility. That belongs to [local-approvals.md](local-approvals.md).
- Formal certifications issued by external authorities. That belongs to [certifications-and-catalog.md](certifications-and-catalog.md).
- Permission bundles or role assignments. Those belong to the permissions model.
- Trip validation logic. That consumes eligibility facts produced elsewhere.

Skills and badges are recognition and learning tools. They are not gate-keeping mechanisms unless a club explicitly maps one to an approval rule.

## Requires

- [membership-and-onboarding.md](../members/membership-and-onboarding.md) — skills and badges attach to tenant memberships.
- [tenant-settings.md](../../platform/tenant-settings.md) — controls which skill and badge catalogs are active locally.

## Enhanced By

- [certifications-and-catalog.md](certifications-and-catalog.md) — certifications are the formal, authority-issued counterpart to skills and badges.
- [local-approvals.md](local-approvals.md) — a club may choose to reference specific skills as building blocks when configuring a local approval rule.

## Key Concepts

### Skills

A skill is a tracked capability that the club or system recognizes a member has demonstrated.

Examples:

- navigation planning
- seamanship and boat handling
- engine handling and basic fault diagnosis
- anchoring
- harbor maneuvering
- safety drill competence

Skills are not permissions. Holding a skill does not automatically entitle a member to operate any vessel. Skills describe what a member has shown they can do, and may inform human judgment or local approval configuration.

Skills are separate from both badges and certifications:

- A badge may reference skills as learning outcomes, but a badge is a recognition event, not a skill record.
- A certification is issued by an external authority with formal validity. A skill is a capability tracked within the club's own model.

### Badge Definitions

A badge definition is a named recognition artifact with:

- title
- source system: either the official DDS catalog or a tenant-local catalog
- description of what the badge represents
- optional skill or learning outcomes it is associated with

### Badge Catalogs

Two catalogs can coexist:

- Official catalog: DDS badges and other nationally recognized recognition markers.
- Tenant-local catalog: club-created badges for their own progression, youth programs, scout milestones, or internal recognition.

Both are valid and both may be active in the same tenant.

Platform-seeded official definitions should be adoptable by the tenant. Tenant-local definitions are owned entirely by the club.

### Earned Badge Records

An earned badge record captures:

- which badge definition was earned
- which member earned it
- when it was earned
- the awarding source (instructor, system, external upload)
- optional notes

Earned badge records are append-only recognition events. They do not change in response to permission changes or skill updates.

### Badge Usage

Badges serve recognition, learning progression, and profile visibility purposes.

Examples of valid badge usage:

- displaying a member's earned DDS badges on their profile
- marking completion of an internal course or club training program
- recording scout sailing milestones
- showing a member's learning journey to instructors

Important rule: a badge must not automatically grant operational sailing permission unless the club has explicitly configured an approval rule that references that badge. Recognition and operational eligibility remain separate.

## Business Rules

- A skill record must reference a defined skill in the tenant's active skill catalog.
- A badge record must reference a defined badge in either the official catalog or the tenant's active local catalog.
- Both the DDS badge catalog and a tenant-local badge catalog may be active in the same tenant simultaneously.
- Skills do not grant operational sailing eligibility by themselves.
- Badges do not grant operational sailing eligibility by themselves.
- A club may configure a local approval rule that uses a skill or badge as a contributing factor, but that mapping is explicit and optional.
- Earned badge records should be auditable and not silently deleted.
- Tenant settings control which skill catalogs and badge catalogs are active for a given club.
- Platform-seeded official badge definitions may not be modified by tenants, only adopted or ignored.
- Tenant-local badge definitions are fully owned and configurable by the club.

## Cross-References

- [certifications-and-catalog.md](certifications-and-catalog.md) — formal, authority-issued certifications
- [local-approvals.md](local-approvals.md) — operational eligibility decisions, optionally informed by skills
- [membership-and-onboarding.md](../members/membership-and-onboarding.md) — member identity and tenant membership
- [tenant-settings.md](../../platform/tenant-settings.md) — tenant configuration of skill and badge catalog usage
