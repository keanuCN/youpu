import assert from 'node:assert/strict';
import test from 'node:test';
import { djiVideoCameraAdapter } from './dji';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'dji-osmo-pocket-3-2023',
  category: 'video-camera',
  brand: 'dji',
  model: 'Osmo Pocket 3',
  year: 2023,
  url: 'https://www.dji.com/cn/osmo-pocket-3/specs',
  mode: 'cheerio',
};

test('extracts Pocket 3 facts from official Chinese copy', () => {
  const snapshot: PageSnapshot = {
    title: 'Osmo Pocket 3',
    description: '一英寸 CMOS，支持 4K/120fps，2 英寸旋转屏，三轴云台机械增稳，166 分钟续航，支持横竖拍和立体声收音。',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = djiVideoCameraAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.cameraSensor, '一英寸 CMOS');
  assert.equal(result.normalizedSpecs.maxVideo, '4K/120fps');
  assert.equal(result.normalizedSpecs.screenSize, 2);
  assert.equal(result.normalizedSpecs.stabilization, '三轴机械云台增稳');
  assert.equal(result.normalizedSpecs.batteryLife, 166);
  assert.equal(result.normalizedSpecs.verticalShooting, true);
  assert.equal(result.normalizedSpecs.audio, '立体声收音');
});
