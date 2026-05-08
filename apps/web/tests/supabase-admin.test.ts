/** @file Tests for Supabase admin config resolution. */

import { describe, expect, it } from "vitest";

import { resolveSupabaseAdminConfig } from "../lib/supabase-admin";

const TEST_SUPABASE_URL = "https://example.supabase.co";

describe("supabase admin config", () => {
  it("uses the documented secret key path", () => {
    expect.hasAssertions();
    const config = resolveSupabaseAdminConfig(name => {
      const values: Record<string, string> = {
        NEXT_PUBLIC_SUPABASE_URL: TEST_SUPABASE_URL,
        SUPABASE_SECRET_KEY: "sb_secret_example",
      };

      // eslint-disable-next-line unicorn/no-null, security/detect-object-injection -- mock returns null per contract; values is a hardcoded fixture
      return values[name] ?? null;
    });

    expect(config).toEqual({
      adminKey: "sb_secret_example",
      url: TEST_SUPABASE_URL,
    });
  });

  it("accepts the legacy service role fallback", () => {
    expect.hasAssertions();
    const config = resolveSupabaseAdminConfig(name => {
      const values: Record<string, string> = {
        NEXT_PUBLIC_SUPABASE_URL: TEST_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: "service-role-example",
      };

      // eslint-disable-next-line unicorn/no-null, security/detect-object-injection -- mock returns null per contract; values is a hardcoded fixture
      return values[name] ?? null;
    });

    expect(config).toEqual({
      adminKey: "service-role-example",
      url: TEST_SUPABASE_URL,
    });
  });

  it("returns null when config is incomplete", () => {
    expect.hasAssertions();
    // eslint-disable-next-line unicorn/no-null -- testing that the admin config resolver returns null when env vars are missing
    expect(resolveSupabaseAdminConfig(() => null)).toBeNull();
  });
});
