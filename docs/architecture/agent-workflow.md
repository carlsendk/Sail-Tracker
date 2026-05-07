# Agent Workflow

How a Claude Code agent picks up, implements, tests, and PRs a GitHub issue from the Sail-Tracker Backlog.

## Project board

The backlog lives at <https://github.com/users/carlsendk/projects/1> (`Sail-Tracker Backlog`). Five views:

| View | Layout | Filter | Audience |
|------|--------|--------|----------|
| **Board** | Kanban grouped by Status | All | Daily glance |
| **Roadmap** | Timeline grouped by Tier | All | Milestone progress |
| **Agent Queue** | Table sorted by Tier asc, Priority asc | `state:ready` only | Agents on pickup |
| **By Domain** | Table grouped by Domain | All | Parallelization planning |
| **Blocked** | List | `state:blocked` | Unblocking work |

> **First-run setup:** GitHub's CLI does not yet support creating views programmatically. After running `scripts/gh-bootstrap-project.sh`, open the project URL above and create the five views manually — the column groupings and filters are listed in the table above.

## State machine

```
state:ready ──(agent claims)──▶ state:in-progress
            ──(PR opened)─────▶ state:in-review
            ──(PR merged)─────▶ closed
            ──(human flag)────▶ state:blocked
```

Only one `state:*` label may be present at a time. The `project-automation.yml` workflow keeps the project's Status custom field in sync.

## Pickup contract

An issue is **agent-pickable** when:

1. It has `state:ready`
2. It has `agent:auto-pickable`
3. Every issue listed in its `Depends on:` line is closed
4. Its body contains all eight required template sections (Goal, Context, Embedded Spec, Files, Acceptance Criteria, TDD Steps, Definition of Done, Source)

Otherwise the agent must escalate (comment + flip to `state:blocked`).

## Manual pickup (default)

The operator says: `work the next ready issue [in <tier>] [in <domain>]`. Claude invokes the `work-next` skill, which:

1. `gh issue list --label state:ready --label agent:auto-pickable [--milestone <tier>] [--label domain:<x>] --limit 1 --json number,title,body,labels`
2. Verifies the candidate's `Depends on:` issues are all closed
3. Flips its label `state:ready` → `state:in-progress`
4. Creates a branch `agent/<N>-<slug>` off `origin/main`
5. Dispatches `superpowers:subagent-driven-development` with the issue body verbatim as the spec
6. The subagent does the TDD loop (write failing test → run → implement → run → commit), pushes, and opens a PR with `Closes #<N>` in the body
7. The `flip-on-pr-open` job in `project-automation.yml` flips the issue to `state:in-review` automatically
8. Spec reviewer + code quality reviewer subagents run; on approval, the operator merges

## Routine pickup (optional, off by default)

`/schedule "0 */2 * * *" /work-next` — every two hours a remote agent picks the oldest `state:ready agent:auto-pickable` issue and works it. Off by default; turn on once the manual flow is proven.

## Branch + PR conventions

- **Branch:** `agent/<issue-number>-<short-slug>` — visually distinct from human branches
- **PR title:** `[#<N>] <short imperative>`
- **PR body:** must include `Closes #<N>` (auto-closes the issue on merge)
- **Required status checks** (enforced by branch protection on `main`): `lint`, `typecheck`, `test`, `knip`, `dep-cruise`, `markdownlint`, `cspell`, `gitleaks`, `audit`

## Escalation

If an agent cannot proceed it must:

1. Comment on the issue describing the blocker (what failed, what was tried)
2. Replace `state:in-progress` with `state:blocked`
3. Stop work — do not push speculative code, do not open a draft PR

## Operational dashboards

- **Agent Queue view** — what's next
- **Roadmap view** — milestone progress
- **Blocked view** — what needs you
- **Milestone page** — `gh milestone list --repo carlsendk/Sail-Tracker` or `https://github.com/carlsendk/Sail-Tracker/milestones`
