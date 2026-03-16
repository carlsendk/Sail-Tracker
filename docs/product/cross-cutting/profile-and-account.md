# Profile And Account

## 1. What Problem Does This Solve?

A person using Sail Tracker across multiple sessions needs a consistent place to manage who they are, how they can be reached in an emergency, what sailing experience they bring, and how their account behaves.

The product needs to answer:

- how does a person view and update their own identity data
- where does a person see their upcoming trips and recent activity
- where does a person manage security and account settings
- how does a person upload or change their photo
- where does an emergency contact live, and who can access it

Without a clear self-service surface, people rely on admins for routine updates, emergency contact data goes stale, and the product feels impersonal and hard to trust.

## 2. Who Uses It?

- **All authenticated members** — view and edit their own profile, manage personal info, review upcoming trips and activity
- **Admins and platform support** — may view profiles on behalf of members in support scenarios; do not own the data

## 3. What Does It Own?

This area owns the self-service surface for reading and updating person-owned data. It does not create or govern the underlying records — it provides the UI and editing flows that let a person manage what belongs to them.

### Surfaces

**Profile page** — the member's personal page within a tenant context, showing:

- avatar and full name
- role or person type within this club
- member since date
- total trips logged
- favourite vessels
- upcoming trips card
- recent activity timeline

**Personal info editor** — self-service editing for:

- first name and last name
- email address
- phone number
- emergency contact (name, phone, relationship)

**Sailing experience editor** — self-service editing for:

- experience level
- years sailing
- preferred role (skipper, crew, or both)
- certifications (viewed here; owned by qualifications domain)

**Photo management** — upload or replace the profile picture associated with the platform account.

**Security settings** — self-service account controls:

- change password
- notification preferences
- account deletion request

**My Trips view** — a personal view of:

- upcoming trips the person is on (name, date, status badge)
- past trips they have participated in

**Recent Activity** — a personal timeline of the person's actions and events within the club.

## 4. What Does It NOT Own?

- **Person identity records** — the Person and PersonProfile aggregates. See [membership-and-onboarding.md](../domains/members/membership-and-onboarding.md).
- **Qualification records** — certifications and skill recognition. See [certifications-and-catalog.md](../domains/qualifications/certifications-and-catalog.md) and [skills-and-recognition.md](../domains/qualifications/skills-and-recognition.md).
- **Local approvals** — club-granted eligibility. See [local-approvals.md](../domains/qualifications/local-approvals.md).
- **Permission bundles** — what a membership allows. See [permissions-and-roles.md](../domains/members/permissions-and-roles.md).
- **Trip lifecycle rules** — trip creation, departure, and completion. See [trip-planning-and-lifecycle.md](../domains/trips/trip-planning-and-lifecycle.md).
- **Notification delivery** — how and when reminders are sent.

## 5. Requires

- Authenticated platform account (authentication layer)
- Active TenantMembership in the current tenant — see [membership-and-onboarding.md](../domains/members/membership-and-onboarding.md)
- PersonProfile record to exist before editing is possible

## 6. Enhanced By

- [certifications-and-catalog.md](../domains/qualifications/certifications-and-catalog.md) — certifications surface in the experience section of the profile
- [local-approvals.md](../domains/qualifications/local-approvals.md) — club-granted eligibilities may be visible on the profile for transparency
- [skills-and-recognition.md](../domains/qualifications/skills-and-recognition.md) — recognised skills may appear alongside formal qualifications
- [trip-planning-and-lifecycle.md](../domains/trips/trip-planning-and-lifecycle.md) — My Trips reads trip state from the trips domain
- [permissions-and-roles.md](../domains/members/permissions-and-roles.md) — current permission bundle is visible in profile context

## 7. Key Concepts

### Person-Owned Versus Tenant-Owned Data

Profile data is person-owned. A change to a name, photo, or emergency contact updates the record that travels with the person across clubs.

Tenant membership data (status, permission bundle, join date) is tenant-owned and is not editable through the self-service profile. Admins manage it through membership administration.

The profile page operates in a tenant context (showing that club's trips and activity) but edits only person-owned fields.

### Emergency Contact

Emergency contact is part of PersonProfile and is therefore person-owned and cross-tenant.

It is the only part of the profile that is surfaced to trip leaders and admins when a vessel does not return as expected. Keeping it current is treated as an operational safety requirement, not optional personal information.

### My Trips As A Read Surface

My Trips and Recent Activity are read-only views composed from the trips domain. They show the person's participation history and future schedule without owning any of the underlying trip data.

These views answer personal questions — "where am I going?", "what have I done?" — rather than operational questions about fleet state or club scheduling.

### Editing Model

Profile editing uses a modal-based flow that covers:

- all personal fields in one place
- emergency contact as a distinct sub-section within personal info
- sailing experience as a separate section
- photo upload as a distinct action

This keeps the editing surface simple and avoids inline editing scattered across the page.

### Internationalization

The profile and account surface supports English and Danish. Locale preference may be set here and applies across the product for the current person.

## 8. Business Rules

- A person may only edit their own profile; no member may edit another member's personal info.
- Emergency contact must have at minimum a name and phone number; relationship is encouraged but optional.
- Photo upload is restricted to image file types within a reasonable size limit.
- Account deletion is a request, not an immediate action; the product must confirm intent and may require admin acknowledgement depending on active trip participation.
- Certification and qualification records are visible on the profile but are not editable here; edits flow through the qualifications domain.
- Notification preferences set here apply across the platform for the current person, subject to what each tenant has enabled.
- My Trips shows only trips within the current tenant context; a person in multiple clubs does not see cross-tenant trips in one view.
- The profile page respects the current tenant's permission model; a person does not see role or permission detail beyond what is appropriate for their bundle.

## 9. Cross-References

- [membership-and-onboarding.md](../domains/members/membership-and-onboarding.md) — Person and PersonProfile records; identity layers; multi-club membership
- [permissions-and-roles.md](../domains/members/permissions-and-roles.md) — what a TenantMembership allows; role display on profile
- [certifications-and-catalog.md](../domains/qualifications/certifications-and-catalog.md) — formal qualifications visible in experience section
- [local-approvals.md](../domains/qualifications/local-approvals.md) — club-granted eligibility visible in experience section
- [skills-and-recognition.md](../domains/qualifications/skills-and-recognition.md) — recognised skills visible in experience section
- [trip-planning-and-lifecycle.md](../domains/trips/trip-planning-and-lifecycle.md) — source of truth for My Trips data
