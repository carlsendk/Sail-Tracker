# Trip Manifest And Guests

## Purpose

This document defines how Sail Tracker represents the people on a trip.

It covers:

- who appears on the manifest
- how members and guests differ
- how the responsible sailor relates to the manifest
- what minimum information is needed for safe operations

The goal is to keep the manifest simple enough for real club use while still making it trustworthy.

## Why This Area Matters

For many clubs, the manifest is one of the most important operational records.

It answers questions such as:

- who is on the water right now
- who is the responsible sailor
- are there guests onboard
- how many people are on this vessel
- who needs to be accounted for when the trip returns

If this is loose or inconsistent, the product loses much of its operational value.

## Core Outcome

The product should make it easy to:

- add members quickly
- add guests without friction
- keep a clear headcount
- identify the responsible sailor unambiguously
- preserve a dependable record of who was onboard

## Scope

This area covers:

- manifest structure
- member entries
- guest entries
- responsible-sailor representation
- headcount rules
- manifest editing in draft, planned, and active states
- manifest behavior in kiosk mode

This area does not own:

- sign-in identity
- qualification approvals
- trip validation as a whole
- trip completion reporting

Those remain in their own areas.

## Core Principle

The manifest should represent operational participation, not just user accounts.

That means:

- a member may be on the manifest
- a guest may be on the manifest
- the responsible sailor is a special role in the trip, not just another name
- not every person on the manifest needs a full platform account

The manifest should be able to reflect the real boat, not just the people already modeled deeply in the system.

## Manifest Entry Types

The cleanest model is to support distinct manifest entry types.

### 1. Responsible Sailor

The responsible sailor is the accountable operator for the trip.

This person should:

- be clearly identified
- belong to the tenant
- satisfy the relevant departure rules
- remain visible as a special role in the trip record

The responsible sailor may also be counted as part of the manifest headcount, but should not be hidden inside generic crew rows.

### 2. Member Participant

A normal club member on the trip.

This person should be linkable to:

- their tenant membership
- their person identity
- relevant participation history later

The manifest should make it easy to add members from the tenant roster.

### 3. Guest Participant

A guest is a person on the trip who is not represented as a full member account by default.

The product should support:

- guest name
- optional age group or role later if useful
- optional contact or host information where tenant policy requires it

Guests should be easy to add because real trips often include them.

## Headcount Model

The manifest must make headcount dependable.

That means the product should be able to answer:

- total people onboard
- how many are members
- how many are guests
- who has not yet been accounted for if the trip is still active

The simplest safe rule is:

- every person physically onboard should appear in the manifest
- the responsible sailor counts as onboard unless explicitly modeled otherwise

## Minimum Manifest Data

The minimum safe data should stay lightweight.

For members:

- person reference

For guests:

- display name

For the trip as a whole:

- responsible sailor
- total manifest count

Tenants may later require more, but the baseline flow should stay fast.

## Optional Guest Detail

Some clubs will want richer guest handling.

Possible guest details include:

- invited by or host member
- emergency contact
- age category
- notes relevant to the trip

The product should allow this without requiring it for every simple outing.

## Manifest Editing Rules

The manifest should behave differently depending on trip state.

### Draft

In `draft`, the manifest should be freely editable.

### Planned

In `planned`, the manifest should still be editable, but changes may affect:

- departure validation
- vessel capacity checks
- notifications later

### Active

In `active`, manifest changes should still be possible when needed, but the system should preserve audit clarity around who was onboard and when changes were made.

### Completed

In `completed`, the manifest should become part of the fixed operational record, with corrections handled carefully rather than casually overwriting history.

## Relationship To Departure Validation

The manifest contributes directly to departure validation.

Examples:

- no responsible sailor assigned
- headcount exceeds vessel capacity
- required participant details missing
- required crew composition missing later if a tenant uses that

See also [`trip-validation-and-departure-rules.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-validation-and-departure-rules.md).

## Relationship To Memberships And Identity

Memberships and identity define who a member is.

This area defines how that person appears on a trip.

Important rule:

- the manifest consumes identity records
- it does not replace the identity model
- guest entries are operational records, not forced full identities

## Relationship To Kiosk Mode

Kiosk mode should make manifest capture faster, not create a different manifest model.

That means kiosk flows should still use:

- the same responsible-sailor rules
- the same member lookup behavior
- the same guest model

But kiosk mode may optimize for:

- faster member search
- rapid guest entry
- touch-friendly headcount updates

## Relationship To Reporting

Reporting should later be able to use manifest data for:

- participation summaries
- trip attendance history
- guest versus member counts

This area should preserve enough structure to support that later.

## Business Rules

- Every manifest belongs to exactly one trip.
- Every person physically onboard should be representable in the manifest.
- A trip must have exactly one responsible sailor before departure.
- Member entries should link to tenant-valid people records.
- Guest entries should not require full member creation by default.
- Manifest headcount must be clear enough to validate against vessel capacity.
- Completed trip manifests should remain part of the operational record.
- Kiosk mode should reuse the same manifest model, not a separate simplified data model.

## Product Outcome

If this area is working well, the club should experience:

- faster trip creation
- clearer accountability
- safer headcount handling
- less friction for guests
- better historical records of who went out
