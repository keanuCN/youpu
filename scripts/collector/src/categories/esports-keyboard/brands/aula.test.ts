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

test('extracts AULA F99 Pro default variant without merging selectable switch options', () => {
  const f99Target: CrawlTarget = {
    ...target,
    slug: 'aula-f99-pro-2026',
    model: 'AULA F99 Pro',
    identityAliases: ['AULA F99 PRO 96% Gasket-Mounted Keyboard'],
    url: 'https://aulagear.com/products/aula-f99-copy',
  };
  const snapshot: PageSnapshot = {
    title: '96% Gasket-Mounted Triple-Mode Mechanical Keyboard with Knob – Aula Gear',
    description: 'AULA F99 PRO 8000mAh Battery',
    bodyText:
      'AULA F99 PRO 100 keys 1800 Layout with knob Gasket-Mounted Flex-Cut Hotswappable PCB Wired Type-C Bluetooth 5.0 2.4GHz 8000mAh South-facing RGB Backlight ABS Plastic Hot-Swappable Yes Switch: Star arrow Linear Switch LEOBOG Nimbus Linear Switch V3 AULA DRIVER',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = aulaEsportsKeyboardAdapter.normalize(f99Target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, undefined);
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.equal(result.normalizedSpecs.caseMaterial, 'ABS Plastic');
  assert.equal(result.normalizedSpecs.layout, '96% with Knob');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, '南向 RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.batteryCapacity, 8000);
  assert.equal(result.normalizedSpecs.driver, 'AULA Driver');
});

test('keeps AULA F87 Pro V2 variant-specific switch and battery fields empty', () => {
  const f87Target: CrawlTarget = {
    ...target,
    slug: 'aula-f87-pro-v2-2026',
    model: 'AULA F87 Pro V2',
    identityAliases: ['AULA F87 PRO V2'],
    url: 'https://aulagear.com/products/aula-f87-pro-v2',
  };
  const snapshot: PageSnapshot = {
    title: 'AULA F87 PRO V2',
    description: 'TKL Gasket-Mounted Wireless Gaming Keyboard with 10000mAh Battery',
    bodyText:
      'AULA F87 PRO V2 Mechanical Keyboard TKL Layout US ANSI 87 Keys Tri-mode connectivity Bluetooth 2.4GHz USB-C Wired Gasket-Mounted Hot swappable Yes RGB South-facing LEDs 10000mAh StarArrow Switch Greywood V4 Switch AULA F87 PRO V2 Driver',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = aulaEsportsKeyboardAdapter.normalize(f87Target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, 'TKL (87键)');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, '南向 RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.driver, 'AULA Driver');
  assert.equal(result.normalizedSpecs.switchType, undefined);
  assert.equal(result.normalizedSpecs.batteryCapacity, undefined);
});
