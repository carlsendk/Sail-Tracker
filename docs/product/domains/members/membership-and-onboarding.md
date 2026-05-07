# Membership And Onboarding

## 1. What Problem Does This Solve?

A sailing club has people who participate at different levels and arrive through different paths. Some are long-standing members with full records. Some are guests on a single trip. Some are new members who just received an invitation. Some are experienced sailors joining a second club.

The product needs to answer:

- who is this person across the platform
- which club are they a member of
- how did they arrive
- what must be in place before they can participate operationally
- how do guests fit into this model without becoming full members by default

Without a clear model here, identity becomes fragmented, onboarding becomes ad-hoc, and guest handling creates data quality problems.

## 2. Who Uses It?

- **Tenant owners and admins** — invite members, monitor onboarding progress, manage membership status
- **Members** — complete their own profile, join new clubs, transition from guest to member
- **Platform admins** — bootstrap initial tenants, assist with setup, manage cross-tenant identity
- **Guests** — appear on manifests without holding full membership

## 3. What Does It Own?

### Aggregate Root

**Person** — the platform-level identity record. One per human. Exists independently of any tenant membership.

### Entities

**PersonProfile** — person-owned data that travels with the person across tenants:
- legal name
- contact details
- avatar
- emergency contact

**TenantMembership** — the relationship between a person and a specific tenant. Tenant-owned data:
- membership status (invited, active, suspended, lapsed)
- local notes
- local permission bundle assignment
- join date

**Invitation** — a pending offer for a person to join a tenant:
- target tenant
- invited email address
- intended role bundle
- inviter
- expiry timestamp
- status (pending, accepted, expired, revoked)

**Guest** — an operational participant who is not a full member:
- display name
- optional contact details
- no TenantMembership required
- can appear on trip manifests

### Person Types

| Type | Description |
|---|---|
| Member | Holds an active TenantMembership |
| Responsible Sailor | Member who is operationally eligible to take a vessel out (distinct from permissions) |
| Tenant Owner / Admin | Member with elevated permission bundle for club administration |
| Platform Admin | Platform-level authority; may span tenants |
| Guest | Participates operationally; no TenantMembership by default |

### Rules

- One platform account per human regardless of how many clubs they join.
- A person may hold multiple TenantMemberships simultaneously with different permission bundles in each.
- Person-owned profile data belongs to the person and follows them across tenants.
- Tenant-owned membership data belongs to the club and is not visible or portable across tenants.
- A guest appearing on a manifest is not a member and does not automatically gain membership.
- Responsible-sailor status is an operational eligibility fact, not a permission. A person may have trip-creation permissions without being eligible to take out a specific vessel.

## 4. What Does It NOT Own?

- **Permission bundles** — which actions a membership allows. See [permissions-and-roles.md](permissions-and-roles.md).
- **Qualification records** — what a person has demonstrated. See [certifications-and-catalog.md](../qualifications/certifications-and-catalog.md).
- **Local approvals** — club-granted eligibility overrides. See [local-approvals.md](../qualifications/local-approvals.md).
- **Trip manifest composition** — who is on a specific trip. See [trip-manifest-and-guests.md](../trips/trip-manifest-and-guests.md).
- **Tenant configuration** — how a tenant is structured and named. See [tenant-bootstrap-and-setup.md](../../platform/tenant-bootstrap-and-setup.md).

## 5. Requires

- Platform account creation (authentication layer)
- Tenant must exist before a membership can be created
- [tenant-bootstrap-and-setup.md](../../platform/tenant-bootstrap-and-setup.md) — for the owner bootstrap path

## 6. Enhanced By

- [permissions-and-roles.md](permissions-and-roles.md) — once a membership is active, bundles define what the member may do
- [certifications-and-catalog.md](../qualifications/certifications-and-catalog.md) — qualifications attach to the person and affect operational eligibility
- [local-approvals.md](../qualifications/local-approvals.md) — clubs may grant eligibility on top of or instead of formal qualifications
- [trip-manifest-and-guests.md](../trips/trip-manifest-and-guests.md) — guests and members both appear on manifests
- [kiosk-mode.md](../../operating-modes/kiosk-mode.md) — kiosk entry reuses existing member records, applies the same permissions and responsible-sailor rules

## 7. Key Concepts

### Identity Layers

The product maintains four distinct layers for any person:

1. **Platform account** — authentication identity, one per human, cross-tenant
2. **Personal profile** — person-owned data such as name, contact, emergency info
3. **Tenant membership** — club-scoped relationship with status and local permissions
4. **Operational participation** — trip-level presence, either as a member or a guest

These layers are separate. A person may have a platform account without belonging to any tenant. A guest may participate operationally without a platform account.

### Multi-Club Membership

A person who belongs to two clubs holds two independent TenantMemberships under one platform account.

Consequences:

- no full re-signup when joining a second club
- different permission bundles may apply in each club
- profile data (name, emergency contact) is shared; membership status and local permissions are not
- platform admins see both memberships; each club sees only its own

### Responsible-Sailor Distinction

The product should keep this distinction visible:

- **Permission** — whether a person may use or administer a workflow (e.g. create a trip)
- **Responsible-sailor eligibility** — whether a person may act as the qualified operator for a given vessel and context

These are independent. A member with trip-creation permission may not be eligible as responsible sailor on a specific vessel. A locally approved sailor may not have admin permissions.

### Guest Model

Guests are operational participants without full membership.

Rules:

- A guest can be added to a trip manifest by name and optional contact detail.
- Appearing on a manifest does not create or imply a TenantMembership.
- If a guest later becomes a member, their guest records may be associated retrospectively where appropriate.
- Guests cannot act as responsible sailor by default.

### Kiosk Mode Identity

When a member uses kiosk mode to check in or initiate a trip:

- the system reuses the existing member record
- permissions and responsible-sailor eligibility apply identically to a normal session
- no shadow or duplicate identity is created

See [kiosk-mode.md](../../operating-modes/kiosk-mode.md).

## 8. Business Rules

### Entry Paths

The product supports four distinct ways a person may arrive:

**Bootstrap owner** — the first person in a tenant is created as part of tenant setup. No invitation required. See [tenant-bootstrap-and-setup.md](../../platform/tenant-bootstrap-and-setup.md).

**Tenant invitation** — an admin invites an email address. The invitation records the target tenant, intended bundle, inviter, and expiry. The invitee creates or links a platform account and activates membership.

**Platform-assisted** — a platform admin creates a membership directly, typically during migration or support scenarios.

**Self-serve** — if the tenant allows it, a person may request membership without a prior invitation. Requires admin approval to activate.

### Onboarding Stages

A membership moves through stages before the person is fully operational:

1. **Invited** — invitation issued, not yet accepted
2. **Account linked** — person has authenticated and claimed the invitation
3. **Profile ready** — minimum required profile fields are present
4. **Membership active** — admin has confirmed or auto-confirmed the membership
5. **Bundle assigned** — a permission bundle is in place
6. **Operational** — person may participate in trips and club activities

Not every field must be collected immediately. The system should allow minimum data at join time and prompt for the rest progressively.

### Existing User Joining Another Tenant

When a person with an existing platform account accepts an invitation to a new club:

- no new platform account is created
- no full re-signup flow is required
- a new TenantMembership is created and moves through the stages above
- the person's existing profile data pre-fills what the new club needs
- permissions in the new club start from the invited bundle, independent of other clubs

### Invitation Rules

- An invitation targets one email address and one tenant.
- An invitation has an expiry; expired invitations cannot be accepted.
- An invitation may specify an intended bundle; the bundle is assigned on activation, not before.
- An admin may revoke an invitation before it is accepted.
- Accepting an invitation does not activate the membership automatically if admin confirmation is required by tenant settings.

### Minimum Operational Readiness

A person does not need a complete profile to be usable. The product should distinguish:

- what is required before any operational participation (e.g. name, emergency contact)
- what is encouraged but deferrable
- what is only needed for specific roles or vessel types

## 9. Cross-References

- [permissions-and-roles.md](permissions-and-roles.md) — what a membership is allowed to do
- [trip-planning-and-lifecycle.md](../trips/trip-planning-and-lifecycle.md) — how members and guests appear in trip workflows
- [trip-manifest-and-guests.md](../trips/trip-manifest-and-guests.md) — guest model in the context of a specific trip
- [certifications-and-catalog.md](../qualifications/certifications-and-catalog.md) — qualifications attached to person identity
- [local-approvals.md](../qualifications/local-approvals.md) — club-granted eligibility, separate from membership status
- [tenant-bootstrap-and-setup.md](../../platform/tenant-bootstrap-and-setup.md) — bootstrap owner entry path
- [kiosk-mode.md](../../operating-modes/kiosk-mode.md) — identity and permission reuse in kiosk sessions
