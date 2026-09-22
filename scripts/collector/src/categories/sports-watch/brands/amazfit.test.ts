import assert from 'node:assert/strict';
import test from 'node:test';
import { amazfitSportsWatchAdapter } from './amazfit';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'amazfit-t-rex-3-pro-48mm-2026',
  category: 'sports-watch',
  brand: 'amazfit',
  model: 'T-Rex 3 Pro 48mm',
  identityAliases: ['Amazfit T-Rex 3 Pro'],
  year: 2026,
  url: 'https://tw.amazfit.com/products/trex3pro',
  mode: 'cheerio',
};

test('extracts only the 48mm Amazfit watch variant from the official dual-size page', () => {
  const snapshot: PageSnapshot = {
    title: 'T-Rex 3 PRO 五級鈦合金智慧手錶',
    description: '1.5吋 AMOLED 螢幕，25天日常電池續航力，10ATM防水。',
    bodyText:
      'T-Rex 3 PRO 五級鈦合金智慧手錶 48mm 規格 產品尺寸：48x48x14mm 產品重量：75g (錶身52g、錶帶23g) 產品材質：錶殼-纖維增強聚合物 錶圈與按鍵：5級鈦合金 按鍵數量：4 防水等級：10ATM 螢幕材質：AMOLED 螢幕尺寸：1.5吋 峰值亮度：3000nits 藍寶石鏡面玻璃 電池容量：700mAh 日常模式：最長25天 GNSS最大續航模式：最長116小時 健康：BioTracker™ 6.0 PPG 生物識別傳感器 戶外和運動：加速度感測器 定位：雙頻六星定位系統（GPS、GLONASS、GALILEO） 連接：Wi-Fi 2.4GHz。44mm 規格 產品重量：65.3g 螢幕尺寸：1.32吋 電池容量：500mAh 日常模式：最長17天 GNSS最大續航模式：最長86小時。支援全彩離線地貌圖、離線路徑規劃和導航。多達180+的運動模組。',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = amazfitSportsWatchAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.watchType, '户外运动智能手表');
  assert.equal(result.normalizedSpecs.caseSize, '48mm');
  assert.equal(result.normalizedSpecs.displaySize, 1.5);
  assert.equal(result.normalizedSpecs.displayType, 'AMOLED');
  assert.equal(result.normalizedSpecs.peakBrightness, 3000);
  assert.equal(result.normalizedSpecs.displayGlass, '蓝宝石镜面玻璃');
  assert.equal(result.normalizedSpecs.weight, 75);
  assert.equal(result.normalizedSpecs.waterResistance, 10);
  assert.equal(result.normalizedSpecs.materials, '表壳-纤维增强聚合物 表圈与按键：5级钛合金');
  assert.equal(result.normalizedSpecs.batteryCapacity, 700);
  assert.equal(result.normalizedSpecs.batteryLife, 25);
  assert.equal(result.normalizedSpecs.gnssBatteryLife, 116);
  assert.equal(result.normalizedSpecs.sportsModes, '180+');
  assert.equal(result.normalizedSpecs.offlineNavigation, true);
  assert.equal(result.normalizedSpecs.positioning, '双频六星定位系统（GPS、GLONASS、GALILEO）');
  assert.equal(result.normalizedSpecs.healthSensors, 'BioTracker™ 6.0 PPG 生物识别传感器');
});
