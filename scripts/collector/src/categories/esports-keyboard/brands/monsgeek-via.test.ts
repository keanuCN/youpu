import assert from 'node:assert/strict';
import test from 'node:test';
import { monsgeekViaEsportsKeyboardAdapter } from './monsgeek-via';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'monsgeek-m2-v5-via-2026',
  category: 'esports-keyboard',
  brand: 'monsgeek',
  model: 'M2 V5 VIA',
  identityAliases: ['M2 V5 VIA Custom Mechanical Keyboard'],
  year: 2026,
  url: 'https://www.monsgeek.com/product/monsgeek-m2-v5-via-mechanical-keyboard/',
  mode: 'cheerio',
};

test('extracts MonsGeek M2 V5 VIA mechanical keyboard facts', () => {
  const snapshot: PageSnapshot = {
    title: 'MonsGeek M2 V5 VIA Custom Mechanical Keyboard',
    description: '',
    bodyText:
      'M2 V5 VIA 1800 Compact Mechanical Keyboard. Akko Cilantro Switch, Akko Mirror Switch, Akko Stellar Rose Switch. Gasket Mount. Case Material Aluminum. Layout ANSI. USB-C Wired & 2.4G Wireless & Bluetooth. RGB Backlit. 5-pin Hot-swappable. VIA Support Y. MonsGeek Driver N. Battery 8000mAh. Quick Release Ball-Catch.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = monsgeekViaEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, 'Akko Cilantro / Akko Mirror / Akko Stellar Rose');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket-mounted');
  assert.equal(result.normalizedSpecs.caseMaterial, '铝合金');
  assert.equal(result.normalizedSpecs.layout, 'ANSI / 1800 紧凑布局');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.driver, 'VIA');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.quickRelease, true);
  assert.equal(result.normalizedSpecs.batteryCapacity, 8000);
  assert.equal(result.normalizedSpecs.pollingRate, undefined);
  assert.equal(result.normalizedSpecs.rapidTriggerPrecision, undefined);
});
