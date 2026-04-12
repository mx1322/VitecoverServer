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
    echo "Please edit $target before starting the stack."
  fi
}

ensure_not_template_copy() {
  local target="$1"
  local template="$2"

  if cmp -s "$target" "$template"; then
    echo "$target still matches $template"
    echo "Please update these values before first startup:"
    echo "- NEXT_PUBLIC_SITE_URL"
    echo "- NEXT_PUBLIC_DIRECTUS_URL"
    echo "- MINIO_ROOT_USER"
    echo "- MINIO_ROOT_PASSWORD"
    echo "- MINIO_BUCKET"
    echo "Then run: bash up.sh"
    exit 1
  fi
}

ensure_required_values_set() {
  local target="$1"
  local required_keys=(
    "DB_PASSWORD"
    "DIRECTUS_KEY"
    "DIRECTUS_SECRET"
    "DIRECTUS_ADMIN_EMAIL"
    "DIRECTUS_ADMIN_PASSWORD"
    "MINIO_ROOT_USER"
    "MINIO_ROOT_PASSWORD"
    "MINIO_BUCKET"
    "NEXT_PUBLIC_SITE_URL"
    "NEXT_PUBLIC_DIRECTUS_URL"
    "PUBLIC_URL"
  )
  local missing=0

  for key in "${required_keys[@]}"; do
    if ! grep -q "^${key}=.\+" "$target"; then
      echo "Missing or empty required key: ${key}"
      missing=1
    fi
  done

  if [ "$missing" -eq 1 ]; then
    echo "Please fill in the required values in $target before starting."
    exit 1
  fi
}

ensure_minio_password_not_default() {
  local target="$1"
  local default_password="minioadmin123"

  if grep -q "^MINIO_ROOT_PASSWORD=${default_password}$" "$target"; then
    echo "MINIO_ROOT_PASSWORD is still the default in $target"
    echo "For security, change MINIO_ROOT_PASSWORD before deployment."
    echo "Then run: bash up.sh"
    exit 1
  fi
}

warn_legacy_env_files() {
  local legacy_files=(
    ".env.frontend"
    ".env.frontend.example"
    ".env.minio"
    ".env.minio.example"
    "../../backend/.env"
    "../../frontend/.env"
  )
  local found=0

  for file in "${legacy_files[@]}"; do
    if [ -f "$file" ]; then
      found=1
      break
    fi
  done

  if [ "$found" -eq 1 ]; then
    echo "Legacy env files detected (.env.frontend/.env.minio)."
    echo "The deployment now only uses .env.deploy."
    echo "After confirming .env.deploy is correct, you can clean up with:"
    echo "rm -f .env.frontend .env.frontend.example .env.minio .env.minio.example"
  fi
}

copy_if_missing ".env.deploy" ".env.deploy.example"

if [ ! -f .env.deploy ]; then
  echo "Missing deploy/linux/.env.deploy"
  exit 1
fi

warn_legacy_env_files
ensure_not_template_copy ".env.deploy" ".env.deploy.example"
ensure_required_values_set ".env.deploy"
ensure_minio_password_not_default ".env.deploy"

docker compose --env-file .env.deploy up -d --build
docker compose --env-file .env.deploy ps
