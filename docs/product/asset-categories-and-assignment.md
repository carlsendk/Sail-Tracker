# Asset Categories And Assignment

## Purpose

This document defines how assets should be categorized and how they should be assigned within Sail Tracker.

It is a detail document for [`equipment-and-assets.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/equipment-and-assets.md).

The goal is to keep the asset model simple enough for daily club use, while still supporting:

- vessel-mounted components
- shared club gear
- lendable items
- bookable resources
- safety-critical tracked equipment

## Core Principle

An `asset category` defines what kind of thing something is.

An `asset item` is the actual tracked thing the club has.

An `assignment` defines where that item belongs right now.

Time-bound use, blocking, and work still belong to the calendar backbone.

## Asset Category Model

Categories should help clubs organize assets without forcing every club into a large technical hierarchy.

Useful category families include:

- `vessel component`
  Engines, batteries, charging systems, radios, navigation electronics.
- `safety equipment`
  Lifejackets, flares, first-aid kits, throw lines, fire extinguishers.
- `operational gear`
  Paddles, pumps, anchors, covers, trailers, tools.
- `shared club gear`
  Tents, cooking gear, event kits, shared radios.
- `bookable facility or resource`
  Clubhouse, room, workshop space, storage area.

Tenants should be able to:

- use a sensible default catalog
- add local categories
- rename or hide categories that do not fit their club

## Asset Item Model

Each tracked asset item should be able to carry:

- name
- category
- tenant
- identifier or serial number where useful
- QR label or scannable identity where useful
- notes
- photos
- storage or placement notes
- service-relevant details where useful
- current assignment
- current lifecycle state

Not every asset needs full technical detail.
The model should allow lightweight items and richer tracked components to coexist.

## Asset Lifecycle State

Assets should have simple non-time-based states such as:

- `active`
- `inactive`
- `retired`
- `lost`
- `out_of_service`

These are static facts about the asset.

They are different from:

- being booked in a time window
- being on a maintenance slot this week
- being due for inspection tomorrow

Those are calendar-backed facts.

## Assignment Model

An asset should always have one current assignment mode, even if the assigned target is empty.

Useful assignment modes are:

- `assigned to vessel`
- `assigned to location`
- `shared pool`
- `temporary trip assignment`
- `retired or unassigned`

This makes it easy to answer:

- what is currently on this boat
- what is sitting in shared storage
- what can be borrowed
- what has been temporarily taken for a trip

## Assignment Targets

The model should support assignment to:

- a specific vessel
- a physical location later, such as clubhouse or storage area
- a shared tenant pool
- a specific trip for temporary operational use

Examples:

- an outboard engine assigned to one vessel
- a handheld radio in the shared pool
- a tent assigned to clubhouse storage
- a first-aid bag temporarily assigned to a weekend trip

## Permanent Versus Temporary Assignment

The system should distinguish:

- `default assignment`
  Where the item normally belongs
- `temporary operational assignment`
  Where the item is being used for a limited period

This matters because clubs often want to know both:

- what should normally be on the boat
- what was actually taken on this trip

The default assignment belongs in the asset domain.
The temporary operational assignment should be linked to the trip or calendar item.

## Physical Location Detail

Assignment answers where an item belongs at a system level.
Sometimes clubs also need a lighter physical placement hint.

Examples:

- shelf 3 in the clubhouse shed
- port locker on vessel
- engine rack in workshop
- safety bin near slipway

This should be optional but useful, especially for shared gear and safety items.

## Asset Lookup And Scanning

The system should support quick asset lookup from the physical world.

Useful patterns include:

- scanning a QR code on an item
- opening the asset record from a printed label
- showing the asset photo for confirmation
- showing where the item normally belongs

This helps with:

- inspections
- lending and return
- seasonal setup
- finding missing equipment
- confirming the right item before maintenance or booking

## Vessel Assignment Rules

Assets assigned to a vessel should support rules such as:

- some components are expected to stay with the vessel
- some safety items are required for readiness
- some components may be swappable between vessels

Examples:

- a fixed battery bank should normally stay with one vessel
- a removable outboard may move between vessels
- a handheld radio may be shared across the tenant
- a trailer may be associated with one vessel but still tracked separately

## Shared Pool Rules

Shared-pool assets should remain easy to use.

The point is not to force warehouse software onto a scout club.

Useful behavior is:

- visible current availability
- clear current holder or temporary assignment where relevant
- simple return expectations
- optional calendar blocking for bookable or scarce items

## Booking Versus Assignment

Assignment is not the same as booking.

- `assignment`
  Where an asset belongs by default or is currently attached.
- `booking`
  A time-bound reservation or use of that asset.

Examples:

- a clubhouse is normally assigned to a location, but booked in the calendar
- a tent is normally in the shared pool, but temporarily assigned to a trip
- an engine is assigned to a vessel, while its service slot is booked in the calendar

## Relationship To Calendar

Calendar should consume the asset model for time-bound work and visibility.

That includes:

- bookings
- inspection slots
- service slots
- seasonal work
- due and overdue operational attention

Asset ownership and assignment should not be redefined in the calendar.

## Relationship To Fleet

Fleet should know what vessel exists and what that vessel requires.

The asset model should know:

- what components are assigned to that vessel
- what safety equipment is assigned to that vessel
- what swappable items may temporarily move onto or off that vessel

This keeps vessel facts and asset facts separate but connected.

## Business Rules

- Every asset belongs to exactly one tenant.
- Every asset item should have one category.
- Every asset item should have one current assignment mode.
- Assets may move between vessels, locations, shared pools, and trips without changing their identity.
- Static assignment should not be confused with time-bound booking.
- Calendar-backed bookings and work should not become the source of truth for static assignment.
- Tenants should be able to extend the category catalog without breaking the shared model.

## Product Outcome

The product should make it easy to answer:

- what kinds of assets do we manage
- what actual items do we have
- where does each item belong by default
- what is currently assigned to this vessel
- what is in the shared pool
- what is temporarily out on a trip
- what is this scanned item
- where should this item be returned
