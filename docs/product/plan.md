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
- [ ] `seeded-catalog-adoption.md`
- [ ] `platform-support-and-impersonation.md`
- [ ] import and export strategy detail

## Current Focus

Next recommended task:

- `seeded-catalog-adoption.md`

Why it comes next:

- it is the next platform-level cross-cutting decision that affects qualifications, tenant setup, and seeded public reference data
- it will force a clear adoption model for shared Denmark-oriented certification catalogs and other seeded platform data
- it helps connect platform administration to tenant settings without blurring ownership

## Current State

The current catalog already has a strong base:

- backbone:
  - [`calendar-and-scheduling.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/calendar-and-scheduling.md)
  - [`identity-access-and-configuration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/identity-access-and-configuration.md)
- calendar detail:
  - [`tasks-and-inspections.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tasks-and-inspections.md)
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

The biggest remaining gaps are not top-level structure.
They are detail depth and a few missing cross-cutting areas.

### Backbone Detail Gaps

- calendar feed scopes and privacy rules
- reminder and notification behavior
- subscription model for calendar, tasks, and reminders
- search, filters, and dashboard entry points

### Core Domain Detail Gaps

- trip validation rules against vessel and qualification constraints
- trip manifest and guest model depth
- fleet detail for vessel classes, restrictions, and readiness expectations
- asset lending and booking flows
- qualification local approvals and one-off exceptions
- membership onboarding and invitation flows

### Platform And Admin Gaps

- tenant bootstrap and setup flow from empty club to active use
- permission bundles and admin capabilities at tenant level
- seeded catalogs and how tenants adopt them
- support/admin visibility model across tenants

### Supporting Module Gaps

- each module still needs to move from placeholder depth to evaluated product depth
- reporting needs output types and privacy rules
- route planning needs trip integration rules
- incidents need follow-up and reporting relationship
- weather needs planning versus observed context

### Cross-Cutting Gaps

- notification model
- glossary and canonical product language
- audit and compliance expectations in product terms
- mobile versus kiosk versus desktop usage emphasis
- import and export strategy

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

- `tenant-bootstrap-and-setup.md`

Why it comes next:

- it brings tenant creation, owner setup, demo data, and first usable configuration into one flow
- it connects platform administration, invitations, and tenant settings
- it is the natural next step after onboarding paths are defined
