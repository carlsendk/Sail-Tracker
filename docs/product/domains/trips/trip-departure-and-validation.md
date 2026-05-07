# Trip Departure And Validation

## Purpose

This document defines how Sail Tracker decides whether a trip is allowed to depart.

It is the operational validation layer between:

- a planned trip on the calendar
- the action that makes that trip active

The goal is to keep this simple and trustworthy:

- normal trips should depart without heavy approval friction when data is already correct
- unsafe or invalid trips should be stopped clearly
- unusual cases should be handled as explicit exceptions, not hidden workarounds

## Why This Area Matters

The product should not only record trips.
It should help prevent avoidable mistakes before a vessel goes out.

Examples:

- the wrong vessel is double-booked
- the responsible sailor is not allowed to take that vessel
- a required inspection is overdue
- required readiness work has not been completed
- the planned manifest exceeds vessel capacity

If these checks are vague or scattered across several docs, the product will feel inconsistent and unsafe.

## Core Outcome

The product should make it easy to answer:

- is this trip valid as planned
- what is blocking departure
- what can be fixed directly
- what requires an explicit exception or approval

## Scope

This area covers:

- departure validation rules
- validation states
- blocking versus warning outcomes
- exception handling hooks
- relationship to one-off approvals

This area does not own:

- trip scheduling itself
- trip manifest structure in depth
- qualification catalogs
- vessel identity
- task execution or inspection templates

Those remain in their own areas.

## Aggregate Root

`departure_validation` -- the validation result for one trip's departure attempt, composed from schedule, vessel, sailor, manifest, and readiness checks.

## Who Uses It

- responsible sailors checking whether their trip is ready to go
- trip operators resolving departure blockers
- tenant administrators configuring which checks are blocking versus warning
- kiosk users departing trips on a shared device

## Requires

- [trip-planning-and-lifecycle.md](trip-planning-and-lifecycle.md) -- trip to validate
- [membership-and-onboarding.md](../members/membership-and-onboarding.md) -- responsible sailor identity
- [vessel-registry.md](../fleet/vessel-registry.md) -- vessel constraints and status
- [calendar-and-scheduling.md](../../backbone/calendar-and-scheduling.md) -- schedule state and conflicts
- [local-approvals.md](../qualifications/local-approvals.md) -- responsible-sailor eligibility

## Enhanced By

- [vessel-readiness.md](../fleet/vessel-readiness.md) -- equipment and readiness checks as departure gate
- [vessel-classes-and-restrictions.md](../fleet/vessel-classes-and-restrictions.md) -- class-level restriction enforcement
- [weather-in-trip-context.md](../../modules/weather-in-trip-context.md) -- weather warnings before departure
- [tasks-and-inspections.md](../../backbone/tasks-and-inspections.md) -- overdue blocking work

## Core Principle

Departure validation should use facts that already exist in the product.

That means:

- calendar provides schedule state and availability
- fleet provides vessel constraints
- qualifications provide responsible-sailor eligibility
- tasks and inspections provide readiness-related operational state
- trip data provides manifest and planned trip details

The system should validate against those facts.
It should not invent a separate approval-heavy workflow for ordinary valid trips.

## Validation Layers

The cleanest model is to validate a trip in layers.

### 1. Schedule Validation

Questions:

- is the trip in a state that may depart
- does it have planned start and planned return
- is the vessel free in the calendar
- is there a blocking conflict on that vessel or another required resource

This is primarily calendar-backed validation.

### 2. Vessel Validation

Questions:

- is the vessel active and not out of service
- does the vessel allow this trip type
- does the vessel require specific approvals
- are there vessel-side restrictions that block departure

This is primarily fleet-backed validation.

### 3. Responsible Sailor Validation

Questions:

- does the responsible sailor belong to the tenant
- does the responsible sailor have the required operational approval
- do any local operating limits block this trip
- is supervision required but missing

This is primarily qualification-backed validation.

### 4. Manifest Validation

Questions:

- is there a responsible sailor assigned
- does the total manifest exceed capacity
- are required participant details present
- are guests recorded in the allowed way

This is primarily trip-data validation.

### 5. Readiness Validation

Questions:

- is required readiness work complete
- is there a blocking overdue inspection
- is there a blocking maintenance item
- are required departure checks complete for this tenant or vessel

This is mainly calendar-backed operational validation with fleet and asset context.

### 6. Pre-Departure Safety Checklist

Some clubs require a physical safety checklist before departure.

The product should support a configurable pre-departure checklist with items such as:

- `equipment_check` -- life jackets available for all crew
- `communication_check` -- VHF radio present and working
- `first_aid_check` -- first aid kit present
- `fire_safety_check` -- fire extinguisher available

Additional checklist items that tenants may enable later:

- flares available
- anchor and rode
- charts and navigation tools
- weather forecast reviewed

The checklist should be:

- tenant-configurable (which items are shown, which are required)
- stored on the trip record as part of the departure context
- blocking or advisory depending on tenant configuration
- quick to complete on both desktop and kiosk/mobile interfaces

## Blocking Versus Warning

Not every validation result should behave the same way.

Use three levels:

- `pass`
  The rule is satisfied.
- `warning`
  The trip may still depart, but the system should call attention to the issue.
- `block`
  The trip may not depart until the issue is resolved or explicitly overridden.

Examples:

- missing optional route plan: warning at most
- vessel capacity exceeded: block
- required local approval missing: block
- note field incomplete: warning or ignore
- overdue required engine inspection: block if the tenant treats it as blocking

## Validation Outcome Model

Before departure, the user should be able to see:

- overall result
- blocking issues
- warnings
- what can be fixed immediately
- what needs a separate exception or approval

The product should not make users guess why a trip cannot leave.

## Departure States

A useful flow is:

- `draft`
  Not yet ready for validation as a real departure candidate.
- `planned`
  Ready to be validated and scheduled for departure.
- `departure blocked`
  Still planned, but currently prevented from starting because blocking rules fail.
- `ready to depart`
  All blocking rules pass.
- `active`
  Trip has departed.

The calendar may still surface this through its shared states, but the trip workflow should expose the richer validation result.

## Normal Case Versus Exception Case

Normal case:

- club data is up to date
- qualifications are recorded
- vessel is available
- required checks are complete
- trip departs without approval friction

Exception case:

- qualification is missing
- a one-off local override is needed
- a vessel restriction must be explicitly bypassed by an allowed person

The system should optimize for the normal case and make exceptions explicit.

## One-Off Exceptions

One-off exceptions should exist, but they should not become the default operating model.

Examples:

- allow this trip to depart with a specific responsible sailor even though a normal approval is missing
- allow this one departure despite a non-critical warning that the tenant has chosen to treat as overridable

Important rule:

- exceptions are explicit
- exceptions should be auditable later
- exceptions do not silently rewrite the normal rule model

This connects directly to the later `local-approvals.md` work.

## Relationship To Calendar

Calendar provides:

- planned state
- active state transition
- vessel availability
- blocking conflicts
- readiness task and inspection status where they are modeled as calendar-backed work

This area consumes those facts during departure validation.

## Relationship To Qualifications

Qualifications provide:

- operational approvals
- operating limits
- supervision requirements
- person-specific eligibility for vessel or vessel class

This area should consume those facts directly rather than forcing manual restatement at departure time.

## Relationship To Fleet

Fleet provides:

- vessel identity
- capacity
- vessel-side restrictions
- out-of-service status
- extra readiness requirements for that vessel

This area should consume those facts directly.

## Relationship To Tasks And Inspections

Tasks and inspections provide:

- required readiness work
- overdue blocking work
- scheduled maintenance or inspection states that should prevent departure

The exact list of blocking task categories may be tenant-configurable, but the validation model should stay consistent.

## Relationship To Tenant Settings

Tenant settings should be able to influence:

- which validation checks are enabled
- which checks are blocking versus warning
- which vessel classes require extra departure checks
- whether some modules are mandatory before departure

Tenant settings should not redefine the meaning of core trip states.

## Business Rules

- A trip must be in a departable state before it can become active.
- A trip must have planned start and planned return before departure.
- A responsible sailor must be present before departure.
- The responsible sailor must satisfy the relevant operational approval rules for that vessel or vessel class.
- Manifest count must not exceed vessel capacity.
- A trip may not depart if the vessel is not available in the calendar.
- A trip may not depart if the vessel is out of service.
- Blocking readiness work must prevent departure until resolved or explicitly overridden.
- Warnings may inform the user without blocking departure.
- Exceptions must be explicit and auditable.

## Product Outcome

If this area is working well, the club should experience:

- fast departure for normal valid trips
- clear reasons when departure is blocked
- fewer last-minute mistakes
- less manual gatekeeping
- a stronger bridge between planning and real-world operations
