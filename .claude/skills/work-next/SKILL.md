---
name: work-next
description: Pick up the next state:ready agent-pickable issue from the Sail-Tracker Backlog, claim it, branch, and dispatch the subagent-driven-development workflow. Optionally filter by tier (e.g. tier:1), domain (e.g. domain:fleet), or infra phase (e.g. phase:0).
---

# work-next

Pick up the next agent-pickable issue from the Sail-Tracker Backlog and run it through the `superpowers:subagent-driven-development` pipeline.

## Args

- `--tier <N>` — filter by Tier milestone (`Tier-N: <name>`); also accepts `--tier foundations` for the `Foundations` milestone
- `--phase <N>` — filter by phase via the project's Tier custom field (`Phase-0`, `Infra-1` … `Infra-4`). All phases share the `Foundations` milestone, so milestone-only filtering is too coarse.
- `--domain <x>` — filter by domain label (`domain:<x>`)

If no filter is given, picks the highest-priority ready issue across the whole backlog.

## Steps

1. **Resolve filters into `gh issue list` flags.**
   - Look up exact milestone titles via `gh api repos/carlsendk/Sail-Tracker/milestones --jq '.[] | .title'`.
   - tier `N` (1-7) → `--milestone "Tier-N: <name>"`
   - tier `foundations` → `--milestone "Foundations"`
   - phase `0` / `1` / … / `4` → `--milestone "Foundations"` AND post-filter the candidate list to issues whose project Tier field equals `Phase-0` / `Infra-1` / … / `Infra-4` respectively. Use `gh project item-list 1 --owner carlsendk --format json` to read each candidate's Tier value.
   - domain → `--label "domain:<x>"`

2. **List candidates:**
   ```bash
   gh issue list \
     --repo carlsendk/Sail-Tracker \
     --label state:ready \
     --label agent:auto-pickable \
     [<milestone/domain flags>] \
     --limit 5 \
     --json number,title,body,labels
   ```

3. **Verify dependencies of the first candidate are closed.** Parse the `Depends on:` line from the body; for each `#N`, check `gh issue view <N> --json state`. If any open, skip to the next candidate.

4. **Claim it** by flipping the state label:
   ```bash
   gh issue edit <N> --repo carlsendk/Sail-Tracker \
     --remove-label state:ready --add-label state:in-progress
   ```

5. **Create the agent branch** off `origin/main`:
   ```bash
   git fetch origin main
   git checkout -b "agent/<N>-<slug>" origin/main
   ```

6. **Dispatch `superpowers:subagent-driven-development`.**
   - The "plan" handed to it is the issue body verbatim — it is already structured with Goal, Files, TDD Steps, Acceptance Criteria, and Definition of Done.
   - The implementer subagent runs the TDD loop: write failing test → run → implement → run → commit.
   - The spec reviewer subagent verifies acceptance criteria.
   - The code quality reviewer subagent reviews the diff.
   - Re-dispatch the implementer to fix any issues until both reviewers approve.

7. **Push and open the PR:**
   ```bash
   git push -u origin "agent/<N>-<slug>"
   gh pr create \
     --repo carlsendk/Sail-Tracker \
     --title "[#<N>] <issue title>" \
     --body "Closes #<N>

   <test evidence>"
   ```
   The `flip-on-pr-open` job in `project-automation.yml` flips the issue to `state:in-review` automatically.

## On failure

- If the implementer subagent escalates BLOCKED, comment on the issue describing the blocker and flip its label `state:in-progress` → `state:blocked`. Stop.
- If the reviewer subagents keep failing after three rounds, escalate to the operator with a summary.

## Never

- Push to `main`
- Bypass branch protection (no `--no-verify`, no `--force`)
- Skip either reviewer subagent
- Open a PR before the implementer's tests pass locally
