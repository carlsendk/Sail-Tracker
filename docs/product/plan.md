# Product Catalog Plan

## Purpose

This plan describes what still needs to be written to turn the current product docs into a full, usable product catalog for Sail Tracker.

The goal is not just to have many files.
The goal is to have a product catalog that:

- explains the whole product shape clearly
- gives each major area a stable boundary
- makes dependencies between areas obvious
- is concrete enough to evaluate before implementation
- can later be used to shape BDD slices and delivery plans

## Definition Of Done

The product catalog is complete enough when:

- every backbone area has a stable overview and key detail docs
- every core domain has an overview and its important sub-areas defined
- every supporting module has a clear purpose and clear boundaries
- every operating mode is defined where it changes workflow behavior
- every platform or admin area has enough detail to support tenant setup
- cross-cutting topics have a clear home instead of being repeated everywhere
- each doc can answer "what does this area own" and "what does it not own"

## Working Task List

Use this section as the operating checklist.
Work from top to bottom unless a stronger dependency appears.

### Now

- [x] `notifications-and-reminders.md`
- [x] `trip-validation-and-departure-rules.md`
- [x] `trip-manifest-and-guests.md`
- [x] `asset-lending-and-booking.md`
- [x] `local-approvals-and-exceptions.md`

### Next

- [x] `permissions-and-role-bundles.md`
- [x] `vessel-classes-and-restrictions.md`
- [x] `vessel-readiness-and-required-equipment.md`
- [x] `invitations-and-onboarding.md`
- [x] `tenant-bootstrap-and-setup.md`

### Later

- [x] deepen `modules/reporting-and-exports.md`
- [x] deepen `modules/weather-in-trip-context.md`
- [x] deepen `modules/route-planning-and-harbors.md`
- [x] deepen `modules/incidents.md`
- [x] deepen `modules/media-gallery.md`
- [x] deepen `modules/trip-story.md`
- [x] `search-and-operational-views.md`
- [x] `product-glossary.md`
- [x] `seeded-catalog-adoption.md`
- [x] `platform-support-and-impersonation.md`
- [x] `import-and-export-strategy.md`

### Review Follow-Up

- [x] `dashboard-and-home.md`
- [x] `pwa-and-offline.md`
- [ ] architecture context map

## Current Focus

Next recommended task:

- close the remaining product-structure gaps identified in the coherence review

Why it comes next:

- the main placeholder admin areas are now covered
- the coherence review identified two missing product areas from the draft material
- closing those gaps now keeps the catalog aligned before implementation planning deepens

## Current State

The current catalog already has a strong base:

- backbone:
  - [`calendar-and-scheduling.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/calendar-and-scheduling.md)
  - [`identity-access-and-configuration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/identity-access-and-configuration.md)
- calendar detail:
  - [`tasks-and-inspections.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tasks-and-inspections.md)
  - [`notifications-and-reminders.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/notifications-and-reminders.md)
  - [`search-and-operational-views.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/search-and-operational-views.md)
  - [`product-glossary.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/product-glossary.md)
- cross-cutting:
  - [`dashboard-and-home.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/dashboard-and-home.md)
  - [`pwa-and-offline.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/pwa-and-offline.md)
- core domains:
  - [`trip-logging-and-logbook.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-logging-and-logbook.md)
  - [`fleet-management.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/fleet-management.md)
  - [`equipment-and-assets.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/equipment-and-assets.md)
  - [`asset-categories-and-assignment.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/asset-categories-and-assignment.md)
  - [`memberships-and-identity.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/memberships-and-identity.md)
  - [`qualification-model.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/qualification-model.md)
- platform and admin:
  - [`tenant-settings.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tenant-settings.md)
  - [`platform-administration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/platform-administration.md)
- supporting modules:
  - [`modules/reporting-and-exports.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/reporting-and-exports.md)
  - [`modules/weather-in-trip-context.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/weather-in-trip-context.md)
  - [`modules/route-planning-and-harbors.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/route-planning-and-harbors.md)
  - [`modules/incidents.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/incidents.md)
  - [`modules/media-gallery.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/media-gallery.md)
  - [`modules/trip-story.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/trip-story.md)
- operating modes:
  - [`operating-modes/kiosk-mode.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/operating-modes/kiosk-mode.md)
- system guide:
  - [`system-composition.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/system-composition.md)

## What Is Still Missing

The remaining gaps are now mostly implementation-facing rather than catalog-shape gaps.

### Backbone Detail Gaps

- calendar feed scopes and privacy rules
- subscription model for calendar, tasks, and reminders
- task and inspection assignment depth if the product needs it later

### Core Domain Detail Gaps

- trip completion and report-back detail as a standalone product area if needed
- richer asset component and maintenance history depth if needed
- qualification catalog detail for the first Denmark seed set
- readiness evidence and checklist depth if clubs need stricter enforcement

### Platform And Admin Gaps

- tenant-level setup defaults by club type if that becomes important
- public catalog governance and localization operations
- support policy detail for sensitive data access

### Supporting Module Gaps

- module-level depth is now mostly present
- remaining work is selective deepening where implementation pressure appears

### Cross-Cutting Gaps

- audit and compliance expectations in product terms
- device trust and shared-device policy depth
- explicit landing-page composition by tenant type if clubs diverge strongly

### Architecture Gaps

- bounded-context map for implementation planning
- allowed write ownership between calendar, trips, fleet, assets, and qualifications
- explicit integration contracts for reporting and operational views

## Catalog Workstreams

### 1. Backbone Completion

Goal:
Make the calendar and identity backbone concrete enough that every other area can plug into them without ambiguity.

Docs to deepen or add:

- deepen [`calendar-and-scheduling.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/calendar-and-scheduling.md)
- deepen [`tasks-and-inspections.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tasks-and-inspections.md)
- add `notifications-and-reminders.md`
- add `search-and-operational-views.md`
- add `product-glossary.md`
- add `dashboard-and-home.md`
- add `pwa-and-offline.md`

### 2. Trip Domain Completion

Goal:
Make the trip area concrete enough to support the first real slices.

Docs to deepen or add:

- deepen [`trip-logging-and-logbook.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-logging-and-logbook.md)
- add `trip-validation-and-departure-rules.md`
- add `trip-manifest-and-guests.md`
- add `trip-completion-and-report-back.md`

### 3. Fleet And Asset Completion

Goal:
Define how vessels, components, gear, and bookable resources fit together operationally.

Docs to deepen or add:

- deepen [`fleet-management.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/fleet-management.md)
- deepen [`equipment-and-assets.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/equipment-and-assets.md)
- deepen [`asset-categories-and-assignment.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/asset-categories-and-assignment.md)
- add `asset-lending-and-booking.md`
- add `vessel-classes-and-restrictions.md`
- add `vessel-readiness-and-required-equipment.md`

### 4. Identity And Qualification Completion

Goal:
Make the people, permissions, and eligibility model precise enough for safe operations.

Docs to deepen or add:

- deepen [`memberships-and-identity.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/memberships-and-identity.md)
- deepen [`qualification-model.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/qualification-model.md)
- add `invitations-and-onboarding.md`
- add `local-approvals-and-exceptions.md`
- add `permissions-and-role-bundles.md`

### 5. Platform And Tenant Management Completion

Goal:
Define how a club is created, configured, administered, and supported over time.

Docs to deepen or add:

- deepen [`tenant-settings.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tenant-settings.md)
- deepen [`platform-administration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/platform-administration.md)
- add `tenant-bootstrap-and-setup.md`
- add `seeded-catalog-adoption.md`
- add `platform-support-and-impersonation.md`

### 6. Supporting Module Completion

Goal:
Turn the existing supporting modules into evaluated product areas instead of placeholders.

Docs to deepen:

- [`modules/reporting-and-exports.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/reporting-and-exports.md)
- [`modules/weather-in-trip-context.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/weather-in-trip-context.md)
- [`modules/route-planning-and-harbors.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/route-planning-and-harbors.md)
- [`modules/incidents.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/incidents.md)
- [`modules/media-gallery.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/media-gallery.md)
- [`modules/trip-story.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/trip-story.md)

Likely future modules to consider:

- notifications and reminders, unless kept as backbone detail
- imports and data migration
- public or member-facing views later

## Preferred Order

The checklist above is the preferred order.

Reasoning for the first five:

1. `notifications-and-reminders.md`
   Keeps calendar ownership and reminder subscriptions aligned.
2. `trip-validation-and-departure-rules.md`
   Defines the first hard operational gate in the product.
3. `trip-manifest-and-guests.md`
   Clarifies the people model used on every real trip.
4. `asset-lending-and-booking.md`
   Completes the asset model so shared resources stay consistent with calendar ownership.
5. `local-approvals-and-exceptions.md`
   Clarifies how clubs handle one-off approvals without turning the app into a workflow engine.

## Standard For Each Product Doc

Each product doc should be good enough to answer:

- what user problem this area solves
- who uses it
- what it owns
- what it depends on
- what it does not own
- what the important concepts are
- what the key workflows are
- what the business rules are
- how it connects to other areas

If a doc cannot answer those questions, it is still a placeholder.

## How To Use This Plan

- use this file to decide what product area to deepen next
- keep `system-composition.md` as the structural source of truth
- keep `README.md` as the navigation entry point
- use `docs/draft/` as raw input, not as the product catalog itself
- when a new product doc is added, update this plan if it closes or creates a major gap

## Current Focus

Current task:

- architecture context mapping

Why it comes next:

- the catalog is now strong enough at product level
- the next risk is implementation drift between calendar, trips, fleet, assets, qualifications, reporting, and views
- a bounded-context map is the next artifact needed to keep modules independently operable
