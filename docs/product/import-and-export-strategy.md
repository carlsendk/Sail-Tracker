# Import And Export Strategy

## Purpose

This document defines how Sail Tracker should move data into and out of the product in deliberate, understandable ways.

It exists because exports, reports, subscriptions, and integrations are related, but they are not the same thing.
The product needs a clear portability strategy so clubs can trust that their data is usable beyond one screen or one vendor-specific workflow.

## Why This Area Matters

Clubs will eventually need to:

- export operational records
- move data into the platform from older tools
- subscribe to calendar-style outputs
- share selected information outside the product
- retain useful records over time

Without a defined strategy, the product risks:

- ad hoc exports with inconsistent meaning
- privacy leaks through over-broad exports
- duplicated integration paths that drift from one another
- poor trust in the platform’s portability

## Core Product Outcome

The product should make it easy to answer:

- what data can be exported
- in what shape
- for which audience
- with what permissions and redaction rules
- what can be imported safely
- what remains platform-internal only

## Scope

This area covers:

- export categories
- import categories
- portability expectations
- integration-oriented output boundaries
- machine-readable versus human-readable outputs
- ownership of scheduled feeds versus one-time exports

This area does not own:

- reporting logic itself
- the calendar timeline model
- tenant permissions
- domain rules for trips, assets, or qualifications

It defines how those areas can be moved, shared, or ingested.

## Core Principle

Import and export should be explicit product capabilities, not accidental side effects of internal storage.

That means:

- each export shape should have a clear audience and purpose
- imports should map into known product concepts
- machine-readable outputs should not quietly become public APIs
- tenant portability should not break tenant isolation

## Export Families

The cleanest model is to separate exports by purpose.

### 1. Operational Exports

Used to support day-to-day club work outside the app.

Examples:

- trip list for a period
- vessel schedule summary
- overdue work summary
- qualification or approval overview

These are usually tenant-scoped and operationally focused.

### 2. Human-Readable Shareable Exports

Used when a person needs a readable output.

Examples:

- printable trip summary later
- board summary pack
- seasonal activity summary later
- incident review summary later

These are presentation-oriented outputs, not raw data dumps.

### 3. Machine-Readable Exports

Used for interoperability and portability.

Examples:

- CSV export
- structured JSON export later
- calendar feed output such as ICS

These should stay clearly defined and permission-aware.

### 4. Full Tenant Portability Exports

Used when a tenant needs to preserve or migrate its data more broadly.

This is different from normal reporting.

Examples:

- tenant-owned data bundle later
- structured archive export later

The product should keep this concept separate from ordinary operational exports.

## Import Families

Imports should also be separated by purpose.

### 1. Setup Imports

Used during tenant onboarding or early migration.

Examples:

- vessel import
- member import
- asset import

### 2. Reference Data Imports

Used when a tenant brings in local catalogs or structured club-owned definitions.

Examples:

- local badge definitions later
- local skill definitions later
- harbor favorites later

### 3. Operational Record Imports

Used when bringing historical records into the system.

Examples:

- past trip logs later
- legacy maintenance records later

These should be treated more carefully than simple setup imports because they affect operational history.

## Export Versus Feed Versus Report

These three should remain distinct.

### `report`

A product view or generated summary that answers a question.

### `export`

A packaged output intended to leave the product.

### `feed`

A subscription-oriented, continuously consumable output such as ICS.

This distinction matters because:

- reports may not always be exportable as-is
- feeds are not the same thing as one-time downloads
- exports need stronger portability and privacy rules

## Relationship To Reporting

Reporting owns:

- summarization
- aggregation
- report shapes

Import/export strategy owns:

- portability expectations
- external-facing data movement
- which output families exist
- which shapes are appropriate for reuse or integration

Reporting can generate an exportable output, but not every report is automatically a portable export contract.

## Relationship To Calendar Feeds

Calendar feeds are one export family, but they are special because they are subscription-based.

Examples:

- tenant schedule ICS
- trips-only feed
- vessel-specific feed
- due-soon reminder-style feed later

These should remain governed by:

- calendar ownership of time-based data
- permission-aware feed scope
- feed-specific privacy rules

## Relationship To Tenant Boundaries

Most imports and exports are tenant-scoped.

That means:

- a tenant exports its own data
- a tenant imports into its own context
- one tenant cannot import or export another tenant’s data through normal product flows

Platform-level exports should be explicitly separate and much rarer.

## Privacy And Redaction

Exports need stronger privacy rules than many in-app views.

Examples of sensitive data that may require suppression or selection:

- guest identity
- minors’ personal details
- incident detail
- internal notes
- media references
- support or exception rationale

The product should support the idea that:

- some data is visible in-app to an authorized user
- but still should not be exported in the same raw shape

## Import Expectations

Imports should not be treated as arbitrary file ingestion.

Good import behavior:

- clear supported shapes
- preview or mapping later
- validation against product rules
- explicit ownership of what is created or updated

Bad import behavior:

- silent data mutation
- unclear mapping into product concepts
- bypassing tenant or permission rules

## Portability Expectations

Clubs should be able to trust that their important records are not trapped.

That does not mean every internal product shape must be exposed directly.

It does mean the product should support:

- meaningful tenant-scoped export
- stable human-readable outputs
- stable machine-readable outputs where promised
- explicit distinction between export contract and internal implementation detail

## Suggested Early Priorities

The product should likely prioritize these first:

1. ICS calendar feeds
2. CSV-style operational exports
3. simple setup imports for members, vessels, and assets
4. richer structured exports later

That order supports real operational use without overpromising a full integration platform too early.

## Business Rules

- Export, feed, and report should remain distinct concepts.
- Imports should map into known product concepts and respect tenant boundaries.
- Exports should be permission-aware and privacy-aware.
- Machine-readable outputs should not quietly become undefined public APIs.
- Calendar feeds should remain governed by the calendar backbone, even though they are an export family.
- Tenant portability should be possible without exposing internal implementation details unnecessarily.
