import assert from 'node:assert/strict';
import test from 'node:test';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';
import { cherryEsportsKeyboardAdapter } from './cherry';

const target: CrawlTarget = {
  slug: 'cherry-mx30s-rgb-2026',
  category: 'esports-keyboard',
  brand: 'cherry',
  model: 'CHERRY MX3.0S RGB',
  identityAliases: ['MX3.0S RGB', 'MX 3.0S RGB'],
  year: 2026,
  url: 'https://www.cherry.cn/kbgame-6214.html',
  mode: 'cheerio',
};

test('extracts only shared CHERRY MX3.0S RGB wired full-size specs', () => {
  const snapshot: PageSnapshot = {
    title: 'MX3.0S RGB-CHERRY樱桃',
    description: '最受欢迎的电竞键盘',
    bodyText: '连铸式铝合金外壳 无钢软弹手感 1600万色背光 游戏系列 全尺寸 机械 有线 RGB',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = cherryEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.layout, '108 键全尺寸');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired']);
  assert.equal(result.normalizedSpecs.caseMaterial, '铝合金外壳');
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.mounting, '无钢软弹结构');
  assert.equal(result.normalizedSpecs.switchType, undefined);
});
