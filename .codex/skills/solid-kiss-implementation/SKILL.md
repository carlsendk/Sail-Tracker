---
name: solid-kiss-implementation
description: Implement features with simple, cohesive code that respects SOLID and KISS without introducing speculative abstraction. Use when writing or reviewing application services, domain objects, repositories, UI components, or tests for the sailing trip logger and you need enforceable implementation guardrails.
---

# SOLID KISS Implementation

## Overview

Keep the code boring in the good sense: small units, explicit names, shallow indirection, and tests that prove behavior. Apply SOLID as pressure toward cohesion and replaceability, not as an excuse to multiply interfaces.

## Implementation Order

1. Start from the behavior slice and domain rule.
2. Implement the smallest domain object or policy needed.
3. Add one application use case that coordinates the work.
4. Add only the repository or gateway ports required by that use case.
5. Keep the UI thin and bind it to the use case, not to persistence details.
6. Write tests at the level where the rule lives.

## Practical Rules

- `Single responsibility`: one reason to change per module.
- `Open/closed`: extend with composition before inheritance.
- `Liskov`: keep contracts strict and unsurprising.
- `Interface segregation`: prefer narrow ports near the consumer.
- `Dependency inversion`: depend on domain-facing abstractions at boundaries only.
- `KISS`: delete accidental flexibility until the design fits the current need exactly.

Read `references/guardrails.md` when reviewing architecture or deciding whether an abstraction is justified.

## Preferred Structure

For each feature slice, bias toward:

- one domain module with entities, value objects, or policies
- one application use case per user action
- one persistence adapter per backing service
- one UI flow composed from small presentational pieces

Avoid "shared utils" until duplication proves the shared concept is stable.

## Review Heuristics

Flag these quickly:

- repository methods that expose ORM-shaped data instead of domain intent
- service classes that mix validation, authorization, persistence, and mapping
- components that know business rules and SQL/API shapes
- generic helpers whose names do not reveal a domain concept
- tests that assert implementation details rather than business outcomes

## For This Project

Examples of good seams:

- `CreateTripDraft`
- `RecordDeparture`
- `RecordReturn`
- `AssignCrewMember`
- `CanMemberLogTrip`

Examples of suspicious seams:

- `TripManager`
- `DataService`
- `handleSubmitEverything`
- `processTrip`

Assume implementation targets:

- `React` function components with `TypeScript`
- server-side and integration code that can run cleanly on `Vercel`
- `Supabase` adapters isolated behind application-facing ports
- `GitHub` as the delivery path for pull requests, reviews, and deployment triggers

## Guardrails

- Prefer two simple modules over one configurable framework.
- Duplicate small code once before extracting a shared abstraction.
- If a type or interface has only one plausible implementation and no boundary value, keep it concrete.
- If naming is hard, the domain boundary is probably unclear. Fix the model before adding code.
