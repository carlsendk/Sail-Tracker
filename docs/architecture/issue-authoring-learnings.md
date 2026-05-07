# Issue Authoring Learnings

Captured from generating the 14 Phase 0 ("Code Quality Foundation") issues. These are the rules of thumb that should drive Phase B (Infra) and Phase C (Product) issue creation. The aim is consistency and so an agent picking up any issue from any phase finds the same shape and the same surrounding metadata.

## What every issue must have

| Surface | Field / value |
|---|---|
| Repo label `state:*` | exactly one of `state:ready`, `state:in-progress`, `state:in-review`, `state:blocked` |
| Repo label `type:*` | one of `type:infra`, `type:feature`, `type:bug`, `type:chore`, `type:docs`, `type:spike` |
| Repo label `domain:*` | one matching the project Domain field option (see "Domain parity" below) |
| Repo label `agent:auto-pickable` | required for `/work-next` to claim it |
| Repo label `priority:*` | `priority:p0`, `priority:p1`, or `priority:p2` |
| Milestone | exactly one of the 8 milestones (`Foundations` for Phase 0 + Infra-1..4; `Tier-1` … `Tier-7` for product) |
| Project Tier | finer-grained than milestone — `Phase-0`, `Infra-1`, `Infra-2`, `Infra-3`, `Infra-4`, or `Tier-1` … `Tier-7`. The Tier field is what the project board's Roadmap/Phase views group on. |
| Project Status | `Ready` (initial), driven by `state:*` label thereafter |
| Project Domain | one of: members, fleet, trips, equipment, qualifications, platform, backbone, cross-cutting, modules, infra |
| Project Estimate | `S`, `M`, or `L` — see sizing rubric below |
| Body | all 8 sections of the agent-task template, self-contained |

## Body shape (8 sections)

Lifted verbatim from `.github/ISSUE_TEMPLATE/agent-task.yml`. Every issue body must include:

1. **Goal** — one sentence describing what the issue produces.
2. **Context** — 2–3 sentences. Where this fits, why now, what depends on it.
3. **Embedded Spec** — full quoted excerpt from the source doc, plus any data-model or constraint section that affects implementation. Self-contained — an agent should not need to fetch external docs to implement.
4. **Files** — explicit `Create:` / `Modify:` / `Test:` paths. Include line ranges for modifications when known.
5. **Acceptance Criteria** — testable behaviors as checkboxes; the spec reviewer subagent uses these verbatim.
6. **TDD Steps** — 5–8 numbered steps following write-test → run → implement → run → commit.
7. **Definition of Done** — `pnpm validate` green, PR with `Closes #<N>`, both reviewer subagents approve.
8. **Source** — link to source doc + `Depends on:` line referencing other issues by `#N` (comma-separated).

## Sizing rubric (Estimate field)

| Estimate | Heuristic | Examples from Phase 0 |
|---|---|---|
| S | Single config file or rule; ≤ 2 file diff; mechanical | B4 (no-inline-SVG rule), B14 (coverage thresholds) |
| M | 2–5 files; some integration risk; 30–60 min agent session | most Phase 0 issues |
| L | New tool category, multi-file wiring, may surface real violations to fix | B2 (full ESLint config), B10 (4 monorepo tools), B13 (full CI workflow), B14 here would be S since it's just a config block |

When in doubt: **prefer S over M, M over L**. A small issue that turns out to need follow-up is fine; a large issue that an agent gets bogged down in is expensive.

## Dependency wiring

`Depends on:` is parsed by `.claude/skills/work-next/SKILL.md`. Format strictly:

```
- Depends on: #5, #6, #7
```

Or, if no deps:

```
- Depends on: none
```

**Author bodies first with logical placeholders** (`B2`, `B7`) — substitute real `#N` references AFTER all issues are created and you know the numbers, then `gh issue edit --body-file` each affected issue. Do NOT commit body files with `B<N>` placeholders to git; commit only the resolved `#N` form so the source-of-truth files match what's live on GitHub.

## Title prefix convention

`[<group>] <short imperative>`. The group is currently:

- `[infra]` for infrastructure / monorepo / CI / dev-tooling (anything in milestone `Foundations`, regardless of Tier value)
- For product issues: prefix with the most specific domain segment (e.g. `[trips]`, `[fleet]`, `[members]`)

The prefix is **separate** from the labels — labels are the source of truth for filtering, the title prefix is for human eyeballing.

## Domain parity

The repo's `domain:*` label set must exactly match the project's Domain field options. If a Domain option exists without a matching label (or vice versa), `/work-next --domain X` filtering breaks. Phase 0 surfaced this: project had `infra`, repo did not. We added `domain:infra` to fix.

When introducing a new domain in either place, update both:

- `scripts/gh-bootstrap-labels.sh` — add to the `LABELS` array
- `scripts/gh-bootstrap-project.sh` (or by hand if already provisioned) — add to the Domain field options

## Process learnings (do these things, in this order)

1. **Smoke-test the first issue before fanning out.** Author B1's body file → create the GH issue → render via `gh issue view` → confirm all 8 sections render as expected → only then batch the rest. Fixing 14 issues with a misshapen body is 14× the work.

2. **Set ALL custom fields, not just the obvious ones.** Setting Tier and Status only (and forgetting Domain and Estimate) leaves the Roadmap/Domain views half-empty. Plan to do all four every time.

3. **PAT scope check before relying on automation.** The `project-automation.yml` workflow needs the `PROJECT_PAT` secret to have **Account-level Projects (read/write)** for user-owned projects — repo-level project permission is not enough. The error you'll see is `Resource not accessible by personal access token (user.projectV2)`. Until that's fixed, all custom-field assignment must be done manually using the operator's `gh auth` token, which already has the `project` scope.

4. **GraphQL is the only reliable way to set project fields.** `gh project item-edit` shells to GraphQL but does honor the user's gh auth scope, which works locally even when the workflow PAT is scoped wrong. For bulk assignment, drive `gh project item-edit` from a `bash -c` block (zsh does not word-split unquoted variables, so the `for x in $LIST` idiom silently passes the entire string as one arg).

5. **`gh api -X PUT` cannot construct deeply nested objects via `-F` flags.** When the body needs a nested object with optional `null` siblings (e.g. `branches/.../protection`), pipe a JSON document through `--input -` instead. Do not try to coerce nested objects via dot-notation `-F` flags; you'll get the cryptic "subschema didn't match" error.

6. **Pre-commit hook runs `pnpm validate`.** Any work-in-progress lint/type/test breakage will block the commit. Either commit incrementally with green steps, or stage only the clean files and leave the rest for a follow-up commit. `--no-verify` is forbidden by branch protection rules and the agent workflow.

## Operator-driven prerequisites the agent cannot do

For each new milestone batch, the operator must:

1. Provision (or rotate) `PROJECT_PAT` if scope was wrong last time.
2. Confirm the project has the Tier / Domain / Estimate options the upcoming issues will use; add new options via GraphQL (`updateProjectV2Field`) if missing — `gh` CLI does not support editing built-in or custom field options.
3. Tighten branch protection only after the named status checks have run at least once on `main` (otherwise GH rejects the PUT).

## Open questions to resolve before Phase B starts

- Do Infra (Phase 1–4) issues use `domain:infra` or do we add `domain:database`, `domain:deploy`? **Tentative**: keep `domain:infra` until cardinality justifies splitting.
- Should `priority:*` reflect dependency depth or operator urgency? **Tentative**: dependency depth (root deps = p0, leaf-most = p2) so that breadth-first pickup naturally drains the bottom of the graph.

## Lint policy: zero warnings, no rules disabled at config level

When an issue introduces or extends a static-analysis ruleset (ESLint, Stylelint, markdownlint, cspell, commitlint, etc.), the issue MUST end with the linter exiting **0 warnings AND 0 errors**, all enabled rules at `'error'` severity, and no rule set to `'off'` in config to silence violations.

**Curation = choose which rules to enable** before enabling them. If a plugin's `recommended` preset includes rules that don't apply to the codebase (e.g. `react/react-in-jsx-scope` under Next 15's automatic JSX runtime), use a more specific preset that already excludes them (`react.configs['jsx-runtime']`) or hand-curate the rule list. Don't apply the noisy preset and then override individual rules to `'off'`.

**Don't split "wiring" from "fixing".** Each lint/quality issue owns both: enabling its rules AND clearing every violation those rules surface. If the violation count from a pre-flight check is too large for one issue, escalate scope to the operator BEFORE dispatching the implementer — propose splitting the rule set into multiple issues, each with their own clean-to-zero contract.

**Inline `// eslint-disable-next-line <rule> -- <justification>` IS acceptable** when a specific violation reflects intentional design (e.g. `react-hooks/rules-of-hooks` violation in test code that explicitly tests hook misuse). Blanket config-level `'rule': 'off'` is not.

This was learned the hard way during B2 (#6): the original issue body said "violations are expected; this issue is about wiring not a clean run." That framing produced a config with 620 surfaced warnings, all rules at `'warn'` severity, which the operator rejected. The reauthored B2 body curates which rules to enable up-front (drops `react/react-in-jsx-scope` as wrong-for-stack, defers Prettier-overlap formatting rules to B7, enables the rest at `'error'`) and requires the implementer to clean up to zero. The `agent-task.yml` Definition of Done now spells out this contract.

## End-to-end workflow validation (issue #5, B1, PR #20)

The first run of the `work-next → subagent-driven-development` pipeline succeeded on the first try — implementer + spec reviewer + code reviewer each approved without re-dispatch. Captured outcomes worth carrying forward:

1. **Pre-flight blast-radius check is cheap and high-value.** Before dispatching the implementer for any issue that introduces a new lint/strict rule, run the rule on the codebase yourself and count violations. For B1 (strict tsconfig flags), this took ~30 seconds and gave the implementer concrete scope expectations ("expect ~1 violation, in `lib/tenant-context.ts`"). For Phase B/C issues that introduce new rules (e.g. ESLint plugins, boundary rules), do the same. Format the result as a "Heads-up" line in the dispatch prompt — it short-circuits hours of speculative subagent exploration.

2. **Sonnet was correct for B1.** Mechanical config + one narrowing fix. Reserve more capable models for issues that need architectural decisions or multi-file refactors.

3. **The body shape held up.** All 8 sections were used by the subagents. The "TDD Steps" section was the single most-referenced part — implementer followed it almost verbatim. Spec reviewer used "Acceptance Criteria" as the checklist. Code reviewer leaned on "Goal" + "Embedded Spec" for context.

4. **A spec gap surfaced that wasn't visible in authoring**: `packages/*` have no `typecheck` script or own `tsconfig.json`, so B1's strict flags only protect `apps/web` today. The acceptance criterion ("`pnpm typecheck` clean across workspace") is met *literally* (typecheck filters to `web`) but not *intentionally*. **Lesson**: when an issue claims workspace-wide effect, the body should explicitly check that the workspace-wide invariant holds, not just rely on `pnpm <script>` succeeding. Fix forward: add a follow-up issue (B1.1: per-package `tsconfig.json` extending base + `typecheck` script) before B2/B3 land.

5. **Pre-commit hook discipline confirmed**: `pnpm validate` ran via `git commit` and gated the work. No `--no-verify` needed or used. Phase B/C bodies should not bother re-saying "run validate before committing" — the hook handles it.

6. **`flip-on-pr-open` is broken until PAT rotates.** Don't trust automation to flip `state:in-progress` → `state:in-review` on PR open. The controller (you) must manually flip until the PAT is fixed. Phase B/C issue bodies don't need to mention this — it's an operator concern.
