import assert from 'node:assert/strict';
import test from 'node:test';
import { vxeEsportsKeyboardAdapter } from './vxe';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'vxe-v75-x-2026',
  category: 'esports-keyboard',
  brand: 'vxe',
  model: 'VXE V75 X',
  identityAliases: ['VXE V75 X Mechanical Gaming Keyboard'],
  year: 2026,
  url: 'https://www.atk.store/products/atk-vxe-v75-x-mechanical-gaming-keyboard',
  mode: 'cheerio',
};

test('extracts VXE V75 X default mechanical keyboard facts', () => {
  const snapshot: PageSnapshot = {
    title: 'VXE V75 X Mechanical Gaming Keyboard | Aluminum Gasket Mount | Tri-mode Wireless',
    description: '',
    bodyText:
      'Specifications Layout / Size: 75% ANSI Switch Type: Mechanical Connectivity: Wireless 2.4G / Bluetooth / Wired Backlight: South-Facing ARGB LED Hot-Swap/NKRO: Yes Case Material: Aluminum Top + ABS Bottom Keycap: PBT Cherry/KOP Profile Software Support: ATK HUB. Switches: Obsidian. Game-Gasket.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = vxeEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, 'Obsidian');
  assert.equal(result.normalizedSpecs.mounting, 'Game-Gasket');
  assert.equal(result.normalizedSpecs.caseMaterial, '铝合金上盖 + ABS 底壳');
  assert.equal(result.normalizedSpecs.layout, '75% ANSI');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, '南向 ARGB RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.keycapMaterial, 'PBT Cherry/KOP Profile 键帽');
  assert.equal(result.normalizedSpecs.driver, 'ATK HUB');
});
