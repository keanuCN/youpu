import assert from 'node:assert/strict';
import test from 'node:test';
import { djiGimbalAdapter } from './dji';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'dji-osmo-mobile-7p-2026',
  category: 'gimbal',
  brand: 'dji',
  model: 'Osmo Mobile 7P',
  year: 2026,
  url: 'https://www.dji.com/cn/osmo-mobile-7-series/specs',
  mode: 'cheerio',
};

test('extracts target DJI gimbal facts from a multi-model official specs page', () => {
  const snapshot: PageSnapshot = {
    title: 'Osmo Mobile 7 系列 - 技术参数 - DJI 大疆创新',
    description: 'Osmo Mobile 7 和 Osmo Mobile 7P 手机稳定器',
    bodyText:
      'Osmo Mobile 7P展开：长 288 毫米，宽 107 毫米，高 96 毫米折叠：长 190 毫米，宽 95 毫米，高 46 毫米重量Osmo Mobile 7P云台 + 内置三脚架 + 磁吸手机夹 + 多功能追踪模块：约 368 克Osmo Mobile 7云台 + 内置三脚架 + 磁吸手机夹：约 300 克延长杆Osmo Mobile 7P内置延长杆最大拉伸长度：215 毫米Osmo Mobile 7无内置延长杆适用手机重量170 克至 300 克适用手机厚度6.9 毫米至 10 毫米适用手机宽度67 毫米至 84 毫米容量3350 毫安时工作时间Osmo Mobile 7P约 10 小时Osmo Mobile 7约 10 小时充电时间约 2.5 小时云台充电接口USB-C智能跟随 7.0三轴云台增稳内置三脚架多功能追踪模块适配性Osmo Mobile 7P支持（标配）最大控制转速120°/s补光灯照度40 lux补光灯色温2500 K 至 6000 K手机稳定器',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = djiGimbalAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.gimbalType, '手机稳定器');
  assert.equal(result.normalizedSpecs.stabilization, '三轴云台增稳');
  assert.equal(result.normalizedSpecs.tracking, '智能跟随 7.0');
  assert.equal(result.normalizedSpecs.weight, 368);
  assert.equal(result.normalizedSpecs.batteryCapacity, 3350);
  assert.equal(result.normalizedSpecs.workingTime, 10);
  assert.equal(result.normalizedSpecs.extensionRodLength, 215);
  assert.equal(result.normalizedSpecs.chargingPort, 'USB-C');
  assert.equal(result.normalizedSpecs.fillLightIlluminance, 40);
  assert.equal(result.normalizedSpecs.fillLightColorTemperature, '2500 K 至 6000 K');
});
