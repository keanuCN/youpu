import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const salomonSkiingApparelAdapter = {
  name: 'skiing-apparel/salomon',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'skiing-apparel' && target.brand === 'salomon';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = [
      snapshot.title,
      snapshot.description,
      snapshot.bodyText,
      ...snapshot.headings,
      ...snapshot.specifications.flatMap(({ label, value }) => [label, value]),
      ...snapshot.tables.flatMap((table) => [...table.headers, ...table.rows.flat()]),
    ]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    const searchable = `${target.model} ${snapshot.title ?? ''} ${snapshot.headings.join(' ')}`;
    const normalizedSpecs: Record<string, unknown> = {};

    if (/\bbib\b/i.test(searchable)) normalizedSpecs.garmentType = 'bib-pants';
    else if (/\b(?:pants|trousers)\b/i.test(searchable)) normalizedSpecs.garmentType = 'pants';
    else if (/\b(?:jacket|anorak)\b/i.test(searchable)) normalizedSpecs.garmentType = 'jacket';

    const construction = evidence.match(/\b([23])\s*[- ]?layer\b|\b([23])\s*L\b/i);
    const constructionValue = construction?.[1] ?? construction?.[2];
    if (constructionValue) normalizedSpecs.construction = `${constructionValue}L`;

    setNumber(normalizedSpecs, 'waterproofMm', evidence, /Waterproofing\s*([\d,]+)\s*mm/i);
    setNumber(
      normalizedSpecs,
      'breathabilityG',
      evidence,
      /(?:Moisture Vapour Transmission Resistance\s*|\bBreathability\s*)([\d,]+)\s*g\s*\/\s*m²/i,
    );
    const waterproofAndBreathability = evidence.match(/\b(\d{2})K\s*\/\s*(\d{2})K\s+waterproof protection\b/i);
    if (waterproofAndBreathability) {
      normalizedSpecs.waterproofMm ??= Number(waterproofAndBreathability[1]) * 1_000;
      normalizedSpecs.breathabilityG ??= Number(waterproofAndBreathability[2]) * 1_000;
    }

    if (/Typology\s*Shell/i.test(evidence)) normalizedSpecs.insulation = 'shell';
    else {
      const insulationName = evidence.match(/Insulation\s*((?:PrimaLoft|HeiQ)[^.!?]{0,160}?)(?=Weight per unit)/i)?.[1];
      const insulationGrams = evidence.match(/\b(\d+)\s*g\s+insulation\b/i)?.[1];
      if (insulationName) {
        normalizedSpecs.insulation = `${insulationName.trim()}${insulationGrams ? ` ${insulationGrams}g` : ''}`;
      } else if (insulationGrams) {
        normalizedSpecs.insulation = `${insulationGrams}g`;
      }
    }

    const fit = evidence.match(/\bFit\s*(regular|relaxed|slim|baggy)/i) ?? evidence.match(/\b(regular|relaxed|slim|baggy)\s+fit\b/i);
    if (fit?.[1]) normalizedSpecs.fit = fit[1].toLowerCase();

    if (/\bfully taped seams\b/i.test(evidence)) normalizedSpecs.seamTaping = 'fully-taped';
    else if (/\bcritically taped seams\b/i.test(evidence)) normalizedSpecs.seamTaping = 'critically-taped';

    if (/\b(?:pit zips?|vents?|venting)\b/i.test(evidence)) normalizedSpecs.venting = true;
    if (/\bpowder skirt\b/i.test(evidence)) normalizedSpecs.powderSkirt = true;

    return {
      normalizedSpecs,
      sourceNotes: [
        '仅提取 Salomon 官方商品页明确公布的参数；未根据产品系列补猜缺失数值。',
        '官方页面价格使用美元，未录入商品人民币价格字段。',
      ],
    };
  },
};

function setNumber(target: Record<string, unknown>, key: string, text: string, pattern: RegExp): void {
  const match = text.match(pattern);
  if (match?.[1]) target[key] = Number(match[1].replace(/,/g, ''));
}
