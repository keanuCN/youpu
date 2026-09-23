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

const v87Target: CrawlTarget = {
  slug: 'vgn-v87-v2-2026',
  category: 'esports-keyboard',
  brand: 'vgn',
  model: 'VGN V87 V2',
  identityAliases: ['VGN V87 V2 Wireless Mechanical Gaming Keyboard'],
  year: 2026,
  url: 'https://vgnlab.com/products/vgn-v87-v2-wireless-mechanical-gaming-keyboard',
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

test('extracts VGN V87 V2 shared specs and leaves multi-variant switches unspecified', () => {
  const snapshot: PageSnapshot = {
    title: 'VGN V87 V2 Wireless Mechanical Gaming Keyboard',
    description: 'Layout：80%|TKL Backlighting：RGB Connectivity：2.4GHz/Bluetooth/Wired Construction：Gasket',
    bodyText:
      '75% layout 80%|TKL 98% layout Hot-swappable：YES Battery Capacity：10000mAh Material：non-metallic Driver：Windows Software Keycaps are made of PBT material Switches: Dynamic Gold Switch Blizzard Switch Gust Switch Glacier Switch',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = vgnEsportsKeyboardAdapter.normalize(v87Target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, 'TKL（87键）');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.batteryCapacity, 10000);
  assert.equal(result.normalizedSpecs.driver, 'V HUB');
  assert.equal(result.normalizedSpecs.keycapMaterial, 'PBT');
  assert.equal(result.normalizedSpecs.switchType, undefined);
  assert.match(result.sourceNotes.join(' '), /多个配色和轴体版本/);
});

test('extracts VGN N75 V2 tri-mode common specs without mixing switch variants', () => {
  const n75Target: CrawlTarget = {
    ...target,
    slug: 'vgn-n75-v2-2026',
    model: 'VGN N75 V2 三模版',
    identityAliases: ['VGN N75 V2 Wireless RGB Mechanical Keyboard'],
    url: 'https://vgnlab.com/products/vgn-n75-v2-wireless-rgb-mechanical-keyboard',
  };
  const snapshot: PageSnapshot = {
    title: 'VGN N75 V2 Wireless RGB Mechanical Keyboard',
    description: 'Layout：75% Backlighting：RGB Connectivity：2.4GHz/Bluetooth/Wired Construction：Gasket Hot-swappable：YES Battery Capacity：8000mAh Material：non-metallic Driver：Windows Software',
    bodyText: 'Switches: Glacier Pro, Dynamic Gold, Cow',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = vgnEsportsKeyboardAdapter.normalize(n75Target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, '75%');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.batteryCapacity, 8000);
  assert.equal(result.normalizedSpecs.driver, 'V HUB');
  assert.equal(result.normalizedSpecs.switchType, undefined);
});
