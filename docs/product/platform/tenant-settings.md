# Tenant Settings

## Purpose

This document defines how a club configures Sail Tracker for its own local operating model.

It is the tenant-owned control surface for:

- workflow strictness
- local defaults
- enabled modules
- local catalogs and rules

The goal is to let clubs adapt the product to how they actually work without turning each tenant into a different product.

## Why This Area Matters

Different clubs vary in:

- how formal trip logging is
- which modules they care about
- which qualifications they use
- how much structure they want around onboarding, approvals, and incidents
- how strict departure and readiness checks should be

If tenant settings are too weak, the product becomes rigid.
If tenant settings are too powerful, the product loses shared meaning.

This area defines the middle ground.

## Core Product Outcome

The product should make it easy to answer:

- what this club has enabled
- how strict this club’s workflows are
- which catalogs and local definitions this club uses
- which defaults apply when creating trips, members, vessels, and assets
- which parts of the product are fixed platform rules versus local tenant choices

## Scope

This area covers:

- tenant-owned workflow settings
- module enablement and requiredness
- tenant defaults
- adoption of seeded catalogs
- local catalog additions
- local operational policy settings
- local feed and sharing defaults later

This area does not own:

- platform-wide seeded definitions
- permission model semantics
- tenant bootstrap creation itself
- trip, qualification, or calendar core meanings

It configures how those areas behave locally within allowed product boundaries.

## Core Principle

Tenant settings may tune workflow and local usage.
They must not rewrite the meaning of the product’s core states and concepts.

Good tenant configuration:

- require incident capture on completion
- enable route planning
- choose which seeded certifications are relevant
- make observed weather optional or required
- decide who may manage local approvals through permission assignment

Bad tenant configuration:

- redefine what `active` means for trips
- replace platform permission semantics with tenant-specific hidden rules
- change the meaning of `booking`, `assignment`, or `approval`

## Main Setting Families

The cleanest structure is to group tenant settings by purpose.

### 1. Tenant Identity And Defaults

These settings define the club’s baseline local context.

Examples:

- display name
- default locale
- timezone later if needed
- subdomain and custom-domain preferences later
- default home harbor later

These should make the tenant feel locally configured without changing business semantics.

### 2. Trip Workflow Settings

These settings define how structured trip work is in this club.

Examples:

- which trip fields are shown
- which trip fields are required
- whether route planning is enabled
- whether media or trip story is enabled
- whether observed weather is optional or required
- whether incident review is optional or required
- whether some trip types later require stricter completion fields

This is one of the highest-value settings families because it controls everyday operational friction.

### 3. Departure And Readiness Strictness

These settings define how strongly the system should enforce readiness and departure gates.

Examples:

- whether certain readiness warnings block departure
- whether incident acknowledgement is required before closure later
- whether weather acknowledgement is required
- whether local approval exceptions are allowed

These settings should tune enforcement strength, not invent new state meanings.

### 4. Qualification And Approval Settings

These settings define how the tenant uses qualifications operationally.

Examples:

- which seeded certifications are enabled
- which local qualifications exist
- whether skills and badges are tracked
- whether qualification request flows are enabled later
- whether one-off exception flows are allowed

This is where tenant-local operational policy meets shared seeded reference data.

### 5. Catalog And Reference Data Settings

These settings define the local reference model used by the tenant.

Examples:

- local badge catalog
- local skill catalog
- local harbor favorites
- route reference preferences later
- local trip types later

These are tenant-owned additions or selections, not platform-level shared definitions.

### 6. Membership And Onboarding Settings

These settings define how people become usable in the tenant.

Examples:

- whether invitation-only is required
- whether self-serve join is allowed later
- which profile fields are required
- which default bundles are available for assignment
- whether some members require extra completion before operating later

### 7. Fleet, Asset, And Operational Settings

These settings define local expectations around vessels, assets, and operations.

Examples:

- required equipment expectations by vessel later
- whether some asset categories are in use
- whether some booking flows are enabled
- whether readiness categories are stricter for some vessels later

### 8. Feed, Export, And Visibility Settings

These settings define which shareable outputs the tenant wants to use.

Examples:

- which calendar feeds are enabled
- whether selected exports are allowed
- how broad some default visibility should be later
- whether some media or story outputs can be externally shared later

These should stay permission-aware and privacy-aware.

## Module Enablement Model

Tenant settings should be able to enable, disable, or require selected product modules without forking the product.

Useful examples:

- enable weather
- enable route planning
- require incident review on completion
- disable trip story
- allow media internally but not for external sharing later

The rule should be:

- modules can be enabled or made required
- backbone and core domain semantics remain stable

## Required Versus Optional

This distinction matters across many settings.

The product should let a tenant say:

- this module is off
- this module is on but optional
- this module is required in some workflow

Examples:

- weather shown but optional
- route planning optional for normal trips
- incident review required on trip completion
- trip story enabled but never required

## Relationship To Tenant Bootstrap

Bootstrap creates the starting point.
Tenant settings own the longer-lived local configuration after that.

Examples:

- bootstrap assigns baseline defaults
- tenant settings later refine those defaults
- bootstrap makes the tenant operable
- tenant settings make it reflect the club’s actual way of working

## Relationship To Seeded Catalog Adoption

Seeded catalog adoption defines how platform-shared definitions become locally usable.

Tenant settings own the tenant side of that choice.

Examples:

- enable seeded certification A
- ignore seeded certification B
- add a local badge catalog
- use seeded public certifications but local approvals for real sailing permissions

## Relationship To Permissions

Tenant settings should work with the permission model, not around it.

Examples:

- tenant settings may expose which bundles are assignable locally
- tenant settings may enable approval workflows
- tenant settings do not invent separate hidden permission semantics

Who may change tenant settings should itself be controlled by tenant-scoped permissions.

## Relationship To Platform Administration

Platform administration owns:

- tenant lifecycle
- platform-level seeded definitions
- domain and support boundaries

Tenant settings own:

- local club configuration
- local enablement and strictness
- local defaults and local additions

This distinction is important for keeping multi-tenant ownership clear.

## Relationship To Draft Admin Concepts

The older admin model mixed many things into one hub:

- certification types
- skills
- harbor locations
- equipment
- boat qualifications

In the product structure now, those belong to different families:

- seeded/shared catalogs
- tenant-local catalogs
- qualification model
- route and harbor references
- equipment and assets

Tenant settings is the right place to configure which of those are in use locally, but not to collapse them back into one generic admin bucket.

## Business Rules

- Tenant settings may tune local workflow behavior, but must not redefine core product meaning.
- Backbone states and core domain semantics must remain stable across tenants.
- Tenant settings should control whether features are off, optional, or required where the product allows that distinction.
- Tenant settings should own tenant-local catalog usage and local additions, but not platform-seeded shared definitions.
- Tenant settings should remain permission-aware and tenant-scoped.
- Tenant bootstrap should establish baseline defaults; tenant settings should own the longer-lived local configuration after that.
