# Platform Administration

## Purpose

This document defines the platform-level administrative area of Sail Tracker across all tenants.

It is the top-level control surface for platform operators and exists to keep platform ownership clearly separate from tenant ownership.

## Why This Area Matters

The platform already assumes:

- multiple tenants
- platform admins
- seeded shared reference data
- demo tenants
- platform-level support access

Without a clear platform administration model, the product risks blurring:

- platform duties
- tenant duties
- support actions
- seeded shared data management

That would make the multi-tenant boundaries weaker and the product harder to trust.

## Core Product Outcome

The product should make it easy to answer:

- who may operate the platform itself
- how tenants are created, managed, and retired
- how domains and subdomains are controlled
- how shared seeded data is maintained
- how demo tenants differ from real tenants
- what belongs to platform support versus normal tenant administration

## Scope

This area covers:

- platform admin management
- tenant creation and lifecycle
- demo tenant management
- domain and subdomain governance
- shared seeded catalog governance
- platform-level support governance
- platform-level audit expectations later

This area does not own:

- tenant-local workflow configuration
- tenant-local permissions
- ordinary club administration
- trip operations
- qualification or approval semantics inside a tenant

Those remain in tenant settings and the core product domains.

## Core Principle

Platform administration should govern the platform.
It should not become a disguised route for normal tenant administration.

That means:

- platform-level actions must stay explicit
- tenant-local control should remain with tenant owners where possible
- support must not replace ownership
- shared platform definitions should not silently override tenant-local meaning

## Main Platform Responsibilities

The cleanest platform administration model groups responsibilities into a few major areas.

### 1. Tenant Lifecycle

Platform administration owns the lifecycle of a tenant as a platform entity.

Examples:

- create tenant
- activate tenant
- suspend tenant later
- archive tenant later
- manage demo tenant lifecycle

This is different from tenant settings, which only govern local club behavior after the tenant exists.

### 2. Tenant Bootstrap Governance

Platform administration owns the platform side of bootstrap.

Examples:

- who may create the tenant
- who becomes the first owner
- what baseline defaults are attached
- what counts as a real tenant versus a demo tenant

The actual first-owner club setup remains a tenant-side concern after bootstrap.

### 3. Domain And Routing Governance

Platform administration should own the platform-controlled domain model.

Examples:

- subdomain allocation
- custom domain approval and mapping later
- reserved names
- collision and uniqueness control

This should remain platform-owned because it crosses tenant boundaries.

### 4. Platform Admin Governance

The platform needs an explicit model for who may act as a platform admin.

This includes:

- adding platform admins
- revoking platform admin access
- defining platform-level permission bundles later
- separating platform admin from tenant owner

Not every trusted tenant owner should automatically be a platform admin.

### 5. Shared Seeded Catalog Governance

Platform administration should manage shared seeded reference data.

Examples:

- Denmark-oriented public certification catalog
- shared badge baselines later
- shared skill baselines later

This includes:

- publish
- update
- deprecate
- communicate change later

Tenant settings still decide whether a tenant uses those seeded definitions.

### 6. Platform Support Governance

Platform administration should define:

- who may perform support access
- what support mode they may use
- what support actions are auditable

The detailed behavior of support access belongs in the dedicated support doc, but the governance belongs here.

## Platform Admin Versus Tenant Owner

This distinction should remain sharp.

### Platform Admin

Acts at platform scope.

Examples:

- create tenant
- manage seeded definitions
- manage support permissions
- manage domain routing

### Tenant Owner

Acts inside one tenant.

Examples:

- manage club members
- manage local settings
- manage local approvals
- manage trips, vessels, and assets according to tenant permissions

The same person may hold both roles, but the product should not collapse them into one concept.

## Real Tenant Versus Demo Tenant

Platform administration should distinguish real and demo tenants clearly.

### Real Tenant

Intended for real club operation.

Characteristics:

- minimal bootstrap
- no noisy sample content by default
- normal tenant ownership and lifecycle

### Demo Tenant

Intended for evaluation, walkthroughs, testing, and presentation.

Characteristics:

- richer seeded content
- may be reset later
- may be managed more directly by the platform

The product should not treat demo tenants as just another normal club with hidden sample data.

## Relationship To Tenant Bootstrap

Tenant bootstrap defines how a new tenant becomes operationally usable.

Platform administration owns the platform authority and governance that starts that process.

Examples:

- create tenant
- choose first owner
- choose real versus demo
- attach baseline defaults

See also [`tenant-bootstrap-and-setup.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tenant-bootstrap-and-setup.md).

## Relationship To Tenant Settings

Tenant settings define local club configuration after a tenant exists.

Platform administration should not become the normal place where tenant-local settings are edited.

That distinction protects:

- tenant ownership
- multi-tenant clarity
- support auditability

See also [`tenant-settings.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tenant-settings.md).

## Relationship To Seeded Catalog Adoption

Platform administration owns the shared seeded definitions.
Tenant settings own local adoption.

That means platform administration should:

- publish and maintain shared reference data
- not directly decide local operational meaning inside each club

See also [`seeded-catalog-adoption.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/seeded-catalog-adoption.md).

## Relationship To Support And Impersonation

Platform administration governs who may perform support access and under what broad conditions.

The detailed support model, including impersonation and audit, belongs in the dedicated support document.

See also [`platform-support-and-impersonation.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/platform-support-and-impersonation.md).

## Audit Expectations

Platform administration is one of the highest-audit product areas.

Important platform actions should be reviewable later.

Examples:

- tenant created
- tenant suspended later
- platform admin granted or revoked
- seeded catalog updated
- support access performed
- domain mapping changed later

The platform does not need to expose every low-level system detail to every audience, but it should support internal accountability clearly.

## Business Rules

- Platform administration owns platform-wide control, not ordinary club operations.
- Platform admin and tenant owner must remain distinct concepts.
- Tenant lifecycle, domain governance, and seeded shared definitions are platform concerns.
- Tenant-local workflow and operational settings are not platform-admin defaults in disguise.
- Demo tenant behavior should remain explicitly different from real tenant behavior where seeded depth and lifecycle rules differ.
- Platform support governance belongs to platform administration, but support execution must remain separately auditable and bounded.
