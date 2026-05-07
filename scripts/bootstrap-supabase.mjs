#!/usr/bin/env node
/** @file CLI script to bootstrap the Supabase database with the platform admin and tenants. */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Reads an .env file and merges its values into process.env (without overwriting existing keys).
 * @param {string} filename - Relative path to the env file to load.
 */
function loadEnvironmentFile(filename) {
  const filepath = resolve(process.cwd(), filename);
  if (!existsSync(filepath)) {
    return;
  }

  const contents = readFileSync(filepath, "utf8");
  for (const line of contents.split(/\r?\n/u)) {
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
    const value = rawValue.replaceAll(/^["']|["']$/gu, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvironmentFile(".env.local");
loadEnvironmentFile(".env");

const requiredEnvironment = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "PLATFORM_ADMIN_EMAIL",
];

for (const key of requiredEnvironment) {
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

/**
 * Returns true if the given value looks like a privileged Supabase secret key.
 * @param {string | undefined} value - The key to test.
 * @returns {boolean} True if the value begins with "sb_secret_".
 */
function isPrivilegedSupabaseKey(value) {
  return Boolean(value && value.startsWith("sb_secret_"));
}

if (!isPrivilegedSupabaseKey(secretKey)) {
  console.error(
    "SUPABASE_SECRET_KEY must be a Supabase secret key in the form sb_secret_....",
  );
  process.exit(1);
}

/**
 * Assigns a role to a membership record (idempotent).
 * @param {string} membershipId - The membership record ID.
 * @param {string} roleId - The role record ID to assign.
 */
async function assignMembershipRole(membershipId, roleId) {
  await supabaseFetch("/rest/v1/membership_roles", {
    body: [
      {
        membership_id: membershipId,
        role_id: roleId,
      },
    ],
    headers: {
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    method: "POST",
  });
}

/**
 * Assigns a global role to a profile record (idempotent).
 * @param {string} profileId - The profile record ID.
 * @param {string} roleId - The role record ID to assign.
 */
async function assignProfileRole(profileId, roleId) {
  await supabaseFetch("/rest/v1/profile_roles", {
    body: [
      {
        profile_id: profileId,
        role_id: roleId,
      },
    ],
    headers: {
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    method: "POST",
  });
}

/**
 * Builds a URL for the Supabase REST API from a path and optional query parameters.
 * @param {string} pathname - The API endpoint path.
 * @param {Record<string, string>} searchParameters - Optional query parameters to append.
 * @returns {URL} The constructed URL.
 */
function createUrl(pathname, searchParameters = {}) {
  const url = new URL(pathname, supabaseUrl);
  for (const [key, value] of Object.entries(searchParameters)) {
    url.searchParams.set(key, value);
  }
  return url;
}

/**
 * Creates or upserts a membership record for the given profile and tenant.
 * @param {string} profileId - The profile ID to create a membership for.
 * @param {string} tenantId - The tenant ID to link to.
 * @returns {Promise<object>} The resolved membership record.
 */
async function ensureMembership(profileId, tenantId) {
  await supabaseFetch("/rest/v1/memberships", {
    body: [
      {
        profile_id: profileId,
        status: "active",
        tenant_id: tenantId,
      },
    ],
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    method: "POST",
    searchParams: {
      on_conflict: "tenant_id,profile_id",
    },
  });

  const membership = await fetchSingle("/rest/v1/memberships", {
    limit: "1",
    profile_id: `eq.${profileId}`,
    select: "id,tenant_id,profile_id",
    tenant_id: `eq.${tenantId}`,
  });

  if (!membership) {
    throw new Error(`Failed to resolve membership for tenant ${tenantId}`);
  }

  return membership;
}

/**
 * Creates or upserts the platform admin profile record in Supabase.
 * @returns {Promise<object>} The resolved profile record.
 */
async function ensureProfile() {
  await supabaseFetch("/rest/v1/profiles", {
    body: [
      {
        display_name: bootstrapDisplayName,
        email: platformAdminEmail,
      },
    ],
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    method: "POST",
    searchParams: {
      on_conflict: "email",
    },
  });

  const profile = await fetchSingle("/rest/v1/profiles", {
    email: `eq.${platformAdminEmail}`,
    limit: "1",
    select: "id,email,display_name",
  });

  if (!profile) {
    throw new Error("Failed to resolve bootstrap profile");
  }

  return profile;
}

/**
 * Fetches a role record by its key slug.
 * @param {string} key - The role key to look up (e.g. "platform_admin").
 * @returns {Promise<object>} The role record.
 */
async function fetchRole(key) {
  const role = await fetchSingle("/rest/v1/roles", {
    key: `eq.${key}`,
    limit: "1",
    select: "id,key",
  });

  if (!role) {
    throw new Error(`Missing role: ${key}`);
  }

  return role;
}

/**
 * Fetches the first row from a Supabase REST endpoint.
 * @param {string} pathname - The API endpoint path.
 * @param {Record<string, string>} searchParameters - Query parameters for filtering.
 * @returns {Promise<object | null>} The first row, or null if no rows were returned.
 */
async function fetchSingle(pathname, searchParameters) {
  const rows = await supabaseFetch(pathname, { searchParams: searchParameters });
  return rows[0] || null;
}

/**
 * Fetches a tenant record by its slug.
 * @param {string} slug - The tenant slug to look up.
 * @returns {Promise<object>} The tenant record.
 */
async function fetchTenant(slug) {
  const tenant = await fetchSingle("/rest/v1/tenants", {
    limit: "1",
    select: "id,slug,name",
    slug: `eq.${slug}`,
  });

  if (!tenant) {
    throw new Error(`Missing tenant: ${slug}`);
  }

  return tenant;
}

/**
 * Orchestrates the full bootstrap flow: profile, roles, tenants, and memberships.
 */
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
      hostname: `${tenant.slug}.${rootDomain}`,
      membershipId: membership.id,
      tenant: tenant.slug,
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

/**
 * Issues an authenticated fetch request to the Supabase REST API.
 * @param {string} pathname - The API path to call.
 * @param {object} [options] - Request options.
 * @param {unknown} [options.body] - Optional request body (will be JSON-serialised).
 * @param {Record<string, string>} [options.headers] - Additional headers to merge.
 * @param {string} [options.method] - HTTP method (default "GET").
 * @param {Record<string, string>} [options.searchParams] - Optional query parameters.
 * @returns {Promise<unknown>} Parsed response JSON, or null for 204 No Content.
 */
async function supabaseFetch(pathname, { body, headers, method = "GET", searchParams } = {}) {
  const response = await fetch(createUrl(pathname, searchParams), {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...headers,
    },
    method,
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

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
