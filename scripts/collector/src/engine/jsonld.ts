import { load, type CheerioAPI } from 'cheerio';
import type { PageSnapshot, PageSpecification, PageTable } from './types';

export function snapshotFromHtml(html: string, baseUrl: string): PageSnapshot {
  const $ = load(html);
  const jsonLd: unknown[] = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    const content = $(element).text().trim();
    if (!content) return;
    try {
      const value: unknown = JSON.parse(content);
      if (Array.isArray(value)) jsonLd.push(...value);
      else jsonLd.push(value);
    } catch {
      // 单个 JSON-LD 损坏不应吞掉同页其他可解析内容。
    }
  });

  return {
    title: optionalText($('title').first().text()),
    description: optionalText($('meta[name="description"]').attr('content')),
    canonicalUrl: absoluteUrl($('link[rel="canonical"]').attr('href'), baseUrl),
    headings: $('h1, h2, h3')
      .map((_, element) => normalizeText($(element).text()))
      .get()
      .filter(Boolean),
    jsonLd,
    tables: [...extractTables($), ...extractVariantTables($)],
    specifications: extractSpecifications($),
    images: extractImageUrls($, baseUrl),
    imageAltTexts: extractImageAltTexts($),
  };
}

/**
 * 公开商品页常用 b/i 或 label/value 列表表达规格，不一定使用 table。
 * 这里只保存结构化的标签和值；字段含义与单位归一仍交给品类 adapter。
 */
function extractSpecifications($: CheerioAPI): PageSpecification[] {
  const specifications: PageSpecification[] = [];
  $('li').each((_, element) => {
    const label = normalizeText($(element).find('b').first().text()).replace(/:$/, '').trim();
    const value = normalizeText($(element).find('i').first().text());
    if (!label || !value || label.length > 120 || value.length > 500) return;
    specifications.push({ label, value });
  });
  return specifications;
}

/**
 * 部分 Shopify 品牌把尺寸规格放在 div 组件中，而不是 HTML table。
 * 这里将 CAPiTA 这类公开的 variant spec 组件转换成同一 PageTable 结构，
 * 让品牌 adapter 继续只处理字段和单位，不直接依赖页面 DOM。
 */
function extractVariantTables($: CheerioAPI): PageTable[] {
  const tables: PageTable[] = [];
  $('.size-chart-new__variants-specs').each((_, container) => {
    const variants = $(container).find('.variant-specs[data-variant-name]').toArray();
    if (variants.length === 0) return;

    const sizes = variants
      .map((variant) => normalizeText($(variant).attr('data-variant-name')))
      .filter(Boolean);
    const labels: string[] = [];
    const valuesBySize = variants.map((variant) => {
      const values = new Map<string, string>();
      $(variant)
        .find('.variant-specs__row')
        .each((__, row) => {
          const cells = $(row)
            .find('span')
            .toArray()
            .map((cell) => normalizeText($(cell).text()));
          const label = cells[0];
          if (!label || cells[1] === undefined) return;
          if (!labels.includes(label)) labels.push(label);
          values.set(label, cells[1]);
        });
      return values;
    });

    if (sizes.length === 0 || labels.length === 0) return;
    tables.push({
      caption: 'variant specs',
      headers: ['Board size (cm)', ...sizes],
      rows: labels.map((label) => [label, ...valuesBySize.map((values) => values.get(label) ?? '')]),
    });
  });
  return tables;
}

function extractTables($: CheerioAPI): PageTable[] {
  return $('table')
    .toArray()
    .map((table): PageTable | undefined => {
      const caption = optionalText($(table).find('caption').first().text());
      const rows = $(table)
        .find('tr')
        .toArray()
        .map((row): string[] =>
          $(row)
            .find('th, td')
            .toArray()
            .map((cell) => normalizeText($(cell).text())),
        )
        .filter((row) => row.length > 0);
      if (rows.length === 0) return undefined;

      const headerRow = $(table).find('thead tr').first();
      const headers =
        headerRow.length > 0
          ? headerRow
              .find('th, td')
              .toArray()
              .map((cell) => normalizeText($(cell).text()))
          : [...(rows[0] ?? [])];
      return { caption, headers, rows: rows.slice(1) };
    })
    .filter((table): table is PageTable => table !== undefined);
}

function extractImageUrls($: CheerioAPI, baseUrl: string): string[] {
  const urls = new Set<string>();
  $('img, source').each((_, element) => {
    const source = $(element).attr('src') ?? $(element).attr('data-src') ?? $(element).attr('srcset');
    const first = source?.split(',')[0]?.trim().split(/\s+/)[0];
    const absolute = absoluteUrl(first, baseUrl);
    if (absolute) urls.add(absolute);
  });
  return [...urls];
}

function extractImageAltTexts($: CheerioAPI): string[] {
  const values = new Set<string>();
  $('img').each((_, element) => {
    const alt = optionalText($(element).attr('alt'));
    if (alt) values.add(alt);
  });
  return [...values];
}

function normalizeText(value: string | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = normalizeText(value);
  return normalized || undefined;
}

function absoluteUrl(value: string | undefined, baseUrl: string): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return undefined;
  }
}
