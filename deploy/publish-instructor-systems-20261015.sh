#!/usr/bin/env bash
set -euo pipefail
umask 077

cd /opt/youpu
release=/opt/youpu-releases/20261015-instructor-systems
package=/tmp/youpu-instructor-systems-20261015.tar.gz
test ! -e "$release"
test -s "$package"
mkdir -p "$release/source-before/apps/web/src/app/guides/snowboard-setup" \
  "$release/source-before/apps/web/src/components/gear" \
  "$release/source-before/apps/web/public/logos" \
  "$release/systemd-before/youpu-web.service.d" \
  "$release/systemd-before/youpu-domain-web.service.d"

tar -tzf "$package" > "$release/archive-files.txt"
for path in \
  apps/web/src/app/guides/snowboard-setup/page.tsx \
  apps/web/src/components/gear/snowboard-stance-guide.tsx \
  apps/web/src/components/gear/snowboard-stance-simulator.tsx \
  apps/web/src/components/gear/snowboard-instructor-systems.tsx \
  apps/web/public/logos/casi.svg \
  apps/web/public/logos/isia.svg \
  apps/web/public/logos/jsba.svg \
  apps/web/public/logos/psia-aasi.svg \
  apps/web/public/logos/sbinz.png; do
  grep -Fx "$path" "$release/archive-files.txt"
done

cp apps/web/src/app/guides/snowboard-setup/page.tsx "$release/source-before/apps/web/src/app/guides/snowboard-setup/page.tsx"
for name in snowboard-stance-guide.tsx snowboard-stance-simulator.tsx snowboard-instructor-systems.tsx; do
  if test -e "apps/web/src/components/gear/$name"; then
    cp "apps/web/src/components/gear/$name" "$release/source-before/apps/web/src/components/gear/$name"
  fi
done
for name in casi.svg isia.svg jsba.svg psia-aasi.svg sbinz.png; do
  test ! -e "apps/web/public/logos/$name" || cp "apps/web/public/logos/$name" "$release/source-before/apps/web/public/logos/$name"
done
cp -a /etc/systemd/system/youpu-web.service.d/. "$release/systemd-before/youpu-web.service.d/"
cp -a /etc/systemd/system/youpu-domain-web.service.d/. "$release/systemd-before/youpu-domain-web.service.d/"

tar -xzf "$package" -C /opt/youpu
chown youpu:youpu apps/web/src/app/guides/snowboard-setup/page.tsx
chown youpu:youpu apps/web/src/components/gear/snowboard-stance-guide.tsx
chown youpu:youpu apps/web/src/components/gear/snowboard-stance-simulator.tsx
chown youpu:youpu apps/web/src/components/gear/snowboard-instructor-systems.tsx
chown youpu:youpu apps/web/public/logos/casi.svg apps/web/public/logos/isia.svg apps/web/public/logos/jsba.svg apps/web/public/logos/psia-aasi.svg apps/web/public/logos/sbinz.png
chmod 755 apps/web/public/logos
chmod 644 apps/web/public/logos/casi.svg apps/web/public/logos/isia.svg apps/web/public/logos/jsba.svg apps/web/public/logos/psia-aasi.svg apps/web/public/logos/sbinz.png

runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-instructor-systems-20261015-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-instructor-systems-20261015-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-instructor-systems-20261015-domain/BUILD_ID
test -s apps/web/.next-instructor-systems-20261015-ip/BUILD_ID

printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-instructor-systems-20261015-ip\n' > /etc/systemd/system/youpu-web.service.d/zzzzz-instructor-systems-20261015.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-instructor-systems-20261015-domain\n' > /etc/systemd/system/youpu-domain-web.service.d/zzzzz-instructor-systems-20261015.conf
systemctl daemon-reload
systemctl restart youpu-web youpu-domain-web
systemctl is-active youpu-api youpu-web youpu-domain-web > "$release/services.txt"

for attempt in $(seq 1 30); do
  if curl --fail --location --silent --show-error http://127.0.0.1:3000/youpu/guides/snowboard-setup > "$release/guide-ip.html"; then break; fi
  sleep 1
done
test -s "$release/guide-ip.html"
curl --fail --location --silent --show-error --resolve youpu.asia:443:127.0.0.1 https://youpu.asia/guides/snowboard-setup > "$release/guide-domain.html"
grep -q '单板教练认证体系' "$release/guide-ip.html"
grep -q '单板教练认证体系' "$release/guide-domain.html"
curl --fail --location --silent --show-error http://127.0.0.1/ > "$release/order-app.html"

printf 'INSTRUCTOR_SYSTEMS_RELEASE_COMPLETE\n' > "$release/result.txt"
cat "$release/result.txt"
cat "$release/services.txt"
