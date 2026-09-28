import { resolveImageUrl } from "../lib/image-url";

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
  heroRidge:
    resolveImageUrl(
      "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/hero-ridge.png?auth_key=12382ced0bf2c0dc18c0c11c5e75b977d3b2310f18cb69254a0695446681db65",
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

/**
 * 首页雪场图池。新增照片通过图片代理按来源页精确放行；外部来源图片仍遵从来源站点的使用条款。
 * Images: KKday、Klook、吉林网、澎湃新闻、新疆美、携程。
 */
export const HERO_IMAGE_POOL = [
  { src: IMG.heroRidge, alt: "雪山山脊与滑雪场" },
  {
    src: resolveImageUrl(
      "https://image.kkday.com/v2/image/get/c_fill%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_543360/20251105082804_Pb8z8/jpg",
    ),
    alt: "崇礼万龙雪场雪道",
    sourcePage: "https://www.kkday.com/zh-cn/product/543360",
  },
  {
    src: resolveImageUrl(
      "https://res.klook.com/images/fl_lossy.progressive%2Cq_65/c_fill%2Cw_1295%2Ch_863/w_80%2Cx_15%2Cy_15%2Cg_south_west%2Cl_Klook_water_br_trans_yhcmh3/activities/iz92uiuyz23pb78arumb/High-speedtrainstationpick-upanddrop-offbetweenZhangjiakouStationChongliStationandWanlongSkiResort.jpg",
    ),
    alt: "崇礼雪场缆车与雪道",
    sourcePage: "https://www.klook.com/en-GB/activity/184047-high-speed-rail-station-to-wanlong-ski-resort/",
  },
  {
    src: resolveImageUrl("https://news.cnjiwang.com/jwyc/202312/W020231223357959480031.JPG"),
    alt: "可可托海雪场雪道与山景",
    sourcePage: "https://news.cnjiwang.com/jwyc/202312/3805307.html",
  },
  {
    src: resolveImageUrl("https://imagepphcloud.thepaper.cn/pph/image/324/885/471.jpg"),
    alt: "可可托海雪场冬季景色",
    sourcePage: "https://www.thepaper.cn/newsDetail_forward_28945137",
  },
  {
    src: resolveImageUrl(
      "https://www.xinjiangmei.com/wp-content/uploads/2024/06/Untitled-design-1-1536x1024.jpg",
    ),
    alt: "阿勒泰将军山滑雪场",
    sourcePage: "https://www.xinjiangmei.com/将军山滑雪场/",
  },
  {
    src: resolveImageUrl(
      "https://dimg04.c-ctrip.com/images/1lo6z12000blg7cheD1B6_C_900_504_Q90_Mtg_7.jpg",
    ),
    alt: "将军山滑雪场夜间雪道",
    sourcePage: "https://jingdian.juyoufuli.com/app/scenics/56839",
  },
] as const;

/** 底面主视觉轮换池：详情页图集第一张固定用底面 */
export const BASE_POOL = [IMG.baseA, IMG.baseB, IMG.baseC, IMG.baseD];
export const TOP_POOL = [IMG.topA, IMG.topB];
export const DETAIL_POOL = [IMG.binding, IMG.baseA];
export const UGC_POOL = [IMG.riderCarve, IMG.riderPowder];
