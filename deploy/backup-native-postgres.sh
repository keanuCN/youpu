#!/usr/bin/env bash
# 当前服务器使用原生 PostgreSQL 16，不依赖旧 Docker 备份模板。
set -euo pipefail
umask 077
backup_dir=/var/backups/youpu/postgres
mkdir -p "$backup_dir"
chmod 700 "$backup_dir"
test "$(readlink -f "$backup_dir")" = /var/backups/youpu/postgres
exec 9>/run/lock/youpu-native-postgres-backup.lock
flock -n 9 || exit 0
stamp=$(date -u +%Y%m%dT%H%M%SZ)
archive="$backup_dir/youpu-$stamp.dump"
partial="$archive.partial"
trap 'rm -f -- "$partial"' EXIT
runuser -u postgres -- /usr/pgsql-16/bin/pg_dump -Fc youpu > "$partial"
/usr/pgsql-16/bin/pg_restore --list "$partial" > "$archive.contents"
mv -- "$partial" "$archive"
sha256sum "$archive" > "$archive.sha256"
printf 'BACKUP_COMPLETE %s\n' "$archive"
