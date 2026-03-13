# System Composition

## Purpose

This document describes how Sail Tracker should be shaped as a set of product areas that fit together into one coherent app.

The goal is:

- one product
- one tenant context
- one permission model
- one calendar backbone
- several focused domains and supporting modules

This should avoid both extremes:

- one monolithic feature blob
- a set of disconnected mini-apps

## Product Backbone

The main structural spine is:

1. `Calendar And Scheduling`
2. `Identity, Access, And Configuration`
3. core domains that plug into the backbone

In practice:

- calendar provides shared operational time, state, and visibility
- identity and permissions decide who can do what
- core domains contribute their own rules, detail screens, and data
- supporting modules enrich those domains where needed

## Product Shape

Not everything in the product should be called a module.

Use these categories instead:

- `backbone areas`
- `core domains`
- `supporting modules`
- `operating modes`
- `platform/admin areas`

## Design Principle

Each area or module should have:

- one clear purpose
- one primary domain language
- one owned set of business rules
- one obvious integration point with the rest of the system

Each area or module should not own:

- another module's internal rules
- global navigation policy
- cross-tenant behavior
- duplicated permission logic

## Current Product Structure

Backbone areas:

- [`calendar-and-scheduling.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/calendar-and-scheduling.md)
- [`identity-access-and-configuration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/identity-access-and-configuration.md)

Calendar detail docs:

- [`tasks-and-inspections.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tasks-and-inspections.md)

Core domains:

- [`fleet-management.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/fleet-management.md)
- [`trip-logging-and-logbook.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-logging-and-logbook.md)
- [`memberships-and-identity.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/memberships-and-identity.md)
- [`qualification-model.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/qualification-model.md)
- [`equipment-and-assets.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/equipment-and-assets.md)

Core domain detail docs:

- [`asset-categories-and-assignment.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/asset-categories-and-assignment.md)

Supporting modules:

- [`modules/reporting-and-exports.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/reporting-and-exports.md)
- [`modules/weather-in-trip-context.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/weather-in-trip-context.md)
- [`modules/route-planning-and-harbors.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/route-planning-and-harbors.md)
- [`modules/incidents.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/incidents.md)
- [`modules/media-gallery.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/media-gallery.md)
- [`modules/trip-story.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/trip-story.md)

Operating modes:

- [`operating-modes/kiosk-mode.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/operating-modes/kiosk-mode.md)

Platform and admin areas:

- [`tenant-settings.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tenant-settings.md)
- [`platform-administration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/platform-administration.md)
- [`identity-access-and-configuration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/identity-access-and-configuration.md)

## How The Pieces Fit Together

### Calendar Backbone

The calendar is the shared operational schedule.

Core domains and supporting modules connect to it by:

- creating scheduled items
- updating schedule state
- contributing time-bound operational categories
- exposing time-based conflicts
- appearing in filters and subscriptions

### Identity Backbone

Identity and permissions are shared across the product.

Core domains and supporting modules should consume:

- tenant context
- memberships
- qualifications
- permission checks

They should not each invent their own access model.

### Trip As An Operational Hub

Trips are not the whole product, but they are one of the richest operational domains.

Trips connect to:

- calendar for schedule and status visibility
- fleet for vessel assignment and availability
- equipment and assets for gear and asset context where relevant
- identity for responsible sailor and manifest participants
- safety for readiness and return rules
- weather, route, incidents, media, and story as optional modules
- kiosk mode as a specialized operating mode

Trips should not become the owner of all time-based operational history.
The calendar should own the timeline.
Trips should own the richer trip-specific detail attached to that timeline.

## Supporting Module Rules

To keep supporting modules small and composable:

- one supporting module should answer one main product question
- optional enrichments should stay optional
- shared concepts should live in one place only
- modules should integrate through clear domain facts, not UI hacks

Examples:

- weather should provide trip context, not own trip state
- route planning should describe intended movement, not own departure logic
- incidents should record safety events, not redefine trip completion
- media should attach evidence and memory, not drive scheduling
- reporting should summarize domain data, not become a new source of truth

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

## Recommended Boundaries In The App

At application level, prefer:

- one route area per product area
- one use case per user action
- one clear owner for each rule
- composed read views when one screen needs facts from multiple domains

At domain level, prefer:

- `Calendar / Scheduling` owns schedule placement, time-based state visibility, and operational history in time
- `Calendar / Scheduling` owns schedule-driven availability and conflicts
- `Calendar / Scheduling` owns categories such as trips, maintenance, inspections, readiness tasks, and seasonal work as time-based operational items
- `Fleet Management` owns vessel identity, vessel status, and vessel-facing constraints
- `Trip Logging` owns trip-specific metadata, validations, and detailed record content
- `Identity / Membership` owns who the actors are
- `Qualifications` owns who is allowed to do what with vessels
- `Equipment And Assets` owns club-shared gear, vessel-assigned components, and non-vessel bookable resources

A vessel page, trip page, or dashboard may therefore be a composed read model across several areas without changing ownership of the underlying facts.

## Integration Heuristics

When deciding whether something should be its own supporting module, ask:

1. Does it have its own business language?
2. Can it be turned on or off without breaking the backbone?
3. Does it enrich another workflow instead of replacing it?
4. Can it be explained without talking about screens first?

If the answer is no, it may just be part of an existing area, not a new module.

## Product Review Standard

A good product area or supporting module in this system should be:

- understandable on its own
- clearly connected to the backbone
- tenant-safe
- permission-safe
- optional where appropriate
- hard to misunderstand in implementation
