#!/usr/bin/env bash
# Idempotent label bootstrap for the Sail-Tracker agent backlog.
# Re-running updates color/description; --force lets gh treat already-existing labels as upserts.
# Uses a flat name|color|description array for portability with bash 3.2 (macOS default).
set -euo pipefail
REPO="${REPO:-carlsendk/Sail-Tracker}"

LABELS=(
  # state machine
  "state:ready|0E8A16|Agent can pick up; no blockers"
  "state:in-progress|FBCA04|Agent actively working"
  "state:in-review|1D76DB|PR open; awaiting review"
  "state:blocked|B60205|Cannot proceed; see comment"
  # type
  "type:feature|A2EEEF|New product capability"
  "type:infra|C5DEF5|Pipeline / env / CI"
  "type:test|BFD4F2|Test coverage"
  "type:docs|D4C5F9|Documentation"
  "type:refactor|FEF2C0|Internal cleanup"
  "type:chore|EEEEEE|Misc maintenance"
  # domain
  "domain:members|FF7F50|Membership, permissions"
  "domain:fleet|20B2AA|Vessels, classes, readiness"
  "domain:trips|9370DB|Trips, manifests, departure"
  "domain:equipment|FFA500|Equipment, lending"
  "domain:qualifications|DC143C|Certs, approvals, skills"
  "domain:platform|708090|Tenants, admin, support"
  "domain:backbone|4682B4|Calendar, search, tasks, notifications"
  "domain:cross-cutting|556B2F|Dashboard, profile, harbors, PWA"
  "domain:modules|DAA520|Weather, incidents, route, media, story, reporting"
  # agent
  "agent:auto-pickable|00FF00|Self-contained; agent runs solo"
  "agent:needs-human-input|FFD700|Has open questions"
  # priority
  "priority:p0|B60205|Critical path"
  "priority:p1|D93F0B|Important"
  "priority:p2|FBCA04|Nice to have"
)

for entry in "${LABELS[@]}"; do
  name="${entry%%|*}"
  rest="${entry#*|}"
  color="${rest%%|*}"
  desc="${rest#*|}"
  gh label create "$name" --color "$color" --description "$desc" --repo "$REPO" --force
done

echo "Processed ${#LABELS[@]} labels in $REPO"
