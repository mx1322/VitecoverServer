#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env created from .env.example"
fi

docker compose up -d
docker compose ps
