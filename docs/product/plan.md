# Product Implementation Plan

## Purpose

This plan maps the product catalog to an implementation order based on domain dependencies.

Each product doc = one implementable feature that can be independently built, tested, and shipped.

## Feature Implementation Order

### Tier 1 -- Foundation (no dependencies, everything else needs these)

1. [membership-and-onboarding.md](domains/members/membership-and-onboarding.md)
2. [permissions-and-roles.md](domains/members/permissions-and-roles.md)
3. [calendar-and-scheduling.md](backbone/calendar-and-scheduling.md)

### Tier 2 -- Core Domains (depend on foundation)

4. [vessel-registry.md](domains/fleet/vessel-registry.md)
5. [trip-planning-and-lifecycle.md](domains/trips/trip-planning-and-lifecycle.md)
6. [equipment-registry.md](domains/equipment/equipment-registry.md)
7. [trip-manifest-and-guests.md](domains/trips/trip-manifest-and-guests.md)

### Tier 3 -- Qualifications (depend on membership + fleet)

8. [certifications-and-catalog.md](domains/qualifications/certifications-and-catalog.md)
9. [local-approvals.md](domains/qualifications/local-approvals.md)

### Tier 4 -- Operational Features (depend on core + qualifications)

10. [trip-departure-and-validation.md](domains/trips/trip-departure-and-validation.md)
11. [trip-completion-and-reporting.md](domains/trips/trip-completion-and-reporting.md)
12. [vessel-classes-and-restrictions.md](domains/fleet/vessel-classes-and-restrictions.md)
13. [vessel-readiness.md](domains/fleet/vessel-readiness.md)
14. [equipment-assignment.md](domains/equipment/equipment-assignment.md)

### Tier 5 -- Cross-Cutting (read from multiple domains)

15. [dashboard-and-home.md](cross-cutting/dashboard-and-home.md)
16. [profile-and-account.md](cross-cutting/profile-and-account.md)
17. [harbors-and-locations.md](cross-cutting/harbors-and-locations.md)
18. [search-and-operational-views.md](backbone/search-and-operational-views.md)
19. [notifications-and-reminders.md](backbone/notifications-and-reminders.md)
20. [tasks-and-inspections.md](backbone/tasks-and-inspections.md)

### Tier 6 -- Enrichment Modules (optional, each adds value independently)

21. Weather, route, incidents, media, trip-story, reporting
22. [trip-series-and-recurring.md](domains/trips/trip-series-and-recurring.md)
23. [equipment-lending-and-booking.md](domains/equipment/equipment-lending-and-booking.md)
24. [skills-and-recognition.md](domains/qualifications/skills-and-recognition.md)

### Tier 7 -- Platform + Modes (can be built in parallel)

25. [tenant-bootstrap-and-setup.md](platform/tenant-bootstrap-and-setup.md), [tenant-settings.md](platform/tenant-settings.md), [platform-administration.md](platform/platform-administration.md)
26. [platform-support-and-impersonation.md](platform/platform-support-and-impersonation.md), [seeded-catalog-adoption.md](platform/seeded-catalog-adoption.md), [import-and-export-strategy.md](platform/import-and-export-strategy.md)
27. [kiosk-mode.md](operating-modes/kiosk-mode.md)

## Domain Dependency Map

### Foundation Layer (no dependencies)

| Doc | Owns | Required By |
|-----|------|-------------|
| membership-and-onboarding | Person identity, tenant membership, entry paths, guest model | Everything |
| permissions-and-roles | Authorization model, permission bundles | Everything |
| calendar-and-scheduling | Time-based scheduling, state transitions, conflicts | Trips, tasks, equipment booking, vessel availability |

### Core Domain Layer (depends on foundation)

| Doc | Requires | Enhanced By |
|-----|----------|-------------|
| vessel-registry | membership | equipment-assignment, vessel-classes, vessel-readiness |
| vessel-classes-and-restrictions | vessel-registry | local-approvals, trip-departure |
| trip-planning-and-lifecycle | membership, vessel-registry, calendar | trip-manifest, trip-departure, trip-completion, all modules |
| trip-manifest-and-guests | trip-planning, membership | trip-departure, trip-completion |
| equipment-registry | membership | equipment-assignment, vessel-readiness |

### Qualification Layer (depends on membership + fleet)

| Doc | Requires | Enhanced By |
|-----|----------|-------------|
| certifications-and-catalog | membership, seeded-catalog-adoption | local-approvals, trip-departure |
| local-approvals | membership, vessel-registry, certifications | trip-departure, vessel-classes |
| skills-and-recognition | membership | standalone recognition only |

### Operational Layer (depends on core + qualifications)

| Doc | Requires | Enhanced By |
|-----|----------|-------------|
| trip-departure-and-validation | trip-planning, membership, local-approvals, vessel-registry | vessel-readiness, vessel-classes, weather |
| trip-completion-and-reporting | trip-planning | incidents, media, trip-story |
| vessel-readiness | vessel-registry, equipment-assignment, tasks-and-inspections | trip-departure |
| equipment-assignment | equipment-registry, vessel-registry | vessel-readiness |
| equipment-lending-and-booking | equipment-registry, calendar | trip-planning |

### Cross-Cutting Layer (reads from multiple domains)

| Doc | Requires | Enhanced By |
|-----|----------|-------------|
| dashboard-and-home | calendar, trip-planning, membership | Every domain |
| profile-and-account | membership | certifications, local-approvals, trip-planning |
| harbors-and-locations | standalone reference data | weather, route-planning, trip-planning |
| search-and-operational-views | calendar | Every domain |
| notifications-and-reminders | calendar | Every domain |

### Module Layer (optional enrichment)

| Doc | Requires | Enhanced By |
|-----|----------|-------------|
| weather-in-trip-context | trip-planning, harbors | trip-departure |
| route-planning-and-harbors | trip-planning, harbors | standalone |
| incidents | trip-planning | trip-completion, reporting |
| media-gallery | trip-planning | trip-story |
| trip-story | trip-planning | media |
| reporting-and-exports | calendar | Every domain |
| trip-series-and-recurring | trip-planning, calendar | standalone |

### Platform Layer (independent, supports all tenants)

| Doc | Requires | Enhanced By |
|-----|----------|-------------|
| tenant-bootstrap-and-setup | platform-administration | membership, permissions |
| tenant-settings | tenant-bootstrap | All domains |
| seeded-catalog-adoption | platform-administration | certifications |
| platform-support-and-impersonation | platform-administration | membership |
| import-and-export-strategy | standalone | All domains |

## Catalog Status

All product areas are now documented with clear boundaries, aggregate roots, and dependency relationships.

### Remaining Depth Gaps

- calendar feed scopes and privacy rules
- subscription model for calendar, tasks, and reminders
- qualification catalog detail for the first Denmark seed set
- tenant-level setup defaults by club type
- bounded-context map for implementation planning
- explicit integration contracts for reporting and operational views
