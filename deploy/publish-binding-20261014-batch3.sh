#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu
release=/opt/youpu-releases/20261014-binding-batch3
test ! -e "$release"
mkdir -p "$release"
chmod 700 "$release"
runuser -u postgres -- /usr/pgsql-16/bin/pg_dump -Fc youpu > "$release/database-before.dump"
/usr/pgsql-16/bin/pg_restore --list "$release/database-before.dump" > "$release/database-before.contents"
cp /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf "$release/ip-dropin-before.conf"
cp /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf "$release/domain-dropin-before.conf"
tar -tzf /tmp/youpu-binding-20261014c.tar.gz > "$release/upload-files.txt"
node - "$release" <<'JS'
const fs=require('fs');const path=require('path');const release=process.argv[2];
const files=fs.readFileSync(release+'/upload-files.txt','utf8').trim().split('\n');
for(const file of files){const resolved=path.resolve(file);if(!resolved.startsWith('/opt/youpu/')||file.includes('..'))throw Error('Unexpected archive path');}
fs.writeFileSync(release+'/existing-files.txt',files.filter(file=>fs.existsSync(file)).join('\n')+'\n');
JS
tar -czf "$release/source-before.tar.gz" -T "$release/existing-files.txt"
install -d -o youpu -g youpu -m 755 data/raw/binding-size-2026-10-14
tar -xzf /tmp/youpu-binding-20261014c.tar.gz
while IFS= read -r file; do chown youpu:youpu "$file"; done < "$release/upload-files.txt"
runuser -u youpu -- sh -c 'cd apps/api && pnpm exec tsx src/seed/sync-binding-size-charts.ts' > "$release/sync-preview.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-binding-20261014c-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-binding-20261014c-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-binding-20261014c-domain/BUILD_ID
test -s apps/web/.next-binding-20261014c-ip/BUILD_ID
protected_sql="SELECT md5(coalesce(jsonb_agg(to_jsonb(p)-'specs'-'updated_at' ORDER BY id)::text,'[]')) FROM product p;"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-before.txt"
runuser -u youpu -- sh -c 'cd apps/api && pnpm exec tsx src/seed/sync-binding-size-charts.ts --apply' > "$release/sync-apply.log" 2>&1
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-after.txt"
cmp "$release/protected-before.txt" "$release/protected-after.txt"
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-binding-20261014c-ip\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-binding-20261014c-domain\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf
systemctl daemon-reload
systemctl restart youpu-web youpu-domain-web
systemctl is-active youpu-api youpu-web youpu-domain-web
printf 'BINDING_RELEASE_COMPLETE\n'
