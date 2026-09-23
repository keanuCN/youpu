import assert from 'node:assert/strict';
import test from 'node:test';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';
import { rapooEsportsKeyboardAdapter } from './rapoo';

const target: CrawlTarget = {
  slug: 'rapoo-v500pro-2026',
  category: 'esports-keyboard',
  brand: 'rapoo',
  model: 'V500PRO',
  identityAliases: ['V500PRO 混彩背光游戏机械键盘'],
  year: 2026,
  url: 'https://www.rapoo.cn/product/87',
  mode: 'cheerio',
};

test('extracts verified wired full-size V500PRO specs and keeps switch options explicit', () => {
  const snapshot: PageSnapshot = {
    title: 'V500PRO - 混彩背光游戏机械键盘 - 雷柏科技',
    description: '雷柏自主黑、青、茶、红轴；磨砂金属上盖',
    bodyText: '键盘布局104全尺寸键盘 按键数104键盘 背光混彩 灯光模式5种 连接USB有线 双色注塑键帽',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = rapooEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, '雷柏自主黑轴、青轴、茶轴、红轴可选');
  assert.equal(result.normalizedSpecs.layout, '104 键全尺寸');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired']);
  assert.equal(result.normalizedSpecs.backlight, '混彩背光');
  assert.equal(result.normalizedSpecs.caseMaterial, '磨砂金属上盖');
  assert.equal(result.normalizedSpecs.hotSwap, undefined);
});
