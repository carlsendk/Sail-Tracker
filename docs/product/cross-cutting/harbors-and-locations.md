# Harbors And Locations

## Purpose

This document defines harbor and location reference data in Sail Tracker.

It exists to answer one practical question:

- when another part of the product needs a named real-world location, where does that come from

Harbors and locations are standalone reference data consumed by weather, route planning, and trip workflows, but owned by none of them.

## Why This Area Matters

Several parts of the product need to reason about real-world locations:

- weather needs a coordinate or named place to fetch a forecast
- route planning needs waypoints and destination harbors
- trip planning needs departure and destination context
- vessels may be associated with a home harbor

Without a shared reference, the same harbor gets entered multiple times, coordinates diverge, and location data becomes inconsistent across the product.

## Scope

This area covers:

- harbor registry with identity, contact, and facility data
- geographic coordinates for each harbor
- location picker UI used across the product
- map-based coordinate selection
- free-text location search backed by OpenStreetMap Nominatim
- manual coordinate entry
- active and inactive harbor management

This area does not own:

- weather forecasts or weather data
- route planning logic
- trip lifecycle or trip planning rules
- vessel scheduling or availability
- any domain that consumes location data

It provides the reference layer that those areas depend on.

## Requires

Harbors and locations have no hard domain dependencies.

This area can be set up independently of trips, weather, and routing. It only requires a working tenant context.

## Enhanced By

- [../modules/weather-in-trip-context.md](../modules/weather-in-trip-context.md) — uses harbor coordinates as the default location for weather lookups
- [../modules/route-planning-and-harbors.md](../modules/route-planning-and-harbors.md) — uses harbors as waypoints and route endpoints
- [../domains/trips/trip-planning-and-lifecycle.md](../domains/trips/trip-planning-and-lifecycle.md) — uses harbors as departure and destination context
- [../domains/fleet/vessel-registry.md](../domains/fleet/vessel-registry.md) — may associate a vessel with a home harbor
- [../platform/tenant-settings.md](../platform/tenant-settings.md) — may configure the default location shown to all users

## Key Concepts

- `harbor`
  A named real-world location managed by the tenant. Has coordinates and optional facility and contact information.
- `location picker`
  The shared UI component used throughout the product to select a geographic location. Supports multiple input methods.
- `facility`
  A tagged capability at a harbor, such as electricity, water, showers, toilets, fuel, or restaurant.
- `default location`
  The coordinates shown when no location has been selected yet. Defaults to Skovshoved Harbor (55.7501, 12.5917).
- `map center default`
  The map view center when no location is active. Defaults to Denmark center (56.2639, 9.5018).

## Harbor Data Model

Each harbor record includes:

- `name` — required, the harbor's display name
- `address` — optional postal address
- `phone` — optional contact number
- `email` — optional contact email
- `website` — optional URL
- `description` — optional free-text notes
- `latitude` and `longitude` — geographic coordinates
- `facilities` — comma-separated tags from a fixed set: electricity, water, showers, toilets, fuel, restaurant
- `is_active` — controls whether the harbor appears in pickers and dropdowns

Harbors may be deactivated rather than deleted when they are no longer operationally relevant.

## Location Picker

The location picker is a shared UI component used wherever a geographic location must be selected.

It supports four input methods:

1. Harbor dropdown — select a named harbor from the tenant's active harbor list
2. Free-text search — search for any place using OpenStreetMap Nominatim with debounced input
3. Manual coordinates — enter latitude and longitude directly
4. Map picker — click a point on an interactive map to place a marker and capture coordinates

The map uses Leaflet.js with OpenStreetMap tiles.

Only one input method needs to be used at a time. All methods resolve to a coordinate pair that the consuming area stores or uses as needed.

## API Behavior

The harbor list endpoint supports:

- free-text search by name
- pagination
- filtering by `is_active`

Consumers should filter to active harbors by default and only expose inactive records in administrative contexts.

## Business Rules

- Harbor name is required. All other fields are optional.
- Latitude and longitude must both be present or both be absent. Partial coordinates are not valid.
- Facilities must come from the defined set. Free-form facility text is not supported.
- Inactive harbors must not appear in location pickers, weather selectors, or route planning dropdowns.
- The location picker always resolves to a coordinate pair regardless of which input method was used.
- Free-text location search uses OpenStreetMap Nominatim and must apply input debounce to limit request volume.
- The map picker defaults to Denmark center when no location is pre-selected.
- The weather location selector defaults to Skovshoved Harbor when no other default has been configured.
- Harbors are tenant-scoped. One tenant's harbor list is not visible to another tenant.
- Deleting a harbor that is referenced by existing trips or routes should be blocked or handled through deactivation.

## Cross-References

- [../modules/weather-in-trip-context.md](../modules/weather-in-trip-context.md)
- [../modules/route-planning-and-harbors.md](../modules/route-planning-and-harbors.md)
- [../domains/trips/trip-planning-and-lifecycle.md](../domains/trips/trip-planning-and-lifecycle.md)
- [../platform/tenant-settings.md](../platform/tenant-settings.md)
- [../domains/fleet/vessel-registry.md](../domains/fleet/vessel-registry.md)
