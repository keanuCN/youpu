import test from 'node:test';
import assert from 'node:assert/strict';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';
import { dareuEsportsKeyboardAdapter } from './dareu';

const target: CrawlTarget = {
  slug: 'dareu-cool68-ocean-blue-2026',
  category: 'esports-keyboard',
  brand: 'dareu',
  model: 'DAREU COOL68 云海蓝',
  identityAliases: ['DAREU COOL68'],
  year: 2026,
  url: 'https://www.dareu.us/products/cool68',
  mode: 'cheerio',
};

test('extracts COOL68 shared magnetic specs without guessing switch variant', () => {
  const snapshot: PageSnapshot = {
    title: 'DAREU COOL68 | Hall Effect Magnetic Switch Gaming Keyboard',
    description: 'A compact 65% layout magnetic gaming keyboard with 0.01mm RT precision, 8K polling rate, hot-swappable design, Gasket Structure and DAREU Web Driver.',
    bodyText: 'Connection Type: Wired Type-C Switch: DAREU Shadow Blade Magnetic Switch Driver: YES Keycap: PBT + PC transparent Light: RGB - 20 lighting modes & 5 music modes',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = dareuEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'magnetic');
  assert.equal(result.normalizedSpecs.layout, '65%（68键）');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired']);
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.equal(result.normalizedSpecs.pollingRate, 8000);
  assert.equal(result.normalizedSpecs.rapidTriggerPrecision, 0.01);
  assert.equal(result.normalizedSpecs.keycapMaterial, 'PBT + PC 透明键帽');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.switchType, undefined);
});

test('extracts only the A98 Pro RT edition facts and does not conflate Pro II', () => {
  const rtTarget: CrawlTarget = {
    ...target,
    slug: 'dareu-a98-pro-rt-2026',
    model: 'DAREU A98 专业版 RT 三模机械键盘',
    identityAliases: ['A98 Pro RT', 'A98 专业版 RT'],
    url: 'https://www.ithome.com/0/926/211.htm',
  };
  const snapshot: PageSnapshot = {
    title: '机械轴支持 Rapid Trigger，达尔优推出 RT 版 A98 Pro 专业版三模键盘',
    description: '',
    bodyText: 'A98专业版三模机械键盘的RT版。该特别款键盘搭载机械RT轴体。这款键盘的热插拔PCB也兼容标准的2-Pin机械轴体。达尔优A98专业版RT版键盘内部采用Gasket结构，拥有下灯位球头RGB LED背光。该键盘支持有线 USB-C / 无线 2.4GHz / 无线 BT 5.1 三模连接，内置 8000mAh 电池。',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = dareuEsportsKeyboardAdapter.normalize(rtTarget, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, undefined);
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.batteryCapacity, 8000);
  assert.equal(result.normalizedSpecs.screen, undefined);
  assert.equal(result.normalizedSpecs.switchType, undefined);
});
