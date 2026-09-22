import assert from 'node:assert/strict';
import test from 'node:test';
import { nisiFilterAdapter } from './nisi';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'nisi-true-color-cpl-2026',
  category: 'filter',
  brand: 'nisi',
  model: 'TRUE COLOR CPL',
  year: 2026,
  url: 'https://www.nisioptics.com/true-color-cpl',
  mode: 'cheerio',
};

test('extracts explicit NiSi CPL facts from the official Chinese product page', () => {
  const snapshot: PageSnapshot = {
    title: 'TRUE COLOR 色彩保真CPL',
    description: '消除偏光不偏色',
    bodyText:
      '现在提供 Φ40.5、43、46、49、52、55、58、62、67、72、77、82、95mm True Color 偏振材料 基本不改变色温 双面低反射纳米镀膜 双面防水防油 边缘涂黑 铜框 真彩 CPL',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = nisiFilterAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.filterType, 'CPL 偏振镜');
  assert.equal(result.normalizedSpecs.diameterOptions, '40.5 / 43 / 46 / 49 / 52 / 55 / 58 / 62 / 67 / 72 / 77 / 82 / 95 mm');
  assert.equal(result.normalizedSpecs.material, 'True Color 偏振材料');
  assert.equal(result.normalizedSpecs.coating, '双面低反射纳米镀膜');
  assert.equal(result.normalizedSpecs.colorNeutral, true);
  assert.equal(result.normalizedSpecs.waterOilResistance, true);
  assert.equal(result.normalizedSpecs.edgeBlackening, true);
  assert.equal(result.normalizedSpecs.frameOptions, '标准框 / 铜框');
});
