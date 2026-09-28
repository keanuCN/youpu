import assert from 'node:assert/strict';
import test from 'node:test';
import { kailasSkiingApparelAdapter } from './kailas';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const baseTarget: CrawlTarget = {
  slug: 'kailas-bm45-max-mens-down-jacket-95g-2026',
  category: 'skiing-apparel',
  brand: 'kailas',
  model: "BM45 MAX Down Ski Jacket Men's",
  year: 2026,
  url: 'https://kailasgear.com/products/kailas-bm45-max-down-ski-jacket-mens',
  mode: 'cheerio',
};

function snapshot(bodyText: string, title = baseTarget.model): PageSnapshot {
  return {
    title,
    description: '',
    bodyText,
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };
}

test('extracts explicit jacket construction, down insulation, and features', () => {
  const result = kailasSkiingApparelAdapter.normalize(
    baseTarget,
    snapshot('Sport: Snowboarding / Skiing Material: 40D 3L GORE-TEX Insulation: 95g 800FP Down Underarm Ventilation Zipper Powder Skirt'),
  );

  assert.equal(result.normalizedSpecs.garmentType, 'jacket');
  assert.equal(result.normalizedSpecs.construction, '3L');
  assert.equal(result.normalizedSpecs.fabric, '40D 3L GORE-TEX');
  assert.equal(result.normalizedSpecs.insulation, '95g 800FP down');
  assert.equal(result.normalizedSpecs.venting, true);
  assert.equal(result.normalizedSpecs.powderSkirt, true);
  assert.equal(result.normalizedSpecs.waterproofMm, undefined);
});

test('identifies ski pants, extracts fabric, and does not transfer jacket features', () => {
  const target = { ...baseTarget, model: 'BM45 GTX Ski Pants' };
  const result = kailasSkiingApparelAdapter.normalize(
    target,
    snapshot('75D 3L GORE-TEX. Powder Skirt attachment for compatible jacket.', target.model),
  );

  assert.equal(result.normalizedSpecs.garmentType, 'pants');
  assert.equal(result.normalizedSpecs.construction, '3L');
  assert.equal(result.normalizedSpecs.fabric, '75D 3L GORE-TEX');
  assert.equal(result.normalizedSpecs.powderSkirt, undefined);
  assert.equal(result.normalizedSpecs.insulation, undefined);
  assert.equal(result.normalizedSpecs.waterproofMm, undefined);
});

test('normalizes KAILAS FILTER-TEC and synthetic insulation without inventing ratings', () => {
  const target = { ...baseTarget, model: 'Bogda Plus LT Insulated Hardshell Jacket Unisex' };
  const result = kailasSkiingApparelAdapter.normalize(
    target,
    snapshot(
      'KAILAS independently developed technology cotton, with high resilience and loftiness, matching the warmth coefficient of 700FP down. FILTER-TEC three-layer protection technology. Breathable underarm zipper. Removable windproof and snow skirt. Shell: 100% Nylon.',
      target.model,
    ),
  );

  assert.equal(result.normalizedSpecs.garmentType, 'jacket');
  assert.equal(result.normalizedSpecs.construction, '3L');
  assert.equal(result.normalizedSpecs.insulation, 'KAILAS independently developed synthetic insulation; warmth coefficient equivalent to 700FP down');
  assert.equal(result.normalizedSpecs.fabric, '100% Nylon');
  assert.equal(result.normalizedSpecs.venting, true);
  assert.equal(result.normalizedSpecs.powderSkirt, true);
  assert.equal(result.normalizedSpecs.waterproofMm, undefined);
});
