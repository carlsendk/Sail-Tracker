# Notifications And Reminders

## Purpose

This document defines how Sail Tracker should notify users and expose reminder-oriented views of calendar-backed work.

It exists to keep one rule stable across the product:

- time-bound operational truth belongs to the calendar backbone
- notifications and reminders are delivery mechanisms for that truth

## Why This Area Matters

Clubs do not fail because information never exists.
They fail because the right person does not see it at the right time.

Examples:

- a responsible sailor forgets to report back home
- an inspection becomes overdue without anyone noticing
- a vessel-responsible member misses an engine service slot
- a club owner does not see that winter preparation is incomplete

This area makes the operational calendar actionable outside the main app views.

## Core Outcome

The product should make it easy to:

- notify the right people about the right operational events
- remind people about due and overdue work
- subscribe to time-bound operational views in external tools
- avoid inventing separate reminder-only task systems

## Scope

This area covers:

- in-app notifications
- reminder triggers
- reminder-oriented subscription feeds
- recipient rules
- notification categories
- notification privacy and detail boundaries

This area does not own:

- calendar items themselves
- trip lifecycle
- asset assignment
- membership identity
- qualification decisions

Those remain in the connected domains.

## Core Principle

Notifications and reminders should be derived from product facts that already exist.

That means:

- trips create events on the calendar
- tasks and inspections create events on the calendar
- overdue state is visible on the calendar
- notifications are sent because those states exist

The app should not maintain a parallel reminder-only model with separate operational truth.

## Notification Categories

Useful notification categories include:

- trip due soon
- trip overdue
- trip completed
- inspection due soon
- inspection overdue
- maintenance slot approaching
- recurring seasonal work coming up
- asset or vessel work blocked or rescheduled
- follow-up required after incident

Not every category needs the same delivery channel or urgency.

## Delivery Channels

The product should support more than one delivery path over time.

Useful channels include:

- in-app notifications
- email notifications
- subscription feeds for calendar or reminder-capable tools
- push notifications later if the product reaches that depth

The important rule is not the channel.
The important rule is that all channels derive from the same underlying operational facts.

## Reminder-Oriented Subscriptions

Some users will want to consume reminders in tools they already use.

Examples:

- Apple Reminders or calendar-based workflows
- Google Calendar
- Outlook
- other reminder-capable or ICS-compatible tools

Where possible, the product should expose reminder-oriented subscribed views such as:

- due-soon operational work
- vessel-specific service work
- inspection-only schedules
- tenant-wide operational calendar
- user-relevant personal operational view later

These are subscribed views of the calendar backbone, not a separate task product.

## Recipient Model

Notifications should go to people based on operational relationship, not just role names.

Examples:

- the responsible sailor for a trip
- the vessel-responsible member for a vessel
- a tenant owner
- a maintenance-capable member
- a member assigned to a task later if task assignment is added

This should stay permission-aware and tenant-aware.

## Timing Model

The product should support reminders such as:

- before planned start
- before expected return
- when due time is approaching
- at overdue transition
- on reschedule
- on cancellation where follow-up matters

The notification system should react to operational timing, not invent its own timing concepts.

## Privacy And Detail Model

Reminder outputs should not always contain the same amount of detail as the full app.

Examples:

- a broad tenant reminder feed may show title, time, vessel, and status only
- a privileged in-app notification may show deeper operational context
- sensitive incident or manifest details may stay app-only

This matters especially for shared subscriptions and external tools.

## Relationship To Calendar

Calendar is the source of truth for:

- time-bound state
- due and overdue transitions
- scheduled operational items
- reschedules and cancellations

This area consumes those signals and decides how users are informed about them.

## Relationship To Trips

Trips provide the domain context behind some reminders.

Examples:

- a responsible sailor gets a reminder that expected return is approaching
- an overdue reminder is triggered when the trip is still active after expected return
- a completion-related follow-up reminder may depend on missing trip data

Trip-specific context should enrich the reminder, not replace calendar ownership.

## Relationship To Tasks And Inspections

Tasks and inspections are one of the main sources of reminder demand.

Examples:

- engine service due tomorrow
- safety inspection overdue
- winter prep still incomplete

These are calendar-backed operational items first, reminders second.

## Business Rules

- Notifications and reminders must respect tenant boundaries.
- Reminder delivery must be based on existing operational facts, not duplicate state.
- Due and overdue transitions should come from calendar-backed items.
- External subscription views should expose only the level of detail appropriate for their audience.
- Recipients should be chosen based on operational relationship and permission, not only fixed role names.
- Tenants may configure reminder behavior, but should not redefine the meaning of core operational states.

## Product Outcome

The product should make it easy to answer:

- who needs to know about this operational event
- when should they be told
- what level of detail should they receive
- can they subscribe to this in tools they already use

If those answers are inconsistent between trips, inspections, and other operational work, the system will feel fragmented.
