# TOS Product Image Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an authenticated admin upload a product image, normalize it to WebP on the API, and store it under the public-read `product-images/` prefix in the private TOS bucket.

**Architecture:** The admin UI sends multipart data to a guarded API route. The API validates and recompresses raster images with Sharp, then writes them with the Volcengine TOS Node SDK using server-only credentials. Missing TOS configuration disables uploads cleanly; credentials are never exposed to the browser.

**Tech Stack:** NestJS 10, Express/Multer, Sharp, `@volcengine/tos-sdk`, TypeScript, built-in Node test runner via `tsx`.

## Global Constraints

- Keep all TOS credentials server-side and out of tracked files.
- Accept JPEG, PNG, and WebP raster inputs up to 10 MiB; reject unsupported, malformed, or mismatched image content.
- Output WebP with dimensions at most 1600×1600, quality 82, no upscaling, and object key `product-images/<random-uuid>.webp`.
- Do not expand the already-configured anonymous bucket policy or expose list/delete operations.
- Preserve all existing uncommitted changes; do not commit or push.

---

### Task 1: Image normalization and object storage service

**Files:**
- Create: `apps/api/src/admin/admin-image-upload.service.ts`
- Create: `apps/api/src/admin/admin-image-upload.service.test.ts`
- Modify: `apps/api/src/config/env.ts`
- Modify: `apps/api/.env.example`
- Modify: `apps/api/package.json`
- Modify: `pnpm-lock.yaml` (package-manager generated)

**Interfaces:**
- `normalizeProductImage(input: Buffer, declaredMime: string): Promise<Buffer>` validates actual raster metadata, rejects SVG/GIF/other formats and invalid content, and returns a WebP buffer resized inside 1600×1600 at quality 82.
- `AdminImageUploadService.upload(input: { buffer: Buffer; mimetype: string }): Promise<{ url: string; key: string; size: number }>` normalizes, uploads to TOS, and returns the public URL and object key.
- TOS config is optional as a complete group: `TOS_REGION`, `TOS_BUCKET`, `TOS_ENDPOINT`, `TOS_ACCESS_KEY`, `TOS_SECRET_KEY`, `TOS_PUBLIC_BASE_URL`. If all are absent, uploads fail with a clear service-unavailable error; partial configuration fails environment validation.

- [ ] **Step 1: Write failing tests**

Test real Sharp processing by generating tiny PNG/JPEG/WebP buffers in the test, then assert the output metadata format is `webp`, dimensions do not exceed 1600, and unsupported SVG content is rejected. Test service configuration and key/URL construction using an injected uploader adapter so no cloud request is made.

- [ ] **Step 2: Verify the tests fail for missing behavior**

Run `pnpm --filter @youpu/api exec tsx --test src/admin/admin-image-upload.service.test.ts`; expected failure is unresolved exports/module, not a test-runner or fixture error.

- [ ] **Step 3: Implement the service and configuration**

Add Sharp and the official `@volcengine/tos-sdk`; validate the optional all-or-none TOS environment group; implement MIME-to-actual-format checks; initialize `TosClient` only when configured; upload with `putObject({ bucket, key, body, contentType: 'image/webp', ... })`; return a URL joined from `TOS_PUBLIC_BASE_URL` and the generated key. Document blank local values and the required server-side `tos:PutObject` permission in `.env.example`.

- [ ] **Step 4: Verify the focused tests pass**

Run `pnpm --filter @youpu/api exec tsx --test src/admin/admin-image-upload.service.test.ts`; expected output is all focused tests passing.

### Task 2: Authenticated multipart API route

**Files:**
- Modify: `apps/api/src/admin/admin.controller.ts`
- Modify: `apps/api/src/admin/admin.module.ts`
- Create or modify: `apps/api/src/admin/admin-controller-permissions.test.ts` only if its controller method inventory assertions require updating.

**Interfaces:**
- `POST /api/admin/product-images` consumes multipart field `file`, is protected by existing `AdminGuard`, caps input at 10 MiB, accepts JPEG/PNG/WebP, and returns `{ url, key, size }`.

- [ ] **Step 1: Add a focused route contract test**

Assert the admin controller has the `POST product-images` route and existing class-level guard remains present. Run the controller-permission test file and confirm the new contract fails before implementation.

- [ ] **Step 2: Implement guarded upload handling**

Register `AdminImageUploadService`; add `FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } })`; reject absent files and MIME values outside `image/jpeg`, `image/png`, `image/webp` with a 400 response; delegate buffer validation and upload to the service.

- [ ] **Step 3: Verify the API contract test**

Run `pnpm --filter @youpu/api exec tsx --test src/admin/admin-controller-permissions.test.ts src/admin/admin-image-upload.service.test.ts`; expected output is all selected tests passing.

### Task 3: Admin product editor upload control

**Files:**
- Modify: `apps/admin/src/lib/api.ts`
- Modify: `apps/admin/src/components/admin-app.tsx`
- Modify: `apps/admin/src/components/admin-app.test.ts` if a stable component-level assertion can cover the upload control without adding a new test framework.

**Interfaces:**
- Add `adminUpload<T>(token, path, file)` that sends `FormData` with bearer authorization and does not set the multipart content type manually.
- In the product editor, provide a Chinese-only image picker for JPEG/PNG/WebP; after success append the returned URL to `productForm.images` as a `base` image, preserve the existing manual URL editing/add-row controls, and show the normal admin notice on failure.

- [ ] **Step 1: Add a failing UI/API helper assertion**

Add a focused assertion for image-upload UI text and accepted file types using the repository's existing component test conventions. Run `pnpm --filter @youpu/admin exec tsx --test src/components/admin-app.test.ts` and verify it fails specifically because the upload control is missing.

- [ ] **Step 2: Implement multipart helper and editor control**

Build a `FormData`, append the local file under `file`, call `fetch` with the existing authorization token, parse and report API errors using the existing `AdminApiError` conventions, then append `{ url, kind: 'base', alt: productForm.title, source: '', sortOrder: String(images.length) }` to the current form state. Add loading/disabled state to prevent duplicate upload actions.

- [ ] **Step 3: Verify the focused admin test and builds**

Run `pnpm --filter @youpu/admin exec tsx --test src/components/admin-app.test.ts` and `pnpm --filter @youpu/api build` plus `pnpm --filter @youpu/admin build`; report any unrelated baseline failures separately.
