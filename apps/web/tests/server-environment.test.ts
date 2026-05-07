/** @file Tests for server-side environment variable loading from .env files. */

import { describe, expect, it } from "vitest";

import { buildEnvironmentLookup, parseEnvironmentContents } from "../lib/server-environment";

describe("server env", () => {
  it("parses env content and strips quotes", () => {
    expect.hasAssertions();
    // eslint-disable-next-line no-secrets/no-secrets -- test fixture mimicking a .env file; values are fake test data
    const parsed = parseEnvironmentContents(`
      # comment
      NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co"
      PLATFORM_ADMIN_EMAIL=test@example.com
    `);

    expect(parsed.get("NEXT_PUBLIC_SUPABASE_URL")).toBe("https://example.supabase.co");
    expect(parsed.get("PLATFORM_ADMIN_EMAIL")).toBe("test@example.com");
  });

  it("prefers runtime env over file values", () => {
    expect.hasAssertions();
    const lookup = buildEnvironmentLookup(
      [
        new Map([
          ["NEXT_PUBLIC_SUPABASE_URL", "https://file.example"],
          ["PLATFORM_ADMIN_EMAIL", "file@example.com"],
        ]),
      ],
      {
        NEXT_PUBLIC_SUPABASE_URL: "https://runtime.example",
      },
    );

    expect(lookup("NEXT_PUBLIC_SUPABASE_URL")).toBe("https://runtime.example");
    expect(lookup("PLATFORM_ADMIN_EMAIL")).toBe("file@example.com");
  });

  it("falls back across multiple file sources", () => {
    expect.hasAssertions();
    const lookup = buildEnvironmentLookup(
      [
        new Map([["NEXT_PUBLIC_ROOT_DOMAIN", "localhost"]]),
        new Map([["PLATFORM_ADMIN_EMAIL", "root@example.com"]]),
      ],
      {},
    );

    expect(lookup("NEXT_PUBLIC_ROOT_DOMAIN")).toBe("localhost");
    expect(lookup("PLATFORM_ADMIN_EMAIL")).toBe("root@example.com");
    expect(lookup("MISSING_KEY")).toBeNull();
  });
});
