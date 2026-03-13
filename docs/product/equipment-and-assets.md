# Equipment And Assets

## Area Purpose

This area defines the physical equipment, components, and bookable assets that do not fit cleanly inside the vessel domain.

It answers questions such as:

- what gear does the club own
- what items are assigned to a vessel
- what items are shared across the club
- what components such as engines or electrical systems need tracking
- what non-vessel resources can be booked or borrowed
- what asset-related work should appear on the calendar

## Why This Area Matters

Not all operational assets are vessels.

Clubs also need to manage:

- vessel-mounted operating equipment
- safety gear
- shared club gear
- lendable items
- bookable spaces or facilities

If this area is missing, the product becomes distorted:

- Fleet becomes a dumping ground for unrelated assets.
- Important equipment such as engines and radios loses its own maintenance context.
- Clubs cannot reason clearly about what is on a boat versus what is borrowed from a shared pool.
- Availability of shared resources such as tents or a clubhouse becomes invisible.

## Scope

This area covers:

- asset categories and catalogs
- individual tracked equipment and components
- vessel-assigned assets
- shared club assets
- lendable gear
- bookable non-vessel assets
- asset ownership and assignment
- asset-specific notes, identifiers, and characteristics

This area does not own:

- vessel identity
- trip lifecycle
- person identity
- time-based operational state
- maintenance, inspection, or readiness scheduling

Those time-based concerns belong to the calendar backbone.

## Core Concepts

- `asset`
  A tracked physical thing or bookable resource managed by a tenant.
- `asset category`
  A grouping such as safety equipment, engine, electronics, clubhouse, or camping gear.
- `assigned asset`
  An item currently attached to a vessel, location, or shared pool.
- `bookable asset`
  A non-vessel resource that may be reserved in time, such as a clubhouse or room.
- `lendable asset`
  An item that can be checked out from a shared pool, such as a tent or radio.
- `component`
  A tracked sub-asset associated with a larger resource, such as an outboard engine mounted on a vessel.

## Asset Types

The model should support several kinds of assets without forcing them into one vessel-only structure.

Examples include:

- vessel-mounted safety equipment
- outboard and inboard engines
- batteries and electrical systems
- navigation electronics
- radios
- trailers
- tents
- shared safety kits
- clubhouse or room resources

Some of these are primarily attached to vessels.
Some live in a club-wide pool.
Some are booked in time instead of being physically borrowed.

## Relationship To Vessels

Equipment is not the same thing as the vessel itself.

That distinction matters.

A vessel page may show:

- its assigned engine
- its safety equipment
- its electrical systems
- its trailer later if relevant

But those are composed views.
Fleet owns the vessel.
Equipment And Assets owns the assigned items.

## Engines And Electrical Systems

Engines and electrical systems should be treated as first-class tracked assets or components, not just free-text notes on a boat.

Examples:

- removable outboard engine
- fixed inboard engine
- battery bank
- charging system
- navigation lights
- radio and communication equipment

These assets may need:

- identifiers
- assignment to a vessel
- service or inspection categories on the calendar
- safety notes
- replacement history later

## Availability And Calendar Relationship

Calendar should own time-based availability across domains.

That means:

- a clubhouse booking blocks the clubhouse in the calendar
- a tent booking blocks that item in the calendar
- an engine service slot appears as calendar work
- an electrical inspection appears as calendar work

Equipment And Assets should provide the asset facts that the calendar needs, but should not own the time-based state itself.

## Safety Relationship

This area should support safety without becoming a full safety domain.

That means it should be possible to record:

- what safety equipment is expected on a vessel
- what safety-critical components are assigned
- what assets require inspection or service categories in the calendar

The richer policy around what is required for a trip can then be consumed by trips, fleet, tenant settings, or qualifications.

## Relationship To Fleet

Fleet should reference vessel-specific equipment requirements, but should not own all club assets.

## Relationship To Calendar

Calendar should own the time-based picture of assets:

- bookings
- inspections
- maintenance slots
- seasonal preparation tasks
- overdue work

Equipment And Assets should make those items meaningful by defining the asset being scheduled.

## Core Product Outcome

The product should make it easy to answer:

- what equipment and assets does the club have
- what is assigned to a vessel right now
- what is available to borrow or book
- what shared assets are blocked in time
- what engines, electrical systems, or safety items need attention

## To Define In More Detail

- asset categories
- assignment history
- lending flows
- booking flows
- asset-specific inspection templates
- how asset readiness contributes to trip validation
