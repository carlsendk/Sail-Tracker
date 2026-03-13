# Reporting And Exports

## Area Purpose

This module defines how Sail Tracker turns operational data into usable reports, exports, summaries, and compliance-style outputs.

It should help clubs answer questions such as:

- what happened this month
- which vessels were used most
- what trips were completed
- what work is overdue
- what qualifications or approvals are missing
- what should be shared with leaders, boards, or external stakeholders

## Why This Is A Module

Reporting is not the backbone of the app.
It should not own trips, calendar state, fleet, or qualifications.

But it is broader than a narrow trip-only sub-module because it draws from several areas:

- calendar
- trips
- fleet
- equipment and assets
- qualifications
- memberships

That makes it a supporting module rather than a core domain.

## Scope

This module covers:

- operational summaries
- tenant reports
- exports
- printable views later
- dashboards and rollups later

This module does not own:

- source-of-truth business data
- time-based state
- approval logic
- trip lifecycle

## Core Product Outcome

The product should make it easy to produce:

- trip history summaries
- vessel usage reports
- overdue operational-work reports
- qualification and approval overviews
- membership participation summaries
- data exports for club use

## Relationship To Calendar

Calendar is the source of truth for time-based operations.

That means reporting should be able to use:

- trip timeline history
- maintenance and inspection activity
- overdue operational work
- blocked and used resources in time

## Relationship To Trips

Trips provide the richer record details behind the calendar timeline.

That means reporting may include:

- manifest counts
- responsible sailor usage
- incident counts
- route and story context where relevant

## Relationship To Tenant Configuration

Different clubs will want different reporting depth.

Tenant settings may later control:

- which exports are enabled
- who may generate reports
- what detail is included in generated outputs
- whether some reports are limited to owners or leaders

## Business Rules

- Reports and exports must respect tenant boundaries.
- Reports should respect the same permission model as the rest of the app.
- Reporting should read from domain data; it should not redefine domain rules.
- Time-based reporting should use the calendar backbone as its operational timeline.
- Sensitive details should be suppressible in broader exports and summaries.
