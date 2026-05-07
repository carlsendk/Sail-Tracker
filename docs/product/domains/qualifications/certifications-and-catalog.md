# Certifications And Catalog

## Purpose

This document defines how Sail Tracker represents external certifications, the public certification catalog, and person-held certification records.

It answers:

- what certifications exist in the system as reference data
- what certificates a specific person holds
- how the product records, stores, and verifies those facts

This is the foundational layer for qualification-aware workflows. It records facts. It does not make eligibility decisions by itself.

## Why This Area Matters

Sailing clubs rely heavily on externally issued credentials.

Examples:

- VHF radio certificate
- official sailing license (e.g. Duelighedsbevis in Denmark)
- first aid certificate
- coastal or offshore sailing endorsement

Without a shared catalog of what these certifications mean and a reliable record of who holds them, the product cannot answer eligibility questions at departure time. Worse, it must fall back to manual gatekeeping for every trip.

The product should instead record certification facts once and use them everywhere.

## Core Outcome

The product should make it easy to answer:

- what certifications does this person hold
- are any of those certifications expired
- what certifications does this club recognize
- which are required for a given vessel or trip type
- is proof on file or pending verification

## Scope

This area covers:

- certification catalog definitions (the reference layer)
- person-held certification records
- issuing organization, certificate number, issue and expiry dates
- uploaded proof documents
- verification status per record

This area does not own:

- local approvals or club-specific eligibility decisions
- skill records and informal recognition
- trip departure validation logic
- vessel class requirements (those reference certifications but live in fleet)
- permission to manage qualification workflows

Those remain in their own areas.

## Requires

- [membership-and-onboarding.md](../members/membership-and-onboarding.md) — person identity to attach records to
- [permissions-and-roles.md](../members/permissions-and-roles.md) — controls who may manage catalog definitions and person records

## Enhanced By

- [local-approvals.md](local-approvals.md) — certification records feed into local approval eligibility checks
- [skills-and-recognition.md](skills-and-recognition.md) — complements formal certs with informal club-recognized skills
- [trip-planning-and-lifecycle.md](../trips/trip-planning-and-lifecycle.md) — certification facts are consumed during departure validation
- [vessel-registry.md](../fleet/vessel-registry.md) — vessels may reference catalog entries as required certifications
- [seeded-catalog-adoption.md](../../platform/seeded-catalog-adoption.md) — governs how tenants inherit and extend platform-provided catalog entries
- [tenant-settings.md](../../platform/tenant-settings.md) — tenants may configure verification requirements or proof obligations

## Key Concepts

### Certification Catalog

The catalog is the reference layer. It defines what a certification type is.

Each catalog entry describes:

- name and description of the certification
- issuing organization (e.g. a national sailing federation, a maritime authority)
- whether expiry is expected
- whether it is a platform-seeded entry or a tenant-local addition

The catalog does not belong to any one person. It is shared reference data.

### Person-Held Certification Record

A certification record is a fact about one specific person.

It connects a person to a catalog entry and adds:

- certificate number (if applicable)
- issue date
- expiry date (if applicable)
- uploaded proof document or link
- verification status

Verification status indicates whether the club has checked the certificate against the original. It may be:

- unverified — recorded by the member but not checked
- verified — confirmed by someone with the right permission
- expired — past expiry date
- rejected — submitted proof did not match or was invalid

### Seeded Public Catalog

The platform provides a Denmark-oriented seed catalog out of the box.

This covers common Danish sailing certifications that most clubs will recognize. Tenants adopt entries from this catalog rather than recreating them from scratch.

Tenants may also define local catalog entries for certifications specific to their context or country.

Seeded entries are maintained at the platform level. Tenant-local additions are owned by the tenant.

See [seeded-catalog-adoption.md](../../platform/seeded-catalog-adoption.md) for how tenants adopt and extend the catalog.

## Registration-First Principle

The product should operate on a registration-first model.

That means:

- certifications are recorded as facts when they are obtained or uploaded
- eligibility is evaluated at the moment it matters, such as at trip departure
- there is no approval workflow required simply to enter a certification into the record if the data is current

This keeps the product lightweight for the common case. A member with a VHF certificate holds that certificate. The product records it. The departure check consults it. No manual step in between is needed unless something is wrong or missing.

Approval workflows exist for a different purpose: club-specific eligibility decisions that go beyond raw certificate data. See [local-approvals.md](local-approvals.md).

## External Certification Versus Local Approval

This distinction is operationally important and must not be collapsed.

An external certification is a fact issued by an authority outside the club. It can be recorded, verified, and expired. It is not a club decision.

A local approval is a club decision. It represents the club saying: this person may take this vessel, or operate in this context. It may depend on certifications, but it is not the same thing as holding one.

Collapsing these two into a single concept weakens operational trust. A member may hold every required external certificate but still need a club-issued local approval to take a specific vessel out unsupervised.

See [local-approvals.md](local-approvals.md) for the local approval model.

## Who Can Manage This Area

Management of catalog definitions and person records is permission-based, not hardcoded to a specific role title.

Examples of permissions that may apply:

- `qualification.catalog.manage` — create, edit, or deactivate catalog entries
- `qualification.record.manage` — add, edit, or verify person-held certification records

Members may typically submit their own certification records for review. Verification and rejection should require an explicit permission.

See [permissions-and-roles.md](../members/permissions-and-roles.md).

## Business Rules

- A certification record must reference a catalog entry.
- A person may hold multiple records against the same catalog entry, for example a renewed certificate replacing an expired one.
- An expired record should not be silently treated as valid during departure checks.
- External certification should not automatically equal club permission to operate a vessel. That decision belongs to local approvals.
- Catalog entries seeded by the platform should not be editable by tenants in ways that corrupt their meaning. Tenants may add local entries on top.
- Verification status must be set by someone with the appropriate permission, not self-asserted as verified.
- Uploaded proof should be stored against the record, not just referenced by URL if that URL can become stale.
- A catalog entry may be marked inactive if it is no longer issued, without deleting historical records that reference it.

## Cross-References

- [local-approvals.md](local-approvals.md) — club-issued eligibility decisions that sit above raw certification facts
- [skills-and-recognition.md](skills-and-recognition.md) — informal skills and club-recognized competencies
- [membership-and-onboarding.md](../members/membership-and-onboarding.md) — person identity that certification records attach to
- [permissions-and-roles.md](../members/permissions-and-roles.md) — permission model governing who may manage records and catalog
- [trip-planning-and-lifecycle.md](../trips/trip-planning-and-lifecycle.md) — where certification facts are consumed at departure
- [tenant-settings.md](../../platform/tenant-settings.md) — tenant-level configuration of verification requirements
- [seeded-catalog-adoption.md](../../platform/seeded-catalog-adoption.md) — how tenants inherit the platform-provided Denmark-oriented catalog
- [vessel-registry.md](../fleet/vessel-registry.md) — vessels that reference catalog entries as required certifications
