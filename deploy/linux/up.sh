#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env.frontend ]; then
  cp .env.frontend.example .env.frontend
  echo ".env.frontend created from .env.frontend.example"
fi

if [ ! -f .env.minio ]; then
  cp .env.minio.example .env.minio
  echo ".env.minio created from .env.minio.example"
fi

docker compose up -d --build
docker compose ps
