#!/usr/bin/env bash
# Idempotent milestone bootstrap for the Sail-Tracker agent backlog.
# Creates 8 milestones (Foundations + Tier-1..7).
# Per-phase granularity within Foundations (Phase-0, Infra-1..4) lives on
# the project board's Tier custom field, not GitHub milestones.
# Re-running is safe: gh API returns 422 for duplicates; we suppress that error.
set -euo pipefail
REPO="${REPO:-carlsendk/Sail-Tracker}"

MILESTONES=(
  "Foundations|Code quality + infra prerequisites that must clear before product work begins. Covers Phase 0 (strict TS, ESLint, Prettier, Stylelint, markdownlint, cspell, commitlint, husky, CI, branch protection) and infra phases 1-4 (Local Supabase, Env Contract, CI DB Validation, Production Deploy)."
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
  desc="${entry#*|}"
  # gh api exits non-zero on 422 (already_exists); swallow but log.
  if ! gh api -X POST "repos/$REPO/milestones" \
      -f title="$title" -f description="$desc" -f state=open >/dev/null 2>&1; then
    echo "  exists or failed: $title" >&2
  else
    echo "  created: $title"
  fi
done

count=$(gh api "repos/$REPO/milestones?per_page=20&state=all" --jq 'length')
echo "Total milestones in $REPO: $count"
