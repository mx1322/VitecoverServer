#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "$REPO_ROOT"

BACKUP_ENV_FILE="${BACKUP_ENV_FILE:-deploy/linux/.env.deploy}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-vitecover_postgres}"
MINIO_CONTAINER="${MINIO_CONTAINER:-vitecover_minio}"
ARCHIVE=""
YES="false"

usage() {
  echo "Usage: bash backend/scripts/restore_customer_data.sh --archive <archive.tar.gz> [--yes]"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --archive)
      ARCHIVE="$2"
      shift 2
      ;;
    --yes)
      YES="true"
      shift
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$ARCHIVE" ]]; then
  usage
  exit 1
fi

if [[ ! -f "$ARCHIVE" ]]; then
  echo "Archive not found: $ARCHIVE"
  exit 1
fi

if [[ ! -f "$BACKUP_ENV_FILE" ]]; then
  echo "Missing env file: $BACKUP_ENV_FILE"
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$BACKUP_ENV_FILE"
set +a

: "${DB_DATABASE:?Missing DB_DATABASE in env}"
: "${DB_USER:?Missing DB_USER in env}"
: "${MINIO_ROOT_USER:?Missing MINIO_ROOT_USER in env}"
: "${MINIO_ROOT_PASSWORD:?Missing MINIO_ROOT_PASSWORD in env}"
: "${MINIO_BUCKET:?Missing MINIO_BUCKET in env}"

if [[ "$YES" != "true" ]]; then
  echo "WARNING: this operation is destructive and will replace database and MinIO bucket contents."
  read -r -p "Type 'restore' to continue: " confirm
  if [[ "$confirm" != "restore" ]]; then
    echo "Cancelled."
    exit 1
  fi
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

echo "Extracting archive to ${tmp_dir}"
tar -xzf "$ARCHIVE" -C "$tmp_dir"
restore_root="$(find "$tmp_dir" -mindepth 1 -maxdepth 1 -type d | head -n 1)"

if [[ ! -f "${restore_root}/postgres.dump" ]]; then
  echo "Invalid archive: postgres.dump not found"
  exit 1
fi

echo "Stopping app containers before restore"
docker stop vitecover_directus vitecover_frontend || true

echo "Restoring PostgreSQL database ${DB_DATABASE}"
docker cp "${restore_root}/postgres.dump" "${POSTGRES_CONTAINER}:/tmp/postgres.dump"
docker exec "$POSTGRES_CONTAINER" sh -lc "psql -U '$DB_USER' -d postgres -c \"DROP DATABASE IF EXISTS \\\"$DB_DATABASE\\\";\""
docker exec "$POSTGRES_CONTAINER" sh -lc "psql -U '$DB_USER' -d postgres -c \"CREATE DATABASE \\\"$DB_DATABASE\\\";\""
docker exec "$POSTGRES_CONTAINER" sh -lc "pg_restore -U '$DB_USER' -d '$DB_DATABASE' --clean --if-exists /tmp/postgres.dump"
docker exec "$POSTGRES_CONTAINER" rm -f /tmp/postgres.dump

echo "Restoring MinIO bucket ${MINIO_BUCKET}"
docker exec "$MINIO_CONTAINER" sh -lc '
  set -e
  mc alias set local http://127.0.0.1:9000 "'"$MINIO_ROOT_USER"'" "'"$MINIO_ROOT_PASSWORD"'" >/dev/null
  mc mb -p "local/'"$MINIO_BUCKET"'" >/dev/null 2>&1 || true
  mc rm --recursive --force "local/'"$MINIO_BUCKET"'" >/dev/null 2>&1 || true
'
if [[ -d "${restore_root}/minio/${MINIO_BUCKET}" ]]; then
  docker cp "${restore_root}/minio/${MINIO_BUCKET}/." "${MINIO_CONTAINER}:/tmp/restore-minio/${MINIO_BUCKET}/"
  docker exec "$MINIO_CONTAINER" sh -lc '
    set -e
    mc alias set local http://127.0.0.1:9000 "'"$MINIO_ROOT_USER"'" "'"$MINIO_ROOT_PASSWORD"'" >/dev/null
    mc mirror --overwrite /tmp/restore-minio/'"$MINIO_BUCKET"' "local/'"$MINIO_BUCKET"'"
    rm -rf /tmp/restore-minio
  '
else
  echo "No minio/${MINIO_BUCKET} directory in archive; skipping object restore."
fi

echo "Restarting stack"
./up.sh

echo "Verification checks"
if curl -fsS "${PUBLIC_URL:-http://localhost/directus}/server/health" >/dev/null; then
  echo "Directus health check: ok"
else
  echo "Directus health check failed"
fi

docker exec "$POSTGRES_CONTAINER" sh -lc "psql -U '$DB_USER' -d '$DB_DATABASE' -tAc 'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = ''public'';'"
docker exec "$MINIO_CONTAINER" sh -lc '
  mc alias set local http://127.0.0.1:9000 "'"$MINIO_ROOT_USER"'" "'"$MINIO_ROOT_PASSWORD"'" >/dev/null
  mc ls "local/'"$MINIO_BUCKET"'" >/dev/null
'

echo "Customer data restore completed"
