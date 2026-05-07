# System Composition

## Purpose

This document describes how Sail Tracker is shaped as a set of product areas that fit together into one coherent app.

The goal is:

- one product
- one tenant context
- one permission model
- one calendar backbone
- several focused domains and supporting modules

Each product doc owns one bounded context with clear aggregate roots and explicit boundaries.

## Product Shape

Use these categories:

- `backbone areas` -- shared product foundations
- `core domains` -- major business areas with their own aggregate roots
- `supporting modules` -- optional enrichments
- `cross-cutting areas` -- surfaces that read from multiple domains
- `operating modes` -- specialized ways of using the same workflows
- `platform areas` -- tenant lifecycle and platform administration

## Design Principle

Each area should have:

- one clear purpose
- one primary domain language
- one owned set of business rules
- one obvious integration point with the rest of the system

Each area should not own:

- another domain's internal rules
- global navigation policy
- cross-tenant behavior
- duplicated permission logic

## Current Product Structure

### Backbone Areas

- [calendar-and-scheduling.md](backbone/calendar-and-scheduling.md) -- shared operational timeline, scheduling, conflicts, feeds
- [tasks-and-inspections.md](backbone/tasks-and-inspections.md) -- calendar-backed operational work
- [notifications-and-reminders.md](backbone/notifications-and-reminders.md) -- delivery of operational signals
- [search-and-operational-views.md](backbone/search-and-operational-views.md) -- search, logbook browsing, composed read views

### Core Domains

**Trips**

- [trip-planning-and-lifecycle.md](domains/trips/trip-planning-and-lifecycle.md) -- trip identity, lifecycle states, vessel/sailor assignment
- [trip-departure-and-validation.md](domains/trips/trip-departure-and-validation.md) -- pre-departure validation layers
- [trip-manifest-and-guests.md](domains/trips/trip-manifest-and-guests.md) -- crew and guest handling
- [trip-completion-and-reporting.md](domains/trips/trip-completion-and-reporting.md) -- report-back, safety checklists, post-trip data
- [trip-series-and-recurring.md](domains/trips/trip-series-and-recurring.md) -- recurring trip patterns and instance generation

**Fleet**

- [vessel-registry.md](domains/fleet/vessel-registry.md) -- vessel identity, status, ownership
- [vessel-classes-and-restrictions.md](domains/fleet/vessel-classes-and-restrictions.md) -- class grouping and operational restrictions
- [vessel-readiness.md](domains/fleet/vessel-readiness.md) -- readiness expectations, required equipment checks

**Members**

- [membership-and-onboarding.md](domains/members/membership-and-onboarding.md) -- person identity, tenant membership, entry paths, guest model
- [permissions-and-roles.md](domains/members/permissions-and-roles.md) -- authorization model, permission bundles

**Qualifications** (own bounded context, spans members + fleet, consumed by trips)

- [certifications-and-catalog.md](domains/qualifications/certifications-and-catalog.md) -- external certs, seeded catalog, person-held records
- [local-approvals.md](domains/qualifications/local-approvals.md) -- club-specific operational permissions, approval dimensions, exceptions
- [skills-and-recognition.md](domains/qualifications/skills-and-recognition.md) -- tracked skills + badges, recognition only

**Equipment**

- [equipment-registry.md](domains/equipment/equipment-registry.md) -- asset identity, categories, lifecycle, QR labels
- [equipment-assignment.md](domains/equipment/equipment-assignment.md) -- assignment modes (vessel/location/pool/trip)
- [equipment-lending-and-booking.md](domains/equipment/equipment-lending-and-booking.md) -- lending, booking, temporary trip use

### Cross-Cutting Areas

- [dashboard-and-home.md](cross-cutting/dashboard-and-home.md) -- operational landing page, composed from all domains
- [pwa-and-offline.md](cross-cutting/pwa-and-offline.md) -- installable app, offline support, real-time subscriptions
- [profile-and-account.md](cross-cutting/profile-and-account.md) -- self-service profile, emergency contacts, my trips
- [harbors-and-locations.md](cross-cutting/harbors-and-locations.md) -- harbor reference data, location picker

### Platform Areas

- [platform-administration.md](platform/platform-administration.md) -- tenant lifecycle, platform admins
- [platform-support-and-impersonation.md](platform/platform-support-and-impersonation.md) -- support access, impersonation
- [tenant-settings.md](platform/tenant-settings.md) -- club-level configuration
- [tenant-bootstrap-and-setup.md](platform/tenant-bootstrap-and-setup.md) -- new tenant creation
- [seeded-catalog-adoption.md](platform/seeded-catalog-adoption.md) -- platform-provided reference data
- [import-and-export-strategy.md](platform/import-and-export-strategy.md) -- data portability

### Supporting Modules

- [reporting-and-exports.md](modules/reporting-and-exports.md) -- operational summaries and data export
- [weather-in-trip-context.md](modules/weather-in-trip-context.md) -- forecast and conditions for trips
- [route-planning-and-harbors.md](modules/route-planning-and-harbors.md) -- waypoints and navigation context
- [incidents.md](modules/incidents.md) -- structured safety event capture
- [media-gallery.md](modules/media-gallery.md) -- photos and videos
- [trip-story.md](modules/trip-story.md) -- trip narrative and sharing

### Operating Modes

- [kiosk-mode.md](operating-modes/kiosk-mode.md) -- shared-device operating surface

## How The Pieces Fit Together

### Calendar Backbone

The calendar is the shared operational schedule. Core domains and modules connect to it by:

- creating scheduled items
- blocking time on a resource
- contributing time-based state
- appearing in filters and subscriptions
- reacting to rescheduling

### Identity And Permissions

Identity and permissions are shared across the product. Core domains consume:

- tenant context
- memberships
- qualifications
- permission checks

They should not each invent their own access model.

### Trip As An Operational Hub

Trips connect to:

- calendar for schedule and status visibility
- fleet for vessel assignment and availability
- equipment for gear context
- identity for responsible sailor and manifest participants
- qualifications for eligibility validation
- weather, route, incidents, media, and story as optional modules
- kiosk mode as a specialized operating mode

Trips should not become the owner of all time-based operational history. The calendar should own the timeline. Trips should own the richer trip-specific detail.

### Qualifications As A Spanning Domain

Qualifications span members and fleet. They are consumed by trips at departure validation time. They are their own bounded context because:

- they have their own aggregate roots (certification catalog, local approval, skill/badge catalog)
- they serve multiple consumers (trip departure, profile views, fleet eligibility)
- they have their own lifecycle (grant, review, renew, revoke, expire)

## Product Rules

- Platform configuration must stay separate from tenant configuration.
- Tenant-scoped data must not leak across clubs.
- Profile editing must stay separate from admin management.
- Permissions must control access to each area explicitly.
- Club-specific trip configuration should live in tenant administration, not in platform-wide settings.
- Kiosk mode should reuse the same permissions and trip rules, not invent a separate domain model.

## Supporting Module Rules

To keep supporting modules small and composable:

- one supporting module should answer one main product question
- optional enrichments should stay optional
- shared concepts should live in one place only
- modules should integrate through clear domain facts, not UI hacks

## Configuration Model

Tenant configuration should turn modules on and off or make them required, but should not fork the product into unrelated variants.

Good configuration:

- require incident reporting on completion
- enable route planning for offshore clubs
- hide media for clubs that do not need it
- require extra departure checks for some vessels

Bad configuration:

- change the meaning of trip states per tenant
- invent separate permission semantics per tenant
- allow the same core event to be modeled differently in every club

## Integration Heuristics

When deciding whether something should be its own supporting module, ask:

1. Does it have its own business language?
2. Can it be turned on or off without breaking the backbone?
3. Does it enrich another workflow instead of replacing it?
4. Can it be explained without talking about screens first?

If the answer is no, it may just be part of an existing area, not a new module.
