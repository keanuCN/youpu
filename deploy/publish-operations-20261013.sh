#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu
release=/opt/youpu-releases/20261013-operations
static=/opt/youpu/apps/admin/releases/20261013-operations
mkdir -p "$release" "$static/ip" "$static/domain"
chmod 700 "$release"
runuser -u postgres -- /usr/pgsql-16/bin/pg_dump -Fc youpu > "$release/database-before.dump"
/usr/pgsql-16/bin/pg_restore --list "$release/database-before.dump" > "$release/database-before.contents"
tar -czf "$release/source-before.tar.gz" apps/web/src apps/web/scripts apps/admin/src apps/api/src/seed
cp /etc/nginx/conf.d/lingxi-beverage-ordering.conf "$release/nginx-ip-before.conf"
cp /etc/nginx/conf.d/youpu.asia.conf "$release/nginx-domain-before.conf"
cp /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf "$release/ip-dropin-before.conf"
cp /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf "$release/domain-dropin-before.conf"
cp apps/api/.env "$release/api-env-before"
tar -xzf /tmp/youpu-operations-20261013.tar.gz -C /opt/youpu
chown -R youpu:youpu apps/web/src apps/web/scripts apps/admin/src apps/api/src/seed/bootstrap-admin.ts
runuser -u youpu -- env NODE_ENV=production NEXT_PUBLIC_BASE_PATH=/youpu/admin NEXT_PUBLIC_API_BASE=/youpu NEXT_PUBLIC_ENABLE_LEGACY_ADMIN=false pnpm --filter @youpu/admin build > "$release/build-admin-ip.log" 2>&1
cp -a apps/admin/out/. "$static/ip/"
runuser -u youpu -- env NODE_ENV=production NEXT_PUBLIC_BASE_PATH=/admin NEXT_PUBLIC_API_BASE= NEXT_PUBLIC_ENABLE_LEGACY_ADMIN=false pnpm --filter @youpu/admin build > "$release/build-admin-domain.log" 2>&1
cp -a apps/admin/out/. "$static/domain/"
find "$static" -type d -exec chmod 755 {} +
find "$static" -type f -exec chmod 644 {} +
chmod 755 apps/admin/releases
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-operations-20261013-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-domain.log" 2>&1
runuser -u youpu -- env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1536 NEXT_DIST_DIR=.next-operations-20261013-ip NEXT_PUBLIC_BASE_PATH=/youpu NEXT_PUBLIC_SITE_URL=http://115.190.156.88/youpu NEXT_PUBLIC_API_BASE=http://115.190.156.88/youpu NEXT_PUBLIC_API_SAME_ORIGIN=true NEXT_PUBLIC_CONTENT_SOURCE=api NEXT_PUBLIC_CURATED_BASELINE=false pnpm --filter @youpu/web build > "$release/build-ip.log" 2>&1
test -s apps/web/.next-operations-20261013-domain/BUILD_ID
test -s apps/web/.next-operations-20261013-ip/BUILD_ID
test ! -e apps/admin/current-ip || test -L apps/admin/current-ip
test ! -e apps/admin/current-domain || test -L apps/admin/current-domain
ln -sfn "$static/ip" apps/admin/current-ip
ln -sfn "$static/domain" apps/admin/current-domain
node <<'JS'
const fs=require('fs');
function insert(path,needle,addition){let text=fs.readFileSync(path,'utf8');if(text.includes(addition.trim()))return;if(!text.includes(needle))throw Error('Nginx anchor missing: '+path);fs.writeFileSync(path,text.replace(needle,addition+'\n'+needle));}
insert('/etc/nginx/conf.d/lingxi-beverage-ordering.conf','    location = /youpu/ {','    location = /youpu/admin { return 301 /youpu/admin/; }\n    location ^~ /youpu/admin/ {\n        alias /opt/youpu/apps/admin/current-ip/;\n        index index.html;\n    }');
insert('/etc/nginx/conf.d/youpu.asia.conf','    location = /api/image-proxy {','    location = /admin { return 301 /admin/; }\n    location ^~ /admin/ {\n        alias /opt/youpu/apps/admin/current-domain/;\n        index index.html;\n    }');
const envPath='/opt/youpu/apps/api/.env';let env=fs.readFileSync(envPath,'utf8');env=env.replace(/^ADMIN_TOKEN=.*$/m,'# ADMIN_TOKEN disabled for account login');fs.writeFileSync(envPath,env,{mode:0o600});
JS
nginx -t
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-operations-20261013-ip\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf
printf '[Service]\nEnvironment=NEXT_DIST_DIR=.next-operations-20261013-domain\nEnvironment=NEXT_PUBLIC_API_SAME_ORIGIN=true\nEnvironment=NEXT_PUBLIC_CURATED_BASELINE=false\n' > /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf
systemctl daemon-reload
systemctl restart youpu-api youpu-web youpu-domain-web
systemctl reload nginx
systemctl is-active youpu-api youpu-web youpu-domain-web
printf 'OPERATIONS_RELEASE_COMPLETE\n'
