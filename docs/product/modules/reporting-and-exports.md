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
- printable views
- dashboards and rollups
- scheduled report delivery later
- tenant-facing and platform-facing reporting boundaries
- report privacy and redaction rules

This module does not own:

- source-of-truth business data
- time-based state
- approval logic
- trip lifecycle
- editing or correcting operational records

## Core Reporting Jobs

This module should help the product answer several different kinds of questions.

### Operational Reporting

Used by owners, leaders, schedulers, and other club operators to run the club day to day.

Examples:

- what trips happened this week
- what boats are most used
- what work is overdue
- what readiness gaps are blocking upcoming activity
- which bookings overlap or create pressure on shared assets

### Administrative Reporting

Used to understand the club as an organization.

Examples:

- member participation
- qualification coverage
- active sailors by role or approval status
- asset utilization
- seasonal activity patterns

### Audit And Compliance Reporting

Used when the club needs evidence, traceability, or reviewable records.

Examples:

- who acted as responsible sailor
- what exceptions were granted
- when a vessel was active
- which inspection or readiness tasks were open at departure
- what incidents were recorded in a period

### Export-Oriented Reporting

Used when information needs to leave the app in a stable form.

Examples:

- CSV export for club administration
- PDF-style trip summary later
- calendar-aligned operational summary
- board or leader update pack

## Core Product Outcome

The product should make it easy to produce:

- trip history summaries
- vessel usage reports
- overdue operational-work reports
- qualification and approval overviews
- membership participation summaries
- data exports for club use
- auditable exception and approval summaries
- operational readiness and overdue-work summaries

## Relationship To Calendar

Calendar is the source of truth for time-based operations.

That means reporting should be able to use:

- trip timeline history
- maintenance and inspection activity
- overdue operational work
- blocked and used resources in time
- recurring task completion over time
- operational workload by category

## Relationship To Trips

Trips provide the richer record details behind the calendar timeline.

That means reporting may include:

- manifest counts
- responsible sailor usage
- incident counts
- route and story context where relevant
- departure and return timing
- trip-specific exceptions or blocked departures later

## Relationship To Fleet And Assets

Reporting should be able to combine operational timeline data with vessel and asset facts.

Examples:

- vessel utilization by class and named vessel
- engine or equipment service burden over time
- shared-asset booking pressure
- readiness blockers by vessel
- asset loss, lending, or missing-return patterns later

## Relationship To Qualifications And Memberships

Reporting should help clubs understand capability and participation without turning the reporting layer into a new approval system.

Examples:

- how many qualified sailors exist for a vessel class
- which approvals are expiring or missing
- which members are participating actively
- who has been acting as responsible sailor
- where exception flows are being used unusually often

## Report Shapes

The module should support several output shapes without forcing every report into the same form.

Useful shapes include:

- in-app dashboard summary
- filterable list report
- printable view
- CSV export
- later PDF-style output
- machine-readable export later

Some outputs are exploratory.
Some are operational.
Some are archival or shareable.

The product should keep those purposes distinct.

## Scheduled Delivery And Subscriptions

Some reports are pulled on demand.
Some are better delivered proactively.

Useful patterns later include:

- weekly overdue-work summary
- monthly vessel usage summary
- seasonal readiness report
- export package for a board meeting

If a report is delivered on a schedule, the calendar and notification model should still own the time-based trigger.
Reporting owns the generated output and its structure, not the reminder system itself.

## Privacy And Redaction

Reporting must not leak operational detail just because the source records exist.

The module should support different levels of detail such as:

- aggregate counts only
- operational detail without personal identifiers
- full internal detail for authorized users
- external-share summary with redacted fields

Examples of data that may need restriction or redaction include:

- guest identity
- member contact details
- incident detail
- exception rationale
- sensitive notes
- media references

This is especially important for:

- export files
- printable summaries
- reports shared outside the core operating team

## Tenant And Platform Boundaries

Most reporting is tenant-scoped.

That means a club should be able to report on:

- its own trips
- its own vessels
- its own members
- its own assets

Platform-level reporting is different.
It should be limited to explicitly allowed support, adoption, health, or aggregate platform views, not casual access to club operations.

## Filter And Comparison Model

Reports should be able to filter and compare by dimensions that match the rest of the product.

Useful report dimensions include:

- date range
- tenant
- vessel class
- named vessel
- asset category
- responsible sailor
- trip type later
- calendar category
- readiness state
- qualification or approval state

The filter model should reuse domain language already established elsewhere in the product.

## Relationship To Tenant Configuration

Different clubs will want different reporting depth.

Tenant settings may later control:

- which exports are enabled
- who may generate reports
- what detail is included in generated outputs
- whether some reports are limited to owners or leaders
- whether scheduled delivery is enabled
- which external-style export shapes are allowed

## Example Product Questions

This module should make it easy to answer questions such as:

- Which vessels were used most in the last month?
- How many trips completed without incident?
- Which upcoming trips are at risk because readiness tasks are overdue?
- Which shared assets are under the most booking pressure?
- How often are one-off sailing exceptions being used?
- Which members have been active as responsible sailor this season?
- What should be shared with leaders, board members, or external stakeholders without exposing sensitive detail?

## Business Rules

- Reports and exports must respect tenant boundaries.
- Reports should respect the same permission model as the rest of the app.
- Reporting should read from domain data; it should not redefine domain rules.
- Time-based reporting should use the calendar backbone as its operational timeline.
- Sensitive details should be suppressible in broader exports and summaries.
- Scheduled reporting should not become a separate reminder system.
- Platform-level reporting should stay explicitly scoped and auditable.
- Export shape should not silently include more personal detail than the in-app audience is allowed to see.
- Reporting should prefer existing product language and states over introducing parallel terminology.
