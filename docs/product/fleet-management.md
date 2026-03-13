# Fleet Management

## Area Purpose

This area defines how Sail Tracker manages the club's vessels as operational assets.

It is the domain that answers:

- what vessels the tenant has
- what kind of vessels they are
- what static facts define them
- what vessel-side constraints affect their use
- who is responsible for them
- what trip and qualification rules attach to them

Fleet Management is not just an inventory list. It is the vessel backbone behind trips and operational planning.

## Why This Area Matters

In this product, vessels are one of the most important tenant resources.

If vessel data is weak, the rest of the product becomes unreliable:

- the calendar cannot show real conflicts
- trips cannot validate the right responsible sailor
- members do not know what can be used
- maintenance and inspection planning loses its vessel context
- safety-critical readiness becomes ambiguous

This area gives the club one dependable source of truth for vessel identity and vessel-side rules.

## Core Product Outcome

The product should make it easy to answer:

- what vessels does the club have
- what static state and characteristics define each vessel
- which vessels the calendar currently shows as schedulable or blocked
- which vessels have maintenance, inspection, or readiness work on the calendar
- which vessels a member may take out
- which vessel classes or vessel-specific rules matter during trip planning

## Scope

This area covers:

- vessel registration
- vessel classes and vessel-specific metadata
- vessel-side constraints
- vessel ownership or responsibility
- vessel qualification requirements
- vessel-facing scheduling inputs

This area does not own:

- trip lifecycle
- qualification catalogs themselves
- time-based maintenance workflows
- inspection workflows
- generic operational tasks
- all equipment in the club
- generic booking of non-vessel assets

It provides the vessel domain that those areas depend on.

## Core Concepts

- `vessel`
  One named operational boat or watercraft managed by a tenant.
- `vessel class`
  A grouping used when clubs want to reason about similar vessel types together.
- `vessel status`
  A non-time-based vessel fact such as active, retired, or manually out of service.
- `vessel constraint`
  A vessel-side rule that affects planning, such as capacity, required approvals, or water-area restrictions.
- `vessel responsibility`
  The person or people the club treats as locally responsible for a vessel.

## Vessel Identity

Every vessel should have a stable identity inside the tenant.

Typical vessel information includes:

- name
- vessel class or type
- capacity
- home location or harbor later if useful
- operational notes
- documents and images later where useful

Some clubs will care about rich technical metadata.
Others only need enough detail to safely schedule and validate trips.

The product should allow more detail without requiring it for every tenant.

## Vessel Class Versus Specific Vessel

The product should support both:

- rules that apply to a specific vessel
- rules that apply to a vessel class

Why this matters:

- qualifications may attach to a class or to one named vessel
- maintenance always attaches to a specific vessel
- scheduling always blocks a specific vessel
- club approvals may sometimes say "all training dinghies" rather than one exact hull

This area should therefore support both class-level meaning and vessel-level operational truth.

## Vessel Status Versus Calendar State

The vessel should have clear static status facts visible across the app.

Useful non-time-based statuses include:

- `active`
- `retired`
- `out_of_service`

Important distinction:

- trip state belongs to the trip domain and calendar backbone
- maintenance, inspection, and task timing belong to the calendar backbone
- schedule-based availability belongs to the calendar backbone
- vessel status belongs to fleet

That means a vessel may appear unavailable in the calendar because:

- it is assigned to a planned trip
- it is currently active on a trip
- it has a maintenance or inspection event in that time window
- it has been manually marked out of service in fleet

## Schedule Availability Model

The calendar backbone should be the source of truth for schedule-driven vessel availability.

Schedule availability should take into account:

- trip scheduling from the calendar and trip domains
- active trip state
- maintenance windows
- inspection windows
- readiness tasks
- out-of-service flags

Fleet contributes the vessel-side facts that the calendar needs, especially:

- vessel identity
- out-of-service status
- vessel-facing restrictions

The resulting availability view should be usable in:

- calendar conflict views
- trip creation
- rescheduling
- vessel list and vessel detail views

## Vessel Responsibility

Clubs often have one or more people who are locally responsible for a vessel.

This may mean:

- owner in club language
- vessel-responsible leader
- maintenance contact
- training lead for that vessel

The product should support recording that relationship, but should not confuse it with:

- legal ownership
- permission to sail the vessel
- responsible sailor on a trip

These are different facts.

## Vessel Requirements For Trips

Fleet provides the vessel-side rules consumed during trip planning.

Examples:

- capacity
- whether the vessel is schedulable according to the calendar
- what kind of responsible-sailor approval is required
- whether extra departure checks are needed
- whether the vessel is restricted to training or local waters
- which assigned components or equipment matter for safe operation

This area should expose those requirements clearly, while the trip area remains responsible for the trip workflow itself.

## Equipment Boundary

Not all equipment belongs inside Fleet Management.

This is important.

Some equipment is:

- vessel-specific safety or operating equipment
- vessel-mounted components such as engines or electrical systems
- tenant-level shared equipment
- bookable club assets such as tents or the clubhouse

Those should not all be forced into one vessel-only model.

The clean boundary is:

- Fleet owns vessel identity, vessel status, and vessel-specific requirements
- a separate equipment and assets domain should own shared equipment, lendable equipment, vessel-mounted components, and non-vessel bookable assets

Fleet may still reference vessel-specific equipment requirements or checks, but it should not become the home for every club asset.

## Relationship To Equipment And Assets

The product should eventually have a separate area for equipment and other assets.

That area would likely cover:

- club-owned shared equipment
- vessel-mounted equipment
- engines and electrical systems
- safety equipment tracking
- lendable items such as tents
- bookable assets such as clubhouses or rooms

Fleet should connect to that domain, not absorb it completely.

## Relationship To Calendar And Scheduling

Fleet Management is tightly coupled to the calendar backbone.

That means:

- the calendar determines whether a vessel is blocked in a schedule window
- maintenance, inspection, and readiness categories feed constraints into that calendar availability
- the calendar should surface vessel conflicts clearly
- vessel-specific feeds later may be useful for subscriptions

Fleet does not own schedule availability.
It provides the vessel truth that the calendar relies on.

## Composed Vessel Views

A vessel detail page should be treated as a composed product view, not a signal that Fleet owns every piece of information shown there.

Typical vessel pages may compose:

- fleet facts and vessel rules
- current and upcoming calendar items
- trip timeline and logbook entries for that vessel
- assigned engines, electrical systems, and other equipment
- inspections, maintenance, and seasonal tasks
- relevant qualifications or operating restrictions

A vessel page may include information from:

- Fleet Management
  Vessel identity, class, capacity, static metadata, vessel responsibility, and vessel-side requirements.
- Calendar And Scheduling
  Current schedule state, blocked or free windows, maintenance events, inspections, and vessel-related calendar history.
- Trip Logging And Logbook
  Trips involving that vessel and the vessel's trip history or logbook timeline.
- Equipment And Assets
  Equipment assigned to the vessel or required for that vessel.
- Qualifications
  Who is eligible to act as responsible sailor for that vessel or vessel class.
- Media later if relevant
  Vessel photos, manuals, and other related files.

This is important because the UI may show "boat information from many parts of the system" without changing which domain owns the underlying facts.

## Relationship To Trips

Trips consume fleet data constantly.

Trip workflows depend on fleet for:

- vessel selection
- capacity validation
- vessel-side constraints used during availability validation
- vessel restrictions
- vessel-facing operational context

In return, active and planned trips feed back into calendar-controlled availability.

## Relationship To Qualifications

Fleet connects to qualifications through vessel requirements.

That means:

- a vessel may require a certain approval
- that requirement may attach to a vessel or vessel class
- trip validation checks whether the selected responsible sailor satisfies that requirement

Fleet should not own the full qualification logic, but it must expose what it requires.

## Permissions In This Area

Likely permissions include:

- `fleet.view`
- `fleet.manage`
- `fleet.manage_maintenance`
- `fleet.manage_responsibility`
- `fleet.manage_requirements`

These permissions should stay separate from:

- trip lifecycle permissions
- qualification grant permissions
- generic tenant administration

## Product Risks

- If vessel state is unclear, trip planning will not be trusted.
- If vessel class and specific-vessel rules are collapsed carelessly, qualification logic will become confusing.
- If maintenance does not feed into calendar availability automatically, the schedule will lie.
- If all equipment is pushed into fleet, the domain will become too broad and hard to use.
- If vessel responsibility is confused with trip responsibility, operational accountability will become muddy.
- If a vessel detail page is treated as if Fleet owns every displayed fact, domain boundaries will erode over time.

## Evaluation Questions

- Is the boundary between fleet and equipment/assets clear enough?
- Can the model support both vessel-specific and class-level rules?
- Will clubs be able to understand why a vessel is unavailable?
- Is maintenance visible enough to affect real planning decisions?
- Can the trip workflow rely on fleet without fleet taking over trip logic?
