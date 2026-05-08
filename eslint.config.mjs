/**
 * @file Root ESLint flat config for the Sail-Tracker monorepo.
 *
 * Phase B2 — strict, preset-based config covering the full plugin set.
 * All enabled rules are at "error" severity (zero-warning policy).
 * Inline eslint-disable-next-line comments with justifications are used
 * for legitimate architectural exceptions.
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
// eslint-disable-next-line sonarjs/no-wildcard-import -- eslint-plugin-mdx has no default export; namespace import is required
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

// eslint-disable-next-line sonarjs/variable-name -- __dirname is the Node.js conventional name for the module directory
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

// Common file globs used across multiple rule blocks
const jsxFiles = ["**/*.{js,jsx,ts,tsx}"];
const allSourceFiles = ["**/*.{js,mjs,cjs,jsx,ts,tsx}"];

// @typescript-eslint rules from strictTypeChecked/stylisticTypeChecked
// that override preset defaults to "error" for the zero-warning baseline.
const tsStrictRulesToError = {
  "@typescript-eslint/array-type": "error",
  "@typescript-eslint/consistent-indexed-object-style": "error",
  "@typescript-eslint/consistent-type-assertions": "error",
  // stylistic
  "@typescript-eslint/consistent-type-definitions": "error",
  "@typescript-eslint/consistent-type-imports": "error",
  "@typescript-eslint/no-deprecated": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-misused-promises": "error",
  "@typescript-eslint/no-misused-spread": "error",
  "@typescript-eslint/no-redundant-type-constituents": "error",
  "@typescript-eslint/no-unsafe-argument": "error",
  "@typescript-eslint/no-unsafe-assignment": "error",
  "@typescript-eslint/no-unsafe-call": "error",
  "@typescript-eslint/no-unsafe-enum-comparison": "error",
  "@typescript-eslint/no-unsafe-member-access": "error",
  "@typescript-eslint/no-unsafe-return": "error",
  "@typescript-eslint/prefer-nullish-coalescing": "error",
  "@typescript-eslint/prefer-optional-chain": "error",
  "@typescript-eslint/prefer-regexp-exec": "error",
  "@typescript-eslint/require-await": "error",
  "@typescript-eslint/restrict-plus-operands": "error",
  "@typescript-eslint/restrict-template-expressions": "error",
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
  // globals.node includes all Node built-ins so no-undef from eslint:recommended
  // should not fire on Node-global identifiers in these files.
  {
    files: ["scripts/**/*.{mjs,cjs,js}", "*.{mjs,cjs,js}", "tests/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
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
      "@typescript-eslint/no-explicit-any": "error",
      // Basic non-type-aware TS rules only
      "@typescript-eslint/no-unused-vars": "error",
    },
  },

  // ─── TypeScript strict + stylistic (type-aware) for apps/web ─────────────
  ...tseslint.configs.strictTypeChecked.map(cfg => ({
    ...cfg,
    files: webTsFiles,
  })),
  ...tseslint.configs.stylisticTypeChecked.map(cfg => ({
    ...cfg,
    files: webTsFiles,
  })),

  // Type-aware parser options for apps/web
  {
    files: webTsFiles,
    languageOptions: {
      parserOptions: {
        project: webTsconfig,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...tsStrictRulesToError,
    },
  },

  // ─── React ────────────────────────────────────────────────────────────────
  // Use flat.recommended preset — this does NOT include jsx-indent, jsx-newline,
  // or jsx-one-expression-per-line (those are opinionated/all-rules only).
  // Then apply flat.jsx-runtime which sets react-in-jsx-scope to off via curation.
  {
    ...react.configs.flat.recommended,
    files: jsxFiles,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(react.configs.flat.recommended.rules ?? {}).map(
          ([rule]) => [rule, "error"],
        ),
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
    files: jsxFiles,
  },
  // Additional curated react rules from spec (not in recommended preset)
  {
    files: jsxFiles,
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
      "react-hooks/exhaustive-deps": "error",
      // react-hooks — rules-of-hooks is always an error
      "react-hooks/rules-of-hooks": "error",
      // react-refresh
      "react-refresh/only-export-components": "error",
      "react/jsx-max-depth": ["error", { max: 5 }],
      // Spec: enable + clean up
      "react/jsx-no-literals": "error",
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
        Object.keys(jsxA11y.flatConfigs.strict.rules ?? {}).map(rule => [
          rule,
          "error",
        ]),
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
        Object.keys(nextPlugin.rules ?? {}).map(name => [
          `@next/next/${name}`,
          "error",
        ]),
      ),
    },
  },
  // ─── Custom architectural rules: no inline <svg> ─────────────────────────
  // Inline `<svg>` JSX is forbidden in component code — icons must live under
  // `packages/ui/src/icons/` and be imported as components. This keeps diffs
  // small, makes accessibility audits tractable, and enables shared-icon reuse.
  // The override block below opts the icon directory out of the rule.
  //
  // Selector matches the lowercase JSX intrinsic `<svg>` only — uppercase
  // `<SVG>` (which JSX treats as a custom-component reference) and JSX
  // namespaced `<svg:x>` are out of scope. Both are vanishingly rare in real
  // code; this rule targets the standard inline-SVG-markup anti-pattern.
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          message:
            "Inline <svg> JSX is not allowed. Add the icon as a component under packages/ui/src/icons/ and import it.",
          selector: "JSXElement[openingElement.name.name='svg']",
        },
      ],
    },
  },
  // Icon directory is the canonical home for inline <svg>; opt it out of the
  // restricted-syntax rule above. This block must come AFTER the rule block so
  // its override wins under flat-config last-match semantics.
  {
    files: ["packages/ui/src/icons/**/*.{jsx,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  // ─── Import / unused-imports ──────────────────────────────────────────────
  {
    files: allSourceFiles,
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "import/no-cycle": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": "error",
    },
    settings: {
      "import/resolver": {
        node: true,
        typescript: {
          project: ["./tsconfig.base.json", "./apps/web/tsconfig.json"],
        },
      },
    },
  },

  // ─── Unicorn ──────────────────────────────────────────────────────────────
  // Use the recommended preset — naturally includes no-null and prevent-abbreviations.
  // Does NOT include unicorn/prefer-import-meta-properties at error by default
  // since it's not in recommended, so violations are only from recommended rules.
  {
    ...unicorn.configs.recommended,
    files: allSourceFiles,
    rules: {
      ...Object.fromEntries(
        Object.entries(unicorn.configs.recommended.rules ?? {}).map(
          ([rule]) => [rule, "error"],
        ),
      ),
    },
  },

  // ─── SonarJS ──────────────────────────────────────────────────────────────
  // Use recommended preset — includes arrow-function-convention and file-header.
  {
    ...sonarjs.configs.recommended,
    files: allSourceFiles,
    plugins: {
      sonarjs,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(sonarjs.configs.recommended.rules ?? {}).map(
          ([rule]) => [rule, "error"],
        ),
      ),
      // Configure file-header to accept /** @file ... */ JSDoc comments.
      // The pattern allows an optional shebang line and matches @file anywhere in
      // the opening JSDoc block. Without configuration the rule always fires.
      "sonarjs/file-header": [
        "error",
        {
          headerFormat: String.raw`^(#![^\n]*\n)?/\*\*[^]*?@file`,
          isRegularExpression: true,
        },
      ],
    },
  },

  // sonarjs/file-name-differ-from-class reports at loc:{line:0,column:0} (before any
  // source line). Inline `eslint-disable` directives only suppress reports at line 1+,
  // so violations on the Next.js App Router convention files (page.tsx, layout.tsx, etc.)
  // are physically unsuppressable inline. Verified empirically: a file-level disable
  // directive at line 1 was reported as unused and the violation still fired.
  // This narrow scoped override is the only mechanism available. Per lint-policy memo,
  // this is the documented "rule reports outside suppressable range" exception class.
  {
    files: ["apps/web/app/**/*.{ts,tsx}"],
    rules: {
      "sonarjs/file-name-differ-from-class": "off",
    },
  },

  // ─── Promise ──────────────────────────────────────────────────────────────
  {
    files: allSourceFiles,
    plugins: {
      promise,
    },
    rules: {
      "promise/always-return": "error",
      "promise/catch-or-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
    },
  },

  // ─── Regexp ───────────────────────────────────────────────────────────────
  // Use flat/recommended preset. Spec-listed rules are in recommended.
  {
    ...regexp.configs["flat/recommended"],
    files: allSourceFiles,
    rules: {
      ...Object.fromEntries(
        Object.entries(regexp.configs["flat/recommended"].rules ?? {}).map(
          ([rule]) => [rule, "error"],
        ),
      ),
      // Spec-listed: explicitly enable (may not be in recommended)
      // Both u-flag and v-flag rules are enabled; v-flag (sets regexp) is
      // supported at ES2024 target which is now the project baseline.
      "regexp/require-unicode-regexp": "error",
      "regexp/require-unicode-sets-regexp": "error",
      "regexp/sort-character-class-elements": "error",
    },
  },

  // ─── Perfectionist ────────────────────────────────────────────────────────
  // Use recommended-alphabetical preset. Includes sort-imports, sort-objects,
  // sort-modules, sort-union-types, sort-object-types per spec.
  {
    ...perfectionist.configs["recommended-alphabetical"],
    files: allSourceFiles,
    plugins: {
      perfectionist,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(
          perfectionist.configs["recommended-alphabetical"].rules ?? {},
        ).map(([rule]) => [rule, "error"]),
      ),
    },
  },

  // ─── JSDoc ────────────────────────────────────────────────────────────────
  // Apply only the specific rules from the spec. Avoid enabling rules that
  // require additional configuration options (e.g., match-name, no-restricted-syntax,
  // require-tags, check-examples — they fire misconfigured without option objects).
  {
    files: allSourceFiles,
    plugins: {
      jsdoc,
    },
    rules: {
      // Standard recommended jsdoc rules (stable, no required options)
      "jsdoc/check-alignment": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-property-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/empty-tags": "error",
      "jsdoc/implements-on-classes": "error",
      "jsdoc/multiline-blocks": "error",
      "jsdoc/no-bad-blocks": "error",
      "jsdoc/no-blank-blocks": "error",
      "jsdoc/no-multi-asterisks": "error",
      "jsdoc/require-asterisk-prefix": "error",
      "jsdoc/require-description": "error",
      "jsdoc/require-file-overview": "error",
      // Require JSDoc on the public surface of exports only — internal symbols are exempt.
      // The selectors below scope coverage to the export keyword (named + default),
      // including methods on exported classes (per B6 #10).
      // The bare `require:` switches are all `false` so we never flag non-exported
      // FunctionDeclaration / ClassDeclaration / etc; coverage comes solely from
      // the AST contexts listed below.
      "jsdoc/require-jsdoc": [
        "error",
        {
          contexts: [
            "ExportNamedDeclaration > FunctionDeclaration",
            "ExportNamedDeclaration > ClassDeclaration",
            "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression",
            "ExportNamedDeclaration > TSTypeAliasDeclaration",
            "ExportNamedDeclaration > TSInterfaceDeclaration",
            "ExportDefaultDeclaration > FunctionDeclaration",
            "ExportDefaultDeclaration > ClassDeclaration",
            // Methods on exported classes must have JSDoc — but only public ones.
            // The four [...] filters chain to exempt:
            //   - constructors (documented via the class JSDoc)
            //   - JS-private (`#name`) methods (key.type === "PrivateIdentifier")
            //   - TS-private methods (accessibility === "private")
            //   - TS-protected methods (accessibility === "protected")
            // The [accessibility!='X'] form also matches the absent-modifier case, so
            // unannotated public methods are still required to have JSDoc.
            // eslint-disable-next-line no-secrets/no-secrets -- ESLint AST selector, not a secret; high entropy is incidental
            "ExportNamedDeclaration > ClassDeclaration > ClassBody > MethodDefinition[kind!='constructor'][key.type!='PrivateIdentifier'][accessibility!='private'][accessibility!='protected']",
            // eslint-disable-next-line no-secrets/no-secrets -- ESLint AST selector, not a secret; high entropy is incidental
            "ExportDefaultDeclaration > ClassDeclaration > ClassBody > MethodDefinition[kind!='constructor'][key.type!='PrivateIdentifier'][accessibility!='private'][accessibility!='protected']",
          ],
          publicOnly: false,
          require: {
            ArrowFunctionExpression: false,
            ClassDeclaration: false,
            FunctionDeclaration: false,
            FunctionExpression: false,
            MethodDefinition: false,
          },
        },
      ],
      "jsdoc/require-param-name": "error",
      "jsdoc/require-returns-check": "error",
      "jsdoc/require-yields-check": "error",
      "jsdoc/tag-lines": "error",
      "jsdoc/valid-types": "error",
    },
  },

  // ─── Security ─────────────────────────────────────────────────────────────
  {
    files: allSourceFiles,
    plugins: {
      "anti-trojan-source": trojan,
      "no-secrets": noSecrets,
      security,
    },
    rules: {
      "anti-trojan-source/no-bidi": "error",
      "no-secrets/no-secrets": "error",
      "security/detect-bidi-characters": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-new-buffer": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-non-literal-require": "error",
      // Spec-listed security rules
      "security/detect-object-injection": "error",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-pseudoRandomBytes": "error",
      // Other recommended security rules
      "security/detect-unsafe-regex": "error",
    },
  },

  // ─── ESLint comments hygiene ──────────────────────────────────────────────
  {
    files: allSourceFiles,
    plugins: {
      "@eslint-community/eslint-comments": eslintComments,
    },
    rules: {
      "@eslint-community/eslint-comments/no-unlimited-disable": "error",
      "@eslint-community/eslint-comments/require-description": "error",
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
        Object.entries(vitest.configs.recommended.rules ?? {}).map(([rule]) => [
          rule,
          "error",
        ]),
      ),
      // Spec-listed vitest rules not in recommended
      "vitest/prefer-expect-assertions": "error",
      "vitest/require-hook": "error",
      // testing-library rules at warn
      // consistent-data-testid requires testIdPattern option
      // no-dom-import requires a framework argument — off for now
      ...Object.fromEntries(
        Object.keys(testingLibrary.rules ?? {})
          .filter(
            rule => !["consistent-data-testid", "no-dom-import"].includes(rule),
          )
          .map(rule => [`testing-library/${rule}`, "error"]),
      ),
      // jest-dom rules at warn
      ...Object.fromEntries(
        Object.keys(jestDom.rules ?? {}).map(rule => [
          `jest-dom/${rule}`,
          "error",
        ]),
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
        Object.keys(playwright.rules ?? {}).map(rule => [
          `playwright/${rule}`,
          "error",
        ]),
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
        Object.keys(mdx.rules ?? {}).map(rule => [`mdx/${rule}`, "error"]),
      ),
    },
  },

  // ─── YAML files ───────────────────────────────────────────────────────────
  ...yml.configs["flat/recommended"].map(cfg => ({
    ...cfg,
    files: ["**/*.{yml,yaml}"],
    rules: {
      ...cfg.rules,
      // Downgrade all yml rules to warn
      ...Object.fromEntries(
        Object.entries(cfg.rules ?? {}).map(([rule]) => [rule, "error"]),
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
  // JSON parser. Rules are at "error" per the zero-warning policy.
  // The plugin key is re-registered to match what the smoke test expects.
  {
    ...packageJsonPlugin.configs.recommended,
    plugins: {
      // re-register under the key our smoke test checks
      "package-json": packageJsonPlugin,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(packageJsonPlugin.configs.recommended.rules ?? {}).map(
          ([rule]) => [rule, "error"],
        ),
      ),
      // Spec-listed
      "package-json/require-description": "error",
    },
  },
];
