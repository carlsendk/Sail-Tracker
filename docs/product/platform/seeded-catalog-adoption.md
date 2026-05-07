# Seeded Catalog Adoption

## Purpose

This document defines how platform-seeded catalogs become available and usable inside a tenant.

It exists because Sail Tracker needs shared reference data, especially for Denmark-oriented public certifications, without confusing shared platform data with tenant-owned operational rules.

## Why This Area Matters

The product already assumes that some catalogs should be seeded by the platform.

Examples include:

- Denmark-oriented public certification definitions
- shared baseline badge definitions later
- shared skill definitions later where useful

But the product still needs a clear answer to:

- what the platform owns
- what the tenant adopts
- what the tenant may change
- what remains tenant-local only

Without that distinction, clubs will either:

- be forced into a rigid shared model they cannot adapt
- or end up copying everything and losing the value of seeded reference data

## Core Product Outcome

The product should make it easy to answer:

- what seeded catalogs are available from the platform
- which of those a tenant has adopted
- whether the tenant is using the shared definition directly or adding tenant-local usage around it
- what parts of the seeded catalog are immutable shared reference data
- what parts of tenant configuration remain fully local

## Scope

This area covers:

- platform-seeded reference catalogs
- tenant adoption of seeded catalog entries
- enable, disable, or select behavior at tenant level
- seeded-versus-local ownership boundaries
- future catalog updates and deprecations at a product level

This area does not own:

- person-held qualification records
- tenant-local approvals
- permission bundles
- trip validation rules

It provides the reference-data adoption model those areas depend on.

## Core Principle

Seeded catalogs should provide shared reference data.
Tenant adoption should decide whether and how that reference data is used locally.

That means:

- the platform owns the shared definition
- the tenant owns whether it is in use
- the tenant may build local rules on top of it
- the tenant should not have to fork the shared definition just to use it

## Recommended Adoption Model

The cleanest model is:

1. platform publishes seeded catalog definitions
2. tenant chooses which seeded definitions are active locally
3. tenant may add local labels, usage, and local rules around them
4. tenant may also create fully local catalog entries when needed

This is better than copying everything into each tenant by default.

It preserves:

- shared meaning
- easier updates
- clearer reporting
- less duplication

## Shared Definition Versus Tenant Usage

This distinction should remain explicit.

### Shared Definition

Owned by the platform.

Examples:

- public certification name
- canonical meaning
- issuing body later
- default description
- baseline locale text later

### Tenant Usage

Owned by the tenant.

Examples:

- enabled or disabled in this club
- relevant or irrelevant for this club
- shown in local workflows
- used in local approval logic
- included in member registration screens

The shared definition answers what the thing is.
The tenant usage answers whether and how the club cares about it.

## First Intended Use: Denmark-Oriented Certification Catalog

The first strong use case is a seeded Denmark-oriented public certification catalog.

This should let a club adopt common public certifications without manually creating them from scratch.

That does not mean:

- every club must use every seeded certification
- seeded certifications automatically grant club approval
- the platform decides the tenant’s operational safety policy

Instead, it means the platform can give tenants a strong baseline reference model.

## What Tenants Should Be Able To Do

Tenants should be able to:

- browse seeded catalog entries
- enable or disable them locally
- decide which ones matter for their club
- reference them in qualification and approval logic
- add fully local entries if the seeded catalog is incomplete

Tenants should not need to edit the shared definition itself just to mark it as:

- relevant here
- not used here
- used in this local workflow

## What Tenants Should Not Be Able To Break

Tenants should not redefine the platform meaning of a seeded public certification in a way that destroys shared semantics.

For example, a tenant should not turn a seeded public certification into:

- a completely different concept
- a tenant-only badge
- a silently renamed local approval with different meaning

If the club needs a different local concept, it should create a local entry or use a local approval rule instead.

## Tenant-Local Additions

Seeded catalogs are not enough for every club.

The product should also support local entries such as:

- club-specific badges
- club-specific skills
- local recognition programs
- tenant-specific qualification definitions where public seeded data is insufficient

This means the product needs both:

- seeded shared definitions
- tenant-local catalog entries

Those should coexist cleanly.

## Relationship To Qualification Model

Qualifications consume this adoption model.

Examples:

- a seeded public certification may be enabled in a tenant
- a tenant may record that a member holds that certification
- a tenant may choose to use that certification as part of a local approval rule

The qualification model should not have to answer how shared definitions become locally active.
That is this document’s job.

## Relationship To Tenant Settings

Tenant settings should own the local configuration side of adoption.

That includes:

- which seeded entries are enabled
- which are shown in local workflows
- which local additions exist

Tenant settings should not become the owner of the shared seeded catalog definitions themselves.

## Relationship To Platform Administration

Platform administration should own:

- creating seeded catalogs
- maintaining seeded definitions
- deprecating seeded entries later
- publishing catalog updates later

Platform administration should not silently force tenant-local usage decisions unless the product explicitly says so.

## Update And Deprecation Model

Seeded catalogs will evolve over time.

The product should support the idea that a seeded entry may later be:

- updated
- replaced
- deprecated

When that happens, tenants should be able to understand:

- what changed in the shared definition
- whether their tenant is still using it
- whether local review is needed

Deprecation should not destroy historical member-held records or past trip logic.

## Reporting And Search Relationship

A shared seeded catalog model improves:

- cross-tenant consistency later
- cleaner reporting
- better search and filtering
- less duplicate naming drift

But reports should still reflect tenant-local usage choices, not just platform availability.

## Business Rules

- Seeded catalogs provide shared reference data; they do not directly create tenant-local operational approvals.
- Tenants should be able to adopt seeded entries without copying and forking the shared definition by default.
- Tenants should be able to add local catalog entries where shared seeded data is not enough.
- Shared seeded definitions and tenant-local usage must remain distinct.
- Platform administration owns seeded definitions; tenants own whether and how they are used locally.
- Deprecation of a seeded definition should not erase historical records or silently rewrite past meaning.
