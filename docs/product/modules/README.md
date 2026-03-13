# Product Modules

These documents define supporting modules that enrich the backbone and core product areas.

They are not the same thing as:

- backbone areas
- core domains
- operating modes
- platform/admin areas

They should plug into:

- [`calendar-and-scheduling.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/calendar-and-scheduling.md)
- [`trip-logging-and-logbook.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-logging-and-logbook.md)
- [`identity-access-and-configuration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/identity-access-and-configuration.md)
- [`system-composition.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/system-composition.md)

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

- [`reporting-and-exports.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/reporting-and-exports.md)

## Current Trip-Enrichment Sub-Modules

- [`weather-in-trip-context.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/weather-in-trip-context.md)
- [`route-planning-and-harbors.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/route-planning-and-harbors.md)
- [`incidents.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/incidents.md)
- [`media-gallery.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/media-gallery.md)
- [`trip-story.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/modules/trip-story.md)
