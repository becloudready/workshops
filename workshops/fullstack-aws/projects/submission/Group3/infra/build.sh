#!/usr/bin/env bash
# Builds infra/build/lambda_package.zip and frontend/task-board-frontend/dist.
# Run from anywhere; paths are resolved relative to this script.
# Requires Python 3.11 + pip, and Node/npm for the frontend build.
#
# The frontend needs VITE_API_BASE_URL set to the API Gateway URL before it's
# built (Vite bakes env vars in at build time), so the usual flow is:
#   1. terraform apply -target=aws_apigatewayv2_stage.default   (creates just the API)
#   2. terraform output -raw api_endpoint                       (grab the URL)
#   3. VITE_API_BASE_URL="<url>/api" ./build.sh                 (builds zip + dist)
#   4. terraform apply                                          (uploads Lambda + S3 site)
set -euo pipefail

INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$INFRA_DIR/../backend" && pwd)"
FRONTEND_DIR="$(cd "$INFRA_DIR/../frontend/task-board-frontend" && pwd)"
BUILD_DIR="$INFRA_DIR/build"
PACKAGE_DIR="$BUILD_DIR/package"

echo "Cleaning previous build..."
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

echo "Installing dependencies for Lambda (manylinux2014_x86_64, cp311)..."
python -m pip install \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --python-version 3.11 \
  --only-binary=:all: \
  --target "$PACKAGE_DIR" \
  -r "$INFRA_DIR/requirements-lambda.txt"

echo "Copying application code..."
cp -r "$BACKEND_DIR/app" "$PACKAGE_DIR/app"
cp "$BACKEND_DIR/lambda_handler.py" "$PACKAGE_DIR/lambda_handler.py"
find "$PACKAGE_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

echo "Zipping..."
python "$INFRA_DIR/zip_package.py" "$PACKAGE_DIR" "$BUILD_DIR/lambda_package.zip"

echo "Done: infra/build/lambda_package.zip"

echo "Building frontend..."
(
  cd "$FRONTEND_DIR"
  npm install
  if [ -n "${VITE_API_BASE_URL:-}" ]; then
    echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" > .env.production
  fi
  npm run build
)

echo "Done: frontend/task-board-frontend/dist"
