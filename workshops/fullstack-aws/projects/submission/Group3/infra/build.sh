#!/usr/bin/env bash
# Builds infra/build/lambda_package.zip. Run from anywhere; paths are
# resolved relative to this script. Requires Python 3.11 + pip.
set -euo pipefail

INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$INFRA_DIR/../backend" && pwd)"
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
