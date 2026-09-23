import test from 'node:test';
import assert from 'node:assert/strict';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';
import { dareuEsportsKeyboardAdapter } from './dareu';

const target: CrawlTarget = {
  slug: 'dareu-cool68-ocean-blue-2026',
  category: 'esports-keyboard',
  brand: 'dareu',
  model: 'DAREU COOL68 云海蓝',
  identityAliases: ['DAREU COOL68'],
  year: 2026,
  url: 'https://www.dareu.us/products/cool68',
  mode: 'cheerio',
};

test('extracts COOL68 shared magnetic specs without guessing switch variant', () => {
  const snapshot: PageSnapshot = {
    title: 'DAREU COOL68 | Hall Effect Magnetic Switch Gaming Keyboard',
    description: 'A compact 65% layout magnetic gaming keyboard with 0.01mm RT precision, 8K polling rate, hot-swappable design, Gasket Structure and DAREU Web Driver.',
    bodyText: 'Connection Type: Wired Type-C Switch: DAREU Shadow Blade Magnetic Switch Driver: YES Keycap: PBT + PC transparent Light: RGB - 20 lighting modes & 5 music modes',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = dareuEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'magnetic');
  assert.equal(result.normalizedSpecs.layout, '65%（68键）');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired']);
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.equal(result.normalizedSpecs.pollingRate, 8000);
  assert.equal(result.normalizedSpecs.rapidTriggerPrecision, 0.01);
  assert.equal(result.normalizedSpecs.keycapMaterial, 'PBT + PC 透明键帽');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.switchType, undefined);
});
