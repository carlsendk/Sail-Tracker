/**
 * @file Prettier configuration for the Sail-Tracker monorepo.
 *
 * Coverage (per Phase 0 B7 spec): TS/TSX, MDX, JSON, YAML, JS/MJS/CJS.
 * Plain Markdown is intentionally NOT formatted (docs are hand-authored
 * with bespoke layout — see `.prettierignore` and the `format` script glob).
 *
 * Defaults are kept everywhere; we override only when a workspace
 * convention diverges from Prettier's defaults. Currently nothing
 * needs to differ — Prettier defaults already match `.editorconfig`
 * (2-space indent, LF, UTF-8, trailing newline).
 */

/** @type {import("prettier").Config} */
export default {};
