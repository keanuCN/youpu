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

test('extracts V700DIY-98 long-battery specs without guessing layout or polling rate', () => {
  const v700Target: CrawlTarget = {
    ...target,
    slug: 'rapoo-v700diy-98-2026',
    model: '雷柏 V700DIY-98 长续航版',
    identityAliases: ['V700DIY-98'],
    url: 'https://www.rapoo.cn/product/871',
  };
  const snapshot: PageSnapshot = {
    title: 'V700DIY-98长续航版 - 客制化多模式无线背光游戏机械键盘',
    description: '柔韧Gasket结构，凯华定制快银轴/弹白轴，全键热插拔。',
    bodyText: '蓝牙5.0 无线2.4G 有线连接。高含量PBT双色注塑键帽，RGB背光灯。内置10000mAh大容量锂电。USB回报率有线/2.4G模式下：125-250-500-1000Hz可切。全自研驱动A Hub。',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = rapooEsportsKeyboardAdapter.normalize(v700Target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, '凯华定制快银轴/弹白轴可选');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.keycapMaterial, 'PBT双色注塑');
  assert.equal(result.normalizedSpecs.batteryCapacity, 10000);
  assert.equal(result.normalizedSpecs.driver, 'Rapoo A Hub');
  assert.equal(result.normalizedSpecs.layout, undefined);
  assert.equal(result.normalizedSpecs.pollingRate, undefined);
});

test('extracts verified V700RGB alloy edition specs without assigning one switch option', () => {
  const v700RgbTarget: CrawlTarget = {
    ...target,
    slug: 'rapoo-v700rgb-alloy-2026',
    model: '雷柏 V700RGB 合金版',
    identityAliases: ['V700RGB合金版'],
    url: 'https://www.rapoo.cn/product/94',
  };
  const snapshot: PageSnapshot = {
    title: 'V700RGB合金版 - 幻彩RGB背光游戏机械键盘 - 雷柏科技',
    description: '金属铝合金上盖，雷柏自主黑、青、茶轴，双色注塑键帽。',
    bodyText: '全108键无冲突，1680万色幻彩RGB背光，板载内存、配套软件。',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = rapooEsportsKeyboardAdapter.normalize(v700RgbTarget, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, '雷柏自主青轴、黑轴、茶轴可选');
  assert.equal(result.normalizedSpecs.layout, '108 键全尺寸');
  assert.equal(result.normalizedSpecs.connection, undefined);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 幻彩背光');
  assert.equal(result.normalizedSpecs.caseMaterial, '铝合金上盖');
  assert.equal(result.normalizedSpecs.keycapMaterial, '双色注塑');
  assert.equal(result.normalizedSpecs.driver, 'Rapoo 驱动软件');
});
