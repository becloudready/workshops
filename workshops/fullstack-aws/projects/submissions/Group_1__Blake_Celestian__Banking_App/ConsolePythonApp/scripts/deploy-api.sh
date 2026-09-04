#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEY_PATH="${1:-}"

if [[ -z "$KEY_PATH" ]]; then
  echo "Usage: $0 /path/to/private_ssh_key" >&2
  exit 1
fi

if [[ ! -f "$KEY_PATH" ]]; then
  echo "SSH key not found: $KEY_PATH" >&2
  exit 1
fi

API_IP="$(terraform -chdir="$ROOT/terraform" output -raw api_public_ip)"
SSH_OPTS=(-i "$KEY_PATH" -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null)

echo "Install rsync on the EC2 instance"
ssh "${SSH_OPTS[@]}" "ec2-user@${API_IP}" 'bash -s' <<'REMOTE'
sudo dnf update -y && sudo dnf install -y rsync
REMOTE


echo "Copying project1 to ec2-user@${API_IP}:/opt/banking-api"
rsync -az --delete \
  --exclude '.venv/' \
  --exclude '__pycache__/' \
  --exclude '*.pyc' \
  --exclude '.pytest_cache/' \
  --exclude 'banking.db' \
  -e "ssh ${SSH_OPTS[*]}" \
  "$ROOT/project1/" \
  "ec2-user@${API_IP}:/opt/banking-api/"

echo "Installing Python deps and starting banking-api"
ssh "${SSH_OPTS[@]}" "ec2-user@${API_IP}" 'bash -s' <<'REMOTE'
set -euo pipefail
cd /opt/banking-api
sudo dnf install python3.11 python3.11-pip -y
rm -rf .venv
python3.11 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt
sudo systemctl daemon-reload
sudo systemctl enable --now banking-api
sudo systemctl restart banking-api
sleep 2
sudo systemctl --no-pager --full status banking-api || true
REMOTE

echo "API deploy complete."
echo "Gateway URL: $(terraform -chdir="$ROOT/terraform" output -raw api_gateway_url)"
