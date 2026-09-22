import assert from 'node:assert/strict';
import test from 'node:test';
import { djiMicrophoneAdapter } from './dji';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'dji-mic-mini-2026',
  category: 'microphone',
  brand: 'dji',
  model: 'DJI Mic Mini',
  year: 2026,
  url: 'https://www.dji.com/cn/mic-mini/specs',
  mode: 'cheerio',
};

test('extracts DJI Mic Mini component and audio facts from the official specs page', () => {
  const snapshot: PageSnapshot = {
    title: 'DJI Mic Mini - 技术参数 - DJI 大疆创新',
    description: 'DJI Mic Mini 无线麦克风',
    bodyText:
      'DJI Mic Mini 发射器型号DMMT01重量约 10 克无线模式GFSK 2Mbps蓝牙协议蓝牙 5.3电池容量114 毫安时充电时间约 90 分钟工作时间约 11.5 小时DJI Mic Mini 接收器型号DMMR01重量约 17.8 克电池容量170 毫安时充电时间约 100 分钟工作时间约 10.5 小时DJI Mic Mini 充电盒型号DMMC01重量约 139 克电池容量1950 毫安时充电时间约 2 小时通用麦克风指向性全指向频率响应低切功能关：20 Hz 至 20 kHz低切功能开：100 Hz 至 20 kHz最大声压级120dB SPL等效噪声24 dBA最大传输距离400 米',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = djiMicrophoneAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.microphoneType, '无线麦克风');
  assert.equal(result.normalizedSpecs.transmitterWeight, 10);
  assert.equal(result.normalizedSpecs.receiverWeight, 17.8);
  assert.equal(result.normalizedSpecs.chargingCaseWeight, 139);
  assert.equal(result.normalizedSpecs.transmitterBatteryCapacity, 114);
  assert.equal(result.normalizedSpecs.receiverWorkingTime, 10.5);
  assert.equal(result.normalizedSpecs.chargingCaseChargingTime, 2);
  assert.equal(result.normalizedSpecs.polarPattern, '全指向');
  assert.equal(result.normalizedSpecs.maxSPL, 120);
  assert.equal(result.normalizedSpecs.maxTransmissionDistance, 400);
  assert.equal(result.normalizedSpecs.wirelessMode, 'GFSK 2Mbps');
  assert.equal(result.normalizedSpecs.bluetoothProtocol, '蓝牙 5.3');
});
