import assert from 'node:assert/strict';
import test from 'node:test';
import { insta360ActionCamAdapter } from './insta360';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'insta360-x5-2026',
  category: 'action-cam',
  brand: 'insta360',
  model: 'X5',
  identityAliases: ['影石Insta360 X5'],
  year: 2026,
  url: 'https://www.insta360.com/product/insta360-x5',
  mode: 'cheerio',
};

test('extracts explicit X5 action-camera facts without merging the X6 comparison row', () => {
  const snapshot: PageSnapshot = {
    title: '影石Insta360 X5 — 8K 旗舰款全景运动相机',
    description: 'X5 搭载 1/1.28 英寸传感器和 AI 三芯片。',
    bodyText:
      '影石Insta360 X5 8K 全景运动相机 更大的 1/1.28 英寸传感器。8K30fps 全景拍摄，5.7K60fps 运动 HDR，4K120/100/60fps。约 7200 万像素。360° 水平矫正。FlowState 防抖。续航时间 5.7K24fps 长续航模式：208 分钟。硬件重量 200g。内存microSD（支持 UHS-I V30 或更高）电池容量2400mAh。裸机 15 米防水。摩托车 自行车 水类运动 滑雪 钓鱼 潜水。对比 X6：1 英寸传感器、165g、100 分钟。',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = insta360ActionCamAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.cameraType, 'action');
  assert.equal(result.normalizedSpecs.sensor, '1/1.28 英寸传感器');
  assert.equal(result.normalizedSpecs.maxVideo, '8K/30fps');
  assert.equal(result.normalizedSpecs.maxFrameRate, 120);
  assert.equal(result.normalizedSpecs.maxPhoto, '72MP');
  assert.equal(result.normalizedSpecs.fov, '360°');
  assert.equal(result.normalizedSpecs.stabilization, 'FlowState 防抖 + 360° 水平矫正');
  assert.equal(result.normalizedSpecs.waterproofDepth, 15);
  assert.equal(result.normalizedSpecs.weight, 200);
  assert.equal(result.normalizedSpecs.batteryLife, 208);
  assert.equal(result.normalizedSpecs.storage, 'microSD支持 UHS-I V30 或更高');
  assert.deepEqual(result.normalizedSpecs.scenes, ['cycling', 'motorcycle', 'skiing', 'diving']);
});
