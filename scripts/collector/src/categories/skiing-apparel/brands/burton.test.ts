import assert from 'node:assert/strict';
import test from 'node:test';
import { burtonSkiingApparelAdapter } from './burton';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'burton-reserve-2l-pants-2027',
  category: 'skiing-apparel',
  brand: 'burton',
  model: 'Reserve 2L Pants',
  year: 2027,
  url: 'https://jp.burton.com/en-jp/products/mens-burton-reserve-2l-pants-302631',
  mode: 'cheerio',
};

test('extracts explicit snow-apparel construction, protection, fit, and features', () => {
  const snapshot: PageSnapshot = {
    title: "Men's Burton Reserve 2L Pants 2027",
    description: 'A two-layer shell pant.',
    bodyText:
      'Warmth Shell Waterproof 20,000mm Breathability 20,000G Fabric DRYRIDE 2-Layer 100% Recycled Polyester Plain Weave Regular fit Fully Taped Seams Zippered Cuff Gussets Water Resistant Boot Gaiter Venting Mesh-Lined No-Snag Continuous Inner Thigh Vent',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = burtonSkiingApparelAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.garmentType, 'pants');
  assert.equal(result.normalizedSpecs.construction, '2L');
  assert.equal(result.normalizedSpecs.waterproofMm, 20_000);
  assert.equal(result.normalizedSpecs.breathabilityG, 20_000);
  assert.equal(result.normalizedSpecs.insulation, 'shell');
  assert.equal(result.normalizedSpecs.fit, 'regular');
  assert.equal(result.normalizedSpecs.seamTaping, 'fully-taped');
  assert.equal(result.normalizedSpecs.venting, true);
  assert.equal(result.normalizedSpecs.powderSkirt, undefined);
});

test('does not invent protection ratings when a page omits numeric values', () => {
  const result = burtonSkiingApparelAdapter.normalize(
    { ...target, model: 'Tuvak GORE-TEX C-KNIT 3L Jacket' },
    {
      title: "Men's Burton [ak] Tuvak GORE-TEX C-KNIT 3L Jacket 2027",
      bodyText: 'Warmth Shell Fabric GORE-TEX C-Knit 3-Layer Regular fit Fully Taped Seams Pit Zip Vents',
      headings: [],
      jsonLd: [],
      tables: [],
      specifications: [],
      images: [],
      imageAltTexts: [],
    },
  );
  assert.equal(result.normalizedSpecs.garmentType, 'jacket');
  assert.equal(result.normalizedSpecs.construction, '3L');
  assert.equal(result.normalizedSpecs.waterproofMm, undefined);
  assert.equal(result.normalizedSpecs.breathabilityG, undefined);
});

test('extracts Japanese-localized Burton specifications returned after locale redirect', () => {
  const result = burtonSkiingApparelAdapter.normalize(target, {
    title: 'メンズ Burton リザーブ 2L パンツ 2027',
    bodyText:
      '滑りやすい素材により雪や雨からガードする商品説明。フィット レギュラーフィット スペック 保温性シェル 防水性20,000mm 透湿性20,000g ライナー ナイロンタフタのストレッチウーブン素材（上部バックパネル） 素材 DRYRIDE 2レイヤー リサイクルポリエステル100% 特長全ての縫い目にシームテープ加工 ベントメッシュライナー付き腿内側のベント',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  });
  assert.equal(result.normalizedSpecs.garmentType, 'pants');
  assert.equal(result.normalizedSpecs.waterproofMm, 20_000);
  assert.equal(result.normalizedSpecs.breathabilityG, 20_000);
  assert.equal(result.normalizedSpecs.fit, 'regular');
  assert.equal(result.normalizedSpecs.seamTaping, 'fully-taped');
  assert.equal(result.normalizedSpecs.venting, true);
  assert.ok(String(result.normalizedSpecs.fabric).startsWith('DRYRIDE'));
  assert.match(String(result.normalizedSpecs.fabric), /リサイクルポリエステル/);
});

test('extracts insulation weights from Japanese-localized warmth specifications', () => {
  const result = burtonSkiingApparelAdapter.normalize(
    { ...target, model: 'Reserve 2L Insulated Stretch Jacket' },
    {
      title: 'ウィメンズ Burton リザーブ 2L インサレーテッド ストレッチ ジャケット 2027',
      bodyText: 'フィット スリムフィット スペック 保温性 80g ThermacoreEco 防水性20,000mm 透湿性20,000g',
      headings: [],
      jsonLd: [],
      tables: [],
      specifications: [],
      images: [],
      imageAltTexts: [],
    },
  );
  assert.equal(result.normalizedSpecs.insulation, '80g ThermacoreEco');
  assert.equal(result.normalizedSpecs.fit, 'slim');
});

test('uses the product fit instead of unrelated fit-guide examples later on the page', () => {
  const result = burtonSkiingApparelAdapter.normalize(
    { ...target, model: 'Reserve 2L Insulated Stretch Jacket' },
    {
      title: 'Burton Reserve 2L Insulated Stretch Jacket 2027',
      bodyText: 'フィット スリムフィット スペック 保温性 80g ThermacoreEco サイズガイド Regular fit Baggy fit',
      headings: [],
      jsonLd: [],
      tables: [],
      specifications: [],
      images: [],
      imageAltTexts: [],
    },
  );
  assert.equal(result.normalizedSpecs.fit, 'slim');
});
