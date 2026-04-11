#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

copy_if_missing() {
  local target="$1"
  local template="$2"

  if [ ! -f "$target" ]; then
    if [ ! -f "$template" ]; then
      echo "Missing template file: $template"
      echo "Run git pull and ensure deployment template files are present."
      exit 1
    fi

    cp "$template" "$target"
    echo "$target created from $template"
    echo "Please review and update $target before starting the stack."
  fi
}

ensure_not_template_copy() {
  local target="$1"
  local template="$2"

  if cmp -s "$target" "$template"; then
    echo "$target still matches $template"
    echo "Please edit $target before running the deployment."
    exit 1
  fi
}

copy_if_missing ".env.frontend" ".env.frontend.example"
copy_if_missing ".env.minio" ".env.minio.example"

if [ ! -f .env.frontend ]; then
  echo "Missing deploy/linux/.env.frontend"
  exit 1
fi

if [ ! -f .env.minio ]; then
  echo "Missing deploy/linux/.env.minio"
  exit 1
fi

ensure_not_template_copy ".env.frontend" ".env.frontend.example"
ensure_not_template_copy ".env.minio" ".env.minio.example"

docker compose up -d --build
docker compose ps
