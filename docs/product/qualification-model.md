# Qualification Model

## Area Purpose

This area defines how Sail Tracker understands whether a person is allowed, recognized, or encouraged to do something in a club.

It exists to separate three different concepts that often get mixed together:

- external certifications
- club-local sailing permissions
- badges or achievement-style progression

Those are related, but they are not the same thing.

## Why This Area Matters

A person may have:

- a nationally recognized sailing certificate
- a club-specific approval to sail in a local area
- a scout badge that recognizes a skill or experience milestone

If the product stores all of those as one generic "qualification", the rules will become unclear.

The system needs to answer questions like:

- Is this person allowed to take this vessel out?
- Is that allowed everywhere or only in a defined local area?
- Is that permission based on an external certificate, a local club approval, or both?
- Has the person earned a badge without that badge automatically granting operational permission?

## Core Product Outcome

The product should make it easy to answer:

- what qualifications a person holds
- which of those are externally issued
- which of those are club-defined
- which of those grant operational permissions
- which of those are recognitions or progression markers only

The default behavior should be registration and validation, not forced approval workflows for every normal action.

## Scope

This area covers:

- qualification catalogs
- certification catalogs
- skills and competency catalogs
- badge catalogs
- member-held certifications
- member-held skills or approvals
- vessel eligibility rules
- sailing-area and operating-limit approvals
- responsible-sailor eligibility

This area does not own:

- sign-in identity
- tenant memberships
- trip lifecycle
- vessel records themselves

It provides the eligibility and recognition model those areas depend on.

## Core Concepts

- `external certification`
  A qualification issued outside the club, such as a national or formal sailing certificate.
- `club approval`
  A tenant-scoped approval granted by the club for operational use.
- `skill`
  A competency the club wants to track, independent of whether it grants permission.
- `badge`
  A recognition or achievement marker, often used for progression, motivation, or scout-program structure.
- `eligibility rule`
  A rule that determines whether a person may act as responsible sailor for a vessel or in a context.
- `operating limit`
  A limit attached to an approval, such as sailing area, vessel class, crew requirement, weather condition, or supervision requirement.

## Qualification Families

This product should treat qualifications as a family of related but distinct models.

### 1. External Certifications

These are public or formally issued certifications, for example in Denmark or another national sailing context.

Examples:

- VHF certificate
- official sailing license
- first aid certificate
- youth leader or safety certification later if relevant

These should support:

- issuing organization
- certificate number later where relevant
- issue and expiry dates
- uploaded proof later if desired
- verification status if the club wants to verify what was submitted

Important rule:

An external certification should not automatically equal club permission.

It may support or satisfy part of a local approval rule, but the club may still want its own sign-off.

### 2. Club-Local Sailing Permissions

These are tenant-scoped operational approvals.

This is where your example fits:

- allowed to sail only within a defined local area
- allowed only on certain vessels
- allowed only in daytime
- allowed only below a certain wind level later
- allowed only with another qualified person onboard later

This should not be framed only as "level 1, level 2" unless the club truly wants that.

The product should model the actual permission meaning, for example:

- approved operating area
- approved vessel types or specific vessels
- supervision requirement
- operating restrictions
- approval source and approver

This area is the real operational bridge between identity and trips.

See also [`local-approvals-and-exceptions.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/local-approvals-and-exceptions.md).

### 3. Skills And Competencies

These are tracked capabilities that may or may not grant direct operational permission.

Examples:

- navigation
- seamanship
- engine handling
- anchoring
- harbor maneuvering
- safety drill competence

Skills are useful because clubs often want to record competence more granularly than certificates or simple approvals.

### 4. Badges

Badges are recognition objects.

For a sea scout context, badges can be:

- official DDS badges
- club-specific badges
- learning and progression markers

Badges may reflect:

- completed activities
- demonstrated skills
- training milestones
- participation achievements

Important rule:

A badge should not automatically grant operational sailing permission unless the club explicitly maps it to a local approval rule.

That keeps recognition separate from safety-critical authorization.

## Registration-First Principle

This area should behave first as a registration system.

That means:

- club management defines qualification, skill, and badge catalogs
- club management records or grants the relevant facts on members
- trip workflows validate against those registered facts

If the data is up to date, a member should be able to use the system without needing an approval flow every time.

Approval and request flows are useful, but they should be optional supporting workflows, not the center of the product.

## Recommended Qualification Structure

The cleanest model is:

1. `catalog definitions`
2. `person-held records`
3. `eligibility and approval rules`

That means the system should distinguish between:

- a catalog entry like "VHF Certificate"
- a person's held certification record
- a club approval that says "may take vessel class X in area Y"
- a badge definition like a DDS badge
- a person's earned badge record

## Qualification Sub-Models

This domain is easier to reason about if it is treated as four connected sub-models.

### 1. Certification Catalogs

These define what kinds of external certifications exist.

Examples:

- Danish sailing certificates
- VHF certificates
- first aid certifications
- federation or instructor certifications later

This is the reference layer, not the person-held layer.

The product should support seeded public certification catalogs.

For this app, a sensible baseline is:

- a Denmark-oriented seeded public certification catalog

That means clubs should not have to create every common public certification manually from scratch.

Instead, the system should support:

- platform-provided public certification definitions
- tenant adoption of those seeded definitions
- tenant-local additions on top of the seeded baseline

Seeded public certifications are shared reference data.
They are not the same thing as tenant-local approvals.

### 2. Person-Held Qualification Records

These store what a specific person actually holds.

Examples:

- a member's VHF certificate
- a member's first aid certificate
- a member's navigation skill assessment
- a member's earned badge

These records should support:

- status
- issue or earned date
- expiry date where relevant
- who verified or approved it
- supporting evidence later where useful

### 3. Club Approval Rules

These define what the club requires before granting operational permission.

Examples:

- must hold certificate X
- must have badge Y and club sign-off
- must complete local harbor introduction
- must be approved by an instructor or owner

This is the policy layer.

### 4. Operational Approval Records

These are the actual approvals granted to a person by the tenant.

Examples:

- may sail vessel class "dinghy" in local bay
- may take vessel "Scout 420" out without supervision
- may lead overnight trips only with second adult onboard

This is the layer the trip workflow should rely on most directly.

Exceptions and one-off overrides are detailed in [`local-approvals-and-exceptions.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/local-approvals-and-exceptions.md).

## Public Certificates Versus Local Approvals

This distinction should be explicit in the product.

### Public Or External Certificate

This answers:

- what formal certification does the person hold
- who issued it
- is it valid

It does not by itself answer:

- may this person take a club vessel out right now

### Local Club Approval

This answers:

- what the club allows this person to do operationally
- on which vessels or vessel classes
- in what areas or under what limits
- under what supervision conditions if any

This is where the product can express local rules such as:

- harbor only
- local waters only
- not beyond a named waypoint
- only with a second qualified sailor
- only on training evenings

## Approval Dimensions

Local approvals should be able to express more than a flat yes/no.

The product should be able to attach some or all of these dimensions to an approval:

- `vessel scope`
  One vessel, vessel class, or all eligible vessels
- `area scope`
  Harbor, bay, local waters, coastal zone, named training area, or unrestricted later
- `time scope`
  Daytime only, seasonal only, or unrestricted
- `crew scope`
  Solo not allowed, must have second qualified sailor, guests allowed or not
- `weather scope`
  Later, clubs may want operational conditions or advisory limits
- `trip type scope`
  Day trips only, training trips only, overnight allowed, event support only
- `supervision scope`
  Instructor required, owner approval required, or unsupervised allowed

These dimensions matter more than generic numeric levels.

## Club Levels As Labels

If a club wants to use named levels, the system should support that.

Examples:

- `level 1`
- `harbor sailor`
- `local approved`
- `coastal approved`

But these should be treated as labels or packages on top of explicit approval meaning.

That way the system can still explain:

- why someone is approved
- what they are approved for
- where the limit actually applies

## Badge Model

Badges should be first-class in this domain, but with different semantics from approvals.

### Badge Catalogs

The product should support:

- official badge catalogs such as DDS badges
- tenant-local badge catalogs
- the possibility that a tenant uses both

Badge definitions should support:

- title
- source system, such as DDS or local
- description
- optional skill or learning outcomes
- optional evidence or completion notes later

### Earned Badges

A person may hold many badges across time.

An earned badge record should support:

- badge definition
- earned date
- awarding source or awarded by
- notes or evidence later if needed

### Badge Usage Rules

Badges may be used for:

- recognition
- learning progression
- scout-program milestones
- encouragement and visibility in profile

Badges should not automatically grant operational permission unless the tenant explicitly maps them into an approval rule.

## DDS And Local Badge Coexistence

The product should assume both can exist at the same time.

That means:

- DDS badges can be part of the catalog
- clubs can define local badges
- clubs can decide which badges they care about
- clubs can decide whether a badge has any role in approval workflows

This is important because scout programs often have one official recognition structure and one local club practice.

## Skills And Competencies

Skills should remain separate from both badges and certifications.

They are useful for things like:

- maneuvering
- navigation
- mooring
- anchoring
- engine handling
- radio use
- safety drills

Some clubs may want to track these directly even if:

- there is no public certification
- no badge exists
- the skill does not itself grant approval

Skills can also be useful as building blocks for local approval decisions.

## Approval Workflow

This domain should support a deliberate local approval flow.

At minimum, the club may need to record:

1. what the person already holds
2. what was assessed locally
3. who granted approval
4. what limits apply
5. when the approval expires or should be reviewed

Possible workflow:

1. member submits or records external certification
2. club verifies it if needed
3. club evaluates local competence
4. club grants an operational approval with limits
5. club later reviews, renews, restricts, or revokes that approval

This flow matters because it keeps certificates, assessments, and operational permission as separate facts.

## Who Can Manage Qualifications

This should be permission-based, not hardcoded by role name.

Examples of people who may be allowed to manage parts of this domain:

- tenant owners
- sea scout leaders
- trainers or instructors
- other club delegates with narrow permissions

The system should let the club decide who may:

- define qualification catalogs
- define skill catalogs
- define badge catalogs
- register held certifications
- grant or revoke local approvals
- verify submitted evidence
- award badges

The product should not assume that every trainer can do every admin action or that every owner is the best person to assess sailing competence.

## Responsible-Sailor Eligibility

This is the most important operational use of this area.

A person should be eligible to act as responsible sailor only when the system can prove the required combination of:

- active tenant membership
- trip-operation permission
- required club approval for the vessel or vessel class
- any required supporting certifications

The product should allow the club to define whether:

- an external certification is enough
- a club approval is always required
- both are required

The system should also be able to explain the result, for example:

- approved because member holds required certificate and local harbor approval
- not approved because overnight approval is missing
- not approved because approval is limited to other vessel classes
- not approved because the local approval has expired

That explanation is important for trust and supportability.

In the normal case, the trip flow should just validate eligibility from registered data.

Only when the person is not already qualified should the club need an exception path such as:

- request qualification review
- request one-off trip approval
- notify trainer or leader for follow-up

## Operating Limits

The qualification model should support local restrictions that are more specific than simple yes/no approval.

Examples:

- may sail only within local harbor area
- may use only beginner vessels
- may sail without instructor only in sheltered waters
- may take guests only after a certain approval
- may lead overnight trips only with additional approval

This is likely more useful than a vague level system on its own.

The product can still support club-defined labels like:

- `intro`
- `harbor-only`
- `coastal`
- `overnight-approved`

But those labels should sit on top of explicit meaning, not replace it.

## Example Scenarios

### Example 1: Public Certificate Plus Local Restriction

A member has a valid Danish sailing certificate.

The club still records:

- approved for training dinghies
- local bay only
- no overnight trips

Result:

The member is recognized as formally certified, but the club's actual operational permission remains narrower.

### Example 2: Badge Without Sailing Permission

A sea scout earns a DDS badge for seamanship.

Result:

- the badge appears in profile and progression history
- the badge may contribute to later evaluation
- the badge alone does not let the scout act as responsible sailor

### Example 3: Local Badge Plus Local Approval

A club has its own "Harbor Ready" badge.

The club may decide:

- the badge shows training completion
- a separate approval from an instructor is still required

Result:

Recognition and permission stay connected but not collapsed into one fact.

### Example 4: Approval Bound To Area

A member is approved to take vessel class `optimist` or `dinghy` out only within the local training waters.

Result:

They may be allowed for some trips and blocked for others depending on route or operating area.

## Badges Versus Permissions

This distinction should be kept sharp:

- `badge`
  Recognition, learning, progression, scouting program
- `permission`
  Operational authority to do something

Sometimes a badge may contribute to a permission decision.

But the product should still model:

- what was earned
- what was approved
- why approval was granted

as separate facts.

## Tenant Configuration

Clubs should be able to configure:

- which certification catalogs they use
- which skill catalogs they use
- which badge systems they use
- whether they adopt official DDS badges, local badges, or both
- which vessel approvals are required
- whether external certifications are sufficient on their own
- what operating limits exist
- whether badges are informational only or may contribute to approval checks
- whether approvals are tied to vessel, vessel class, area, or combined rules
- whether the tenant adopts the seeded Denmark-oriented public certification catalog in full or in part
- which seeded public certifications matter for local approval logic

This configuration belongs to club management, not platform-wide defaults.

## Optional Approval And Notification Flows

The system should support lighter-weight flows around missing qualifications, but they should remain optional.

Examples:

- member asks to be evaluated for a qualification
- member tries to plan a trip and is told they are not yet qualified
- system offers a request or notify flow instead of a hard dead end
- trainer or leader receives a notification that someone needs review
- club grants a one-off approval for a specific trip later if desired

These are useful because they help when data is not yet up to date.

They should not replace the normal registration-first model where members with current qualifications can operate without extra approval steps.

This keeps the product adaptable without turning it into custom software for every club.

## Relationship To Other Product Areas

This area connects directly to:

- [`memberships-and-identity.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/memberships-and-identity.md)
  For who the person is and which club relationship is active.
- [`trip-logging-and-logbook.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/trip-logging-and-logbook.md)
  For responsible-sailor selection and trip validation.
- [`tenant-settings.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/tenant-settings.md)
  For club-specific qualification policy.
- [`identity-access-and-configuration.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/identity-access-and-configuration.md)
  For who may manage qualification, badge, and skill setup.
- platform seed and reference-data setup later
  For the baseline public certification catalog distributed to tenants.
- [`fleet-management.md`](/Users/joncarlsen/code/private/Sail-Tracker/docs/product/fleet-management.md)
  For vessel class, vessel restrictions, and operating compatibility.

## Product Risks

- If external certifications and local approvals are merged, operational trust will be weak.
- If badges are treated as permissions by default, the model may become unsafe.
- If local operating limits are too vague, clubs will end up tracking the real rule outside the system.
- If the model is too rigid, clubs will not be able to express their local approval practice.
- If the model is too loose, eligibility checks will become inconsistent.
- If approval workflows become mandatory for normal sailing, the product will add friction instead of reducing it.
- If seeded public certifications are not clearly separated from tenant-local approvals, clubs will confuse what is official versus what is locally granted.

## Evaluation Questions

- Is the distinction between certification, approval, skill, and badge clear enough?
- Can a club express local sailing-area restrictions cleanly?
- Can official and local badge systems coexist without confusion?
- Can the system explain why a person is or is not allowed to take a vessel out?
- Are we modeling explicit operating limits instead of vague labels only?

## What Would Sharpen This Further

The next most useful clarifications would be:

- what official certifications matter most in your clubs
- what kinds of local operating limits are common in practice
- whether approvals are tied more to vessel, vessel class, area, weather, or supervision
- whether DDS badges are mostly recognition, or should affect permissions in some cases
- whether clubs want one approval model for all members or different tracks for youth leaders, instructors, and independent sailors
- whether badge catalogs should be multilingual from day 0
- whether approvals should support review dates separate from hard expirations
- whether notification flows should notify only assigned trainers or a broader club-management group
- which public Denmark-oriented certifications should be included in the initial seeded catalog

## One Module Or Several

This is one core domain area, but it likely contains several sub-models:

- certifications
- local approvals
- skills
- badges

So I would not split it into many separate top-level product areas yet.

I would treat it as one qualification domain with clearly separated sub-models inside it.
