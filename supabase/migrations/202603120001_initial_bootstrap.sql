create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status text not null default 'active',
  default_locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenants_status_check check (status in ('active', 'suspended', 'archived'))
);

create table if not exists public.tenant_domains (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  hostname text not null unique,
  is_primary boolean not null default false,
  is_custom boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  display_name text,
  preferred_locale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_id),
  constraint memberships_status_check check (status in ('active', 'inactive', 'invited'))
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  key text not null unique,
  name text not null,
  is_system boolean not null default true,
  constraint roles_scope_check check (scope in ('platform', 'tenant'))
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  key text not null unique,
  name text not null,
  constraint permissions_scope_check check (scope in ('platform', 'tenant'))
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.membership_roles (
  membership_id uuid not null references public.memberships(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  primary key (membership_id, role_id)
);

create table if not exists public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  primary key (profile_id, role_id)
);

create index if not exists tenant_domains_tenant_id_idx on public.tenant_domains(tenant_id);
create index if not exists memberships_tenant_id_idx on public.memberships(tenant_id);
create index if not exists memberships_profile_id_idx on public.memberships(profile_id);
