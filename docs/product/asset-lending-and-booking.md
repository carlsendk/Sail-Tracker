# Asset Lending And Booking

## Purpose

This document defines how Sail Tracker should handle:

- lending physical assets
- booking shared assets or facilities in time
- temporary operational use of assets on trips

It is a detail document for [`equipment-and-assets.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/equipment-and-assets.md).

The goal is to keep these three concepts separate:

- default assignment
- lending or checkout
- time-bound booking

## Why This Area Matters

Clubs often have items that do not belong permanently to one vessel or one person.

Examples:

- a tent borrowed for a weekend trip
- a handheld radio taken from the shared pool
- a clubhouse reserved for an event
- a trailer needed for launch work

If the product treats all of these as the same thing, the model becomes confusing quickly.

## Core Outcome

The product should make it easy to answer:

- where does this asset normally belong
- who has it right now
- is it available to borrow
- is it booked in a time window
- is it temporarily assigned to a trip

## Scope

This area covers:

- lending or checkout flows
- returns
- time-bound bookings
- temporary trip use of assets
- shared-pool availability
- lending versus booking rules

This area does not own:

- static asset categories
- static asset identity
- static assignment model
- calendar backbone itself

Those remain in the connected docs and domains.

## Core Principle

The clean model is:

- `assignment` says where an asset belongs by default
- `lending` says who has physical custody of an item
- `booking` says a resource is reserved in time

These should be related, but not collapsed into one concept.

## Lending Model

Lending is about physical custody of an asset item.

Examples:

- a tent is checked out to a trip leader
- a handheld radio is borrowed from the shared pool
- a first-aid kit is temporarily taken from storage

Useful lending facts include:

- who took the item
- when it was taken
- expected return time later where useful
- return status
- linked trip or purpose later if relevant

Lending should be lightweight.
This product is not trying to become warehouse software.

## Booking Model

Booking is about reserving a shared resource in time.

Examples:

- clubhouse booked for a leader meeting
- trailer reserved for launch day
- a scarce shared engine reserved for a training event

Booking belongs to the calendar backbone because it is time-based.

The asset domain should define the resource being booked.
The calendar should define when it is blocked.

## Temporary Trip Use

Trips often use assets temporarily without changing their permanent home.

Examples:

- a tent taken on a weekend trip
- a handheld radio added to a trip
- a safety bag moved to a vessel for one outing

This should usually be modeled as:

- default assignment remains unchanged
- temporary operational use is linked to the trip
- calendar may reflect that use if the item is scarce or explicitly booked

This preserves the difference between:

- where the item belongs normally
- what is actually being used right now

## Shared Pool Model

Shared-pool assets need a simple availability model.

That means the product should support:

- item is available
- item is lent out
- item is booked in a future time window
- item is out of service

The exact UI can stay simple, but the product rules should stay explicit.

## Scarce Versus Non-Scarce Assets

Not every shared asset needs strict booking.

A useful distinction is:

- `scarce shared asset`
  Should support booking and conflict checks.
- `ordinary lendable asset`
  May only need checkout and return tracking.

Examples:

- clubhouse: scarce and bookable
- trailer: scarce and usually bookable
- handheld radio: maybe lendable, maybe bookable if few exist
- tent: often lendable, sometimes bookable

Tenants should be able to decide how strict this is per asset type.

## Relationship To Calendar

Calendar should own:

- booking windows
- resource conflicts
- blocked and free views
- overdue return or follow-up reminders later

This area should contribute the asset/resource facts that the calendar needs.

Important rule:

- if something is blocked in time, the calendar is the source of truth

## Relationship To Trips

Trips may consume assets in several ways:

- by temporary operational assignment
- by explicit booking of a scarce shared item
- by simple manifest-like declaration that an item was taken

The product should support all three without confusing them.

Examples:

- a tent is linked to a trip because it was taken
- a shared engine is booked for a trip because only one is available
- a first-aid kit is noted as onboard for safety context

## Relationship To Asset Assignment

Default assignment and temporary use must stay separate.

Examples:

- a tent normally belongs to clubhouse storage
- it is lent out for a weekend
- then returned to storage

At no point should the system need to pretend the tent permanently changed home just because it was borrowed.

See also [`asset-categories-and-assignment.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/asset-categories-and-assignment.md).

## Return Model

For lendable assets, return should be explicit when it matters.

Useful outcomes include:

- returned normally
- returned late
- not returned yet
- returned damaged later if the product grows into that depth

This can later connect to reminders and reporting without changing the core model.

## Business Rules

- Every lendable or bookable asset belongs to exactly one tenant.
- Default assignment should remain separate from temporary use.
- Booking should be modeled as time-bound calendar activity.
- Lending should be modeled as custody of a physical item.
- Scarce resources should support conflict visibility in the calendar.
- Assets may be linked to trips without becoming permanently assigned to that trip.
- Shared-pool assets should remain easy to use without requiring heavy stock-management workflows.

## Product Outcome

If this area is working well, the club should experience:

- clearer shared-asset usage
- fewer conflicts around scarce resources
- less confusion about what belongs where
- better visibility into borrowed, booked, and in-use items
