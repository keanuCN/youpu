import assert from 'node:assert/strict';
import test from 'node:test';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';
import { rogEsportsKeyboardAdapter } from './rog';

const target: CrawlTarget = {
  slug: 'rog-azoth-extreme-edition-20-2026',
  category: 'esports-keyboard',
  brand: 'rog',
  model: 'ROG 夜魔 EXTREME 20周年版',
  identityAliases: ['ROG Azoth Extreme Edition 20'],
  year: 2026,
  url: 'https://rog.asus.com.cn/keyboards/keyboards/aura-rgb/rog-azoth-extreme-edition-20/spec/',
  mode: 'cheerio',
};

test('extracts ROG 20th Anniversary Azoth specs and omits mode-dependent polling rate', () => {
  const snapshot: PageSnapshot = {
    title: 'ROG夜魔 EXTREME 20周年版 - 规格参数',
    description: 'ROG夜魔 EXTREME 20周年版是一款客制化75%配列游戏键盘。',
    bodyText: 'ROG NX Mechanical Switch USB 2.0 (TypeC 转 TypeA) 无线 2.4GHz 蓝牙 RGB Per keys USB 回报率 8000 Hz 搭配 ROG 回报率加速器 1 x ROG Polling Rate Booster Armoury Crate 奥创软件',
    headings: ['可调式Gasket结构', '全彩OLED触摸屏', '热插拔轴体', '铝合金底壳结合金属边框'],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  assert.equal(rogEsportsKeyboardAdapter.canHandle(target), true);
  const result = rogEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, '75%');
  assert.equal(result.normalizedSpecs.mounting, '可调式 Gasket');
  assert.equal(result.normalizedSpecs.caseMaterial, '铝合金底壳 + 金属边框');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 每键背光');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.customScreen, true);
  assert.equal(result.normalizedSpecs.driver, 'Armoury Crate');
  assert.equal(result.normalizedSpecs.pollingRate, undefined);
  assert.equal(result.normalizedSpecs.batteryCapacity, undefined);
});

test('does not route the standard Azoth Extreme model through the 20th Anniversary adapter', () => {
  assert.equal(rogEsportsKeyboardAdapter.canHandle({ ...target, model: 'ROG 夜魔 Extreme' }), false);
});
