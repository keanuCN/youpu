import assert from 'node:assert/strict';
import test from 'node:test';
import { igpsportBikeComputerAdapter } from './igpsport';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'igpsport-igs800-2024',
  category: 'bike-computer',
  brand: 'igpsport',
  model: 'iGS800',
  year: 2024,
  url: 'https://www.igpsport.cn/product/igs800',
  mode: 'cheerio',
};

test('extracts common Chinese product-page variants for screen and battery life', () => {
  const snapshot: PageSnapshot = {
    title: 'iGS800 - 彩屏触控GPS骑行码表',
    description: '3.5寸全彩大触屏，50+小时超长续航能力，精准导航功能。',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = igpsportBikeComputerAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.screenSize, 3.5);
  assert.equal(result.normalizedSpecs.screen, '全透触控彩屏');
  assert.equal(result.normalizedSpecs.touchScreen, true);
  assert.equal(result.normalizedSpecs.batteryLife, 50);
  assert.equal(result.normalizedSpecs.navigation, true);
});
