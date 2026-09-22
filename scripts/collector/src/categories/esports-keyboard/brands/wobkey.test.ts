import assert from 'node:assert/strict';
import test from 'node:test';
import { wobkeyEsportsKeyboardAdapter } from './wobkey';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'wobkey-rainy75-pro-2026',
  category: 'esports-keyboard',
  brand: 'wobkey',
  model: 'Rainy 75 Pro',
  identityAliases: ['Rainy 75 Keyboard'],
  year: 2026,
  url: 'https://www.wobkey.com/products/rainy75?variant=45239425302763',
  mode: 'cheerio',
};

test('extracts WOBKEY Rainy 75 Pro selected variant facts', () => {
  const snapshot: PageSnapshot = {
    title: 'Rainy 75 | Custom Aluminum 75 Keyboard',
    description: 'A premium CNC aluminum 75 keyboard featuring a gasket mount and tri-mode wireless.',
    bodyText:
      'Rainy 75 Keyboard Variants: Anodized Black Pro (RGB/FR4/Silver SUS304/7000mAh/WOB Switch) Select Wired 2.4G BT 5.0 Double Shot PBT.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = wobkeyEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, 'WOB Switch');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket-mounted');
  assert.equal(result.normalizedSpecs.caseMaterial, '铝合金');
  assert.equal(result.normalizedSpecs.layout, '75%');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.batteryCapacity, 7000);
  assert.equal(result.normalizedSpecs.keycapMaterial, '双色注塑 PBT 键帽');
});
