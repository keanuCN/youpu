import assert from 'node:assert/strict';
import test from 'node:test';
import { vgnEsportsKeyboardAdapter } from './vgn';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'vgn-v98pro-v4-2026',
  category: 'esports-keyboard',
  brand: 'vgn',
  model: 'VGN V98Pro V4',
  identityAliases: ['VGN V98 Pro V4 Wireless Mechanical Keyboard'],
  year: 2026,
  url: 'https://vgnlab.com/products/vgn-v98-pro-v4-wireless-mechanical-keyboard',
  mode: 'cheerio',
};

test('extracts shared VGN V98Pro V4 specs without selecting a switch variant', () => {
  const snapshot: PageSnapshot = {
    title: 'VGN V98 Pro V4 Wireless Mechanical Keyboard',
    description: 'Layout: 98% Backlighting: RGB Connectivity: 2.4GHz/Bluetooth/Wired Construction: Gasket',
    bodyText:
      'Hot-swappable: YES Battery Capacity: 10000mAh Material: non-metallic Driver: Windows Software V-Display mood screen & Full-color dynamic RGB Switches: Flash Gold Azoth Pro Hyacinth Pro 8000Hz Dual 8K',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = vgnEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, '98%');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.batteryCapacity, 10000);
  assert.equal(result.normalizedSpecs.customScreen, true);
  assert.equal(result.normalizedSpecs.driver, 'V HUB');
  assert.equal(result.normalizedSpecs.switchType, undefined);
  assert.equal(result.normalizedSpecs.pollingRate, undefined);
});
