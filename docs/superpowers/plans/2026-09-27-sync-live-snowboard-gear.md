# Sync Live Snowboard Gear Data Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize the 30 published snowboard-boot and 30 published snowboard-binding seed records into the local API database without updating any existing product or unrelated category.

**Architecture:** Create only the two currently missing active category records under the existing `skiing` parent. Import each product through the existing single-product seed command, whose default behavior rejects an existing slug and creates product/source/image/stat/outbox rows in a transaction.

**Tech Stack:** NestJS admin API, PostgreSQL/Prisma, existing YAML seed files and `pnpm seed:product` command.

## Global Constraints

- Only process `data/snowboard-boot/*.yaml` and `data/snowboard-binding/*.yaml`.
- Create a category only if it is absent; never change an existing category's status, schema, or parent.
- Do not update any pre-existing product. The sole exception is the `burton-ion-boa-2027` sample created during this task, which was repaired with `--update-existing` after correcting its malformed `+data_source` key.
- Do not run the full `pnpm seed` command.
- Stop on the first import error and preserve all successfully imported records for an idempotent retry.

---

### Task 1: Create the two missing live category records

**Files:**
- Read: `data/categories.yaml`
- Read: `apps/web/src/data/categories.ts`
- Database: create-only records for `snowboard-boot` and `snowboard-binding`

**Interfaces:**
- Parent category: existing `skiing` category ID from `GET /api/admin/categories`.
- Category payload fields: `slug`, `name`, `parentId`, `sortOrder`, `specSchema`, `recommendConfig`, `status: "active"`.

- [x] Verify both target categories are absent and `skiing` exists.
- [x] Create only absent targets from their seed definitions, with status active; do not edit any other category.
- [x] Read back the two rows and verify their parent and status.

### Task 2: Import only missing products

**Files:**
- Read: `data/snowboard-boot/*.yaml`
- Read: `data/snowboard-binding/*.yaml`

**Interfaces:**
- Command: `pnpm --filter @youpu/api seed:product -- <absolute-product-yaml-path>`.
- Safety behavior: the command rejects an existing product unless `--update-existing` is explicitly passed; that flag is prohibited for this task.

- [x] Confirm there are exactly 30 YAML files per category and all seeds declare `status: published`.
- [x] Run the single-product sync once per file, stopping immediately on failure.
- [x] Verify no pre-existing product was updated (except repairing the assistant-created sample row) and all 60 target products have published status.

### Task 3: Verify and document the synchronized batches

**Files:**
- Modify: `docs/2026-09-24-单板雪鞋采集批次.md`
- Modify: `docs/2026-09-24-单板固定器采集批次.md`

- [x] Verify API category totals: 30 snowboard boots and 30 snowboard bindings.
- [x] Record actual image coverage from API detail responses; keep absent images blank rather than fabricating or copying unreviewed assets.
- [x] Record that the batch is synced to the local API, note image gaps, and retain the existing source/redistribution-rights review requirement.
