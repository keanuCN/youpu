# Mirror Local Product Images Implementation Plan

> **For agentic workers:** Execute this plan inline with tests and review checkpoints. Do not run the migration against production.

**Goal:** Mirror every reachable existing published product image from the local production-clone database into the project TOS bucket, then update only that clone to reference the mirrored WebP objects.

**Architecture:** A guarded one-off migration reads image URLs and product rows from the explicitly named local clone database, downloads and normalizes each distinct source image, uploads deterministic content-addressed objects to TOS, verifies public reads, then updates local product and product-image URLs in one database transaction. A private rollback manifest records old and new URLs. The web allowlist permits only the project's `/product-images/` TOS path.

**Tech Stack:** TypeScript, Node test runner, Prisma, Sharp, Volcengine TOS SDK, Next.js image URL allowlist.

## Global Constraints

- Target database must equal `youpu_prod_sync_20260930_113514`; reject every other database name and every non-loopback database host.
- Do not modify production database rows, the default `youpu` database, or existing user workspace changes.
- Use the existing image normalization rules: JPEG/PNG/WebP only, maximum 10 MiB input, 40 MP, WebP output capped at 1600 px.
- Never print credentials, full signed source URLs, or query strings.
- Do not change the 50 products that have no image record; report them as unavailable at source.
- Keep database URL rewrites and updates transactional; save a private rollback manifest before committing references.

---

### Task 1: Allow the project image bucket

**Files:**
- Modify: `apps/web/src/lib/image-url.ts`
- Test: `apps/web/src/lib/image-url.test.ts`

- [x] Add a failing assertion that `https://youpu.tos-cn-beijing.volces.com/product-images/mirror.webp` is allowed while `https://youpu.tos-cn-beijing.volces.com/private/mirror.webp` is rejected.
- [x] Run the focused test and confirm only the new allowlist assertion fails.
- [x] Add the exact TOS host rule with path prefix `/product-images/`.
- [x] Re-run the focused test and confirm all image URL tests pass.

### Task 2: Build guarded migration primitives

**Files:**
- Create: `apps/api/src/admin/product-image-mirror.ts`
- Test: `apps/api/src/admin/product-image-mirror.test.ts`

The pure helper exports `assertLocalMirrorDatabase(databaseUrl, expectedDatabase)` and `mirrorObjectKey(normalizedWebpBytes)`. The database guard accepts only `localhost`/`127.0.0.1` and the exact clone database. The object key is `product-images/mirror/<sha256>.webp` so reruns use identical keys.

- [x] Test the database guard rejects production hostnames and the default `youpu` database; confirm the exact loopback clone is accepted.
- [x] Test equal normalized image bytes produce equal keys and different bytes produce different keys.
- [x] Run the focused tests and confirm expected failures before implementing helpers.
- [x] Implement the pure helpers and rerun the focused tests.

### Task 3: Create the dry-run/apply migration command

**Files:**
- Create: `apps/api/src/admin/mirror-local-product-images.ts`
- Modify: `apps/api/package.json`

The command loads a caller-specified env file, forces the clone DB name after validating the base URL, reads published product/image rows, downloads each distinct HTTPS source URL with timeout and 10 MiB cap, applies the project's JPEG/PNG/WebP-to-WebP normalization rules, uploads with content-addressed keys and no overwrite, verifies each resulting public URL, writes a rollback manifest under the current user's temp directory, and updates only matching local `product.coverUrl` and `product_image.url` values in one Prisma transaction. It defaults to dry-run; writes require `--apply`.

- [x] Add a package script `mirror:local-product-images` invoking `tsx src/admin/mirror-local-product-images.ts`.
- [x] Run the command without `--apply`; confirm it names the clone DB, reports image/missing-source counts and destination host only, and performs no TOS or DB writes.
- [x] Run `pnpm typecheck` and migration helper/upload tests.
- [x] Execute once with `--apply`; verify every migrated URL returns image/webp and the transaction updates only the clone DB.
- [x] Query the clone and default local DB read-only; confirm only the clone has changed image URLs and both retain row counts.
- [x] Leave two source links unchanged after repeated checks returned HTTP 404 and 403.

### Task 4: Verify local rendering and report source gaps

**Files:**
- No additional files.

- [x] Query the local API and confirm 227 existing image records now use the project TOS host and `/product-images/` path; two unavailable source links remain unchanged.
- [x] Verify the local frontend accepts those URLs and loads a representative sample.
- [x] Report 50 products with no source image separately; do not invent or scrape replacements.
