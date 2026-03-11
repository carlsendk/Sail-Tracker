---
name: react-typescript-supabase-platform
description: Define and enforce the default delivery stack for this app using React, TypeScript, GitHub, Vercel, and Supabase. Use when setting up the project, choosing libraries, wiring hosting and auth, or checking whether implementation decisions fit the agreed platform for the sailing trip logger.
---

# React TypeScript Supabase Platform

## Overview

Use this skill to keep stack choices consistent. Treat `React + TypeScript + Vercel + Supabase + GitHub` as the default unless the user explicitly changes the architecture.

## Default Platform

- `GitHub`: source control, pull requests, and deployment integration.
- `Vercel`: web app hosting and preview deployments.
- `Supabase`: Postgres, authentication, storage, and row-level security.
- `React`: UI layer for the PWA.
- `TypeScript`: shared language across frontend, domain, and integration code.

## Account Baseline

Minimum external accounts for the default path:

- `GitHub`
- `Vercel`
- `Supabase`

Do not introduce extra paid infrastructure unless the current requirement cannot be met by these three services.

## Build Guidance

Use these defaults unless a requirement forces a change:

- organize code so domain logic remains framework-light even if the UI uses React
- keep tenant isolation enforced in the database and application layer
- let `Supabase` handle authentication and tenant-scoped data access
- let `Vercel` host the app and run preview deployments from GitHub
- keep offline-first behavior in the client and sync through explicit application use cases

## PWA Guidance

- favor installable, mobile-first flows for trip logging
- support offline draft capture for trips before adding advanced sync
- keep sync conflict handling explicit and observable
- avoid background complexity until the core trip-draft flow works

## Decision Rules

- If a library weakens type safety, reject it unless there is a concrete benefit.
- If a hosting choice complicates the default GitHub to Vercel flow, require a clear reason.
- If a data access shortcut bypasses tenant boundaries, reject it.
- If a UI pattern makes offline behavior harder to reason about, simplify it.

## References

Read `references/platform-baseline.md` when the user asks about setup, responsibilities of each account, or why this stack was chosen.
