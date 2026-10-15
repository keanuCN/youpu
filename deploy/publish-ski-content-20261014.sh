#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu
release=/opt/youpu-releases/20261014-ski-content
package=/tmp/youpu-ski-content-20261014.tar.gz
test ! -e "$release"
mkdir -p "$release"
chmod 700 "$release"

runuser -u postgres -- /usr/pgsql-16/bin/pg_dump -Fc youpu > "$release/database-before.dump"
/usr/pgsql-16/bin/pg_restore --list "$release/database-before.dump" > "$release/database-before.contents"
tar -tzf "$package" > "$release/upload-files.txt"
node - "$release" <<'JS'
const fs = require('fs');
const path = require('path');
const release = process.argv[2];
const files = fs.readFileSync(`${release}/upload-files.txt`, 'utf8').trim().split('\n').filter(file => !file.endsWith('/'));
const allowedFiles = new Set([
  'apps/api/src/seed/sync-ski-content.ts',
  'data/categories.yaml',
]);
const skiFiles = files.filter(file => file.startsWith('data/skis/') && file.endsWith('.yaml'));
if (skiFiles.length !== 39 || files.length !== allowedFiles.size + skiFiles.length ||
    files.some(file => file.includes('..') || (!allowedFiles.has(file) && !skiFiles.includes(file)))) {
  throw new Error(`Unexpected archive contents: ${files.length} files, ${skiFiles.length} ski seeds`);
}
const existing = files.filter(file => fs.existsSync(path.resolve('/opt/youpu', file)));
for (const oldFile of ['data/skis/salomon-qst-92-2027.yaml', 'data/skis/salomon-qst-98-2027.yaml']) {
  if (!fs.existsSync(path.resolve('/opt/youpu', oldFile))) throw new Error(`Expected legacy seed is missing: ${oldFile}`);
  existing.push(oldFile);
}
fs.writeFileSync(`${release}/existing-files.txt`, `${existing.join('\n')}\n`);
JS
tar -czf "$release/source-before.tar.gz" -T "$release/existing-files.txt"
tar -xzf "$package" -C /opt/youpu
rm -f /opt/youpu/data/skis/salomon-qst-92-2027.yaml /opt/youpu/data/skis/salomon-qst-98-2027.yaml
while IFS= read -r file; do chown youpu:youpu "$file"; done < "$release/upload-files.txt"
chown youpu:youpu /opt/youpu/data/skis/salomon-qst-92-2024.yaml /opt/youpu/data/skis/salomon-qst-98-2024.yaml

runuser -u youpu -- sh -c 'cd /opt/youpu/apps/api && pnpm exec tsx src/seed/sync-ski-content.ts' > "$release/sync-preview.log" 2>&1
cat "$release/sync-preview.log"
protected_sql="SELECT md5(coalesce(jsonb_agg(to_jsonb(p)-'specs'-'updated_at'-'slug'-'model'-'year'-'title'-'one_liner'-'cover_url' ORDER BY id)::text,'[]')) FROM product p;"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-before.txt"
image_sql="SELECT md5(coalesce(jsonb_agg(to_jsonb(pi) ORDER BY pi.id)::text,'[]')) FROM product_image pi JOIN product p ON p.id=pi.product_id WHERE p.slug <> 'head-easy-joy-r-2026';"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$image_sql" > "$release/images-protected-before.txt"
runuser -u youpu -- sh -c 'cd /opt/youpu/apps/api && pnpm exec tsx src/seed/sync-ski-content.ts --apply' > "$release/sync-apply.log" 2>&1
cat "$release/sync-apply.log"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-after.txt"
cmp "$release/protected-before.txt" "$release/protected-after.txt"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$image_sql" > "$release/images-protected-after.txt"
cmp "$release/images-protected-before.txt" "$release/images-protected-after.txt"

runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -P pager=off -c "SELECT slug, model, year, status, coalesce(jsonb_array_length(specs->'sizeSpecs'),0) AS rows, cover_url FROM product WHERE slug IN ('head-easy-joy-r-2026','head-shape-v2-r-2026','salomon-qst-92-2024','salomon-qst-98-2024') ORDER BY slug;" > "$release/verification-db.txt"
test "$(runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "SELECT count(*) FROM product WHERE slug IN ('salomon-qst-92-2024','salomon-qst-98-2024') AND status='draft' AND coalesce(jsonb_array_length(specs->'sizeSpecs'),0)=4")" = 2
test "$(runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "SELECT count(*) FROM product p JOIN product_image i ON i.product_id=p.id WHERE p.slug='head-easy-joy-r-2026' AND i.url LIKE '%/316265/%' AND p.cover_url LIKE '%/316265/%'")" = 1
curl --fail --silent --show-error http://127.0.0.1:3001/api/health > "$release/api-health.json"
curl --fail --silent --show-error http://127.0.0.1:3001/api/products/head-easy-joy-r-2026 > "$release/easy-joy-api.json"
curl --fail --silent --show-error http://127.0.0.1:3001/api/products/head-shape-v2-r-2026 > "$release/shape-v2-r-api.json"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "SELECT count(*) || ':' || count(*) FILTER (WHERE coalesce(jsonb_array_length(specs->'sizeSpecs'),0)>0) || ':' || sum(coalesce(jsonb_array_length(specs->'sizeSpecs'),0)) FROM product WHERE category_id=(SELECT id FROM category WHERE slug='skis');" > "$release/ski-table-counts.txt"
test "$(cat "$release/ski-table-counts.txt")" = '39:39:166'
node - "$release" <<'JS'
const fs = require('fs');
const release = process.argv[2];
const easy = JSON.parse(fs.readFileSync(`${release}/easy-joy-api.json`, 'utf8'));
const shape = JSON.parse(fs.readFileSync(`${release}/shape-v2-r-api.json`, 'utf8'));
if (easy.coverUrl?.includes('/316265/') !== true || easy.specs?.sizeSpecs?.length !== 1) throw new Error('Easy Joy R API verification failed');
if (shape.specs?.sizeSpecs?.length !== 1 || shape.specs.sizeSpecs[0]?.turnRadius !== 12.5) throw new Error('Shape V2 R API verification failed');
JS
test "$(systemctl is-active youpu-api youpu-web youpu-domain-web | tr '\n' ' ')" = 'active active active '
printf 'SKI_CONTENT_RELEASE_COMPLETE\n' > "$release/result.txt"
cat "$release/verification-db.txt"
cat "$release/api-health.json"
cat "$release/result.txt"
