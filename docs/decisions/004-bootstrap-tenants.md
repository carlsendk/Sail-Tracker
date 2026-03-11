# ADR 004: Initial Tenant Bootstrap

## Status

Accepted

## Date

2026-03-11

## Decision

Bootstrap the platform with:

- one initial platform admin
- one real tenant using the placeholder slug `club`
- one demo tenant using the slug `demo`

Each tenant must have at least one `tenant_owner`.

## Context

The project needs a stable starting point for:

- local development
- preview environments
- production setup planning
- future tenant onboarding design

The bootstrap model must support a real operating tenant and a demonstration tenant from the beginning.

## Rationale

- A real tenant placeholder keeps the system grounded in operational use.
- A demo tenant supports preview environments, testing, and product walkthroughs.
- Defining the tenant slugs early makes environment conventions more concrete.
- Defining the initial admin and owner model avoids unclear setup responsibility later.

## Consequences

### Positive

- clearer bootstrap requirements
- clearer seed-data boundaries
- easier environment planning

### Negative

- bootstrap design now carries placeholder assumptions that may need later refinement
- tenant creation flow still needs separate design and implementation

## Follow-Up Decisions

- how bootstrap is implemented in Supabase
- how demo data is reset or refreshed
- whether preview environments should always include both baseline tenants
