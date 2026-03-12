#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filename) {
  const filepath = resolve(process.cwd(), filename);
  if (!existsSync(filepath)) {
    return;
  }

  const contents = readFileSync(filepath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "PLATFORM_ADMIN_EMAIL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const platformAdminEmail = process.env.PLATFORM_ADMIN_EMAIL;
const bootstrapDisplayName = process.env.SUPABASE_BOOTSTRAP_DISPLAY_NAME || "Platform Admin";

const tenantSlugs = [
  process.env.NEXT_PUBLIC_REAL_TENANT_SLUG || "club",
  process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG || "demo",
];

const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";

function isPrivilegedSupabaseKey(value) {
  return Boolean(value && value.startsWith("sb_secret_"));
}

if (!isPrivilegedSupabaseKey(secretKey)) {
  console.error(
    "SUPABASE_SECRET_KEY must be a Supabase secret key in the form sb_secret_....",
  );
  process.exit(1);
}

function createUrl(pathname, searchParams = {}) {
  const url = new URL(pathname, supabaseUrl);
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }
  return url;
}

async function supabaseFetch(pathname, { method = "GET", searchParams, body, headers } = {}) {
  const response = await fetch(createUrl(pathname, searchParams), {
    method,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${method} ${pathname} failed: ${response.status} ${text}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function fetchSingle(pathname, searchParams) {
  const rows = await supabaseFetch(pathname, { searchParams });
  return rows[0] || null;
}

async function ensureProfile() {
  await supabaseFetch("/rest/v1/profiles", {
    method: "POST",
    searchParams: {
      on_conflict: "email",
    },
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: [
      {
        email: platformAdminEmail,
        display_name: bootstrapDisplayName,
      },
    ],
  });

  const profile = await fetchSingle("/rest/v1/profiles", {
    select: "id,email,display_name",
    email: `eq.${platformAdminEmail}`,
    limit: "1",
  });

  if (!profile) {
    throw new Error("Failed to resolve bootstrap profile");
  }

  return profile;
}

async function ensureMembership(profileId, tenantId) {
  await supabaseFetch("/rest/v1/memberships", {
    method: "POST",
    searchParams: {
      on_conflict: "tenant_id,profile_id",
    },
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: [
      {
        tenant_id: tenantId,
        profile_id: profileId,
        status: "active",
      },
    ],
  });

  const membership = await fetchSingle("/rest/v1/memberships", {
    select: "id,tenant_id,profile_id",
    tenant_id: `eq.${tenantId}`,
    profile_id: `eq.${profileId}`,
    limit: "1",
  });

  if (!membership) {
    throw new Error(`Failed to resolve membership for tenant ${tenantId}`);
  }

  return membership;
}

async function fetchRole(key) {
  const role = await fetchSingle("/rest/v1/roles", {
    select: "id,key",
    key: `eq.${key}`,
    limit: "1",
  });

  if (!role) {
    throw new Error(`Missing role: ${key}`);
  }

  return role;
}

async function fetchTenant(slug) {
  const tenant = await fetchSingle("/rest/v1/tenants", {
    select: "id,slug,name",
    slug: `eq.${slug}`,
    limit: "1",
  });

  if (!tenant) {
    throw new Error(`Missing tenant: ${slug}`);
  }

  return tenant;
}

async function assignProfileRole(profileId, roleId) {
  await supabaseFetch("/rest/v1/profile_roles", {
    method: "POST",
    headers: {
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: [
      {
        profile_id: profileId,
        role_id: roleId,
      },
    ],
  });
}

async function assignMembershipRole(membershipId, roleId) {
  await supabaseFetch("/rest/v1/membership_roles", {
    method: "POST",
    headers: {
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: [
      {
        membership_id: membershipId,
        role_id: roleId,
      },
    ],
  });
}

async function main() {
  const profile = await ensureProfile();
  const platformAdminRole = await fetchRole("platform_admin");
  const tenantOwnerRole = await fetchRole("tenant_owner");

  await assignProfileRole(profile.id, platformAdminRole.id);

  const membershipSummaries = [];

  for (const slug of tenantSlugs) {
    const tenant = await fetchTenant(slug);
    const membership = await ensureMembership(profile.id, tenant.id);
    await assignMembershipRole(membership.id, tenantOwnerRole.id);

    membershipSummaries.push({
      tenant: tenant.slug,
      hostname: `${tenant.slug}.${rootDomain}`,
      membershipId: membership.id,
    });
  }

  console.log("Supabase bootstrap complete");
  console.log(
    JSON.stringify(
      {
        platformAdminEmail,
        profileId: profile.id,
        tenants: membershipSummaries,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
