#!/bin/bash
set -euxo pipefail

dnf update -y
dnf install -y python3 python3-pip git

mkdir -p /opt/banking-api
chown ec2-user:ec2-user /opt/banking-api

cat >/etc/banking-api.env <<'EOF'
DATABASE_URL=${database_url}
EOF
chmod 600 /etc/banking-api.env

cat >/etc/systemd/system/banking-api.service <<'EOF'
[Unit]
Description=Banking FastAPI service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/banking-api
EnvironmentFile=/etc/banking-api.env
ExecStart=/opt/banking-api/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable banking-api
# The unit starts after project1 is copied by scripts/deploy-api.sh
