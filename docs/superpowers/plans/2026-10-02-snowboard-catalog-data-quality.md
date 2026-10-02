# Snowboard Catalog Data Quality Plan

> **For agentic workers:** Execute this checklist in the current task, checkpointing and verifying after each model or small batch. Do not commit, push, deploy, or sync production data unless the user separately authorizes it.

**Goal:** Improve the reliability and provenance of snowboard catalog records by verifying official identity, season, representative size, specifications, price, editorial details, and image provenance.

**Architecture:** Treat `apps/web/src/data/boards.ts` as the prototype source and each matching `data/snowboard/*.yaml` as its seed representation. Verify claims against primary brand sources, update only unambiguous facts in both records, and record unresolved evidence or schema limitations in the verification ledger. Never regenerate all seed YAML during this campaign because that would overwrite unrelated existing edits.

**Tech Stack:** TypeScript prototype catalog, YAML seed catalog, pnpm workspace validation scripts, official brand product/size pages, Markdown verification ledger.

## Global Constraints

- Preserve all pre-existing user changes; limit edits to exact verified records and ledger rows.
- Do not hand-edit generated `apps/web/src/data/catalog-snapshot.ts`.
- Do not run `apps/web/scripts/export-seed-yaml.ts`; it rewrites the entire seed directory.
- Keep season, board model, width variant, and representative size matched before changing a specification.
- Do not infer missing prices, dimensions, weight, image rights, or model identity from neighboring sizes or seasons.
- Preserve multi-radius or variant-specific values in source notes when the current schema cannot represent them without loss.
- Do not synchronize the online database, deploy, push, or commit unless explicitly authorized in a later request.
- After each batch run `pnpm --filter @youpu/api validate:data`, `pnpm --filter @youpu/web typecheck`, and `git diff --check`.

---

### Task 1: Reconcile high-confidence official geometry

**Files:**
- Modify: `apps/web/src/data/boards.ts`
- Modify: exact matching files under `data/snowboard/`
- Modify: `docs/数据源核实清单.md`

- [x] Confirm the candidate product page is official and matches brand/model.
- [x] Confirm season and exact size variant before editing any numeric fields.
- [x] Apply each exact-size correction to prototype source and matching YAML only.
- [x] Record source URL, official values, schema limitations, and any unresolved values in the ledger.
- [x] Run the three global validation commands.

### Task 2: Resolve the next historical-season conflicts

**Files:**
- Read/modify: `docs/数据源核实清单.md`
- Read/modify only if verified: `apps/web/src/data/boards.ts` and matching `data/snowboard/*.yaml`

- [x] Investigate Burton Custom Camber 2026 and Jones Mountain Twin 2026 using official season catalogs, downloadable official catalogs, or official archived size charts. Do not substitute a 2027 page for a 2026 record.
- [x] Investigate CAPiTA D.O.A. 2026, Bataleon Evil Twin 2025, Nitro Team 2026, and RIDE Algorhythm 2026 for official season evidence. The D.O.A. 2026 alias redirects to 2027; the located 24/25 Bataleon page is the youth Evil Teen, not adult Evil Twin; Nitro Team Pro is a different model. RIDE's official 2026 collection confirms the model and `160W` variant, but the linked detail page is gone and the historical geometry table remains unavailable; record this gap.
- [x] For the season-mismatched products above, leave seed values unchanged and record the exact evidence gap; do not promote current-season values as historical facts.
- [x] For the corrected Burton Custom and Jones Mountain Twin products, update the prototype source and matching YAML in the same change.
- [x] Run all three global validation commands and review the scoped diff.

### Task 3: Audit size identity and geometry representation

**Files:**
- Read/modify: `docs/数据源核实清单.md`
- Read/modify only with conclusive evidence: prototype and matching YAML records

- [x] Resolve representative-size identity for KORUA Café Racer (159), GNU Rider's Choice (157.5 median standard), and RIDE Algorhythm (160 wide); historical per-size geometry remains separately open where the season source is unavailable.
- [ ] Map each official table column by exact size and width variant; never interpolate values.
- [x] Keep three-radius and asymmetric multi-radius sidecuts explicit rather than collapsing them silently into a scalar; current batch covers Arbor A-Frame and GNU Rider's Choice. Splitboard/snowboard differences and size-dependent weight variants remain open.
- [x] Add tested text schema support for product-level `sidecutRadii`, complementing existing per-size `sizeSpecs.sidecutRadii` support.
- [ ] Revalidate the data and review source/YAML parity after each batch.

### Task 4: Verify price, detailed product claims, and image provenance

**Files:**
- Read/modify: exact verified product records in `apps/web/src/data/boards.ts` and `data/snowboard/*.yaml`
- Modify: `docs/数据源核实清单.md`

- [ ] Separate official MSRP from local-market retail price and editorial display price; preserve currency, season, and source date when known.
- [x] Inventory the current 77 snowboard prices: all have a price, 74 use CNY and three 2027 records use USD. Record that market/region, price type, collection date, and price-source fields are absent; do not infer or change numeric prices without provenance.
- [ ] Check technical construction and product-detail claims against official brand copy for the matching model/season; do not infer copy from a neighboring product.
- [x] Label generated placeholder images accurately and do not represent them as product photography; all 14 affected records are explicitly marked as generated placeholders.
- [x] For all 77 records, image source is present: 14 are explicitly marked generated placeholders requiring replacement and 63 are explicitly marked as reuse authorization pending. Do not treat a public image URL as permission to republish or as a durable production asset.
- [ ] Leave unverifiable price, copy, and image-rights fields unchanged and explicitly list required follow-up.
- [ ] Run all three global validation commands and review the exact affected records.

### Task 5: Reassess editorial product scores with evidence

**Files:**
- Read/modify: `apps/web/src/data/boards.ts`
- Modify: matching `data/snowboard/*.yaml`
- Modify: `docs/数据源核实清单.md` or the linked scoring-basis document

- [x] Identify what each score measures and distinguish brand-claimed specs from editorial judgment; the scoring-basis document defines all six dimensions and explains evidence tiers.
- [ ] Only revise a score when the record has sufficient product evidence and the scoring basis supports the change; otherwise keep the score and label its confidence as limited.
- [x] Ensure the prototype source and seed scores match exactly. A read-only audit validated six finite score values for all 77 snowboard YAMLs and exact score parity for all 14 YAMLs linked to prototype records; no mismatches were found.
- [ ] Validate the data, typecheck the web package, run `git diff --check`, and inspect the final scoped diff.

### Task 6: Final audit and handoff

**Files:**
- Modify: `docs/数据源核实清单.md`
- Read: all changed prototype/YAML records

- [ ] Summarize verified corrections, unresolved fields, and official sources.
- [ ] Confirm source/YAML parity for every changed product.
- [ ] Run `pnpm --filter @youpu/api validate:data`, `pnpm --filter @youpu/web typecheck`, and `git diff --check`.
- [ ] Confirm `catalog-snapshot.ts` was not edited and no production database, deployment, remote branch, or commit was changed.
