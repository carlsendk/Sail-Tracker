# Calendar And Scheduling

## Area Purpose

This area is the operational backbone of Sail Tracker.

It gives a tenant one shared planning surface where operational activities can be created, viewed, moved, and understood in time.

Other product areas should connect to this backbone rather than invent their own separate timelines.

That means the calendar is not just a view. It is the club's primary operational schedule.

## Why This Area Comes First

If the product starts from trips alone, other areas will later need to bolt themselves onto that model.

If the product starts from calendar and scheduling, then:

- trips become one kind of scheduled activity
- maintenance becomes one kind of scheduled activity
- inspections become one kind of scheduled activity
- training and club events can fit later without redesign

This creates a stronger product center because clubs often think operationally in terms of:

- what is happening today
- what vessel is booked when
- what conflicts exist
- what needs attention this week

## Problem This Area Solves

Clubs need one place to coordinate time, resource use, and operational attention.

Without that backbone, they end up with:

- trips in one tool
- maintenance in another
- reminders in chat
- vessel availability guessed manually
- no clear weekly operational view

This area replaces that fragmentation with one tenant-scoped schedule.

## Primary Users

- `tenant_owner`
  Oversees the tenant schedule and resolves conflicts.
- `planning user`
  Creates and changes planned activities through the calendar scheduler.
- `skipper`
  Works with trip-related scheduled items.
- `maintenance user`
  Uses the same backbone for vessel maintenance and inspections.

These are working personas, not fixed platform roles.
The actual access model should still be permission-based.

## Core Product Outcome

A club should be able to open the calendar and understand:

- what is scheduled
- which vessel is involved
- what status each activity has
- where conflicts or risks exist
- what requires action today

If the calendar cannot answer those questions quickly, it is not functioning as the backbone.

## Scope

This area covers:

- tenant-scoped scheduling
- calendar views
- activity placement in time
- rescheduling
- conflict visibility
- time-based operational states
- due and overdue attention
- recurring and seasonal operational work
- operational filtering
- calendar feeds and subscriptions
- shared time-based visibility across product areas

This area does not own the detailed metadata of each activity type.

For example:

- trip manifest and trip notes belong to `Trips / Logbook`
- vessel identity and vessel rules belong to `Fleet Management`
- asset identity and assignment belong to `Equipment And Assets`
- qualification rules belong elsewhere

The calendar owns time, scheduling, visibility, operational attention, and conflict awareness.
That includes schedule-driven availability of shared resources such as vessels, equipment, and other bookable assets.

## Core Concepts

- `calendar item`
  A time-bound operational item shown in the shared schedule.
- `activity type`
  The domain-specific kind of calendar item, such as trip, maintenance, or inspection.
- `schedule window`
  The planned start and end used for placement, conflict detection, and views.
- `resource allocation`
  The vessel, person, or other capacity that is committed during that schedule window.
- `calendar state`
  The time-based operational state used to show whether an item is planned, active, overdue, completed, cancelled, due soon, or otherwise needs attention.
- `schedule availability`
  Whether a shared resource is free or blocked in a schedule window according to the calendar.
- `activity category`
  The operational kind of item shown in time, such as trip, maintenance, inspection, readiness task, winter prep, training, or booking.

## Backbone Principle

Each feature should integrate with the calendar in one of these ways:

- creates a calendar item
- blocks time on a resource
- contributes time-based state
- appears in filters and views
- reacts to rescheduling

That makes the calendar the shared operational frame, while domain areas still own their own rules.

## Core Workflows

### 1. View Operational Schedule

Users need a clear daily, weekly, and monthly understanding of club activity.

The calendar should surface:

- trips
- maintenance
- inspections
- preparation tasks
- winter and seasonal work
- later, optional club events and training

### 2. Schedule Activity

Users should be able to create a scheduled item in time and associate it with the relevant resource, especially a vessel.

For trips, this is the moment where planning enters the shared operational schedule.

For trip workflows, the scheduled item should normally start as `planned`.

### 3. Reschedule Activity

Users should be able to move a scheduled item when plans change.

Rescheduling must show consequences, not just change a date silently.

Examples:

- a trip move may create a vessel conflict
- a maintenance move may reopen vessel availability
- an inspection move may create compliance risk

### 4. Identify Conflicts And Attention Items

The calendar should highlight:

- overlapping vessel use
- overdue items
- activities happening now
- activities due soon
- blocked or free vessel availability in the selected schedule window

This is a major reason the calendar is the backbone and not just a visual layer.

### 5. Drill Into Domain Workflow

The calendar should let the user open the underlying activity and continue the domain workflow there.

Examples:

- open trip details
- open task details
- open asset details
- open vessel details

The calendar is the entry point, not the full workflow owner.

For trips, this means the calendar should support the operational transitions:

- `planned` -> `active` when the skipper leaves now
- `active` -> `completed` when the skipper reports back home
- `active` -> `overdue` automatically when expected return has passed without report-back

For other operational categories, this means the calendar should support states such as:

- `planned` -> `active` -> `completed` for scheduled work
- `planned` -> `overdue` when due time passes without completion
- `planned` -> `cancelled` when the work no longer applies

### 6. Subscribe To Calendar Feeds

Users should be able to subscribe to relevant calendar feeds from their local calendar tools.

This matters because many clubs already work day to day in:

- Apple Calendar
- Google Calendar
- Outlook
- other ICS-compatible clients

The product should support at least read-only subscription feeds so operational schedules can appear in those tools without duplicate manual entry.

## Feed Model

The calendar backbone should expose subscription feeds that map to operational use cases, not just one undifferentiated export.

Likely feed scopes:

- tenant-wide operational calendar
- trips only
- maintenance only
- tasks and inspections only
- vessel-specific schedule
- vessel-specific operational work
- due-soon operational reminders
- optionally later, user-relevant personal feed

The baseline delivery format should be:

- `ICS` subscription feed by URL

## Business Rules

- Every calendar item belongs to exactly one tenant.
- A calendar item must have a start and end, or a clear time policy if all-day support is added later.
- Resource conflicts must be visible when scheduling or rescheduling.
- Schedule-driven availability for shared resources should be controlled by the calendar.
- Completed activities should remain visible in historical views even if they are no longer actionable.
- Active and overdue activities should be visible without deep navigation.
- Due-soon and overdue operational tasks should be visible without deep navigation.
- Calendar filtering must preserve tenant boundaries.
- Rescheduling should not bypass the rules of the underlying activity type.
- For trip items, `overdue` is a calendar-visible state reached when the expected return time passes before the trip is reported back.
- Maintenance, inspection, and readiness work should be modeled as calendar categories rather than hidden notes on vessels or assets.
- Feed subscriptions must respect tenant boundaries and permissions.
- Subscription URLs should be revocable and treated as secrets.
- Feed contents should be scoped so clubs can share operational visibility without exposing unnecessary private data.
- Reminder-oriented subscriptions should be derived from calendar-backed items rather than a separate task system.

## Relationship To Trips / Logbook

Trips should be modeled as one important activity type in the calendar backbone.

That means:

- a trip is created with a schedule window
- it becomes part of the operational timeline when it is planned
- vessel availability is derived by the calendar from trip scheduling plus fleet constraints
- trip status changes affect calendar visibility and operational attention
- the trip record is the detailed metadata behind the scheduled item

So the mental model is:

- `Calendar / Scheduling` = shared operational timeline and time-based trip history
- `Trips / Logbook` = detailed trip workflow and trip-specific record details

Trip items should also participate in calendar subscription feeds where permitted.

This also means the calendar can provide time-based history for a vessel, including its trip timeline and other scheduled activity categories, without taking ownership of the full trip record.

## Relationship To Tasks

If tasks are introduced, they should be treated carefully.

Not every task belongs on the calendar.

Good candidates for calendar-backed tasks:

- maintenance due date
- inspection due date
- departure readiness reminder
- overdue return follow-up
- winter preparation
- seasonal launch preparation
- engine service slot
- electrical inspection slot

See also [`tasks-and-inspections.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tasks-and-inspections.md).
See also [`notifications-and-reminders.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/notifications-and-reminders.md).

Poor candidates:

- general admin to-dos with no operational time relevance

This distinction matters so the calendar stays operational rather than becoming cluttered task storage.

## Permissions In This Area

Likely permissions include:

- `calendar.view`
- `calendar.schedule`
- `calendar.reschedule`
- `calendar.view_all`
- `calendar.manage_conflicts`
- `calendar.subscribe`

These permissions should complement, not replace, domain permissions such as `trip.create` or `maintenance.update`.

The calendar scheduler is therefore a capability in the product, not a separate hardcoded role.

## Full Product Shape

This area should be able to grow into:

- shared tenant calendar views
- trip, maintenance, inspection, and other operational activity types
- vessel-based conflict visibility
- active and overdue highlighting
- rescheduling flows
- subscription feeds for local calendar tools
- future personal or scoped subscription models where justified

The implementation can go deep one feature at a time, but the product definition should assume this full shape from the start.

## Product Risks

- If the calendar tries to own every domain rule, it will become rigid.
- If the calendar is only a passive display, it will not be the backbone.
- If tasks are mixed in without discipline, the schedule becomes noisy.
- If conflicts are hidden, the schedule loses operational trust.
- If feeds expose too much information, the calendar becomes a privacy risk.
- If feeds are not dependable, clubs will stop trusting subscriptions and revert to manual copying.
- If depart and report-back transitions are unclear, the active and overdue state will not be trusted.

## Evaluation Questions

- Does this area feel like the operational home screen of the product?
- Can other areas plug into this backbone cleanly?
- Are we clear on what belongs in the calendar versus what belongs in domain detail views?
- Will clubs trust this as the place to see vessel use and upcoming activity?
- Is the scope disciplined enough to avoid becoming a generic productivity tool?
- What should appear in subscribed feeds versus only inside the app?
- Do we need one shared club feed first, or multiple feed scopes from day 1?
- Is the depart-now and report-back flow obvious enough that clubs will actually keep status current?

## Suggested Follow-On Slices

1. `Show trip items in tenant calendar`
2. `Show vessel conflicts in schedule`
3. `Open trip details from calendar`
4. `Reschedule planned trip from calendar`
5. `Subscribe to tenant ICS feed`
