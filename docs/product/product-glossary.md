# Product Glossary

## Purpose

This glossary defines the canonical product language for Sail Tracker.

Its job is to keep product docs, BDD slices, UI copy, database naming, and implementation discussions aligned.

If a term has a defined meaning here, other docs should prefer that meaning instead of inventing alternatives.

## How To Use This Document

- use these terms consistently across product docs
- prefer one term over several near-synonyms
- if a new important term appears repeatedly, add it here
- if a term is ambiguous, narrow it before implementation starts

## Core Platform Terms

### `platform`

The whole Sail Tracker product across all tenants.

Use this when talking about:

- platform administration
- shared catalogs
- cross-tenant infrastructure

Do not use it when you mean one club.

### `tenant`

One club or organization operating inside the platform.

A tenant owns:

- its members and memberships
- its vessels
- its assets
- its trips
- its local configuration

In most product language, a tenant is the same thing as a club unless we need to distinguish the technical term from the user-facing one.

### `club`

The user-facing concept for a tenant.

Use `club` in member-facing and operational product descriptions.
Use `tenant` when talking about system boundaries, multi-tenancy, and permissions.

### `demo tenant`

A seeded tenant intended for evaluation, demos, and walkthroughs.

It follows the same product model as a real tenant, but may contain richer sample data.

### `platform admin`

A platform-scoped user who can perform platform-level administration.

This is not the same thing as a tenant owner.

## Identity And Access Terms

### `account`

The sign-in identity for a person in the platform.

An account may be connected to one or more tenant memberships over time.

### `profile`

The person-level record connected to an account.

A profile describes the person across the platform.
It is not the same thing as tenant membership.

### `membership`

The relationship between a profile and a tenant.

Membership is where tenant participation lives.

Examples:

- this person belongs to club A
- this person is an owner in club B

### `tenant owner`

A tenant-scoped user who has enough permission to configure and operate the club at a high level.

This is the first normal administrative role inside a tenant.

### `permission`

The smallest useful unit of allowed action in the system.

Permissions are the source of truth.
Roles are bundles of permissions.

### `role bundle`

A reusable collection of permissions.

Roles are a convenience and operating model, not the source of truth for authorization.

### `responsible sailor`

The person operationally responsible for taking the vessel out on a trip.

This is a trip-level concept, not necessarily a permanent organizational title.

Do not automatically replace this with `skipper` everywhere, because clubs may use different wording.

### `skipper`

A common club word for the person leading or operating the trip.

In product language, it usually maps to the `responsible sailor` role on a trip, but the canonical operational term should remain `responsible sailor`.

### `guest`

A trip participant who does not need a full member account or membership in order to appear on the manifest.

### `qualified member`

A member who has the necessary approvals or qualifications to act in a more capable sailing role.

This is not a permission bundle by itself.
It is an operational capability state derived from qualifications and approvals.

## Calendar And Operational Terms

### `calendar`

The shared operational schedule of the tenant.

Calendar owns:

- time-based placement
- operational state in time
- shared visibility
- schedule-driven conflicts and availability

It does not own every detail of the underlying domain record.

### `calendar item`

A time-bound operational record shown in the shared schedule.

Examples:

- trip
- maintenance slot
- inspection
- readiness task

### `activity category`

The operational kind of calendar item.

Examples:

- trip
- maintenance
- inspection
- task
- seasonal work

### `calendar state`

The time-based operational state of a scheduled item.

Examples:

- planned
- active
- completed
- overdue
- cancelled

### `schedule availability`

Whether a shared resource is free or blocked in a time window according to calendar-backed operational state.

### `operational view`

A cross-domain view focused on current attention, action, or situational awareness rather than one domain’s internal data model.

Examples:

- active trips
- overdue tasks
- blocked vessels

### `search`

The ability to find a known or partly known record such as a trip, vessel, member, or asset.

Search is distinct from operational dashboards and attention views.

## Trip Terms

### `trip`

The domain record for one sailing outing or comparable operational sailing activity.

Trip owns trip-specific detail.
Calendar owns the time-based timeline and shared operational visibility.

### `trip draft`

An early trip record before it is treated as a fully scheduled operational plan.

### `planned trip`

A trip that has entered the shared operational schedule and is expected to happen.

### `active trip`

A trip that has departed and is currently underway.

### `completed trip`

A trip that has been reported back and closed operationally.

### `overdue trip`

A trip whose expected return has passed without completion being recorded.

### `trip manifest`

The list of people onboard or associated with a trip in an operational participation sense.

It includes members and guests.

### `trip story`

A narrative summary associated with a completed trip.

It is not the source-of-truth operational record.

### `incident`

A structured record of a notable operational event connected to a trip.

It is not the same thing as a general note.

### `trip note`

A non-incident observation or summary detail attached to a trip.

## Fleet And Asset Terms

### `vessel`

A named boat or sailing craft tracked by a tenant.

### `vessel class`

An operational grouping of vessels that may carry shared restrictions, expectations, or qualification relevance.

This is more than just a display label.

### `vessel readiness`

A composed operational fact describing whether a vessel is ready, warning, or blocked for use.

This is derived from several areas such as:

- fleet expectations
- required equipment
- tasks and inspections
- asset assignment

### `asset`

A tracked physical thing or bookable resource managed by a tenant that is not itself the vessel.

Examples:

- engine
- radio
- trailer
- tent
- clubhouse resource

### `asset category`

A grouping of assets by purpose or kind.

Examples:

- safety equipment
- vessel component
- shared gear
- bookable facility

### `assignment`

Where an asset belongs by default or is currently attached at a domain level.

Examples:

- assigned to vessel
- assigned to location
- shared pool

Assignment is not the same thing as booking.

### `booking`

A time-bound reservation or use of a resource.

Booking is calendar-backed.

### `lending`

Physical custody of an item leaving its normal storage or shared pool for use.

Lending is not the same thing as permanent assignment.

## Qualification And Approval Terms

### `qualification`

The broad domain of certifications, approvals, skills, and badges related to sailing capability.

### `certification`

A formal or public credential, often from outside the club.

In this product, some public certifications may be seeded from Denmark-oriented catalogs.

### `approval`

A club-recognized operational allowance to do something.

Approvals are what trips should normally trust operationally.

### `local approval`

A tenant-specific approval granted by the club.

This is separate from public certification.

### `exception`

A one-off or narrowly scoped allowance outside the normal approval path.

An exception does not silently become a standing approval.

### `badge`

A recognition or progression marker, such as a sea scout badge.

Badges are not automatically permissions or approvals.

### `skill`

A capability or competency the club wants to track.

Skills may support approvals, badges, or development, but are not identical to any of them.

## Media And Story Terms

### `media item`

A photo or video stored and attached to a product record such as a trip.

### `gallery`

The set of media items attached to a trip.

### `story visibility`

The intended audience for a trip story.

This may differ from raw trip record visibility.

### `media visibility`

The allowed audience for a media item.

This may be narrower than ordinary trip visibility because media may contain sensitive content.

## Cross-Cutting Terms

### `backbone area`

A product area that provides shared structure for the rest of the system.

Current backbone areas are:

- Calendar And Scheduling
- Identity, Access, And Configuration

### `core domain`

A major business area with its own rules and language.

Examples:

- Trips
- Fleet
- Equipment And Assets
- Qualifications

### `supporting module`

An optional or enrichening capability that plugs into a backbone area or core domain without replacing it.

Examples:

- weather in trip context
- route planning and harbors
- incidents
- media gallery
- trip story

### `operating mode`

A different way of using the same product workflows.

Example:

- kiosk mode

This is not a separate domain.

## Preferred Term Choices

Use these terms consistently:

- use `tenant` for system boundary, `club` for user-facing descriptions
- use `responsible sailor` as the canonical operational term, even if clubs say `skipper`
- use `membership` for person-to-club relationship, not `user role`
- use `approval` for operational allowance, not `certificate` unless you mean a formal certification
- use `incident` for structured notable events, not for all trip notes
- use `calendar state` for time-based operational states
- use `booking` for time-bound reservation and `assignment` for default belonging

## Terms To Avoid Or Use Carefully

- avoid using `role` when you really mean `permission`
- avoid using `member` when you really mean `profile` or `membership`
- avoid using `boat owner` as a general platform term unless you mean a real club-specific concept
- avoid using `history` without clarifying whether you mean calendar timeline history, trip record history, or audit history
- avoid using `status` by itself when `calendar state`, `readiness state`, or `lifecycle state` would be more precise
