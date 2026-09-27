import assert from 'node:assert/strict';
import test from 'node:test';
import { salomonSkiingApparelAdapter } from './salomon';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'salomon-brilliant-ski-pants-2026',
  category: 'skiing-apparel',
  brand: 'salomon',
  model: 'BRILLIANT Men Ski Pants',
  year: 2026,
  url: 'https://www.salomon.com/en-us/product/brilliant-lc13783/LC2635500',
  mode: 'cheerio',
};

test('extracts Salomon snow-apparel specs from official product details', () => {
  const snapshot: PageSnapshot = {
    title: 'BRILLIANT Men’s Ski Pants | Salomon',
    bodyText:
      'FitRegularWaterproofnessAdvancedSkin DryWaterproofing20000 mmMoisture Vapour Transmission Resistance20000 g/m²InsulationPrimaLoft®, HeiQ XReflex™ powered by XefcoWeight per unit 1 lb, 11 oz The snug 60g insulation offers warmth. fully taped seams vents',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = salomonSkiingApparelAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.garmentType, 'pants');
  assert.equal(result.normalizedSpecs.waterproofMm, 20_000);
  assert.equal(result.normalizedSpecs.breathabilityG, 20_000);
  assert.equal(result.normalizedSpecs.fit, 'regular');
  assert.equal(result.normalizedSpecs.insulation, 'PrimaLoft®, HeiQ XReflex™ powered by Xefco 60g');
  assert.equal(result.normalizedSpecs.venting, true);
  assert.equal(result.normalizedSpecs.powderSkirt, undefined);
});

test('does not infer missing Salomon waterproof ratings or add a source-currency price', () => {
  const result = salomonSkiingApparelAdapter.normalize(
    { ...target, model: 'ABSOLUTE 3L Shell Jacket' },
    {
      title: 'ABSOLUTE 3L Men’s Shell Jacket | Salomon',
      bodyText: 'Fit Regular Waterproofness AdvancedSkin Dry FeaturesTypologyShell',
      headings: [],
      jsonLd: [],
      tables: [],
      specifications: [],
      images: [],
      imageAltTexts: [],
    },
  );
  assert.equal(result.normalizedSpecs.garmentType, 'jacket');
  assert.equal(result.normalizedSpecs.construction, '3L');
  assert.equal(result.normalizedSpecs.insulation, 'shell');
  assert.equal(result.normalizedSpecs.waterproofMm, undefined);
  assert.equal(result.normalizedSpecs.breathabilityG, undefined);
  assert.equal(result.normalizedSpecs.price, undefined);
});

test('extracts only explicit paired 20K/20K waterproof claims', () => {
  const result = salomonSkiingApparelAdapter.normalize(target, {
    title: 'ABSOLUTE 3L Men’s Shell Jacket | Salomon',
    bodyText: 'Designed for winter with full-on 20K/20K waterproof protection from the named fabric.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  });
  assert.equal(result.normalizedSpecs.waterproofMm, 20_000);
  assert.equal(result.normalizedSpecs.breathabilityG, 20_000);
});
