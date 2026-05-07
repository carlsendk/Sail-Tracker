/**
 * @file Smoke spec: asserts that eslint.config.mjs loads and registers all required plugins.
 * Run via: node --test tests/eslint-config.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";

const __dirname = import.meta.dirname;
const rootDir = path.resolve(__dirname, "..");

// Dynamically import the root eslint config
const { default: config } = await import(
  path.join(rootDir, "eslint.config.mjs")
);

/**
 * Collect all plugin keys registered across all flat-config entries.
 */
function collectPluginKeys(flatConfig) {
  const keys = new Set();
  for (const entry of flatConfig) {
    if (entry.plugins && typeof entry.plugins === "object") {
      for (const key of Object.keys(entry.plugins)) {
        keys.add(key);
      }
    }
  }
  return keys;
}

const pluginKeys = collectPluginKeys(config);

// Helper for clearer failure messages
/**
 *
 */
function assertPlugin(key) {
  assert.ok(
    pluginKeys.has(key),
    `Expected plugin key "${key}" to be registered in the flat config. Found keys: ${[...pluginKeys].join(", ")}`
  );
}

describe("root eslint.config.mjs", () => {
  it("exports an array (flat config format)", () => {
    assert.ok(Array.isArray(config), "Config should be an array");
    assert.ok(config.length > 0, "Config should not be empty");
  });

  it("registers @typescript-eslint plugin", () => {
    assertPlugin("@typescript-eslint");
  });

  it("registers react plugin", () => {
    assertPlugin("react");
  });

  it("registers react-hooks plugin", () => {
    assertPlugin("react-hooks");
  });

  it("registers jsx-a11y plugin", () => {
    assertPlugin("jsx-a11y");
  });

  it("registers @next/next plugin", () => {
    assertPlugin("@next/next");
  });

  it("registers import plugin", () => {
    assertPlugin("import");
  });

  it("registers unicorn plugin", () => {
    assertPlugin("unicorn");
  });

  it("registers sonarjs plugin", () => {
    assertPlugin("sonarjs");
  });

  it("registers promise plugin", () => {
    assertPlugin("promise");
  });

  it("registers regexp plugin", () => {
    assertPlugin("regexp");
  });

  it("registers jsdoc plugin", () => {
    assertPlugin("jsdoc");
  });

  it("registers perfectionist plugin", () => {
    assertPlugin("perfectionist");
  });

  it("registers react-refresh plugin", () => {
    assertPlugin("react-refresh");
  });

  it("registers mdx plugin", () => {
    assertPlugin("mdx");
  });

  it("registers security plugin", () => {
    assertPlugin("security");
  });

  it("registers no-secrets plugin", () => {
    assertPlugin("no-secrets");
  });

  it("registers anti-trojan-source plugin", () => {
    assertPlugin("anti-trojan-source");
  });

  it("registers vitest plugin", () => {
    assertPlugin("vitest");
  });

  it("registers testing-library plugin", () => {
    assertPlugin("testing-library");
  });

  it("registers jest-dom plugin", () => {
    assertPlugin("jest-dom");
  });

  it("registers playwright plugin", () => {
    assertPlugin("playwright");
  });

  it("registers no-only-tests plugin", () => {
    assertPlugin("no-only-tests");
  });

  it("registers eslint-comments plugin", () => {
    assertPlugin("@eslint-community/eslint-comments");
  });

  it("registers unused-imports plugin", () => {
    assertPlugin("unused-imports");
  });

  it("registers package-json plugin", () => {
    assertPlugin("package-json");
  });

  it("registers yml plugin", () => {
    assertPlugin("yml");
  });
});
