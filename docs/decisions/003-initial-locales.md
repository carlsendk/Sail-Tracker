# ADR 003: Initial Locale Baseline

## Status

Accepted

## Date

2026-03-11

## Decision

Use `en` and `da` as the initial supported locales.

Use `en` as the technical default locale for code and fallback behavior.

## Context

The product needs multi-language support from day 0, but the exact launch content set may evolve.

The project currently needs a practical starting point that:

- supports development immediately
- keeps copy and formatting decisions explicit
- matches the likely first operating context

## Rationale

- `en` is a practical technical fallback language.
- `da` reflects the likely first operating context.
- Defining both now forces the codebase and review process to treat localization as a real requirement.

## Consequences

### Positive

- i18n becomes part of the initial workflow
- locale-aware formatting decisions can start early
- demo and seeded content can be designed with translation in mind

### Negative

- even the first UI work must respect translation boundaries
- copy and seed data need more discipline from the start

## Follow-Up Decisions

- which i18n library to use
- whether tenant-specific terminology overrides are needed
- which locale should be the default for the demo tenant
