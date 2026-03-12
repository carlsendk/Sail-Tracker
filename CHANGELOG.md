# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and releases use Semantic Versioning.

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
