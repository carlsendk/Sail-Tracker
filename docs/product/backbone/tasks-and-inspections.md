# Tasks And Inspections

## Area Purpose

This document defines calendar-backed operational work in Sail Tracker.

It covers the kinds of scheduled work that are not trips, but still matter to daily club operations.

Examples include:

- inspections
- maintenance slots
- readiness checks
- follow-up work
- winter preparation
- launch preparation
- recurring service work

This is not a separate timeline beside the calendar.
It is a structured set of calendar activity categories.

## Why This Area Matters

Clubs do not just sail.
They also prepare, inspect, maintain, clean, repair, and follow up.

If that work is left in chat, memory, or paper notes:

- boats look available when they are not
- overdue safety work is easy to miss
- engines and electrical systems drift out of service unnoticed
- seasonal work becomes dependent on one person's memory

This area makes operational work visible in the same time-based backbone as trips.

## Core Product Outcome

The product should make it easy to answer:

- what work is due this week
- what work is overdue
- what vessel or asset is blocked by planned work
- what recurring operational work is coming up
- what seasonal preparation still needs to be completed

## Scope

This area covers:

- operational task categories
- inspections
- scheduled maintenance work
- recurring work
- seasonal work
- due and overdue handling
- resource blocking through the calendar
- reminder-oriented subscriptions and feeds for time-bound work

This area does not own:

- vessel identity
- asset identity
- trip metadata
- qualification rules
- person identity

Those belong to the connected domains.

## Aggregate Root

`operational_task` -- a planned piece of calendar-backed work applied to a vessel, asset, or facility, with a category, subject resource, and calendar state.

## Who Uses It

- vessel-responsible members scheduling and completing maintenance or inspections
- club administrators planning seasonal and recurring work
- trip operators seeing what readiness work is blocking departure
- fleet managers tracking overdue service across the fleet

## Requires

- [calendar-and-scheduling.md](calendar-and-scheduling.md) -- owns the time-based state, schedule placement, and due/overdue transitions

## Enhanced By

- [vessel-registry.md](../domains/fleet/vessel-registry.md) -- vessel identity as subject resource
- [equipment-registry.md](../domains/equipment/equipment-registry.md) -- asset identity as subject resource
- [vessel-readiness.md](../domains/fleet/vessel-readiness.md) -- readiness expectations that generate required work
- [notifications-and-reminders.md](notifications-and-reminders.md) -- delivery of due-soon and overdue signals

## Core Concepts

- `operational task`
  A planned piece of work that appears on the shared operational calendar.
- `inspection`
  A structured operational task used to verify that a vessel, asset, or resource meets an expected condition.
- `maintenance slot`
  A scheduled work period used for service, repair, replacement, or upkeep.
- `seasonal work`
  Recurring operational work tied to periods such as winter preparation or spring launch.
- `subject resource`
  The vessel, asset, facility, or other thing the work applies to.
- `calendar state`
  The time-based operational state for the work, such as planned, active, overdue, completed, or cancelled.

## Operational Categories

Useful categories include:

- vessel inspection
- asset inspection
- engine service
- electrical inspection
- safety readiness check
- winter preparation
- launch preparation
- cleanup or reset work
- follow-up task after incident or trip

The exact catalog should be configurable by the tenant, but the product should treat them all as calendar-backed operational work.

## Recurring And Seasonal Work

Some work should be one-off.
Some should repeat.

Examples:

- monthly engine check
- annual safety inspection
- pre-season launch preparation
- end-of-season winterization

The calendar should support those as planned operational items instead of making clubs recreate them manually every time.

## Relationship To Calendar

Calendar should own the time-based picture of this work.

That means:

- tasks and inspections appear in normal schedule views
- due and overdue states are calendar-visible
- planned work can block availability where relevant
- users can filter operational work alongside trips
- time-bound work can be subscribed to from reminder-capable tools where useful

This area exists to make those calendar categories explicit and understandable.

## Reminder And Subscription Model

If work is time-bound, it should live in the calendar backbone.

That does not mean users must only consume it inside Sail Tracker.

The product should support subscriptions such as:

- operational task feeds
- inspection-only feeds
- vessel-specific work feeds
- personal reminder-oriented feeds later

Examples:

- a leader subscribes to overdue and due-soon inspection work
- a vessel-responsible member subscribes to that vessel's service tasks
- a club owner subscribes to seasonal preparation work

The important rule is:

- the calendar remains the source of truth
- reminder tools consume subscribed views of that truth

See also [`notifications-and-reminders.md`](../backbone/notifications-and-reminders.md).

## Relationship To Fleet

Fleet defines the vessel the work applies to.

This area defines the scheduled work against that vessel.

Examples:

- Fleet knows the boat and its static rules.
- Tasks And Inspections knows there is an engine-service slot on Tuesday.
- Calendar shows that the boat is blocked in that time window.

## Relationship To Equipment And Assets

Equipment And Assets defines the thing being worked on.

This area defines the scheduled work related to that thing.

Examples:

- an outboard engine service slot
- a battery inspection
- a clubhouse cleaning task
- a tent return and drying task

## Relationship To Trips

Trips may generate or depend on operational work, but they should not own it.

Examples:

- a pre-departure readiness check
- a follow-up task after a reported incident
- a cleanup task after a longer trip

Those should remain calendar-backed operational items that can be linked to a trip when relevant.

## Status Model

The useful states for this area are time-based calendar states such as:

- `planned`
- `active`
- `overdue`
- `completed`
- `cancelled`

The important point is consistency:

- a missed engine service should become overdue in the same shared operational system
- a winter prep task should be visible in the same schedule as the trip load it affects

## Business Rules

- Every task or inspection belongs to exactly one tenant.
- Every task or inspection should have a clear subject resource or scope.
- Tasks that block a vessel or other shared resource should affect calendar availability.
- Overdue work should remain visible until resolved or explicitly cancelled.
- Recurring and seasonal work should not require manual recreation every time.
- Tasks and inspections may link to trips, vessels, and assets, but should not change ownership of those records.
- Tenants may configure which operational categories they use, but the calendar should remain the shared owner of time-based state.
- Reminder-oriented subscriptions should be derived from calendar-backed work, not from a separate reminder-only task model.

## Product Shape

The right mental model is:

- `Calendar / Scheduling` owns the timeline and time-based state
- `Tasks And Inspections` describes the operational work categories that live on that timeline
- `Fleet` and `Equipment And Assets` provide the vessels and assets that the work applies to

This keeps the system simple:

- one backbone for time
- one place to see work
- connected domains for the underlying facts
