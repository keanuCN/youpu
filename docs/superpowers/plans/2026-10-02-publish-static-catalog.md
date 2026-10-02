# Publish Latest Static Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Export the current public production catalog into the static frontend, build it, and safely publish the static site with a recoverable backup.

**Architecture:** Use the production public products API as the catalog source through the existing export script and static Next.js build. Validate generated pages locally, archive the `out/` directory, deploy to the existing nginx document root while preserving `/admin/` and `/.well-known/`, then verify public routes and API data.

**Tech Stack:** Next.js 14 static export, pnpm, TypeScript catalog exporter, SSH/SCP, tar, rsync, nginx.

## Global Constraints

- Production API and site URL are `https://xiaopang.club`.
- Production static root is `/www/wwwroot/xiaopang.club`.
- Preserve `/admin/` and `/.well-known/` during rsync.
- Create a timestamped full-site backup before replacing static files.
- Do not reset or reseed the production database; do not modify the API service.
- Preserve the existing uncommitted workspace changes; no commit or branch operation is part of this deployment.

---

### Task 1: Refresh catalog snapshot and build static frontend

**Files:**
- Generated: `apps/web/src/data/catalog-snapshot.ts`
- Generated build output: `apps/web/out/`

- [x] Set `NEXT_OUTPUT=export`, `NEXT_PUBLIC_SITE_URL=https://xiaopang.club`, `NEXT_PUBLIC_API_BASE=https://xiaopang.club`, and `CONTENT_EXPORT_API_BASE=https://xiaopang.club` in the build process environment.
- [x] Run `pnpm --filter @youpu/web build` from the isolated workspace copy; the prebuild hook exports the full production catalog and the build creates `apps/web/out/`.
- [x] Confirm the snapshot includes `ride-deep-fake-2027`, `ride-warpig-2027`, and `jones-flagship-pro-2027`, and corresponding static detail pages exist under `apps/web/out/gear/`.
- [x] Confirm `index.html`, `robots.txt`, and `sitemap.xml` exist and no local API/site base URL is embedded in the generated output. (The only broad `localhost` string is standard browser polyfill code.)

### Task 2: Publish static output with backup

**Files:**
- Local archive: `$env:TEMP\youpu-static-release-20261002T050301Z.tar.gz`
- Production root: `/www/wwwroot/xiaopang.club/`
- Production backup: `/www/wwwroot/xiaopang.club.backup-20261002T051210Z/`

- [x] Archive the isolated build's `apps/web/out/` and copy the archive to the production host.
- [x] Extract to `/tmp/youpu-static-stage-20261002T051210Z` on the host and verify the entry page, `robots.txt`, `sitemap.xml`, and all three product pages before touching the live root.
- [x] Copy the live root to `/www/wwwroot/xiaopang.club.backup-20261002T051210Z`, then sync staged files into the root with `rsync -a --delete --exclude=/admin/ --exclude=/.well-known/`.
- [x] Set static-site ownership to `www:www` outside the preserved subdirectories; `nginx -t` succeeded before reload.

### Task 3: Verify the published site

**Files:**
- Update `deploy/README.md` only if needed to record the actual release identifier and backup path.

- [x] Fetch the public home page, snowboard browse page, three new product routes, robots, sitemap, admin, and API health endpoint; all returned HTTP 200.
- [x] Confirm the three new product HTML pages include their official image URLs and the API still returns the expected prices and cover images.
- [x] Confirm the sitemap includes all three new product routes and health reports `db=true`, `redis=true` (`es=false` remains the documented resource trade-off).
