#!/bin/bash
# Assign Copilot seats ONLY to students who are BOTH:
#   1. active=true in the roster   (in the active cohort)
#   2. an ACCEPTED member of $ORG  (pending invites are skipped, not billed)
# Already-seated users are skipped so the run is idempotent.
#
# Usage:  ORG=becloudready ./assign-copilot-active.sh roster-workshop-21.csv [--apply]
# Without --apply it is a DRY RUN and assigns nothing.

set -euo pipefail
ORG="${ORG:-becloudready}"
ROSTER="${1:?usage: $0 <roster.csv> [--apply]}"
APPLY="${2:-}"
[[ -f "$ROSTER" ]] || { echo "Roster not found: $ROSTER" >&2; exit 1; }

tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
gh api --paginate "/orgs/$ORG/members?per_page=100"               --jq '.[].login'            | sort -f > "$tmp/members"
gh api --paginate "/orgs/$ORG/invitations?per_page=100"           --jq '.[].login // empty'   | sort -f > "$tmp/pending"
gh api --paginate "/orgs/$ORG/copilot/billing/seats?per_page=100" --jq '.seats[].assignee.login' | sort -f > "$tmp/seats"

ASSIGN=(); SKIP_SEATED=(); SKIP_PENDING=(); SKIP_NOINVITE=(); SKIP_INACTIVE=()
while IFS=, read -r _u name _e gh_user active _rest; do
  gh_user="${gh_user// }"; active="${active// }"
  [[ -z "$gh_user" ]] && continue
  if [[ "$active" != "true" ]]; then SKIP_INACTIVE+=("$gh_user"); continue; fi
  if   grep -qix "$gh_user" "$tmp/seats";   then SKIP_SEATED+=("$gh_user")
  elif grep -qix "$gh_user" "$tmp/members"; then ASSIGN+=("$gh_user")
  elif grep -qix "$gh_user" "$tmp/pending"; then SKIP_PENDING+=("$gh_user  ($name)")
  else SKIP_NOINVITE+=("$gh_user  ($name)"); fi
done < <(tail -n +2 "$ROSTER")

show(){ [[ ${#*} -gt 1 ]] && { echo "$1"; printf '    %s\n' "${@:2}"; }; }
echo "Roster: $ROSTER   Org: $ORG"
show "  WILL ASSIGN (${#ASSIGN[@]}):"            "${ASSIGN[@]:-}"
show "  skip, already seated (${#SKIP_SEATED[@]}):"   "${SKIP_SEATED[@]:-}"
show "  skip, invite NOT accepted (${#SKIP_PENDING[@]}):" "${SKIP_PENDING[@]:-}"
show "  skip, NO invite sent (${#SKIP_NOINVITE[@]}):"     "${SKIP_NOINVITE[@]:-}"
echo "  skip, inactive: ${#SKIP_INACTIVE[@]}"
echo

[[ ${#ASSIGN[@]} -eq 0 ]] && { echo "Nothing to assign."; exit 0; }
if [[ "$APPLY" != "--apply" ]]; then
  echo "DRY RUN. Re-run with --apply to assign ${#ASSIGN[@]} seats (billable)."; exit 0
fi

USERS_JSON=$(printf '%s\n' "${ASSIGN[@]}" | jq -R . | jq -s .)
gh api --method POST -H "Accept: application/vnd.github+json" \
  "/orgs/$ORG/copilot/billing/selected_users" --input - <<JSON
{ "selected_usernames": $USERS_JSON }
JSON
echo "✓ Requested ${#ASSIGN[@]} seats. Verify: gh api /orgs/$ORG/copilot/billing"
