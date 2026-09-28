import assert from 'node:assert/strict';
import test from 'node:test';
import { decathlonSkiingApparelAdapter } from './decathlon';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'decathlon-snb-500-ziprotect-jacket-2026',
  category: 'skiing-apparel',
  brand: 'decathlon',
  model: "SNB 500 Ziprotect Men's Snowboard Jacket",
  year: 2026,
  url: 'https://www.decathlon.co.uk/p/men%27s-snb-jacket-500/_/R-p-350525',
  mode: 'cheerio',
};

function makeSnapshot(bodyText: string): PageSnapshot {
  return {
    title: "Men's warm and durable snowboard jacket SNB 500 Ziprotect",
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

test('extracts Decathlon snow jacket facts and keeps incompatible RET unconverted', () => {
  const result = decathlonSkiingApparelAdapter.normalize(
    target,
    makeSnapshot('Waterproof 10,000 mm. 100g/sqm wadding on the body (80g/sqm on the arms). Snow skirt. All seams (100%) are waterproof. Main fabric: 100.0% Polyamide Yoke: 100.0% Polyester. Breathability RET 6 < RET < 12.'),
  );

  assert.equal(result.normalizedSpecs.garmentType, 'jacket');
  assert.equal(result.normalizedSpecs.waterproofMm, 10_000);
  assert.equal(result.normalizedSpecs.insulation, '100 g/m² body / 80 g/m² sleeves synthetic wadding');
  assert.equal(result.normalizedSpecs.seamTaping, 'fully-taped');
  assert.equal(result.normalizedSpecs.powderSkirt, true);
  assert.equal(result.normalizedSpecs.fabric, '100.0% Polyamide');
  assert.equal(result.normalizedSpecs.breathabilityG, undefined);
});

test('does not infer unreported construction, fit, or insulation', () => {
  const result = decathlonSkiingApparelAdapter.normalize(target, makeSnapshot('Waterproof 10,000 mm'));

  assert.equal(result.normalizedSpecs.construction, undefined);
  assert.equal(result.normalizedSpecs.fit, undefined);
  assert.equal(result.normalizedSpecs.insulation, undefined);
});
