# Dashboard And Home

## Purpose

This document defines the primary landing experience of Sail Tracker.

It exists to answer one practical question:

- when a user opens the app, what should they understand and be able to do immediately

The dashboard and home experience should turn the product’s domains into an operational starting point, not just a navigation menu.

## Why This Area Matters

A strong domain model is still not enough if the first screen does not help the user orient quickly.

Users often open the app because they need to know:

- what is happening now
- what needs attention today
- whether something is blocked or overdue
- which trip, vessel, or task they should open next

The home experience must make those answers visible without forcing users to search first.

## Scope

This area covers:

- the primary app landing page
- default operational summaries
- quick actions into the main workflows
- recent and active activity summaries
- role- and context-sensitive home emphasis

This area does not own:

- the source-of-truth data shown on the home page
- trip lifecycle rules
- calendar scheduling rules
- fleet rules
- qualification decisions
- notification delivery

This is a composed product area.

## Core Product Outcome

The product should open into a view that helps users:

- understand the operational state of the club right now
- take the most likely next action quickly
- move into the right workflow with minimal friction
- spot risk, delay, or missing follow-up early

## Product Position

Dashboard and home are not separate domains.

They are a cross-cutting read and action surface built from:

- calendar-backed operational state
- trip context
- fleet and readiness context
- tasks and inspections
- notifications and reminders
- tenant-specific emphasis

The home experience should compose those facts without taking ownership of their rules.

## Home Versus Search

Home and search solve different problems.

### Home

Helps the user understand:

- what matters now
- what is active
- what is due soon
- what is overdue
- what action is most likely next

### Search

Helps the user find a known or partly known thing.

The product should not force search when what the user really needs is orientation.

## Relationship To Calendar

Calendar is the backbone of the home experience.

The dashboard should be built primarily from calendar-backed facts such as:

- today’s scheduled activity
- active trips
- overdue returns
- due-soon inspections
- blocked vessels
- readiness-related warnings

The home page is not a replacement for calendar views.
It is an operational summary and launch surface derived from them.

## Home Composition

The home experience should combine a few stable sections rather than an uncontrolled collection of widgets.

Useful sections include:

- operational summary
- active and overdue items
- quick actions
- recent activity
- weather awareness
- fleet and readiness attention
- follow-up and reminder summary

The exact layout can vary by device and tenant, but the conceptual structure should stay stable.

## Operational Summary

The top of the home experience should answer “what is the club state right now?”

Useful summary metrics include:

- active trips
- overdue trips
- vessels available now
- vessels blocked now
- due-soon or overdue operational work
- readiness warnings that affect planned departures

These should be operational facts, not vanity statistics.

## Quick Actions

Home should make the most common operational actions obvious.

Examples:

- create or plan a trip
- start a planned trip now
- report back an active trip
- open today’s schedule
- open active vessels
- open work that needs attention

Quick actions should launch existing workflows.
They should not create a parallel “shortcut-only” behavior model.

## Recent And Current Activity

The home experience should show enough recent and active context to help users resume work.

Useful examples:

- trips that are currently active
- recent departures and returns
- recent incidents or follow-up flags
- recently completed or overdue inspections
- recent asset or vessel attention items

This should make the product feel alive without turning the home page into a raw activity log.

## Weather Awareness

Weather belongs on the home experience as operational context, not as the main purpose of the page.

Useful weather presentation includes:

- current or near-term summary
- warning-oriented conditions
- conditions that matter for planned or active trips

The home page should surface weather to support decision-making, then link into deeper trip or weather context where needed.

## Home By Device Context

The home experience should emphasize different things by context without becoming different products.

### Mobile

Should emphasize:

- active trip access
- depart and report-back flows
- today and needs-attention summaries
- compact weather and warning context

### Desktop

Should emphasize:

- broader operational overview
- denser list sections
- cross-domain attention review
- admin and coordination actions

### Kiosk

Should emphasize:

- today’s schedule
- active and overdue trips
- fast start and report-back flows
- minimal-friction operational entry

## Home By User Situation

The home experience should also adapt by operational relationship.

Examples:

- a tenant owner may see broader attention and setup warnings
- a responsible sailor may see active and upcoming trip focus
- a vessel-responsible member may see readiness and maintenance attention
- a shared kiosk may show high-priority operational actions only

This should be done through emphasis and visibility, not by creating unrelated home pages per role.

## Relationship To Notifications And Reminders

Home is not a notification inbox.

However, it should surface the most important reminder-driven operational facts, such as:

- overdue return
- due-soon work
- unresolved follow-up
- blocked or warning state that needs action

Notification delivery and reminder timing still belong to their own area.

## Relationship To Reporting

Home should remain operational.

It may include small summary numbers, but it should not become a reporting dashboard focused on historical analytics.

The main difference is:

- home answers “what matters now”
- reporting answers “what happened over time”

## Tenant Configuration

Tenants may reasonably configure:

- which summary sections are emphasized
- which quick actions appear
- whether some supporting modules appear on home
- whether demo or training contexts use a different default emphasis

Tenants should not redefine the core meaning of operational states through home customization.

## Business Rules

- The home experience is a composed operational surface, not a new source of truth.
- Calendar-backed operational state should drive the most important home sections.
- Quick actions should launch existing workflows, not create separate logic paths.
- Home should prioritize active, overdue, blocked, and due-soon facts over vanity metrics.
- Device context may change emphasis, but the underlying product model should stay the same.
- Home should remain distinct from search, reporting, and notification delivery.

## Product Outcome

When users open Sail Tracker, they should immediately understand:

- what is happening now
- what needs attention
- what they are likely to do next

If the home experience does not provide that, the system will still feel fragmented even when the underlying domains are modeled well.
