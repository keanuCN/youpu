#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu
release=/opt/youpu-releases/20261014-ski-prices
package=/tmp/youpu-ski-prices-20261014.tar.gz
stage=$(mktemp -d /tmp/youpu-ski-prices-stage.XXXXXX)
mode=${1:-prepare}
if [[ "$mode" == prepare ]]; then
  test -s "$package"
  if [[ ! -e "$release" ]]; then
    mkdir -p "$release"
    chmod 700 "$release"
    available_kb=$(df -Pk /opt | awk 'NR==2 {print $4}')
    test "$available_kb" -gt 1048576
    runuser -u postgres -- /usr/pgsql-16/bin/pg_dump -Fc youpu > "$release/database-before.dump"
    /usr/pgsql-16/bin/pg_restore --list "$release/database-before.dump" > "$release/database-before.contents"
  else
    test -s "$release/database-before.dump"
    test -s "$release/database-before.contents"
  fi
  tar -tzf "$package" > "$release/upload-files.txt"
  node - "$release" <<'JS'
const fs = require('fs');
const release = process.argv[2];
const files = fs.readFileSync(`${release}/upload-files.txt`, 'utf8').trim().split('\n').filter(file => !file.endsWith('/'));
const syncScript = 'apps/api/src/seed/sync-ski-prices.ts';
const priceFiles = files.filter(file => file.startsWith('data/skis/') && file.endsWith('.yaml'));
if (priceFiles.length !== 40 || files.length !== 41 || !files.includes(syncScript) ||
    files.some(file => file.includes('..') || (!file.startsWith('data/skis/') && file !== syncScript))) {
  throw new Error(`Unexpected archive contents: ${files.length} files, ${priceFiles.length} ski seeds`);
}
const existing = files.filter(file => fs.existsSync(`/opt/youpu/${file}`));
fs.writeFileSync(`${release}/backup-files.txt`, `${existing.join('\n')}\n`);
JS

  tar -czf "$release/source-before.tar.gz" -T "$release/backup-files.txt"
  tar -xzf "$package" -C "$stage"
  cp -a "$stage/apps/api/src/seed/sync-ski-prices.ts" /opt/youpu/apps/api/src/seed/sync-ski-prices.ts
  cp -a "$stage/data/skis/." /opt/youpu/data/skis/
  chown youpu:youpu /opt/youpu/data/skis
  chmod 755 /opt/youpu/data/skis
  chown youpu:youpu /opt/youpu/apps/api/src/seed/sync-ski-prices.ts
  while IFS= read -r file; do chown youpu:youpu "/opt/youpu/$file"; done < <(grep '^data/skis/.*\.yaml$' "$release/upload-files.txt")

  runuser -u youpu -- sh -c 'cd /opt/youpu/apps/api && pnpm exec tsx src/seed/sync-ski-prices.ts' > "$release/price-preview.log" 2>&1
  cat "$release/price-preview.log"
  printf 'HEAD Easy Joy 2026/27 is not in the production catalog; its current seed does not pass the production ski schema and will be left out of this price-only update.\n' > "$release/skipped-new-product.txt"
  printf 'PREPARE_COMPLETE\n'
elif [[ "$mode" == apply ]]; then
  test -s "$release/price-preview.log"
  runuser -u youpu -- sh -c 'cd /opt/youpu/apps/api && pnpm exec tsx src/seed/sync-ski-prices.ts --apply' > "$release/sync-apply.log" 2>&1
  cat "$release/sync-apply.log"

  runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "SELECT count(*) || ':' || count(*) FILTER (WHERE price_min IS NOT NULL AND price_max IS NOT NULL AND price_currency='CNY') FROM product WHERE category_id=(SELECT id FROM category WHERE slug='skis');" > "$release/ski-price-counts.txt"
  test "$(cat "$release/ski-price-counts.txt")" = '39:38'
  curl --fail --silent --show-error http://127.0.0.1:3001/api/products/rossignol-experience-76-2026 > "$release/experience-76-api.json"
  node - "$release" <<'JS'
const fs = require('fs');
const release = process.argv[2];
const response = JSON.parse(fs.readFileSync(`${release}/experience-76-api.json`, 'utf8'));
const product = response.product ?? response;
if (product.slug !== 'rossignol-experience-76-2026' || product.priceMin !== 3212 || product.priceMax !== 3212 || product.priceCurrency !== 'CNY') {
  throw new Error(`Experience 76 price verification failed: ${JSON.stringify(product)}`);
}
JS
  curl --fail --silent --show-error http://127.0.0.1:3001/api/health > "$release/api-health.json"
  test "$(systemctl is-active youpu-api youpu-web youpu-domain-web | tr '\n' ' ')" = 'active active active '
  printf 'SKI_PRICE_RELEASE_COMPLETE\n' > "$release/result.txt"
  cat "$release/ski-price-counts.txt"
  cat "$release/api-health.json"
  cat "$release/result.txt"
else
  echo "Usage: $0 [prepare|apply]" >&2
  exit 2
fi
rm -rf "$stage"
