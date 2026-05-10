#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "$REPO_ROOT"

BACKUP_ENV_FILE="${BACKUP_ENV_FILE:-deploy/linux/.env.deploy}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-vitecover_postgres}"
MINIO_CONTAINER="${MINIO_CONTAINER:-vitecover_minio}"
CUSTOMER_BACKUP_PROVIDER="${CUSTOMER_BACKUP_PROVIDER:-local}"
CUSTOMER_BACKUP_PREFIX="${CUSTOMER_BACKUP_PREFIX:-vitecover/customer-data}"

if [[ ! -f "$BACKUP_ENV_FILE" ]]; then
  echo "Missing backup env file: $BACKUP_ENV_FILE"
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

timestamp="$(date -u +%Y%m%d-%H%M%S)"
backup_root="backend/backups/customer-data"
backup_dir="${backup_root}/${timestamp}"
archive_path="${backup_root}/vitecover-customer-data-${timestamp}.tar.gz"

mkdir -p "$backup_dir"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "WARNING: backup output is inside a Git repository; do not commit customer backups."
fi

echo "[1/4] Dump PostgreSQL from container ${POSTGRES_CONTAINER}"
docker exec "$POSTGRES_CONTAINER" sh -lc "pg_dump -Fc -U '$DB_USER' '$DB_DATABASE'" > "${backup_dir}/postgres.dump"

echo "[2/4] Mirror MinIO bucket ${MINIO_BUCKET} from container ${MINIO_CONTAINER}"
mkdir -p "${backup_dir}/minio/${MINIO_BUCKET}"
docker exec "$MINIO_CONTAINER" sh -lc '
  set -e
  mc alias set local http://127.0.0.1:9000 "'"$MINIO_ROOT_USER"'" "'"$MINIO_ROOT_PASSWORD"'" >/dev/null
  mc mb -p "local/'"$MINIO_BUCKET"'" >/dev/null 2>&1 || true
  mc mirror --overwrite "local/'"$MINIO_BUCKET"'" /tmp/customer-backup/'"$MINIO_BUCKET"'
'
docker cp "${MINIO_CONTAINER}:/tmp/customer-backup/${MINIO_BUCKET}/." "${backup_dir}/minio/${MINIO_BUCKET}/"
docker exec "$MINIO_CONTAINER" rm -rf /tmp/customer-backup || true

cat > "${backup_dir}/manifest.json" <<JSON
{
  "generated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "postgres_container": "${POSTGRES_CONTAINER}",
  "database": "${DB_DATABASE}",
  "minio_container": "${MINIO_CONTAINER}",
  "minio_bucket": "${MINIO_BUCKET}",
  "customer_data_warning": "Contains private/customer data. Never commit to Git.",
  "provider": "${CUSTOMER_BACKUP_PROVIDER}"
}
JSON

echo "[3/4] Create archive ${archive_path}"
tar -C "$backup_root" -czf "$archive_path" "$timestamp"

upload_archive() {
  local bucket="${CUSTOMER_BACKUP_BUCKET:-}"
  if [[ -z "$bucket" ]]; then
    echo "No CUSTOMER_BACKUP_BUCKET configured; skipping remote upload."
    return 0
  fi

  if ! command -v aws >/dev/null 2>&1; then
    echo "aws CLI not found; skipping remote upload."
    return 0
  fi

  local key="${CUSTOMER_BACKUP_PREFIX%/}/$(basename "$archive_path")"
  local s3_uri="s3://${bucket}/${key}"

  if [[ -n "${AWS_ENDPOINT_URL:-}" ]]; then
    aws s3 cp "$archive_path" "$s3_uri" --endpoint-url "$AWS_ENDPOINT_URL"
  else
    aws s3 cp "$archive_path" "$s3_uri"
  fi
  echo "Uploaded archive to ${s3_uri}"
}

echo "[4/4] Optional remote upload (${CUSTOMER_BACKUP_PROVIDER})"
if [[ "$CUSTOMER_BACKUP_PROVIDER" == "minio" || "$CUSTOMER_BACKUP_PROVIDER" == "s3" ]]; then
  upload_archive
else
  echo "Local-only backup mode; skipping remote upload."
fi

echo "Customer backup complete"
echo "Backup directory: ${backup_dir}"
echo "Archive: ${archive_path}"
