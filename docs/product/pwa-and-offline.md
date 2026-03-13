# PWA And Offline

## Purpose

This document defines how Sail Tracker should behave as an installable app that remains useful when connectivity is weak, intermittent, or temporarily unavailable.

It exists because the product is used in real operational conditions:

- at harbors
- on boats
- around departure and return
- on shared devices
- in places where network quality is inconsistent

## Why This Area Matters

The product cannot assume that every important action happens on a stable desktop connection.

Examples:

- a skipper starts a trip from a harbor with weak mobile signal
- a member needs to confirm who is onboard before departure
- a kiosk device in the clubhouse loses connectivity for a period
- a trip returns later and the report-back must still work before sync completes

If the app only works well online, it will fail at the exact moments the club depends on it most.

## Scope

This area covers:

- installable PWA behavior
- offline-capable product flows
- reconnect and synchronization expectations
- local device state that supports operational continuity
- push and background update behavior later

This area does not own:

- trip rules
- calendar rules
- qualification rules
- membership identity rules
- reporting logic

Those remain in their source domains.

This area defines how those workflows continue to function when network conditions are poor.

## Core Product Outcome

The product should make it possible to:

- install Sail Tracker on phones, tablets, and shared devices
- open the app quickly in a focused app-like mode
- keep the most important operational views usable without perfect connectivity
- complete essential actions and sync them safely when connection returns
- understand whether data is live, cached, pending sync, or failed to sync

## Product Position

PWA and offline behavior are not a separate domain.

They are a cross-cutting product area that supports the calendar backbone and the operational workflows built on top of it.

That means:

- calendar still owns time-based operational truth
- trip still owns trip-specific details
- tasks and inspections still own their operational meaning
- offline support defines how those workflows behave on-device before the server round-trip completes

## Installable App Behavior

The product should support installation on supported devices so it can feel like an operational tool, not only a website.

Important outcomes include:

- home-screen or app-launcher entry
- focused full-screen or near-full-screen usage where supported
- recognizable tenant-aware branding later
- reliable startup into the most useful operational entry point

This matters especially for:

- responsible sailors
- club owners
- trainers and leaders
- shared clubhouse or harbor devices

## Offline Product Principle

Offline support should be layered.

Not every feature needs the same offline depth.

The product should prioritize:

- operational continuity for departure and return
- visibility into today, active, and overdue work
- fast access to vessel and manifest context
- capture of important facts that can sync later

It should not try to promise that every admin or reporting feature is fully offline on day one.

## Offline-Capable Workflows

The product should eventually support these workflows gracefully when connectivity is poor:

- open the app and view cached operational context
- view today's schedule
- view active and overdue trips
- open a vessel or trip detail page from cached context
- start a planned trip
- report back a trip as completed
- record manifest changes made at the point of departure
- record notes, incidents, and other essential trip details for later sync

Useful but lower-priority offline workflows include:

- asset lookup by QR code
- task completion
- inspection completion
- local media capture with deferred upload

## Data Classes

Offline behavior should treat different types of data differently.

### Reference Data

Usually safe to cache for read use:

- tenant profile and settings needed for current workflows
- vessel details needed for operations
- assigned assets and readiness context
- qualification summaries needed for trip validation
- seeded catalogs and local catalogs that change slowly

### Operational Timeline Data

Important to cache and refresh carefully:

- today’s calendar items
- active trips
- overdue trips
- due-soon tasks and inspections
- recent vessel timeline context

### Mutating Operational Actions

Must support safe pending state and later synchronization:

- start trip
- report back
- manifest update
- task completion
- inspection completion
- incident capture

### Heavy Or Secondary Data

May be limited or deferred:

- large reports
- bulk exports
- historical browsing far outside the current operational window
- large media uploads

## Pending Work Model

When a user performs an action while offline or with weak connectivity, the app should not pretend the server has already accepted it.

The product should represent a clear local state such as:

- saved locally
- pending sync
- synced
- sync failed
- needs user attention

This is especially important for:

- departure
- report-back
- incident recording
- checklist completion

## Sync Expectations

Synchronization should be predictable and auditable.

The app should:

- retry pending operational actions when connection returns
- preserve action order where order matters
- avoid silent data loss
- show when a pending action has not reached the server
- make conflicts visible instead of overwriting facts invisibly

## Conflict Model

The most important product rule is not “never conflict.”
It is “never hide an important conflict.”

Examples:

- two devices try to report back the same trip differently
- a vessel is marked departed from one device while another user changes the schedule
- a task is completed after it was already rescheduled elsewhere

The product should prefer:

- clear conflict states
- explicit retry or review
- preservation of the user’s unsynced input where possible

## Relationship To Calendar

Calendar remains the main operational source of truth for:

- planned items
- active items
- overdue items
- due-soon items
- availability windows

Offline support should help users continue operating against those concepts even when the latest live data is temporarily unavailable.

The user should understand when they are seeing:

- live calendar state
- recently cached calendar state
- local pending changes not yet synced

## Relationship To Dashboard And Operational Views

The dashboard and operational entry points should degrade gracefully.

They should still help users answer:

- what is happening today
- what is active now
- what needs attention

even if some cards or secondary summaries are stale or temporarily unavailable.

The product should prefer a partially useful operational landing page over an all-or-nothing failure state.

## Relationship To Kiosk Mode

Kiosk mode depends heavily on this area.

Shared devices must be able to:

- launch quickly
- show today's operational view
- support simple start and report-back flows
- recover cleanly after connection issues

Offline support in kiosk mode must also be careful about:

- who is currently signed in or trusted
- what personal or sensitive data stays on-device
- when a device should require reauthentication

## Push And Background Behavior

Later, the product may use:

- push notifications
- background refresh
- background sync

These are supporting capabilities, not separate product truths.

They should exist to:

- refresh operational context
- notify users of important state changes
- help pending work sync cleanly

They should not create a shadow workflow separate from the main app.

## Privacy And Device Considerations

Offline support means some data may exist locally on a device.

That requires product rules for:

- device trust on shared devices
- how much manifest or member detail is cached locally
- whether cached data should expire after inactivity
- whether kiosk devices use a reduced-detail mode
- how sign-out or device reset affects local data

## Business Rules

- PWA and offline behavior are cross-cutting product behavior, not a separate business domain.
- The most important operational workflows should remain usable under weak connectivity.
- The product must distinguish live, cached, pending-sync, and failed-sync states clearly.
- Offline support must never silently invent or alter domain truth.
- Calendar-backed operational state remains the backbone even when viewed from cache.
- Pending actions must sync safely and visibly when connectivity returns.
- Shared-device and kiosk use must balance operational speed with privacy and trust.

## Product Outcome

The product should feel dependable in real club conditions.

Users should be able to trust that:

- the app opens when they need it
- important operational context is still available
- essential actions can still be captured
- the system tells the truth about what is synced and what is not

If that trust is missing, the product will feel fragile no matter how strong the rest of the feature set becomes.
