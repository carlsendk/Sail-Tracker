# Tenant Model

This document defines the baseline tenant model for Sail Tracker.

## Core Rule

Each club is a tenant with its own isolated data boundary.

## Tenant Identity

- Every tenant has a stable internal tenant ID.
- Every tenant has a primary subdomain.
- A tenant may later attach one or more custom domains.
- Routing must resolve the tenant before user-facing application behavior depends on tenant data.

## Initial Tenant Setup

The system should support at least two tenants from the start:

- one real club tenant
- one demo tenant with seed data

The demo tenant exists for:

- product demonstration
- onboarding and testing
- development and preview environments

## Tenant Ownership

- Creating a new tenant assigns the creator as the first tenant owner.
- A tenant can have more than one owner.
- Owners are tenant-scoped, not platform-scoped.
- Ownership changes must be auditable.

## Platform Layer

The system also has a platform layer above tenants.

- Platform admins manage the application at the top level.
- You are the first platform admin.
- The system must allow more platform admins later.
- Platform administration must be explicit and separate from tenant ownership.

## Membership Assumptions

Current default assumptions:

- A user account may later belong to multiple tenants.
- Membership is tenant-scoped.
- Permissions are evaluated in the context of the active tenant.
- Invitation and join flows will be designed later.

These assumptions are chosen because they preserve future flexibility without forcing the first UX now.

## Domain Routing

The routing model should support:

- `club-a.example.com`
- `demo.example.com`
- optional future custom domains such as `app.club-a.dk`

The routing layer should not assume that a tenant is always identified by a path segment.

## Tenant Lifecycle

Minimum lifecycle states to leave room for:

- draft
- active
- suspended
- archived

This does not require implementation now, but the model should not block it.

## Seed Strategy

Seed data should include:

- a real-club tenant placeholder configured for local development
- a demo tenant with realistic example data
- tenant-specific configuration values where needed

Seed scripts and data structures should keep tenant data separate even in development.

## Administrative Questions To Resolve Later

- Whether tenant creation is self-serve or platform-admin approved.
- Whether platform admins can access tenant data directly.
- Whether tenant suspension blocks login, read access, or only writes.
