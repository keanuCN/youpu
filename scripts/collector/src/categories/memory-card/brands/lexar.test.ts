import assert from 'node:assert/strict';
import test from 'node:test';
import { lexarMemoryCardAdapter } from './lexar';
import type { CrawlTarget, PageSnapshot } from '../../../engine/types';

const target: CrawlTarget = {
  slug: 'lexar-professional-1066x-sd-silver-2026',
  category: 'memory-card',
  brand: 'lexar',
  model: 'Professional 1066x SDXC UHS-I SILVER',
  year: 2026,
  url: 'https://www.lexar.com/zh-hans/products/Lexar-Professional-1066x-SDXC-UHS-I-Card-SILVER-Series/',
  mode: 'cheerio',
};

test('extracts Lexar SD card facts and keeps capacity-dependent write speeds', () => {
  const snapshot: PageSnapshot = {
    title: 'Lexar Professional 1066x SDXC UHS-I 存储卡SILVER系列 | Lexar雷克沙',
    description: '读取速度高达160MB/s，写入速度高达120MB/s',
    bodyText: 'SDXC UHS-I 存储卡，支持全高清和4K超高清视频，抗冲击、抗震和防X射线。容量高达1TB。',
    headings: [],
    jsonLd: [
      {
        '@type': 'Product',
        description:
          '速度: 128GB-1TB – 读取速度高达160MB/s，写入速度高达120MB/s<br>64GB – 读取速度高达160MB/s，写入速度高达70MB/s; 工作温度: -25°C to 85°C; 存放温度: -40°C to 85°C; 尺寸（长x宽x高）: 32 mm x 24 mm x 2.1 mm; 质保期: 10年有限质保; 性能等级: 1TB - Class 10, U3, V30<br>512GB – Class 10, U3, V30;',
      },
    ],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };

  const result = lexarMemoryCardAdapter.normalize(target, snapshot);
  assert.equal(result.normalizedSpecs.cardType, 'SDXC');
  assert.equal(result.normalizedSpecs.interface, 'UHS-I');
  assert.equal(result.normalizedSpecs.readSpeed, 160);
  assert.equal(result.normalizedSpecs.writeSpeedByCapacity, '128GB–1TB：120 MB/s；64GB：70 MB/s');
  assert.equal(result.normalizedSpecs.performanceClass, '1TB - Class 10, U3, V30');
  assert.equal(result.normalizedSpecs.videoSupport, '全高清 / 4K 超高清视频');
  assert.equal(result.normalizedSpecs.durability, '抗冲击、抗震、防 X 射线');
  assert.equal(result.normalizedSpecs.warranty, '10年有限质保');
});
