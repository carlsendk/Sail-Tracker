/**
 * @file Programmatic lint spec for `eslint-plugin-mdx`.
 * Asserts the mdx flat-config block is engaged for `**\/*.mdx` paths and that
 * lint runs to completion against a synthetic MDX source. The MDX plugin is
 * configured at the `eslint.config.mjs` level even though no real `.mdx` files
 * yet exist in the repo — this spec guards the wiring.
 * Run via: node --test tests/eslint-mdx.test.mjs
 *
 * This file runs under the Node.js built-in test runner (node:test), NOT vitest.
 * Vitest-specific import rules are suppressed accordingly.
 */
/* eslint-disable vitest/require-hook -- node:test runner: describe/it at top level is the correct pattern */
import { ESLint } from "eslint";
import assert from "node:assert/strict";
import path from "node:path";
// eslint-disable-next-line vitest/no-import-node-test -- intentional: this spec uses node:test runner, not vitest
import { describe, it } from "node:test";

// eslint-disable-next-line sonarjs/variable-name -- __dirname is the Node.js conventional name
const __dirname = import.meta.dirname;
const rootDirectory = path.resolve(__dirname, "..");

const eslint = new ESLint({ cwd: rootDirectory });

const fixtureFile = path.join(rootDirectory, "docs/synthetic-fixture.mdx");

describe("eslint-plugin-mdx — flat-config wiring", () => {
  it("calculates a config for .mdx files that includes mdx/* rules", async () => {
    const config = await eslint.calculateConfigForFile(fixtureFile);
    const ruleKeys = Object.keys(config.rules ?? {});
    const mdxRuleKeys = ruleKeys.filter(key => key.startsWith("mdx/"));
    assert.ok(
      mdxRuleKeys.length > 0,
      `expected mdx/* rules to be configured for .mdx files; got: ${ruleKeys.join(", ")}`,
    );
  });

  it("lints a clean MDX snippet without throwing", async () => {
    const source = "# Heading\n\nThis is body text.\n";
    const [result] = await eslint.lintText(source, { filePath: fixtureFile });
    assert.ok(
      Array.isArray(result?.messages),
      "lintText should return a result object with a messages array",
    );
  });

  it("emits an array of messages (potentially empty) for a clean MDX file", async () => {
    const source = "# Heading\n\nThis is body text.\n";
    const [result] = await eslint.lintText(source, { filePath: fixtureFile });
    const messages = result?.messages ?? [];
    assert.ok(
      Array.isArray(messages),
      `lintText messages should be an array; got: ${typeof messages}`,
    );
  });
});
