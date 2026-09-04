#!/bin/zsh

# venv activation only persists in the current shell if this script is sourced, not executed
if [[ $ZSH_EVAL_CONTEXT != *file* ]]; then
  echo "Run this with 'source setup-local-dev.sh' (not ./setup-local-dev.sh) so the venv activation persists in your shell." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"
CONTAINER_NAME="banking-postgres"
POSTGRES_PORT="5432"

if [ ! -d "$VENV_DIR" ]; then
  echo "Creating virtual environment..."
  python3 -m venv "$VENV_DIR" || return 1
fi

source "$VENV_DIR/bin/activate"

echo "Installing requirements..."
pip install -r "$SCRIPT_DIR/requirements.txt" || return 1

if [ -n "$(docker ps -aq -f name="^${CONTAINER_NAME}$")" ]; then
  if [ -z "$(docker ps -q -f name="^${CONTAINER_NAME}$")" ]; then
    echo "Starting existing ${CONTAINER_NAME} container..."
    docker start "$CONTAINER_NAME" > /dev/null
  else
    echo "${CONTAINER_NAME} is already running."
  fi
else
  echo "Creating ${CONTAINER_NAME} container..."
  docker run -d \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=admin \
    -e POSTGRES_DB=banking \
    -p "${POSTGRES_PORT}:5432" \
    postgres:16-alpine > /dev/null
fi

export DATABASE_URL="postgresql://admin:admin@localhost:${POSTGRES_PORT}/banking"

echo ""
echo "Setup complete. venv is active and DATABASE_URL is exported in this shell."
echo "To start local dev server:"
echo "  uvicorn main:app --reload"
