#!/usr/bin/env bash
set -euo pipefail
umask 077

cd /opt/youpu
release=/opt/youpu-releases/20261015-snowboard-stance-ui
package=/tmp/youpu-snowboard-stance-ui-20261015.tar.gz
test ! -e "$release"
test -s "$package"
mkdir -m 700 -p "$release/source-before/apps/web/src/app/guides/snowboard-setup" "$release/source-before/apps/web/src/components/gear" "$release/systemd-before"

tar -tzf "$package" > "$release/archive-files.txt"
grep -Fx 'apps/web/src/app/guides/snowboard-setup/page.tsx' "$release/archive-files.txt"
grep -Fx 'apps/web/src/components/gear/snowboard-stance-guide.tsx' "$release/archive-files.txt"
grep -Fx 'apps/web/src/components/gear/snowboard-stance-simulator.tsx' "$release/archive-files.txt"

cp apps/web/src/app/guides/snowboard-setup/page.tsx "$release/source-before/apps/web/src/app/guides/snowboard-setup/page.tsx"
cp apps/web/src/components/gear/snowboard-stance-guide.tsx "$release/source-before/apps/web/src/components/gear/snowboard-stance-guide.tsx"
if test -e apps/web/src/components/gear/snowboard-stance-simulator.tsx; then
  cp apps/web/src/components/gear/snowboard-stance-simulator.tsx "$release/source-before/apps/web/src/components/gear/snowboard-stance-simulator.tsx"
fi
cp /etc/systemd/system/youpu-web.service.d/zz-image-tos.conf "$release/systemd-before/youpu-web-zz-image-tos.conf"
cp /etc/systemd/system/youpu-domain-web.service.d/zz-image-tos.conf "$release/systemd-before/youpu-domain-web-zz-image-tos.conf"

tar -xzf "$package" -C /opt/youpu
chown youpu:youpu apps/web/src/app/guides/snowboard-setup/page.tsx
chown youpu:youpu apps/web/src/components/gear/snowboard-stance-guide.tsx
chown youpu:youpu apps/web/src/components/gear/snowboard-stance-simulator.tsx

runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-snowboard-stance-ui-20261015-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-snowboard-stance-ui-20261015-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-snowboard-stance-ui-20261015-domain/BUILD_ID
test -s apps/web/.next-snowboard-stance-ui-20261015-ip/BUILD_ID

printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-snowboard-stance-ui-20261015-ip\n' > /etc/systemd/system/youpu-web.service.d/zzzz-snowboard-stance-ui-20261015.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-snowboard-stance-ui-20261015-domain\n' > /etc/systemd/system/youpu-domain-web.service.d/zzzz-snowboard-stance-ui-20261015.conf
systemctl daemon-reload
systemctl restart youpu-web youpu-domain-web
systemctl is-active youpu-api youpu-web youpu-domain-web > "$release/services.txt"

for attempt in $(seq 1 30); do
  if curl --fail --location --silent --show-error http://127.0.0.1:3000/youpu/guides/snowboard-setup > "$release/guide-ip.html"; then break; fi
  sleep 1
done
test -s "$release/guide-ip.html"
curl --fail --location --silent --show-error --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/guides/snowboard-setup > "$release/guide-domain.html"
grep -q '角度模拟 / TOP VIEW' "$release/guide-ip.html"
grep -q '角度模拟 / TOP VIEW' "$release/guide-domain.html"
curl --fail --location --silent --show-error http://127.0.0.1/ > "$release/order-app.html"

printf 'SNOWBOARD_STANCE_UI_RELEASE_COMPLETE\n' > "$release/result.txt"
cat "$release/result.txt"
cat "$release/services.txt"
