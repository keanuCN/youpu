# TOS Existing Product Image Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide a review-first CLI for moving explicitly approved catalog images to TOS, preserve each original URL and source note, and remove the admin dashboard's obsolete COS upload status.

**Architecture:** A TypeScript migration module scans product seed YAML and writes a JSON review manifest with every external image marked unapproved. Applying a reviewed manifest requires both per-entry approval and an explicit `--apply` flag; each successful entry is downloaded under strict size/type/timeout limits, uploaded through the existing API image service, and then updated in its source YAML. The manifest retains the original URL and source note as the migration audit record; the YAML source note itself remains unchanged. Failed entries remain in the manifest with an error and can be retried without re-uploading completed rows.

**Tech Stack:** Node.js 20+, TypeScript, `yaml`, existing `AdminImageUploadService`, `tsx` Node test runner.

## Global Constraints

- Never upload or rewrite an image by default; planning is read-only except for writing the requested review manifest.
- Applying requires an explicit `--apply` flag and `approved: true` on each manifest entry.
- Accept HTTPS sources only, refuse redirects, allow only JPEG/PNG/WebP image content, cap downloads at 10 MiB, and abort each request after 20 seconds.
- Update only YAML image URLs that still exactly match the manifest's original URL; preserve the original image URL and source note in the migration manifest, and leave the YAML source note unchanged.
- Do not alter `source` copyright/review wording or claim usage rights; approval is an operator decision.
- Store runtime manifests under ignored `data/tmp/`; never put access keys in plans, reports, or tracked files.
- Keep admin-facing text Chinese-only and remove the obsolete COS-upload claim.

---

### Task 1: Correct the admin image workflow status

**Files:**
- Modify: `apps/admin/src/components/admin-app.tsx`
- Test: `apps/admin/src/components/admin-app.test.ts`

**Interfaces:**
- Preserve the existing single-image upload control and its behavior.
- Replace the old "手工处理 / COS 上传与裁切留到后续版本" status with copy that accurately describes the available TOS upload and source/rights review workflow.

- [ ] **Step 1: Add a failing regression assertion**

Add a source-text assertion using the existing test style that the obsolete COS copy is absent and the TOS upload workflow is represented.

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run `pnpm --filter @youpu/admin exec tsx --test src/components/admin-app.test.ts`.
Expected: the new assertion fails because the obsolete COS copy remains.

- [ ] **Step 3: Update the status copy minimally**

Change only the stale `BoundaryItem` copy to state that TOS upload is available in the product editor and image source/rights still require review.

- [ ] **Step 4: Re-run the focused admin test**

Run `pnpm --filter @youpu/admin exec tsx --test src/components/admin-app.test.ts`.
Expected: all tests pass, including the new regression assertion.

### Task 2: Build the review-first migration module and CLI

**Files:**
- Create: `apps/api/src/seed/tos-image-migration.ts`
- Test: `apps/api/src/seed/tos-image-migration.test.ts`
- Create: `apps/api/src/seed/migrate-product-images.ts`
- Modify: `apps/api/package.json`

**Interfaces:**
- `createImageMigrationManifest(dataDir: string, publicBaseUrl: string): Promise<ImageMigrationManifest>` returns manifest version 1 with stable entries `{ id, file, productSlug, imageIndex, originalUrl, sourceNote, approved: false, status: 'pending' | 'done' | 'failed', migratedUrl?, error? }`.
- `applyImageMigrationManifest(manifest, options): Promise<ImageMigrationManifest>` receives `dataDir`, `upload(buffer, contentType)`, and an injectable `fetchImage(url)` dependency; it mutates only approved `pending` or `failed` entries, persists successes/errors in the returned manifest, and checks the live YAML URL before writing. Failed entries are retried only when the operator reruns apply with that row still approved.
- CLI commands are `pnpm --filter @youpu/api tos:images:plan -- --out ../../data/tmp/tos-image-migration.json` and `pnpm --filter @youpu/api tos:images:apply -- --manifest ../../data/tmp/tos-image-migration.json --apply`.

- [ ] **Step 1: Write tests for manifest planning and unapproved defaults**

Use a temporary data directory containing one product YAML file with two image rows. Assert both external HTTPS rows appear, keep slug/file/index/source data, start unapproved and pending, and an existing TOS URL is excluded.

- [ ] **Step 2: Run the migration test and verify it fails for the missing module**

Run `pnpm --filter @youpu/api exec tsx --test src/seed/tos-image-migration.test.ts`.
Expected: fail because the manifest functions do not exist yet.

- [ ] **Step 3: Implement manifest creation and argument parsing**

Scan `data/<category>/*.yaml` using `parseDocument`; include only HTTPS image URLs whose origin differs from `TOS_PUBLIC_BASE_URL`; derive stable IDs from file path, image index, and URL; initialize every entry with `approved: false` and `status: 'pending'`.

- [ ] **Step 4: Add tests for approval gating and URL mismatch protection**

Assert an unapproved row causes zero downloads/uploads and no YAML changes even when apply is invoked; assert an approved row whose current YAML URL differs from `originalUrl` becomes failed without a download or upload.

- [ ] **Step 5: Run those tests and verify the expected failures**

Run `pnpm --filter @youpu/api exec tsx --test src/seed/tos-image-migration.test.ts`.
Expected: failures identify the missing apply behavior, not fixture setup errors.

- [ ] **Step 6: Implement safe download, upload, and YAML update behavior**

Require HTTPS and no redirects; enforce an abort timeout of 20 seconds and a streaming 10 MiB cap; accept only JPEG, PNG, and WebP content types; call the existing image upload service; use `parseDocument` to update only `images[imageIndex].url`; leave the YAML source note unchanged; refuse paths outside `dataDir`; persist each entry's success/error in the manifest after processing it.

- [ ] **Step 7: Test success, rejection, and resumability**

With injected fetch and upload dependencies, assert success rewrites only the selected image URL, leaves the source note unchanged, and keeps the original URL and note in the manifest; an unsupported MIME type fails without upload; and a completed row is not uploaded a second time.

- [ ] **Step 8: Run focused migration tests**

Run `pnpm --filter @youpu/api exec tsx --test src/seed/tos-image-migration.test.ts`.
Expected: all migration tests pass.

- [ ] **Step 9: Add explicit plan/apply CLI commands**

The plan command writes a JSON manifest only under `data/tmp/` and prints counts by status without contacting image sources or TOS. The apply command requires both `--apply` and `--manifest`; it loads API `.env`, rejects a manifest whose TOS public URL differs from current API configuration, uses `AdminImageUploadService.upload`, writes progress back to the manifest after each row, and exits nonzero if any approved row fails. Missing or malformed flags must print Chinese usage and exit nonzero.

- [ ] **Step 10: Add a CLI safety test**

Test argument parsing so apply without `--apply`, or without a manifest path, is rejected and the plan mode does not instantiate the TOS uploader.

- [ ] **Step 11: Run the focused CLI and migration tests**

Run `pnpm --filter @youpu/api exec tsx --test src/seed/tos-image-migration.test.ts`.
Expected: all tests pass and no network calls are made.

### Task 3: Document safe staged operation and verify repository data

**Files:**
- Modify: `README.md`

**Interfaces:**
- Document review-manifest generation, manual approval, applying a small batch, resuming failures, and the prohibition on assuming image copyright permission.
- Explain that migration updates seed YAML only; syncing each migrated product to the database uses `pnpm --filter @youpu/api seed:product -- ../../data/<category>/<file>.yaml --update-existing`, which refreshes all product fields from that seed and requires the file to be current.

- [ ] **Step 1: Document exact plan and apply commands**

Show the default plan command writing under ignored `data/tmp/`, explain that all entries default to unapproved, and require marking only rights-reviewed rows `approved: true` before applying with `--apply`. Explain that apply updates YAML only and show the exact per-file single-product database sync command, including the warning that it updates all product fields from that YAML file.

- [ ] **Step 2: Verify no-image and TOS-image seed data remains valid**

Run `pnpm --filter @youpu/api validate:data` and the focused migration tests. Expected: migration tests pass; record any seed-validation baseline errors separately and confirm none of the reported data files changed in this branch.

- [ ] **Step 3: Check final diff and tracked-secret safety**

Run `git diff --check`; inspect the changed-file list and verify no local `.env`, access key, or secret key appears in tracked changes.
