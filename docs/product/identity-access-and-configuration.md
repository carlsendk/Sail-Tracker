# Identity, Access, And Configuration

This document is the overview for the identity, access, and administration part of Sail Tracker.

It should act as an index and framing document, not as the detailed specification for every sub-area.

## Why This Area Is Split

The old material treated "admin" and "profile" as single buckets for many unrelated concerns:

- platform administration
- club setup
- qualification catalogs
- harbor and equipment reference data
- person qualifications
- personal profile management

For Sail Tracker, these need clearer boundaries so the product stays modular and multi-tenant-safe.

## Domain Family Overview

Think about this area in four separate domains:

1. platform administration
2. tenant administration
3. member profile
4. qualifications and reference catalogs

These are related, but they are not the same product area and should not be documented as one merged feature.

They also support the operational backbone and trip workflows already defined in:

- [`Calendar And Scheduling`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/calendar-and-scheduling.md)
- [`Trip Logging And Logbook`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-logging-and-logbook.md)

## Sub-Areas

### 1. Platform Administration

Scope: global, above any individual club.

Primary actor:

- `platform_admin`

Main responsibilities:

- create and manage tenants
- manage platform admins
- manage demo tenant lifecycle
- manage domain mapping and tenant status
- manage bootstrap and support tooling later

This area should not become a dumping ground for club-specific settings.

Detailed document:

- [`platform-administration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/platform-administration.md)

Typical concerns:

- tenant directory
- domain and subdomain management
- platform admin management
- environment and bootstrap tools
- audit and support access

### 2. Tenant Administration

Scope: one club only.

Primary actors:

- `tenant_owner`
- future tenant-level admins with narrower permissions

Main responsibilities:

- configure club settings
- manage members and memberships
- manage club-specific catalogs and lookup data
- manage boats, harbors, and club-level defaults
- configure how trip workflows behave in the club
- assign tenant-scoped permissions

This is where most of the old `admin` document belongs.

Detailed document:

- [`tenant-settings.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tenant-settings.md)

Main concerns:

- club settings
- membership administration
- tenant-scoped permissions
- tenant trip workflow configuration
- tenant reference data such as harbors and equipment

### 3. Memberships And Identity

Scope: who a person is, how they belong to a club, and how they participate operationally.

Detailed document:

- [`memberships-and-identity.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/memberships-and-identity.md)

This is the real identity backbone for:

- account identity
- personal profile
- tenant memberships
- guest handling
- responsible-sailor identity
- kiosk-mode identity

### 4. Member Profile

Scope: the logged-in user managing their own information and seeing their own status.

This is a navigation and experience concern, not a separate identity model.

Its detailed identity and membership rules should stay in:

- [`memberships-and-identity.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/memberships-and-identity.md)

Typical profile concerns:

- personal details
- emergency contact
- qualifications and eligibility summary
- memberships
- personal trip activity

### 5. Qualifications And Reference Catalogs

Detailed document:

- [`qualification-model.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/qualification-model.md)

This area owns:

- qualification catalogs
- member-held qualifications and skills
- vessel eligibility and approval concepts

It should stay separate from both profile UX and generic admin structure.

## Cross-Area Connections

These areas support the product backbone and operational modules already defined in:

- [`calendar-and-scheduling.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/calendar-and-scheduling.md)
- [`trip-logging-and-logbook.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-logging-and-logbook.md)
- [`system-composition.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/system-composition.md)

They also connect directly to:

- [`operating-modes/kiosk-mode.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/operating-modes/kiosk-mode.md)

## Suggested Navigation Structure

If we turn this into product navigation later, a better structure would be:

- `Platform`
  - Tenants
  - Domains
  - Platform Admins
- `Club Settings`
  - Members
  - Roles and Permissions
  - Qualification Catalogs
  - Harbors
  - Equipment Library
- `My Profile`
  - Personal Details
  - Emergency Contact
  - Qualifications
  - Activity

This is much clearer than a single broad "Admin" section.

## Product Rules To Keep

- platform configuration must stay separate from tenant configuration
- tenant-scoped data must not leak across clubs
- profile editing must stay separate from admin management
- qualifications must support both reference definitions and member-specific records
- permissions must control access to each area explicitly
- club-specific trip configuration should live in tenant administration, not in platform-wide settings
- the product must support members, responsible sailors, vessel-responsible users, and guests without collapsing them into one user type
- kiosk mode should reuse the same permissions and trip rules, not invent a separate domain model

## Use This Document As

- the overview for identity/access/admin structure
- the entry point into the more detailed sub-area docs
- the place where boundaries between those sub-areas are kept clear

Do not keep adding detailed rules here if a more specific sub-area document exists.
