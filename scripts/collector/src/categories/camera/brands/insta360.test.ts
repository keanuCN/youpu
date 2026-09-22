import assert from 'node:assert/strict';
import test from 'node:test';
import { insta360CameraAdapter } from './insta360';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'insta360-x4-2024',
  category: 'camera',
  brand: 'insta360',
  model: 'X4',
  year: 2024,
  url: 'https://www.insta360.com/product/insta360-x4',
  mode: 'cheerio',
};

test('extracts explicit X4 camera facts from the official product page', () => {
  const snapshot: PageSnapshot = {
    title: 'Insta360 X4',
    description: '8K 360 camera',
    bodyText:
      '360° 全景相机 传感器尺寸 1/2 英寸 视频分辨率 8K30fps/5.7K60fps 7200 万像素 360°照片 FlowState 防抖 2.5 英寸触摸屏 续航时间 135分钟 电池容量 2290mAh 重量 203g 防水能力 裸机 10 米防水',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = insta360CameraAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.cameraType, '360°全景相机');
  assert.equal(result.normalizedSpecs.cameraSensor, '1/2 英寸');
  assert.equal(result.normalizedSpecs.maxVideo, '8K/30fps/5.7K/60fps');
  assert.equal(result.normalizedSpecs.maxPhoto, '72MP');
  assert.equal(result.normalizedSpecs.stabilization, 'FlowState 防抖');
  assert.equal(result.normalizedSpecs.screenSize, 2.5);
  assert.equal(result.normalizedSpecs.batteryLife, 135);
  assert.equal(result.normalizedSpecs.batteryCapacity, 2290);
  assert.equal(result.normalizedSpecs.weight, 203);
  assert.equal(result.normalizedSpecs.waterproof, '裸机 10 m 防水');
});
