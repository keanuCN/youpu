import assert from 'node:assert/strict';
import test from 'node:test';
import { akkoEsportsKeyboardAdapter } from './akko';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'akko-mod007-v5-he-2026',
  category: 'esports-keyboard',
  brand: 'akko',
  model: 'MOD007 V5 HE',
  identityAliases: ['MOD007 V5', 'MOD007 V5 HE 三模磁轴键盘'],
  year: 2026,
  url: 'https://akkogear.com/pd.jsp?id=56',
  mode: 'cheerio',
};

test('extracts Akko MOD007 V5 HE esports keyboard facts', () => {
  const snapshot: PageSnapshot = {
    title: 'MOD007 V5 HE 三模磁轴键盘 - Akko',
    description: '',
    bodyText:
      'MOD007 V5 HE 三模磁轴键盘 Gasket结构磁轴 CNC铝坨坨 0.005RT精度 双8K回报率 有线、2.4G无线、蓝牙 星引力磁轴 自定义屏幕 1600万色RGB背光 碰珠快拆结构 网页或软件双驱动 ￥740.00',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = akkoEsportsKeyboardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.keyboardType, 'magnetic');
  assert.equal(result.normalizedSpecs.switchType, '星引力磁轴');
  assert.equal(result.normalizedSpecs.mounting, 'Gasket 结构');
  assert.equal(result.normalizedSpecs.caseMaterial, 'CNC 铝合金');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.pollingRate, 8000);
  assert.equal(result.normalizedSpecs.rapidTriggerPrecision, 0.005);
  assert.equal(result.normalizedSpecs.backlight, '1600 万色 RGB 背光');
  assert.equal(result.normalizedSpecs.driver, '网页或软件双驱动');
  assert.equal(result.normalizedSpecs.quickRelease, true);
  assert.equal(result.normalizedSpecs.customScreen, true);
  assert.match(result.sourceNotes.join(' '), /740/);
});

test('extracts conventional mechanical keyboard facts from Akko 5075B Plus', () => {
  const snapshot: PageSnapshot = {
    title: '5075B Plus ASA Clear Mechanical Keyboard | Akko Official Global Site',
    description: '',
    bodyText:
      '5075B Plus ASA Clear Mechanical Keyboard Tri-mode connection (2.4G/Bluetooth/Type-C); Programmable RGB Backlit; Transparent PC Keycaps; Hot-swappable Socket; Support Akko Cloud Driver. Akko V3 Piano Pro.',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: ['Hotswap-Socket', 'RGB'],
  };

  const result = akkoEsportsKeyboardAdapter.normalize(
    {
      ...target,
      slug: 'akko-5075b-plus-asa-clear-2026',
      model: '5075B Plus ASA Clear',
      url: 'https://en.akkogear.com/product/5075b-plus-asa-clear-mechanical-keyboard/',
    },
    snapshot,
  );
  assert.equal(result.normalizedSpecs.keyboardType, 'mechanical');
  assert.equal(result.normalizedSpecs.switchType, 'Akko V3 Piano Pro');
  assert.deepEqual(result.normalizedSpecs.connection, ['wired', '2.4g', 'bluetooth']);
  assert.equal(result.normalizedSpecs.backlight, 'RGB 背光');
  assert.equal(result.normalizedSpecs.driver, 'Akko Cloud Driver');
  assert.equal(result.normalizedSpecs.hotSwap, true);
  assert.equal(result.normalizedSpecs.keycapMaterial, '透明 PC 键帽');
});
