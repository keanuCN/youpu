#!/usr/bin/env bash
set -Eeuo pipefail

compose_file=${YOUPU_COMPOSE_FILE:-/opt/youpu/docker/compose.yml}
env_file=${YOUPU_ENV_FILE:-/opt/youpu/.env}
backup_dir=${YOUPU_PG_BACKUP_DIR:-/var/backups/youpu/postgres}
retention_days=${YOUPU_PG_BACKUP_RETENTION_DAYS:-30}

if [[ ! "$retention_days" =~ ^[1-9][0-9]*$ ]]; then
  echo "YOUPU_PG_BACKUP_RETENTION_DAYS must be a positive integer" >&2
  exit 2
fi
if [[ ! -f "$compose_file" ]]; then
  echo "Compose file not found: $compose_file" >&2
  exit 2
fi
if [[ ! -f "$env_file" ]]; then
  echo "Compose environment file not found: $env_file" >&2
  exit 2
fi

umask 077
mkdir -p "$backup_dir"
exec 9>"$backup_dir/.backup.lock"
if ! flock -n 9; then
  echo "A PostgreSQL backup is already running" >&2
  exit 1
fi

timestamp=$(date -u +%Y%m%dT%H%M%S)-$$Z
archive="$backup_dir/youpu-postgres-$timestamp.dump"
temporary="$backup_dir/.youpu-postgres-$timestamp.$$.tmp"
checksum="$archive.sha256"
if [[ -e "$archive" || -e "$checksum" ]]; then
  echo "Backup target already exists; refusing to overwrite: $archive" >&2
  exit 1
fi
cleanup() { rm -f -- "$temporary"; }
trap cleanup EXIT

compose=(docker compose --env-file "$env_file" -f "$compose_file")
"${compose[@]}" exec -T postgres sh -c \
  'pg_dump --format=custom --no-owner --no-acl -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  > "$temporary"

if [[ ! -s "$temporary" ]]; then
  echo "PostgreSQL produced an empty backup archive" >&2
  exit 1
fi

# Read the custom archive back through the database container's pg_restore.
"${compose[@]}" exec -T postgres pg_restore --list < "$temporary" > /dev/null
mv -- "$temporary" "$archive"
sha256sum "$archive" > "$checksum"

# Only files owned by this script and matching its fixed prefix are eligible for retention.
find "$backup_dir" -maxdepth 1 -type f \
  \( -name 'youpu-postgres-*.dump' -o -name 'youpu-postgres-*.dump.sha256' \) \
  -mtime "+$retention_days" -delete

printf 'PostgreSQL backup verified: %s\n' "$archive"
