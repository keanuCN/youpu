#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/youpu
release=/opt/youpu-releases/20261014-binding-notes
test ! -e "$release"
mkdir -p "$release"
chmod 700 "$release"
runuser -u postgres -- /usr/pgsql-16/bin/pg_dump -Fc youpu > "$release/database-before.dump"
/usr/pgsql-16/bin/pg_restore --list "$release/database-before.dump" > "$release/database-before.contents"
tar -tzf /tmp/youpu-binding-notes-20261014.tar.gz > "$release/upload-files.txt"
node - "$release" <<'JS'
const fs=require('fs');const path=require('path');const release=process.argv[2];
const files=fs.readFileSync(release+'/upload-files.txt','utf8').trim().split('\n');
for(const file of files){if(file.includes('..')||!path.resolve(file).startsWith('/opt/youpu/'))throw Error('Unexpected archive path');}
fs.writeFileSync(release+'/existing-files.txt',files.filter(file=>fs.existsSync(file)).join('\n')+'\n');
JS
tar -czf "$release/source-before.tar.gz" -T "$release/existing-files.txt"
tar -xzf /tmp/youpu-binding-notes-20261014.tar.gz
while IFS= read -r file; do chown youpu:youpu "$file"; done < "$release/upload-files.txt"
protected_sql="SELECT md5(coalesce(jsonb_agg(to_jsonb(p)-'specs'-'updated_at' ORDER BY id)::text,'[]')) FROM product p;"
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-before.txt"
runuser -u youpu -- sh -c 'cd apps/api && pnpm exec tsx src/seed/sync-binding-size-charts.ts' > "$release/sync-preview.log" 2>&1
runuser -u youpu -- sh -c 'cd apps/api && pnpm exec tsx src/seed/sync-binding-size-charts.ts --apply' > "$release/sync-apply.log" 2>&1
runuser -u postgres -- /usr/pgsql-16/bin/psql -d youpu -At -c "$protected_sql" > "$release/protected-after.txt"
cmp "$release/protected-before.txt" "$release/protected-after.txt"
systemctl is-active youpu-api youpu-web youpu-domain-web
printf 'BINDING_SELECTION_NOTES_SYNC_COMPLETE\n'
