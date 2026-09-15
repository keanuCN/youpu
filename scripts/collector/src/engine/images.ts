import type { ProductSeed } from '@youpu/schema';

/**
 * 采集阶段只记录公开页面图片引用，不自动下载或声明可商用。
 * 进入正式 seed 前仍需人工核实授权，并替换为 COS/自制图地址。
 */
export function imageReferences(urls: string[]): ProductSeed['images'] {
  return urls.map((url, index) => ({
    url,
    kind: index === 0 ? 'base' : 'side',
    source: '品牌公开页面；图片授权待人工核实',
    sort_order: index,
  }));
}
