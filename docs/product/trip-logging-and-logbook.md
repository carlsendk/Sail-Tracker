# Trip Logging And Logbook

## Area Purpose

This area is the detailed trip workflow and trip-specific record within Sail Tracker.

It gives a club a reliable way to plan, run, and record sailing trips without losing track of:

- who went out
- which vessel was used
- when the trip departed and returned
- whether safety checks were completed
- what happened during the trip

The product outcome is not just "a trip form". The outcome is a trustworthy trip record that sits behind the calendar backbone and supports operations, safety follow-up, and historical reporting.

## Problem This Area Solves

Many clubs manage trips informally through memory, paper notes, chat messages, or spreadsheets. That breaks down quickly when:

- multiple vessels are in use
- youth members or guests are onboard
- trips overlap
- weather or safety conditions change
- someone needs to confirm whether a vessel is back
- a club wants a real operating history

This area replaces that fragmentation with one tenant-scoped trip record connected to the tenant's operational schedule.

## Primary Users

- `tenant_owner`
  Responsible for club-level oversight and configuration.
- `skipper`
  Responsible for creating, updating, starting, and completing trips.
- `qualified member`
  A club member who is allowed to take a vessel out even if they are not framed as a formal skipper role in the club.
- `boat owner or vessel-responsible member`
  May need visibility into trips involving a specific vessel and may participate in preparation or follow-up.
- `crew member`
  Participates in a trip and may later view trip history, depending on permissions.
- `guest`
  Appears on the manifest without needing a full member account.
- `kiosk user`
  Uses a simplified club-device flow to create, start, or report back trips in shared-device contexts.
- `platform_admin`
  Does not operate trips directly by default, but may need support visibility subject to platform policy.

## User Value

For a club, this area should make it easy to answer:

- What trips are planned today?
- Which vessel is currently out?
- Who is onboard?
- When is the vessel expected back?
- Did the trip return safely?
- What is the historical record for this vessel, skipper, or member?

## Scope

This area covers:

- trip drafting
- trip scheduling
- vessel assignment
- skipper assignment
- crew manifest management
- departure readiness
- active-trip status
- trip completion
- historical logbook browsing
- optional trip modules such as weather, route, incidents, media, and story summary

This area uses the calendar backbone but does not replace it.

The trip workflow owns trip-specific metadata and validations.
The calendar owns the shared timeline, time-based state, and cross-area scheduling visibility.
Trip schedule items may also be exposed through subscribed calendar feeds, subject to feed scope and permissions.

This area does not own:

- vessel configuration
- member profile management
- qualification catalog definition
- weather forecasting itself
- safety policy definition at tenant level

Those belong to other product areas and are consumed here as dependencies.

## Core Product Outcomes

This area succeeds when a club can:

1. Create a trip draft quickly.
2. Validate that the selected vessel and skipper are acceptable.
3. Maintain a clear crew manifest, including guests.
4. Move a trip from planned to active to completed without ambiguity.
5. See active and overdue trips immediately.
6. Retain a searchable historical trip logbook for the tenant.
7. Keep the core trip flow lightweight while allowing richer clubs to enable more structured trip modules.

## Minimum Trip Principle

The product should make it easy to create the simplest possible real trip:

- choose vessel
- choose responsible sailor
- set departure time
- set expected return time
- add manifest entries as needed
- leave now
- report back home

This is the baseline flow the product must optimize for.

The system should not force every club into a heavy expedition-style workflow for a simple local sail.

## Expandable Trip Modules

Trips should support optional modules that can be turned on or required by tenant configuration.

The trip model should be able to include:

- `weather information`
  Forecast or observed sailing conditions relevant to planning and reporting.
  See [`modules/weather-in-trip-context.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/weather-in-trip-context.md).
- `route planning`
  Planned route, waypoints, and external navigation context such as OpenSeaMap and harbor references.
  See [`modules/route-planning-and-harbors.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/route-planning-and-harbors.md).
- `incidents`
  Structured incident capture for safety follow-up.
  See [`modules/incidents.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/incidents.md).
- `gallery and video`
  Photos and videos attached to the trip record.
  See [`modules/media-gallery.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/media-gallery.md).
- `trip story`
  A written story or summary of the outing for internal history, communication, or member engagement.
  See [`modules/trip-story.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/trip-story.md).

These modules should enrich the trip area without making the minimum trip flow slow or difficult.

## Club Configuration Of Trip Workflow

Different clubs will want different trip processes.

The product should therefore support tenant-level trip configuration such as:

- which fields are shown in trip creation
- which fields are required before a trip can be planned
- which checks are required before departure
- which modules are enabled for the tenant
- which modules are optional versus mandatory
- which completion fields are required when reporting back home

This should eventually live in club administration as trip workflow configuration, not as hardcoded platform behavior.
See [`tenant-settings.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tenant-settings.md).

## Core Workflows

### 1. Create Trip Draft

The user creates an initial trip record before departure and places it into the shared operational schedule.

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

### 2. Prepare Trip For Departure

Before a trip leaves, the club needs confidence that the trip is valid.

This workflow confirms:

- the vessel is available
- the responsible sailor is allowed to take that vessel
- crew count does not exceed capacity
- required pre-departure checks are completed

This is the point where the system prevents avoidable mistakes.

See also [`trip-validation-and-departure-rules.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-validation-and-departure-rules.md).

### 3. Start Trip

Starting a trip changes it from a scheduled plan into an operational fact.

This is the "go on trip now" action from the calendar-backed workflow.

Once active, the system should make it obvious that:

- the vessel is out
- the expected return time matters
- the trip should appear in active-trip views and alerts

### 4. Complete Trip

Completing a trip closes the operational loop.

This is the "report back home" action from the calendar-backed workflow.

The skipper records:

- actual return time
- actual distance or duration where relevant
- summary observations
- whether everyone returned safely
- incidents or notable deviations
- optional media and trip story where enabled

Completion should be structured enough to support safety follow-up, but not so heavy that skippers avoid logging.

### 5. Browse Logbook

The logbook is the long-term trip record for a tenant.

Its time-based backbone should come from the calendar timeline.
Its trip-specific depth should come from the trip record itself.

Users should be able to:

- filter by date range
- filter by status
- filter by vessel
- search by trip title or people involved
- open a trip and see its full operational history
- see a vessel's sailing timeline in calendar-backed history views
- open a trip and see the richer details that do not belong in a generic calendar item

## Business Rules

- Every trip belongs to exactly one tenant.
- A trip can only reference members and vessels from the same tenant.
- A vessel cannot be assigned to overlapping active or planned trips unless the tenant explicitly supports an override policy later.
- The responsible sailor must satisfy the vessel's required qualification policy before the trip can depart.
- Crew count must not exceed vessel capacity.
- A trip must have a planned start and planned return before it can depart.
- A trip cannot be completed without an actual return timestamp.
- A trip should not disappear from the logbook because it was later edited or corrected.
- Guest participants may be recorded even when they do not have a full member profile.
- Active and overdue trips must be visible without needing a search.
- Trip schedule changes must remain compatible with the tenant calendar view.
- A trip becomes `overdue` when the expected return time passes and the trip has not been reported back as completed.
- Tenant trip configuration may require additional fields or modules, but must not break the minimum trip flow.
- The calendar should remain the source of truth for time-based trip visibility and vessel timeline history.
- The trip record should remain the source of truth for manifest, responsible sailor, notes, incidents, route context, weather context, media, and story.

## Trip Lifecycle

Recommended lifecycle for this area:

- `draft`
- `planned`
- `active`
- `overdue`
- `completed`
- `cancelled`

The calendar should surface those time-based states in the shared operational schedule.
The trip area should enrich those states with the trip-specific facts that the calendar item does not own.

Product intent for each state:

- `draft`: incomplete working record, safe to edit freely
- `planned`: ready for execution, visible in the calendar schedule, but not yet departed
- `active`: underway
- `overdue`: expected return has passed without completion
- `completed`: trip is closed and logged after the skipper reports back home
- `cancelled`: trip will not occur, but remains part of the record

## Operational Information The Club Must Trust

The system must make these values dependable:

- current status
- planned and actual times
- vessel identity
- responsible sailor identity
- crew manifest
- safety/completion confirmations
- incident notes
- attached media and story summary when used

If any of these are vague or easy to lose, the area fails its operational purpose.

## Trip Participants And Operators

This area needs to support different kinds of people involved in a trip:

- `responsible sailor`
  The person accountable for the trip in the system.
- `qualified member`
  A member who is permitted to take certain vessels out based on qualification rules.
- `crew member`
  A normal participant on the manifest.
- `guest`
  A non-member participant recorded on the manifest.

The product should not assume every responsible sailor is modeled only as a club "skipper" role.

Some clubs may think in terms of:

- skipper
- watch leader
- boat owner
- qualified member allowed to sail independently

The product model should support those club differences while still enforcing permission and qualification checks consistently.

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

Initial role bundles can stay small:

- tenant owners can do everything in their tenant
- responsible sailors can create and operate trips they are allowed to run
- broader crew access can be added later

## Kiosk Mode

The app should support kiosk mode for shared-device use in clubhouses or harbors.

Kiosk mode is important when:

- one shared tablet is used for departure and return
- users need fast operational access without full desktop-style navigation
- clubs want a simple sign-out and report-back station

Kiosk mode should prioritize:

- create trip quickly
- select vessel
- identify responsible sailor
- add manifest entries
- depart now
- report back home
- clear active-trip visibility

Kiosk mode should not be treated as a separate product area.
It is a specialized operating mode for the same trip and calendar workflows.
See [`operating-modes/kiosk-mode.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/operating-modes/kiosk-mode.md).

## Tenant And Domain Behavior

- Trip data is tenant-scoped.
- A club only sees its own trips, vessels, and members.
- Subdomain resolution decides which tenant context the user is operating inside.
- Demo tenant behavior should mirror real tenant behavior closely enough for evaluation and onboarding.

## Relationship To Calendar And Scheduling

This area is not the product backbone.

Trips are one activity type inside the calendar backbone.

That means:

- creating a trip creates or updates a scheduled calendar item
- changing planned trip times affects calendar placement and vessel conflict visibility
- active and overdue trip state should be reflected in the calendar
- the trip detail view remains the source of truth for trip-specific workflow and history
- trip timing and summary visibility may be exposed through calendar subscription feeds where allowed

## Dependencies On Other Product Areas

This area depends on:

- `Fleet Management`
  For vessel metadata, capacity, and availability state.
- `People & Members`
  For responsible-sailor identity, crew selection, guests, and emergency contacts.
- `Safety`
  For departure and completion check policies.
- `Weather`
  For planning support, observed conditions, and optional trip context.
- `Route Planning`
  For route and harbor context when that module is enabled.
- `Incidents`
  For structured safety event capture when that module is enabled.
- `Media`
  For photo and video attachments when that module is enabled.
- `Calendar / Scheduling`
  For shared scheduling visibility, rescheduling behavior, and external feed exposure.
- [`fleet-management.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/fleet-management.md)
  For vessel identity, availability, maintenance impact, and vessel-side requirements.
- [`equipment-and-assets.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/equipment-and-assets.md)
  For shared gear, vessel-linked equipment context, and non-vessel assets where trips interact with them.

## Product Risks

- Over-designing trip forms will slow down real-world usage.
- Under-designing completion data will weaken safety and reporting value.
- Hidden permission rules will create operational confusion.
- Weak tenant isolation would be a critical trust failure.
- If active and overdue trips are not obvious, the product loses operational credibility.
- If club-level configuration is too rigid, the product will not fit real club operating styles.
- If club-level configuration is too flexible without guardrails, the trip workflow will become inconsistent and hard to support.
- If kiosk mode is weak, real-world harbor usage will fall back to paper or chat.

## Evaluation Questions

Use these when reviewing the area:

- Is the trip lifecycle simple enough for real club usage?
- Are we capturing the minimum data needed for a trustworthy logbook?
- Are departure and completion checks balanced, or too heavy?
- Does the model support both members and guests cleanly?
- Are permissions explicit enough to avoid future rewrites?
- Does this area describe operational truth, or just form inputs?
- Can a club run a very simple trip without unnecessary friction?
- Can a stricter club require more structure without custom development?
- Are optional modules integrated cleanly without becoming mandatory noise?

## Suggested Follow-On Slices

If this area is accepted, the first implementation slices should be:

1. `Create trip draft`
2. `Start trip`
3. `Complete trip`
4. `Logbook list and trip details`
