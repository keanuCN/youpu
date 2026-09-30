import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = path.resolve(import.meta.dirname, '../..');
const categoryFile = YAML.parse(fs.readFileSync(path.join(root, 'data/categories.yaml'), 'utf8')) as Array<Record<string, any>>;
const categories = ['snowboard', 'snowboard-binding', 'snowboard-boot', 'skis', 'skiing-apparel'];
const missingPricesOnly = process.argv.includes('--missing-prices');

for (const slug of categories) {
  const category = categoryFile.find((item) => item.slug === slug);
  const files = fs.readdirSync(path.join(root, 'data', slug)).filter((file) => file.endsWith('.yaml'));
  const records = files.map((file) => ({
    file,
    data: YAML.parse(fs.readFileSync(path.join(root, 'data', slug, file), 'utf8')) as Record<string, any>,
  }));
  const published = records.filter(({ data }) => data.status === 'published');
  const fields = category?.spec_schema?.fields?.map((field: { key: string }) => field.key) ?? [];
  const coverage = fields.map((key: string) => {
    const complete = published.filter(({ data }) => data.specs?.[key] !== undefined && data.specs?.[key] !== null && data.specs?.[key] !== '').length;
    return `${key}=${complete}/${published.length}`;
  });
  const missingImages = published.filter(({ data }) => !data.images?.some((image: { url?: string }) => image.url)).map(({ file }) => file);
  const missingPrice = published.filter(({ data }) => !Number.isFinite(data.price?.min) || !Number.isFinite(data.price?.max)).length;
  const missingScores = category?.rating_dimensions?.length
    ? published.filter(({ data }) => category.rating_dimensions.some((dimension: { key: string }) => !Number.isFinite(data.editorial_scores?.[dimension.key]))).length
    : 0;

  console.log(`\n[${slug}] ${published.length}/${records.length} published; without price ${missingPrice}; without complete editorial scores ${missingScores}; missing image ${missingImages.length}`);
  console.log(coverage.join('  '));
  if (missingImages.length) console.log(`missingImageFiles=${missingImages.join(',')}`);
  if (missingPricesOnly) {
    for (const { file, data } of published.filter(({ data }) => !Number.isFinite(data.price?.min) || !Number.isFinite(data.price?.max))) {
      console.log(JSON.stringify({ category: slug, file, slug: data.slug, brand: data.brand, model: data.model, year: data.year, origin_url: data.data_source?.origin_url }));
    }
  }
}
