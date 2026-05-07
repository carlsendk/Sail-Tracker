# Sail-Tracker Agent-Driven Backlog Bootstrap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to execute this plan. Phase A is sequential (one task at a time). Phases B–D dispatch parallel subagents per tier/phase. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Stand up a complete, agent-consumable GitHub backlog (labels + 12 milestones + project board + ~150 issues) generated from `docs/plans/plan.md` and `docs/product/plan.md`, plus a hard code-quality bar that every agent-produced PR must clear, plus the conventions that let any Claude Code agent pull → implement → test → PR an issue without human ceremony.

**Architecture:**
- `gh` CLI for all GitHub operations; no custom backend
- Each issue body is a self-contained mini-plan (embedded spec, files, TDD steps, acceptance criteria) so the agent never needs to fetch the source doc
- State-machine labels (`state:ready` → `state:in-progress` → `state:in-review`) drive a Projects v2 board with five role-specific views
- A new "Phase 0: Code Quality Foundation" lands strict TypeScript + ESLint + Prettier + Stylelint + commitlint + husky + CI before any product work begins
- Branch protection on `main` requires the Phase-0 status checks to pass before any PR can merge
- A repo-local `.claude/skills/work-next` skill encapsulates `gh issue list → label flip → branch → dispatch subagent`, usable manually today and by `/schedule` later

**Tech Stack:**
- TypeScript (strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`)
- Next.js 15 / Nextra (existing) on Node 22 / pnpm 10 monorepo (`apps/*`, `packages/*`)
- Vitest (existing) + React Testing Library + Playwright (to add)
- Supabase (planned via existing infra plan)
- ESLint flat config (~20 plugins, see Phase 0 task list) + Prettier + Stylelint
- Husky + lint-staged + commitlint
- markdownlint, cspell, syncpack, manypkg
- gitleaks + audit-ci + CodeQL on CI
- GitHub Actions for CI + project automation

**Decisions confirmed up front:**
1. Project automation workflow auto-syncs Status field with `state:*` labels — yes
2. Branch protection on `main` enabled (after Phase 0 CI lands) — yes
3. `/work-next` lives in `.claude/skills/work-next/` (project-local, committed) — yes
4. Issue spec embedding = full "What it does + Scope" section of source doc — yes
5. Phase 0 (Code Quality Foundation) is added to infra plan and lands first — yes
6. Comprehensive linting: TypeScript strict, ESLint (~20 plugins incl. JSDoc, perfectionist, MDX, security), markdownlint, cspell, no inline SVG, testid for interactive elements, eslint-plugin-boundaries for layer enforcement — yes

---

## Files Created or Modified

### Repo files (Phase A + Phase 0 issues)
- `eslint.config.mjs` (root + `apps/web/eslint.config.mjs`)
- `prettier.config.mjs`, `.prettierignore`
- `stylelint.config.mjs`, `.stylelintignore`
- `.markdownlint.jsonc`, `.markdownlintignore`
- `cspell.config.yaml`
- `commitlint.config.mjs`
- `.lintstagedrc.json`
- `.husky/pre-commit`, `.husky/commit-msg`
- `.editorconfig`
- `tsconfig.base.json` — add `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch`
- `dependency-cruiser.config.mjs`
- `knip.config.ts`
- `syncpack.config.mjs`
- `.github/ISSUE_TEMPLATE/agent-task.yml`
- `.github/ISSUE_TEMPLATE/bug.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/CODEOWNERS`
- `.github/workflows/ci.yml`
- `.github/workflows/project-automation.yml`
- `.github/workflows/codeql.yml`
- `.github/dependabot.yml` (or `renovate.json`)
- `.gitleaks.toml`
- `.claude/skills/work-next/SKILL.md`
- `docs/architecture/agent-workflow.md`
- `docs/architecture/code-quality.md`
- `docs/plans/plan.md` — insert Phase 0 ahead of existing Phases 1–4

### GitHub state created
- ~25 labels across `state:`, `type:`, `domain:`, `agent:`, `priority:` namespaces
- 12 milestones: Phase 0, Infra-1..4, Tier-1..7
- 1 Projects v2 board (`Sail-Tracker Backlog`) with 5 views
- Branch protection rule on `main`
- ~150 issues (Phase 0: ~14, Infra: ~18, Product: ~120)

---

## Phase A: Repository Scaffolding (sequential, no parallelism)

This phase only writes config files, GitHub metadata, and conventions. No product code touched.

### Task A1: Audit existing GitHub state

**Files:** none

- [ ] **Step 1: Inspect current labels, milestones, issues, projects**

```bash
gh label list --repo carlsendk/Sail-Tracker --limit 200 > /tmp/sail-labels.txt
gh issue list --repo carlsendk/Sail-Tracker --state all --limit 200 --json number,title,labels > /tmp/sail-issues.json
gh api repos/carlsendk/Sail-Tracker/milestones --jq '.[].title' > /tmp/sail-milestones.txt
gh project list --owner carlsendk --format json > /tmp/sail-projects.json
```

Expected: any pre-existing state surfaced for review before we mutate.

- [ ] **Step 2: Decide reconciliation strategy**

If labels/milestones/issues already exist, decide per-item: keep, rename, or delete. Document the decision inline in this plan before proceeding to A2.

- [ ] **Step 3: Commit the audit notes**

```bash
git add docs/plans/2026-05-07-agent-backlog-bootstrap.md
git commit -m "chore(plan): record pre-existing GH state for backlog bootstrap"
```

---

### Task A2: Create the label set

**Files:** `scripts/gh-bootstrap-labels.sh`

- [ ] **Step 1: Write the label-creation script**

```bash
#!/usr/bin/env bash
set -euo pipefail
REPO="carlsendk/Sail-Tracker"

declare -A LABELS=(
  # state machine
  ["state:ready"]="0E8A16|Agent can pick up; no blockers"
  ["state:in-progress"]="FBCA04|Agent actively working"
  ["state:in-review"]="1D76DB|PR open; awaiting review"
  ["state:blocked"]="B60205|Cannot proceed; see comment"
  # type
  ["type:feature"]="A2EEEF|New product capability"
  ["type:infra"]="C5DEF5|Pipeline / env / CI"
  ["type:test"]="BFD4F2|Test coverage"
  ["type:docs"]="D4C5F9|Documentation"
  ["type:refactor"]="FEF2C0|Internal cleanup"
  ["type:chore"]="EEEEEE|Misc maintenance"
  # domain
  ["domain:members"]="FF7F50|Membership, permissions"
  ["domain:fleet"]="20B2AA|Vessels, classes, readiness"
  ["domain:trips"]="9370DB|Trips, manifests, departure"
  ["domain:equipment"]="FFA500|Equipment, lending"
  ["domain:qualifications"]="DC143C|Certs, approvals, skills"
  ["domain:platform"]="708090|Tenants, admin, support"
  ["domain:backbone"]="4682B4|Calendar, search, tasks, notifications"
  ["domain:cross-cutting"]="556B2F|Dashboard, profile, harbors, PWA"
  ["domain:modules"]="DAA520|Weather, incidents, route, media, story, reporting"
  # agent
  ["agent:auto-pickable"]="00FF00|Self-contained; agent runs solo"
  ["agent:needs-human-input"]="FFD700|Has open questions"
  # priority
  ["priority:p0"]="B60205|Critical path"
  ["priority:p1"]="D93F0B|Important"
  ["priority:p2"]="FBCA04|Nice to have"
)

for name in "${!LABELS[@]}"; do
  IFS="|" read -r color desc <<< "${LABELS[$name]}"
  gh label create "$name" --color "$color" --description "$desc" --repo "$REPO" --force
done
```

- [ ] **Step 2: Run the script**

```bash
chmod +x scripts/gh-bootstrap-labels.sh
./scripts/gh-bootstrap-labels.sh
```

- [ ] **Step 3: Verify**

```bash
gh label list --repo carlsendk/Sail-Tracker --limit 50 | grep -cE "^state:|^type:|^domain:|^agent:|^priority:"
```

Expected: count = 25.

- [ ] **Step 4: Commit**

```bash
git add scripts/gh-bootstrap-labels.sh
git commit -m "chore(gh): add label bootstrap script"
```

---

### Task A3: Create the 12 milestones

**Files:** `scripts/gh-bootstrap-milestones.sh`

- [ ] **Step 1: Write the script**

```bash
#!/usr/bin/env bash
set -euo pipefail
REPO="carlsendk/Sail-Tracker"

MILESTONES=(
  "Phase 0: Code Quality Foundation|Strict TS, ESLint, Prettier, Stylelint, markdownlint, cspell, commitlint, husky, CI, branch protection."
  "Infra-1: Local Supabase|Reproducible local dev path via Supabase CLI."
  "Infra-2: Env Contract Cleanup|One hosted contract, one local contract, resolver layer, no legacy fallbacks."
  "Infra-3: CI Database Validation|Migrations + seed run on fresh local Supabase in Actions."
  "Infra-4: Production Deploy Flow|Coordinated Supabase + Vercel rollout with smoke checks."
  "Tier-1: Foundation|Membership, permissions, calendar."
  "Tier-2: Core Domains|Vessel registry, trip planning, equipment registry, manifest."
  "Tier-3: Qualifications|Certifications catalog, local approvals."
  "Tier-4: Operational Features|Trip departure validation, completion, vessel classes, readiness, equipment assignment."
  "Tier-5: Cross-Cutting|Dashboard, profile, harbors, search, notifications, tasks."
  "Tier-6: Enrichment Modules|Weather, route, incidents, media, trip-story, reporting, recurring trips, lending, skills."
  "Tier-7: Platform & Modes|Tenant bootstrap, settings, platform admin, impersonation, seeded catalog, import/export, kiosk."
)

for entry in "${MILESTONES[@]}"; do
  title="${entry%%|*}"
  desc="${entry##*|}"
  gh api -X POST "repos/$REPO/milestones" \
    -f title="$title" -f description="$desc" -f state=open || true
done
```

- [ ] **Step 2: Run and verify**

```bash
chmod +x scripts/gh-bootstrap-milestones.sh
./scripts/gh-bootstrap-milestones.sh
gh api "repos/carlsendk/Sail-Tracker/milestones?per_page=20" --jq 'length'
```

Expected: 12.

- [ ] **Step 3: Commit**

```bash
git add scripts/gh-bootstrap-milestones.sh
git commit -m "chore(gh): add milestone bootstrap script"
```

---

### Task A4: Create the Project + custom fields

**Files:** `scripts/gh-bootstrap-project.sh`

- [ ] **Step 1: Create project + fields**

```bash
#!/usr/bin/env bash
set -euo pipefail
OWNER="carlsendk"

PROJECT_NUMBER=$(gh project create --owner "$OWNER" --title "Sail-Tracker Backlog" --format json | jq -r '.number')
echo "PROJECT_NUMBER=$PROJECT_NUMBER" > scripts/.gh-project.env

gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name "Tier" --data-type SINGLE_SELECT \
  --single-select-options "Phase-0,Infra-1,Infra-2,Infra-3,Infra-4,Tier-1,Tier-2,Tier-3,Tier-4,Tier-5,Tier-6,Tier-7"

gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name "Domain" --data-type SINGLE_SELECT \
  --single-select-options "members,fleet,trips,equipment,qualifications,platform,backbone,cross-cutting,modules,infra"

gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name "Estimate" --data-type SINGLE_SELECT \
  --single-select-options "S,M,L"

# Append the IDs we'll need for automation to .gh-project.env
gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
  | jq -r '.fields[] | "FIELD_ID_\(.name | ascii_upcase | gsub("[^A-Z0-9]"; "_"))=\(.id)"' \
  >> scripts/.gh-project.env

# Status field option ids (built-in field)
gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
  | jq -r '.fields[] | select(.name=="Status") | .options[] | "STATUS_OPT_\(.name | ascii_upcase | gsub("[^A-Z0-9]"; "_"))=\(.id)"' \
  >> scripts/.gh-project.env
```

- [ ] **Step 2: Document the 5 views (manual UI step — `gh` CLI does not yet create views)**

After the script runs, open the project in the GH UI and create these views:
1. **Board** — Kanban grouped by Status: Backlog / Ready / In Progress / In Review / Done
2. **Roadmap** — Timeline grouped by Tier
3. **Agent Queue** — Table filtered to `state:ready`, sorted by Tier asc then Priority asc
4. **By Domain** — Table grouped by Domain
5. **Blocked** — Table filtered to `state:blocked`

This step is captured as a checklist in `docs/architecture/agent-workflow.md` (Task A9).

- [ ] **Step 3: Commit**

```bash
git add scripts/gh-bootstrap-project.sh scripts/.gh-project.env
git commit -m "chore(gh): bootstrap project + custom fields"
```

---

### Task A5: Issue templates

**Files:**
- Create: `.github/ISSUE_TEMPLATE/agent-task.yml`
- Create: `.github/ISSUE_TEMPLATE/bug.yml`
- Create: `.github/ISSUE_TEMPLATE/config.yml`

- [ ] **Step 1: `config.yml`**

```yaml
blank_issues_enabled: false
contact_links:
  - name: Discussion / open question
    url: https://github.com/carlsendk/Sail-Tracker/discussions
    about: Use Discussions for design questions, not bug-bot tickets.
```

- [ ] **Step 2: `agent-task.yml`**

```yaml
name: Agent task
description: A self-contained, agent-implementable unit of work
title: "[<domain>] <short imperative>"
labels: ["state:ready"]
body:
  - type: markdown
    attributes:
      value: |
        Every section below is required. The body must be self-contained — an agent should not need to read external docs.
  - type: textarea
    id: goal
    attributes:
      label: Goal
      description: One sentence — what this issue produces.
    validations:
      required: true
  - type: textarea
    id: context
    attributes:
      label: Context
      description: 2-3 sentences. Where this fits, why now, what depends on it.
    validations:
      required: true
  - type: textarea
    id: spec
    attributes:
      label: Embedded Spec
      description: Full "What it does + Scope" section copied verbatim from the source doc.
    validations:
      required: true
  - type: textarea
    id: files
    attributes:
      label: Files
      value: |
        - Create: `path/a.ts`
        - Modify: `path/b.ts:LL-LL`
        - Test: `path/__tests__/a.test.ts`
    validations:
      required: true
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance Criteria
      description: Each line a testable behavior. The spec reviewer subagent uses this verbatim.
      value: |
        - [ ] criterion 1
        - [ ] criterion 2
    validations:
      required: true
  - type: textarea
    id: tdd
    attributes:
      label: TDD Steps
      value: |
        1. Write failing test at `path/__tests__/a.test.ts`
        2. Run `pnpm vitest run path/__tests__/a.test.ts` → expect FAIL
        3. Implement minimal code in `path/a.ts`
        4. Re-run → expect PASS
        5. Commit `feat(<domain>): <message>`; PR `Closes #<this-issue>`
    validations:
      required: true
  - type: textarea
    id: dod
    attributes:
      label: Definition of Done
      value: |
        - [ ] `pnpm validate` green locally
        - [ ] PR opened with `Closes #<N>`
        - [ ] Spec reviewer subagent approval
        - [ ] Code quality reviewer subagent approval
    validations:
      required: true
  - type: textarea
    id: source
    attributes:
      label: Source
      description: Link to source doc + dependency hints.
      value: |
        - Spec: `docs/product/.../foo.md`
        - Depends on: #X, #Y
    validations:
      required: true
```

- [ ] **Step 3: `bug.yml`**

```yaml
name: Bug report
description: Something broken in shipped code
labels: ["type:chore", "state:ready"]
body:
  - type: textarea
    id: what
    attributes:
      label: What's broken
    validations:
      required: true
  - type: textarea
    id: repro
    attributes:
      label: Reproduction
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
    validations:
      required: true
```

- [ ] **Step 4: Verify**

After pushing, open `https://github.com/carlsendk/Sail-Tracker/issues/new/choose` — both templates listed; blank issue not offered.

- [ ] **Step 5: Commit**

```bash
git add .github/ISSUE_TEMPLATE/
git commit -m "chore(gh): add agent-task and bug issue templates"
```

---

### Task A6: PR template + CODEOWNERS

**Files:**
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/CODEOWNERS`

- [ ] **Step 1: PR template**

````markdown
Closes #<issue-number>

## Summary
- <one bullet per substantive change>

## Files changed
- `path/a` — what changed and why
- `path/b` — what changed and why

## Test evidence
```
pnpm validate
# paste relevant output excerpt
```

## Reviewer checklist
- [ ] Acceptance criteria from the linked issue all checked
- [ ] No unrelated diff
- [ ] Lint, typecheck, tests all green in CI
````

- [ ] **Step 2: CODEOWNERS**

```
# Default
*           @carlsendk

# Plans + product docs require author review
/docs/plans/        @carlsendk
/docs/product/      @carlsendk
/.github/           @carlsendk
/.claude/           @carlsendk
```

- [ ] **Step 3: Commit**

```bash
git add .github/PULL_REQUEST_TEMPLATE.md .github/CODEOWNERS
git commit -m "chore(gh): add PR template and CODEOWNERS"
```

---

### Task A7: Project automation workflow

**Files:**
- `.github/workflows/project-automation.yml`
- `scripts/gh-sync-status.mjs`

- [ ] **Step 1: Workflow**

```yaml
name: Project automation
on:
  issues:
    types: [opened, labeled, unlabeled, closed, reopened]
  pull_request:
    types: [opened, ready_for_review, closed, reopened]

permissions:
  issues: write
  pull-requests: write
  repository-projects: write

jobs:
  add-to-project:
    if: github.event_name == 'issues' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v1.0.2
        with:
          project-url: https://github.com/users/carlsendk/projects/${{ vars.PROJECT_NUMBER }}
          github-token: ${{ secrets.PROJECT_PAT }}

  sync-status-from-labels:
    if: github.event_name == 'issues' && (github.event.action == 'labeled' || github.event.action == 'unlabeled')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Map state:* label → Status field
        env:
          GH_TOKEN: ${{ secrets.PROJECT_PAT }}
          PROJECT_NUMBER: ${{ vars.PROJECT_NUMBER }}
          PROJECT_OWNER: carlsendk
        run: |
          node scripts/gh-sync-status.mjs \
            --issue "${{ github.event.issue.number }}" \
            --label "${{ github.event.label.name }}" \
            --action "${{ github.event.action }}"

  flip-on-pr-open:
    if: github.event_name == 'pull_request' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    steps:
      - name: Mark linked issue state:in-review
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          ISSUE=$(gh pr view "${{ github.event.pull_request.number }}" --repo carlsendk/Sail-Tracker --json closingIssuesReferences --jq '.closingIssuesReferences[0].number')
          if [ -n "$ISSUE" ]; then
            gh issue edit "$ISSUE" --repo carlsendk/Sail-Tracker \
              --remove-label "state:in-progress" \
              --add-label "state:in-review" || true
          fi
```

- [ ] **Step 2: Helper `scripts/gh-sync-status.mjs`** — uses `execFileSync` with arg arrays (no shell), validates the issue number is numeric, no string interpolation into shell commands.

```js
#!/usr/bin/env node
// Map a state:* label change to the project's Status custom field.
// SAFETY: every external value is passed via execFileSync arg arrays;
// nothing is interpolated into a shell. Issue number is validated as integer.
import { parseArgs } from "node:util";
import { execFileSync } from "node:child_process";

const { values } = parseArgs({
  options: {
    issue: { type: "string" },
    label: { type: "string" },
    action: { type: "string" },
  },
});

const STATE_TO_STATUS = {
  "state:ready": "Ready",
  "state:in-progress": "In Progress",
  "state:in-review": "In Review",
  "state:blocked": "Blocked",
};

if (!values.label?.startsWith("state:")) process.exit(0);
if (values.action !== "labeled") process.exit(0);

const status = STATE_TO_STATUS[values.label];
if (!status) process.exit(0);

const issueNumber = Number(values.issue);
if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
  console.error("Invalid issue number:", values.issue);
  process.exit(1);
}

const owner = process.env.PROJECT_OWNER;
const projectNumber = process.env.PROJECT_NUMBER;
if (!owner || !projectNumber) {
  console.error("PROJECT_OWNER and PROJECT_NUMBER env vars required");
  process.exit(1);
}

function gh(args) {
  return execFileSync("gh", args, { encoding: "utf8" });
}

// Resolve the project item id for this issue
const itemList = JSON.parse(
  gh(["project", "item-list", projectNumber, "--owner", owner, "--format", "json", "--limit", "500"])
);
const item = itemList.items.find((i) => i.content?.number === issueNumber);
if (!item) {
  console.log(`Issue #${issueNumber} not in project; nothing to do.`);
  process.exit(0);
}

// Resolve Status field id and the option id matching `status`
const fieldList = JSON.parse(
  gh(["project", "field-list", projectNumber, "--owner", owner, "--format", "json"])
);
const statusField = fieldList.fields.find((f) => f.name === "Status");
if (!statusField) {
  console.error("Status field not found on project");
  process.exit(1);
}
const option = statusField.options.find((o) => o.name === status);
if (!option) {
  console.error(`Status option not found: ${status}`);
  process.exit(1);
}

const projectId = itemList.items[0]?.projectId ?? null;
if (!projectId) {
  console.error("Could not resolve project id from item list");
  process.exit(1);
}

gh([
  "project", "item-edit",
  "--id", item.id,
  "--field-id", statusField.id,
  "--project-id", projectId,
  "--single-select-option-id", option.id,
]);
console.log(`Set issue #${issueNumber} Status → ${status}`);
```

- [ ] **Step 3: Provision a `PROJECT_PAT` secret + `PROJECT_NUMBER` variable**

Manual:
1. Create a fine-grained PAT with `Projects: Read/Write` and `Issues: Read/Write`
2. `gh secret set PROJECT_PAT --body "<token>" --repo carlsendk/Sail-Tracker`
3. Read `PROJECT_NUMBER` from `scripts/.gh-project.env` → `gh variable set PROJECT_NUMBER --body "<n>" --repo carlsendk/Sail-Tracker`

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/project-automation.yml scripts/gh-sync-status.mjs
git commit -m "chore(gh): wire project automation for status sync"
```

---

### Task A8: Branch protection on `main` (deferred until CI lands)

**Files:** `scripts/gh-bootstrap-branch-protection.sh`

- [ ] **Step 1: Write the script**

```bash
#!/usr/bin/env bash
set -euo pipefail
REPO="carlsendk/Sail-Tracker"

gh api -X PUT "repos/$REPO/branches/main/protection" \
  -F required_status_checks.strict=true \
  -F "required_status_checks.contexts[]=lint" \
  -F "required_status_checks.contexts[]=typecheck" \
  -F "required_status_checks.contexts[]=test" \
  -F "required_status_checks.contexts[]=knip" \
  -F "required_status_checks.contexts[]=dep-cruise" \
  -F "required_status_checks.contexts[]=markdownlint" \
  -F "required_status_checks.contexts[]=cspell" \
  -F "required_status_checks.contexts[]=gitleaks" \
  -F enforce_admins=false \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -F restrictions=null \
  -F allow_force_pushes=false \
  -F allow_deletions=false
```

> **Sequencing:** Commit the script now; **execute it after Phase 0 issue B11 (CI workflow) is merged** so the named status checks exist. Otherwise GH rejects the request.

- [ ] **Step 2: Commit the script**

```bash
git add scripts/gh-bootstrap-branch-protection.sh
git commit -m "chore(gh): add branch protection bootstrap script"
```

---

### Task A9: Agent workflow doc

**Files:** `docs/architecture/agent-workflow.md`

- [ ] **Step 1: Write the doc**

```markdown
# Agent Workflow

How a Claude Code agent picks up, implements, tests, and PRs a GitHub issue.

## State machine

state:ready → (agent claims) → state:in-progress
            → (PR opened)    → state:in-review
            → (PR merged)    → closed
            → (human flag)   → state:blocked

Only one `state:*` label may be present at a time. The project automation workflow keeps the Status custom field in sync.

## Pickup contract

An issue is *agent-pickable* when:
1. It has `state:ready`
2. It has `agent:auto-pickable`
3. Its `Depends on:` issues are all closed
4. Its body contains all required template sections

Otherwise an agent must escalate via comment + `state:blocked`.

## Manual pickup (default)

Operator says: `work the next ready issue [in <tier>] [in <domain>]`
Claude invokes the `work-next` skill, which:
1. `gh issue list -l state:ready -l agent:auto-pickable [--milestone <tier>] [--label domain:<x>] --limit 1 --json number,title,body`
2. Verifies dependencies closed
3. Flips label `state:ready` → `state:in-progress`
4. Creates branch `agent/<N>-<slug>`
5. Dispatches `superpowers:subagent-driven-development` with the issue body verbatim as the spec
6. Subagent: TDD loop → commit → push → `gh pr create --body "Closes #<N>"`
7. Project automation flips issue to `state:in-review`
8. Operator dispatches reviewer subagents (or skill chain handles it)

## Routine pickup (optional)

`/schedule "0 */2 * * *" /work-next` — every 2 hours a remote agent picks the oldest `state:ready agent:auto-pickable` issue and works it. Off by default.

## Branch + PR conventions

- Branch: `agent/<issue-number>-<short-slug>` (visually distinct from human branches)
- PR title: `[#<N>] <short imperative>`
- PR body: must include `Closes #<N>` (auto-closes issue on merge)
- Required CI: `lint`, `typecheck`, `test`, `knip`, `dep-cruise`, `markdownlint`, `cspell`, `gitleaks`

## Escalation

If an agent cannot proceed, it must:
1. Comment on the issue describing the blocker
2. Replace `state:in-progress` with `state:blocked`
3. Stop work — do not push speculative code

## Project board setup

After running `scripts/gh-bootstrap-project.sh`, open the project in the GH UI and create these views:
- **Board** — Kanban grouped by Status (Backlog / Ready / In Progress / In Review / Done)
- **Roadmap** — Timeline grouped by Tier
- **Agent Queue** — Table filtered `state:ready`, sorted by Tier asc then Priority asc
- **By Domain** — Table grouped by Domain
- **Blocked** — Table filtered `state:blocked`

## Dashboards

- `Backlog` view — see what's next
- `Roadmap` view — see milestone progress
- `Blocked` view — see what needs you
- Milestone page — `gh milestone list --repo carlsendk/Sail-Tracker`
```

- [ ] **Step 2: Commit**

```bash
git add docs/architecture/agent-workflow.md
git commit -m "docs(arch): document agent workflow"
```

---

### Task A10: `work-next` skill

**Files:** `.claude/skills/work-next/SKILL.md`

- [ ] **Step 1: Write the skill**

````markdown
---
name: work-next
description: Pick up the next state:ready agent-pickable issue, claim it, branch, and dispatch the subagent-driven-development workflow. Optionally filter by tier (e.g. tier:1) or domain (e.g. domain:fleet).
---

# work-next

Pick up the next agent-pickable issue from the Sail-Tracker backlog and run it through the subagent-driven-development pipeline.

## Args

- Optional: `--tier <N>` to filter by milestone (e.g. `--tier 1` → "Tier-1: Foundation")
- Optional: `--domain <x>` to filter by domain label (e.g. `--domain fleet`)
- Optional: `--phase <N>` for infra phases (e.g. `--phase 0`)

## Steps

1. Resolve filters into `gh issue list` flags:
   - tier N → `--milestone "Tier-N: <name>"` (look up exact title via `gh api repos/carlsendk/Sail-Tracker/milestones`)
   - phase N → `--milestone "Phase 0: ..."` or `Infra-N: ...`
   - domain → `--label "domain:<x>"`
2. List candidates:
   ```bash
   gh issue list \
     --repo carlsendk/Sail-Tracker \
     --label state:ready \
     --label agent:auto-pickable \
     [<milestone/domain flags>] \
     --limit 5 \
     --json number,title,body,labels
   ```
3. Verify dependencies of the first candidate are closed (parse `Depends on:` from body, check each issue state). If any open, skip to next candidate.
4. Claim it:
   ```bash
   gh issue edit <N> --remove-label state:ready --add-label state:in-progress
   ```
5. Create branch:
   ```bash
   git fetch origin main
   git checkout -b "agent/<N>-<slug>" origin/main
   ```
6. Dispatch `superpowers:subagent-driven-development`. The "plan" passed to it is the issue body verbatim (already structured with Goal, Files, TDD Steps, Acceptance Criteria, DoD). Implementer subagent does TDD; spec reviewer checks Acceptance Criteria; code quality reviewer checks the code.
7. After implementer commits, push and open PR:
   ```bash
   git push -u origin "agent/<N>-<slug>"
   gh pr create --title "[#<N>] <issue title>" --body "Closes #<N>\n\n<test evidence>"
   ```
8. Project automation flips the issue to `state:in-review` on PR open.

## On failure

- If implementer escalates BLOCKED, flip the issue to `state:blocked` with a comment explaining the blocker, then stop.
- If subagent reviews keep failing after 3 rounds, escalate to operator.

## Never

- Push to `main`
- Bypass branch protection
- Skip reviewer subagents
````

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/work-next/SKILL.md
git commit -m "feat(skills): add work-next slash command"
```

---

### Task A11: Update infra plan with Phase 0

**Files:** `docs/plans/plan.md` (modify)

- [ ] **Step 1: Insert Phase 0 ahead of existing Phase 1**

Open `docs/plans/plan.md`, before `## Phase 1: Local Supabase As A Supported Dev Path`, insert:

```markdown
## Phase 0: Code Quality Foundation

Establish the code-quality bar that every subsequent change must clear before this codebase has product code in it.

Scope:

- TypeScript strict mode at the most aggressive level the codebase tolerates
- ESLint flat config with type-aware rules, React/Next/a11y, JSDoc, perfectionist sort, security, MDX, architectural boundaries, and no-inline-SVG
- Prettier (formatting) and Stylelint (CSS) configured and enforced
- markdownlint + cspell + markdown-link-check on the `/docs` tree
- syncpack + manypkg for monorepo dependency consistency
- Pre-commit hooks via husky + lint-staged
- Conventional Commits enforced via commitlint
- Vitest + React Testing Library + Playwright wired up; coverage thresholds set
- knip + dependency-cruiser for unused-export and circular-dep detection
- gitleaks + audit-ci + CodeQL for secrets, vuln, and security scanning in CI
- CI workflow runs lint, typecheck, test, knip, dep-cruise, markdownlint, cspell, gitleaks
- Branch protection on main requires the CI checks

Success condition:

- `pnpm validate` runs lint + typecheck + test + knip + dep-cruise locally and matches CI
- Any PR that violates a rule fails CI
- Conventions documented in `docs/architecture/code-quality.md`
```

- [ ] **Step 2: Commit**

```bash
git add docs/plans/plan.md
git commit -m "docs(plan): add Phase 0 code quality foundation ahead of Phase 1"
```

---

## Phase 0 Issues: Code Quality Foundation (~14 issues)

For each row below, create one issue using the `agent-task` template, assigned to milestone "Phase 0: Code Quality Foundation", labels `type:infra,state:ready,agent:auto-pickable,priority:p0`. Bodies are self-contained per the template.

### Task B-list: Generate Phase 0 issues

| # | Title | Files | Test | Acceptance |
|---|-------|-------|------|------------|
| B1 | `[infra] strict tsconfig` | Modify `tsconfig.base.json` | `pnpm typecheck` clean across workspace | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames` all on |
| B2 | `[infra] ESLint flat config (strict)` | Replace `apps/web/eslint.config.mjs`; create root `eslint.config.mjs` | `pnpm lint` runs and reports actual violations | typescript-eslint strict-type-checked + stylistic-type-checked, react, react-hooks, jsx-a11y/strict, @next/next, import, unicorn, sonarjs, promise, deprecation, regexp, security, no-secrets, anti-trojan-source, jsdoc, perfectionist, no-only-tests, react-refresh all loaded |
| B3 | `[infra] eslint-plugin-boundaries` (DDD layers) | Add to root config | one negative test fails: import from `apps/web` into `packages/domain` | layers: domain → (none); application → domain; infrastructure → application,domain; ui → domain; testkit → testkit; apps → any |
| B4 | `[infra] no-inline-SVG rule + icon convention` | `no-restricted-syntax` rule + `packages/ui/src/icons/` placeholder | negative lint test: `<svg>` JSX in component code = error | `<svg>` only allowed in `packages/ui/src/icons/` |
| B5 | `[infra] data-testid convention for interactive elements` | Custom rule or jsx-a11y config | negative test: button without `data-testid` fails | `button`, `a`, `[role="button"]` require `data-testid` outside test files |
| B6 | `[infra] eslint-plugin-mdx + JSDoc` | Configure plugin sets | one MDX file lints; one missing-JSDoc on exported fn fails | MDX docs linted; JSDoc required on exported APIs in `packages/{domain,application,ui}` |
| B7 | `[infra] Prettier + Stylelint + EditorConfig` | `prettier.config.mjs`, `.prettierignore`, `stylelint.config.mjs`, `.editorconfig` | `pnpm format:check` and `pnpm stylelint` pass | Prettier handles TS/MDX/JSON/YAML; Stylelint covers `*.css` |
| B8 | `[infra] markdownlint + cspell + link-check` | `.markdownlint.jsonc`, `cspell.config.yaml`, `.markdownlintignore` | `pnpm md:lint` and `pnpm cspell` pass on existing docs | covers `docs/**/*.md`, `**/*.mdx`, `README.md`; project dictionary committed |
| B9 | `[infra] husky + lint-staged + commitlint` | `.husky/`, `.lintstagedrc.json`, `commitlint.config.mjs` | bad commit message rejected; staged dirty file blocks commit | conventional commits enforced; pre-commit runs `eslint --fix`, `prettier --write`, `cspell` on staged |
| B10 | `[infra] knip + dependency-cruiser + syncpack + manypkg` | `knip.config.ts`, `dependency-cruiser.config.mjs`, `syncpack.config.mjs` | `pnpm knip` clean; `pnpm dep:cruise` rejects cycles; `pnpm syncpack list-mismatches` clean | dep-cruiser rejects cross-layer + cycles; syncpack pins versions across `packages/*` |
| B11 | `[infra] React Testing Library wiring + smoke test` | `apps/web/package.json`, `apps/web/vitest.config.ts`, `apps/web/__tests__/smoke.test.tsx` | smoke renders `<Page/>`, asserts h1 | jsdom + RTL + `@testing-library/jest-dom` working |
| B12 | `[infra] Playwright e2e wiring + smoke spec` | `apps/web/playwright.config.ts`, `apps/web/e2e/smoke.spec.ts` | `pnpm e2e` boots Next, hits `/`, asserts text | one e2e test passes locally |
| B13 | `[infra] CI workflow (full lint/test/security)` | `.github/workflows/ci.yml`, `.github/workflows/codeql.yml`, `.github/dependabot.yml`, `.gitleaks.toml` | PR shows all green checks | jobs named exactly `lint`, `typecheck`, `test`, `knip`, `dep-cruise`, `markdownlint`, `cspell`, `gitleaks`, `audit`, `e2e` |
| B14 | `[infra] coverage thresholds + report` | `vitest.config.ts` | `pnpm test --coverage` produces report; threshold breach fails CI | initial thresholds conservative (e.g. 50% lines), tightened later |

- [ ] **Step 1: Author body files in `scripts/issue-bodies/phase-0/B<N>.md`** matching the agent-task template (Goal, Context, Embedded Spec, Files, Acceptance, TDD Steps, DoD, Source).
- [ ] **Step 2: Create each issue:**

```bash
gh issue create \
  --repo carlsendk/Sail-Tracker \
  --title "<title>" \
  --body-file scripts/issue-bodies/phase-0/B<N>.md \
  --milestone "Phase 0: Code Quality Foundation" \
  --label "type:infra,state:ready,agent:auto-pickable,priority:p0"
```

- [ ] **Step 3: Verify**

```bash
gh issue list --repo carlsendk/Sail-Tracker --milestone "Phase 0: Code Quality Foundation" --json number --jq 'length'
```

Expected: 14.

- [ ] **Step 4: Commit body sources**

```bash
git add scripts/issue-bodies/phase-0/
git commit -m "chore(gh): record Phase 0 issue body sources"
```

---

## Phase B: Generate Infra Issues (Phases 1–4 of `docs/plans/plan.md`)

Mirror Phase 0's pattern. One issue per scope bullet. Body bodies in `scripts/issue-bodies/infra/<phase>/<n>.md`.

### Task C1: Phase 1 issues — Local Supabase (4)

Milestone "Infra-1: Local Supabase":
1. `[infra] add supabase start/stop/status/db reset scripts`
2. `[infra] document local ports + Studio usage`
3. `[infra] document migrations + seed.sql application locally`
4. `[infra] make bootstrap flow work against local Supabase`

### Task C2: Phase 2 issues — Env Contract (4)

Milestone "Infra-2: Env Contract Cleanup":
1. `[infra] hosted env contract`
2. `[infra] local env contract`
3. `[infra] env resolver layer`
4. `[infra] remove legacy env fallbacks`

### Task C3: Phase 3 issues — CI DB Validation (4)

Milestone "Infra-3: CI Database Validation":
1. `[infra] install Supabase CLI in Actions`
2. `[infra] start local Supabase in CI`
3. `[infra] run migrations + seed on fresh local DB in CI`
4. `[infra] DB-backed app checks in CI`

### Task C4: Phase 4 issues — Production Deploy (6)

Milestone "Infra-4: Production Deploy Flow":
1. `[infra] define promotion rule (merge-to-main)`
2. `[infra] pre-deploy validation gate`
3. `[infra] apply Supabase migrations in pipeline`
4. `[infra] post-migration smoke check`
5. `[infra] Vercel deploy after DB success`
6. `[docs] rollback expectations for migrations + web`

- [ ] **Step 1: Author body files for each task above**
- [ ] **Step 2: Create each issue via `gh issue create`** with `--label "type:infra,state:ready,agent:auto-pickable,priority:p1"` (or `p2` for the rollback docs)
- [ ] **Step 3: Verify totals**

```bash
for m in "Infra-1: Local Supabase" "Infra-2: Env Contract Cleanup" "Infra-3: CI Database Validation" "Infra-4: Production Deploy Flow"; do
  count=$(gh issue list --repo carlsendk/Sail-Tracker --milestone "$m" --json number --jq 'length')
  echo "$m: $count"
done
```

Expected: 4, 4, 4, 6.

- [ ] **Step 4: Commit body sources**

```bash
git add scripts/issue-bodies/infra/
git commit -m "chore(gh): record infra issue body sources"
```

---

## Phase C: Generate Product Issues (parallel by tier)

Each Tier task dispatches **N parallel subagents** (one per source doc) using the issue extraction template below. Each subagent reads exactly one doc, produces 4–8 agent-task issues, creates them via `gh issue create`, and saves the body files under `scripts/issue-bodies/tier-<N>/<doc-slug>/`.

### Issue extraction template (used by every product subagent)

> **You are extracting agent-implementable issues from a Sail-Tracker product doc.**
>
> **Input:** the path to one product doc (e.g. `docs/product/domains/members/membership-and-onboarding.md`).
>
> **Output:** 4–8 GitHub issues created via `gh issue create`, each:
> 1. Titled `[<domain>] <short imperative>` (≤ 70 chars)
> 2. Bodied to the `agent-task` template fields:
>    - **Goal** (1 sentence)
>    - **Context** (2-3 sentences — link the doc, explain dependency position)
>    - **Embedded Spec** — copy the full "What it does" + "Scope" sections of the source doc verbatim, plus any data-model section that affects implementation
>    - **Files** — concrete paths in `packages/domain`, `packages/application`, `packages/infrastructure`, `packages/ui`, or `apps/web`
>    - **Acceptance Criteria** — 4–8 testable behaviors derived from the doc's success conditions
>    - **TDD Steps** — write test → run → implement → run → commit, with concrete `pnpm vitest run <path>` commands
>    - **Definition of Done** — `pnpm validate` green, PR opened, both reviewer subagents approve
>    - **Source** — `docs/product/...` path + dependency hints (e.g. "Depends on: tier-1 membership issues")
> 3. Labeled `type:feature,state:ready,agent:auto-pickable,domain:<x>,priority:<p1|p2>`
> 4. Assigned to milestone `Tier-<N>: <name>`
>
> **Constraints:**
> - Each issue is 1–3 files, ≤ 30 minutes of agent work
> - Slice by capability, not by file (e.g. "create membership invite", "accept membership invite", not "create Member entity")
> - Domain layer issues (pure types/logic) come first; UI issues come last
> - Cross-doc dependencies → list as `Depends on: #?` placeholder; the operator resolves after all tiers generated

### Task D1: Tier-1 (Foundation)

Source docs:
- `docs/product/domains/members/membership-and-onboarding.md`
- `docs/product/domains/members/permissions-and-roles.md`
- `docs/product/backbone/calendar-and-scheduling.md`

- [ ] **Step 1: Dispatch 3 parallel subagents** (one per doc) with the extraction template.
- [ ] **Step 2: Verify**

```bash
gh issue list --repo carlsendk/Sail-Tracker --milestone "Tier-1: Foundation" --json number --jq 'length'
```

Expected: 12–24.

- [ ] **Step 3: Resolve `Depends on: #?` placeholders** by reading newly-created issue numbers and editing each issue's body via `gh issue edit <N> --body-file <updated>`.
- [ ] **Step 4: Commit** body-source artifacts.

### Task D2: Tier-2 (Core Domains) — 4 parallel subagents

- `docs/product/domains/fleet/vessel-registry.md`
- `docs/product/domains/trips/trip-planning-and-lifecycle.md`
- `docs/product/domains/equipment/equipment-registry.md`
- `docs/product/domains/trips/trip-manifest-and-guests.md`

Milestone: "Tier-2: Core Domains". Most issues will depend on Tier-1.

### Task D3: Tier-3 (Qualifications) — 2 parallel subagents

- `docs/product/domains/qualifications/certifications-and-catalog.md`
- `docs/product/domains/qualifications/local-approvals.md`

Milestone: "Tier-3: Qualifications".

### Task D4: Tier-4 (Operational Features) — 5 parallel subagents

- `docs/product/domains/trips/trip-departure-and-validation.md`
- `docs/product/domains/trips/trip-completion-and-reporting.md`
- `docs/product/domains/fleet/vessel-classes-and-restrictions.md`
- `docs/product/domains/fleet/vessel-readiness.md`
- `docs/product/domains/equipment/equipment-assignment.md`

Milestone: "Tier-4: Operational Features".

### Task D5: Tier-5 (Cross-Cutting) — 8 parallel subagents

- `docs/product/cross-cutting/dashboard-and-home.md`
- `docs/product/cross-cutting/profile-and-account.md`
- `docs/product/cross-cutting/harbors-and-locations.md`
- `docs/product/backbone/search-and-operational-views.md`
- `docs/product/backbone/notifications-and-reminders.md`
- `docs/product/backbone/tasks-and-inspections.md`
- `docs/product/cross-cutting/pwa-and-offline.md`
- `docs/product/cross-cutting/audit-and-compliance.md`

Milestone: "Tier-5: Cross-Cutting".

### Task D6: Tier-6 (Enrichment Modules) — 9 parallel subagents

- `docs/product/modules/weather-in-trip-context.md`
- `docs/product/modules/route-planning-and-harbors.md`
- `docs/product/modules/incidents.md`
- `docs/product/modules/media-gallery.md`
- `docs/product/modules/trip-story.md`
- `docs/product/modules/reporting-and-exports.md`
- `docs/product/domains/trips/trip-series-and-recurring.md`
- `docs/product/domains/equipment/equipment-lending-and-booking.md`
- `docs/product/domains/qualifications/skills-and-recognition.md`

Milestone: "Tier-6: Enrichment Modules". Mark `priority:p2`.

### Task D7: Tier-7 (Platform & Modes) — 7 parallel subagents

- `docs/product/platform/tenant-bootstrap-and-setup.md`
- `docs/product/platform/tenant-settings.md`
- `docs/product/platform/platform-administration.md`
- `docs/product/platform/platform-support-and-impersonation.md`
- `docs/product/platform/seeded-catalog-adoption.md`
- `docs/product/platform/import-and-export-strategy.md`
- `docs/product/operating-modes/kiosk-mode.md`

Milestone: "Tier-7: Platform & Modes".

---

## Phase D: Verification

### Task E1: Random sample issue audit

- [ ] **Step 1: Sample 5 random issues**

```bash
gh issue list --repo carlsendk/Sail-Tracker --label state:ready --json number --limit 200 \
  | jq '[.[] | .number] | sort | .[range(0; 5)]'
```

Pick 5 numbers; for each:
```bash
gh issue view <N> --repo carlsendk/Sail-Tracker
```

- [ ] **Step 2: Audit checklist for each sample**
  - [ ] All 7 template sections present
  - [ ] Files paths concrete and exist (or are explicitly new)
  - [ ] Acceptance criteria each testable
  - [ ] TDD steps name a concrete test file path
  - [ ] Source links a real `docs/product/...` path
  - [ ] Labels include exactly one `state:*`, one `domain:*` (or infra), one `type:*`, exactly one `priority:*`
  - [ ] Milestone correct

- [ ] **Step 3: If any sample fails, fix the generation template and regenerate that tier.**

### Task E2: End-to-end dry run on one Phase 0 issue

- [ ] **Step 1: Pick the smallest Phase 0 issue (likely B7 — Prettier)**
- [ ] **Step 2: Invoke `/work-next --phase 0`**
- [ ] **Step 3: Verify the chain:**
  - Label flips to `state:in-progress`
  - Branch `agent/<N>-...` created
  - Subagent implements via TDD
  - PR opens with `Closes #<N>`
  - Project automation flips issue to `state:in-review`
  - Both reviewer subagents run and approve
  - Merge auto-closes issue

- [ ] **Step 4: If any link fails, fix it before unleashing on the broader backlog.**

### Task E3: Document in repo README

- [ ] **Step 1: Add a "Working with Claude Code" section to `README.md`** linking to `docs/architecture/agent-workflow.md` and the Project board URL.
- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs(readme): point at agent workflow + project board"
```

---

## Self-Review Checklist (run; outcome inlined)

**1. Spec coverage:**
- Infra Phase 0 ↔ Phase 0 milestone + B1–B14 ✓
- Infra Phases 1–4 ↔ C1–C4 ✓
- Product Tiers 1–7 ↔ D1–D7 ✓
- "Avoid inline SVG" ↔ B4 ✓
- "Make UI testable" ↔ B5 (testid), B11 (RTL), B12 (Playwright), B14 (coverage) ✓
- "Keep our structure" ↔ B3 (boundaries), B10 (dep-cruiser/syncpack/manypkg) ✓
- "TypeScript" ↔ B1 (strict tsconfig), B2 (type-aware ESLint) ✓
- "ES-docs (JSDoc)" ↔ B6 (jsdoc plugin) ✓
- "Project board you can follow" ↔ A4 + automation in A7 ✓
- "Branch protection" ↔ A8 (deferred until B13 lands) ✓
- "Auto-sync project status" ↔ A7 ✓
- "/work-next as project-local skill" ↔ A10 ✓
- "Spec embedding = full section" ↔ template (A5) + extraction template (Phase C) ✓
- "Manual + routine pickup" ↔ A9 doc, A10 manual; routine via `/schedule` deferred ✓

**2. Placeholder scan:** None. Project IDs in A7 read at runtime from `scripts/.gh-project.env` and env vars; no string-template injection.

**3. Type / naming consistency:** `state:*` namespace used throughout. Milestone titles match between A3, B issues, C issues, D issues. Skill name `work-next` consistent in A9, A10. CI job names match between B13 and A8 branch protection.

**4. Security review (added after security-hook flag):**
- `gh-sync-status.mjs` uses `execFileSync` with arg arrays — no shell, no string interpolation
- Issue number validated as a positive integer before use
- No user-controlled input flows into shell commands anywhere in the plan
- All workflow steps use `${{ ... }}` only inside double-quoted strings as `gh` CLI arguments (gh treats them as opaque values)

---

## Execution Handoff

Plan saved to `docs/plans/2026-05-07-agent-backlog-bootstrap.md`. Two execution options:

**1. Subagent-Driven (recommended)** — Phase A sequentially, fresh subagent per task; Phases B/C/D dispatch parallel subagents (one per issue group / source doc). Two-stage review (spec then code quality) after each Phase A task. Wall-clock ≈ 2–4 hours.

**2. Inline Execution** — Execute Phase A tasks in this session via `superpowers:executing-plans` with checkpoints, then dispatch parallel subagents for the issue-generation phases. Lighter-weight, slower per task.

Which approach?
