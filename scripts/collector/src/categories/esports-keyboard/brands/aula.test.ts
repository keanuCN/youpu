import assert from 'node:assert/strict';
import test from 'node:test';
import { aulaEsportsKeyboardAdapter } from './aula';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'aula-f75-2026',
  category: 'esports-keyboard',
  brand: 'aula',
  model: 'AULA F75',
  identityAliases: ['AULA F75 75% Gasket Wireless Mechanical Keyboard'],
  year: 2026,
  url: 'https://aulagear.com/products/aula-f75',
  mode: 'cheerio',
};

test('extracts AULA F75 default mechanical keyboard facts', () => {
  const snapshot: PageSnapshot = {
    title: 'AULA F75 75% Gasket Wireless Mechanical Keyboard',
    description: 'Three-Way Connectivity for Every Scenario with a 4000mAh Battery',
    bodyText:
      'AULA F75 Mechanical Keyboard 75% Compact Layout Gasket Structure & Hot-Swap Functionality Vibrant 16.8 Million Color RGB Illumination Three-Way Connectivity Layout: ANSI Switch: LEOBOG Reaper Linear Switch TTC & AULA Crescent Linear Switch Bluetooth 5.0 2.4GHz Cable Wired AULA F75 Driver 4000mAh.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = aulaEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, 'LEOBOG Reaper Linear Switch');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.equal(result.normalizedSpecs.layout, '75% ANSI');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.batteryCapacity, 4000);
  assert.equal(result.normalizedSpecs.driver, 'AULA Driver');
});
