#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_URL="$(terraform -chdir="$ROOT/terraform" output -raw api_gateway_url)"
BUCKET="$(terraform -chdir="$ROOT/terraform" output -raw frontend_bucket)"
WEBSITE_URL="$(terraform -chdir="$ROOT/terraform" output -raw frontend_website_url)"

echo "Building frontend with VITE_API_URL=${API_URL}"
cd "$ROOT/frontend"
VITE_API_URL="$API_URL" npm ci
VITE_API_URL="$API_URL" npm run build

echo "Uploading dist/ to s3://${BUCKET}"
aws s3 sync "$ROOT/frontend/dist/" "s3://${BUCKET}/" --delete

echo "Frontend deployed: ${WEBSITE_URL}"
