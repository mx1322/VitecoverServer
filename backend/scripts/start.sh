#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$BACKEND_DIR"

if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env created from .env.example"
fi

docker compose up -d
docker compose ps
