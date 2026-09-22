import assert from 'node:assert/strict';
import test from 'node:test';
import { djiDroneAdapter } from './dji';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'dji-avata-2-2024',
  category: 'drone',
  brand: 'dji',
  model: 'Avata 2',
  year: 2024,
  url: 'https://www.dji.com/cn/avata-2/specs',
  mode: 'playwright',
};

test('extracts explicit dynamic-page drone facts from body text', () => {
  const snapshot: PageSnapshot = {
    title: 'DJI Avata 2 - Specs',
    description: 'DJI Avata 2',
    bodyText: '最长飞行时间约 23 分钟 最大信号有效距离（无干扰、无遮挡）FCC：13 公里 影像传感器1/1.3 英寸影像传感器 电池容量2150 毫安时 4K（16:9）：3840×2160@30/50/60/100fps',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = djiDroneAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.maxVideo, '4K/100fps');
  assert.equal(result.normalizedSpecs.transmissionRange, 13);
  assert.equal(result.normalizedSpecs.cameraSensor, '1/1.3 英寸影像传感器');
  assert.equal(result.normalizedSpecs.flightTime, 23);
  assert.equal(result.normalizedSpecs.batteryCapacity, 2150);
});
