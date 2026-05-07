/**
 * @file Root ESLint flat config for the Sail-Tracker monorepo.
 *
 * Phase B2 — strict, preset-based config covering the full plugin set.
 * Rules are kept at "warn" severity until all violations are resolved,
 * then flipped to "error" in the final commit to establish the
 * zero-warning baseline.
 *
 * Curated-out rules (NOT disabled via 'off', simply never applied):
 *   - react/react-in-jsx-scope  — Next 15 uses automatic JSX runtime
 *   - react/jsx-indent          — Prettier (B7) owns indentation
 *   - react/jsx-newline         — Prettier owns newlines
 *   - react/jsx-one-expression-per-line — Prettier owns line composition
 *
 * Plugin presets used instead of applying every rule:
 *   - react:          flat.recommended + flat.jsx-runtime
 *   - unicorn:        recommended
 *   - sonarjs:        recommended
 *   - regexp:         flat/recommended
 *   - perfectionist:  recommended-alphabetical
 *
 * Substitution note — eslint-plugin-deprecation:
 *   The legacy eslint-plugin-deprecation does not work with the
 *   typescript-eslint v8 flat-config API. We use the built-in
 *   @typescript-eslint/no-deprecated rule instead (typescript-eslint v8+).
 */

// Hygiene / monorepo
import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import jseslint from "@eslint/js";
// Next.js
import nextPlugin from "@next/eslint-plugin-next";
import trojan from "eslint-plugin-anti-trojan-source";
// Import / module hygiene
import importPlugin from "eslint-plugin-import";
import jestDom from "eslint-plugin-jest-dom";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
// File-type specific
import * as mdx from "eslint-plugin-mdx";
import noOnlyTests from "eslint-plugin-no-only-tests";
import noSecrets from "eslint-plugin-no-secrets";
import packageJsonPlugin from "eslint-plugin-package-json";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import promise from "eslint-plugin-promise";
// React / JSX
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import regexp from "eslint-plugin-regexp";
// Security
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import testingLibrary from "eslint-plugin-testing-library";
// General quality
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
// Test quality
import vitest from "eslint-plugin-vitest";
import yml from "eslint-plugin-yml";
import globals from "globals";
import path from "node:path";
import tseslint from "typescript-eslint";

const __dirname = import.meta.dirname;

// Paths to tsconfigs that ESLint's type-aware rules should use.
// Type-aware linting is scoped to apps/web only — packages/* currently
// have no dedicated tsconfigs (only stub index.ts files).
const webTsconfig = path.resolve(__dirname, "apps/web/tsconfig.json");

// Files that should be parsed as TypeScript (all TS in workspace)
// const tsFiles = ["apps/web/**/*.{ts,tsx}", "packages/**/*.ts"];

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
// keep at "warn" in the B2 baseline while violations are being cleaned up.
const tsStrictRulesToWarn = {
  "@typescript-eslint/array-type": "warn",
  "@typescript-eslint/consistent-indexed-object-style": "warn",
  "@typescript-eslint/consistent-type-assertions": "warn",
  // stylistic
  "@typescript-eslint/consistent-type-definitions": "warn",
  "@typescript-eslint/consistent-type-imports": "warn",
  "@typescript-eslint/no-deprecated": "warn",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-floating-promises": "warn",
  "@typescript-eslint/no-misused-promises": "warn",
  "@typescript-eslint/no-misused-spread": "warn",
  "@typescript-eslint/no-redundant-type-constituents": "warn",
  "@typescript-eslint/no-unsafe-argument": "warn",
  "@typescript-eslint/no-unsafe-assignment": "warn",
  "@typescript-eslint/no-unsafe-call": "warn",
  "@typescript-eslint/no-unsafe-enum-comparison": "warn",
  "@typescript-eslint/no-unsafe-member-access": "warn",
  "@typescript-eslint/no-unsafe-return": "warn",
  "@typescript-eslint/prefer-nullish-coalescing": "warn",
  "@typescript-eslint/prefer-optional-chain": "warn",
  "@typescript-eslint/prefer-regexp-exec": "warn",
  "@typescript-eslint/require-await": "warn",
  "@typescript-eslint/restrict-plus-operands": "warn",
  "@typescript-eslint/restrict-template-expressions": "warn",
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
      // Next.js auto-generated type declaration — not user-edited code
      "apps/web/next-env.d.ts",
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
      // no-undef from recommended fires on Node globals — muted at file level
      "no-undef": "off",
    },
  },

  // ─── TypeScript: parser setup (non-type-aware) for packages/* ────────────
  // packages/* have no tsconfig, so we parse them as TS but skip type rules.
  {
    files: ["packages/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      // Basic non-type-aware TS rules only
      "@typescript-eslint/no-unused-vars": "warn",
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
  // Use flat.recommended preset — this does NOT include jsx-indent, jsx-newline,
  // or jsx-one-expression-per-line (those are opinionated/all-rules only).
  // Then apply flat.jsx-runtime which sets react-in-jsx-scope to off via curation.
  {
    ...react.configs.flat.recommended,
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(react.configs.flat.recommended.rules ?? {}).map(
          ([rule, _severity]) => [rule, "warn"]
        )
      ),
    },
    settings: {
      react: { version: "detect" },
    },
  },
  // jsx-runtime: turns off react/react-in-jsx-scope and react/jsx-uses-react
  // (automatic JSX transform in Next 15 — no import needed)
  {
    ...react.configs.flat["jsx-runtime"],
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  // Additional curated react rules from spec (not in recommended preset)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      // react-hooks — rules-of-hooks is always an error
      "react-hooks/rules-of-hooks": "error",
      // react-refresh
      "react-refresh/only-export-components": "warn",
      "react/jsx-max-depth": ["warn", { max: 5 }],
      // Spec: enable + clean up
      "react/jsx-no-literals": "warn",
    },
    settings: {
      react: { version: "detect" },
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
      "import/no-cycle": "warn",
      "import/no-duplicates": "warn",
      "import/no-unresolved": "off", // TypeScript handles this
      // Turn off base no-unused-vars in favour of unused-imports version
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": "warn",
    },
  },

  // ─── Unicorn ──────────────────────────────────────────────────────────────
  // Use the recommended preset — naturally includes no-null and prevent-abbreviations.
  // Does NOT include unicorn/prefer-import-meta-properties at error by default
  // since it's not in recommended, so violations are only from recommended rules.
  {
    ...unicorn.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      ...Object.fromEntries(
        Object.entries(unicorn.configs.recommended.rules ?? {}).map(
          ([rule, _severity]) => [rule, "warn"]
        )
      ),
    },
  },

  // ─── SonarJS ──────────────────────────────────────────────────────────────
  // Use recommended preset — includes arrow-function-convention, declarations-in-global-scope, file-header.
  {
    ...sonarjs.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      sonarjs,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(sonarjs.configs.recommended.rules ?? {}).map(
          ([rule, _severity]) => [rule, "warn"]
        )
      ),
      // Configure file-header to accept /** @file ... */ JSDoc comments.
      // The pattern allows an optional shebang line and matches @file anywhere in
      // the opening JSDoc block. Without configuration the rule always fires.
      "sonarjs/file-header": [
        "warn",
        {
          headerFormat: "^(#![^\\n]*\\n)?/\\*\\*[^]*?@file",
          isRegularExpression: true,
        },
      ],
    },
  },

  // ─── Promise ──────────────────────────────────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      promise,
    },
    rules: {
      "promise/always-return": "warn",
      "promise/catch-or-return": "warn",
      "promise/no-return-wrap": "warn",
      "promise/param-names": "warn",
    },
  },

  // ─── Regexp ───────────────────────────────────────────────────────────────
  // Use flat/recommended preset. Spec-listed rules are in recommended.
  {
    ...regexp.configs["flat/recommended"],
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      ...Object.fromEntries(
        Object.entries(regexp.configs["flat/recommended"].rules ?? {}).map(
          ([rule, _severity]) => [rule, "warn"]
        )
      ),
      // Spec-listed: explicitly enable (may not be in recommended)
      "regexp/require-unicode-regexp": "warn",
      // require-unicode-sets-regexp (v flag) is NOT enabled: the TypeScript
      // target is ES2022 which does not support the RegExp v flag. The u flag
      // (require-unicode-regexp) is the correct choice at this target level.
      "regexp/sort-character-class-elements": "warn",
    },
  },

  // ─── Perfectionist ────────────────────────────────────────────────────────
  // Use recommended-alphabetical preset. Includes sort-imports, sort-objects,
  // sort-modules, sort-union-types, sort-object-types per spec.
  {
    ...perfectionist.configs["recommended-alphabetical"],
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      perfectionist,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(
          perfectionist.configs["recommended-alphabetical"].rules ?? {}
        ).map(([rule, _severity]) => [rule, "warn"])
      ),
    },
  },

  // ─── JSDoc ────────────────────────────────────────────────────────────────
  // Apply only the specific rules from the spec. Avoid enabling rules that
  // require additional configuration options (e.g., match-name, no-restricted-syntax,
  // require-tags, check-examples — they fire misconfigured without option objects).
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      jsdoc,
    },
    rules: {
      // Standard recommended jsdoc rules (stable, no required options)
      "jsdoc/check-alignment": "warn",
      "jsdoc/check-param-names": "warn",
      "jsdoc/check-property-names": "warn",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/check-types": "warn",
      "jsdoc/empty-tags": "warn",
      "jsdoc/implements-on-classes": "warn",
      "jsdoc/multiline-blocks": "warn",
      "jsdoc/no-bad-blocks": "warn",
      "jsdoc/no-blank-blocks": "warn",
      "jsdoc/no-multi-asterisks": "warn",
      "jsdoc/require-asterisk-prefix": "warn",
      "jsdoc/require-description": "warn",
      "jsdoc/require-file-overview": "warn",
      // Spec-listed
      "jsdoc/require-jsdoc": "warn",
      "jsdoc/require-param-name": "warn",
      "jsdoc/require-returns-check": "warn",
      "jsdoc/require-yields-check": "warn",
      "jsdoc/tag-lines": "warn",
      "jsdoc/valid-types": "warn",
    },
  },

  // ─── Security ─────────────────────────────────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      "anti-trojan-source": trojan,
      "no-secrets": noSecrets,
      security,
    },
    rules: {
      "anti-trojan-source/no-bidi": "error",
      "no-secrets/no-secrets": "warn",
      "security/detect-bidi-characters": "warn",
      "security/detect-buffer-noassert": "warn",
      "security/detect-child-process": "warn",
      "security/detect-disable-mustache-escape": "warn",
      "security/detect-eval-with-expression": "warn",
      "security/detect-new-buffer": "warn",
      "security/detect-no-csrf-before-method-override": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-require": "warn",
      // Spec-listed security rules
      "security/detect-object-injection": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "warn",
      // Other recommended security rules
      "security/detect-unsafe-regex": "warn",
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
    languageOptions: {
      globals: {
        ...vitest.environments?.env?.globals,
        ...globals.node,
      },
    },
    plugins: {
      "jest-dom": jestDom,
      "no-only-tests": noOnlyTests,
      "testing-library": testingLibrary,
      vitest,
    },
    rules: {
      // vitest recommended rules
      ...Object.fromEntries(
        Object.entries(vitest.configs.recommended.rules ?? {}).map(
          ([rule, _severity]) => [rule, "warn"]
        )
      ),
      // Spec-listed vitest rules not in recommended
      "vitest/prefer-expect-assertions": "warn",
      "vitest/require-hook": "warn",
      // testing-library rules at warn
      // consistent-data-testid requires testIdPattern option
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
      ...cfg.rules,
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
      // Spec-listed
      "package-json/require-description": "warn",
    },
  },
];
