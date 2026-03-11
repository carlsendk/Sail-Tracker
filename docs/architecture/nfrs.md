# Non-Functional Requirements

This document defines day-0 non-functional requirements for Sail Tracker before feature implementation starts.

## Goals

- Keep the first version simple to operate and easy to extend.
- Preserve tenant isolation as a core system property.
- Support mobile-first usage in field conditions with unstable connectivity.
- Make internationalization a baseline capability instead of a retrofit.
- Keep the domain model portable even though the delivery stack is opinionated.

## Scope

These NFRs apply to:

- local development
- CI and deployment workflow
- platform administration
- tenant isolation
- user-facing web application behavior

## Priority Order

1. Security and tenant isolation
2. Data integrity and auditability
3. Maintainability and delivery speed
4. Usability on mobile devices
5. Localization and accessibility
6. Performance and cost efficiency

## Security

- All tenant data must be scoped by tenant identity.
- Cross-tenant access must be denied by default.
- Authorization must be permission-based.
- Platform-level access must be explicit and auditable.
- Secrets must never be committed to the repository.
- Local, CI, preview, and production environments must use separate credentials.

## Tenant Isolation

- Each club is a tenant.
- Each tenant gets a unique subdomain.
- The architecture must allow optional custom domains later.
- Seed data must exist for at least one real tenant and one demo tenant.
- Demo tenant data must never mix with real tenant data.

## Data Integrity

- The system must avoid silent data loss.
- Mutating actions must be traceable to actor, time, and tenant.
- Critical writes must be idempotent where practical.
- The domain model must be capable of enforcing tenant-scoped invariants.

## Auditability

- Record who created and changed critical records.
- Record permission and role changes.
- Record tenant creation and ownership changes.
- Leave room for future impersonation or support-access auditing.

## Availability And Reliability

- Local development must work without cloud deployment.
- The app must remain usable on modern mobile devices under weak network conditions.
- The first release does not need full offline parity, but it must be designed so offline draft support can be added without major redesign.
- CI must verify that the repository can build, lint, and test on every pull request.

## Performance

- Initial web load should feel responsive on a normal 4G connection.
- Tenant resolution by subdomain must be fast and deterministic.
- The design should avoid unnecessary server round-trips for core user flows.
- Seeded demo data must not degrade local developer startup.

## Internationalization

- The app must be built to support multiple languages from day 0.
- UI copy, validation messages, transactional text, and seed/demo content must be translatable.
- Date, time, number, and locale formatting must be user- or tenant-aware.
- No user-facing string should be hardcoded in components as a permanent pattern.

## Accessibility

- Keyboard navigation must be supported for primary flows.
- Color contrast and visible focus states are required.
- Form validation must be understandable without color alone.
- The initial component strategy must not block semantic HTML and assistive technology support.

## Maintainability

- Core domain logic should be isolated from framework-specific code.
- Repository structure must support incremental growth into a larger application.
- ADRs must capture important architectural decisions.
- Shared abstractions should only be introduced when they represent real boundaries.

## Observability

- The platform must support error reporting and structured logging later without major refactoring.
- CI failures must be clear and actionable.
- Key operational events should have obvious places to log from application code later.

## Cost And Simplicity

- The first version should fit within the baseline stack of GitHub, Vercel, and Supabase.
- Avoid extra infrastructure until a concrete requirement justifies it.
- Prefer simple operational choices over theoretical scalability features.

## Open Questions

- Whether platform admins can view tenant data directly or only through audited support flows.
- How strong offline capability needs to be in the first production release.
- Whether there are regulatory retention or deletion requirements for member and trip data.
