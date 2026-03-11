---
name: bdd-feature-slicing
description: Turn product requests into BDD-ready vertical slices with Given/When/Then scenarios, acceptance criteria, edge cases, and implementation order. Use when shaping new features, refining backlog items, defining MVP scope, or converting vague product ideas into testable slices for a multi-tenant sailing club trip logging app.
---

# BDD Feature Slicing

## Overview

Convert feature ideas into small, testable increments that can be built independently. Favor user-observable behavior, explicit business rules, and slices that can ship behind a flag without requiring the whole product.

## Workflow

1. Identify the actor, desired outcome, and business value.
2. State the invariant that must remain true after the feature is added.
3. Write the primary happy path as a single Given/When/Then scenario.
4. Add the minimum failure and permission scenarios that could change the design.
5. Split the work into vertical slices that each prove behavior end to end.
6. Define what must be tested at the acceptance, application, and domain levels.

## Output Shape

Produce these sections in order:

- `Feature statement`: one sentence in user language.
- `Actors`: who triggers the behavior and who is affected.
- `Rules`: flat list of business rules and constraints.
- `Scenarios`: short Given/When/Then cases.
- `Slices`: implementation order from smallest useful slice to broader coverage.
- `Open questions`: only the unknowns that block correct design.

## Slicing Rules

- Slice by workflow outcome, not by technical layer.
- Keep the first slice narrow enough to implement in one focused branch.
- Prefer one aggregate boundary per slice when possible.
- Separate permission handling from core happy-path behavior if that keeps the slice smaller.
- Reject slices that require "UI now, backend later" or "schema now, behavior later" unless the user explicitly asks for a spike.

## For This Project

Default to the sailing trip logging domain unless the user says otherwise. Use this language consistently:

- `tenant`: one club or sea scout group.
- `member`: a person belonging to a tenant.
- `trip`: one logged sailing outing.
- `vessel`: a boat managed by a tenant.
- `skipper`: the member responsible for the trip.

Default implementation assumptions for slices in this repo:

- frontend uses `React` with `TypeScript`
- deployment uses `Vercel`
- database, auth, and storage use `Supabase`
- source control and delivery workflow use `GitHub`

When the request touches trip creation or logging, read `references/sail-trip-slice-template.md` and mirror its structure.

## Guardrails

- Do not jump to tables, APIs, or components before the scenarios are stable.
- Do not hide policy in technical language; write the rule in domain language first.
- Do not produce one oversized "MVP" slice. Split until the first slice has a single clear success outcome.
- If multi-tenant behavior matters, include tenant isolation scenarios explicitly.
