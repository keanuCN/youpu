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

test('extracts only common official AULA S500 wired full-size facts', () => {
  const s500Target: CrawlTarget = {
    ...target,
    slug: 'aula-s500-wired-2026',
    model: 'AULA S500',
    identityAliases: ['S500 Mechanical Keyboard'],
    url: 'https://www.aulastar.com/mechanical-keyboard/467.html',
  };
  const snapshot: PageSnapshot = {
    title: 'AULA S500 Mechanical Keyboard',
    description: 'S500 Mechanical Keyboard; Zoned RGB Lighting; 104 Full-size keys; Gaming E-sports; Full Key Anti-ghosting; Retro Three-tone Keycaps',
    bodyText: 'Wired100% Layout Zoned RGB Backlighting Metal Matte Panel',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = aulaEsportsKeyboardAdapter.normalize(s500Target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, '104 键全尺寸');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired']);
  assert.equal(result.normalizedSpecs.backlight, '分区 RGB 背光');
  assert.equal(result.normalizedSpecs.caseMaterial, '金属磨砂面板');
  assert.equal(result.normalizedSpecs.switchType, undefined);
});

test('extracts F75 Max layout without treating a selectable switch as universal', () => {
  const f75MaxTarget: CrawlTarget = {
    ...target,
    slug: 'aula-f75-max-2026',
    model: 'AULA F75 Max',
    identityAliases: ['AULA F75 MAX'],
    url: 'https://aulagear.com/collections/keyboards/products/aula-f75-max',
  };
  const snapshot: PageSnapshot = {
    title: 'AULA F75 MAX Gasket-mounted Hot-swappable Tri-Mode Mechanical Keyboard',
    description: 'Bluetooth 5.0 Wireless/Wired Keyboard With 4000mAh Battery',
    bodyText: '80 keys Compact layout Gasket Mounted 5 Layers of Sound-Dampening Materials South-facing RGB Backlight 2.4GHz Bluetooth 5.0 Wired ABS Plastic PBT Plastic Keycaps Hot-Swappable Yes AULA F75 Max Driver Switch: LEOBOG Reaper Switch',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = aulaEsportsKeyboardAdapter.normalize(f75MaxTarget, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, '75%（80键）');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, '南向 RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.caseMaterial, 'ABS Plastic');
  assert.equal(result.normalizedSpecs.keycapMaterial, 'PBT');
  assert.equal(result.normalizedSpecs.batteryCapacity, 4000);
  assert.equal(result.normalizedSpecs.driver, 'AULA Driver');
  assert.equal(result.normalizedSpecs.switchType, undefined);
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

test('extracts HERO 68 HE shared magnetic facts without guessing its switch variant', () => {
  const heroTarget: CrawlTarget = {
    ...target,
    slug: 'aula-hero-68-he-white-side-printed-2026',
    model: 'AULA HERO 68 HE 白色侧刻',
    identityAliases: ['AULA HERO 68 HE'],
    url: 'https://aulagear.com/products/aula-hero68-he',
  };
  const snapshot: PageSnapshot = {
    title: 'AULA HERO 68 HE',
    description: '65% Wired Hot-Swappable Gaming Keyboard with Hall Effect Switch. 68 keys. Ultra-Fast 8K Polling Rate and 128k scanning rate. Vibrant RGB Backlight with south-facing per-key LEDs.',
    bodyText: 'Switch: Black King Switch Meteor Magnetic Switch Dragon King Switch Jade King Switch Case Material ABS Plastic Case Structure Tray-Mounted Keyboard Connectivity Cable Wired South-facing per-key LEDs Hot-swappable Yes AULA HERO 68 HE Online Driver',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = aulaEsportsKeyboardAdapter.normalize(heroTarget, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'magnetic');
  assert.equal(result.normalizedSpecs.layout, '65%（68键）');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired']);
  assert.equal(result.normalizedSpecs.mounting, 'Tray Mount');
  assert.equal(result.normalizedSpecs.caseMaterial, 'ABS Plastic');
  assert.equal(result.normalizedSpecs.pollingRate, 8000);
  assert.equal(result.normalizedSpecs.backlight, '南向 RGB 背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.driver, 'AULA Driver');
  assert.equal(result.normalizedSpecs.switchType, undefined);
  assert.equal(result.normalizedSpecs.scanRate, undefined);
});

test('confirms HERO68XS identity and magnetic category without inventing image-only specifications', () => {
  const heroXsTarget: CrawlTarget = {
    ...target,
    slug: 'aula-hero68xs-phantom-black-snow-god-2026',
    model: 'AULA HERO68XS 幻影黑 雪神磁轴',
    identityAliases: ['HERO68XS'],
    url: 'https://www.aulacn.com/product/99.html',
  };
  const snapshot: PageSnapshot = {
    title: '狼蛛 HERO68XS 客制化磁轴键盘',
    description: '狼蛛 HERO68XS 客制化磁轴键盘，支持驱动自定义。',
    bodyText: 'HERO68XS 光影随战觉醒 客制化磁轴键盘',
    headings: ['狼蛛产品 - HERO68XS 详情'],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: ['狼蛛HERO68XS'],
  };

  const result = aulaEsportsKeyboardAdapter.normalize(heroXsTarget, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'magnetic');
  assert.equal(result.normalizedSpecs.layout, undefined);
  assert.equal(result.normalizedSpecs.switchType, undefined);
  assert.equal(result.normalizedSpecs.connection, undefined);
  assert.ok(result.sourceNotes.some((note) => note.includes('官方说明书交叉确认')));
});
