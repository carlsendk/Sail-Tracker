# Sail Trip Slice Template

Use this template when turning a product request into a buildable slice for the sailing club app.

## Template

### Feature statement

`As a <actor>, I want <outcome>, so that <value>.`

### Actors

- Primary actor:
- Secondary actors:

### Rules

- Tenant data stays isolated.
- Every trip belongs to exactly one vessel and one tenant.
- The skipper must be a tenant member with permission to log trips.
- A trip is not complete until departure time and return time are both known.

### Scenarios

#### Happy path

Given a logged-in skipper in a tenant
When they create a new trip for a vessel and enter departure details
Then the trip is saved as a draft for that tenant

#### Permission path

Given a logged-in member without skipper permission
When they attempt to create a trip
Then the system denies the action and explains why

#### Validation path

Given a skipper creating a trip
When required trip details are missing
Then the system keeps the draft and marks the missing fields

### Slices

1. Create and save trip draft for one tenant.
2. Validate required fields and show actionable errors.
3. Enforce role-based permission to create or edit trips.
4. Finalize trip with return details and lock completion rules.
5. Support offline draft capture and later sync.

### Suggested tests

- Acceptance: skipper can create a trip draft in their own tenant.
- Acceptance: member from another tenant cannot view or edit the trip.
- Domain: trip cannot be completed without required timestamps.
- Application: unauthorized actor cannot execute `CreateTrip`.
