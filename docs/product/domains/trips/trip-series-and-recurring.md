# Trip Series And Recurring

## Problem This Solves

Many clubs run the same trips repeatedly: weekly youth training, Monday evening sails, monthly long-distance outings, or seasonal race series.

Without a recurring trip model, organizers must create each instance by hand. That produces:

- inconsistent trip records for recurring activities
- unnecessary effort duplicating the same setup each time
- gaps in the logbook when someone forgets to create an instance
- no structured way to change future instances of a series without editing each one

This area defines how Sail Tracker models trip series so that repetitive scheduling becomes a one-time configuration step rather than ongoing manual work.

## Who Uses It

- `tenant_owner`
  Configures series for club programmes or recurring fleet activities.
- `skipper` / `qualified member`
  Creates series for trips they are responsible for running repeatedly.
- `scheduler` or delegated coordinator
  Manages series on behalf of the club, adjusting the schedule, pausing, or ending series as seasons change.

## What It Owns

- series definition: template + recurrence pattern
- schedule generation: producing individual trip instances from the series
- instance lifecycle: tracking which instances exist, their state, and how they relate to the series
- series-level controls: pause, resume, end, and modify future instances
- exclusion management: skipping specific dates within the series

## What It Does NOT Own

- the trip workflow for each instance (owned by [trip-planning-and-lifecycle.md](trip-planning-and-lifecycle.md))
- the shared operational calendar (owned by [../../backbone/calendar-and-scheduling.md](../../backbone/calendar-and-scheduling.md))
- tenant-level defaults for trip creation (owned by [../../platform/tenant-settings.md](../../platform/tenant-settings.md))
- manifest and crew handling within instances
- departure validation within instances

## Requires

- [trip-planning-and-lifecycle.md](trip-planning-and-lifecycle.md)
  Each generated instance is a full trip and must behave identically to a manually created trip.
- [../../backbone/calendar-and-scheduling.md](../../backbone/calendar-and-scheduling.md)
  Generated instances must appear in the shared operational schedule. Conflicts and vessel availability must be visible at the calendar level.
- [../../platform/tenant-settings.md](../../platform/tenant-settings.md)
  Tenants may control whether recurring trip creation is enabled and which roles can define series.

## Enhanced By

- Fleet management: vessel availability can be pre-checked against a generated series schedule before instances are confirmed.
- Notifications and reminders: upcoming instances in a series can trigger configurable reminders for the responsible sailor and crew.
- Logbook: completed instances of a series are grouped and browsable as a continuous programme history.

## Key Concepts

### Series

A series is a named, reusable template combined with a recurrence pattern.

The series owns:

- a trip template (vessel, responsible sailor, title, notes, and any other default fields)
- a recurrence pattern
- a start date and an optional end boundary
- an exclusion list
- a series state (active, paused, ended)

The series does not directly own its instances. Instances are generated from the series and then managed independently.

### Recurrence Patterns

A series must specify exactly one pattern:

- `daily`
  No additional configuration. An instance is generated every calendar day.
- `weekly`
  Requires `weekdays: number[]`. A list of days of the week (0 = Sunday, 6 = Saturday) on which instances are generated.
- `monthly`
  Requires `monthDays: number[]`. A list of calendar dates (1–31) on which instances are generated each month.
- `custom`
  Requires `interval: number` and `unit: 'days' | 'weeks' | 'months'`. Generates instances at fixed intervals from the series start date.

### Boundary Configuration

A series must have a start date. It terminates by one of two boundaries, whichever is reached first:

- `endDate`: an explicit calendar date after which no new instances are generated
- `occurrences`: a maximum count of instances after which the series ends

If neither boundary is set, the series continues until it is manually ended or paused.

### Exclusions

A series may define an `excludeDates` list: an array of specific dates where no instance should be generated even if the recurrence pattern would otherwise produce one.

Exclusions are useful for public holidays, maintenance windows, or one-off schedule interruptions that do not warrant pausing the whole series.

### Instances

Each instance is a full trip record derived from the series template at the time of generation.

Once generated, an instance:

- is independently editable without affecting the series or other instances
- can be individually cancelled without affecting the series
- retains a reference to the parent series for grouping and history purposes
- follows the standard trip lifecycle: `draft`, `planned`, `active`, `overdue`, `completed`, `cancelled`

### Series States

- `active`: generating instances on schedule
- `paused`: temporarily suspended; no new instances are generated until resumed
- `ended`: permanently closed; no further instances will be generated

## Business Rules

- A series must have a valid trip template before it can become active.
- A series must specify exactly one recurrence pattern.
- A series must have a start date.
- A series without an end boundary remains active until it is explicitly paused or ended.
- Generated instances are independent trip records. Editing or cancelling an instance does not affect the series or any other instance.
- Editing the series template after generation does not retroactively change already-generated instances.
- A series may apply template changes only to future instances that have not yet been generated.
- Excluded dates must not produce instances even when the pattern would otherwise apply.
- A paused series retains its pattern and existing instances; resuming the series generates instances from the resumption point forward.
- An ended series retains all previously generated instances in the logbook.
- Instances must behave identically to manually created trips in all trip workflows.
- A tenant may restrict which roles can create or manage series, subject to tenant settings.
- Series and their instances are tenant-scoped.

## Cross-References

- [trip-planning-and-lifecycle.md](trip-planning-and-lifecycle.md) — trip instance workflow, lifecycle states, and logbook behaviour
- [../../backbone/calendar-and-scheduling.md](../../backbone/calendar-and-scheduling.md) — shared operational schedule where instances surface
- [../../platform/tenant-settings.md](../../platform/tenant-settings.md) — tenant-level feature enablement and role restrictions
