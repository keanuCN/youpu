import assert from 'node:assert/strict';
import test from 'node:test';
import { godoxVideoLightAdapter } from './godox';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'godox-sl60iibi-2026',
  category: 'video-light',
  brand: 'godox',
  model: 'SL60IIBi',
  year: 2026,
  url: 'https://godox.com.cn/product-a/SL60II.html',
  mode: 'cheerio',
};

test('extracts the target Godox video-light column from the official table', () => {
  const snapshot: PageSnapshot = {
    title: 'SL60IID/SL60IIBi-神牛产品-Godox神牛 - 官方网站',
    description: 'SL系列摄影灯 SL60IID/SL60IIBi',
    bodyText:
      'SL系列摄影灯采用保荣卡口。低噪风扇。SL60IIBi的最高亮度可达25100Lux（@5600K @1m）。',
    headings: [],
    jsonLd: [],
    tables: [
      {
        headers: ['型号', 'SL60IID', 'SL60IIBi'],
        rows: [
          ['功率', '最大70W', '最大75W'],
          ['色温', '5600±200K', '2800K~6500K'],
          ['调光范围', '0%~100%', '0%~100%'],
          ['CRI', '≥96'],
          ['TLCI', '≥97'],
          ['FX光效种类', '8种', '11种'],
          ['控制方式', '2.4GHz控制/蓝牙控制/灯体控制'],
          ['2.4GHz传输距离', '≈30m'],
          ['工作环境温度', '-10℃~40℃'],
          ['尺寸（展开状态，不含反光罩）', '140mm*236mm*215mm', '140mm*236mm*215mm'],
          ['净重', '1.43kg', '1.5kg'],
        ],
      },
    ],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = godoxVideoLightAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.lightType, 'COB 摄影灯');
  assert.equal(result.normalizedSpecs.power, 75);
  assert.equal(result.normalizedSpecs.colorTemperature, '2800K~6500K');
  assert.equal(result.normalizedSpecs.illuminance, 25100);
  assert.equal(result.normalizedSpecs.cri, 96);
  assert.equal(result.normalizedSpecs.fxEffects, 11);
  assert.equal(result.normalizedSpecs.transmissionDistance, 30);
  assert.equal(result.normalizedSpecs.weight, 1.5);
  assert.equal(result.normalizedSpecs.mount, '保荣卡口');
  assert.equal(result.normalizedSpecs.lowNoise, true);
});
