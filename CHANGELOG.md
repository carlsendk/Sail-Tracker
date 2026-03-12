# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and releases use Semantic Versioning.

## [0.1.1](https://github.com/carlsendk/Sail-Tracker/compare/sail-tracker-v0.1.0...sail-tracker-v0.1.1) (2026-03-12)


### Bug Fixes

* read tenant fallback config from server env ([e0ae7c0](https://github.com/carlsendk/Sail-Tracker/commit/e0ae7c0e1d0e0ff8774d62d7a230f72d0dcb5039))
* relax server env test input typing ([88d5356](https://github.com/carlsendk/Sail-Tracker/commit/88d53569ec9249fa4b0d80bcea3aae04813e4e71))

## [0.1.0] - 2026-03-12

Initial foundation release.

### Added

- project architecture, bootstrap, and workflow documentation
- project-specific Codex skills for BDD, DDD, platform, and implementation guardrails
- Next.js, React, and TypeScript workspace scaffold
- hello-world app shell with tenant-aware context rendering
- Supabase bootstrap schema, seed files, and bootstrap script
- GitHub Actions CI workflow
- developer guide and release baseline

### Changed

- local development defaults now use port `3002`
- runtime environment loading supports both app-local and workspace-root env files

### Fixed

- hydration noise in the app shell
- GitHub Actions pnpm version conflict
- regression coverage for server-side environment loading
