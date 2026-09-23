import assert from 'node:assert/strict';
import test from 'node:test';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';
import { mchoseEsportsKeyboardAdapter } from './mchose';

const target: CrawlTarget = {
  slug: 'mchose-k99-v3-2026',
  category: 'esports-keyboard',
  brand: 'mchose',
  model: 'MCHOSE K99 V3',
  identityAliases: ['MCHOSE K99 V3 98% Layout Wireless Mechanical Keyboard'],
  year: 2026,
  url: 'https://www.mchose.store/products/mchose-k99-v3-keyboard',
  mode: 'cheerio',
};

const g87V2Target: CrawlTarget = {
  slug: 'mchose-g87-v2-2026',
  category: 'esports-keyboard',
  brand: 'mchose',
  model: 'MCHOSE G87 V2',
  identityAliases: ['G87 V2'],
  year: 2026,
  url: 'https://support.mchose.store/hc/en-us/articles/50413594299284-MCHOSE-Mix-87-M-HUB-Guide',
  mode: 'cheerio',
};

test('extracts shared MCHOSE K99 V3 specs while excluding color-specific options', () => {
  const snapshot: PageSnapshot = {
    title: 'MCHOSE K99 V3 98% Layout Wireless Mechanical Keyboard',
    description: 'MCHOSE HUB with 16.8M colors per-key RGB',
    bodyText:
      'Switch: Icy Creamsicle Switch Layout: 98% Layout Structure: Gasket Mount Hot-Swappable Connectivity: BT 5.0 / USB-C / 2.4GHz Polling Rate: Dual 8K (Wired / 2.4GHz) Battery | 10,000mAh Color | Black Gold | Sky Blue Keycaps Engraving | Front Engraved | Side Engraved',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = mchoseEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, '98%（99键）');
  assert.equal(result.normalizedSpecs.switchType, 'Icy Creamsicle Switch');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.pollingRate, 8000);
  assert.equal(result.normalizedSpecs.backlight, '16.8M 色 RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.batteryCapacity, 10000);
  assert.equal(result.normalizedSpecs.driver, 'MCHOSE M HUB');
  assert.equal(result.normalizedSpecs.keycapMaterial, undefined);
});

test('extracts only G87 V2 facts explicitly stated by the official MCHOSE support page', () => {
  const snapshot: PageSnapshot = {
    title: 'MCHOSE Mix 87 M HUB Guide',
    description: 'Supports mechanical keyboards K87S, G87 V2, and G75 V2.',
    bodyText: 'Mechanical keyboards K87S, G87 V2, and G75 V2 are supported by M HUB.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  assert.equal(mchoseEsportsKeyboardAdapter.canHandle(g87V2Target), true);
  const result = mchoseEsportsKeyboardAdapter.normalize(g87V2Target, snapshot);
  assert.deepEqual(result.normalizedSpecs, { keyboardType: 'mechanical', driver: 'MCHOSE M HUB' });
});
