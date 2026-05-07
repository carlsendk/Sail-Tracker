# Media Gallery

## Purpose

This module defines how Sail Tracker stores and presents photos and video connected to trips.

It should help clubs preserve useful visual records without forcing every trip to become a publishing workflow.

## Why This Is A Module

Media is useful for memory, review, storytelling, and sometimes evidence, but it should not own:

- trip lifecycle
- incident ownership
- trip story ownership
- asset ownership
- reporting ownership

Instead, it should own the media records themselves and how they attach to product records such as trips.

That makes media a supporting trip-enrichment module.

## Core Product Outcome

The product should make it easy to answer:

- what photos or videos belong to this trip
- who added them
- whether they are internal-only or safe to share more broadly later
- whether media is related to a notable event, activity, or trip memory
- what media can be reused in story, reporting, or review contexts

## Scope

This module covers:

- trip-attached photos and video
- upload and attachment flow
- gallery-style browsing within a trip
- media metadata such as uploader and timestamp
- visibility and sharing level later
- reuse of media in trip story, reporting, or incident context later

This module does not own:

- the written trip narrative
- incident structure
- source-of-truth trip state
- long-term digital asset management beyond the product’s use

## Core Concepts

- `media item`
  A photo or video stored and attached to a record such as a trip.
- `gallery`
  The collection of media items associated with a trip.
- `uploader`
  The person who added the media to the product.
- `visibility level`
  The allowed audience for a media item.
- `media reuse`
  Use of a stored media item in related product outputs such as story or reporting later.

## Why Media Matters

Trip media is not only for nice memories.

It may help with:

- documenting what happened
- showing attendance or activity later
- supporting trip story writing
- supporting incident or damage review
- creating club communication material later

The product should allow that value without confusing “we have media” with “we have a complete trip record.”

## Relationship To Trip Workflow

Media should fit naturally around the trip lifecycle.

### During Active Trip

Users may want to capture and attach media while the trip is active.

This should stay lightweight:

- add photo or video
- optionally add a short caption later
- continue with the trip

The module should not interrupt the operational flow.

### At Trip Completion

Trip completion is a natural point for:

- uploading selected media
- reviewing what belongs to the trip
- deciding whether anything should be highlighted in story or follow-up

This should be optional unless a tenant later requires it for specific workflows.

### After Completion

Media often arrives after the trip has ended.

The module should support:

- later uploads
- later cleanup
- later captions or organization
- reuse in story and reporting

## Relationship To Trip Story

Media and story are related but should stay distinct.

- media owns the photos and video
- trip story owns the written narrative and selected presentation later

The story module may reference media, but should not become the source of truth for stored files.

## Relationship To Incidents

Media may support incident review, but it should not replace incident structure.

Examples:

- photo of equipment damage
- image of missing safety item
- video or image linked to a notable event

The incident module owns what happened.
The media module owns the attached visual evidence or context.

## Relationship To Reporting

Most reporting should not automatically include raw trip media.

Instead, reporting may later:

- count whether media exists
- link to selected media where permitted
- include selected media in richer exports later

This keeps the reporting layer from accidentally becoming an uncontrolled media-sharing channel.

## Media Visibility And Privacy

This module needs clearer visibility rules than ordinary trip fields.

Examples of audiences later may include:

- operators only
- all tenant members with trip access
- selected communication editors later
- external-share approved only

This matters because trip media may include:

- minors
- guests
- personally identifying details
- incidents or damage
- location-sensitive content

The product should allow internal attachment without assuming broad sharing rights.

## Upload And Ownership Model

The module should support a simple ownership model.

Useful facts include:

- who uploaded the media
- what trip it belongs to
- when it was added
- optional caption or label
- optional relation to a story or incident later

This gives enough structure for reuse without becoming a full media library product.

## Gallery Model

Each trip may have a gallery that supports:

- ordered browsing
- thumbnail overview
- viewing media in context
- basic captions later
- selected highlights later

The gallery should help users understand the trip, not just dump files in a list.

## Reuse And Selection

Not every media item should be treated the same.

The product should later support ideas such as:

- keep as internal record only
- mark as trip highlight
- reuse in trip story
- attach to incident review
- include in export or external-share flow only if explicitly allowed

This allows media to stay useful without creating accidental publication.

## Tenant Configuration

Tenant settings may later control:

- whether media upload is enabled
- who may upload media
- who may view trip media
- whether captions are supported or required
- whether external-share selection is allowed
- retention or cleanup expectations later

## Business Rules

- Media enriches trips; it does not own trip state.
- Media storage should remain distinct from trip story and incident structure.
- Upload should be lightweight enough for normal club use.
- Media visibility should be more carefully scoped than ordinary trip metadata.
- Reuse of media in story, reporting, or external sharing should be explicit, not automatic.
- The product should support having no media on a trip without degrading the core trip workflow.
