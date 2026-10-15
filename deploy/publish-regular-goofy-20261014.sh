#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu

release=/opt/youpu-releases/20261014-regular-goofy
package=/tmp/youpu-regular-goofy-20261014.tar.gz
test ! -e "$release"
mkdir -p "$release"
chmod 700 "$release"

cp /etc/systemd/system/youpu-web.service.d/field-report-20261014.conf "$release/ip-dropin-before.conf"
cp /etc/systemd/system/youpu-domain-web.service.d/field-report-20261014.conf "$release/domain-dropin-before.conf"

tar -tzf "$package" > "$release/upload-files.txt"
node - "$release" <<'JS'
const fs = require('fs');
const path = require('path');
const release = process.argv[2];
const files = fs.readFileSync(`${release}/upload-files.txt`, 'utf8').trim().split('\n');
const allowed = new Set([
  'apps/web/src/app/guides/snowboard-setup/page.tsx',
  'apps/web/src/components/gear/snowboard-stance-guide.tsx',
]);
if (files.length !== allowed.size || files.some(file => !allowed.has(file) || file.includes('..') || !path.resolve(file).startsWith('/opt/youpu/')))
  throw new Error('Unexpected archive paths');
fs.writeFileSync(`${release}/existing-files.txt`, files.filter(file => fs.existsSync(file)).join('\n') + '\n');
JS

tar -czf "$release/source-before.tar.gz" -T "$release/existing-files.txt"
tar -xzf "$package" -C /opt/youpu
while IFS= read -r file; do chown youpu:youpu "$file"; done < "$release/upload-files.txt"

runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=768 NEXT_DIST_DIR=.next-regular-goofy-20261014-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=768 NEXT_DIST_DIR=.next-regular-goofy-20261014-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-regular-goofy-20261014-domain/BUILD_ID
test -s apps/web/.next-regular-goofy-20261014-ip/BUILD_ID

printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-regular-goofy-20261014-ip\n' > /etc/systemd/system/youpu-web.service.d/field-report-20261014.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-regular-goofy-20261014-domain\n' > /etc/systemd/system/youpu-domain-web.service.d/field-report-20261014.conf
systemctl daemon-reload
systemctl restart youpu-web youpu-domain-web
systemctl is-active youpu-api youpu-web youpu-domain-web > "$release/services.txt"

for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error http://127.0.0.1:3000/youpu/guides/snowboard-setup > "$release/guide-ip.html"; then break; fi
  sleep 1
done
grep -q '推背和穿袜滑行测试' "$release/guide-ip.html"
grep -q 'Regular / Goofy' "$release/guide-ip.html"

for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/guides/snowboard-setup > "$release/guide-domain.html"; then break; fi
  sleep 1
done
grep -q '推背和穿袜滑行测试' "$release/guide-domain.html"
grep -q 'Regular / Goofy' "$release/guide-domain.html"

printf 'REGULAR_GOOFY_RELEASE_COMPLETE\n' > "$release/result.txt"
cat "$release/result.txt"
