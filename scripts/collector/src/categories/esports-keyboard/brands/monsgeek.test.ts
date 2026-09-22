import assert from 'node:assert/strict';
import test from 'node:test';
import { monsgeekEsportsKeyboardAdapter } from './monsgeek';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'monsgeek-m2-v5-he-2026',
  category: 'esports-keyboard',
  brand: 'monsgeek',
  model: 'M2 V5 HE',
  identityAliases: ['M2 V5 HE Fully Assembled'],
  year: 2026,
  url: 'https://www.monsgeek.com/keyboard/m2-v5-he-magnetic-switch-keyboard/',
  mode: 'cheerio',
};

test('extracts MonsGeek M2 V5 HE magnetic keyboard facts', () => {
  const snapshot: PageSnapshot = {
    title: 'M2 V5 HE Fully Assembled - MonsGeek',
    description: '',
    bodyText:
      'M2 V5 HE premium magnetic switch keyboard Compact 98-Key Full-Size Keyboard 1800 layout. Magnetic Switch: 8K Hz Polling Rate Wired USB-C and 2.4G Wireless Solution. Gasket-mounted Case Material / Color Aluminum Black / Aluminum White Connectivity Tri-mode Battery 8000mAh. Support MonsGeek V4 Driver: Win/Web. Addressable RGB. Quick-Release ball catch. RT 0.005mm Precision. Adjustable: 0.100-3.300mm. Universal Scanning Rate 32K. BT 5.0. Akko AstroAim / AstroLink Switches.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = monsgeekEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'magnetic');
  assert.equal(result.normalizedSpecs.switchType, 'Akko AstroAim / AstroLink');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket-mounted');
  assert.equal(result.normalizedSpecs.caseMaterial, '铝合金');
  assert.equal(result.normalizedSpecs.layout, '1800 / 98 键');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.pollingRate, 8000);
  assert.equal(result.normalizedSpecs.scanRate, 32000);
  assert.equal(result.normalizedSpecs.rapidTriggerPrecision, 0.005);
  assert.equal(result.normalizedSpecs.actuationRange, '0.100–3.300mm');
  assert.equal(result.normalizedSpecs.batteryCapacity, 8000);
  assert.equal(result.normalizedSpecs.backlight, 'ARGB RGB 背光');
  assert.equal(result.normalizedSpecs.driver, 'MonsGeek Driver & Web-Based Driver');
  assert.equal(result.normalizedSpecs.quickRelease, true);
});
