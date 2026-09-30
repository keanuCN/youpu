import fs from 'node:fs';
import path from 'node:path';

// Editorial estimates from each record's stated shape, profile, flex, and use case.
// Value is neutral until comparable domestic CNY prices are verified.
const scores: Record<string, [number, number, number, number, number, number]> = {
  'bc-stream-r2-2026.yaml': [9, 9, 7, 5, 5, 5],
  'bc-stream-riders-spec-dr-2027.yaml': [9, 9, 9, 5, 5, 5],
  'bc-stream-rx-2027.yaml': [9.5, 10, 5, 4, 4, 5],
  'burton-good-company-2027.yaml': [6, 7, 5, 9, 8, 5],
  'burton-process-flying-v-2027.yaml': [7, 7, 7.5, 8, 8, 5],
  'burton-talent-scout-2027.yaml': [7, 8, 5, 9, 7.5, 5],
  'capita-birds-of-a-feather-2027.yaml': [7.5, 8, 7, 8.5, 7, 5],
  'decathlon-all-road-900-2026.yaml': [8.5, 8, 8, 4.5, 5, 5],
  'decathlon-park-ride-500-2026.yaml': [7, 7.5, 7, 8, 7.5, 5],
  'decathlon-snb-100-2026.yaml': [5, 4.5, 6, 5, 9, 5],
  'gray-despe-wood-2027.yaml': [8, 8, 5, 4, 6, 5],
  'gray-desperado-2024.yaml': [5, 5, 4, 3, 8, 5],
  'gray-desperado-ti-type-r-2027.yaml': [10, 10, 5, 3, 3, 5],
  'gray-dsprd-ti-iz-2027.yaml': [9.5, 9.5, 5, 3, 4, 5],
  'gray-dsprd-ti-type-x-ver-s-2027.yaml': [10, 10, 4, 2, 2.5, 5],
  'gray-epic-2027.yaml': [8, 8, 5, 9, 6.5, 5],
  'gray-lovebuzz-58-2027.yaml': [8.5, 8, 8.5, 4, 5.5, 5],
  'gray-prodigy-2027.yaml': [9, 9, 5, 8, 5.5, 5],
  'gray-sonicalmach-lt-2027.yaml': [7, 7, 5, 8, 8, 5],
  'gray-sonicalmach-lt-ver-c-2027.yaml': [7.5, 8, 5, 8, 7, 5],
  'gray-tycoon-type-s-iz-2027.yaml': [10, 10, 4, 2, 2, 5],
  'jones-dream-weaver-2-0-2027.yaml': [8, 7.5, 9, 6, 7, 5],
  'jones-twin-sister-2027.yaml': [8, 8, 7.5, 7.5, 7, 5],
  'k2-alchemist-2027.yaml': [10, 9.5, 7, 3, 3, 5],
  'k2-excavator-2027.yaml': [8.5, 8, 9, 4, 6, 5],
  'k2-passport-2027.yaml': [8, 8, 8, 5, 6, 5],
  'never-summer-proto-t3-fr-2027.yaml': [9, 9, 8, 5, 5, 5],
  'nitro-alternator-2027.yaml': [8.5, 8.5, 7.5, 7, 5.5, 5],
  'nitro-beast-2026.yaml': [8, 9, 5, 9.5, 4.5, 5],
  'nitro-optisym-2027.yaml': [7, 7.5, 5, 9, 8, 5],
  'nitro-t1-2027.yaml': [8, 8, 4.5, 9, 6, 5],
  'ogasaka-ct-2026.yaml': [8, 8, 5.5, 5, 7, 5],
  'ogasaka-fc-2026.yaml': [9.5, 9, 5, 3, 4, 5],
  'ogasaka-fc-s-2026.yaml': [10, 10, 4, 2, 2.5, 5],
  'ogasaka-shin-2026.yaml': [8.5, 8, 8.5, 4, 5.5, 5],
  'salomon-abstract-2027.yaml': [7.5, 8, 5, 9, 7.5, 5],
  'salomon-assassin-2026.yaml': [8, 8, 7.5, 7.5, 7, 5],
  'salomon-assassin-pro-2027.yaml': [8.5, 9, 7.5, 7.5, 5.5, 5],
  'salomon-huck-knife-2027.yaml': [8, 9, 4.5, 9.5, 5.5, 5],
};

const root = path.resolve(import.meta.dirname, '../..');
const dataDir = path.join(root, 'data/snowboard');
const files = fs.readdirSync(dataDir).filter((name) => name.endsWith('.yaml')).sort();
const targets = files.filter((name) => name in scores);
const missing = Object.keys(scores).filter((name) => !files.includes(name));
if (targets.length !== Object.keys(scores).length || missing.length || files.length !== 79) {
  throw new Error(`单板数据清单不匹配：实际 ${files.length}，待补 ${targets.length}，目标缺失 ${missing.join(', ')}`);
}

for (const file of targets) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (/^editorial_scores:/m.test(content)) throw new Error(`${file} 已有评分，拒绝覆盖`);
  const [stability, response, float, park, forgiveness, value] = scores[file]!;
  const block = [
    'editorial_scores:',
    `  stability: ${stability}`,
    `  response: ${response}`,
    `  float: ${float}`,
    `  park: ${park}`,
    `  forgiveness: ${forgiveness}`,
    `  value: ${value}`,
    '',
  ].join('\n');
  if (!/^data_source:/m.test(content)) throw new Error(`${file} 缺少 data_source 插入锚点`);
  content = content.replace(/^data_source:/m, `${block}data_source:`);
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log(`已为 ${targets.length} 款单板补齐六项编辑评分。`);
