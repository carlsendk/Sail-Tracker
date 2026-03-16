# Product Docs

This folder describes the intended product shape of Sail Tracker.

Use it to keep the system understandable as:

- one product
- one tenant-aware platform
- one calendar backbone
- several clear domains and supporting modules

Each doc = one bounded context or sub-domain that can be independently implemented, tested, and shipped.

## Structure

### Backbone (`backbone/`)

- [calendar-and-scheduling.md](backbone/calendar-and-scheduling.md)
- [tasks-and-inspections.md](backbone/tasks-and-inspections.md)
- [notifications-and-reminders.md](backbone/notifications-and-reminders.md)
- [search-and-operational-views.md](backbone/search-and-operational-views.md)

### Core Domains (`domains/`)

**Trips** (`domains/trips/`)

- [trip-planning-and-lifecycle.md](domains/trips/trip-planning-and-lifecycle.md)
- [trip-departure-and-validation.md](domains/trips/trip-departure-and-validation.md)
- [trip-manifest-and-guests.md](domains/trips/trip-manifest-and-guests.md)
- [trip-completion-and-reporting.md](domains/trips/trip-completion-and-reporting.md)
- [trip-series-and-recurring.md](domains/trips/trip-series-and-recurring.md)

**Fleet** (`domains/fleet/`)

- [vessel-registry.md](domains/fleet/vessel-registry.md)
- [vessel-classes-and-restrictions.md](domains/fleet/vessel-classes-and-restrictions.md)
- [vessel-readiness.md](domains/fleet/vessel-readiness.md)

**Members** (`domains/members/`)

- [membership-and-onboarding.md](domains/members/membership-and-onboarding.md)
- [permissions-and-roles.md](domains/members/permissions-and-roles.md)

**Qualifications** (`domains/qualifications/`)

- [certifications-and-catalog.md](domains/qualifications/certifications-and-catalog.md)
- [local-approvals.md](domains/qualifications/local-approvals.md)
- [skills-and-recognition.md](domains/qualifications/skills-and-recognition.md)

**Equipment** (`domains/equipment/`)

- [equipment-registry.md](domains/equipment/equipment-registry.md)
- [equipment-assignment.md](domains/equipment/equipment-assignment.md)
- [equipment-lending-and-booking.md](domains/equipment/equipment-lending-and-booking.md)

### Cross-Cutting (`cross-cutting/`)

- [dashboard-and-home.md](cross-cutting/dashboard-and-home.md)
- [pwa-and-offline.md](cross-cutting/pwa-and-offline.md)
- [profile-and-account.md](cross-cutting/profile-and-account.md)
- [harbors-and-locations.md](cross-cutting/harbors-and-locations.md)

### Platform (`platform/`)

- [platform-administration.md](platform/platform-administration.md)
- [platform-support-and-impersonation.md](platform/platform-support-and-impersonation.md)
- [tenant-settings.md](platform/tenant-settings.md)
- [tenant-bootstrap-and-setup.md](platform/tenant-bootstrap-and-setup.md)
- [seeded-catalog-adoption.md](platform/seeded-catalog-adoption.md)
- [import-and-export-strategy.md](platform/import-and-export-strategy.md)

### Supporting Modules (`modules/`)

- [modules/README.md](modules/README.md)
- [reporting-and-exports.md](modules/reporting-and-exports.md)
- [weather-in-trip-context.md](modules/weather-in-trip-context.md)
- [route-planning-and-harbors.md](modules/route-planning-and-harbors.md)
- [incidents.md](modules/incidents.md)
- [media-gallery.md](modules/media-gallery.md)
- [trip-story.md](modules/trip-story.md)

### Operating Modes (`operating-modes/`)

- [operating-modes/README.md](operating-modes/README.md)
- [kiosk-mode.md](operating-modes/kiosk-mode.md)

### Root Files

- [product-glossary.md](product-glossary.md)
- [system-composition.md](system-composition.md)
- [plan.md](plan.md)

## Doc Standard

Each product doc should answer:

1. **What problem does this solve?** -- user guide
2. **Who uses it?** -- user guide
3. **What does it own?** -- aggregate root, entities, rules
4. **What does it NOT own?** -- explicit boundaries
5. **Requires** -- hard dependencies, won't work without
6. **Enhanced by** -- works alone but gets better with these
7. **Key concepts** -- user guide + architecture
8. **Business rules** -- architecture + implementation
9. **Cross-references** -- links to related docs

## Rule Of Thumb

Not everything is a module.

Use:

- backbone areas for shared product foundations
- core domains for major business areas
- supporting modules for optional enrichments
- operating modes for special ways of using the same workflows
