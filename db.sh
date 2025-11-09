#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# Saleor Postgres Backup & Restore Helper
# - Auto-detects the running Postgres container from docker compose or docker ps
# - Backup to ./backups as timestamped .sql.gz
# - Restore from a chosen file (handles active connections)
# - Optional stop/start of app services to avoid locks
# - Works in Git Bash / WSL / Linux / macOS
# ------------------------------------------------------------------------------

set -euo pipefail

# ----------------------------- Colors & Emojis --------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $*${NC}"; }
err()  { echo -e "${RED}❌ $*${NC}" 1>&2; }

# ------------------------------- Config ---------------------------------------
# Override via environment variables when calling the script, e.g.:
# COMPOSE_PROJECT_NAME=vitecoverserver DB_SERVICE=db ./db-tools.sh backup

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
BACKUP_FILE="saleor_backup_${TIMESTAMP}.sql.gz"

# Compose project & services
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-vitecoverserver}"
DB_SERVICE="${DB_SERVICE:-db}"
APP_SERVICES=${APP_SERVICES:-"api worker dashboard"}  # Services to stop/start around restore

# Database credentials inside the container
DB_USER="${DB_USER:-saleor}"
DB_NAME="${DB_NAME:-saleor}"
# If your Postgres requires a password, export PGPASSWORD before running or set here:
# export PGPASSWORD="your_password"

# ------------------------------ Utils -----------------------------------------
have() { command -v "$1" >/dev/null 2>&1; }

compose_cmd() {
  if have docker-compose; then
    echo "docker-compose"
  else
    echo "docker compose"
  fi
}

resolve_container() {
  local cid=""
  local cc
  cc="$(compose_cmd)"

  # Try compose ps first
  if $cc ps -q "$DB_SERVICE" >/dev/null 2>&1; then
    cid="$($cc ps -q "$DB_SERVICE" 2>/dev/null || true)"
  fi

  # Fallback: docker ps by project+service name pattern
  if [ -z "$cid" ]; then
    cid="$(docker ps -q --filter "name=${COMPOSE_PROJECT_NAME}.*${DB_SERVICE}" | head -n1)"
  fi

  if [ -z "$cid" ]; then
    err "未找到数据库容器。请确认项目名/服务名。
提示：COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}，DB_SERVICE=${DB_SERVICE}
可通过环境变量覆盖：COMPOSE_PROJECT_NAME=xxx DB_SERVICE=db"
    exit 1
  fi

  echo "$cid"
}

wait_pg_ready() {
  local container_id="$1"
  local tries=40
  local i=0
  echo -e "${BLUE}⏳ 等待数据库就绪...${NC}"
  until docker exec "$container_id" pg_isready -U "$DB_USER" >/dev/null 2>&1; do
    i=$((i+1))
    if [ "$i" -ge "$tries" ]; then
      err "等待超时：数据库仍未就绪。"
      exit 1
    fi
    sleep 2
  done
  ok "数据库就绪。"
}

stop_app_services() {
  local cc; cc="$(compose_cmd)"
  for s in $APP_SERVICES; do
    if $cc ps "$s" >/dev/null 2>&1; then
      echo -e "${BLUE}⏹️  停止服务: $s${NC}"
      $cc stop "$s" || true
    fi
  done
}

start_app_services() {
  local cc; cc="$(compose_cmd)"
  for s in $APP_SERVICES; do
    if $cc ps -a "$s" >/dev/null 2>&1; then
      echo -e "${BLUE}▶️  启动服务: $s${NC}"
      $cc start "$s" || true
    fi
  done
}

terminate_active_connections() {
  local container_id="$1"
  echo -e "${BLUE}🔒  释放数据库连接...${NC}"
  docker exec -e PGPASSWORD="${PGPASSWORD:-}" -i "$container_id" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<'SQL' || true
DO $$
DECLARE
  r RECORD;
BEGIN
  -- 拒绝新连接
  EXECUTE format('REVOKE CONNECT ON DATABASE %I FROM PUBLIC;', current_database());
  -- 终止现有连接（跳过当前会话）
  FOR r IN
    SELECT pid FROM pg_stat_activity
    WHERE datname = current_database() AND pid <> pg_backend_pid()
  LOOP
    EXECUTE format('SELECT pg_terminate_backend(%s);', r.pid);
  END LOOP;
END$$;
SQL
}

# ------------------------------ Actions ---------------------------------------
backup_database() {
  mkdir -p "$BACKUP_DIR"
  echo -e "${BLUE}📦 开始备份数据库...${NC}"
  local CONTAINER_ID
  CONTAINER_ID="$(resolve_container)"
  wait_pg_ready "$CONTAINER_ID"

  # Plain SQL dump + gzip
  docker exec -e PGPASSWORD="${PGPASSWORD:-}" "$CONTAINER_ID" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/$BACKUP_FILE"

  ok "数据库备份成功。"
  echo "📁 文件: $BACKUP_DIR/$BACKUP_FILE"
  echo "📊 大小: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
}

list_backups() {
  echo -e "${BLUE}📋 可用备份：${NC}"
  if compgen -G "$BACKUP_DIR/*.sql.gz" >/dev/null; then
    ls -lah "$BACKUP_DIR"/*.sql.gz
  elif compgen -G "$BACKUP_DIR/*.sql" >/dev/null; then
    ls -lah "$BACKUP_DIR"/*.sql
  else
    echo "没有找到备份文件"
  fi
}

restore_database() {
  local file="${1:-}"
  if [ -z "$file" ]; then
    warn "请指定备份文件。示例：$0 restore ./backups/xxx.sql.gz"
    list_backups
    exit 1
  fi
  if [ ! -f "$file" ]; then
    err "备份文件不存在：$file"
    exit 1
  fi

  if [ "${FORCE:-}" != "1" ] && [ "${YES:-}" != "1" ]; then
    echo -ne "${YELLOW}⚠️  警告：将覆盖当前数据库！继续？(y/N): ${NC}"
    read -r ans || true
    case "$ans" in
      y|Y) ;;
      *) warn "已取消恢复。"; exit 0;;
    esac
  fi

  local CONTAINER_ID
  CONTAINER_ID="$(resolve_container)"
  wait_pg_ready "$CONTAINER_ID"

  # 建议恢复前停止应用服务，避免占用连接
  stop_app_services
  terminate_active_connections "$CONTAINER_ID"

  echo -e "${BLUE}🔄 开始恢复数据库...${NC}"
  if [[ "$file" == *.gz ]]; then
    gzip -dc "$file" | docker exec -e PGPASSWORD="${PGPASSWORD:-}" -i "$CONTAINER_ID" psql -U "$DB_USER" -d "$DB_NAME"
  else
    docker exec -e PGPASSWORD="${PGPASSWORD:-}" -i "$CONTAINER_ID" psql -U "$DB_USER" -d "$DB_NAME" < "$file"
  fi

  ok "数据库恢复成功。"
  start_app_services
}

restore_latest() {
  local latest=""
  if compgen -G "$BACKUP_DIR/*.sql.gz" >/dev/null; then
    latest="$(ls -t "$BACKUP_DIR"/*.sql.gz | head -n1)"
  elif compgen -G "$BACKUP_DIR/*.sql" >/dev/null; then
    latest="$(ls -t "$BACKUP_DIR"/*.sql | head -n1)"
  fi

  if [ -z "$latest" ]; then
    err "未找到任何备份文件。"
    exit 1
  fi
  restore_database "$latest"
}

status() {
  local cc; cc="$(compose_cmd)"
  echo -e "${BLUE}🧭 当前容器状态：${NC}"
  $cc ps || true
  echo
  list_backups
}

# ------------------------------ Menu (optional) -------------------------------
show_menu() {
  echo -e "${BLUE}🗄️ Saleor 数据库工具${NC}"
  echo "1) 备份数据库"
  echo "2) 恢复数据库（选择文件）"
  echo "3) 恢复最新备份"
  echo "4) 列出备份文件"
  echo "5) 停止应用服务"
  echo "6) 启动应用服务"
  echo "7) 状态"
  echo "8) 退出"
  echo -n "请输入选项 (1-8): "
}

interactive_menu() {
  while true; do
    show_menu
    read -r choice || true
    case "$choice" in
      1) backup_database; echo ;;
      2) echo -n "备份文件路径: "; read -r f; restore_database "$f"; echo ;;
      3) restore_latest; echo ;;
      4) list_backups; echo ;;
      5) stop_app_services; echo ;;
      6) start_app_services; echo ;;
      7) status; echo ;;
      8) ok "再见！"; exit 0 ;;
      *) warn "无效选项。";;
    esac
  done
}

# ------------------------------ CLI -------------------------------------------
usage() {
  cat <<EOF
用法: $0 [command]

命令:
  backup                      备份数据库到 ${BACKUP_DIR}/saleor_backup_YYYYmmdd_HHMMSS.sql.gz
  restore <file>              从指定备份文件恢复（支持 .sql 或 .sql.gz）
  restore-latest              恢复最新的备份文件
  list                        列出备份文件
  stop-app                    停止应用服务: ${APP_SERVICES}
  start-app                   启动应用服务: ${APP_SERVICES}
  status                      显示 compose 容器状态与备份列表
  (无参数)                    交互式菜单

环境变量（可覆盖默认值）:
  COMPOSE_PROJECT_NAME  (默认: ${COMPOSE_PROJECT_NAME})
  DB_SERVICE            (默认: ${DB_SERVICE})
  APP_SERVICES          (默认: "${APP_SERVICES}")
  DB_USER               (默认: ${DB_USER})
  DB_NAME               (默认: ${DB_NAME})
  BACKUP_DIR            (默认: ${BACKUP_DIR})
  PGPASSWORD            (如数据库启用密码请设置)
  FORCE=1 / YES=1       恢复时跳过确认
EOF
}

case "${1:-}" in
  backup)          backup_database ;;
  restore)         shift || true; restore_database "${1:-}" ;;
  restore-latest)  restore_latest ;;
  list)            list_backups ;;
  stop-app)        stop_app_services ;;
  start-app)       start_app_services ;;
  status)          status ;;
  "")              interactive_menu ;;
  *)               usage; exit 1 ;;
esac
