#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu
release=/opt/youpu-releases/20261014-snowboard-size-r2
package=/tmp/youpu-snowboard-size-20261014.tar.gz
test ! -e "$release"
mkdir -p "$release"
chmod 700 "$release"

runuser -u postgres -- /usr/pgsql-16/bin/pg_dump -Fc youpu > "$release/database-before.dump"
/usr/pgsql-16/bin/pg_restore --list "$release/database-before.dump" > "$release/database-before.contents"
cp /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf "$release/ip-dropin-before.conf"
cp /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf "$release/domain-dropin-before.conf"

tar -tzf "$package" > "$release/upload-files.txt"
node - "$release" <<'JS'
const fs = require('fs');
const path = require('path');
const release = process.argv[2];
const files = fs.readFileSync(`${release}/upload-files.txt`, 'utf8').trim().split('\n');
const allowed = new Set([
  'README.md',
  'data/raw/snowboard/completion-2026-10-14/verified-size-tables.json',
  'data/snowboard/bataleon-evil-twin-2025.yaml',
  'data/snowboard/burton-custom-camber-2026.yaml',
  'data/snowboard/decathlon-all-road-900-2026.yaml',
  'data/snowboard/decathlon-park-ride-500-2026.yaml',
  'data/snowboard/decathlon-snb-100-2026.yaml',
  'deploy/publish-snowboard-size-20261014.sh',
  'docs/滑雪数据深化-2026-10-14.md',
]);
if (files.length !== allowed.size || files.some(file => !allowed.has(file) || file.includes('..') || !path.resolve(file).startsWith('/opt/youpu/')))
  throw new Error('Unexpected archive paths');
fs.writeFileSync(`${release}/existing-files.txt`, files.filter(file => fs.existsSync(file)).join('\n') + '\n');
JS
tar -czf "$release/source-before.tar.gz" -T "$release/existing-files.txt"
tar -xzf "$package" -C /opt/youpu
while IFS= read -r file; do chown youpu:youpu "$file"; done < "$release/upload-files.txt"

runuser -u youpu -- sh -c 'cd /opt/youpu/apps/api && pnpm exec tsx src/seed/sync-equipment-content.ts --categories snowboard' > "$release/sync-preview.log" 2>&1
protected_sql="SELECT md5(coalesce(jsonb_agg(to_jsonb(p)-'specs'-'updated_at' ORDER BY id)::text,'[]')) FROM product p;"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-before.txt"
runuser -u youpu -- sh -c 'cd /opt/youpu/apps/api && pnpm exec tsx src/seed/sync-equipment-content.ts --categories snowboard --apply' > "$release/sync-apply.log" 2>&1
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-after.txt"
cmp "$release/protected-before.txt" "$release/protected-after.txt"

runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-snowboard-size-20261014-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-snowboard-size-20261014-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-snowboard-size-20261014-domain/BUILD_ID
test -s apps/web/.next-snowboard-size-20261014-ip/BUILD_ID

printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-snowboard-size-20261014-ip\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-snowboard-size-20261014-domain\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf
systemctl daemon-reload
systemctl restart youpu-web youpu-domain-web
systemctl is-active youpu-api youpu-web youpu-domain-web > "$release/services.txt"
for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error http://127.0.0.1:3000/youpu/guides/snowboard-setup > "$release/guide-ip.html"; then break; fi
  sleep 1
done
test -s "$release/guide-ip.html"
for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/guides/snowboard-setup > "$release/guide-domain.html"; then break; fi
  sleep 1
done
test -s "$release/guide-domain.html"
node <<'JS'
const expected = new Map([
  ['bataleon-evil-twin-2025', 6],
  ['burton-custom-camber-2026', 10],
  ['decathlon-all-road-900-2026', 3],
  ['decathlon-park-ride-500-2026', 4],
  ['decathlon-snb-100-2026', 3],
]);
(async () => {
  for (const [slug, rows] of expected) {
    const response = await fetch(`http://127.0.0.1:3001/api/products/${slug}`);
    if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
    const product = await response.json();
    const actual = product.specs?.sizeSpecs?.length ?? 0;
    if (actual !== rows) throw new Error(`${slug}: expected ${rows}, got ${actual}`);
    if (!product.specs?.selectionNotes?.includes('https://')) throw new Error(`${slug}: source link missing`);
    console.log(`${slug}: ${actual} rows`);
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
JS
printf 'SNOWBOARD_SIZE_RELEASE_COMPLETE\n' > "$release/result.txt"
cat "$release/result.txt"
