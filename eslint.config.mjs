/**
 * Root ESLint flat config for the Sail-Tracker monorepo.
 *
 * Phase B2 — strict, type-aware config covering the full plugin set.
 * Newly-introduced rule families are set to "warn" so violations are
 * visible without failing CI. Pre-existing next/core-web-vitals errors
 * remain at error severity. B3-B6 will progressively tighten specific
 * rule families to "error" as each one is cleaned up.
 *
 * Substitution note — eslint-plugin-deprecation:
 *   The legacy eslint-plugin-deprecation does not work with the
 *   typescript-eslint v8 flat-config API. We use the built-in
 *   @typescript-eslint/no-deprecated rule instead (typescript-eslint v8+),
 *   which covers the same intent with current tooling support.
 *
 * ESLint version note:
 *   ESLint was upgraded from 9.22 → 9.39.x to satisfy peer requirements
 *   from eslint-plugin-unicorn@64, eslint-plugin-regexp@3, and
 *   eslint-plugin-yml@3, all of which require eslint >=9.38.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import jseslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

// React / JSX
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactRefresh from "eslint-plugin-react-refresh";

// Next.js
import nextPlugin from "@next/eslint-plugin-next";

// Import / module hygiene
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

// General quality
import unicorn from "eslint-plugin-unicorn";
import sonarjs from "eslint-plugin-sonarjs";
import promise from "eslint-plugin-promise";
import regexp from "eslint-plugin-regexp";
import perfectionist from "eslint-plugin-perfectionist";
import jsdoc from "eslint-plugin-jsdoc";

// Security
import security from "eslint-plugin-security";
import noSecrets from "eslint-plugin-no-secrets";
import trojan from "eslint-plugin-anti-trojan-source";

// Test quality
import vitest from "eslint-plugin-vitest";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import noOnlyTests from "eslint-plugin-no-only-tests";

// File-type specific
import * as mdx from "eslint-plugin-mdx";
import yml from "eslint-plugin-yml";
import packageJsonPlugin from "eslint-plugin-package-json";

// Hygiene / monorepo
import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths to tsconfigs that ESLint's type-aware rules should use.
// Type-aware linting is scoped to apps/web only — packages/* currently
// have no dedicated tsconfigs (only stub index.ts files).
const webTsconfig = path.resolve(__dirname, "apps/web/tsconfig.json");

// Files that should be parsed as TypeScript (all TS in workspace)
const tsFiles = ["apps/web/**/*.{ts,tsx}", "packages/**/*.ts"];

// Files in apps/web that can participate in type-aware linting
const webTsFiles = ["apps/web/**/*.{ts,tsx}"];

// Test files — extra test-specific plugins apply here
const testFiles = [
  "**/*.test.{ts,tsx}",
  "**/*.spec.{ts,tsx}",
  "**/__tests__/**/*.{ts,tsx}",
  "**/tests/**/*.{ts,tsx,mjs}",
];

// Playwright test files
const playwrightFiles = ["**/e2e/**/*.{ts,tsx}", "**/*.playwright.{ts,tsx}"];

// All @typescript-eslint rules from strictTypeChecked that we want to
// downgrade from "error" to "warn" in the B2 baseline. B3–B6 will
// re-tighten specific sub-families to "error".
const tsStrictRulesToWarn = {
  "@typescript-eslint/no-unsafe-argument": "warn",
  "@typescript-eslint/no-unsafe-assignment": "warn",
  "@typescript-eslint/no-unsafe-call": "warn",
  "@typescript-eslint/no-unsafe-member-access": "warn",
  "@typescript-eslint/no-unsafe-return": "warn",
  "@typescript-eslint/no-unsafe-enum-comparison": "warn",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-floating-promises": "warn",
  "@typescript-eslint/no-misused-promises": "warn",
  "@typescript-eslint/no-misused-spread": "warn",
  "@typescript-eslint/require-await": "warn",
  "@typescript-eslint/restrict-template-expressions": "warn",
  "@typescript-eslint/restrict-plus-operands": "warn",
  "@typescript-eslint/no-deprecated": "warn",
  // stylistic
  "@typescript-eslint/consistent-type-definitions": "warn",
  "@typescript-eslint/prefer-optional-chain": "warn",
  "@typescript-eslint/array-type": "warn",
  "@typescript-eslint/prefer-regexp-exec": "warn",
  "@typescript-eslint/consistent-indexed-object-style": "warn",
  "@typescript-eslint/no-redundant-type-constituents": "warn",
  "@typescript-eslint/prefer-nullish-coalescing": "warn",
  "@typescript-eslint/consistent-type-imports": "warn",
  "@typescript-eslint/consistent-type-assertions": "warn",
};

export default [
  // ─── Global ignores ───────────────────────────────────────────────────────
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      ".pnpm-store/**",
      "pnpm-lock.yaml",
      "**/*.min.js",
    ],
  },

  // ─── Base JS rules (non-TS files) ─────────────────────────────────────────
  {
    ...jseslint.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx}"],
  },

  // ─── Node scripts (mjs/cjs at root and scripts/) ──────────────────────────
  // Need Node globals; these are not browser code.
  {
    files: ["scripts/**/*.{mjs,cjs,js}", "*.{mjs,cjs,js}", "tests/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // No-undef from recommended fires on Node globals — muted at file level
      "no-undef": "off",
    },
  },

  // ─── TypeScript: parser setup (non-type-aware) for packages/* ────────────
  // packages/* have no tsconfig, so we parse them as TS but skip type rules.
  {
    files: ["packages/**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Basic non-type-aware TS rules only
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // ─── TypeScript strict + stylistic (type-aware) for apps/web ─────────────
  // Spread tseslint preset configs then immediately override all strict errors
  // to "warn" per the B2 severity policy.
  ...tseslint.configs.strictTypeChecked.map((cfg) => ({
    ...cfg,
    files: webTsFiles,
  })),
  ...tseslint.configs.stylisticTypeChecked.map((cfg) => ({
    ...cfg,
    files: webTsFiles,
  })),

  // Type-aware parser options + B2 severity overrides
  {
    files: webTsFiles,
    languageOptions: {
      parserOptions: {
        project: webTsconfig,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...tsStrictRulesToWarn,
    },
  },

  // ─── React ────────────────────────────────────────────────────────────────
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // Apply react rules as warnings
      ...Object.fromEntries(
        Object.keys(react.rules ?? {}).map((rule) => [
          `react/${rule}`,
          "warn",
        ])
      ),
      // react-hooks — rules-of-hooks is always an error
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // react-refresh
      "react-refresh/only-export-components": "warn",
    },
  },

  // ─── JSX accessibility ────────────────────────────────────────────────────
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...Object.fromEntries(
        Object.keys(jsxA11y.flatConfigs.strict.rules ?? {}).map((rule) => [
          rule,
          "warn",
        ])
      ),
    },
  },

  // ─── Next.js ──────────────────────────────────────────────────────────────
  {
    files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // Keep core-web-vitals rules at their canonical severity
      ...Object.fromEntries(
        Object.entries(nextPlugin.rules ?? {}).map(([name, rule]) => [
          `@next/next/${name}`,
          // recommended rules stay at error; others at warn
          (rule.meta?.docs?.recommended ?? false) ? "error" : "warn",
        ])
      ),
    },
  },

  // ─── Import / unused-imports ──────────────────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "import/no-duplicates": "warn",
      "import/no-cycle": "warn",
      "import/no-unresolved": "off", // TypeScript handles this
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": "warn",
      // Turn off base no-unused-vars in favour of unused-imports version
      "no-unused-vars": "off",
    },
  },

  // ─── General quality plugins ──────────────────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      unicorn,
      sonarjs,
      promise,
      regexp,
      perfectionist,
      jsdoc,
    },
    rules: {
      // unicorn — all at warn
      ...Object.fromEntries(
        Object.keys(unicorn.rules ?? {}).map((rule) => [
          `unicorn/${rule}`,
          "warn",
        ])
      ),
      // sonarjs — all at warn
      ...Object.fromEntries(
        Object.keys(sonarjs.rules ?? {}).map((rule) => [
          `sonarjs/${rule}`,
          "warn",
        ])
      ),
      // promise
      "promise/always-return": "warn",
      "promise/no-return-wrap": "warn",
      "promise/param-names": "warn",
      "promise/catch-or-return": "warn",
      // regexp
      ...Object.fromEntries(
        Object.keys(regexp.rules ?? {}).map((rule) => [
          `regexp/${rule}`,
          "warn",
        ])
      ),
      // perfectionist — all at warn
      ...Object.fromEntries(
        Object.keys(perfectionist.rules ?? {}).map((rule) => [
          `perfectionist/${rule}`,
          "warn",
        ])
      ),
      // jsdoc — all at warn
      ...Object.fromEntries(
        Object.keys(jsdoc.rules ?? {}).map((rule) => [
          `jsdoc/${rule}`,
          "warn",
        ])
      ),
    },
  },

  // ─── Security ─────────────────────────────────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      security,
      "no-secrets": noSecrets,
      "anti-trojan-source": trojan,
    },
    rules: {
      ...Object.fromEntries(
        Object.keys(security.rules ?? {}).map((rule) => [
          `security/${rule}`,
          "warn",
        ])
      ),
      "no-secrets/no-secrets": "warn",
      "anti-trojan-source/no-bidi": "error",
    },
  },

  // ─── ESLint comments hygiene ──────────────────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      "@eslint-community/eslint-comments": eslintComments,
    },
    rules: {
      "@eslint-community/eslint-comments/no-unlimited-disable": "warn",
      "@eslint-community/eslint-comments/require-description": "warn",
    },
  },

  // ─── Test files — vitest + testing-library + jest-dom ────────────────────
  {
    files: testFiles,
    plugins: {
      vitest,
      "testing-library": testingLibrary,
      "jest-dom": jestDom,
      "no-only-tests": noOnlyTests,
    },
    languageOptions: {
      globals: {
        ...vitest.environments?.env?.globals,
        ...globals.node,
      },
    },
    rules: {
      // vitest rules at warn
      ...Object.fromEntries(
        Object.keys(vitest.rules ?? {}).map((rule) => [
          `vitest/${rule}`,
          "warn",
        ])
      ),
      // testing-library rules at warn
      // consistent-data-testid requires testIdPattern option (B5 will configure it)
      // no-dom-import requires a framework argument — off for now
      ...Object.fromEntries(
        Object.keys(testingLibrary.rules ?? {})
          .filter(
            (rule) =>
              !["consistent-data-testid", "no-dom-import"].includes(rule)
          )
          .map((rule) => [`testing-library/${rule}`, "warn"])
      ),
      "testing-library/consistent-data-testid": "off",
      "testing-library/no-dom-import": "off",
      // jest-dom rules at warn
      ...Object.fromEntries(
        Object.keys(jestDom.rules ?? {}).map((rule) => [
          `jest-dom/${rule}`,
          "warn",
        ])
      ),
      "no-only-tests/no-only-tests": "error",
    },
  },

  // ─── Playwright test files ────────────────────────────────────────────────
  {
    files: playwrightFiles,
    plugins: {
      playwright,
    },
    rules: {
      ...Object.fromEntries(
        Object.keys(playwright.rules ?? {}).map((rule) => [
          `playwright/${rule}`,
          "warn",
        ])
      ),
    },
  },

  // ─── MDX files ────────────────────────────────────────────────────────────
  {
    files: ["**/*.mdx"],
    plugins: {
      mdx,
    },
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: false,
    }),
    rules: {
      ...Object.fromEntries(
        Object.keys(mdx.rules ?? {}).map((rule) => [`mdx/${rule}`, "warn"])
      ),
    },
  },

  // ─── YAML files ───────────────────────────────────────────────────────────
  ...yml.configs["flat/recommended"].map((cfg) => ({
    ...cfg,
    files: ["**/*.{yml,yaml}"],
    rules: {
      ...(cfg.rules ?? {}),
      // Downgrade all yml rules to warn
      ...Object.fromEntries(
        Object.entries(cfg.rules ?? {}).map(([rule]) => [rule, "warn"])
      ),
    },
  })),
  // Ensure yml plugin is registered with our key name for smoke test
  {
    files: ["**/*.{yml,yaml}"],
    plugins: {
      yml,
    },
  },

  // ─── package.json files ───────────────────────────────────────────────────
  // Use the plugin's recommended config directly so it brings its own
  // JSON parser. Then override all rules to "warn" per the B2 policy,
  // and ensure the plugin key matches what the smoke test expects.
  {
    ...packageJsonPlugin.configs.recommended,
    plugins: {
      // re-register under the key our smoke test checks
      "package-json": packageJsonPlugin,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(packageJsonPlugin.configs.recommended.rules ?? {}).map(
          ([rule, _]) => [rule, "warn"]
        )
      ),
    },
  },
];
