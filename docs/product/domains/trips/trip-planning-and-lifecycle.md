# Trip Planning And Lifecycle

## What Problem Does This Solve

Many clubs manage trips informally through memory, paper notes, chat messages, or spreadsheets. That breaks down quickly when multiple vessels are in use, youth members or guests are onboard, trips overlap, or someone needs to confirm whether a vessel is back.

This area replaces that fragmentation with one tenant-scoped trip record connected to the tenant's operational schedule.

## Who Uses It

- `tenant_owner` -- club-level oversight and configuration
- `skipper` or `qualified member` -- creates, starts, and manages trips
- `vessel-responsible member` -- visibility into trips involving a specific vessel
- `crew member` -- participates in trips, may view trip history
- `guest` -- appears on the manifest without needing a full member account
- `kiosk user` -- simplified shared-device flow for create, start, and report-back

## What This Area Owns

**Aggregate root: Trip**

This area owns:

- trip identity and metadata (title, tenant, notes)
- trip lifecycle states and transitions
- vessel assignment for a trip
- responsible sailor assignment
- planned start and planned return times
- the minimum trip creation flow
- expandable trip module integration points
- club configuration of trip workflow

## What This Area Does Not Own

- vessel configuration and vessel rules -- see [vessel-registry.md](../fleet/vessel-registry.md)
- crew manifest structure -- see [trip-manifest-and-guests.md](trip-manifest-and-guests.md)
- departure validation rules -- see [trip-departure-and-validation.md](trip-departure-and-validation.md)
- completion workflow and safety checklists -- see [trip-completion-and-reporting.md](trip-completion-and-reporting.md)
- recurring trip patterns -- see [trip-series-and-recurring.md](trip-series-and-recurring.md)
- qualification catalog definition -- see [certifications-and-catalog.md](../qualifications/certifications-and-catalog.md)
- weather forecasting -- see [weather-in-trip-context.md](../../modules/weather-in-trip-context.md)
- logbook browsing and search -- see [search-and-operational-views.md](../../backbone/search-and-operational-views.md)

## Requires

- [membership-and-onboarding.md](../members/membership-and-onboarding.md) -- responsible sailor identity, crew selection, guest model
- [vessel-registry.md](../fleet/vessel-registry.md) -- vessel assignment, capacity
- [calendar-and-scheduling.md](../../backbone/calendar-and-scheduling.md) -- scheduling, time-based state, conflict visibility

## Enhanced By

- [trip-manifest-and-guests.md](trip-manifest-and-guests.md) -- crew and guest handling
- [trip-departure-and-validation.md](trip-departure-and-validation.md) -- pre-departure checks
- [trip-completion-and-reporting.md](trip-completion-and-reporting.md) -- report-back flow
- [trip-series-and-recurring.md](trip-series-and-recurring.md) -- recurring patterns
- [local-approvals.md](../qualifications/local-approvals.md) -- responsible-sailor eligibility
- All trip modules (weather, route, incidents, media, trip story)

## Key Concepts

### Minimum Trip Principle

The product should make it easy to create the simplest possible real trip:

- choose vessel
- choose responsible sailor
- set departure time
- set expected return time
- add manifest entries as needed
- leave now
- report back home

The system should not force every club into a heavy expedition-style workflow for a simple local sail.

### Trip Lifecycle States

- `draft` -- incomplete working record, safe to edit freely
- `planned` -- ready for execution, visible in the calendar schedule, not yet departed
- `active` -- underway
- `overdue` -- expected return has passed without completion
- `completed` -- trip is closed and logged after the skipper reports back home
- `cancelled` -- trip will not occur, but remains part of the record

The calendar should surface those time-based states in the shared operational schedule.

### Responsible Sailor

The person accountable for the trip in the system.

The product should not assume every responsible sailor is modeled only as a club "skipper" role. Clubs may think in terms of skipper, watch leader, boat owner, or qualified member allowed to sail independently.

The model should separate:

- permission to operate the workflow (trip.create, trip.depart)
- qualification to take a specific vessel out (local approvals, certifications)

### Expandable Trip Modules

Trips support optional modules that can be turned on or required by tenant configuration:

- weather information -- see [weather-in-trip-context.md](../../modules/weather-in-trip-context.md)
- route planning -- see [route-planning-and-harbors.md](../../modules/route-planning-and-harbors.md)
- incidents -- see [incidents.md](../../modules/incidents.md)
- gallery and video -- see [media-gallery.md](../../modules/media-gallery.md)
- trip story -- see [trip-story.md](../../modules/trip-story.md)

These modules should enrich the trip area without making the minimum trip flow slow or difficult.

## Core Workflows

### 1. Create Trip Draft

The user creates an initial trip record and places it into the shared operational schedule.

The draft should capture:

- trip title
- tenant
- vessel
- responsible sailor
- planned start
- planned return
- initial crew manifest
- optional route and notes

The emphasis is speed and correctness, not full reporting.

In practice, the trip should move from `draft` to `planned` before it is treated as an operationally scheduled trip.

### 2. Start Trip

Starting a trip changes it from a scheduled plan into an operational fact.

This is the "go on trip now" action from the calendar-backed workflow.

Once active, the system should make it obvious that:

- the vessel is out
- the expected return time matters
- the trip should appear in active-trip views and alerts

### 3. Overdue Detection

A trip becomes `overdue` when the expected return time passes and the trip has not been reported back as completed. Active and overdue trips must be visible without needing a search.

## Business Rules

- Every trip belongs to exactly one tenant.
- A trip can only reference members and vessels from the same tenant.
- A vessel cannot be assigned to overlapping active or planned trips unless the tenant explicitly supports an override policy later.
- The responsible sailor must satisfy the vessel's required qualification policy before the trip can depart.
- Crew count must not exceed vessel capacity.
- A trip must have a planned start and planned return before it can depart.
- A trip should not disappear from the logbook because it was later edited or corrected.
- Guest participants may be recorded even when they do not have a full member profile.
- Trip schedule changes must remain compatible with the tenant calendar view.
- Tenant trip configuration may require additional fields or modules, but must not break the minimum trip flow.
- The calendar should remain the source of truth for time-based trip visibility and vessel timeline history.
- The trip record should remain the source of truth for manifest, responsible sailor, notes, and attached module content.

## Operational Information The Club Must Trust

The system must make these values dependable:

- current status
- planned and actual times
- vessel identity
- responsible sailor identity
- crew manifest
- incident notes

If any of these are vague or easy to lose, the area fails its operational purpose.

## Permissions In This Area

This area should be permission-based rather than role-hardcoded.

Likely permissions include:

- `trip.create`
- `trip.update`
- `trip.depart`
- `trip.complete`
- `trip.cancel`
- `trip.view`
- `trip.view_all`

## Club Configuration Of Trip Workflow

Different clubs will want different trip processes.

The product should support tenant-level trip configuration such as:

- which fields are shown in trip creation
- which fields are required before a trip can be planned
- which checks are required before departure
- which modules are enabled for the tenant
- which modules are optional versus mandatory
- which completion fields are required when reporting back home

See [tenant-settings.md](../../platform/tenant-settings.md).

## Relationship To Calendar And Scheduling

Trips are one activity type inside the calendar backbone.

That means:

- creating a trip creates or updates a scheduled calendar item
- changing planned trip times affects calendar placement and vessel conflict visibility
- active and overdue trip state should be reflected in the calendar
- the trip detail view remains the source of truth for trip-specific workflow and history
- trip timing and summary visibility may be exposed through calendar subscription feeds where allowed
