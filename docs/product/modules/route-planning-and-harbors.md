# Route Planning And Harbors

## Purpose

This module defines how Sail Tracker can attach route intent, navigation context, and harbor references to a trip.

It should help clubs plan where they expect to go without turning every trip into a full charting workflow.

## Why This Is A Module

Route planning is useful in many trips, but it should not own:

- trip lifecycle
- calendar state
- incident ownership
- weather ownership
- vessel restrictions or qualification rules

Instead, it should enrich planning and trip records with location-aware context.

That makes this a supporting trip-enrichment module rather than a backbone area or core domain.

## Core Product Outcome

The product should make it easy to answer:

- where this trip intends to go
- what harbors or waypoints are relevant
- whether the route changed during the trip
- what navigation context belongs in the trip record
- how detailed planning should be for this tenant and this trip type

## Scope

This module covers:

- planned route description
- optional waypoints or route markers
- destination and harbor references
- map context linked from the trip
- route-related notes before and after the trip
- recorded route change or deviation context later

This module does not own:

- live navigation
- official marine charting
- trip departure or completion state
- incident workflows
- weather forecasting

## Core Concepts

- `route intent`
  The planned path, destination, or area the trip expects to cover.
- `waypoint`
  A meaningful planned point, stop, or marker in the trip context.
- `harbor reference`
  A known harbor, marina, or landing place associated with the trip.
- `route snapshot`
  The route context captured at a planning or completion moment.
- `route deviation`
  A meaningful change between the intended route and what actually happened.

## Lightweight By Default

This module should stay lightweight unless a club explicitly wants more structure.

A simple trip may only need:

- destination or area
- one short route note
- optional harbor reference

A richer club workflow may use:

- multiple waypoints
- route sketches or linked map context
- departure and return harbor references
- deviation notes at completion

The product should support both without making the minimum trip flow heavy.

## Relationship To Trip Workflow

Route context can enrich several parts of the trip lifecycle.

### Trip Planning

Before departure, the module may help capture:

- intended sailing area
- expected destination
- harbor or stop references
- route notes such as training focus or planned leg sequence

This helps the trip record be operationally clearer than a title alone.

### Departure

At departure time, route context may be reviewed as part of the trip summary.

The module may help answer:

- where are we going
- what harbor or return point are we expecting
- does the route still fit current weather and readiness context

But the route module should not secretly block departure on its own.
Any blocking rule belongs in the trip validation flow and should be explicit there.

### Active Trip

During the trip, route context may be useful as a reference only.

This module should not try to become a live navigation system.

Useful active-trip support later may include:

- quick view of intended route
- linked map or harbor context
- note that the route changed significantly

### Completion

At completion, the trip may record:

- actual destination reached
- route changed from plan
- harbor used unexpectedly
- notable navigation or return detail

This keeps the trip record useful without requiring a full track log.

## Harbor And Location References

Harbor references should be first-class enough to be useful across trips.

Useful examples include:

- home harbor
- destination harbor
- emergency or fallback harbor
- common training route landmarks later

The product should support:

- quick reference selection
- tenant-relevant favorites later
- external links to richer harbor information later

This is where integration with OpenSeaMap-style context can fit without making Sail Tracker own the full map dataset.

## Map And External Context

The module should be able to link out to richer map context when useful.

Examples:

- OpenSeaMap
- harbor pages
- route visualization later

These links enrich the trip workflow, but Sail Tracker should not pretend to replace specialized navigation tools.

## Relationship To Calendar

Calendar owns the scheduled trip window and operational timeline.

This module should use that context to enrich the scheduled trip, not create a second planning timeline.

Calendar answers:

- when the trip is happening
- what vessel is allocated
- whether the trip is active, overdue, or complete

Route planning answers:

- where the trip intends to go
- what waypoints or harbors matter
- how the route changed from plan if relevant

## Relationship To Weather

Route and weather are closely connected but should remain distinct.

- weather provides condition context
- route provides intended path and destination context

Together they help with planning, but they should not collapse into one module.

## Relationship To Incidents

If something goes wrong, the incident module may need route context.

Examples:

- where the vessel was heading
- what harbor was intended
- where a route deviation happened

Incidents own the event and follow-up.
Route planning only provides context.

## Relationship To Reporting

Route information may later appear in:

- trip summaries
- seasonal destination patterns
- route popularity or training-area usage later
- incident review context

Reports should be careful not to imply navigational precision if the data is intentionally lightweight.

## Tenant Configuration

Tenant settings may later control:

- whether route fields are visible in trip planning
- whether destination or harbor is required
- whether waypoints are allowed or required
- whether route deviation capture is shown at completion
- whether external map links are enabled

## Business Rules

- Route planning enriches trips; it does not own trip state.
- Route intent and actual route outcome should remain distinguishable.
- The minimum trip flow should not require complex route entry.
- Route context should support harbor references without becoming a full harbor-management domain.
- External map context may be linked, but Sail Tracker should not depend on being a full navigation tool.
- Any departure blocking tied to route must be expressed through trip validation, not hidden inside this module.
