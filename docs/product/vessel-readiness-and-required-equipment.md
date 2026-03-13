# Vessel Readiness And Required Equipment

## Purpose

This document defines how Sail Tracker should represent whether a vessel is ready for departure and what equipment or checks are required for that readiness.

It exists to connect four things cleanly:

- fleet expectations
- assigned equipment and components
- calendar-backed readiness work
- trip departure validation

## Why This Area Matters

A vessel may be visible and schedulable in the calendar, but still not be ready to leave.

Examples:

- required safety gear is missing
- an engine inspection is overdue
- a battery system check has not been completed
- a class-specific departure checklist is required
- one named vessel needs an extra readiness step

If readiness is vague, clubs will fall back to memory, paper checklists, or informal trust.

## Core Outcome

The product should make it easy to answer:

- is this vessel ready for departure
- what required equipment should be on it
- what checks are still missing
- what is blocking readiness
- what is only a warning versus a true departure blocker

## Scope

This area covers:

- vessel readiness expectations
- required equipment expectations
- required checks and checklist expectations
- readiness blockers versus warnings
- readiness relationship to departure validation

This area does not own:

- physical asset identity
- calendar task state itself
- trip lifecycle
- qualification approval

Those remain in the connected domains.

## Core Principle

The clean model is:

- fleet defines what readiness means for a vessel or vessel class
- equipment and assets define what components and gear are actually assigned
- tasks and inspections define the time-based checks and work
- trip validation decides whether departure may proceed

This keeps readiness as a composed operational fact rather than one giant domain.

## Readiness Model

Vessel readiness should be treated as an operational status derived from multiple facts.

Useful readiness outcomes include:

- `ready`
- `warning`
- `blocked`

Where:

- `ready` means all blocking readiness requirements are satisfied
- `warning` means non-blocking issues exist
- `blocked` means departure should not proceed until something is resolved or explicitly overridden

## Required Equipment Model

The product should support required-equipment expectations at:

- vessel class level
- named vessel level

Examples:

- all safety boats require a radio and first-aid kit
- all training dinghies require buoyancy aids and tow line
- one named vessel requires a specific battery setup

These requirements should describe what should be present, not duplicate the asset catalog itself.

## Required Check Model

The product should also support required checks such as:

- pre-departure checklist
- engine readiness check
- battery or electrical check
- safety gear inspection
- class-specific launch checklist

These checks may be:

- always expected
- expected for a class
- expected only for one vessel
- expected only for some trip types later

## Relationship To Equipment And Assets

Equipment and assets answer:

- what gear or components exist
- what is assigned to the vessel
- what is missing or out of service

This readiness area answers:

- whether that assigned state satisfies the vessel's requirements

Examples:

- the vessel requires a radio
- the asset model says whether a radio is assigned and usable
- readiness consumes that fact

## Relationship To Tasks And Inspections

Tasks and inspections answer:

- whether required readiness work has been completed
- whether blocking work is overdue
- whether a required inspection is still outstanding

This means readiness depends partly on calendar-backed work.

Examples:

- engine service overdue
- seasonal launch prep incomplete
- safety inspection still open

## Relationship To Fleet

Fleet should define:

- the vessel or class
- the readiness expectations
- the required equipment expectations
- any special vessel-side restrictions

This document goes deeper on how those expectations should be interpreted operationally.

## Relationship To Trip Validation

Trip validation should consume readiness as one of its major layers.

Examples:

- a vessel may be selected and otherwise valid, but blocked because required readiness work is incomplete
- a vessel may be allowed with warning if only non-blocking readiness issues remain

See also [`trip-validation-and-departure-rules.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-validation-and-departure-rules.md).

## Class-Level Versus Vessel-Level Readiness

The same inheritance idea as restrictions should apply here:

- a vessel inherits readiness expectations from its class
- the named vessel may add stricter expectations
- the named vessel should not silently weaken class-level safety expectations unless explicitly supported later

This keeps readiness consistent across similar vessels.

## Blocking Versus Warning

Not every readiness issue should behave the same way.

Examples of likely blockers:

- required safety equipment missing
- required inspection overdue
- critical component marked out of service

Examples of likely warnings:

- optional gear missing
- advisory maintenance note
- non-critical reminder not yet completed

Tenant settings may later influence this, but the model should always distinguish blockers from warnings.

## Business Rules

- A vessel or vessel class may define required equipment expectations.
- A vessel or vessel class may define required readiness checks.
- Vessel-level readiness rules may add stricter requirements than the class default.
- Readiness should be evaluated using assigned assets, component state, and calendar-backed readiness work.
- Blocking readiness failures should prevent departure until resolved or explicitly overridden where policy allows.
- Warning-level issues may inform the user without blocking departure.
- Required equipment expectations should not be confused with asset identity records themselves.

## Product Outcome

If this area is working well, the club should experience:

- clearer vessel-side departure safety
- less guesswork about what must be on the boat
- stronger consistency between fleet, assets, and tasks
- a more trustworthy departure workflow
