# Domain Map For Sail Tracker

Use this file when the user is shaping the domain model for the sea scout and sailing club app.

## Ubiquitous Language

- `tenant`: one club, troop, or sailing organization operating as a data boundary.
- `member`: a person belonging to a tenant.
- `vessel`: a boat owned or managed by a tenant.
- `trip`: one sailing outing from preparation through return.
- `crew assignment`: a member attached to a trip with a role.
- `skipper`: the member accountable for vessel operation on a trip.
- `trip draft`: an unfinished trip that may still be edited.

## Candidate Aggregates

### Trip

Owns:

- vessel reference
- skipper reference
- crew assignments
- departure details
- return details
- completion status

Key invariants:

- Trip belongs to exactly one tenant.
- Trip cannot be completed before departure exists.
- Skipper must be a valid member of the same tenant.

### Vessel

Owns:

- vessel identity inside a tenant
- display name
- status
- optional capacity and classification

Key invariants:

- Vessel belongs to exactly one tenant.
- Inactive vessels cannot be assigned to new trips.

### Membership

Owns:

- member identity inside a tenant
- roles and permissions
- qualification status if modeled here

Key invariants:

- Permissions are tenant-scoped.
- A member may belong to multiple tenants, but each membership is distinct.

## Likely Domain Events

- `TripDraftCreated`
- `TripUpdated`
- `TripDeparted`
- `TripReturned`
- `VesselMarkedInactive`
- `MembershipRoleChanged`

## Separation Guidance

- Put reporting and exports in a read-model context.
- Keep auth provider concerns outside the core domain language.
- Model offline sync conflicts as application concerns unless they change domain rules.
