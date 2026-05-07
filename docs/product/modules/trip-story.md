# Trip Story

## Purpose

This module defines how Sail Tracker can store a narrative summary or story for a trip.

It should help clubs preserve memory, communicate the experience, and highlight what mattered about a trip without confusing the story with the operational record itself.

## Why This Is A Module

The trip story is related to:

- trip records
- media
- reporting
- club communication

But it should not own:

- trip lifecycle
- incident structure
- media storage
- calendar state
- formal operational validation

That makes trip story a supporting trip-enrichment module layered on top of the core trip record.

## Core Product Outcome

The product should make it easy to answer:

- what is the narrative summary of this trip
- what should be remembered or shared about it
- who wrote or edited the story
- whether the story is internal-only or intended for broader club communication later
- what media belongs with the story

## Scope

This module covers:

- written trip summary or story
- story editing and revision later
- association of story with selected media later
- basic audience and visibility expectations later
- reuse of trip facts for narrative context

This module does not own:

- the source-of-truth trip record
- incident records
- operational timelines
- raw media storage
- reporting outputs

## Core Concepts

- `trip story`
  A narrative summary associated with a completed trip.
- `story author`
  The person who wrote or curated the story.
- `story excerpt`
  A short summary version used in list or preview contexts later.
- `story visibility`
  The intended audience for the story.
- `story highlight`
  A selected moment, quote, or media item emphasized in the story later.

## Story Versus Operational Record

This distinction should remain clear.

- `operational trip record`
  Answers what happened in structured terms: who, when, which vessel, incidents, return time, and other operational facts.
- `trip story`
  Answers how the trip is remembered, described, or communicated.

The story may draw from the trip record, but it should not replace it.

## Why Story Matters

Trip story is not only a “nice to have”.

For clubs and sea scouts, it may support:

- club memory
- member engagement
- reflection after the trip
- activity highlights for leaders or parents later
- internal communication
- seasonal storytelling and identity

The product should support that value without forcing every trip to become editorial work.

## Relationship To Trip Workflow

The story should sit after the operational core of the trip.

### During Active Trip

The story module should not compete with operations while the trip is underway.

At most, it may support:

- quick note fragments
- remembered highlights later

But the product should not encourage long-form writing during active operations.

### At Trip Completion

Trip completion may be the first useful moment to create a story.

Examples:

- add a short summary
- leave story blank for now
- mark that story should be added later

The story should remain optional unless a tenant later explicitly requires it for some trip types.

### After Completion

This is the natural home of story writing.

The module should support:

- writing the story later
- revising the story later
- selecting media highlights
- refining the narrative after the operational record is already closed

## Structured Summary Versus Free Narrative

The module should support the idea that some clubs want a lighter summary while others want richer storytelling.

Useful levels later include:

- short summary only
- short summary plus optional full text
- richer story with sections such as highlights, lessons, and memorable moments

The product should not force one storytelling style on every tenant.

## Relationship To Media

Story and media are closely connected, but ownership should stay separate.

- media owns the files and gallery
- story owns the narrative and selected presentation context

The story may reference:

- trip highlight photos
- selected videos
- captions or callouts later

But the story should not become the storage model for those files.

## Relationship To Incidents

Incidents may be acknowledged in a story, but the story should not become the incident record.

Examples:

- “we returned early because of wind”
- “an engine issue changed the plan”

That narrative may appear in the story, while the incident module still owns:

- classification
- severity
- follow-up
- sensitive details

## Relationship To Reporting

Trip story may later contribute to reporting or communication outputs, but should remain optional and audience-aware.

Examples:

- highlight in a seasonal summary
- club newsletter-style compilation later
- internal board or leader digest later

Reporting should not assume every trip has a story, and story visibility should not be broader than the tenant intends.

## Story Visibility And Audience

A story may have different audiences than the trip record.

Useful later distinctions include:

- operator/internal only
- all tenant members
- selected communication audience later
- external-share approved later

This matters because the operational record may contain details that do not belong in a broader narrative, and the narrative may intentionally omit sensitive operational detail.

## Authorship And Editing

The module should support clear authorship and later editing.

Useful facts include:

- who wrote the story
- who last edited it
- when it was last updated
- whether it is in draft or ready-to-share form later

This is especially useful if stories become part of club communication rather than only private notes.

## Tenant Configuration

Tenant settings may later control:

- whether trip story is enabled
- whether story is optional or expected for some trip types
- who may write or edit stories
- whether story excerpts are supported
- whether stories may reference selected media
- what visibility levels are available

## Business Rules

- Trip story enriches the trip record; it does not replace it.
- Story should remain distinct from incident records and operational notes.
- Story writing should not slow down the minimum trip flow.
- Media reuse in story should reference the media module rather than duplicate file ownership.
- Story visibility may differ from operational record visibility and should be controlled explicitly.
- A trip should remain complete and useful even if no story is written.
