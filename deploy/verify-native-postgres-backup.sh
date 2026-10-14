#!/usr/bin/env bash
# 恢复至临时数据库，只读取恢复结果，不修改生产数据库。
set -euo pipefail
umask 077
archive=${1:?需要指定本机备份文件}
resolved=$(readlink -f "$archive")
case "$resolved" in /var/backups/youpu/postgres/youpu-*.dump) ;; *) printf 'Invalid backup path\n' >&2; exit 1;; esac
test -s "$resolved"
sha256sum --check "$resolved.sha256"
check_db="youpu_restore_check_$(date -u +%Y%m%d%H%M%S)_$$"
runuser -u postgres -- /usr/pgsql-16/bin/createdb "$check_db"
trap 'runuser -u postgres -- /usr/pgsql-16/bin/dropdb --if-exists "$check_db"' EXIT
runuser -u postgres -- /usr/pgsql-16/bin/pg_restore --no-owner --no-privileges --exit-on-error --dbname="$check_db" < "$resolved"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d "$check_db" -At -c 'SELECT count(*) AS products FROM product; SELECT count(*) AS accounts FROM account;'
printf 'ISOLATED_RESTORE_VERIFIED\n'
