# Product Modules

These documents define supporting modules that enrich the backbone and core product areas.

They are not the same thing as:

- backbone areas
- core domains
- operating modes
- platform/admin areas

They should plug into:

- [`calendar-and-scheduling.md`](../backbone/calendar-and-scheduling.md)
- [`trip-planning-and-lifecycle.md`](../domains/trips/trip-planning-and-lifecycle.md)
- [`system-composition.md`](../system-composition.md)

## Module Versus Sub-Module

Not every supporting capability needs to be a top-level domain.

Use these rules:

- `supporting module`
  An optional product capability with its own business question, clear boundaries, and configurable presence in the product.
- `sub-module`
  A narrower capability that clearly lives inside one supporting module or one core domain family.

Examples:

- weather in trip context is a trip-enrichment sub-module
- route planning and harbors is a trip-enrichment sub-module
- reporting and exports is a broader supporting module because it spans trips, calendar activity, assets, and tenant operations

The goal is to avoid both:

- too many top-level domains
- one giant "miscellaneous modules" bucket

## Current Supporting Modules

- [`reporting-and-exports.md`](./reporting-and-exports.md)

## Current Trip-Enrichment Sub-Modules

- [`weather-in-trip-context.md`](./weather-in-trip-context.md)
- [`route-planning-and-harbors.md`](./route-planning-and-harbors.md)
- [`incidents.md`](./incidents.md)
- [`media-gallery.md`](./media-gallery.md)
- [`trip-story.md`](./trip-story.md)
