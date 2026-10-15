#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu

release=/opt/youpu-releases/20261014-binding-scores
package=/tmp/youpu-binding-scores-20261014.tar.gz
test ! -e "$release"
test -s "$package"
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
const allowedRoots = ['apps/api/src/catalog/', 'apps/api/src/seed/', 'apps/web/scripts/', 'apps/web/src/', 'packages/schema/src/', 'data/snowboard-binding/', 'deploy/', 'docs/'];
for (const file of files) {
  const resolved = path.resolve('/opt/youpu', file);
  if (!resolved.startsWith('/opt/youpu/') || path.isAbsolute(file) || file.split(/[\\/]/).includes('..')) throw new Error(`Unsafe archive path: ${file}`);
  if (!(file === 'README.md' || file === 'data/categories.yaml' || allowedRoots.some(root => file.startsWith(root)))) throw new Error(`Unexpected archive path: ${file}`);
}
fs.writeFileSync(`${release}/existing-files.txt`, files.filter(file => fs.existsSync(path.resolve('/opt/youpu', file))).join('\n') + '\n');
JS
tar -czf "$release/source-before.tar.gz" -T "$release/existing-files.txt"
tar -xzf "$package" -C /opt/youpu
while IFS= read -r file; do chown youpu:youpu "$file"; done < "$release/upload-files.txt"

runuser -u youpu -- pnpm --filter @youpu/schema build > "$release/build-schema.log" 2>&1
runuser -u youpu -- sh -c 'cd apps/api && pnpm exec tsx src/seed/sync-binding-editorial-scores.ts' > "$release/sync-preview.log" 2>&1
protected_sql="SELECT md5(coalesce(jsonb_agg(to_jsonb(p)-'editorial_scores'-'updated_at' ORDER BY id)::text,'[]')) FROM product p;"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-before.txt"
runuser -u youpu -- sh -c 'cd apps/api && pnpm exec tsx src/seed/sync-binding-editorial-scores.ts --apply' > "$release/sync-apply.log" 2>&1
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-after.txt"
cmp "$release/protected-before.txt" "$release/protected-after.txt"

runuser -u youpu -- pnpm --filter @youpu/api build > "$release/build-api.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-binding-scores-20261014-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-binding-scores-20261014-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-binding-scores-20261014-domain/BUILD_ID
test -s apps/web/.next-binding-scores-20261014-ip/BUILD_ID

printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-binding-scores-20261014-ip\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-binding-scores-20261014-domain\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf
systemctl daemon-reload
systemctl restart youpu-api youpu-web youpu-domain-web
systemctl is-active youpu-api youpu-web youpu-domain-web > "$release/services.txt"

for attempt in $(seq 1 30); do
  if curl --fail --location --silent --show-error http://127.0.0.1:3000/youpu/ > "$release/home-ip.html"; then break; fi
  sleep 1
done
test -s "$release/home-ip.html"
for attempt in $(seq 1 30); do
  if curl --fail --location --silent --show-error --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/ > "$release/home-domain.html"; then break; fi
  sleep 1
done
test -s "$release/home-domain.html"
curl --fail --silent --show-error --get --data-urlencode 'url=https://unionbindingcompany.com/cdn/shop/files/UN26_ATLAS_BLACK_1024x.jpg?v=1785333183' http://127.0.0.1:3000/youpu/api/image-proxy -o "$release/proxy-check.img"
test -s "$release/proxy-check.img"
node <<'JS' > "$release/verification-api.json"
(async () => {
  const response = await fetch('http://127.0.0.1:3001/api/products?category=snowboard-binding&page=1&pageSize=100');
  if (!response.ok) throw new Error(`API HTTP ${response.status}`);
  const body = await response.json();
  const items = body.items ?? [];
  const scored = items.filter(item => item.editorialScores && Object.keys(item.editorialScores).length === 5);
  if (items.length !== 59 || scored.length !== 59) throw new Error(`Expected 59 fully scored bindings; got ${items.length}/${scored.length}`);
  console.log(JSON.stringify({ total: items.length, fullyScored: scored.length }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
JS

printf 'BINDING_SCORES_RELEASE_COMPLETE\n' > "$release/result.txt"
cat "$release/result.txt"
