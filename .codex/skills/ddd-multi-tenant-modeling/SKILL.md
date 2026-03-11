---
name: ddd-multi-tenant-modeling
description: Model bounded contexts, aggregates, commands, events, and tenant boundaries for a multi-tenant product. Use when defining domain language, splitting contexts, designing persistence boundaries, or preventing tenant leakage in a sailing club trip logging app before implementation starts.
---

# DDD Multi-Tenant Modeling

## Overview

Use domain language first and infrastructure language second. Build the model around business consistency boundaries, not screens or ORM convenience.

## Modeling Sequence

1. Identify the bounded context being discussed.
2. List the core nouns and classify them as entity, value object, aggregate, policy, or event.
3. State the aggregate invariants in plain language.
4. Decide which commands mutate state and which events describe completed facts.
5. Mark where tenant boundaries apply and whether cross-tenant operations are forbidden, translated, or asynchronous.
6. Only then sketch repositories, read models, or APIs.

## Project Default Contexts

Start with these candidate bounded contexts:

- `Identity and Membership`: users, roles, permissions, tenant membership.
- `Fleet Management`: vessels, status, maintenance-relevant metadata.
- `Trip Logging`: trip drafts, departures, returns, crew assignments.
- `Qualifications and Safety`: certifications, required approvals, checklists.
- `Reporting`: read models, exports, dashboards.

Read `references/domain-map.md` when choosing or refining these boundaries.

## Multi-Tenant Rules

- Treat the tenant as part of the aggregate identity unless there is a strong reason not to.
- Do not model cross-tenant joins inside a write model.
- Prefer explicit tenant-scoped repositories and queries.
- If a feature spans tenants, model it as coordination between contexts, not shared mutable state.
- State whether an invariant is local to a tenant or global across the system.

## What Good Output Looks Like

Produce:

- `Bounded context`
- `Ubiquitous language`
- `Aggregates and invariants`
- `Commands`
- `Domain events`
- `Read-model needs`
- `Open design risks`

Keep definitions short. If a term is ambiguous, rename it instead of explaining it for three paragraphs.

## For This Project

Bias toward one primary write aggregate per major trip workflow:

- `Trip`
- `Vessel`
- `Membership`

Typical value objects include:

- `TripTimeWindow`
- `GeoPosition`
- `CrewRole`
- `TenantId`

Typical domain events include:

- `TripDraftCreated`
- `TripDeparted`
- `TripReturned`
- `CrewMemberAssigned`
- `MemberPermissionGranted`

Assume the delivery stack is:

- `React` and `TypeScript` for UI and application code
- `Supabase Postgres` for tenant-scoped persistence
- `Supabase Auth` for membership and sign-in integration
- `Vercel` for deployment of the web app
- `GitHub` as the source of truth for code and deployment flow

## Guardrails

- Do not let database tables define aggregate boundaries.
- Do not let frontend form layout define bounded contexts.
- Avoid generic names such as `Record`, `Manager`, or `Data`.
- If two rules change for different reasons, they probably belong in different contexts or policies.
