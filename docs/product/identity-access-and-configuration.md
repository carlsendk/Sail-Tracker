# Identity, Access, And Configuration

This document rewrites the older `admin` and `profile` concepts into a structure that fits Sail Tracker as a multi-tenant product.

## Why This Structure Changes

The old material treated "admin" as a single bucket for many unrelated concerns:

- platform administration
- club setup
- qualification catalogs
- harbor and equipment reference data
- person qualifications
- personal profile management

For Sail Tracker, these must be split by responsibility and scope.

## New Product Structure

Think about this area in four separate domains:

1. platform administration
2. tenant administration
3. member profile
4. qualifications and reference catalogs

These are related, but they are not the same product area.

## 1. Platform Administration

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

### Example Future Areas

- tenant directory
- domain and subdomain management
- platform admin management
- environment and bootstrap tools
- audit and support access

## 2. Tenant Administration

Scope: one club only.

Primary actors:

- `tenant_owner`
- future tenant-level admins with narrower permissions

Main responsibilities:

- configure club settings
- manage members and memberships
- manage club-specific catalogs and lookup data
- manage boats, harbors, and club-level defaults
- assign tenant-scoped permissions

This is where most of the old `admin` document belongs.

### Tenant Configuration Areas

#### Membership And People Setup

- member records
- emergency contact details
- membership status
- future invitation and join flows

#### Qualification Catalogs

These are tenant-scoped reference sets, not platform-global by default:

- experience levels
- certification types
- specialized skills
- boat qualification rules

They exist because clubs may define their own sailing programs and approval standards.

#### Operational Reference Data

These are also tenant-scoped unless proven otherwise:

- harbor locations
- equipment categories
- equipment library

The old admin draft was correct that these support many workflows, but they should live under club configuration, not a generic admin bucket.

## 3. Member Profile

Scope: the logged-in user managing their own information and seeing their own status.

Primary actor:

- authenticated member

Main responsibilities:

- view and edit personal contact details
- manage emergency contact information
- manage profile picture
- view membership and qualification status
- view trip-related activity and future participation
- manage future account preferences

This is not administration. It is self-service identity and participation context.

### Profile Areas

#### Personal Identity

- name
- email
- phone
- avatar or profile picture

#### Safety And Contact

- emergency contact name
- emergency contact phone
- emergency contact relationship

#### Sailing Context

- experience level
- certifications
- specialized skills
- club memberships
- future roles and permissions summary

#### Personal Activity

- upcoming trips
- recent activity
- trip participation history

This keeps the useful parts of the old profile page while aligning them with the current product language.

## 4. Qualifications And Reference Catalogs

Some of the old admin concepts should be treated as a separate product concern because they affect multiple workflows.

These include:

- experience levels
- certification types
- skills
- boat qualifications

They support:

- member qualification tracking
- skipper eligibility
- safety validation
- trip planning rules

### Important Distinction

Separate:

- catalog definitions
- member-held certifications or skills
- approvals and qualification records

These are different concepts and should not collapse into one screen or one table without care.

## Reframed Product Areas

Here is how the old concepts map into the new product:

### Old: Admin Dashboard

Becomes:

- `Platform Administration`
- `Tenant Administration`
- `Qualification Catalogs`

### Old: Experience Levels

Becomes:

- tenant-scoped qualification catalog

### Old: Certification Types

Becomes:

- tenant-scoped certification catalog

### Old: Specialized Skills

Becomes:

- tenant-scoped skills catalog

### Old: Boat Qualifications

Becomes:

- qualification approvals and eligibility records
- likely part of qualifications and safety, not generic admin

### Old: Harbor Locations

Becomes:

- tenant operational reference data

### Old: Equipment

Becomes:

- tenant equipment catalog and fleet support data

### Old: Profile

Becomes:

- member self-service profile and participation overview

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

## What We Should Design Later

These are implied by the old drafts, but should be designed deliberately:

- invitation and onboarding flow
- user can belong to multiple clubs
- owner can delegate narrow admin permissions
- approval flow for boat qualification
- audit trail for qualification and catalog changes
- localization of qualification and catalog labels

## Recommended Next Follow-Up

The next product documents that would make this actionable are:

1. `memberships-and-identity.md`
2. `qualification-model.md`
3. `tenant-settings.md`
4. `platform-admin.md`

Those would turn this structural rewrite into implementable product slices.
