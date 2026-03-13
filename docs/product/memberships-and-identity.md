# Memberships And Identity

## Area Purpose

This area defines who a person is in Sail Tracker, how they are connected to one or more clubs, and what kind of operational participation they can have.

It is the identity backbone for:

- sign-in
- tenant membership
- responsible-sailor eligibility
- manifest participation
- guest handling
- kiosk-mode identification

Without a clear model here, trips, permissions, qualifications, and club administration will drift apart.

## Why This Area Matters

A sailing club product does not just have "users".

It has several different identity shapes that must work together:

- a person with an account
- a member of one or more clubs
- a qualified sailor who may take a vessel out
- a guest on a manifest
- a profile managed partly by the member and partly by the club
- a person identified quickly on a shared kiosk device

If those are collapsed into one flat user record, the product will become hard to reason about and hard to configure.

## Core Product Outcome

The product should make it easy to answer:

- Who is this person in the system?
- Which clubs do they belong to?
- What can they do in each club?
- Can they act as the responsible sailor for a vessel?
- Are they a member, guest, or platform operator?
- What identity data belongs to the person, and what belongs to the club relationship?

## Scope

This area covers:

- account identity
- sign-in identity
- personal profile identity
- tenant memberships
- membership status
- club-specific permissions
- guest participation model
- responsible-sailor identity
- kiosk-mode person identification

This area does not own:

- qualification catalogs
- vessel rules
- trip lifecycle
- calendar scheduling

It provides the actor model those areas depend on.

## Core Concepts

- `account`
  The sign-in level identity for a person across the platform.
- `profile`
  The personal identity record for that person, such as name and contact information.
- `tenant membership`
  The relationship between a person and a specific club.
- `membership status`
  Whether that relationship is active, inactive, suspended, pending, or similar.
- `permission grant`
  What the person is allowed to do within a tenant.
- `responsible sailor`
  The person accountable for a trip in the system.
- `guest`
  A non-member participant recorded in operational workflows without full membership.

## Identity Layers

This product should treat identity as several linked layers, not one record.

### 1. Platform Identity

This is the top-level account used to sign in.

It should answer:

- who is the person globally
- how do they authenticate
- can they belong to multiple clubs
- do they have any platform-level access

This is the layer most naturally tied to Supabase Auth.

### 2. Personal Profile

This is the person-facing identity record.

It should include:

- name
- email
- phone
- avatar
- emergency contact details
- language preferences later

This layer belongs primarily to the person, though some fields may be visible or editable by tenant admins depending on policy.

### 3. Tenant Membership

This is the club-specific relationship.

It should include:

- tenant
- membership status
- joined date
- local roles or permission bundles
- club-specific notes later if needed

This is the layer that answers:

- is this person currently part of this club
- what can they do here
- are they active for current operational use

See also [`permissions-and-role-bundles.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/permissions-and-role-bundles.md).

### 4. Operational Participation

This is how a person appears in real workflows.

Examples:

- responsible sailor on a trip
- crew member on a manifest
- guest on a trip
- vessel-responsible user later

This layer should not redefine identity. It should consume identity and qualification data cleanly.

## Person Types The Product Must Support

The product needs to support these shapes explicitly.

### Member

A normal club member with a tenant membership.

They may:

- view and edit their own profile
- participate in trips
- receive permissions inside one or more clubs
- hold qualifications

### Responsible Sailor

A member who is allowed to be accountable for a trip.

This is important:

The product should not assume this is only a static "skipper role".

Some clubs will think in terms of:

- skipper
- watch leader
- independent sailor
- certified youth leader

So the model should separate:

- permission to operate the workflow
- qualification to take a vessel out

### Tenant Owner Or Admin

A member with tenant-scoped administrative powers.

This person may:

- manage memberships
- assign permissions
- configure tenant settings
- control trip workflow strictness

### Platform Admin

A platform-level operator above any one club.

This person is not just another tenant admin.

### Guest

A person who appears in club operations without becoming a full member account.

Guests should be easy to add to manifests.

The product should not require every guest to:

- create an account
- become a member
- complete the full profile flow

At the same time, guest handling must still support operational safety and manifest clarity.

## Responsible-Sailor Model

This is one of the most important identity rules in the product.

The system must distinguish between:

- a person who can log in
- a person who is a member of the club
- a person who has permission to create or operate trips
- a person who is actually allowed to take a specific vessel out

The responsible sailor on a trip should therefore depend on:

- active tenant membership
- permission to act in the workflow
- qualification eligibility for the selected vessel

This keeps identity, permissions, and qualifications cleanly separated.

## Membership Across Multiple Clubs

The product should assume a person may belong to more than one tenant.

That means:

- one person may have one platform account
- that account may map to multiple tenant memberships
- each membership may have different permissions
- each tenant may hold different qualification context or approvals

This is especially important for:

- instructors
- platform admins who also belong to clubs
- sailors participating across multiple organizations

## Guest Model

Guests should be treated as operational participants, not full members by default.

The guest model should support:

- guest name on a manifest
- optional contact details if needed by club policy
- optional invited-by or host link later
- later conversion to member if appropriate

The product should avoid forcing a guest to become a full identity object too early.

See also [`trip-manifest-and-guests.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-manifest-and-guests.md).

## Ownership Of Data

A key product rule is to separate:

- what the person owns
- what the club owns

Person-owned examples:

- name
- contact details
- avatar
- emergency contact

Tenant-owned or tenant-scoped examples:

- membership status
- local permissions
- club notes later
- local approvals and role bundles

This distinction prevents identity confusion and will matter for multi-club use.

## Sign-In And Onboarding

This area should support:

- direct sign-in for existing members
- invitation to a tenant
- later self-serve membership onboarding if desired
- platform-admin-created tenant bootstrap

The product should be able to answer:

- how does a new club owner get in
- how does a member join a club
- how does a guest participate without joining

These are different flows and should not be collapsed into one onboarding path.

## Kiosk Mode Identity

Kiosk mode introduces a different operational identity challenge.

A shared device flow must still identify the acting person well enough to:

- create a trip
- choose the responsible sailor
- add manifest entries
- depart now
- report back home

Kiosk mode should not create a separate identity model.

It should reuse:

- the same member records
- the same permissions
- the same responsible-sailor rules

But it may need a simplified way to identify the acting person, such as club-approved quick selection or another lightweight controlled method.

## Permissions In This Area

Likely permissions include:

- `membership.view`
- `membership.manage`
- `profile.view_self`
- `profile.update_self`
- `profile.view_all`
- `profile.update_all`
- `guest.add_to_manifest`
- `qualification.request`

These permissions should stay separate from:

- trip permissions
- qualification approvals
- platform administration

## Dependencies On Other Product Areas

This area connects directly to:

- [`identity-access-and-configuration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/identity-access-and-configuration.md)
  As the broader product structure around identity and administration.
- [`qualification-model.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/qualification-model.md)
  For vessel eligibility and sailing approvals.
- [`trip-logging-and-logbook.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-logging-and-logbook.md)
  For responsible sailor selection, manifest participants, and guest handling.
- [`operating-modes/kiosk-mode.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/operating-modes/kiosk-mode.md)
  For shared-device operational flows.

## Product Risks

- If account, profile, membership, and eligibility are merged into one record, the model will become brittle.
- If guests are modeled too heavily, clubs will avoid recording them properly.
- If guests are modeled too lightly, manifests may lose necessary operational value.
- If responsible-sailor eligibility is not separate from generic roles, vessel rules will be hard to trust.
- If multi-club identity is ignored, the model may need a major rewrite later.
- If kiosk mode bypasses normal identity rules, operational trust will break.

## Evaluation Questions

- Is the difference between account, profile, and membership clear enough?
- Does the model support one person across multiple clubs cleanly?
- Can a club manage guests without turning them into fake members?
- Is responsible-sailor eligibility clearly separate from role labels?
- Does this area support both self-service member behavior and club-managed administration?
- Can kiosk mode reuse the same identity rules without becoming a security hole?
