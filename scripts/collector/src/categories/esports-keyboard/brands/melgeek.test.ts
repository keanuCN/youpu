import assert from 'node:assert/strict';
import test from 'node:test';
import { melgeekEsportsKeyboardAdapter } from './melgeek';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'melgeek-made68-pro-plus-2026',
  category: 'esports-keyboard',
  brand: 'melgeek',
  model: 'MADE68 Pro+',
  identityAliases: ['MADE68 Pro+ Hall Effect Gaming Keyboard'],
  year: 2026,
  url: 'https://www.melgeek.com/en-eu/products/made68-pro',
  mode: 'cheerio',
};

test('extracts only shared MADE68 Pro+ Hall Effect keyboard facts', () => {
  const snapshot: PageSnapshot = {
    title: 'MelGeek MADE68 Pro+ Hall Effect Gaming Keyboard',
    description: '',
    bodyText:
      '65% Hall Effect Gaming Keyboard 68 keys. Gasket Mount. Case Material ABS + PC. Wired (single-mode). 8,000Hz polling rate, 16,000Hz scanning rate, 0.01mm RT adjustment accuracy, 0.1mm–3.4mm Actuation Range. 16-million Color RGB. MelGeek HIVE smart dual-end driver. TTC RGB Sacred Heart Magnetic Switch and King of Magnetic Switch Pro Version options. PBT double-shot keycaps and PC transparent keycaps options. $139.00 USD.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = melgeekEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'magnetic');
  assert.equal(result.normalizedSpecs.layout, '65%（68键）');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket Mount');
  assert.equal(result.normalizedSpecs.caseMaterial, 'ABS + PC');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired']);
  assert.equal(result.normalizedSpecs.pollingRate, 8000);
  assert.equal(result.normalizedSpecs.scanRate, 16000);
  assert.equal(result.normalizedSpecs.rapidTriggerPrecision, 0.01);
  assert.equal(result.normalizedSpecs.actuationRange, '0.1–3.4mm');
  assert.equal(result.normalizedSpecs.backlight, '1600 万色 RGB 背光');
  assert.equal(result.normalizedSpecs.driver, 'MelGeek HIVE');
  assert.equal(result.normalizedSpecs.switchType, undefined);
  assert.equal(result.normalizedSpecs.keycapMaterial, undefined);
});
