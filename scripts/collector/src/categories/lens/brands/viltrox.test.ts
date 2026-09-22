import assert from 'node:assert/strict';
import test from 'node:test';
import { viltroxLensAdapter } from './viltrox';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'viltrox-af-56mm-f1-2-pro-xf-2025',
  category: 'lens',
  brand: 'viltrox',
  model: 'AF 56mm F1.2 Pro XF',
  year: 2025,
  url: 'https://viltrox.com/products/af-56mm-f1-2-xf',
  mode: 'cheerio',
};

test('extracts explicit Viltrox lens facts from the official store page', () => {
  const snapshot: PageSnapshot = {
    title: 'Viltrox AF 56mm F1.2 Pro XF Lens for Fujifilm',
    description: 'APS-C portrait lens',
    bodyText:
      'Lens Mount: X-mount Lens Elements: 13/8 Focal Length: f=56mm (85mm) Aperture: F1.2-F16 Shooting Distance: 0.5m-∞ Max.magnification: 0.13x Focus Mode: MF,AF Filter Size: Φ67mm Weight: ≈575g(bare lens) Durable full-metal, weather-sealed body',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = viltroxLensAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.mount, 'X-mount');
  assert.equal(result.normalizedSpecs.focalLength, 56);
  assert.equal(result.normalizedSpecs.equivalentFocalLength, '85mm');
  assert.equal(result.normalizedSpecs.maxAperture, 1.2);
  assert.equal(result.normalizedSpecs.opticalStructure, '13/8');
  assert.equal(result.normalizedSpecs.focusDistance, 0.5);
  assert.equal(result.normalizedSpecs.maxMagnification, 0.13);
  assert.equal(result.normalizedSpecs.autofocus, true);
  assert.equal(result.normalizedSpecs.filterSize, 67);
  assert.equal(result.normalizedSpecs.weight, 575);
  assert.equal(result.normalizedSpecs.weatherSealing, '防尘防滴 / 全天候防护');
});
