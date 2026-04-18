#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE="deploy/linux/.env.deploy"
ENV_TEMPLATE="deploy/linux/.env.deploy.example"

copy_if_missing() {
  local target="$1"
  local template="$2"

  if [ ! -f "$target" ]; then
    if [ ! -f "$template" ]; then
      echo "Missing template file: $template"
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
    echo "Then run: ./up.sh"
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
    echo "Then run: ./up.sh"
    exit 1
  fi
}

ensure_minio_bucket_exists() {
  local env_file="$1"

  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a

  echo "Ensuring MinIO bucket exists: ${MINIO_BUCKET}"

  docker exec vitecover_minio sh -lc "
    set -e
    mc alias set local http://127.0.0.1:9000 \"$MINIO_ROOT_USER\" \"$MINIO_ROOT_PASSWORD\" >/dev/null
    mc mb -p \"local/$MINIO_BUCKET\" >/dev/null 2>&1 || true
  "
}

copy_if_missing "$ENV_FILE" "$ENV_TEMPLATE"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

ensure_not_template_copy "$ENV_FILE" "$ENV_TEMPLATE"
ensure_required_values_set "$ENV_FILE"
ensure_minio_password_not_default "$ENV_FILE"

remove_conflicting_named_containers() {
  local names=(
    "vitecover_minio"
    "vitecover_directus"
    "vitecover_frontend"
    "vitecover_edge"
    "directus_postgres"
    "directus_redis"
    "directus_app"
    "directus_nginx"
  )

  for name in "${names[@]}"; do
    if docker ps -a --format '{{.Names}}' | grep -Fxq "$name"; then
      docker rm -f "$name" >/dev/null
    fi
  done
}

remove_conflicting_named_containers
docker compose --env-file "$ENV_FILE" -f backend/docker-compose.yml -f docker-compose.override.yml up -d --build
ensure_minio_bucket_exists "$ENV_FILE"
docker compose --env-file "$ENV_FILE" -f backend/docker-compose.yml -f docker-compose.override.yml ps
