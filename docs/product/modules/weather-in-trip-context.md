# Weather In Trip Context

## Purpose

This module defines how weather information enriches planning, departure, active-trip awareness, and trip completion in Sail Tracker.

It does not try to turn the product into a full weather platform.
Its job is to bring relevant weather context into the trip workflow at the right time.

## Why This Is A Module

Weather matters to almost every sailing decision, but it should not own:

- trip lifecycle
- qualification rules
- vessel rules
- calendar state

Instead, it should enrich those areas with decision-support context.

That makes weather a supporting trip-enrichment module rather than a backbone area or core domain.

## Core Product Outcome

The product should make it easy to answer:

- what the forecast looked like when the trip was planned
- what weather warnings applied near departure
- what conditions were actually experienced during the trip
- whether weather contributed to trip changes, incidents, or exceptions
- what weather context belongs in the later trip record

## Scope

This module covers:

- forecast context for planned trips
- departure-time weather awareness
- observed conditions captured during or after a trip
- weather warnings relevant to trip planning and operation
- weather context in trip summaries and reporting later

This module does not own:

- the official source of trip go/no-go decisions
- the trip state machine
- vessel eligibility or readiness rules
- incident ownership
- route planning ownership

## Core Concepts

- `forecast context`
  Weather information associated with a planned or upcoming trip.
- `departure weather check`
  The weather context visible when a responsible sailor is preparing to leave.
- `observed conditions`
  Human-recorded or system-captured weather conditions associated with the actual trip.
- `weather warning`
  A notable advisory, threshold, or caution relevant to trip planning or departure.
- `weather snapshot`
  A time-bound representation of weather context captured at a meaningful moment such as planning, departure, or completion.

## Planning Versus Observed Weather

This distinction should stay explicit.

### Planning Weather

Used before departure.

Examples:

- expected wind
- forecast precipitation
- visibility expectations
- temperature
- warning or caution indicators

This helps users understand the conditions they are planning into.

### Observed Weather

Used as part of the trip record.

Examples:

- actual wind and sea conditions noted by the skipper
- weather changed significantly from forecast
- unexpected rain, visibility, or gusts
- weather became part of an incident or early return

This helps the trip record remain useful historically.

The product should not silently blur forecast and observed conditions into one field.

## Relationship To Trip Workflow

Weather should enrich several trip moments.

### Trip Creation And Planning

Weather may be shown while:

- creating a draft
- choosing a departure time
- evaluating whether the trip should stay local or go farther

The goal is awareness, not forced complexity for every simple sail.

### Departure Validation

Weather should be visible at departure if the tenant has this module enabled.

It may contribute to:

- caution prompts
- visibility of warnings
- stronger review of qualification or vessel suitability later

But weather alone should not secretly change the trip state.
If a trip is blocked or warned, that should be explicit in the departure validation outcome.

### Active Trip

During an active trip, weather context may remain useful for:

- quick reference
- later observed-condition logging
- incident follow-up

The module should avoid turning the active trip flow into a data-entry burden.

### Trip Completion

At completion, the trip may record:

- observed conditions summary
- notable weather change
- whether weather affected route, timing, or safety

This becomes part of the richer trip record.

## Relationship To Calendar

Calendar owns the planned time window and operational state of the trip.

Weather should use that timeline to answer:

- what forecast was relevant for this planned departure window
- what warning context existed around this scheduled trip
- what conditions were associated with this trip in time

Weather should not become a parallel time model.

## Relationship To Qualifications And Vessel Rules

Weather can influence operational decisions, but it should not replace qualification or vessel rules.

Examples:

- a club may require more experienced sailors in stronger conditions
- a small vessel may be unsuitable in some forecast ranges
- a warning may trigger a manual review or stronger caution

Those rules belong in qualifications, vessel restrictions, and departure validation.
Weather provides context that those areas can consume.

## Relationship To Route Planning And Incidents

Weather is closely related to route and incident modules, but ownership should stay separate.

- route planning owns the intended path and harbor/navigation context
- incidents own safety events and follow-up
- weather owns the condition context that may influence either of them

This keeps the module useful without becoming another catch-all safety area.

## Weather Warning Model

The module should support the idea that some conditions deserve stronger visibility.

Useful outcomes include:

- `informational`
  Weather is shown for awareness only.
- `caution`
  The user should review the conditions before departure.
- `elevated attention`
  The product should make the risk more visible and may require explicit acknowledgement later.

The exact thresholds should not be globally hardcoded in a way that ignores tenant context.
Tenants may later tune how strong weather prompts should be.

## Weather Snapshot Model

A trip may hold several weather snapshots over time.

Useful snapshots include:

- planning snapshot
- departure snapshot
- completion snapshot

These snapshots help with:

- understanding what was known at planning time
- audit and review later
- reporting on trips and incidents

The product does not need to expose every raw weather update to be useful.
It should keep the captured weather context understandable.

## Lightweight By Default

The module should not make a short local sail feel heavy.

That means:

- show relevant weather context automatically where possible
- avoid forcing manual weather entry for every trip
- keep observed-condition entry short unless the tenant wants more structure

Richer clubs can later require more structured weather capture.

## Tenant Configuration

Tenant settings may later control:

- whether weather is shown during planning
- whether departure weather acknowledgement is required
- whether observed conditions are optional or required at completion
- how strongly warnings are surfaced
- which weather fields are visible in trip summaries and exports

## Reporting And Export Relationship

Weather may later appear in:

- trip reports
- operational summaries
- incident follow-up exports
- seasonal reviews of conditions and activity later

Reports should make it clear whether they are using:

- forecast context
- observed conditions
- or both

## Business Rules

- Weather enriches trip decisions; it does not own trip state.
- Forecast context and observed conditions should remain distinct.
- Weather warnings should be explicit, not hidden side effects.
- Weather should reuse the trip and calendar timeline rather than introducing a new one.
- Tenant policy may strengthen how weather is shown or acknowledged.
- Weather detail included in exports should respect tenant permissions and privacy rules.
