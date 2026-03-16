# Trip Completion And Reporting

## What Problem Does This Solve

When a vessel returns to dock, the club needs to close the operational loop reliably.

Without a structured completion flow, clubs run into common problems:

- no one records actual return time
- crew return is assumed but never confirmed
- safety equipment is not checked after use
- incidents go unreported because the flow does not prompt for them
- the logbook is missing half the picture because only departure was captured

This area ensures that every trip that goes out has a structured, low-friction way to come back in.
The goal is not to create paperwork. The goal is to make return reporting feel as natural as departure.

## Who Uses It

- `skipper` or `responsible sailor`
  The person primarily expected to complete the trip on return.
- `tenant_owner` or `club administrator`
  May complete a trip on behalf of a skipper, or review completion data afterward.
- `kiosk user`
  Completes the return report from a shared club device at the dock or clubhouse.

## What It Owns

### Aggregate Root

The completion record is a sub-document of the trip. It does not exist independently.

### Data Captured At Completion

- Actual return time (required)
- Actual distance or duration where relevant
- Summary observations
- Per-crew return confirmation (see below)
- Incidents or notable deviations
- Actual weather (text observation)
- Actual sea conditions (text observation)
- Trip report narrative
- Completed by (person ID, typically the skipper)
- Completed at timestamp
- Optional media and trip story where those modules are enabled

### Crew Return Confirmation

Every person on the trip manifest should be confirmed as returned.

Each manifest entry gets a `returned` flag, checked by default.

The skipper may uncheck a crew member if they did not return with the vessel (for example, disembarked at another harbor). The system should prompt for a note in that case.

If the `all_crew_returned` safety check is not resolvable, departure from the completion flow must explain why.

### Safety Completion Checklist

Before a trip can transition to `completed`, all four safety checks must be confirmed.

These are not optional by default:

| Key | Label |
|-----|-------|
| `all_crew_returned` | All crew returned safely |
| `no_incidents` | No safety incidents occurred |
| `equipment_checked` | All safety equipment accounted for |
| `boat_secured` | Boat properly secured at dock |

Each check is a boolean. All four must be `true` to complete the trip.

If `no_incidents` is unchecked, the system should guide the skipper toward the incidents module where enabled.

### State Transition

This area owns the action that transitions a trip from `active` to `completed`.

The trip lifecycle states themselves (including `active`, `completed`, `overdue`) are owned by
[trip-planning-and-lifecycle.md](trip-planning-and-lifecycle.md).

This area owns the workflow, the data captured, and the safety confirmations that make that transition valid.

## What It Does Not Own

- Trip lifecycle state definitions — those live in [trip-planning-and-lifecycle.md](trip-planning-and-lifecycle.md)
- Manifest structure and crew entry definitions — those live in [trip-manifest-and-guests.md](trip-manifest-and-guests.md)
- Departure validation rules — those live in [trip-departure-and-validation.md](trip-departure-and-validation.md)
- Incident record structure — that lives in [../../modules/incidents.md](../../modules/incidents.md)
- Media storage and gallery behavior — that lives in [../../modules/media-gallery.md](../../modules/media-gallery.md)
- Trip story content and publishing — that lives in [../../modules/trip-story.md](../../modules/trip-story.md)

## Requires

Hard dependencies that must be in place for this area to function:

- A trip in `active` state with an assigned responsible sailor and a manifest
- A person identity for the completer (typically the skipper)
- The calendar backbone to accept the `completed` state transition and record the actual return time

See [../../backbone/calendar-and-scheduling.md](../../backbone/calendar-and-scheduling.md).

## Enhanced By

These modules are optional but integrate directly with the completion flow when enabled:

- `incidents` — structured report if `no_incidents` is unchecked
- `media-gallery` — attach photos and video taken during the trip
- `trip-story` — write or generate a narrative post for the trip
- Tenant trip configuration — controls which fields are required and which modules are active

See [../../platform/tenant-settings.md](../../platform/tenant-settings.md).

## Key Concepts

### Minimum Completion

The simplest valid completion is:

1. Confirm actual return time
2. Tick all four safety checks
3. Submit

Everything else is optional unless tenant configuration requires it.
The flow must not become a long form that discourages reporting.

### Crew Return Accountability

The product should show each manifest entry with a `Returned` checkbox defaulting to checked.
If any crew member did not return with the vessel, the skipper unchecks them and adds a note.

This keeps headcount accountability without forcing every trip to go through a manual sign-off ceremony.

### Post-Trip Narrative

The completion form may include a post-trip report section.

This is separate from the trip story module.
The report is operational (actual conditions, summary of the outing).
The story module is communicative (shareable summary for members or social purposes).

The report is captured by the completer and stays internal unless the tenant surfaces it in the logbook.

### Overdue Trips

If the planned return time passes and the trip is not completed, the trip transitions to `overdue`.

Completion from the `overdue` state follows the same workflow.
The system should not block completion because a trip is overdue.
It may surface the overdue flag in the completion view to prompt explanation.

## Business Rules

- A trip cannot be completed without an actual return timestamp.
- All four safety checks must be confirmed before a trip can transition to `completed`.
- Per-crew return confirmation is checked by default; any unchecked entry should include a note.
- The completion record must capture who completed it (completed by) and when (completed at).
- If `no_incidents` is unchecked and the incidents module is enabled, the system should prompt the skipper to file an incident report.
- Completion is not reversible without explicit admin intervention.
- A completed trip manifest and its completion record must remain part of the permanent operational record.
- Tenant configuration may make additional completion fields required (for example, actual distance, actual weather).
- Tenant configuration may disable or require specific optional modules at completion time.
- The completion flow must remain usable from kiosk mode on a shared device.

## Cross-References

- [trip-planning-and-lifecycle.md](trip-planning-and-lifecycle.md) — trip lifecycle and state ownership
- [trip-manifest-and-guests.md](trip-manifest-and-guests.md) — crew manifest and per-person return tracking
- [trip-departure-and-validation.md](trip-departure-and-validation.md) — the departure counterpart to this area
- [../../modules/incidents.md](../../modules/incidents.md) — structured incident capture linked from completion
- [../../modules/media-gallery.md](../../modules/media-gallery.md) — photo and video attachments
- [../../modules/trip-story.md](../../modules/trip-story.md) — narrative post for the completed trip
- [../../backbone/calendar-and-scheduling.md](../../backbone/calendar-and-scheduling.md) — state transition and actual return time recording
- [../../platform/tenant-settings.md](../../platform/tenant-settings.md) — tenant-level completion field and module configuration
