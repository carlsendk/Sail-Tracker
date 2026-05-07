# Incidents

## Purpose

This module defines how Sail Tracker captures, classifies, reviews, and follows up on notable operational events connected to trips.

It should help clubs record more than free-text notes when something important happens, without turning every trip into a heavy safety case workflow.

## Why This Is A Module

Incidents are closely connected to trips, weather, route, and reporting, but they should not own:

- trip lifecycle
- calendar state
- vessel readiness rules
- qualification rules
- general reporting

Instead, this module should own the structured incident record and its immediate follow-up context.

That makes incidents a supporting trip-enrichment module with strong safety relevance.

## Core Product Outcome

The product should make it easy to answer:

- did anything notable happen on this trip
- what kind of incident was it
- how serious was it
- who and what were involved
- what follow-up is required
- what should later appear in reporting, review, or export

## Scope

This module covers:

- structured incident capture on or after a trip
- incident classification
- severity and attention level
- people, vessel, and asset involvement
- immediate actions and follow-up needs
- incident visibility in trip history and reporting later

This module does not own:

- emergency response tooling
- live alerting workflows beyond normal product notifications later
- trip state ownership
- long-form narrative trip summary ownership
- weather or route ownership

## Core Concepts

- `incident`
  A structured record of a notable operational event associated with a trip.
- `incident type`
  A category such as injury, equipment failure, near miss, grounding, weather-related issue, late return, or rule deviation.
- `severity`
  The seriousness or attention level of the incident.
- `involved party`
  A member, guest, vessel, or asset connected to the incident.
- `follow-up action`
  A task, review, repair, or administrative step that should happen after the incident.
- `incident outcome`
  The immediate result, such as resolved onboard, returned early, required repair, or requires review.

## What Counts As An Incident

The module should support a broad enough model for real club life.

Examples include:

- injury or first-aid event
- equipment failure
- engine problem
- grounding or collision
- taking on water
- weather-related early return
- missing or failed safety equipment
- near miss
- late return with notable cause
- guest or crew issue that requires follow-up

Not every unusual detail should become an incident.
Clubs should still be able to leave ordinary observations in trip notes.

## Incident Versus Note

This distinction should stay clear.

- `trip note`
  General observation, summary, or context that does not need structured safety follow-up.
- `incident`
  A notable event that benefits from structured classification, review, or reporting.

The product should help users choose the right level of structure without making normal trips feel bureaucratic.

## Relationship To Trip Workflow

Incident capture should fit naturally into trip completion and trip review.

### During Active Trip

The product may allow lightweight incident capture during an active trip where useful.

This should stay simple:

- note what happened
- record rough type and severity
- add involved people or equipment later if needed

The goal is fast capture, not a full investigation during operations.

### At Trip Completion

Trip completion is the most natural place for structured incident capture.

The trip flow should make it possible to:

- record no incident
- record one or more incidents
- capture immediate outcome
- indicate whether follow-up is needed

Some clubs may require explicit incident review during report-back.

### After Trip Completion

Clubs may need to refine or complete the incident record later.

Examples:

- clarify what equipment failed
- add repair or readiness follow-up
- classify severity more accurately
- attach supporting photos or notes later

This module should support correction and enrichment without losing auditability.

## Severity And Attention Model

The module should support a practical severity model that helps clubs react appropriately.

Useful levels might include:

- `minor`
  Informational but worth recording.
- `significant`
  Needs follow-up or review.
- `serious`
  Requires clear attention, stronger review, and likely reporting or repair action.

The exact labels may vary by tenant later, but the product should preserve the idea that not all incidents are equal.

## Relationship To People, Vessels, And Assets

Incidents may involve:

- the responsible sailor
- crew members
- guests
- the vessel
- assigned equipment
- shared assets used on the trip

This module should not duplicate those domains.
It should reference them as involved parties and affected resources.

## Relationship To Weather And Route

Weather and route often provide context for an incident.

Examples:

- strong gusts contributed to the event
- route changed before the incident
- harbor deviation was part of the response

This module should consume that context where useful, but not take ownership of it.

## Relationship To Calendar

Calendar owns the time-based trip record and broader operational attention.

The incident module should use that timeline to answer:

- when the incident happened
- which trip it belongs to
- whether follow-up actions later become scheduled work

If an incident creates a repair, inspection, or review task, that later time-bound work should belong in the calendar-backed task/inspection model.

## Relationship To Reporting

Incidents should be visible in reporting, but reporting should not own incident structure.

Useful outputs later include:

- incident counts by period
- incident types by vessel class
- serious incidents requiring board or leader review
- patterns of equipment-related incidents
- exportable incident summaries with appropriate redaction

## Privacy And Sensitivity

Incident data may be more sensitive than ordinary trip data.

This module should support careful visibility for things such as:

- injury detail
- personal detail about minors or guests
- sensitive narrative notes
- exception rationale
- follow-up responsibility

The system should allow an incident to be structurally visible without exposing every sensitive detail to every user who can see the trip.

## Follow-Up Model

Incident capture is not complete if the product cannot express what should happen next.

Useful follow-up outcomes include:

- no further action
- review needed
- maintenance or repair needed
- qualification or permission review later
- policy or safety-process review later

The incident module should own the fact that follow-up is needed.
The actual scheduled follow-up work should connect into the calendar/task model.

## Tenant Configuration

Tenant settings may later control:

- whether incident capture is enabled
- whether incident review is required at trip completion
- which incident types are available
- whether severity is required
- whether follow-up fields are mandatory
- who may view, edit, or close incident follow-up

## Business Rules

- Incidents enrich trips; they do not own trip state.
- Incident records should stay structured enough to support later review and reporting.
- Trip notes and incidents should remain distinct.
- Incident follow-up may create calendar-backed work, but the incident record remains the source of truth for what happened.
- Sensitive incident detail should respect permission and privacy rules.
- A club should be able to record “no incident” without extra friction, and record a serious incident without losing structure.
