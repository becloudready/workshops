#!/bin/bash
# Add the current active cohort to the copilot-license team.
#
# Source of truth is the `active-workshop` team (org-side), not a roster CSV —
# the newest roster file here is from July and predates the 14 Sep batch.
# Only accepted org members can be team members, so the "accepted the invite"
# condition is satisfied by construction.
#
# Usage:  ORG=becloudready ./add-to-copilot-team.sh [--apply]
# Without --apply it is a DRY RUN.

set -euo pipefail
ORG="${ORG:-becloudready}"
SRC_TEAM="${SRC_TEAM:-active-workshop}"
DST_TEAM="${DST_TEAM:-copilot-license}"
APPLY="${1:-}"

tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
gh api --paginate "/orgs/$ORG/teams/$SRC_TEAM/members?per_page=100" --jq '.[].login' | sort -f > "$tmp/src"
gh api --paginate "/orgs/$ORG/teams/$DST_TEAM/members?per_page=100" --jq '.[].login' | sort -f > "$tmp/dst"
TOADD=(); while IFS= read -r l; do [[ -n "$l" ]] && TOADD+=("$l"); done < <(comm -23 "$tmp/src" "$tmp/dst")

echo "$SRC_TEAM: $(wc -l < "$tmp/src" | tr -d ' ')   $DST_TEAM: $(wc -l < "$tmp/dst" | tr -d ' ')"
echo "to add: ${#TOADD[@]}"
printf '  %s\n' "${TOADD[@]:-}"
[[ ${#TOADD[@]} -eq 0 ]] && { echo "Nothing to do."; exit 0; }

before=$(gh api "/orgs/$ORG/copilot/billing" --jq '.seat_breakdown.total')
echo "Copilot seats before: $before"

if [[ "$APPLY" != "--apply" ]]; then
  echo "DRY RUN. Re-run with --apply."; exit 0
fi

# Probe with one user, then check whether a seat was created.
first="${TOADD[0]}"
gh api --method PUT "/orgs/$ORG/teams/$DST_TEAM/memberships/$first" --jq '.state' >/dev/null
sleep 3
mid=$(gh api "/orgs/$ORG/copilot/billing" --jq '.seat_breakdown.total')
if [[ "$mid" != "$before" ]]; then
  echo "NOTE: seat count went $before -> $mid. The team IS Copilot-enabled;"
  echo "      each remaining add is billable. Continuing."
else
  echo "NOTE: no seat created by team membership. The team is NOT Copilot-enabled,"
  echo "      so this grants group membership only - see the README note."
fi

for u in "${TOADD[@]:1}"; do
  gh api --method PUT "/orgs/$ORG/teams/$DST_TEAM/memberships/$u" --jq '.state' >/dev/null \
    && echo "  + $u" || echo "  ! FAILED $u" >&2
done
after=$(gh api "/orgs/$ORG/copilot/billing" --jq '.seat_breakdown.total')
echo "Copilot seats after: $after"
