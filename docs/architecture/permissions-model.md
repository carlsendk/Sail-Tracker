# Permissions Model

This document defines the baseline authorization approach for Sail Tracker.

## Core Rule

Authorization is permission-based. Roles are bundles of permissions, not the primary source of truth.

## Principles

- Deny by default.
- Evaluate permissions in the context of the active tenant unless the action is platform-scoped.
- Keep permission names explicit and domain-oriented.
- Avoid hardcoding role checks deep in application code.

## Permission Layers

There are two authorization layers:

- platform permissions
- tenant permissions

Platform permissions apply to global administration.
Tenant permissions apply only within a specific club.

## Initial Roles

Initial baseline roles are:

- `platform_admin`
- `tenant_owner`

More roles will be added later as the product grows.

## Initial Permission Shape

Permission names should follow a clear convention such as:

- `platform.tenants.create`
- `platform.tenants.manage`
- `platform.admins.manage`
- `tenant.settings.manage`
- `tenant.members.manage`
- `tenant.roles.manage`
- `tenant.permissions.manage`

Feature permissions such as trip logging can be added later when product slices exist.

## Role Guidance

### Platform Admin

Can:

- create and manage tenants
- manage platform admins
- manage demo tenant lifecycle
- perform platform-level configuration tasks

Should not automatically bypass tenant-scoped rules in application code without an explicit policy and audit path.

### Tenant Owner

Can:

- manage tenant settings
- manage members
- assign tenant-level roles and permissions within allowed policy
- start configuring the tenant after creation

## Future Model Direction

The model should support:

- multiple owners per tenant
- additional tenant roles
- custom permission bundles
- future invitation and membership workflows

## Implementation Guidance

- Resolve permissions from authoritative membership data.
- Keep authorization decisions close to application use cases.
- Leave room for database-backed enforcement later.
- Keep permission evaluation testable without UI or framework context.

## Open Questions

- Whether platform admins can impersonate tenant owners for support.
- Whether tenant owners can create custom roles.
- Whether some permissions should be reserved and non-delegable.
