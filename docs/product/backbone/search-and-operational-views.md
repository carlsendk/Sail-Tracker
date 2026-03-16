# Search And Operational Views

## Purpose

This document defines how users should find, filter, and act on operational information across Sail Tracker.

It exists because a strong domain model is not enough on its own.
The product also needs clear entry points so users can understand what needs attention right now without knowing exactly where the data lives.

## Why This Area Matters

The product already has:

- a calendar backbone
- trips
- fleet
- tasks and inspections
- assets
- qualifications

Without a cross-cutting search and view model, users will still feel like the product is fragmented.

They need to answer questions such as:

- what needs attention today
- what vessel is out right now
- what is overdue
- where is this member, vessel, or asset in the system
- what should I do next

This area gives the product its operational entry points.

## Aggregate Root

`operational_view` -- a composed, filtered read model that presents attention-driven information from multiple domains, such as active trips, overdue work, or blocked vessels.

## Who Uses It

- club administrators getting a daily operational overview
- trip operators checking active and overdue trips
- vessel-responsible members seeing fleet status and blocked vessels
- any member searching for a vessel, trip, person, or asset

## Requires

- [calendar-and-scheduling.md](calendar-and-scheduling.md) -- time-based operational state as the primary data source

## Enhanced By

- Every domain -- search and operational views compose facts from trips, fleet, equipment, qualifications, tasks, and membership

## Scope

This area covers:

- global search later
- operational dashboards
- cross-domain filtered list views
- saved or remembered views later
- attention-driven entry points such as active, overdue, blocked, and due soon

This area does not own:

- the source-of-truth data behind search results
- trip state
- calendar scheduling rules
- domain-specific business rules

## Core Product Outcome

The product should make it easy to:

- search for a vessel, trip, member, asset, or harbor-related record later
- open a useful operational dashboard at the start of the day
- filter across time, status, vessel, responsible sailor, and readiness context
- jump from an operational view into the correct underlying workflow
- see what needs action without manually hunting through separate domains

## Search Versus Operational Views

These should be related but distinct.

### Search

Search helps the user find a known or partly known thing.

Examples:

- find a named vessel
- find a member
- find a trip by title or person involved
- find a specific asset by identifier or QR-linked identity later

### Operational Views

Operational views help the user answer “what needs attention now” even if they are not looking for one specific record.

Examples:

- active trips
- overdue returns
- blocked vessels
- overdue tasks and inspections
- readiness warnings
- recent incidents

The product should not force users to use search when what they really need is an attention view.

## Entry Point Model

The app should have a few clear operational entry points rather than many disconnected screens.

Useful entry points include:

- `Today`
  What is happening now or soon.
- `Active`
  Trips, work, and resources currently in play.
- `Needs Attention`
  Overdue, blocked, warning, or follow-up-needed items.
- `Fleet`
  Vessels and vessel-related operational context.
- `Trips`
  Planned, active, completed, and overdue trip views.
- `Assets`
  Shared gear, assigned assets, and asset attention later.
- `People`
  Members, qualifications, and eligibility views later.

These are entry points, not new domains.

## Relationship To Calendar

Calendar remains the main operational timeline.

Operational views should consume calendar facts such as:

- active items
- overdue items
- due-soon items
- scheduled windows
- conflicts

But they should present those facts in more task-oriented ways than a calendar grid alone.

Examples:

- an “Active trips” view
- a “Vessels blocked today” view
- a “This week’s inspections” view

## Relationship To Core Domains

Operational views should compose data from domains without taking ownership of their rules.

Examples:

- a vessel view may show fleet facts, active calendar items, readiness warnings, and recent trips
- a trip list may show trip state, vessel, responsible sailor, and incident flags
- a qualifications attention view may show members whose approvals are missing or expiring

The read model can be composed.
The underlying rules still belong to the original domains.

## Filter Model

Filters should reuse the same language the rest of the product already uses.

Useful filter dimensions include:

- date range
- calendar state
- activity category
- vessel class
- named vessel
- responsible sailor
- member
- qualification or approval state
- readiness state
- tenant

The filter model should not invent parallel terminology for the same facts.

## Saved And Repeated Views

Some users will return to the same view repeatedly.

Useful later capabilities include:

- default landing views by user role or habit
- saved filter sets
- remembered recent filters
- pinning a view such as “Active vessels” or “Overdue inspections”

This should reduce repeated setup without creating a separate dashboard-builder product.

## Search Model

Global or broad search later should support:

- trips
- vessels
- members
- assets
- harbors or route references later

Search results should remain typed enough that users understand what they are opening.

For example:

- trip result
- vessel result
- member result
- asset result

Search should help users jump into the right workflow, not just return a flat list of text matches.

## Attention States

Operational views should make attention states easy to understand at a glance.

Useful attention buckets include:

- active
- overdue
- due soon
- blocked
- warning
- follow-up needed

These states often come from several domains, but the product should present them in one coherent operational language.

## Mobile, Desktop, And Kiosk Considerations

This area needs to work differently by context without becoming a different product.

### Mobile

Should emphasize:

- current activity
- quick filters
- active trip access
- simple attention views

### Desktop

Should emphasize:

- denser list views
- broader filters
- cross-domain review
- admin and operational oversight

### Kiosk

Should emphasize:

- the most immediate operational actions
- today’s schedule
- active and overdue trips
- simple route into create/start/report-back flows

## Relationship To Permissions

Search and operational views should respect the same permission model as the rest of the app.

That means:

- a user should only see result types and details they are allowed to access
- attention dashboards must not leak sensitive records
- counts and previews may also need permission-aware redaction later

## Relationship To Reporting

Operational views are not the same as reporting.

- operational views answer “what needs my attention now”
- reporting answers “what happened over a period”

The product should keep those experiences separate even when they reuse some of the same filters and read models.

## Business Rules

- Search and operational views do not own domain rules; they compose domain facts.
- The calendar backbone should remain the main source of time-based operational attention.
- Operational views should make active, overdue, blocked, and due-soon items visible without deep navigation.
- Search results should stay typed and permission-aware.
- Saved views later should reuse the existing filter language instead of creating parallel concepts.
- Kiosk, mobile, and desktop may emphasize different views, but should still operate on the same underlying product model.
