import { resolveImageUrl } from "../lib/image-url";

function heroImageSet(small: string, large: string) {
  return `${resolveImageUrl(small)} 768w, ${resolveImageUrl(large)} 1280w`;
}

// 视觉素材（CDN；开发环境通过本地代理加载，避免浏览器直连大图不稳定）
export const IMG = {
  baseA:
    resolveImageUrl(
      "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-01.png?auth_key=198d5c0a736869dbd54569f1ba879402ad9fafe539977daea5bc12b6fe7d8555",
    ),
  baseB:
    resolveImageUrl(
      "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-04.png?auth_key=436f2cbe34d74f4d6251d5d048fd58f79d7dede41ad4a67ce40f832f82c271c1",
    ),
  baseC:
    resolveImageUrl(
      "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-05.png?auth_key=d19349b34e1ca6e8a758c412fbd39c8aa78fb6d7c949d8ad1c6cd1379f6324f1",
    ),
  baseD:
    resolveImageUrl(
      "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-06.png?auth_key=12936507cc57135902558c86b8e8de33d959f7af4b93ac4078e9012b69c426e0",
    ),
  topA: resolveImageUrl(
    "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-top-03.png?auth_key=a00efee7b4a7f0aabc2a4367bff4c09fbdfa60482503d839065526be7159832e",
  ),
  topB: resolveImageUrl(
    "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-top-04.png?auth_key=9422efddcabccc3c280740582ddb53deab5ba32809dec2d2dcc8bc867f8a8497",
  ),
  binding:
    resolveImageUrl(
      "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-detail-binding.png?auth_key=b65df2b86b31534b53b605d6ae3c12bd3061d495618139b5d7bb821526f17890",
    ),
  riderCarve:
    resolveImageUrl(
      "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/rider-carve.png?auth_key=8f03132146310e5dc68c640fdc85ade30f12ee170b9a62e3e2cc06c2a07d2bf8",
    ),
  riderPowder:
    resolveImageUrl(
      "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/rider-powder.png?auth_key=bb4c509a661d64e1e86a68cefb9758a24f192e26d4065224e061fa128bdb66a6",
    ),
} as const;

/** 首页雪场主图池：本地优化图片，避免依赖外部站点加载。 */
export const HERO_IMAGE_POOL = [
  {
    src: resolveImageUrl("/hero/ridge-1440.webp"),
    srcSet: `${resolveImageUrl("/hero/ridge-768.webp")} 768w, ${resolveImageUrl("/hero/ridge-1440.webp")} 1440w`,
    alt: "雪山山脊与滑雪场原创插画",
    credit: "有谱原创视觉",
    sourcePage: undefined,
  },
  {
    src: resolveImageUrl("/hero/jiangjunshan-1280.webp"),
    srcSet: heroImageSet("/hero/jiangjunshan-768.webp", "/hero/jiangjunshan-1280.webp"),
    alt: "阿勒泰将军山滑雪场远景",
    credit: "Pazakui · CC BY 4.0 · 已裁切",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg",
  },
  {
    src: resolveImageUrl("/hero/altay-picture3-1280.webp"),
    srcSet: heroImageSet("/hero/altay-picture3-768.webp", "/hero/altay-picture3-1280.webp"),
    alt: "新疆阿勒泰地区冬季雪景",
    credit: "Huangdan2060 · CC BY 3.0 · 已裁切",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Snow_Scenery_in_Altay_Prefecture,_Xinjiang,_China,_picture3.jpg",
  },
  {
    src: resolveImageUrl("/hero/hemu-picture10-1280.webp"),
    srcSet: heroImageSet("/hero/hemu-picture10-768.webp", "/hero/hemu-picture10-1280.webp"),
    alt: "新疆布尔津禾木乡冬季雪景",
    credit: "Huangdan2060 · CC BY 3.0 · 已裁切",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Snow_Scenery_in_Altay_Prefecture,_Xinjiang,_China,_picture10.jpg",
  },
  {
    src: resolveImageUrl("/hero/altay-picture1-1280.webp"),
    srcSet: heroImageSet("/hero/altay-picture1-768.webp", "/hero/altay-picture1-1280.webp"),
    alt: "新疆阿勒泰地区冬季山景",
    credit: "Huangdan2060 · CC BY 3.0 · 已裁切",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Snow_Scenery_in_Altay_Prefecture,_Xinjiang,_China,_picture1.jpg",
  },
] as const;

/** 底面主视觉轮换池：详情页图集第一张固定用底面 */
export const BASE_POOL = [IMG.baseA, IMG.baseB, IMG.baseC, IMG.baseD];
export const TOP_POOL = [IMG.topA, IMG.topB];
export const DETAIL_POOL = [IMG.binding, IMG.baseA];
export const UGC_POOL = [IMG.riderCarve, IMG.riderPowder];
