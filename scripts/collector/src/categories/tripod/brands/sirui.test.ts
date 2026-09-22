import assert from 'node:assert/strict';
import test from 'node:test';
import { siruiTripodAdapter } from './sirui';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'sirui-t-1204sk-2026',
  category: 'tripod',
  brand: 'sirui',
  model: 'T-1204SK',
  year: 2026,
  url: 'https://www.sirui.com/index/tpl/producttripodts.html',
  mode: 'cheerio',
};

test('extracts only the target SIRUI tripod model from a multi-model official page', () => {
  const snapshot: PageSnapshot = {
    title: 'SIRUI T-S Series Tripods',
    description: 'SIRUI travel tripods',
    bodyText:
      'Model：T-1004SK Material: Aluminum Compatible Ball Head：K-10X/G-10X Sections: 4 Tube Max Dia: 25.8mm Tube Min Dia: 15mm Min Hgt: 140mm Max Hgt: 980mm Max Hgt Ext.: 1300mm Retracted Height: 480mm Folded Height: 370mm Monopod Max Height: 1340mm Monopod Min Height: 330mm Weight: 1.5kg Load: 12kg Model：T-1204SK Material: Carbon Fiber Compatible Ball Head：K-10X/G-10X Sections: 4 Tube Max Dia: 25.8mm Tube Min Dia: 15mm Min Hgt: 140mm Max Hgt: 980mm Max Hgt Ext.: 1300mm Retracted Height: 480mm Folded Height: 370mm Monopod Max Height: 1340mm Monopod Min Height: 330mm Weight: 1.2kg Load: 12kg',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = siruiTripodAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.material, 'Carbon Fiber');
  assert.equal(result.normalizedSpecs.weight, 1.2);
  assert.equal(result.normalizedSpecs.loadCapacity, 12);
  assert.equal(result.normalizedSpecs.maxHeightExtended, 1300);
  assert.equal(result.normalizedSpecs.foldedHeight, 370);
  assert.equal(result.normalizedSpecs.monopodMaxHeight, 1340);
});

test('extracts Chinese-labelled SIRUI tripod specs from the official page', () => {
  const snapshot: PageSnapshot = {
    title: 'SIRUI T-S Series Tripods',
    description: 'T-S 系列三脚架',
    bodyText:
      '型 号：T-1204SK材 质: 碳纤维适配云台：K-10X/G-10X/G11节 数: 4最大管径: 25.8mm最小管径: 15mm最小高度: 140mm不升中轴高: 980mm最大高度: 1300mm收缩高度: 480mm折叠高度: 370mm独脚架最大高度: 1340mm独脚架最小高度: 330mm自身重量: 1.2kg最大负重: 12kg',
    headings: [],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = siruiTripodAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.material, '碳纤维');
  assert.equal(result.normalizedSpecs.compatibleBallHead, 'K-10X/G-10X/G11');
  assert.equal(result.normalizedSpecs.sections, 4);
  assert.equal(result.normalizedSpecs.maxHeight, 980);
  assert.equal(result.normalizedSpecs.maxHeightExtended, 1300);
  assert.equal(result.normalizedSpecs.weight, 1.2);
  assert.equal(result.normalizedSpecs.loadCapacity, 12);
});
