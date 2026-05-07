#!/usr/bin/env bash
# Enable branch protection on main, requiring all Phase-0 status checks to pass.
#
# DO NOT RUN until Phase 0 issue B13 (CI workflow) has merged and produced runs
# with the named jobs (lint, typecheck, test, knip, dep-cruise, markdownlint,
# cspell, gitleaks, audit). Otherwise GH rejects the request because none of the
# named contexts have ever reported a status.
set -euo pipefail
REPO="${REPO:-carlsendk/Sail-Tracker}"

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
  -F "required_status_checks.contexts[]=audit" \
  -F enforce_admins=false \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -F restrictions= \
  -F allow_force_pushes=false \
  -F allow_deletions=false

echo "Branch protection enabled on $REPO/main"
