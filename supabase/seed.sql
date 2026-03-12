insert into public.permissions (scope, key, name)
values
  ('platform', 'platform.tenants.manage', 'Manage tenants'),
  ('platform', 'platform.admins.manage', 'Manage platform admins'),
  ('tenant', 'tenant.settings.manage', 'Manage tenant settings'),
  ('tenant', 'tenant.members.manage', 'Manage tenant members'),
  ('tenant', 'tenant.roles.manage', 'Manage tenant roles'),
  ('tenant', 'tenant.permissions.manage', 'Manage tenant permissions')
on conflict (key) do update
set
  scope = excluded.scope,
  name = excluded.name;

insert into public.roles (scope, key, name, is_system)
values
  ('platform', 'platform_admin', 'Platform Admin', true),
  ('tenant', 'tenant_owner', 'Tenant Owner', true)
on conflict (key) do update
set
  scope = excluded.scope,
  name = excluded.name,
  is_system = excluded.is_system;

insert into public.role_permissions (role_id, permission_id)
select roles.id, permissions.id
from public.roles
join public.permissions on (
  (roles.key = 'platform_admin' and permissions.key in ('platform.tenants.manage', 'platform.admins.manage')) or
  (roles.key = 'tenant_owner' and permissions.key in ('tenant.settings.manage', 'tenant.members.manage', 'tenant.roles.manage', 'tenant.permissions.manage'))
)
on conflict do nothing;

with tenant_rows as (
  insert into public.tenants (slug, name, status, default_locale)
  values
    ('club', 'Club', 'active', 'en'),
    ('demo', 'Demo Club', 'active', 'en')
  on conflict (slug) do update
  set
    name = excluded.name,
    status = excluded.status,
    default_locale = excluded.default_locale
  returning id, slug
)
insert into public.tenant_domains (tenant_id, hostname, is_primary, is_custom)
select tenant_rows.id, tenant_rows.slug || '.localhost', true, false
from tenant_rows
on conflict (hostname) do update
set
  tenant_id = excluded.tenant_id,
  is_primary = excluded.is_primary,
  is_custom = excluded.is_custom;
