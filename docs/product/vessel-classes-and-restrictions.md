# Vessel Classes And Restrictions

## Purpose

This document defines how Sail Tracker should represent vessel classes and the restrictions that apply at class or vessel level.

It exists to make one important distinction explicit:

- some operational rules apply to a named vessel
- some operational rules apply to a whole class of vessels

That distinction matters for approvals, trip validation, and fleet management.

## Why This Area Matters

Clubs often think in both of these ways:

- "this exact boat has special rules"
- "all training dinghies follow the same restrictions"

If the product only models one level, clubs either:

- duplicate rules across many vessels
- or lose the ability to express vessel-specific differences

This area gives the product a clean way to say both.

## Core Outcome

The product should make it easy to answer:

- what class a vessel belongs to
- what restrictions apply to all vessels in that class
- what restrictions apply only to this vessel
- how class-level rules affect approvals and trip validation

## Scope

This area covers:

- vessel class definitions
- class-level restrictions
- vessel-specific restrictions
- inheritance between class and vessel
- class-level operational meaning

This area does not own:

- qualification catalogs
- trip lifecycle
- calendar availability
- maintenance workflows

Those remain in their own areas.

## Core Principle

The product should treat vessel class as an operational grouping, not only a label.

That means vessel class can drive:

- approval scope
- restrictions
- readiness expectations later
- training or usage context

But the product must still allow a named vessel to carry its own exceptions and extra rules.

## Vessel Class Model

A vessel class should represent a meaningful group of similar vessels.

Examples:

- training dinghy
- keelboat
- motor support boat
- rowing boat
- safety boat

The point is not perfect naval taxonomy.
The point is operational usefulness for the club.

## Class-Level Facts

Useful class-level facts may include:

- class name
- class description
- typical capacity range later if useful
- normal operating context
- default approval requirements
- default restriction set

This lets the club avoid repeating the same rules on every matching vessel.

## Vessel-Level Facts

A named vessel may still override or extend the class defaults.

Examples:

- one training dinghy has reduced capacity
- one vessel is limited to a local harbor because of condition or setup
- one named vessel requires extra checks before departure

The product should support this without breaking the class model.

## Restriction Model

Restrictions should describe operational limits clearly.

Examples include:

- local waters only
- harbor only
- daytime only
- training use only
- supervision required
- no overnight trips
- weather or condition limits later

These restrictions may apply at:

- vessel class level
- vessel level

## Inheritance Rule

The cleanest behavior is:

- a vessel inherits its class-level restrictions
- the vessel may add stricter named-vessel restrictions
- the vessel should not silently weaken class-level safety rules unless the club explicitly supports that behavior later

This keeps class-level safety meaning stable.

## Relationship To Qualifications

Qualifications and local approvals may attach to:

- a vessel class
- a named vessel

Examples:

- approved for all training dinghies
- approved only for one specific vessel

This is one of the main reasons class modeling matters.

See also [`qualification-model.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/qualification-model.md).

## Relationship To Trip Validation

Trip validation should consume:

- class-level restrictions
- vessel-level restrictions
- class-level approval requirements
- vessel-specific overrides or additions

This means the trip validator should be able to answer:

- is this responsible sailor eligible for this class
- does this named vessel add stricter limits
- is this trip type blocked by class or vessel restrictions

See also [`trip-validation-and-departure-rules.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-validation-and-departure-rules.md).

## Relationship To Fleet

Fleet owns:

- the vessel class catalog
- vessel-to-class relationships
- vessel-side restrictions

This document goes deeper on how those class and restriction rules should behave.

## Relationship To Readiness

Some readiness expectations may later come from:

- all vessels in a class
- one named vessel

Examples:

- all safety boats require a specific checklist
- one named vessel requires extra pre-departure attention

This is why this document should come before `vessel-readiness-and-required-equipment.md`.

## Business Rules

- Every vessel may belong to zero or one class initially, with zero allowed only if the tenant chooses not to use classes.
- Class-level restrictions should apply to all vessels in that class.
- Vessel-level restrictions may add stricter limits than the class default.
- Qualification and approval scope should be able to target either a class or a named vessel.
- Trip validation should consider both class-level and vessel-level restrictions.
- Clubs should be able to use classes for operational meaning, not just display grouping.

## Product Outcome

If this area is working well, the club should experience:

- less duplicated rule setup
- clearer approval scope
- more understandable trip validation
- cleaner fleet configuration as the number of vessels grows
