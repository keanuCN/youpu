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

# 仅在本次备份完整并通过 pg_restore 目录校验后清理超过 30 天的归档。
# 目录已验证为固定路径；只匹配本脚本生成的 UTC 时间戳文件名。
while IFS= read -r -d '' old_archive; do
  old_name=${old_archive##*/}
  if [[ "$old_name" =~ ^youpu-[0-9]{8}T[0-9]{6}Z\.dump$ ]]; then
    rm -f -- "$old_archive" "$old_archive.contents" "$old_archive.sha256"
  fi
done < <(find "$backup_dir" -maxdepth 1 -type f -name 'youpu-*.dump' -mmin +43200 -print0)

printf 'BACKUP_COMPLETE %s\n' "$archive"
