/**
 * @file apps/web ESLint config — extends the root flat config.
 *
 * This file intentionally keeps only Next.js app-specific overrides.
 * All plugin loading and base rule configuration lives in the root
 * eslint.config.mjs to avoid duplication across workspace packages.
 */

import rootConfig from "../../eslint.config.mjs";

export default [
  ...rootConfig,
  // Next.js app-specific overrides
  {
    // Next.js uses conventional filenames like page.tsx, layout.tsx, error.tsx, etc.
    // that differ from the exported component name — suppress the sonarjs rule for app/**
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "sonarjs/file-name-differ-from-class": "off",
    },
  },
];
