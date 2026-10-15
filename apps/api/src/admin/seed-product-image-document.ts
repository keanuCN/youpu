import { parseDocument } from 'yaml';
import { productSeedSchema } from '@youpu/schema';

/** 只替换已验证的图片 URL；保留来源说明、评论、价格和规格等种子信息。 */
export function rewriteSeedImageUrls(original: string, replacements: ReadonlyMap<string, string>): string {
  const document = parseDocument(original);
  const seed = productSeedSchema.parse(document.toJS());
  let changed = false;
  seed.images.forEach((image, index) => {
    const target = replacements.get(image.url);
    if (!target || target === image.url) return;
    if (!/^https:\/\/youpu\.tos-cn-beijing\.volces\.com\/product-images\/mirror\/[a-f0-9]{64}\.webp$/.test(target)) {
      throw new Error('替换地址必须是项目 TOS 内容哈希图片');
    }
    document.setIn(['images', index, 'url'], target);
    changed = true;
  });
  if (!changed) return original;
  const result = document.toString({ lineWidth: 0 });
  productSeedSchema.parse(parseDocument(result).toJS());
  return result;
}
