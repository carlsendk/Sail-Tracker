/**
 * @file Programmatic lint spec for `jsdoc/require-jsdoc`.
 * Asserts the rule fires on exported declarations without JSDoc, stays silent
 * when JSDoc is present, and does not fire on internal (non-exported) symbols.
 * Run via: node --test tests/eslint-jsdoc.test.mjs
 *
 * This file runs under the Node.js built-in test runner (node:test), NOT vitest.
 * Vitest-specific import rules are suppressed accordingly.
 */
/* eslint-disable vitest/require-hook -- node:test runner: describe/it at top level is the correct pattern */
import { ESLint } from "eslint";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
// eslint-disable-next-line vitest/no-import-node-test -- intentional: this spec uses node:test runner, not vitest
import { describe, it } from "node:test";

// eslint-disable-next-line sonarjs/variable-name -- __dirname is the Node.js conventional name
const __dirname = import.meta.dirname;
const rootDirectory = path.resolve(__dirname, "..");

const eslint = new ESLint({ cwd: rootDirectory });

// Synthetic file path: must NEVER exist on disk so a developer cannot accidentally
// shadow it with a real source file (which would change the rule's input, not just
// the fixture). The `.synthetic.` infix makes the intent clear and unique.
const fixtureFile = path.join(
  rootDirectory,
  "packages/domain/src/__lint-fixture__.synthetic.ts",
);

// eslint-disable-next-line security/detect-non-literal-fs-filename -- path is built from import.meta.dirname + a constant string; no user input
if (existsSync(fixtureFile)) {
  throw new Error(
    `Synthetic test fixture path "${fixtureFile}" must not exist on disk; ` +
      "rename or delete the real file. See tests/eslint-jsdoc.test.mjs.",
  );
}

/**
 * Lint a string of source as if it lived at the synthetic fixture path inside `packages/domain/src`.
 * @param {string} source - Source text to lint.
 * @returns {Promise<import("eslint").Linter.LintMessage[]>} ESLint messages.
 */
const lintFixture = async source => {
  const [result] = await eslint.lintText(source, { filePath: fixtureFile });
  return result?.messages ?? [];
};

const hasRequireJsdoc = messages =>
  messages.some(m => m.ruleId === "jsdoc/require-jsdoc");

const ruleSummary = messages =>
  messages.map(m => `${m.ruleId}:${m.line}:${m.column}`).join(", ");

describe("jsdoc/require-jsdoc — exported declarations", () => {
  it("fires on an exported function without JSDoc", async () => {
    const messages = await lintFixture("export function foo() {}\n");
    assert.ok(
      hasRequireJsdoc(messages),
      `expected jsdoc/require-jsdoc violation; got: ${ruleSummary(messages)}`,
    );
  });

  it("does not fire on an exported function WITH JSDoc", async () => {
    const messages = await lintFixture(
      "/** Documented foo. */\nexport function foo() {}\n",
    );
    assert.ok(
      !hasRequireJsdoc(messages),
      `expected no jsdoc/require-jsdoc violation; got: ${ruleSummary(messages)}`,
    );
  });

  it("fires on an exported arrow function const without JSDoc", async () => {
    const messages = await lintFixture("export const foo = () => {};\n");
    assert.ok(
      hasRequireJsdoc(messages),
      `expected jsdoc/require-jsdoc violation; got: ${ruleSummary(messages)}`,
    );
  });

  it("fires on an exported class with no JSDoc", async () => {
    const messages = await lintFixture("export class Foo {}\n");
    assert.ok(
      hasRequireJsdoc(messages),
      `expected jsdoc/require-jsdoc violation; got: ${ruleSummary(messages)}`,
    );
  });

  it("fires on a method of an exported class without JSDoc", async () => {
    const messages = await lintFixture(
      "/** Documented class. */\nexport class Foo {\n  bar() {}\n}\n",
    );
    assert.ok(
      hasRequireJsdoc(messages),
      `expected jsdoc/require-jsdoc violation on the method; got: ${ruleSummary(messages)}`,
    );
  });

  it("does not fire on a method of an exported class WITH JSDoc", async () => {
    const messages = await lintFixture(
      "/** Documented class. */\nexport class Foo {\n  /** Documented method. */\n  bar() {}\n}\n",
    );
    assert.ok(
      !hasRequireJsdoc(messages),
      `expected no jsdoc/require-jsdoc violation; got: ${ruleSummary(messages)}`,
    );
  });
});

describe("jsdoc/require-jsdoc — internal (non-exported) symbols", () => {
  it("does not fire on a top-level function that is not exported", async () => {
    const messages = await lintFixture(
      "function helper() {}\n/** Documented public. */\nexport const value = 1;\n",
    );
    assert.ok(
      !hasRequireJsdoc(messages),
      `expected no jsdoc/require-jsdoc violation on internal helper; got: ${ruleSummary(messages)}`,
    );
  });

  it("does not fire on a non-exported class", async () => {
    const messages = await lintFixture(
      "class Internal {}\n/** Documented public. */\nexport const value = 1;\n",
    );
    assert.ok(
      !hasRequireJsdoc(messages),
      `expected no jsdoc/require-jsdoc violation on internal class; got: ${ruleSummary(messages)}`,
    );
  });
});
