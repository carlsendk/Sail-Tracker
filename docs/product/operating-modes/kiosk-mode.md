# Kiosk Mode

## What Problem Does This Solve

Clubs often have a shared tablet or device at the clubhouse or harbor where members start and end trips. Those members should not need to navigate a full desktop-style app, log in with complex credentials, or deal with slow page loads just to record a departure or report back home.

Kiosk mode gives the club a simplified, always-ready operating surface for the most common harbor-side actions.

## Who Uses It

- `responsible sailor` -- starts a trip, reports back home
- `crew member` -- confirms presence on the manifest
- `tenant_owner` -- configures which device runs in kiosk mode
- `kiosk user` -- any member who walks up to the shared device

## What This Area Owns

- the kiosk-specific operating mode and its interaction model
- device trust and session behavior for shared devices
- the simplified action surface (which actions are available in kiosk mode)

## What This Area Does Not Own

- trip lifecycle -- see [trip-planning-and-lifecycle.md](../domains/trips/trip-planning-and-lifecycle.md)
- departure validation -- see [trip-departure-and-validation.md](../domains/trips/trip-departure-and-validation.md)
- manifest structure -- see [trip-manifest-and-guests.md](../domains/trips/trip-manifest-and-guests.md)
- completion workflow -- see [trip-completion-and-reporting.md](../domains/trips/trip-completion-and-reporting.md)
- person identity -- see [membership-and-onboarding.md](../domains/members/membership-and-onboarding.md)
- calendar backbone -- see [calendar-and-scheduling.md](../backbone/calendar-and-scheduling.md)
- permissions model -- see [permissions-and-roles.md](../domains/members/permissions-and-roles.md)

Kiosk mode reuses the same domain models, the same permissions, and the same trip rules as the full app. It does not invent a separate domain model.

## Core Principle

Kiosk mode is a specialized operating mode, not a separate product.

That means:

- the same member records
- the same permission bundles
- the same responsible-sailor rules
- the same vessel and manifest models
- the same departure and completion checks

The difference is how the user interacts: faster identification, fewer navigation steps, touch-friendly, optimized for the most common harbor-side actions.

## Key Actions In Kiosk Mode

The kiosk surface should prioritize these actions:

1. **Identify the acting person** -- quick member selection from the tenant roster
2. **View today's schedule** -- what trips are planned, what is active, what is overdue
3. **Create trip quickly** -- select vessel, identify responsible sailor, add manifest entries, set times
4. **Depart now** -- start a planned trip
5. **Report back home** -- complete an active trip with the minimum required fields
6. **View active trips** -- which vessels are currently out

These should be reachable within one or two taps from the kiosk home screen.

## Device Trust And Authentication

A kiosk device must still be trusted. Uncontrolled access to trip operations would undermine safety.

The product should support:

- a device-level kiosk session tied to one tenant
- a lightweight person-identification step before operational actions (not full login each time)
- automatic session timeout after inactivity
- clear indication of which person is currently acting

Options for person identification in kiosk mode:

- member selection from a filtered tenant roster
- PIN or quick-code per member later if needed
- other lightweight controlled identification methods the club defines

The product should not allow anonymous trip creation from a kiosk device.

## Manifest Handling On Shared Devices

Kiosk mode should make manifest capture faster, not create a different manifest model.

That means kiosk flows should still use:

- the same responsible-sailor rules
- the same member lookup behavior
- the same guest model

But kiosk mode may optimize for:

- faster member search
- rapid guest entry
- touch-friendly headcount updates

## Offline And Connectivity

Kiosk devices are often in locations with weak connectivity.

Kiosk mode should:

- launch quickly even with slow network
- show today's operational view from cached data
- support departure and report-back flows while offline
- sync pending actions when connectivity returns

See [pwa-and-offline.md](../cross-cutting/pwa-and-offline.md) for the broader offline model.

## Configuration

Tenant settings should control:

- whether kiosk mode is enabled for the tenant
- which devices or sessions operate in kiosk mode
- how person identification works in kiosk mode
- session timeout duration
- which actions are available in kiosk mode

## Business Rules

- Kiosk mode must reuse the same trip rules, permission checks, and qualification requirements as the full app.
- Every operational action in kiosk mode must identify the acting person.
- Kiosk devices must be tied to exactly one tenant.
- Kiosk sessions should time out after inactivity.
- Pending offline actions from kiosk devices must sync safely and visibly.
- The kiosk surface should not expose administrative functions like membership management, qualification granting, or tenant settings.

## Product Outcome

If kiosk mode is working well, the club should experience:

- faster departure and return workflows at the harbor
- less friction for routine trip operations
- continued operational trust even on shared devices
- less temptation to fall back to paper, chat, or memory for trip logging
