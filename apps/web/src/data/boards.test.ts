import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'yaml';
import { GEAR, PROTOTYPE_GEAR } from './boards';

test('Jones Dream Weaver 2.0 seed preserves all seven official size rows from raw evidence', () => {
  const raw = JSON.parse(readFileSync('../../data/raw/snowboard/jones/dream-weaver-2-0-2026-27.json', 'utf8')) as {
    sizeTable: { rows: Array<Record<string, unknown> & { size: number }> };
  };
  const yaml = parse(readFileSync('../../data/snowboard/jones-dream-weaver-2-0-2027.yaml', 'utf8')) as {
    specs: { sizeSpecs?: unknown[] };
  };

  assert.equal(raw.sizeTable.rows.length, 7);
  assert.deepEqual(yaml.specs.sizeSpecs, raw.sizeTable.rows.map((row) => ({ ...row, size: String(row.size) })));
});

test('Salomon Assassin Pro 2027 seed preserves all official size rows from raw evidence', () => {
  const raw = JSON.parse(readFileSync('../../data/raw/snowboard/salomon/assassin-pro-2026-27.json', 'utf8')) as {
    sizeTable: { rows: Array<Record<string, unknown> & { size: string }> };
  };
  const yaml = parse(readFileSync('../../data/snowboard/salomon-assassin-pro-2027.yaml', 'utf8')) as {
    specs: { sizeSpecs?: unknown[] };
  };

  assert.equal(raw.sizeTable.rows.length, 7);
  assert.deepEqual(yaml.specs.sizeSpecs, raw.sizeTable.rows);
});

test('official Café Racer 159 facts survive the cloud snapshot merge', () => {
  const board = GEAR.find((item) => item.id === 'sb-07');
  assert.ok(board);

  assert.equal(board.specs.length, 159);
  assert.equal(board.specs.effectiveEdge, 1200);
  assert.equal(board.specs.waistWidth, 269);
  assert.equal(board.specs.weight, undefined);
  assert.equal(board.specs.profileFamily, 'camber');
  assert.match(board.analysis.verdict, /全长 Camber/);
  assert.equal(board.sizeSpecs?.length, 5);
});

test('KORUA Café Racer preserves official per-size running length, taper, variant weights, and fit-source differences', () => {
  const board = PROTOTYPE_GEAR.find((item) => item.id === 'sb-07');
  assert.ok(board);

  const raw = JSON.parse(readFileSync('../../data/raw/snowboard/korua/cafe-racer-current.json', 'utf8')) as {
    sizes: Array<{
      size: string;
      selectableOnCapturedProductPage: boolean;
      effectiveEdge: number;
      runningLength: number;
      noseWidth: number;
      waistWidth: number;
      tailWidth: number;
      sidecutRadius: number;
      setback: number;
      taper: number;
      recommendedStance: number;
      adjustableStanceRange: [number, number];
      boardWeightKg: { gloss: number | null; brushed: number | null };
      maxBootSizeEU: number | { productPage: number; sizeGuide: number };
      maxBootSoleLengthCm: number;
      recommendedRiderWeightKg?: number[];
      productPageRiderWeightKg?: number[];
      sizeGuideRiderWeightKg?: number[];
      recommendedRiderWeightRaw?: string;
      maxRiderHeightCm: number | string;
    }>;
  };
  const expected = raw.sizes.map((row) => ({
    size: row.size,
    effectiveEdge: row.effectiveEdge,
    runningLength: row.runningLength,
    noseWidth: row.noseWidth,
    waistWidth: row.waistWidth,
    tailWidth: row.tailWidth,
    sidecutRadii: `${row.sidecutRadius.toFixed(1)} m`,
    sidecutRadiusM: row.sidecutRadius,
    setback: row.setback,
    taperMm: row.taper,
    stanceWidth: `${row.recommendedStance * 10} mm (ref); ${row.adjustableStanceRange[0] * 10}–${row.adjustableStanceRange[1] * 10} mm (range)`,
    recommendedStanceCm: row.recommendedStance,
    adjustableStanceRangeCm: row.adjustableStanceRange,
    boardWeightKg: row.boardWeightKg,
    selectableOnCapturedProductPage: row.selectableOnCapturedProductPage,
    maxBootSizeEU: row.maxBootSizeEU,
    maxBootSoleLengthCm: row.maxBootSoleLengthCm,
    ...(row.recommendedRiderWeightKg ? { recommendedRiderWeightKg: row.recommendedRiderWeightKg } : {}),
    ...(row.productPageRiderWeightKg ? { productPageRiderWeightKg: row.productPageRiderWeightKg } : {}),
    ...(row.sizeGuideRiderWeightKg ? { sizeGuideRiderWeightKg: row.sizeGuideRiderWeightKg } : {}),
    ...(row.recommendedRiderWeightRaw ? { recommendedRiderWeightRaw: row.recommendedRiderWeightRaw } : {}),
    maxRiderHeightCm: row.maxRiderHeightCm,
  }));
  const yaml = parse(readFileSync('../../data/snowboard/korua-shapes-cafe-racer-2026.yaml', 'utf8')) as {
    specs: { sizeSpecs: unknown[] };
  };

  assert.deepEqual(board.sizeSpecs, expected);
  assert.deepEqual(yaml.specs.sizeSpecs, expected);
  assert.equal(expected.length, 5);
  const size144 = expected.find((row) => row.size === '144');
  const size159 = expected.find((row) => row.size === '159');
  const size164 = expected.find((row) => row.size === '164');
  assert.equal(size144?.selectableOnCapturedProductPage, false);
  assert.deepEqual(size159?.productPageRiderWeightKg, [55, 85]);
  assert.deepEqual(size159?.sizeGuideRiderWeightKg, [55, 90]);
  assert.equal(size159?.recommendedRiderWeightKg, undefined);
  assert.deepEqual(size164?.maxBootSizeEU, { productPage: 49, sizeGuide: 48 });
});

test('prototype seed exports are not replaced by the generated catalog snapshot', () => {
  const processBoard = PROTOTYPE_GEAR.find((item) => item.id === 'sb-14');
  assert.ok(processBoard);

  assert.equal(processBoard.specs.effectiveEdge, 1215);
  assert.equal(processBoard.specs.core, 'Super Fly II 700G Core + Dualzone EGD');
  assert.equal(processBoard.specs.weight, undefined);
  assert.equal(processBoard.sizeSpecs?.length, 9);
});

test('GNU Rider’s Choice preserves every official standard and wide size row without relabeling contact length', () => {
  const board = PROTOTYPE_GEAR.find((item) => item.id === 'sb-12');
  assert.ok(board);

  const { sizeRows } = JSON.parse(readFileSync('../../data/raw/snowboard/gnu/riders-choice-2025-26.json', 'utf8')) as {
    sizeRows: Array<{
      size: string;
      widthVariant: string;
      contactLengthCm: number;
      sidecutRadiiM: number[];
      noseTailWidthCm: number[];
      waistWidthCm: number;
      stanceMinMaxInches: number[];
      setbackInches: number;
      stanceMinMaxCm: number[];
      brandFlex: number;
      riderWeightRaw: string;
    }>;
  };
  assert.deepEqual(board.sizeSpecs, sizeRows.map((row) => ({
    size: row.size,
    widthVariant: row.widthVariant,
    contactLengthCm: row.contactLengthCm,
    sidecutRadiiMSourceOrder: row.sidecutRadiiM.join(' / '),
    noseWidthCm: row.noseTailWidthCm[0],
    tailWidthCm: row.noseTailWidthCm[1],
    waistWidthMm: row.waistWidthCm * 10,
    stanceMinInches: row.stanceMinMaxInches[0],
    stanceMaxInches: row.stanceMinMaxInches[1],
    stanceSetbackInches: row.setbackInches,
    stanceMinCm: row.stanceMinMaxCm[0],
    stanceMaxCm: row.stanceMinMaxCm[1],
    brandFlex: row.brandFlex,
    riderWeightRaw: row.riderWeightRaw,
  })));

  assert.equal(board.sizeSpecs?.length, 8);
  const standard = board.sizeSpecs?.find((row) => row.size === '157.5');
  const wide = board.sizeSpecs?.find((row) => row.size === '155W');
  assert.equal(standard?.widthVariant, 'standard');
  assert.equal(standard?.contactLengthCm, 119);
  assert.equal(standard?.sidecutRadiiMSourceOrder, '7.8 / 8.2');
  assert.equal(standard?.waistWidthMm, 255);
  assert.equal(standard?.effectiveEdgeMm, undefined);
  assert.equal(wide?.widthVariant, 'wide');
  assert.equal(wide?.waistWidthMm, 265);
  assert.equal(wide?.noseWidthCm, 30.7);
});

test('RIDE Algorhythm keeps all retailer-verified 2026 size rows aligned across raw, prototype, and YAML', () => {
  const board = PROTOTYPE_GEAR.find((item) => item.id === 'sb-09');
  assert.ok(board);

  const raw = JSON.parse(readFileSync('../../data/raw/snowboard/ride/algorythm-2025-26.json', 'utf8')) as {
    sizeRows: Array<{
      size: string;
      effectiveEdgeMm: number;
      waistWidthMm: number;
      sidecutRadiiM: number[];
      stanceWidthIn: number;
      riderWeightLb: string;
      noseTailWidthMm?: number[];
      fusoReferenceStanceMm?: number;
    }>;
  };
  const expected = raw.sizeRows.map((row) => ({
    size: row.size,
    widthVariant: row.size.endsWith('W') ? 'wide' : 'standard',
    effectiveEdgeMm: row.effectiveEdgeMm,
    waistWidthMm: row.waistWidthMm,
    sidecutRadiiMSourceOrder: row.sidecutRadiiM.join(' / '),
    stanceWidthIn: row.stanceWidthIn,
    stanceSetbackInches: 0.75,
    riderWeightLbRaw: row.riderWeightLb,
    ...(row.noseTailWidthMm ? { noseWidthMm: row.noseTailWidthMm[0], tailWidthMm: row.noseTailWidthMm[1] } : {}),
    ...(row.fusoReferenceStanceMm ? { referenceStanceMm: row.fusoReferenceStanceMm } : {}),
  }));

  const yaml = parse(readFileSync('../../data/snowboard/ride-algorythm-2026.yaml', 'utf8')) as {
    specs: { sizeSpecs: unknown[] };
  };
  assert.deepEqual(board.sizeSpecs, expected);
  assert.deepEqual(yaml.specs.sizeSpecs, expected);
  assert.equal(expected.length, 8);
});

test('Lib Tech T.Rice Pro preserves all ten historical size rows without treating contact length as effective edge', () => {
  const board = PROTOTYPE_GEAR.find((item) => item.id === 'sb-05');
  assert.ok(board);

  const raw = JSON.parse(readFileSync('../../data/raw/snowboard/lib-tech/t-rice-pro-2024-25.json', 'utf8')) as {
    sizeRows: Array<{
      size: string;
      widthVariant: string;
      contactLengthCm: number;
      sidecutM: number;
      noseWaistTailCm: number[];
      stanceRangeInches: number[];
      stanceRangeCm: number[];
      setbackInches: number;
      brandFlexOutOf10: number;
      riderWeightRaw: string;
    }>;
  };
  const expected = raw.sizeRows.map((row) => ({
    size: row.size,
    widthVariant: row.widthVariant,
    contactLengthCm: row.contactLengthCm,
    sidecutRadiusM: row.sidecutM,
    noseWidthCm: row.noseWaistTailCm[0],
    waistWidthCm: row.noseWaistTailCm[1],
    tailWidthCm: row.noseWaistTailCm[2],
    stanceMinInches: row.stanceRangeInches[0],
    stanceMaxInches: row.stanceRangeInches[1],
    stanceMinCm: row.stanceRangeCm[0],
    stanceMaxCm: row.stanceRangeCm[1],
    setbackInches: row.setbackInches,
    brandFlexOutOf10: row.brandFlexOutOf10,
    riderWeightRaw: row.riderWeightRaw,
  }));
  const yaml = parse(readFileSync('../../data/snowboard/lib-tech-t-rice-pro-2025.yaml', 'utf8')) as {
    specs: { sizeSpecs: unknown[] };
  };

  assert.deepEqual(board.sizeSpecs, expected);
  assert.deepEqual(yaml.specs.sizeSpecs, expected);
  assert.equal(expected.length, 10);
  assert.equal(board.sizeSpecs?.every((row) => row.effectiveEdgeMm === undefined), true);
});

test('CAPiTA Dark Horse seed preserves all ten official 2027 size rows including the anomalous 160W weight range', () => {
  const raw = JSON.parse(readFileSync('../../data/raw/snowboard/capita/dark-horse-2026-27.json', 'utf8')) as {
    pricing: { japanOfficial?: { currency: string; amount: number; market: string; taxTreatment: string } };
    sizeRows: Array<{
      size: string;
      effectiveEdgeMm: number;
      waistWidthMm: number;
      noseTailWidthMm: number;
      taperMm: number;
      sidecutRadiusM: number;
      referenceStanceMm: number;
      recommendedRiderWeightLb: number[];
      recommendedRiderWeightKg: number[];
      suggestedBoot: string;
      sourceAnomaly?: string;
    }>;
  };
  const expected = raw.sizeRows.map((row) => ({
    size: row.size,
    widthVariant: row.size.endsWith('W') ? 'wide' : 'standard',
    effectiveEdgeMm: row.effectiveEdgeMm,
    waistWidthMm: row.waistWidthMm,
    noseWidthMm: row.noseTailWidthMm,
    tailWidthMm: row.noseTailWidthMm,
    taperMm: row.taperMm,
    sidecutRadiusM: row.sidecutRadiusM,
    referenceStanceMm: row.referenceStanceMm,
    recommendedRiderWeightLb: row.recommendedRiderWeightLb,
    recommendedRiderWeightKg: row.recommendedRiderWeightKg,
    suggestedBoot: row.suggestedBoot,
    ...(row.sourceAnomaly ? { sourceAnomaly: row.sourceAnomaly } : {}),
  }));
  const yaml = parse(readFileSync('../../data/snowboard/capita-dark-horse-2027.yaml', 'utf8')) as {
    specs: { sizeSpecs?: unknown[] };
    price: { currency: string; min: number };
  };

  assert.deepEqual(yaml.specs.sizeSpecs, expected);
  assert.equal(expected.length, 10);
  assert.match(String((expected.at(-1) as { sourceAnomaly?: string }).sourceAnomaly), /preserved verbatim/i);
  assert.ok(raw.pricing.japanOfficial);
  assert.deepEqual({
    currency: raw.pricing.japanOfficial.currency,
    amount: raw.pricing.japanOfficial.amount,
    market: raw.pricing.japanOfficial.market,
    taxTreatment: raw.pricing.japanOfficial.taxTreatment,
  }, {
    currency: 'JPY',
    amount: 77000,
    market: 'Japan',
    taxTreatment: 'not specified in retrieved official page text',
  });
  assert.equal(yaml.price.currency, 'CNY');
  assert.equal(yaml.price.min, 3600);
});
