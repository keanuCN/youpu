#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu

release=/opt/youpu-releases/20261014-home-hero-random
package=/tmp/youpu-home-hero-random-20261014.tar.gz
test ! -e "$release"
mkdir -p "$release"
chmod 700 "$release"

cp /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf "$release/ip-dropin-before.conf"
cp /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf "$release/domain-dropin-before.conf"

tar -tzf "$package" > "$release/upload-files.txt"
node - "$release" <<'JS'
const fs = require('fs');
const path = require('path');
const release = process.argv[2];
const files = fs.readFileSync(`${release}/upload-files.txt`, 'utf8').trim().split('\n');
const allowed = new Set([
  'apps/web/src/app/home-client.tsx',
  'apps/web/src/data/assets.ts',
  'apps/web/public/hero/altay-picture1-1280.webp',
  'apps/web/public/hero/altay-picture1-768.webp',
  'apps/web/public/hero/altay-picture3-1280.webp',
  'apps/web/public/hero/altay-picture3-768.webp',
  'apps/web/public/hero/hemu-picture10-1280.webp',
  'apps/web/public/hero/hemu-picture10-768.webp',
  'apps/web/public/hero/jiangjunshan-1280.webp',
  'apps/web/public/hero/jiangjunshan-768.webp',
  'apps/web/public/hero/ridge-1440.webp',
  'apps/web/public/hero/ridge-768.webp',
  'deploy/publish-home-hero-random-20261014.sh',
]);
if (files.length !== allowed.size || files.some(file => !allowed.has(file) || file.includes('..') || !path.resolve(file).startsWith('/opt/youpu/')))
  throw new Error('Unexpected archive paths');
fs.writeFileSync(`${release}/existing-files.txt`, files.filter(file => fs.existsSync(file)).join('\n') + '\n');
JS

tar -czf "$release/source-before.tar.gz" -T "$release/existing-files.txt"
tar -xzf "$package" -C /opt/youpu
while IFS= read -r file; do chown youpu:youpu "$file"; done < "$release/upload-files.txt"

runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-home-hero-random-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-home-hero-random-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-home-hero-random-domain/BUILD_ID
test -s apps/web/.next-home-hero-random-ip/BUILD_ID

printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-home-hero-random-ip\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-home-hero-random-domain\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf
systemctl daemon-reload
systemctl restart youpu-web youpu-domain-web
systemctl is-active youpu-api youpu-web youpu-domain-web > "$release/services.txt"

for attempt in $(seq 1 30); do
  if curl --fail --location --silent --show-error http://127.0.0.1:3000/youpu/ > "$release/home-ip.html"; then break; fi
  sleep 1
done
test -s "$release/home-ip.html"
grep -q 'FIELD TEST' "$release/home-ip.html"
for image in ridge-1440.webp jiangjunshan-1280.webp altay-picture3-1280.webp hemu-picture10-1280.webp altay-picture1-1280.webp; do
  curl --fail --silent --show-error "http://127.0.0.1:3000/youpu/hero/$image" -o "$release/$image"
done

for attempt in $(seq 1 30); do
  if curl --fail --location --silent --show-error --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/ > "$release/home-domain.html"; then break; fi
  sleep 1
done
test -s "$release/home-domain.html"
curl --fail --silent --show-error --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/hero/jiangjunshan-1280.webp -o /dev/null

printf 'HOME_HERO_RANDOM_RELEASE_COMPLETE\n' > "$release/result.txt"
cat "$release/result.txt"
