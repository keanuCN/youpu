#!/usr/bin/env bash
# 两阶段发布：prepare 备份与构建，检查预览后 apply 迁移、同步并切换服务。
set -euo pipefail
umask 077
revision=${1:?需要提交号}
phase=${2:?需要 prepare 或 apply}
[[ "$revision" =~ ^[0-9a-f]{7,40}$ ]] || exit 2
[[ "$phase" = prepare || "$phase" = apply ]] || exit 2
cd /opt/youpu
release="/opt/youpu-releases/20261027-$revision"
archive="/tmp/youpu-$revision.tar.gz"
api_stage="/opt/youpu/apps/api/.dist-release-$revision"
admin_static="/opt/youpu/apps/admin/releases/20261027-$revision"
dropin=zzzzzzzzzzzzzz-release-20261027.conf
exec 8>/run/lock/youpu-release.lock
flock -n 8 || { echo '另一个发布仍在运行'; exit 1; }

protected_counts() {
  runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -Atc "SELECT json_build_object('accounts',(SELECT count(*) FROM account),'ratings',(SELECT count(*) FROM rating),'ratingVotes',(SELECT count(*) FROM rating_vote),'replies',(SELECT count(*) FROM rating_reply),'favorites',(SELECT count(*) FROM favorite))"
}

if [[ "$phase" = prepare ]]; then
  test -s "$archive"
  test ! -e "$release"
  mkdir -p "$release" "$admin_static/domain" "$admin_static/ip"
  chmod 700 "$release"
  echo '正在保存数据库、源码和服务回滚材料'
  runuser -u postgres -- /usr/pgsql-16/bin/pg_dump -Fc youpu > "$release/database-before.dump"
  /usr/pgsql-16/bin/pg_restore --list "$release/database-before.dump" > "$release/database-before.contents"
  sha256sum "$release/database-before.dump" > "$release/database-before.sha256"
  protected_counts > "$release/protected-before.json"
  tar --exclude=node_modules --exclude='.next*' --exclude=out --exclude='prisma/generated' -czf "$release/source-before.tar.gz" apps packages data package.json pnpm-lock.yaml pnpm-workspace.yaml
  cp -a apps/api/dist "$release/api-dist-before"
  cp -a /etc/systemd/system/youpu-web.service.d "$release/systemd-ip-before"
  cp -a /etc/systemd/system/youpu-domain-web.service.d "$release/systemd-domain-before"
  readlink apps/admin/current-ip > "$release/admin-ip-before.txt"
  readlink apps/admin/current-domain > "$release/admin-domain-before.txt"
  tar -xzf "$archive" -C /opt/youpu
  chown youpu:youpu apps/web apps/admin apps/api packages/schema
  find apps/web apps/admin packages/schema -maxdepth 1 -type f -exec chown youpu:youpu {} +
  chown -R youpu:youpu apps/web/src apps/web/scripts apps/web/public apps/admin/src apps/api/src apps/api/prisma packages/schema/src data
  chown youpu:youpu package.json pnpm-lock.yaml apps/web/package.json apps/api/package.json apps/admin/package.json
  echo '正在安装依赖并构建共享契约与 API'
  # 服务器既有依赖使用 root 的 pnpm store；沿用同一缓存，避免删除运行中的依赖目录。
  (umask 022; CI=true pnpm install --frozen-lockfile) > "$release/install.log" 2>&1
  runuser -u youpu -- pnpm --filter @youpu/schema build > "$release/build-schema.log" 2>&1
  mkdir -p "$api_stage"
  chown youpu:youpu "$api_stage"
  runuser -u youpu -- pnpm --filter @youpu/api exec tsc -p tsconfig.build.json --outDir "$api_stage" --incremental false > "$release/build-api.log" 2>&1
  runuser -u youpu -- pnpm --filter @youpu/api exec tsx src/seed/sync-curated-snow-data.ts > "$release/sync-preview.json" 2>&1
  for target in domain ip; do
    if [[ "$target" = domain ]]; then base=; site=https://youpu.asia; else base=/youpu; site=http://115.190.156.88/youpu; fi
    echo "正在构建 $target 前台"
    runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=".next-release-$revision-$target" NEXT_PUBLIC_BASE_PATH="$base" NEXT_PUBLIC_SITE_URL="$site" NEXT_PUBLIC_API_BASE="$site" NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-web-$target.log" 2>&1
    test -s "apps/web/.next-release-$revision-$target/BUILD_ID"
    echo "正在构建 $target 后台"
    runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_PUBLIC_BASE_PATH="$base/admin" NEXT_PUBLIC_API_BASE="$site" NEXT_PUBLIC_ENABLE_LEGACY_ADMIN=false pnpm --filter @youpu/admin build > "$release/build-admin-$target.log" 2>&1
    cp -a apps/admin/out/. "$admin_static/$target/"
  done
  find "$admin_static" -type d -exec chmod 755 {} +
  find "$admin_static" -type f -exec chmod 644 {} +
  chmod 755 apps/admin/releases
  touch "$release/READY"
  printf 'PREPARED %s\n' "$release"
  exit 0
fi

test -s "$release/database-before.dump"
test -f "$release/READY"
test ! -f "$release/DEPLOYED"
echo '正在应用数据库迁移和滑雪目录同步'
runuser -u youpu -- pnpm --filter @youpu/api prisma:migrate > "$release/migrate.log" 2>&1
protected_counts > "$release/protected-presync.json"
runuser -u youpu -- pnpm --filter @youpu/api exec tsx src/seed/sync-curated-snow-data.ts --apply > "$release/sync-apply.log" 2>&1
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -f deploy/backfill-product-covers.sql > "$release/cover-backfill.log" 2>&1
protected_counts > "$release/protected-after.json"
cmp "$release/protected-presync.json" "$release/protected-after.json"
cp -a "$api_stage/." apps/api/dist/
chown -R youpu:youpu apps/api/dist
systemctl restart youpu-api
for attempt in $(seq 1 20); do
  if curl --fail --silent http://127.0.0.1:3001/api/health > "$release/health-api.json"; then break; fi
  sleep 2
done
node -e 'const h=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); if(!h.db||!h.redis)process.exit(1)' "$release/health-api.json"
echo '正在切换前台和后台发布版本'
for target in domain ip; do
  if [[ "$target" = domain ]]; then service=youpu-domain-web; else service=youpu-web; fi
  printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-release-%s-%s\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\nEnvironment=CONTENT_API_BASE=http://127.0.0.1:3001\nEnvironment=CONTENT_TIMING=true\n' "$revision" "$target" > "/etc/systemd/system/$service.service.d/$dropin"
done
test -L apps/admin/current-ip
test -L apps/admin/current-domain
ln -sfn "$admin_static/ip" apps/admin/current-ip
ln -sfn "$admin_static/domain" apps/admin/current-domain
nginx -t
systemctl daemon-reload
systemctl show youpu-domain-web -p Environment | grep -F "NEXT_DIST_DIR=.next-release-$revision-domain" > /dev/null
systemctl show youpu-web -p Environment | grep -F "NEXT_DIST_DIR=.next-release-$revision-ip" > /dev/null
systemctl restart youpu-domain-web youpu-web
for attempt in $(seq 1 20); do
  if curl --fail --silent --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/privacy > "$release/privacy.html"; then break; fi
  sleep 2
done
curl --fail --silent --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/guides/alpine-ski -o "$release/alpine-ski.html"
curl --fail --silent http://127.0.0.1/youpu/privacy -o /dev/null
curl --fail --silent http://127.0.0.1/ -o /dev/null
systemctl is-active youpu-api youpu-web youpu-domain-web
touch "$release/DEPLOYED"
printf 'DEPLOYED %s\n' "$release"
