#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu
release=/opt/youpu-releases/20261013-fitc
test ! -e "$release"
mkdir -p "$release"
chmod 700 "$release"
tar -czf "$release/source-before.tar.gz" packages/schema/src apps/web/src/lib/api.ts apps/web/src/lib/domain.ts apps/web/src/app/quiz/quiz-client.tsx apps/api/src/community/community.service.ts apps/api/dist
cp /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf "$release/ip-dropin-before.conf"
cp /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf "$release/domain-dropin-before.conf"
tar -xzf /tmp/youpu-fit-20261013.tar.gz
chown -R youpu:youpu packages/schema/src apps/web/src/lib/api.ts apps/web/src/lib/domain.ts apps/web/src/app/quiz/quiz-client.tsx apps/api/src/community/community.service.ts
runuser -u youpu -- pnpm --filter @youpu/schema build > "$release/build-schema.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-fit-20261013c-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-fit-20261013c-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-fit-20261013c-domain/BUILD_ID
test -s apps/web/.next-fit-20261013c-ip/BUILD_ID
runuser -u youpu -- pnpm --filter @youpu/api build > "$release/build-api.log" 2>&1
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-fit-20261013c-ip\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-fit-20261013c-domain\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf
systemctl daemon-reload
systemctl restart youpu-api youpu-web youpu-domain-web
systemctl is-active youpu-api youpu-web youpu-domain-web
printf 'FIT_RELEASE_COMPLETE\n'
