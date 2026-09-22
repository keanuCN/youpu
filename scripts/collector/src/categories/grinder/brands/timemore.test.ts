import assert from 'node:assert/strict';
import test from 'node:test';
import { timemoreGrinderAdapter } from './timemore';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'timemore-sculptor-078s-2026',
  category: 'grinder',
  brand: 'timemore',
  model: 'TEG078S',
  identityAliases: ['Sculptor 078S', '雕刻家078S'],
  year: 2026,
  url: 'https://www.xn--14us3q.tw/products/泰摩咖啡-雕刻家078s-電動磨豆機-黑色',
  mode: 'cheerio',
};

test('extracts TEG078S facts and keeps 078 power separate', () => {
  const snapshot: PageSnapshot = {
    title: '【泰摩咖啡】電動磨豆機TEG078S-黑色',
    description: '',
    bodyText:
      '【泰摩咖啡】電動磨豆機TEG078S-黑色 【產品】雕刻家078S 電動磨豆機 【材質】鋁合金/不鏽鋼/Tritan材料 【重量】約6810g 【尺寸】261mm*118mm*294mm 【電壓/功率】110V/110W(078)、230W(078S) 標準豆倉- 容量：約 20–30g 加高豆倉- 容量：約 100g 078 系列：接粉罐容量約 60g 可調整研磨轉速 專利設計旋轉震落細粉 手沖/義式雙用',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = timemoreGrinderAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.grinderType, '电动磨豆机');
  assert.equal(result.normalizedSpecs.useRange, '手冲 / 意式双用');
  assert.equal(result.normalizedSpecs.weight, 6810);
  assert.equal(result.normalizedSpecs.dimensions, '261mm × 118mm × 294mm');
  assert.equal(result.normalizedSpecs.materials, '铝合金/不锈钢/Tritan材料');
  assert.equal(result.normalizedSpecs.hopperCapacity, '标准豆仓约 20–30 g；加高豆仓约 100 g');
  assert.equal(result.normalizedSpecs.catchCupCapacity, 60);
  assert.equal(result.normalizedSpecs.power, 230);
  assert.equal(result.normalizedSpecs.voltage, '110V');
  assert.equal(result.normalizedSpecs.speedAdjustment, true);
  assert.equal(result.normalizedSpecs.fineRetentionReduction, true);
});
