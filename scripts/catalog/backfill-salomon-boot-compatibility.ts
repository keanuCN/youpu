import fs from 'node:fs';
import path from 'node:path';

const filesExpected = [
  'salomon-dialogue-dual-boa-2027.yaml',
  'salomon-dialogue-dual-boa-team-2027.yaml',
  'salomon-dialogue-dual-boa-wide-2027.yaml',
  'salomon-echo-dual-boa-2027.yaml',
  'salomon-faction-boa-2027.yaml',
  'salomon-launch-boa-sj-boa-2027.yaml',
  'salomon-malamute-dual-boa-2027.yaml',
  'salomon-titan-boa-2027.yaml',
  'salomon-trek-2027.yaml',
  'salomon-x-approach-lace-sj-boa-2027.yaml',
];

const root = path.resolve(import.meta.dirname, '../..');
const dataDir = path.join(root, 'data/snowboard-boot');
const files = fs.readdirSync(dataDir).filter((file) => file.startsWith('salomon-') && file.endsWith('.yaml')).sort();
if (JSON.stringify(files) !== JSON.stringify(filesExpected)) throw new Error(`Salomon 雪鞋清单不匹配：${files.join(', ')}`);

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (/^  bindingCompatibility:/m.test(content)) throw new Error(`${file} 已有固定器兼容属性，拒绝覆盖`);
  if (!/^  lacingSystem:/m.test(content)) throw new Error(`${file} 缺少 lacingSystem`);
  content = content.replace(
    /^(  lacingSystem: [^\n]+)$/m,
    '$1\n  bindingCompatibility: "传统绑带式固定器；按雪鞋尺码核对固定器尺码"',
  );
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log(`已为 ${files.length} 款 Salomon 单板雪鞋补充传统绑带固定器兼容属性。`);
