import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = path.resolve(import.meta.dirname, '../..');
const categories = ['snowboard', 'snowboard-binding', 'snowboard-boot', 'skis', 'skiing-apparel'];
const products: Array<{ category: string; file: string; data: Record<string, any> }> = [];
for (const category of categories) {
  const dir = path.join(root, 'data', category);
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.yaml'))) {
    const data = YAML.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as Record<string, any>;
    if (data.status === 'published' && (!Number.isFinite(data.price?.min) || !Number.isFinite(data.price?.max))) {
      products.push({ category, file, data });
    }
  }
}

const money = /(?:USD|CAD|EUR|GBP|JPY|CNY|US\$|CA\$|C\$|AU\$|NZ\$|€|£|¥|\$)\s?\d[\d,.]*/g;
const htmlText = (html: string) => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&yen;|&#165;/gi, '¥')
  .replace(/&pound;|&#163;/gi, '£')
  .replace(/&euro;|&#8364;/gi, '€')
  .replace(/&amp;/gi, '&')
  .replace(/\s+/g, ' ');

let cursor = 0;
const workers = Array.from({ length: 8 }, async () => {
  while (true) {
    const index = cursor++;
    if (index >= products.length) return;
    const { category, file, data } = products[index];
    const url = data.data_source?.origin_url;
    if (!url) { console.log(JSON.stringify({ category, file, error: 'no origin_url' })); continue; }
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; YoupuCatalogResearch/1.0)' },
      });
      const html = await response.text();
      const text = htmlText(html);
      const currency = html.match(/(?:priceCurrency|currency)["'\s:=]+([A-Z]{3})/i)?.[1]?.toUpperCase()
        ?? html.match(/"currencyCode"\s*:\s*"([A-Z]{3})"/)?.[1];
      const amounts = [...new Set((text.match(money) ?? []).slice(0, 24))];
      const exact = html.match(/"price"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i)?.[1]
        ?? html.match(/<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([\d.]+)["']/i)?.[1];
      console.log(JSON.stringify({ category, file, model: data.model, year: data.year, status: response.status, currency, exact, amounts, source: url }));
    } catch (error) {
      console.log(JSON.stringify({ category, file, model: data.model, source: url, error: String(error) }));
    }
  }
});
void Promise.all(workers);
