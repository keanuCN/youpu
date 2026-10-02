/**
 * 云端目录快照。
 *
 * 由 apps/web/scripts/export-catalog-snapshot.ts 自动生成，请勿手工编辑。
 * 快照只保存公开目录接口返回的事实字段；编辑分析、评分分布等内容继续由本地内容包维护。
 */
export interface CatalogSnapshotItem {
  id: string;
  slug: string;
  title: string;
  model: string;
  year: number;
  oneLiner: string | null;
  priceMin: number | null;
  priceMax: number | null;
  priceCurrency: "CNY";
  coverUrl: string | null;
  ratingOverall: number | null;
  ratingCount: number;
  favoriteCount: number;
  composite: number | null;
  brand: { slug: string; name: string; nameCn?: string | null };
  categorySlug: string;
  specs: Record<string, unknown>;
  highlights: Array<{ key: string; label: string; value: string }>;
}

export interface CatalogSnapshotMeta {
  source: string;
  generatedAt: string;
  total: number;
  pageSize: number;
  categorySlugs: string[];
}

export const CATALOG_SNAPSHOT_META: CatalogSnapshotMeta = {
  "source": "https://xiaopang.club",
  "generatedAt": "2026-10-02T05:13:49.524Z",
  "total": 285,
  "pageSize": 48,
  "categorySlugs": [
    "action-cam",
    "badminton-racket",
    "bike-computer",
    "camera",
    "casting-rod",
    "drone",
    "esports-keyboard",
    "filter",
    "gimbal",
    "grinder",
    "lens",
    "memory-card",
    "microphone",
    "mtb",
    "road-bike",
    "skiing-apparel",
    "skis",
    "snowboard",
    "snowboard-binding",
    "snowboard-boot",
    "sports-watch",
    "tripod",
    "video-camera",
    "video-light"
  ]
};

export const CATALOG_SNAPSHOT: readonly CatalogSnapshotItem[] = [
  {
    "id": "01a0be38-191a-7c50-9bb6-2e544f85de83",
    "slug": "dji-osmo-action-4-2023",
    "title": "DJI Osmo Action 4",
    "model": "Osmo Action 4",
    "year": 2023,
    "oneLiner": "大底、4K 高帧率和成熟防抖组合，适合作为预算友好的第一台户外运动相机。",
    "priceMin": 1721,
    "priceMax": 1721,
    "priceCurrency": "CNY",
    "coverUrl": "https://se-cdn.djiits.com/tpc/uploads/spu/cover/e1b8110f65a5a3321fe487f0a1a061ac@ultra.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 84.3,
    "brand": {
      "slug": "dji",
      "name": "DJI",
      "nameCn": "大疆"
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.3 英寸 CMOS",
      "maxVideo": "4K@120fps",
      "maxFrameRate": 120,
      "stabilization": "RockSteady 3.0 / 360° HorizonSteady",
      "waterproofDepth": 18,
      "weight": 145,
      "batteryLife": 160,
      "screen": "双触控屏",
      "storage": "microSD",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "diving",
        "travel"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "120fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "18m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "145g"
      }
    ]
  },
  {
    "id": "01a0be38-193f-782c-9988-2dc78445601c",
    "slug": "dji-osmo-action-5-pro-2024",
    "title": "DJI Osmo Action 5 Pro",
    "model": "Osmo Action 5 Pro",
    "year": 2024,
    "oneLiner": "以 1/1.3 英寸传感器、双 OLED 屏和长续航为核心的成熟旗舰，适合骑行、滑雪和旅行记录。",
    "priceMin": 2297,
    "priceMax": 2297,
    "priceCurrency": "CNY",
    "coverUrl": "https://se-cdn.djiits.com/tpc/uploads/spu/cover/e4781624a38ba00d1b4a8bc3a204bd97@ultra.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 89.3,
    "brand": {
      "slug": "dji",
      "name": "DJI",
      "nameCn": "大疆"
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.3 英寸 CMOS",
      "maxVideo": "4K@120fps",
      "maxFrameRate": 120,
      "maxPhoto": "约 40MP",
      "stabilization": "RockSteady 3.0+ / HorizonSteady",
      "waterproofDepth": 20,
      "weight": 146,
      "batteryLife": 240,
      "screen": "双 OLED 高亮触控屏",
      "storage": "64GB 内置（47GB 可用）+ microSD",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "diving",
        "travel"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "120fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "20m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "146g"
      }
    ]
  },
  {
    "id": "01a0be38-1958-7c2f-814c-9c6dd1f889c3",
    "slug": "dji-osmo-action-6-2026",
    "title": "DJI Osmo Action 6",
    "model": "Osmo Action 6",
    "year": 2026,
    "oneLiner": "以 1/1.1 英寸方形传感器、可变光圈和 8K 视频为核心的旗舰运动相机，适合希望兼顾运动记录与低光创作的人。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://se-cdn.djiits.com/tpc/uploads/spu/cover/12bba4939cd4f341e741cdf5d2c8d9b0@ultra.png?format=webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 90.9,
    "brand": {
      "slug": "dji",
      "name": "DJI",
      "nameCn": "大疆"
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.1 英寸方形传感器",
      "maxVideo": "8K@30fps",
      "maxFrameRate": 120,
      "stabilization": "RockSteady / HorizonSteady",
      "waterproofDepth": 20,
      "weight": 149,
      "batteryLife": 240,
      "screen": "双触控屏",
      "storage": "64GB 内置（50GB 可用）+ microSD",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "diving",
        "travel"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "120fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "20m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "149g"
      }
    ]
  },
  {
    "id": "01a0be38-1972-7e24-9e3b-40c33660c7c2",
    "slug": "gopro-hero11-black-2022",
    "title": "GoPro HERO11 Black",
    "model": "HERO11 Black",
    "year": 2022,
    "oneLiner": "以 8:7 传感器裁切空间和 HyperSmooth 防抖为卖点，适合预算有限的户外运动入门。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://gopro.com/on/demandware.static/-/Sites-gopro-products/default/dwd909d4f6/images/Product%20Images/cameras/CHDHX-111-master/compare-h11.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 80.1,
    "brand": {
      "slug": "gopro",
      "name": "GoPro",
      "nameCn": null
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.9 英寸 CMOS，27.13MP",
      "maxVideo": "5.3K@60fps",
      "maxFrameRate": 240,
      "maxPhoto": "27.13MP",
      "stabilization": "HyperSmooth 5.0",
      "waterproofDepth": 10,
      "weight": 154,
      "screen": "后置触屏 + 前置彩屏",
      "storage": "microSD",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "travel"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "240fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "10m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "154g"
      }
    ]
  },
  {
    "id": "01a0be38-1983-7611-badd-ba612880ff6e",
    "slug": "gopro-hero12-black-2023",
    "title": "GoPro HERO12 Black",
    "model": "HERO12 Black",
    "year": 2023,
    "oneLiner": "以 5.3K 视频、HyperSmooth 6.0 和成熟配件生态保持均衡，适合以较低成本进入 GoPro 体系。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://gopro.com/on/demandware.static/-/Sites-gopro-products/default/dwd62f3260/images/Product%20Images/cameras/CHDHX-121-master/plp-product-card-h12.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 83.5,
    "brand": {
      "slug": "gopro",
      "name": "GoPro",
      "nameCn": null
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.9 英寸 CMOS，27MP",
      "maxVideo": "5.3K@60fps",
      "maxFrameRate": 240,
      "maxPhoto": "27MP",
      "stabilization": "HyperSmooth 6.0",
      "waterproofDepth": 10,
      "weight": 154,
      "batteryLife": 150,
      "screen": "后置触屏 + 前置彩屏",
      "storage": "microSD",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "travel",
        "vlogging"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "240fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "10m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "154g"
      }
    ]
  },
  {
    "id": "01a0be38-1998-7ef1-b79f-575cdbccd6c7",
    "slug": "gopro-hero13-black-2024",
    "title": "GoPro HERO13 Black",
    "model": "HERO13 Black",
    "year": 2024,
    "oneLiner": "以 5.3K60、HyperSmooth 6.0 和 HB 系列镜头生态为核心，适合重视运动 POV 与后期裁切的用户。",
    "priceMin": 2736,
    "priceMax": 2736,
    "priceCurrency": "CNY",
    "coverUrl": "https://gopro.com/on/demandware.static/-/Sites-gopro-products/default/dw212f9f28/images/Product%20Images/cameras/CHDHX-131-master/plp-product-card-h13.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 84.9,
    "brand": {
      "slug": "gopro",
      "name": "GoPro",
      "nameCn": null
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.9 英寸 CMOS，27.6MP",
      "maxVideo": "5.3K@60fps",
      "maxFrameRate": 240,
      "maxPhoto": "27.6MP",
      "fov": "广角，支持 HB 系列镜头",
      "stabilization": "HyperSmooth 6.0",
      "waterproofDepth": 10,
      "weight": 154,
      "batteryLife": 150,
      "screen": "后置触屏 + 前置彩屏",
      "storage": "microSD",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "travel",
        "vlogging"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "240fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "10m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "154g"
      }
    ]
  },
  {
    "id": "01a0be38-19be-7a2a-b1bc-beeaf4c8330f",
    "slug": "insta360-ace-pro-2023",
    "title": "Insta360 Ace Pro",
    "model": "Ace Pro",
    "year": 2023,
    "oneLiner": "以 1/1.3 英寸大底、翻转触控屏和 8K 记录为核心，适合旅行 Vlog 与运动混合创作。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://res.insta360.com/static/a7e1e6632afa8dc15821776d712a352f/acepro&ace.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 84.4,
    "brand": {
      "slug": "insta360",
      "name": "Insta360",
      "nameCn": "影石"
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.3 英寸",
      "maxVideo": "8K@24fps",
      "maxFrameRate": 120,
      "maxPhoto": "48MP",
      "fov": "151°",
      "stabilization": "FlowState + 360° Horizon Lock",
      "waterproofDepth": 10,
      "weight": 179.8,
      "batteryLife": 100,
      "screen": "2.4 英寸翻转触控屏",
      "storage": "microSD",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "vlogging",
        "travel"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "120fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "10m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "179.8g"
      }
    ]
  },
  {
    "id": "01a0be38-19ae-7d94-9594-d9da1255096c",
    "slug": "insta360-ace-pro-2-2024",
    "title": "Insta360 Ace Pro 2",
    "model": "Ace Pro 2",
    "year": 2024,
    "oneLiner": "以 1/1.3 英寸 8K 传感器、翻转触控屏和低光模式为核心，适合运动与 Vlog 混合拍摄。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://wassets.insta360.com/common/4d7317543e0f4fee9b0b037a4d24d961/pc-acepro2-CN.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 88.3,
    "brand": {
      "slug": "insta360",
      "name": "Insta360",
      "nameCn": "影石"
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.3 英寸 8K 传感器",
      "maxVideo": "8K@30fps",
      "maxFrameRate": 120,
      "maxPhoto": "50MP",
      "fov": "157°",
      "stabilization": "FlowState + 360° Horizon Lock",
      "waterproofDepth": 12,
      "weight": 184,
      "batteryLife": 180,
      "screen": "2.5 英寸翻转触控屏",
      "storage": "microSD，最高 1TB",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "diving",
        "vlogging",
        "travel"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "120fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "12m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "184g"
      }
    ]
  },
  {
    "id": "01a0be38-19cf-7642-be42-98520b48d4ff",
    "slug": "insta360-go-3-2023",
    "title": "Insta360 GO 3",
    "model": "GO 3",
    "year": 2023,
    "oneLiner": "以极轻机身、磁吸夹具和 Action Pod 为核心的佩戴式相机，适合生活记录和轻量运动。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://res.insta360.com/static/d78e79ba23e097dc53578184664348ca/GO3.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.6,
    "brand": {
      "slug": "insta360",
      "name": "Insta360",
      "nameCn": "影石"
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "wearable",
      "sensor": "1/2.3 英寸",
      "maxVideo": "2.7K@50fps",
      "maxFrameRate": 50,
      "stabilization": "FlowState",
      "waterproofDepth": 5,
      "weight": 35.5,
      "screen": "Action Pod 触控屏",
      "storage": "内置存储",
      "scenes": [
        "cycling",
        "skiing",
        "vlogging",
        "travel"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "拇指 / 佩戴式"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "50fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "5m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "35.5g"
      }
    ]
  },
  {
    "id": "01a0be38-19e2-7048-98e1-5a6b1ed17e66",
    "slug": "insta360-go-3s-2024",
    "title": "Insta360 GO 3S",
    "model": "GO 3S",
    "year": 2024,
    "oneLiner": "轻量化的 4K 拇指相机，优先解决佩戴、磁吸和第一视角记录问题。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://res.insta360.com/static/a3b716298df7f6da544fcdaf70ffe21f/GO3S.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.6,
    "brand": {
      "slug": "insta360",
      "name": "Insta360",
      "nameCn": "影石"
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "wearable",
      "sensor": "1/2.3 英寸",
      "maxVideo": "4K@30fps",
      "maxFrameRate": 120,
      "stabilization": "FlowState",
      "waterproofDepth": 10,
      "weight": 39.1,
      "batteryLife": 140,
      "screen": "Action Pod 触控屏",
      "storage": "64GB / 128GB 内置存储",
      "scenes": [
        "cycling",
        "skiing",
        "vlogging",
        "travel"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "拇指 / 佩戴式"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "120fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "10m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "39.1g"
      }
    ]
  },
  {
    "id": "01a0c879-0896-78d7-9cde-5de82a169526",
    "slug": "insta360-x5-2026",
    "title": "影石Insta360 X5 — 8K 旗舰款全景运动相机",
    "model": "X5",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "insta360",
      "name": "Insta360",
      "nameCn": "影石"
    },
    "categorySlug": "action-cam",
    "specs": {
      "cameraType": "action",
      "sensor": "1/1.28 英寸传感器",
      "maxVideo": "8K/30fps",
      "maxFrameRate": 120,
      "maxPhoto": "72MP",
      "fov": "360°",
      "stabilization": "FlowState 防抖 + 360° 水平矫正",
      "waterproofDepth": 15,
      "weight": 200,
      "batteryLife": 208,
      "storage": "microSD支持 UHS-I V30 或更高",
      "scenes": [
        "cycling",
        "motorcycle",
        "skiing",
        "diving"
      ]
    },
    "highlights": [
      {
        "key": "cameraType",
        "label": "相机类型",
        "value": "传统运动相机"
      },
      {
        "key": "maxFrameRate",
        "label": "最高帧率",
        "value": "120fps"
      },
      {
        "key": "waterproofDepth",
        "label": "裸机防水深度",
        "value": "15m"
      },
      {
        "key": "weight",
        "label": "机身重量",
        "value": "200g"
      }
    ]
  },
  {
    "id": "01a0bdc1-3bf3-7bcd-8150-a687810601f2",
    "slug": "victor-auraspeed-100x-se-2026",
    "title": "VICTOR AURASPEED 100X SE H 2026",
    "model": "AURASPEED 100X SE H",
    "year": 2026,
    "oneLiner": "以平抽快挡和连续衔接为主的速度型球拍，适合双打中前场与快速攻防转换；重杀上限不靠堆头重实现。",
    "priceMin": 1699,
    "priceMax": 2199,
    "priceCurrency": "CNY",
    "coverUrl": "https://shop.au.victorsport.com/cdn/shop/products/82004_1_20211117175841_2048x.jpg?v=1644645157",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 79.9,
    "brand": {
      "slug": "victor",
      "name": "VICTOR",
      "nameCn": "威克多"
    },
    "categorySlug": "badminton-racket",
    "specs": {
      "weightClass": "3U/4U",
      "maxTension": 29,
      "frameMaterial": "High Resilience Modulus Graphite + Nano Fortify TR",
      "shaftMaterial": "High Resilience Modulus Graphite + PYROFIL + 6.8 SHAFT",
      "scenes": [
        "doubles",
        "speed"
      ],
      "playerLevel": "advanced"
    },
    "highlights": [
      {
        "key": "weightClass",
        "label": "重量等级",
        "value": "3U / 4U"
      },
      {
        "key": "maxTension",
        "label": "最高建议磅数",
        "value": "29lbs"
      },
      {
        "key": "scenes",
        "label": "使用取向",
        "value": "双打 · 速度"
      },
      {
        "key": "playerLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0bdc1-3c19-75ee-beaf-e1affa897f91",
    "slug": "victor-thruster-ryuga-ii-pro-2026",
    "title": "VICTOR THRUSTER RYUGA II PRO B 2026",
    "model": "THRUSTER RYUGA II PRO B",
    "year": 2026,
    "oneLiner": "以重杀和后场压制为核心的进攻拍，适合能稳定驾驭硬杆和头重感的单打或后场选手。",
    "priceMin": 1599,
    "priceMax": 2199,
    "priceCurrency": "CNY",
    "coverUrl": "https://shop.au.victorsport.com/cdn/shop/files/TK-RYUGAIIPROB-Main_530x%402x.jpg?v=1708589137",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.1,
    "brand": {
      "slug": "victor",
      "name": "VICTOR",
      "nameCn": "威克多"
    },
    "categorySlug": "badminton-racket",
    "specs": {
      "weightClass": "3U/4U",
      "maxTension": 32,
      "frameMaterial": "High Resilience Modulus Graphite + HARD CORED TECHNOLOGY",
      "shaftMaterial": "High Resilience Modulus Graphite + PYROFIL + 6.6 SHAFT",
      "scenes": [
        "singles",
        "attack"
      ],
      "playerLevel": "advanced"
    },
    "highlights": [
      {
        "key": "weightClass",
        "label": "重量等级",
        "value": "3U / 4U"
      },
      {
        "key": "maxTension",
        "label": "最高建议磅数",
        "value": "32lbs"
      },
      {
        "key": "scenes",
        "label": "使用取向",
        "value": "单打 · 进攻"
      },
      {
        "key": "playerLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0bdc1-3c2f-7279-9f15-5a59ec9fdfee",
    "slug": "yonex-arcsaber-11-pro-2026",
    "title": "YONEX ARCSABER 11 PRO 2026",
    "model": "ARCSABER 11 PRO",
    "year": 2026,
    "oneLiner": "以持球感和落点控制见长，适合愿意主动组织回合的中高级选手；它更奖励稳定击球，不负责替你发力。",
    "priceMin": 1799,
    "priceMax": 2199,
    "priceCurrency": "CNY",
    "coverUrl": "https://us.yonex.com/cdn/shop/files/arc11-p.png?v=1738288163&width=1946",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 80.2,
    "brand": {
      "slug": "yonex",
      "name": "YONEX",
      "nameCn": "尤尼克斯"
    },
    "categorySlug": "badminton-racket",
    "specs": {
      "weightClass": "3U/4U",
      "balance": "even",
      "flex": "stiff",
      "maxTension": 28,
      "frameMaterial": "HM Graphite + POCKETING BOOSTER",
      "shaftMaterial": "HM Graphite + SUPER HMG + ULTRA PE FIBER",
      "lengthNote": "加长 10mm",
      "stringPattern": "4U 19-27 lbs；3U 20-28 lbs",
      "scenes": [
        "singles",
        "control"
      ],
      "playerLevel": "advanced"
    },
    "highlights": [
      {
        "key": "weightClass",
        "label": "重量等级",
        "value": "3U / 4U"
      },
      {
        "key": "balance",
        "label": "平衡取向",
        "value": "均衡"
      },
      {
        "key": "flex",
        "label": "杆身硬度",
        "value": "硬 Stiff"
      },
      {
        "key": "maxTension",
        "label": "最高建议磅数",
        "value": "28lbs"
      }
    ]
  },
  {
    "id": "01a0bdc1-3c47-737f-a746-8ea4f035f809",
    "slug": "yonex-astrox-100-zz-2026",
    "title": "YONEX ASTROX 100 ZZ 2026",
    "model": "ASTROX 100 ZZ",
    "year": 2026,
    "oneLiner": "头重、特硬、连续重杀取向鲜明，适合主动发力的进阶选手；被动防守和轻松借力不是它的强项。",
    "priceMin": 1799,
    "priceMax": 2199,
    "priceCurrency": "CNY",
    "coverUrl": "https://us.yonex.com/cdn/shop/files/astrox100zz_kurenai.png?v=1769128443&width=1946",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.8,
    "brand": {
      "slug": "yonex",
      "name": "YONEX",
      "nameCn": "尤尼克斯"
    },
    "categorySlug": "badminton-racket",
    "specs": {
      "weightClass": "3U/4U",
      "balance": "head-heavy",
      "flex": "extra-stiff",
      "maxTension": 29,
      "frameMaterial": "HM Graphite + Namd + Tungsten + Black Micro Core",
      "shaftMaterial": "HM Graphite + Namd",
      "lengthNote": "加长 10mm",
      "stringPattern": "3U 21-29 lbs；4U 20-28 lbs",
      "scenes": [
        "singles",
        "attack"
      ],
      "playerLevel": "advanced"
    },
    "highlights": [
      {
        "key": "weightClass",
        "label": "重量等级",
        "value": "3U / 4U"
      },
      {
        "key": "balance",
        "label": "平衡取向",
        "value": "头重"
      },
      {
        "key": "flex",
        "label": "杆身硬度",
        "value": "特硬 Extra Stiff"
      },
      {
        "key": "maxTension",
        "label": "最高建议磅数",
        "value": "29lbs"
      }
    ]
  },
  {
    "id": "01a0bdc1-3c59-7a1a-88fd-f217dac82321",
    "slug": "yonex-nanoflare-1000-z-2026",
    "title": "YONEX NANOFLARE 1000 Z 2026",
    "model": "NANOFLARE 1000 Z",
    "year": 2026,
    "oneLiner": "头轻、挥速快，适合主动抢节奏的双打选手；特硬中杆会放大动作质量的差异。",
    "priceMin": 1699,
    "priceMax": 1999,
    "priceCurrency": "CNY",
    "coverUrl": "https://us.yonex.com/cdn/shop/files/NF1000Z_Lightning_Yellow_1.jpg?v=1740596406&width=1946",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 80.5,
    "brand": {
      "slug": "yonex",
      "name": "YONEX",
      "nameCn": "尤尼克斯"
    },
    "categorySlug": "badminton-racket",
    "specs": {
      "weightClass": "3U/4U",
      "balance": "head-light",
      "flex": "extra-stiff",
      "maxTension": 29,
      "frameMaterial": "HM Graphite + NANOMETRIC DR + M40X + EX-HYPER MG",
      "shaftMaterial": "HM Graphite + Ultra PE FIBER",
      "lengthNote": "加长 10mm",
      "stringPattern": "4U 20-28 lbs；3U 21-29 lbs",
      "scenes": [
        "doubles",
        "speed"
      ],
      "playerLevel": "advanced"
    },
    "highlights": [
      {
        "key": "weightClass",
        "label": "重量等级",
        "value": "3U / 4U"
      },
      {
        "key": "balance",
        "label": "平衡取向",
        "value": "头轻"
      },
      {
        "key": "flex",
        "label": "杆身硬度",
        "value": "特硬 Extra Stiff"
      },
      {
        "key": "maxTension",
        "label": "最高建议磅数",
        "value": "29lbs"
      }
    ]
  },
  {
    "id": "01a0c879-08f9-743b-a883-b59c46d9839d",
    "slug": "igpsport-bsc500-2025",
    "title": "BSC500 - 全彩大屏进阶码表，大有声色 - iGPSPORT迹驰",
    "model": "BSC500",
    "year": 2025,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "igpsport",
      "name": "iGPSPORT",
      "nameCn": "迹驰"
    },
    "categorySlug": "bike-computer",
    "specs": {
      "screenSize": 3.3,
      "screen": "全透触控彩屏",
      "touchScreen": true,
      "batteryLife": 25,
      "navigation": true,
      "mapSupport": "离线 / 在线导航",
      "audioPrompt": true,
      "sensorCompatibility": "全面传感器兼容"
    },
    "highlights": [
      {
        "key": "screenSize",
        "label": "屏幕尺寸",
        "value": "3.3in"
      },
      {
        "key": "batteryLife",
        "label": "官方续航",
        "value": "25h"
      }
    ]
  },
  {
    "id": "01a0c879-0905-7275-826a-99cd23748beb",
    "slug": "igpsport-igs800-2024",
    "title": "iGS800 - 彩屏触控GPS骑行码表 - iGPSPORT迹驰",
    "model": "iGS800",
    "year": 2024,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "igpsport",
      "name": "iGPSPORT",
      "nameCn": "迹驰"
    },
    "categorySlug": "bike-computer",
    "specs": {
      "screenSize": 3.5,
      "screen": "全透触控彩屏",
      "touchScreen": true,
      "batteryLife": 50,
      "navigation": true
    },
    "highlights": [
      {
        "key": "screenSize",
        "label": "屏幕尺寸",
        "value": "3.5in"
      },
      {
        "key": "batteryLife",
        "label": "官方续航",
        "value": "50h"
      }
    ]
  },
  {
    "id": "01a0c879-0919-798e-94f3-45436cf05132",
    "slug": "insta360-x4-2024",
    "title": "影石Insta360 X4-8K 全景运动相机",
    "model": "X4",
    "year": 2024,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "insta360",
      "name": "Insta360",
      "nameCn": "影石"
    },
    "categorySlug": "camera",
    "specs": {
      "cameraType": "360°全景相机",
      "cameraSensor": "1/2 英寸",
      "maxVideo": "8K/30fps/5.7K/60fps",
      "maxPhoto": "72MP",
      "stabilization": "FlowState 防抖",
      "screenSize": 2.5,
      "batteryLife": 135,
      "batteryCapacity": 2290,
      "weight": 203,
      "waterproof": "裸机 10 m 防水"
    },
    "highlights": [
      {
        "key": "screenSize",
        "label": "屏幕尺寸",
        "value": "2.5英寸"
      },
      {
        "key": "batteryLife",
        "label": "续航时间",
        "value": "135min"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "2290mAh"
      },
      {
        "key": "weight",
        "label": "重量",
        "value": "203g"
      }
    ]
  },
  {
    "id": "01a0bdc1-3c6e-7e57-b00c-144ddd6701ce",
    "slug": "daiwa-tatula-641lfb-bf-2026",
    "title": "Daiwa TATULA 641LFB-BF 2026",
    "model": "TATULA 641LFB-BF",
    "year": 2026,
    "oneLiner": "面向贝特芬尼斯的轻量枪柄竿，1.8–11 克覆盖小型硬饵和轻型软虫，强调抛投精度与手上反馈。",
    "priceMin": 1299,
    "priceMax": 1599,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.point-official.shop/img/goods/L/4550133341434_1.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 77.6,
    "brand": {
      "slug": "daiwa",
      "name": "Daiwa",
      "nameCn": "达亿瓦"
    },
    "categorySlug": "casting-rod",
    "specs": {
      "length": 1.93,
      "sections": 2,
      "weight": 96,
      "lureWeight": "1.8-11 g",
      "lineWeight": "5-12 lb",
      "power": "light",
      "rodType": "casting",
      "blankMaterial": "碳纤维",
      "carbonContent": 91,
      "scenes": [
        "freshwater",
        "finesse"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "全长",
        "value": "1.93m"
      },
      {
        "key": "sections",
        "label": "节数",
        "value": "2"
      },
      {
        "key": "weight",
        "label": "标准自重",
        "value": "96g"
      },
      {
        "key": "power",
        "label": "调性强度",
        "value": "轻 L"
      }
    ]
  },
  {
    "id": "01a0bdc1-3c86-784c-a3e8-8ebd94f61a6f",
    "slug": "daiwa-tatula-651mfb-2026",
    "title": "Daiwa TATULA 651MFB 2026",
    "model": "TATULA 651MFB",
    "year": 2026,
    "oneLiner": "6 英尺 5 英寸的中调全能枪柄竿，5–21 克覆盖面实用，适合软虫、德州和中小型硬饵之间频繁切换。",
    "priceMin": 1299,
    "priceMax": 1599,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.anglerscentral.my/cdn/shop/files/EDFCC126-8552-45A9-A0BB-9E32D4CC4505.jpg?v=1773455787&width=416",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 80.7,
    "brand": {
      "slug": "daiwa",
      "name": "Daiwa",
      "nameCn": "达亿瓦"
    },
    "categorySlug": "casting-rod",
    "specs": {
      "length": 1.96,
      "sections": 2,
      "weight": 109,
      "lureWeight": "5-21 g",
      "lineWeight": "8-16 lb",
      "power": "medium",
      "rodType": "casting",
      "blankMaterial": "碳纤维",
      "carbonContent": 92,
      "scenes": [
        "freshwater",
        "bass"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "全长",
        "value": "1.96m"
      },
      {
        "key": "sections",
        "label": "节数",
        "value": "2"
      },
      {
        "key": "weight",
        "label": "标准自重",
        "value": "109g"
      },
      {
        "key": "power",
        "label": "调性强度",
        "value": "中 M"
      }
    ]
  },
  {
    "id": "01a0bdc1-3c97-73db-891c-659535541e47",
    "slug": "daiwa-tatula-681mhrb-2026",
    "title": "Daiwa TATULA 681MHRB 2026",
    "model": "TATULA 681MHRB",
    "year": 2026,
    "oneLiner": "2.03 米中重调的强力全能型号，覆盖高比重软虫、德州、铁板和中重型硬饵，适合需要起鱼底气的鲈钓场景。",
    "priceMin": 1399,
    "priceMax": 1699,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.anglerscentral.my/cdn/shop/files/images.png?v=1773456295&width=416",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 81.4,
    "brand": {
      "slug": "daiwa",
      "name": "Daiwa",
      "nameCn": "达亿瓦"
    },
    "categorySlug": "casting-rod",
    "specs": {
      "length": 2.03,
      "sections": 2,
      "weight": 119,
      "lureWeight": "7-28 g",
      "lineWeight": "10-20 lb",
      "power": "medium-heavy",
      "rodType": "casting",
      "blankMaterial": "碳纤维",
      "carbonContent": 91,
      "scenes": [
        "freshwater",
        "bass",
        "heavy-lure"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "全长",
        "value": "2.03m"
      },
      {
        "key": "sections",
        "label": "节数",
        "value": "2"
      },
      {
        "key": "weight",
        "label": "标准自重",
        "value": "119g"
      },
      {
        "key": "power",
        "label": "调性强度",
        "value": "中重 MH"
      }
    ]
  },
  {
    "id": "01a0bdc1-3caa-7ac3-92f2-1a491edc84ea",
    "slug": "shimano-limitless-lmt862sp26ml-2024",
    "title": "Shimano LIMITLESS LMT862SP26ML 2024",
    "model": "LIMITLESS LMT862SP26ML",
    "year": 2024,
    "oneLiner": "8 英尺 6 英寸的中轻调直柄竿，兼顾远投距离和轻饵操控，适合岸边淡水路亚与需要覆盖水面的场景。",
    "priceMin": 1299,
    "priceMax": 1599,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.smartmarine.co.nz/cdn/images/products/xlarge/8089900_a.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 79.9,
    "brand": {
      "slug": "shimano",
      "name": "Shimano",
      "nameCn": "禧玛诺"
    },
    "categorySlug": "casting-rod",
    "specs": {
      "length": 2.59,
      "sections": 2,
      "lureWeight": "5-21 g",
      "lineWeight": "2-6 kg",
      "power": "medium-light",
      "rodType": "spinning",
      "blankMaterial": "30T / 40T Carbon",
      "scenes": [
        "freshwater",
        "light-lure"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "全长",
        "value": "2.59m"
      },
      {
        "key": "sections",
        "label": "节数",
        "value": "2"
      },
      {
        "key": "power",
        "label": "调性强度",
        "value": "中轻 ML"
      },
      {
        "key": "rodType",
        "label": "轮座类型",
        "value": "直柄纺车"
      }
    ]
  },
  {
    "id": "01a0bdc1-3cbc-7de9-9e54-b01a921794eb",
    "slug": "shimano-streamflight-stf702sp25l-2026",
    "title": "Shimano STREAMFLIGHT STF702SP25L 2026",
    "model": "STREAMFLIGHT STF702SP25L",
    "year": 2026,
    "oneLiner": "2.13 米、2–12 克的轻量直柄竿，适合溪流和小河轻饵；强调落点与细腻鱼讯，面对大鱼和重障碍要留余量。",
    "priceMin": 699,
    "priceMax": 899,
    "priceCurrency": "CNY",
    "coverUrl": "https://bbsports.co.nz/cdn/shop/files/Untitled_580x.jpg?v=1760064152",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76.8,
    "brand": {
      "slug": "shimano",
      "name": "Shimano",
      "nameCn": "禧玛诺"
    },
    "categorySlug": "casting-rod",
    "specs": {
      "length": 2.13,
      "sections": 2,
      "lureWeight": "2-12 g",
      "lineWeight": "2-5 kg",
      "power": "light",
      "rodType": "spinning",
      "blankMaterial": "30T Carbon",
      "scenes": [
        "freshwater",
        "light-lure"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "全长",
        "value": "2.13m"
      },
      {
        "key": "sections",
        "label": "节数",
        "value": "2"
      },
      {
        "key": "power",
        "label": "调性强度",
        "value": "轻 L"
      },
      {
        "key": "rodType",
        "label": "轮座类型",
        "value": "直柄纺车"
      }
    ]
  },
  {
    "id": "01a0c879-0984-72e0-8fde-70f8d137acfd",
    "slug": "dji-avata-2-2024",
    "title": "DJI Avata 2 - 第一视角飞行体验无人机 - 技术参数 - DJI 大疆创新",
    "model": "Avata 2",
    "year": 2024,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "dji",
      "name": "DJI",
      "nameCn": "大疆"
    },
    "categorySlug": "drone",
    "specs": {
      "flightTime": 23,
      "batteryCapacity": 2150,
      "maxVideo": "4K/120fps",
      "cameraSensor": "1/1.3 英寸影像传感器",
      "transmissionRange": 13
    },
    "highlights": [
      {
        "key": "flightTime",
        "label": "最长飞行时间",
        "value": "23min"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "2150mAh"
      },
      {
        "key": "transmissionRange",
        "label": "图传距离",
        "value": "13km"
      }
    ]
  },
  {
    "id": "01a0c879-0998-7800-bd08-35877608aef7",
    "slug": "dji-mini-4-pro-2023",
    "title": "DJI Mini 4 Pro - 技术参数 - DJI 大疆创新",
    "model": "Mini 4 Pro",
    "year": 2023,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "dji",
      "name": "DJI",
      "nameCn": "大疆"
    },
    "categorySlug": "drone",
    "specs": {
      "weightNote": "轻于 249 g",
      "flightTime": 34,
      "batteryCapacity": 2590,
      "maxVideo": "4K/60fps HDR",
      "cameraSensor": "1/1.3 英寸 CMOS",
      "verticalShooting": true,
      "transmissionRange": 20,
      "obstacleSensing": "omnidirectional",
      "subjectTracking": true
    },
    "highlights": [
      {
        "key": "flightTime",
        "label": "最长飞行时间",
        "value": "34min"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "2590mAh"
      },
      {
        "key": "transmissionRange",
        "label": "图传距离",
        "value": "20km"
      },
      {
        "key": "obstacleSensing",
        "label": "避障能力",
        "value": "全向避障"
      }
    ]
  },
  {
    "id": "01a0c879-09ae-71bf-af33-458d487f5a41",
    "slug": "akko-5075b-plus-asa-clear-2026",
    "title": "5075B Plus ASA Clear | Akko Official Global Site",
    "model": "5075B Plus ASA Clear",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "akko",
      "name": "Akko",
      "nameCn": "艾酷"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "Akko V3 Piano Pro",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "driver": "Akko Cloud Driver",
      "hotSwap": true,
      "keycapMaterial": "透明 PC 键帽"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      }
    ]
  },
  {
    "id": "01a0cd92-0dd1-7ea8-891b-07b29ac7fc47",
    "slug": "akko-5108-v5-the-legend-of-hei-2026",
    "title": "Akko The Legend of Hei 5108 V5 108-Key Tri-Mode Mechanical Keyboard",
    "model": "Akko The Legend of Hei 5108 V5",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "akko",
      "name": "Akko",
      "nameCn": "艾酷"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket Mount",
      "caseMaterial": "ABS",
      "layout": "100%（108键）",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "ARGB 背光",
      "driver": "Akko Cloud Driver",
      "hotSwap": true,
      "keycapMaterial": "PBT",
      "batteryCapacity": 10000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "10000mAh"
      }
    ]
  },
  {
    "id": "01a0c879-09bc-7b1b-8c97-de9c8daf458c",
    "slug": "akko-mod007-v5-he-2026",
    "title": "MOD007 V5 HE 三模磁轴键盘 - Akko",
    "model": "MOD007 V5 HE",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 740,
    "priceMax": 740,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "akko",
      "name": "Akko",
      "nameCn": "艾酷"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "magnetic",
      "switchType": "星引力磁轴",
      "mounting": "Gasket 结构",
      "caseMaterial": "CNC 铝合金",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "pollingRate": 8000,
      "rapidTriggerPrecision": 0.005,
      "backlight": "1600 万色 RGB 背光",
      "driver": "网页或软件双驱动",
      "quickRelease": true,
      "customScreen": true
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "磁轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "pollingRate",
        "label": "回报率",
        "value": "8000Hz"
      },
      {
        "key": "rapidTriggerPrecision",
        "label": "RT 精度",
        "value": "0.01mm"
      }
    ]
  },
  {
    "id": "01a0cd8e-3277-7aa1-96cc-613782c05664",
    "slug": "aula-f108-pro-2026",
    "title": "AULA F108 Pro 108-Key Tri-Mode Mechanical Keyboard",
    "model": "AULA F108 Pro",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "layout": "108 键全尺寸",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "customScreen": true,
      "batteryCapacity": 8000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "8000mAh"
      }
    ]
  },
  {
    "id": "01a0cd83-2882-783a-96cf-f005615698f4",
    "slug": "aula-f2088-104-white-punk-2026",
    "title": "AULA F2088 104-Key White Punk Mechanical Gaming Keyboard",
    "model": "AULA F2088 104键朋克版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "layout": "104 键全尺寸",
      "connection": [
        "wired"
      ],
      "backlight": "混彩背光"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      }
    ]
  },
  {
    "id": "01a0c879-09cb-7c17-96ab-7203e8618d20",
    "slug": "aula-f75-2026",
    "title": "AULA 75% Gasket Wireless Mechanical Keyboard – Aula Gear",
    "model": "AULA F75",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "LEOBOG Reaper Linear Switch",
      "mounting": "Gasket",
      "layout": "75% ANSI",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "driver": "AULA Driver",
      "hotSwap": true,
      "batteryCapacity": 4000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "4000mAh"
      }
    ]
  },
  {
    "id": "01a0ccef-00f0-74f2-a6b8-8e248f48f788",
    "slug": "aula-f75-max-2026",
    "title": "AULA F75 MAX – Aula Gear",
    "model": "AULA F75 Max",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "caseMaterial": "ABS Plastic",
      "layout": "75%（80键）",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "南向 RGB 背光",
      "driver": "AULA Driver",
      "hotSwap": true,
      "keycapMaterial": "PBT",
      "batteryCapacity": 4000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "4000mAh"
      }
    ]
  },
  {
    "id": "01a0cc31-9635-7807-a25e-f9d788defbcc",
    "slug": "aula-f87-pro-v2-2026",
    "title": "AULA F87 PRO V2 – Aula Gear",
    "model": "AULA F87 Pro V2",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "layout": "TKL (87键)",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "南向 RGB 背光",
      "driver": "AULA Driver",
      "hotSwap": true
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      }
    ]
  },
  {
    "id": "01a0cc2b-76ea-75cb-a926-5e6d332bddd6",
    "slug": "aula-f99-pro-2026",
    "title": "96% Gasket-Mounted Triple-Mode Mechanical Keyboard with Knob – Aula Gear",
    "model": "AULA F99 Pro",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "caseMaterial": "ABS Plastic",
      "layout": "96% with Knob",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "南向 RGB 背光",
      "driver": "AULA Driver",
      "hotSwap": true,
      "batteryCapacity": 8000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "8000mAh"
      }
    ]
  },
  {
    "id": "01a0cd5e-0b2b-7320-8115-eec9a0879008",
    "slug": "aula-hero-68-he-white-side-printed-2026",
    "title": "狼蛛 HERO 68HE 白色侧刻 磁轴键盘",
    "model": "AULA HERO 68 HE 白色侧刻",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "magnetic",
      "mounting": "Tray Mount",
      "caseMaterial": "ABS Plastic",
      "layout": "65%（68键）",
      "connection": [
        "wired"
      ],
      "pollingRate": 8000,
      "backlight": "南向 RGB 背光",
      "driver": "AULA Driver",
      "hotSwap": true
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "磁轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      },
      {
        "key": "pollingRate",
        "label": "回报率",
        "value": "8000Hz"
      }
    ]
  },
  {
    "id": "01a0cd6a-fe44-7e4a-9f51-b8b22767be20",
    "slug": "aula-hero68xs-phantom-black-snow-god-2026",
    "title": "狼蛛 HERO68XS 幻影黑 雪神磁轴三模电竞键盘",
    "model": "AULA HERO68XS 幻影黑 雪神磁轴",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "magnetic",
      "switchType": "雪神磁轴",
      "layout": "68键",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "rapidTriggerPrecision": 0.005,
      "actuationRange": "0.1–3.4mm",
      "backlight": "RGB 氛围灯箱",
      "hotSwap": true,
      "batteryCapacity": 6000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "磁轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "rapidTriggerPrecision",
        "label": "RT 精度",
        "value": "0.01mm"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "6000mAh"
      }
    ]
  },
  {
    "id": "01a0cd80-45c6-7537-b8d5-28c8492c4006",
    "slug": "aula-s500-wired-2026",
    "title": "AULA S500 Mechanical Keyboard",
    "model": "AULA S500",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "caseMaterial": "金属磨砂面板",
      "layout": "104 键全尺寸",
      "connection": [
        "wired"
      ],
      "backlight": "分区 RGB 背光"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      }
    ]
  },
  {
    "id": "01a0cd95-2729-70a2-9cb4-79b54a68e9e4",
    "slug": "aula-s75-pro-2026",
    "title": "AULA S75 PRO Mechanical Keyboard",
    "model": "AULA S75 Pro",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "aula",
      "name": "AULA",
      "nameCn": "狼蛛"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "layout": "75%",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "hotSwap": true
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      }
    ]
  },
  {
    "id": "01a0cc81-a442-7c96-b039-da2a4fa18ca3",
    "slug": "cherry-mx30s-rgb-2026",
    "title": "MX3.0S RGB-CHERRY樱桃",
    "model": "CHERRY MX3.0S RGB",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "cherry",
      "name": "CHERRY",
      "nameCn": "樱桃"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "无钢软弹结构",
      "caseMaterial": "铝合金外壳",
      "layout": "108 键全尺寸",
      "connection": [
        "wired"
      ],
      "backlight": "RGB 背光"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      }
    ]
  },
  {
    "id": "01a0cd9a-8521-74d7-8f44-9cbb2b3e7291",
    "slug": "dareu-a98-pro-rt-2026",
    "title": "达尔优 A98 专业版 RT 三模机械键盘",
    "model": "DAREU A98 专业版 RT 版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "dareu",
      "name": "DAREU",
      "nameCn": "达尔优"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "layout": "98键配列",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "hotSwap": true,
      "batteryCapacity": 8000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "8000mAh"
      }
    ]
  },
  {
    "id": "01a0cd58-567d-7f38-8f71-b267c8bf6d12",
    "slug": "dareu-cool68-ocean-blue-2026",
    "title": "达尔优 COOL68 云海蓝 磁轴电竞键盘",
    "model": "DAREU COOL68 云海蓝",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "dareu",
      "name": "DAREU",
      "nameCn": "达尔优"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "magnetic",
      "mounting": "Gasket",
      "layout": "65%（68键）",
      "connection": [
        "wired"
      ],
      "pollingRate": 8000,
      "rapidTriggerPrecision": 0.01,
      "backlight": "RGB 背光 / 3D Light Wing 灯箱",
      "driver": "DAREU 网页驱动",
      "hotSwap": true,
      "keycapMaterial": "PBT + PC 透明键帽"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "磁轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      },
      {
        "key": "pollingRate",
        "label": "回报率",
        "value": "8000Hz"
      },
      {
        "key": "rapidTriggerPrecision",
        "label": "RT 精度",
        "value": "0.01mm"
      }
    ]
  },
  {
    "id": "01a0cd89-9c17-7a85-a79f-b005f58fcd90",
    "slug": "mchose-g87-v2-2026",
    "title": "MCHOSE G87 V2 87-Key Tri-Mode Mechanical Keyboard",
    "model": "MCHOSE G87 V2",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "mchose",
      "name": "MCHOSE",
      "nameCn": "迈从"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "layout": "87 键 TKL",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "driver": "MCHOSE M HUB",
      "hotSwap": true
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      }
    ]
  },
  {
    "id": "01a0cc67-7f23-7e4b-b28c-7340cdab2dd6",
    "slug": "mchose-k99-v3-2026",
    "title": "MCHOSE K99 V3 Keyboard: Wireless, 98% Layout – Tri-Mode",
    "model": "MCHOSE K99 V3",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "mchose",
      "name": "MCHOSE",
      "nameCn": "迈从"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "Icy Creamsicle Switch",
      "mounting": "Gasket",
      "layout": "98%（99键）",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "pollingRate": 8000,
      "backlight": "16.8M 色 RGB 背光",
      "driver": "MCHOSE M HUB",
      "hotSwap": true,
      "batteryCapacity": 10000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "pollingRate",
        "label": "回报率",
        "value": "8000Hz"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "10000mAh"
      }
    ]
  },
  {
    "id": "01a0ccf6-4d2b-750a-896e-dea5674b3786",
    "slug": "melgeek-made68-pro-plus-2026",
    "title": "MelGeek MADE68 Pro+ Hall Effect Gaming Keyboard | Rapid Trigger 65% $139",
    "model": "MADE68 Pro+",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "melgeek",
      "name": "MelGeek",
      "nameCn": "蜜氪"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "magnetic",
      "mounting": "Gasket Mount",
      "caseMaterial": "ABS + PC",
      "layout": "65%（68键）",
      "connection": [
        "wired"
      ],
      "pollingRate": 8000,
      "scanRate": 16000,
      "rapidTriggerPrecision": 0.01,
      "actuationRange": "0.1–3.4mm",
      "backlight": "1600 万色 RGB 背光",
      "driver": "MelGeek HIVE"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "磁轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      },
      {
        "key": "pollingRate",
        "label": "回报率",
        "value": "8000Hz"
      },
      {
        "key": "scanRate",
        "label": "扫描率",
        "value": "16000Hz"
      }
    ]
  },
  {
    "id": "01a0c879-09d6-75f5-b002-7c3772a94d41",
    "slug": "monsgeek-m2-v5-he-2026",
    "title": "M2 V5 HE Fully Assembled - MonsGeek",
    "model": "M2 V5 HE",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "monsgeek",
      "name": "MonsGeek",
      "nameCn": "魔极客"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "magnetic",
      "switchType": "Akko AstroAim / AstroLink",
      "mounting": "Gasket-mounted",
      "caseMaterial": "铝合金",
      "layout": "1800 / 98 键",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "pollingRate": 8000,
      "scanRate": 32000,
      "rapidTriggerPrecision": 0.005,
      "actuationRange": "0.100–3.300mm",
      "backlight": "ARGB RGB 背光",
      "driver": "MonsGeek Driver & Web-Based Driver",
      "quickRelease": true,
      "batteryCapacity": 8000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "磁轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "pollingRate",
        "label": "回报率",
        "value": "8000Hz"
      },
      {
        "key": "scanRate",
        "label": "扫描率",
        "value": "32000Hz"
      }
    ]
  },
  {
    "id": "01a0c879-09e2-7c08-8415-7dabcd2e8691",
    "slug": "monsgeek-m2-v5-via-2026",
    "title": "M2 V5 VIA - MonsGeek",
    "model": "M2 V5 VIA",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "monsgeek",
      "name": "MonsGeek",
      "nameCn": "魔极客"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "Akko Cilantro / Akko Mirror / Akko Stellar Rose",
      "mounting": "Gasket-mounted",
      "caseMaterial": "铝合金",
      "layout": "ANSI / 1800 紧凑布局",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "driver": "VIA",
      "hotSwap": true,
      "quickRelease": true,
      "batteryCapacity": 8000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "8000mAh"
      }
    ]
  },
  {
    "id": "01a0cd76-7437-758f-bdfd-c7e56df71966",
    "slug": "rapoo-v700diy-98-2026",
    "title": "V700DIY-98长续航版 - 客制化多模式无线背光游戏机械键盘 - 雷柏科技",
    "model": "雷柏 V700DIY-98 长续航版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rapoo",
      "name": "Rapoo",
      "nameCn": "雷柏"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "凯华定制快银轴/弹白轴可选",
      "mounting": "Gasket",
      "layout": "98配列",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "driver": "Rapoo A Hub",
      "hotSwap": true,
      "keycapMaterial": "PBT双色注塑",
      "batteryCapacity": 10000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "10000mAh"
      }
    ]
  },
  {
    "id": "01a0cd7b-2587-79d5-88f7-b5c7ef17c2ba",
    "slug": "rapoo-v700rgb-alloy-2026",
    "title": "V700RGB合金版 - 幻彩RGB背光游戏机械键盘 - 雷柏科技",
    "model": "雷柏 V700RGB 合金版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rapoo",
      "name": "Rapoo",
      "nameCn": "雷柏"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "雷柏自主青轴、黑轴、茶轴可选",
      "caseMaterial": "铝合金上盖",
      "layout": "108 键全尺寸",
      "connection": [
        "wired"
      ],
      "backlight": "RGB 幻彩背光",
      "driver": "Rapoo 驱动软件",
      "keycapMaterial": "双色注塑"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      }
    ]
  },
  {
    "id": "01a0cc55-206f-76ed-bd95-48c7fcea9615",
    "slug": "rapoo-v500pro-2026",
    "title": "V500PRO - 混彩背光游戏机械键盘 - 雷柏科技",
    "model": "V500PRO",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 199,
    "priceMax": 199,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rapoo",
      "name": "Rapoo",
      "nameCn": "雷柏"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "雷柏自主黑轴、青轴、茶轴、红轴可选",
      "caseMaterial": "磨砂金属上盖",
      "layout": "104 键全尺寸",
      "connection": [
        "wired"
      ],
      "backlight": "混彩背光"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      }
    ]
  },
  {
    "id": "01a0d117-9ffc-7bd2-abb6-06bffa37cff6",
    "slug": "rog-azoth-extreme-edition-20-2026",
    "title": "ROG 夜魔 EXTREME 20周年版 75% 三模客制化机械键盘",
    "model": "ROG 夜魔 EXTREME 20周年版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 3599,
    "priceMax": 3599,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rog",
      "name": "ROG",
      "nameCn": "玩家国度"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "可调式 Gasket",
      "caseMaterial": "铝合金底壳 + 金属边框",
      "layout": "75%",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 每键背光",
      "driver": "Armoury Crate / 奥创极速网页版",
      "hotSwap": true,
      "customScreen": true
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      }
    ]
  },
  {
    "id": "01a0cd48-f919-7d8b-8c43-d2d23cbfce8a",
    "slug": "vgn-neon-68-super-competitive-plus-2026",
    "title": "VGN Neon 68 Extreme Magnetic Switch Keyboard",
    "model": "VGN 霓虹68 超竞版+ 天霸轴 黑武士",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 329,
    "priceMax": 329,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "vgn",
      "name": "VGN",
      "nameCn": "VGN"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "magnetic",
      "mounting": "Gasket",
      "layout": "68%（67键）",
      "connection": [
        "wired"
      ],
      "pollingRate": 8000,
      "rapidTriggerPrecision": 0.001,
      "backlight": "RGB 背光",
      "driver": "V HUB 网页驱动",
      "hotSwap": true
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "磁轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      },
      {
        "key": "pollingRate",
        "label": "回报率",
        "value": "8000Hz"
      },
      {
        "key": "rapidTriggerPrecision",
        "label": "RT 精度",
        "value": "0mm"
      }
    ]
  },
  {
    "id": "01a0ccef-3371-712f-bd92-75be076df01e",
    "slug": "vgn-n75-v2-2026",
    "title": "VGN N75 V2 Wireless RGB Mechanical Keyboard",
    "model": "VGN N75 V2 三模版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "vgn",
      "name": "VGN",
      "nameCn": "VGN"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "layout": "75%",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "driver": "V HUB",
      "hotSwap": true,
      "batteryCapacity": 8000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "8000mAh"
      }
    ]
  },
  {
    "id": "01a0cc5f-2c05-7b77-9464-716e1d85b0cc",
    "slug": "vgn-v87-v2-2026",
    "title": "VGN V87 V2 冰山雪莲侧刻 动力金轴",
    "model": "VGN V87 V2",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 249,
    "priceMax": 249,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "vgn",
      "name": "VGN",
      "nameCn": "VGN"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "动力金轴",
      "mounting": "Gasket",
      "layout": "TKL（87键）",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "driver": "V HUB",
      "hotSwap": true,
      "keycapMaterial": "PBT",
      "batteryCapacity": 10000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "10000mAh"
      }
    ]
  },
  {
    "id": "01a0cc3c-bd7a-7974-9ead-621f3c153d1a",
    "slug": "vgn-v98pro-v4-2026",
    "title": "VGN V98 Pro V4 Wireless Mechanical Keyboard",
    "model": "VGN V98Pro V4",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "vgn",
      "name": "VGN",
      "nameCn": "VGN"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "mounting": "Gasket",
      "layout": "98%",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "driver": "V HUB",
      "customScreen": true
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      }
    ]
  },
  {
    "id": "01a0cd50-4d63-7347-a6a6-7af925c4632a",
    "slug": "atk-rs6-ultra-white-shadow-warrior-2026",
    "title": "ATK RS6 Ultra 白影战士 冰刃轴 电竞磁轴键盘",
    "model": "ATK RS6 Ultra 白影战士 冰刃轴",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "vxe",
      "name": "VXE",
      "nameCn": "VXE / ATK"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "magnetic",
      "caseMaterial": "铝合金",
      "layout": "65% ANSI（68键）",
      "connection": [
        "wired"
      ],
      "pollingRate": 8000,
      "rapidTriggerPrecision": 0.001,
      "actuationRange": "0.001–3.3mm",
      "backlight": "南向 RGB 背光",
      "driver": "ATK HUB",
      "hotSwap": true,
      "keycapMaterial": "PBT Cherry Profile 键帽"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "磁轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线"
      },
      {
        "key": "pollingRate",
        "label": "回报率",
        "value": "8000Hz"
      },
      {
        "key": "rapidTriggerPrecision",
        "label": "RT 精度",
        "value": "0mm"
      }
    ]
  },
  {
    "id": "01a0c879-09f1-7ebc-92e9-cd0bf533886c",
    "slug": "vxe-v75-x-2026",
    "title": "Wireless Mechanical Gaming Keyboard | Semi-Aluminum",
    "model": "VXE V75 X",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "vxe",
      "name": "VXE",
      "nameCn": "VXE / ATK"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "Obsidian",
      "caseMaterial": "铝合金上盖 + ABS 底壳",
      "layout": "75% ANSI",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "南向 ARGB RGB 背光",
      "driver": "ATK HUB",
      "hotSwap": true,
      "keycapMaterial": "PBT Cherry/KOP Profile 键帽"
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      }
    ]
  },
  {
    "id": "01a0c879-09fc-7f63-ab75-3573977f3f39",
    "slug": "wobkey-rainy75-pro-2026",
    "title": "WOBKEY Rainy 75 | Custom Aluminum 75 Keyboard",
    "model": "Rainy 75 Pro",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "wobkey",
      "name": "WOBKEY",
      "nameCn": "WOBKEY"
    },
    "categorySlug": "esports-keyboard",
    "specs": {
      "keyboardType": "mechanical",
      "switchType": "WOB Switch",
      "mounting": "Gasket-mounted",
      "caseMaterial": "铝合金",
      "layout": "75%",
      "connection": [
        "wired",
        "2.4g",
        "bluetooth"
      ],
      "backlight": "RGB 背光",
      "batteryCapacity": 7000
    },
    "highlights": [
      {
        "key": "keyboardType",
        "label": "键盘类型",
        "value": "机械轴"
      },
      {
        "key": "connection",
        "label": "连接方式",
        "value": "有线 · 2.4G 无线 · 蓝牙"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "7000mAh"
      }
    ]
  },
  {
    "id": "01a0c87b-fc5b-7c30-b8f9-4f5f18fc0b30",
    "slug": "nisi-true-color-cpl-2022",
    "title": "TRUE COLOR 色彩保真CPL – NiSi 耐司-专业电影及相机光学镜头滤镜品牌 %",
    "model": "TRUE COLOR CPL",
    "year": 2022,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nisi",
      "name": "NiSi",
      "nameCn": "耐司"
    },
    "categorySlug": "filter",
    "specs": {
      "filterType": "CPL 偏振镜",
      "diameterOptions": "40.5 / 43 / 46 / 49 / 52 / 55 / 58 / 62 / 67 / 72 / 77 / 82 / 95 mm",
      "material": "True Color 偏振材料",
      "coating": "双面低反射纳米镀膜",
      "colorNeutral": true,
      "waterOilResistance": true,
      "edgeBlackening": true,
      "frameOptions": "标准框 / 铜框"
    },
    "highlights": []
  },
  {
    "id": "01a0c879-0a0a-7619-a077-ded6bafacf94",
    "slug": "dji-osmo-mobile-7p-2026",
    "title": "Osmo Mobile 7 系列 - 技术参数 - DJI 大疆创新",
    "model": "Osmo Mobile 7P",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "dji",
      "name": "DJI",
      "nameCn": "大疆"
    },
    "categorySlug": "gimbal",
    "specs": {
      "gimbalType": "手机稳定器",
      "stabilization": "三轴云台增稳",
      "tracking": "智能跟随 7.0",
      "trackingModule": "多功能追踪模块（标配）",
      "weight": 368,
      "batteryCapacity": 3350,
      "workingTime": 10,
      "chargingTime": 2.5,
      "chargingPort": "USB-C",
      "phoneWeightRange": "170 克至 300 克",
      "phoneThicknessRange": "6.9 毫米至 10 毫米",
      "phoneWidthRange": "67 毫米至 84 毫米",
      "extensionRodLength": 215,
      "builtInTripod": true,
      "controlSpeed": 120,
      "fillLightIlluminance": 40,
      "fillLightColorTemperature": "2500 K 至 6000 K"
    },
    "highlights": [
      {
        "key": "weight",
        "label": "重量",
        "value": "368g"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "3350mAh"
      },
      {
        "key": "workingTime",
        "label": "工作时间",
        "value": "10h"
      },
      {
        "key": "chargingTime",
        "label": "充电时间",
        "value": "2.5h"
      }
    ]
  },
  {
    "id": "01a0c879-0a18-79ad-80e6-b145b037ad6e",
    "slug": "timemore-sculptor-078s-2026",
    "title": "【泰摩咖啡】電動磨豆機TEG078S-黑色(雕刻家系列-手沖/義式雙用) – 泰摩TIMEMORE臺灣官方網站",
    "model": "TEG078S",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "timemore",
      "name": "TIMEMORE",
      "nameCn": "泰摩"
    },
    "categorySlug": "grinder",
    "specs": {
      "grinderType": "电动磨豆机",
      "useRange": "手冲 / 意式双用",
      "weight": 6810,
      "dimensions": "261mm × 118mm × 294mm",
      "materials": "铝合金/不锈钢/Tritan材料",
      "hopperCapacity": "标准豆仓约 20–30 g；加高豆仓约 100 g",
      "catchCupCapacity": 60,
      "power": 230,
      "voltage": "110V",
      "speedAdjustment": true,
      "fineRetentionReduction": true
    },
    "highlights": [
      {
        "key": "weight",
        "label": "重量",
        "value": "6810g"
      },
      {
        "key": "catchCupCapacity",
        "label": "接粉罐容量",
        "value": "60g"
      },
      {
        "key": "power",
        "label": "功率",
        "value": "230W"
      }
    ]
  },
  {
    "id": "01a0c87b-fc81-7558-adb3-57bc3dbbfbb8",
    "slug": "viltrox-af-56mm-f1-2-pro-xf-2025",
    "title": "Viltrox AF 56mm F1.2 Pro XF Lens for Fujifilm| APS-C Portrait Master – Viltrox Store",
    "model": "AF 56mm F1.2 Pro XF",
    "year": 2025,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "viltrox",
      "name": "Viltrox",
      "nameCn": "唯卓仕"
    },
    "categorySlug": "lens",
    "specs": {
      "mount": "X-mount",
      "focalLength": 56,
      "equivalentFocalLength": "85mm",
      "maxAperture": 1.2,
      "opticalStructure": "13/8",
      "focusDistance": 0.5,
      "maxMagnification": 0.13,
      "autofocus": true,
      "filterSize": 67,
      "weight": 575,
      "weatherSealing": "防尘防滴 / 全天候防护"
    },
    "highlights": [
      {
        "key": "focalLength",
        "label": "焦距",
        "value": "56mm"
      },
      {
        "key": "maxAperture",
        "label": "最大光圈",
        "value": "1.2"
      },
      {
        "key": "focusDistance",
        "label": "最近对焦距离",
        "value": "0.5m"
      },
      {
        "key": "maxMagnification",
        "label": "最大放大倍率",
        "value": "0.13"
      }
    ]
  },
  {
    "id": "01a0c87b-fc8c-7b4b-a7f8-8c10800f43b7",
    "slug": "lexar-professional-1066x-sd-silver-2026",
    "title": "Lexar Professional 1066x SDXC UHS-I 存储卡SILVER系列 | Lexar雷克沙",
    "model": "Professional 1066x SDXC UHS-I SILVER",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "lexar",
      "name": "Lexar",
      "nameCn": "雷克沙"
    },
    "categorySlug": "memory-card",
    "specs": {
      "cardType": "SDXC",
      "interface": "UHS-I",
      "capacityOptions": "64GB / 128GB / 256GB / 512GB / 1TB",
      "readSpeed": 160,
      "writeSpeedByCapacity": "128GB–1TB：120 MB/s；64GB：70 MB/s",
      "performanceClass": "1TB - Class 10, U3, V30",
      "videoSupport": "全高清 / 4K 超高清视频",
      "dimensions": "32 mm x 24 mm x 2.1 mm / 1.25” x 0.95” x 0.08”",
      "operatingTemperature": "-25°C to 85°C (-13°F to 185°F)",
      "storageTemperature": "-40°C to 85°C (-40°F to 185°F)",
      "durability": "抗冲击、抗震、防 X 射线",
      "warranty": "10年有限质保"
    },
    "highlights": [
      {
        "key": "readSpeed",
        "label": "最高读取速度",
        "value": "160MB/s"
      }
    ]
  },
  {
    "id": "01a0c879-0a4c-7e0e-bd9f-64fd54536cf1",
    "slug": "dji-mic-mini-2026",
    "title": "DJI Mic Mini - 技术参数 - DJI 大疆创新",
    "model": "DJI Mic Mini",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "dji",
      "name": "DJI",
      "nameCn": "大疆"
    },
    "categorySlug": "microphone",
    "specs": {
      "microphoneType": "无线麦克风",
      "transmitterWeight": 10,
      "receiverWeight": 17.8,
      "chargingCaseWeight": 139,
      "transmitterBatteryCapacity": 114,
      "receiverBatteryCapacity": 170,
      "chargingCaseBatteryCapacity": 1950,
      "transmitterChargingTime": 90,
      "receiverChargingTime": 100,
      "chargingCaseChargingTime": 2,
      "transmitterWorkingTime": 11.5,
      "receiverWorkingTime": 10.5,
      "polarPattern": "全指向",
      "frequencyResponse": "低切关：20 Hz 至 20 kHz；低切开：100 Hz 至 20 kHz",
      "maxSPL": 120,
      "equivalentNoise": 24,
      "maxTransmissionDistance": 400,
      "wirelessMode": "GFSK 2Mbps",
      "bluetoothProtocol": "蓝牙 5.3"
    },
    "highlights": [
      {
        "key": "transmitterWeight",
        "label": "发射器重量",
        "value": "10g"
      },
      {
        "key": "receiverWeight",
        "label": "接收器重量",
        "value": "17.8g"
      },
      {
        "key": "chargingCaseWeight",
        "label": "充电盒重量",
        "value": "139g"
      },
      {
        "key": "transmitterBatteryCapacity",
        "label": "发射器电池容量",
        "value": "114mAh"
      }
    ]
  },
  {
    "id": "01a0be38-1aad-7ff0-9d1f-a469af86bc2d",
    "slug": "canyon-neuron-cf-8-2026",
    "title": "Canyon Neuron CF 8",
    "model": "Neuron CF 8",
    "year": 2026,
    "oneLiner": "140mm 全能林道悬挂、碳纤车架和 1x12 传动，适合把爬坡效率与下坡容错放在同一台车上。",
    "priceMin": 20153,
    "priceMax": 20153,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.canyon.com/dw/image/v2/BCML_PRD/on/demandware.static/-/Sites-canyon-master/default/dw07984cc9/images/full/full_2023_/2023/full_2023_3170_neuron-cf-8_sr-bk_P5.png?sw=1145&sh=645&sm=fit&sfrm=png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 87.4,
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": "佳能道"
    },
    "categorySlug": "mtb",
    "specs": {
      "bikeType": "trail",
      "frameMaterial": "Carbon (CF)",
      "wheelSize": "XS/S 27.5\"；M/L/XL 29\"",
      "geometryNote": "Canyon Neuron CF 官方几何表；XS/S 使用 27.5 英寸轮径，M/L/XL 使用 29 英寸轮径。",
      "frontTravel": 140,
      "rearTravel": 140,
      "suspension": "FOX 34 Float Performance GRIP 前叉 + FOX Float DPS Performance 后避震",
      "groupset": "Shimano SLX 12s",
      "drivetrain": "1x12，10-51T",
      "brakes": "hydraulic-disc",
      "wheelset": "DT Swiss XM 1700",
      "tireSize": "2.4\"（按尺码适配 27.5 / 29）",
      "dropper": "Canyon G5，150–200mm（按尺码）",
      "scenes": [
        "trail",
        "climbing",
        "descending",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "全能林道 Trail"
      },
      {
        "key": "frontTravel",
        "label": "前叉行程",
        "value": "140mm"
      },
      {
        "key": "rearTravel",
        "label": "后避震行程",
        "value": "140mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "林道 Trail · 爬坡 · 下坡 · 全山地"
      }
    ]
  },
  {
    "id": "01a0be38-1acc-715e-9eee-184ae658430d",
    "slug": "canyon-spectral-cf-7-2026",
    "title": "Canyon Spectral CF 7",
    "model": "Spectral CF 7",
    "year": 2026,
    "oneLiner": "150mm 前叉、140mm 后避震和可切换 29 / Mullet 轮径，面向更激进的全能林道骑行。",
    "priceMin": 28793,
    "priceMax": 28793,
    "priceCurrency": "CNY",
    "coverUrl": "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1787554526/2027_FULL_spectral_cf-7_4380_M179_P08_P5_29_yyqkjb",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 88.3,
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": "佳能道"
    },
    "categorySlug": "mtb",
    "specs": {
      "bikeType": "trail",
      "frameMaterial": "CF 页面版本（组件材质待复核）",
      "completeWeight": 15.99,
      "wheelSize": "29\"；可按配置切换 Mullet",
      "geometryNote": "Canyon Spectral CF 官方表中的 Mullet 几何；切换为 29 英寸后，轮距与骑姿会按官方配置表变化，购买前需确认轮径版本。",
      "frontTravel": 150,
      "rearTravel": 140,
      "suspension": "FOX 36 Rhythm 前叉 + FOX Float X Performance 后避震",
      "groupset": "Shimano Deore",
      "drivetrain": "1x12，10-51T",
      "brakes": "hydraulic-disc",
      "wheelset": "XC 30 AL / END30AL",
      "tireSize": "29x2.4\"",
      "dropper": "150–230mm（按尺码）",
      "scenes": [
        "trail",
        "climbing",
        "descending",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "全能林道 Trail"
      },
      {
        "key": "completeWeight",
        "label": "整车重量",
        "value": "15.99kg"
      },
      {
        "key": "frontTravel",
        "label": "前叉行程",
        "value": "150mm"
      },
      {
        "key": "rearTravel",
        "label": "后避震行程",
        "value": "140mm"
      }
    ]
  },
  {
    "id": "01a0be38-1ae2-74be-9da9-be482d41fa0a",
    "slug": "giant-trance-x-advanced-0-2024",
    "title": "Giant Trance X Advanced 0",
    "model": "Trance X Advanced 0",
    "year": 2024,
    "oneLiner": "150mm 前叉、140mm Maestro 后避震和可切换后轮尺寸，适合技术林道与高速下坡。",
    "priceMin": 57600,
    "priceMax": 57600,
    "priceCurrency": "CNY",
    "coverUrl": "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80%2Cw_600/skym90dx4rx42jofovsh/MY24TranceXAdvanced0_ColorABlueDragonfly.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 87.4,
    "brand": {
      "slug": "giant",
      "name": "Giant",
      "nameCn": "捷安特"
    },
    "categorySlug": "mtb",
    "specs": {
      "bikeType": "trail",
      "frameMaterial": "Advanced-Grade Composite",
      "wheelSize": "前 29\"；后 29\" 或 27.5\" Mullet",
      "geometryNote": "Giant Trance X 官方页面给出三档 Flip Chip 几何；当前保留官方角度范围与轮径选项，Stack、Reach 和不同尺码完整表待补齐。",
      "frontTravel": 150,
      "rearTravel": 140,
      "suspension": "FOX 36 Factory GRIP2 150mm + Giant Maestro 140mm",
      "groupset": "SRAM XO T-Type AXS",
      "drivetrain": "1x12，30T",
      "brakes": "hydraulic-disc",
      "wheelset": "Giant TRX 碳纤轮组，30mm 内宽",
      "tireSize": "前 29\"；后 29\" / 27.5\"（按设定）",
      "dropper": "按尺码与配置",
      "scenes": [
        "trail",
        "climbing",
        "descending",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "全能林道 Trail"
      },
      {
        "key": "frontTravel",
        "label": "前叉行程",
        "value": "150mm"
      },
      {
        "key": "rearTravel",
        "label": "后避震行程",
        "value": "140mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "林道 Trail · 爬坡 · 下坡 · 全山地"
      }
    ]
  },
  {
    "id": "01a0be38-1af6-7a12-9732-c75694865cbb",
    "slug": "giant-xtc-advanced-29-1-2026",
    "title": "Giant XTC Advanced 29 1",
    "model": "XTC Advanced 29 1",
    "year": 2026,
    "oneLiner": "100mm 前叉、碳纤硬尾和 XT 1x12 传动，面向高效率 XC 爬坡与越野路线。",
    "priceMin": 28800,
    "priceMax": 28800,
    "priceCurrency": "CNY",
    "coverUrl": "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_600%2Cq_80%2Cw_800/qrpefgqfjrzq6x21nwsw/MY26XTCAdvanced291_ColorAAbyssBlack_Bronze.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 79.9,
    "brand": {
      "slug": "giant",
      "name": "Giant",
      "nameCn": "捷安特"
    },
    "categorySlug": "mtb",
    "specs": {
      "bikeType": "hardtail",
      "frameMaterial": "Advanced-grade Composite",
      "wheelSize": "29\"",
      "geometryNote": "Giant XTC Advanced 29 官方几何表；硬尾车的有效骑姿还会明显受前叉下沉量和把位影响。",
      "frontTravel": 100,
      "rearTravel": 0,
      "suspension": "Fox 32 Float Step Cast Performance 100mm，双档锁定",
      "groupset": "Shimano Deore XT M8100",
      "drivetrain": "1x12，10-51T，32T",
      "brakes": "hydraulic-disc",
      "wheelset": "Giant XCR 2 Carbon 29 WheelSystem",
      "tireSize": "前 29x2.4\"；后 29x2.25\"",
      "dropper": "Giant Contact Switch Core，100 / 120mm（按尺码）",
      "scenes": [
        "cross-country",
        "climbing",
        "trail"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "硬尾越野"
      },
      {
        "key": "frontTravel",
        "label": "前叉行程",
        "value": "100mm"
      },
      {
        "key": "rearTravel",
        "label": "后避震行程",
        "value": "0mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "越野 XC · 爬坡 · 林道 Trail"
      }
    ]
  },
  {
    "id": "01a0be38-1b07-749d-9bae-87a3c842b147",
    "slug": "specialized-s-works-epic-8-2026",
    "title": "Specialized S-Works Epic 8",
    "model": "S-Works Epic 8",
    "year": 2026,
    "oneLiner": "120mm XC 全避震、FACT 12m 碳纤车架和 Flight Attendant 电子悬挂，服务于竞赛与高速越野。",
    "priceMin": 108000,
    "priceMax": 108000,
    "priceCurrency": "CNY",
    "coverUrl": "https://assets.specialized.com/i/specialized/90326-00_EPIC-8-SW-CARB-BLUPRL-METWHTSIL_HERO-SQUARE",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 85.5,
    "brand": {
      "slug": "specialized",
      "name": "Specialized",
      "nameCn": "闪电"
    },
    "categorySlug": "mtb",
    "specs": {
      "bikeType": "xc",
      "frameMaterial": "S-Works FACT 12m Carbon",
      "completeWeight": 10,
      "wheelSize": "29\"",
      "geometryNote": "Specialized S-Works Epic 8 官方页面列出 S/M/L/XL 尺码；当前内容只接入尺码选项，Stack、Reach 等完整几何待官方表格补齐。",
      "frontTravel": 120,
      "rearTravel": 120,
      "suspension": "RockShox SID Ultimate + SIDLuxe Ultimate Flight Attendant",
      "groupset": "SRAM XX SL Eagle AXS",
      "drivetrain": "1x12，10-52T，34T",
      "brakes": "hydraulic-disc",
      "wheelset": "Roval Control World Cup 碳纤轮组",
      "tireSize": "29x2.35\"",
      "dropper": "RockShox Reverb AXS，125 / 150 / 175mm（按尺码）",
      "scenes": [
        "cross-country",
        "climbing",
        "trail"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "越野竞赛 XC"
      },
      {
        "key": "completeWeight",
        "label": "整车重量",
        "value": "10kg"
      },
      {
        "key": "frontTravel",
        "label": "前叉行程",
        "value": "120mm"
      },
      {
        "key": "rearTravel",
        "label": "后避震行程",
        "value": "120mm"
      }
    ]
  },
  {
    "id": "01a0be38-1b19-7170-b303-3d9fed87ff41",
    "slug": "specialized-stumpjumper-15-comp-2025",
    "title": "Specialized Stumpjumper 15 Comp",
    "model": "Stumpjumper 15 Comp",
    "year": 2025,
    "oneLiner": "GENIE 后避震、145mm 后行程和可变几何，把短行程效率与林道下坡的控制感放在一起。",
    "priceMin": 36000,
    "priceMax": 36000,
    "priceCurrency": "CNY",
    "coverUrl": "https://assets.specialized.com/i/specialized/93325-50_SJ-15-COMP-SEA-SILDST_HERO-SQUARE",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 89.1,
    "brand": {
      "slug": "specialized",
      "name": "Specialized",
      "nameCn": "闪电"
    },
    "categorySlug": "mtb",
    "specs": {
      "bikeType": "trail",
      "frameMaterial": "FACT 11m Carbon",
      "completeWeight": 14.87,
      "wheelSize": "前 29\"；后轮按尺码 27.5\" / 29\"",
      "geometryNote": "Specialized Stumpjumper 15 官方尺码表；S1 前叉为 140mm，S2–S6 为 150mm，最终几何需按具体调节与轮径确认。",
      "frontTravel": 150,
      "rearTravel": 145,
      "suspension": "FOX Float 36 Rhythm 前叉 + FOX Float Performance GENIE 后避震",
      "groupset": "SRAM S-1000 Eagle T-Type AXS",
      "drivetrain": "1x12，10-52T",
      "brakes": "hydraulic-disc",
      "wheelset": "Specialized 铝合金轮组，30mm 内宽，真空胎准备",
      "tireSize": "前 29x2.3\"；后轮按尺码 27.5 / 29",
      "dropper": "X-Fusion Manic 升降座管",
      "scenes": [
        "trail",
        "climbing",
        "descending",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "全能林道 Trail"
      },
      {
        "key": "completeWeight",
        "label": "整车重量",
        "value": "14.87kg"
      },
      {
        "key": "frontTravel",
        "label": "前叉行程",
        "value": "150mm"
      },
      {
        "key": "rearTravel",
        "label": "后避震行程",
        "value": "145mm"
      }
    ]
  },
  {
    "id": "01a0be38-1b36-7ede-95f4-fcbcc81d8343",
    "slug": "canyon-aeroad-cf-slx-7-di2-2027",
    "title": "Canyon Aeroad CF SLX 7 Di2",
    "model": "Aeroad CF SLX 7 Di2",
    "year": 2027,
    "oneLiner": "以空力车架、65mm 碳纤轮组和 105 Di2 为主轴，适合把平路速度和竞赛姿态放在第一位的骑手。",
    "priceMin": 35993,
    "priceMax": 35993,
    "priceCurrency": "CNY",
    "coverUrl": "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/b_rgb:F2F2F2/f_jpg/q_auto/v1777532962/2027_FULL_aeroad_cf-slx-7-di2_4531_R107_P01_zsqbop",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 82.7,
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": "佳能道"
    },
    "categorySlug": "road-bike",
    "specs": {
      "bikeType": "aero",
      "frameMaterial": "Carbon (CF SLX)",
      "frameWeight": 1050,
      "completeWeight": 7.96,
      "tireClearance": 32,
      "geometryNote": "Canyon Aeroad CF SLX 官方几何表；Aeroad 的把组宽度与座垫高度也会影响最终骑行姿势。",
      "groupset": "Shimano 105 Di2，带 4iiii 功率计",
      "drivetrain": "2x12",
      "brakes": "hydraulic-disc",
      "wheelset": "DT Swiss ARC 1600，65mm 碳纤轮组",
      "gearRange": "105 Di2，竞赛取向",
      "fit": "PACE 可调一体式把组，偏空力竞赛",
      "scenes": [
        "racing",
        "group-ride"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "空力竞赛"
      },
      {
        "key": "frameWeight",
        "label": "车架重量",
        "value": "1050g"
      },
      {
        "key": "completeWeight",
        "label": "整车重量",
        "value": "7.96kg"
      },
      {
        "key": "tireClearance",
        "label": "最大胎宽",
        "value": "32mm"
      }
    ]
  },
  {
    "id": "01a0be38-1b55-78b8-be4d-a116d692a4fc",
    "slug": "canyon-endurace-cf-7-2027",
    "title": "Canyon Endurace CF 7",
    "model": "Endurace CF 7",
    "year": 2027,
    "oneLiner": "以碳纤车架、38mm 胎容和 Shimano 105 机械套件为核心，适合把舒适和效率放在一起的长距离公路骑行。",
    "priceMin": 21593,
    "priceMax": 21593,
    "priceCurrency": "CNY",
    "coverUrl": "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1779435706/2027_FULL_endurace_cf-7_4627_R129_P01_okspta",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 85,
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": "佳能道"
    },
    "categorySlug": "road-bike",
    "specs": {
      "bikeType": "endurance",
      "frameMaterial": "Carbon (CF)",
      "frameWeight": 1080,
      "tireClearance": 38,
      "geometryNote": "Canyon Endurace CF 官方几何表；Endurace CF 7 与 CF 7 Di2 使用同一车架平台，配置与价格仍需分别核对。",
      "groupset": "Shimano 105 RD-R7100 12s",
      "drivetrain": "2x12，50/34，11-36",
      "brakes": "hydraulic-disc",
      "wheelset": "DT Swiss Endurance LN，铝合金",
      "gearRange": "11-36T / 50-34T",
      "fit": "Sport Geometry，偏舒适的长途设定",
      "scenes": [
        "endurance",
        "all-road",
        "group-ride"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "耐力长途"
      },
      {
        "key": "frameWeight",
        "label": "车架重量",
        "value": "1080g"
      },
      {
        "key": "tireClearance",
        "label": "最大胎宽",
        "value": "38mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "长途耐力 · 泛铺装 · 团骑"
      }
    ]
  },
  {
    "id": "01a0be38-1b6b-726b-86d2-9abc0d0a0297",
    "slug": "canyon-endurace-cf-7-di2-2027",
    "title": "Canyon Endurace CF 7 Di2",
    "model": "Endurace CF 7 Di2",
    "year": 2027,
    "oneLiner": "在 Endurace 的耐力几何和 38mm 胎容上换用 Shimano 105 Di2，适合长途团骑与日常训练。",
    "priceMin": 25913,
    "priceMax": 25913,
    "priceCurrency": "CNY",
    "coverUrl": "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1777355662/2027_FULL_endurace_cf-7-di2_4421_R129_P01_oopfry",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 85.4,
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": "佳能道"
    },
    "categorySlug": "road-bike",
    "specs": {
      "bikeType": "endurance",
      "frameMaterial": "Carbon (CF)",
      "frameWeight": 1080,
      "tireClearance": 38,
      "geometryNote": "Canyon Endurace CF 官方几何表；Endurace CF 7 与 CF 7 Di2 使用同一车架平台，配置与价格仍需分别核对。",
      "groupset": "Shimano 105 Di2",
      "drivetrain": "2x12，50/34，11-36",
      "brakes": "hydraulic-disc",
      "wheelset": "DT Swiss Endurance LN，铝合金",
      "gearRange": "11-36T / 50-34T",
      "fit": "Sport Geometry，偏舒适的长途设定",
      "scenes": [
        "endurance",
        "all-road",
        "group-ride"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "耐力长途"
      },
      {
        "key": "frameWeight",
        "label": "车架重量",
        "value": "1080g"
      },
      {
        "key": "tireClearance",
        "label": "最大胎宽",
        "value": "38mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "长途耐力 · 泛铺装 · 团骑"
      }
    ]
  },
  {
    "id": "01a0be38-1b7d-7a7f-aa50-83a3ab66e485",
    "slug": "giant-defy-advanced-2-2026",
    "title": "Giant Defy Advanced 2",
    "model": "Defy Advanced 2",
    "year": 2026,
    "oneLiner": "以 Advanced 级碳纤车架、40mm 最大胎容和 Shimano 105 为核心，适合长途、烂路和不想被姿势拖累的骑手。",
    "priceMin": 23760,
    "priceMax": 23760,
    "priceCurrency": "CNY",
    "coverUrl": "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80/ln09xatfxrvyqelva1lt/MY26DefyAdvanced2_ColorAAbyssBlack.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 84.8,
    "brand": {
      "slug": "giant",
      "name": "Giant",
      "nameCn": "捷安特"
    },
    "categorySlug": "road-bike",
    "specs": {
      "bikeType": "endurance",
      "frameMaterial": "Advanced-grade Composite",
      "tireClearance": 40,
      "geometryNote": "Giant Defy Advanced 2 官方几何表；Giant 建议结合身高、内长与经销商尺寸向导确认。",
      "groupset": "Shimano 105",
      "drivetrain": "2x12，50/34，11-36",
      "brakes": "hydraulic-disc",
      "wheelset": "Giant P-R1 Disc，铝合金",
      "gearRange": "11-36T / 50-34T",
      "fit": "D-Fuse 车把与座杆，耐力长途设定",
      "scenes": [
        "endurance",
        "all-road",
        "group-ride"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "耐力长途"
      },
      {
        "key": "tireClearance",
        "label": "最大胎宽",
        "value": "40mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "长途耐力 · 泛铺装 · 团骑"
      }
    ]
  },
  {
    "id": "01a0be38-1b8d-763b-a1b8-3c6fe7095442",
    "slug": "giant-propel-advanced-pro-0-axs-2027",
    "title": "Giant Propel Advanced Pro 0 AXS",
    "model": "Propel Advanced Pro 0 AXS",
    "year": 2027,
    "oneLiner": "以 50mm 碳纤轮组、空力一体把组和 SRAM Force AXS 为核心，面向平路高速、冲刺和竞赛节奏。",
    "priceMin": 56160,
    "priceMax": 56160,
    "priceCurrency": "CNY",
    "coverUrl": "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80%2Cw_600/u9r0a1uqpr0rustxbxbn/MY27PropelAdvancedPro0-AXS_ColorAObsidianPulse.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 83.7,
    "brand": {
      "slug": "giant",
      "name": "Giant",
      "nameCn": "捷安特"
    },
    "categorySlug": "road-bike",
    "specs": {
      "bikeType": "aero",
      "frameMaterial": "Advanced-grade Composite",
      "geometryNote": "Giant Propel Advanced Pro 2027 官方几何表；一体式把组的宽度、把立和座杆设定需在购买前确认。",
      "groupset": "SRAM Force AXS E1，带功率计",
      "drivetrain": "2x12，35/48",
      "brakes": "hydraulic-disc",
      "wheelset": "Giant SLR 0 50 Carbon WheelSystem",
      "gearRange": "SRAM Force AXS，空力竞赛取向",
      "fit": "Vector 复合座杆与一体式空力把组",
      "scenes": [
        "racing",
        "group-ride"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "空力竞赛"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "竞赛 · 团骑"
      }
    ]
  },
  {
    "id": "01a0be38-1ba1-7f54-9d09-74b85dcde7c9",
    "slug": "giant-tcr-advanced-pro-0-axs-2026",
    "title": "Giant TCR Advanced Pro 0 AXS",
    "model": "TCR Advanced Pro 0 AXS",
    "year": 2026,
    "oneLiner": "以 Advanced 级碳纤车架、SRAM Force AXS 和功率计构成均衡竞赛平台，适合爬坡、下坡和全能团骑。",
    "priceMin": 50400,
    "priceMax": 50400,
    "priceCurrency": "CNY",
    "coverUrl": "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80/jtismbbz7rrw6bsjelem/MY26TCRAdvancedPro0-AXS_ColorACarbon.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 86.9,
    "brand": {
      "slug": "giant",
      "name": "Giant",
      "nameCn": "捷安特"
    },
    "categorySlug": "road-bike",
    "specs": {
      "bikeType": "race",
      "frameMaterial": "Advanced-grade Composite",
      "geometryNote": "Giant TCR Advanced Pro 官方几何表；竞赛姿势对把位和坐垫高度更敏感，不能只按身高单项决定。",
      "groupset": "SRAM Force AXS E1，带 Quarq 功率计",
      "drivetrain": "2x12，35/48",
      "brakes": "hydraulic-disc",
      "wheelset": "Giant SLR 碳纤轮组",
      "gearRange": "SRAM Force AXS，竞赛取向",
      "fit": "TCR 综合竞赛几何",
      "scenes": [
        "racing",
        "climbing",
        "group-ride"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "综合竞赛"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "竞赛 · 爬坡 · 团骑"
      }
    ]
  },
  {
    "id": "01a0be38-1bb4-78f8-b465-cb364362fe96",
    "slug": "specialized-s-works-tarmac-sl8-red-axs-2026",
    "title": "Specialized S-Works Tarmac SL8 SRAM RED AXS",
    "model": "S-Works Tarmac SL8 SRAM RED AXS",
    "year": 2026,
    "oneLiner": "以 FACT 12r 车架、6.62kg 官方参考重量和 Quarq 功率计组成旗舰竞赛车，优先服务轻量、爬坡和高强度训练。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://assets.specialized.com/i/specialized/94926-02_TARMAC-SL8-SW-AXS-PRMFJDMET-METWHT_HERO-SQUARE",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 86.6,
    "brand": {
      "slug": "specialized",
      "name": "Specialized",
      "nameCn": "闪电"
    },
    "categorySlug": "road-bike",
    "specs": {
      "bikeType": "race",
      "frameMaterial": "S-Works Tarmac SL8 FACT 12r Carbon",
      "completeWeight": 6.62,
      "geometryNote": "Specialized Tarmac SL8 官方几何表；官方页面未在同一表格中给出骑手身高区间，因此这里保留车架尺码、Stack、Reach 和头管角。",
      "groupset": "SRAM RED AXS E1，带 Quarq 功率计",
      "drivetrain": "2x12，48/35，10-33",
      "brakes": "hydraulic-disc",
      "wheelset": "Roval Rapide CLX III，碳纤轮组",
      "gearRange": "10-33T / 48-35T",
      "fit": "Rider First Engineered，轻量竞赛取向",
      "scenes": [
        "racing",
        "climbing",
        "group-ride"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "综合竞赛"
      },
      {
        "key": "completeWeight",
        "label": "整车重量",
        "value": "6.62kg"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "竞赛 · 爬坡 · 团骑"
      }
    ]
  },
  {
    "id": "01a0be38-1bc4-7826-92a4-5e5404d990a5",
    "slug": "specialized-tarmac-sl8-comp-rival-axs-2026",
    "title": "Specialized Tarmac SL8 Comp SRAM Rival AXS",
    "model": "Tarmac SL8 Comp SRAM Rival AXS",
    "year": 2026,
    "oneLiner": "用 FACT 10r 碳纤车架和 SRAM Rival AXS 覆盖竞赛、公路爬坡与团骑，是一台强调速度也保留日常可用性的竞赛车。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://assets.specialized.com/i/specialized/94926-54_TARMAC-SL8-COMP-AXS-CARB-WHT_HERO-SQUARE",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 85.8,
    "brand": {
      "slug": "specialized",
      "name": "Specialized",
      "nameCn": "闪电"
    },
    "categorySlug": "road-bike",
    "specs": {
      "bikeType": "race",
      "frameMaterial": "Tarmac SL8 FACT 10r Carbon",
      "geometryNote": "Specialized Tarmac SL8 官方几何表；官方页面未在同一表格中给出骑手身高区间，因此这里保留车架尺码、Stack、Reach 和头管角。",
      "groupset": "SRAM Rival AXS E1",
      "drivetrain": "2x12，48/35，10-36",
      "brakes": "hydraulic-disc",
      "wheelset": "DT Swiss R470，支持真空胎",
      "gearRange": "10-36T / 48-35T",
      "fit": "Rider First Engineered，竞赛取向",
      "scenes": [
        "racing",
        "climbing",
        "group-ride"
      ]
    },
    "highlights": [
      {
        "key": "bikeType",
        "label": "车型取向",
        "value": "综合竞赛"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "竞赛 · 爬坡 · 团骑"
      }
    ]
  },
  {
    "id": "01a0e673-7377-7658-b02f-ffac20ad94b0",
    "slug": "decathlon-snb-500-ziprotect-jacket-2026",
    "title": "Men’s Warm and Durable Snowboard Jacket SNB 500 Ziprotect - Camel and Black | Decathlon",
    "model": "SNB 500 Ziprotect Men's Snowboard Jacket",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2704355/k%243bbcff8c29e8445fef3bb62d38588b81/picture.jpg?f=3000x0&format=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "skiing-apparel",
    "specs": {
      "garmentType": "jacket",
      "waterproofMm": 10000,
      "insulation": "100 g/m² body / 80 g/m² sleeves synthetic wadding",
      "fit": "loose",
      "seamTaping": "fully-taped",
      "powderSkirt": true,
      "helmetCompatibleHood": true,
      "fabric": "100.0% Polyamide",
      "skiPassPocket": true,
      "ziprotectCompatible": true
    },
    "highlights": [
      {
        "key": "garmentType",
        "label": "款式",
        "value": "滑雪夹克"
      },
      {
        "key": "waterproofMm",
        "label": "防水指数",
        "value": "10000mm"
      },
      {
        "key": "fit",
        "label": "版型",
        "value": "宽松长款"
      },
      {
        "key": "seamTaping",
        "label": "压胶",
        "value": "全压胶"
      }
    ]
  },
  {
    "id": "01a0e673-7b30-71da-802d-4473935b6d25",
    "slug": "kailas-bm45-gtx-ski-pants-2026",
    "title": "Kailas BM45 GTX Ski Pants – kailasgear.com",
    "model": "BM45 GTX Ski Pants",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://kailasgear.com/cdn/shop/files/KG2541316_-1.webp?v=1786154508&width=1090",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "kailas",
      "name": "KAILAS",
      "nameCn": "凯乐石"
    },
    "categorySlug": "skiing-apparel",
    "specs": {
      "garmentType": "pants",
      "construction": "3L",
      "fit": "relaxed",
      "venting": true,
      "recco": true,
      "fabric": "75D 3L GORE-TEX",
      "suspenders": true,
      "corduraReinforced": true,
      "articulatedKnees": true
    },
    "highlights": [
      {
        "key": "garmentType",
        "label": "款式",
        "value": "滑雪裤"
      },
      {
        "key": "construction",
        "label": "面料层数",
        "value": "三层"
      },
      {
        "key": "fit",
        "label": "版型",
        "value": "宽松"
      },
      {
        "key": "venting",
        "label": "通风拉链",
        "value": "是"
      }
    ]
  },
  {
    "id": "01a0e673-87de-7256-90ba-09ece94c4711",
    "slug": "kailas-bm45-max-mens-down-jacket-95g-2026",
    "title": "Kailas BM45 MAX Down Ski Jacket Men's – kailasgear.com",
    "model": "BM45 MAX Down Ski Jacket Men's",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://kailasgear.com/cdn/shop/files/KG2531144_-2.webp?v=1786155291&width=1090",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "kailas",
      "name": "KAILAS",
      "nameCn": "凯乐石"
    },
    "categorySlug": "skiing-apparel",
    "specs": {
      "garmentType": "jacket",
      "construction": "3L",
      "insulation": "95g 800FP down",
      "fit": "athletic-y-cut",
      "version": "regular",
      "venting": true,
      "recco": true,
      "helmetCompatibleHood": true,
      "fabric": "40D 3L GORE-TEX",
      "skiPassPocket": true
    },
    "highlights": [
      {
        "key": "garmentType",
        "label": "款式",
        "value": "滑雪夹克"
      },
      {
        "key": "construction",
        "label": "面料层数",
        "value": "三层"
      },
      {
        "key": "fit",
        "label": "版型",
        "value": "Y 型运动剪裁"
      },
      {
        "key": "venting",
        "label": "通风拉链",
        "value": "是"
      }
    ]
  },
  {
    "id": "01a0e673-82cc-71c0-a3bf-d48b05d159f4",
    "slug": "kailas-bm45-max-mens-down-jacket-100g-2026",
    "title": "Kailas BM45 MAX Down Ski Jacket Men's – kailasgear.com",
    "model": "BM45 MAX Down Ski Jacket Men's (100g 800FP Long)",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://kailasgear.com/cdn/shop/files/KG2531143_-2_b8218766-076d-4227-a5bc-7a9d33c6bade.webp?v=1786155711&width=1090",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "kailas",
      "name": "KAILAS",
      "nameCn": "凯乐石"
    },
    "categorySlug": "skiing-apparel",
    "specs": {
      "garmentType": "jacket",
      "construction": "3L",
      "insulation": "100g 800FP down",
      "fit": "athletic-h-cut",
      "version": "long",
      "venting": true,
      "powderSkirt": true,
      "recco": true,
      "helmetCompatibleHood": true,
      "fabric": "40D 3L GORE-TEX",
      "skiPassPocket": true
    },
    "highlights": [
      {
        "key": "garmentType",
        "label": "款式",
        "value": "滑雪夹克"
      },
      {
        "key": "construction",
        "label": "面料层数",
        "value": "三层"
      },
      {
        "key": "fit",
        "label": "版型",
        "value": "H 型运动剪裁"
      },
      {
        "key": "venting",
        "label": "通风拉链",
        "value": "是"
      }
    ]
  },
  {
    "id": "01a0e673-8d97-7609-8ae2-1c5d94c3c50c",
    "slug": "kailas-bm45-max-womens-down-jacket-95g-2026",
    "title": "Kailas BM45 MAX Down Ski Jacket Women's – kailasgear.com",
    "model": "BM45 MAX Down Ski Jacket Women's",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://kailasgear.com/cdn/shop/files/KG2531244_-2.webp?v=1786156036&width=1090",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "kailas",
      "name": "KAILAS",
      "nameCn": "凯乐石"
    },
    "categorySlug": "skiing-apparel",
    "specs": {
      "garmentType": "jacket",
      "construction": "3L",
      "insulation": "95g 800FP down",
      "fit": "athletic-y-cut",
      "venting": true,
      "powderSkirt": true,
      "recco": true,
      "helmetCompatibleHood": true,
      "fabric": "40D 3L GORE-TEX",
      "skiPassPocket": true
    },
    "highlights": [
      {
        "key": "garmentType",
        "label": "款式",
        "value": "滑雪夹克"
      },
      {
        "key": "construction",
        "label": "面料层数",
        "value": "三层"
      },
      {
        "key": "fit",
        "label": "版型",
        "value": "Y 型运动剪裁"
      },
      {
        "key": "venting",
        "label": "通风拉链",
        "value": "是"
      }
    ]
  },
  {
    "id": "01a0e68e-2624-7dee-8062-6ca6920c7285",
    "slug": "kailas-bm45-pro-ski-bibs-unisex-2026",
    "title": "Kailas BM45 PRO Ski Bibs Unisex – kailasgear.com",
    "model": "BM45 PRO Ski Bibs Unisex",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0535/8433/0946/files/GJGW-KG2541314_5-4.webp?v=1786154017&width=800",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "kailas",
      "name": "KAILAS",
      "nameCn": "凯乐石"
    },
    "categorySlug": "skiing-apparel",
    "specs": {
      "garmentType": "bib-pants",
      "construction": "3L",
      "fit": "relaxed",
      "venting": true,
      "recco": true,
      "fabric": "100D 3L GORE-TEX Pro",
      "suspenders": true,
      "corduraReinforced": true,
      "articulatedKnees": true
    },
    "highlights": [
      {
        "key": "garmentType",
        "label": "款式",
        "value": "背带滑雪裤"
      },
      {
        "key": "construction",
        "label": "面料层数",
        "value": "三层"
      },
      {
        "key": "fit",
        "label": "版型",
        "value": "宽松"
      },
      {
        "key": "venting",
        "label": "通风拉链",
        "value": "是"
      }
    ]
  },
  {
    "id": "01a0d24d-2549-76c5-9d96-0c3ce4a27b77",
    "slug": "atomic-bent-chetler-120-2026",
    "title": "Atomic Bent Chetler 120 2025/26",
    "model": "Bent Chetler 120",
    "year": 2026,
    "oneLiner": "Atomic 粉雪自由滑旗舰型号，采用 120 mm 板腰与 HRZN 3D 板头板尾设计。",
    "priceMin": 7998,
    "priceMax": 7998,
    "priceCurrency": "CNY",
    "coverUrl": "https://img01.yzcdn.cn/upload_files/2025/11/13/Fr2lMa7Do18CLAjnbPkfJR0T4WbI.png%21middle.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "176 / 184 / 192 cm",
      "waistWidth": 120,
      "turnRadius": 19,
      "turnRadiusReferenceLength": "184 cm",
      "terrain": "粉雪 / 全山地自由滑",
      "skierLevel": "进阶至专家",
      "bindingSetup": "裸板，不含固定器"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "120mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "19m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "粉雪 / 全山地自由滑"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶至专家"
      }
    ]
  },
  {
    "id": "01a0d22f-e32a-7eb7-8806-80a40991f07a",
    "slug": "atomic-redster-q7-2026",
    "title": "Atomic Redster Q7 Revoshock C 2025/26",
    "model": "Redster Q7 Revoshock C",
    "year": 2026,
    "oneLiner": "Redster Q 系列雪道板，官方目录列出 153–181 cm 尺寸范围。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.amersports.com/017bc76f-f5cc-42b8-a786-b49f00cdff46/ATP_AASS03788_0_GHO_Redster_Q7_Mi12_GW_FullImageWebOptimized.png?fit=bounds&format=auto&height=10380&quality=80&width=1445",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "153 / 160 / 167 / 174 / 181 cm",
      "waistWidth": 75,
      "turnRadius": 11.8,
      "turnRadiusReferenceLength": "153 cm",
      "terrain": "雪道 / 全地域",
      "skierLevel": "中级至进阶",
      "bindingSetup": "含 MI 12 GW 固定器"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "75mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "11.8m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全地域"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e354-73aa-9b00-21d1d8d7cfc5",
    "slug": "atomic-redster-q7-8-2026",
    "title": "Atomic Redster Q7.8 Revoshock C 2025/26",
    "model": "Redster Q7.8 Revoshock C",
    "year": 2026,
    "oneLiner": "Redster Q 系列雪道板，官方目录列出多档板长并配 MI 12 GW 固定器。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.amersports.com/8fd450be-84c9-4bed-b255-b49f00cdfdd0/ATP_AASS03786_0_GHO_Redster_Q7.8_Mi12_GW_FullImageWebOptimized.png?fit=bounds&format=auto&height=10380&quality=80&width=1445",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "159 / 166 / 173 / 181 cm",
      "waistWidth": 84,
      "turnRadius": 13.6,
      "turnRadiusReferenceLength": "166 cm",
      "terrain": "雪道 / 全地域",
      "skierLevel": "中级至進阶",
      "bindingSetup": "含 MI 12 GW 固定器"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "84mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "13.6m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全地域"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至進阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e363-7c04-b588-66d62d5e884c",
    "slug": "atomic-redster-q9-2026",
    "title": "Atomic Redster Q9 Revoshock S 2025/26",
    "model": "Redster Q9 Revoshock S",
    "year": 2026,
    "oneLiner": "Redster Q 系列雪道板，官方目录列出 153–181 cm 尺寸范围。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.amersports.com/0acef4a9-61b7-47b0-84f4-b49f00cdfc5f/ATP_AASS03784_0_GHO_Redster_Q9_I12_GW_FullImageWebOptimized.png?fit=bounds&format=auto&height=10380&quality=80&width=1445",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "153 / 160 / 167 / 174 / 181 cm",
      "waistWidth": 75,
      "turnRadius": 12.6,
      "turnRadiusReferenceLength": "160 cm",
      "terrain": "雪道 / 全地域",
      "skierLevel": "进阶",
      "bindingSetup": "含 I 12 GW 固定器套装"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "75mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "12.6m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全地域"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e384-7641-93ea-727a2b636323",
    "slug": "atomic-redster-q9-8-2026",
    "title": "Atomic Redster Q9.8 Revoshock S 2025/26",
    "model": "Redster Q9.8 Revoshock S",
    "year": 2026,
    "oneLiner": "Atomic Redster 雪道全能系列，官方商品目录列出多种板长与固定器配置。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.amersports.com/59174f3d-d998-49a3-ae2a-b49f00cdfb23/ATP_AASS03782_0_GHO_Redster_Q9.8_I12_GW_FullImageWebOptimized.png?fit=bounds&format=auto&height=10380&quality=80&width=1445",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "159 / 166 / 173 / 181 cm",
      "waistWidth": 84,
      "turnRadius": 13.6,
      "turnRadiusReferenceLength": "166 cm",
      "terrain": "雪道 / 全地域",
      "skierLevel": "进阶",
      "bindingSetup": "含 X 12 GW 或 I 12 GW 固定器套装，依 SKU 区分"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "84mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "13.6m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全地域"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e394-75fa-a0db-7dbb481412b5",
    "slug": "atomic-redster-s9-2026",
    "title": "Atomic Redster S9 Revoshock S 2025/26",
    "model": "Redster S9 Revoshock S",
    "year": 2026,
    "oneLiner": "Atomic Redster 官方目录中的雪道竞速小回转型号。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.amersports.com/47a56e73-6422-4d40-bcf3-b4bf00ada651/ATP_AASS03628_0_GHO_REDSTER_S9_RVSK_S_I12_GW_FullImageWebOptimized.png?fit=bounds&format=auto&height=10380&quality=80&width=1445",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "155 / 160 / 165 / 170 cm",
      "waistWidth": 68,
      "turnRadius": 12.5,
      "turnRadiusReferenceLength": "165 cm",
      "terrain": "雪道 / 竞速 / 小回转",
      "skierLevel": "进阶",
      "bindingSetup": "含 I 12 GW 固定器套装"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "68mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "12.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 竞速 / 小回转"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e3b1-746d-92bb-de33748b182f",
    "slug": "head-e-slr-2026",
    "title": "HEAD Worldcup Rebels e.SLR 2025/26",
    "model": "e.SLR",
    "year": 2026,
    "oneLiner": "京东海德雪板排行出现的民用小回转型号，定位偏雪道 carving。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn-mdb.head.com/CDN3/D/313365.SET_WO/4/1820x2428/worldcup-rebels-e-slr-without-binding.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "149 / 156 / 163 / 170 cm",
      "waistWidth": 66,
      "turnRadius": 11.2,
      "turnRadiusReferenceLength": "163 cm",
      "terrain": "雪道 / 小回转",
      "skierLevel": "中级至进阶",
      "bindingSetup": "雪板+固定器，按具体 SKU 核对"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "66mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "11.2m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 小回转"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e3bd-7b6b-afec-367232f53145",
    "slug": "head-easy-joy-r-2026",
    "title": "HEAD EASY JOY R 2025/26",
    "model": "EASY JOY R",
    "year": 2026,
    "oneLiner": "面向女性滑手的轻量雪道系列；板长、固定器和雪季款式需按具体商品确认。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn-mdb.head.com/CDN3/D/316485/1/1820x2428/easy-joy-r.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "143 / 148 / 153 / 158 / 163 cm",
      "waistWidth": 70,
      "turnRadius": 13.3,
      "turnRadiusReferenceLength": "163 cm",
      "terrain": "雪道",
      "skierLevel": "入门至进阶",
      "bindingSetup": "常见雪板+固定器套装，按具体 SKU 核对"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "70mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "13.3m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "入门至进阶"
      }
    ]
  },
  {
    "id": "01a0d24d-3a66-7284-abbf-cf425b16e010",
    "slug": "head-shape-e-v5-2026",
    "title": "HEAD Shape e-V5 2025/26",
    "model": "Shape e-V5",
    "year": 2026,
    "oneLiner": "HEAD Shape 雪道系列型号，采用 74 mm 板腰与前摇设计，定位于雪道巡航与 carving。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.outdoorsports.com/cdn/shop/files/Head-Shape_e.V5-Mens-2026_TIPS_1200x.png?v=1755546338",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "149 / 156 / 163 / 170 / 177 cm",
      "waistWidth": 74,
      "turnRadius": 13,
      "turnRadiusReferenceLength": "170 cm",
      "terrain": "雪道 / carving",
      "skierLevel": "中级至进阶",
      "bindingSetup": "PR 11 GW 系统固定器套装"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "74mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "13m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / carving"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e3c8-7049-b4c6-2ad4e0dcb9c7",
    "slug": "head-shape-v2-2026",
    "title": "HEAD Shape V2 2025/26",
    "model": "Shape V2",
    "year": 2026,
    "oneLiner": "京东双板榜单中的热门入门全地域系列；套装评价仅作国内关注度参考。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://img-cdn.heureka.group/v1/d23ae16d-8f92-56f6-a776-2ace62a9bcb1.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "149 / 156 / 163 / 170 / 177 cm",
      "waistWidth": 70,
      "turnRadius": 12.5,
      "turnRadiusReferenceLength": "170 cm",
      "terrain": "全地域 / 雪道",
      "skierLevel": "入门至初中级",
      "bindingSetup": "雪板+固定器或套装，按具体 SKU 核对"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "70mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "12.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全地域 / 雪道"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "入门至初中级"
      }
    ]
  },
  {
    "id": "01a0d22f-e3d4-7ba8-b3a3-1702f0728e63",
    "slug": "head-shape-v2-r-2026",
    "title": "HEAD Shape V2 R 2025/26",
    "model": "Shape V2 R",
    "year": 2026,
    "oneLiner": "HEAD V-shape 入门全地域系列；国内平台存在板+固定器销售款。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn-mdb.head.com/CDN3/D/316225/1/1820x2428/shape-v2-r.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "142 / 149 / 156 / 163 / 170 / 177 cm",
      "waistWidth": 70,
      "turnRadius": 12.5,
      "turnRadiusReferenceLength": "170 cm",
      "terrain": "全地域 / 雪道",
      "skierLevel": "入门至初中级",
      "bindingSetup": "雪板+固定器，按具体 SKU 核对"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "70mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "12.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全地域 / 雪道"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "入门至初中级"
      }
    ]
  },
  {
    "id": "01a0d22f-e3e0-720b-b6a2-80dadb5ac493",
    "slug": "head-supershape-e-magnum-2026",
    "title": "HEAD Supershape e-Magnum 2025/26",
    "model": "Supershape e-Magnum",
    "year": 2026,
    "oneLiner": "HEAD Supershape 雪道系列，官方产品页列出 149–177 cm 多个板长。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn-mdb.head.com/CDN3/D/313306.SET_31330602/5/1820x2428/supershape-e-magnum-with-binding-protector-evo-pr-11-gw.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "149 / 156 / 163 / 170 / 177 cm",
      "waistWidth": 72,
      "turnRadius": 13.1,
      "turnRadiusReferenceLength": "170 cm",
      "terrain": "雪道",
      "skierLevel": "进阶",
      "bindingSetup": "含 Protector EVO PR 11 GW 固定器套装"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "72mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "13.1m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e3a3-75a4-bfa1-7d60de36adbe",
    "slug": "head-e-sl-pro-2026",
    "title": "HEAD Worldcup Rebels e-SL Pro 2025/26",
    "model": "Worldcup Rebels e-SL Pro",
    "year": 2026,
    "oneLiner": "官方归类为雪道竞速小回转板，面向有经验滑手；绑定组合依具体套装。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn-mdb.head.com/CDN3/D/313236.SET_WO/5/1820x2428/worldcup-rebels-e-sl-pro-without-binding.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "150 / 155 / 160 / 165 / 170 cm",
      "waistWidth": 68,
      "turnRadius": 12,
      "turnRadiusReferenceLength": "160 cm",
      "terrain": "雪道 / 竞速 / 小回转",
      "skierLevel": "进阶",
      "bindingSetup": "可选固定器套装"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "68mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "12m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 竞速 / 小回转"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e3f1-7e7b-842c-e0e3f29c7685",
    "slug": "nordica-enforcer-104-2027",
    "title": "Nordica Enforcer 104 2026/27",
    "model": "Enforcer 104",
    "year": 2027,
    "oneLiner": "Nordica 2026/27 Enforcer 全山地系列，官方新季目录在售。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.nordica.com/storage/Product/0A668100001_ENFORCER_104_FLAT.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 173 / 179 / 185 / 191 cm",
      "waistWidth": 104,
      "turnRadius": 17.5,
      "turnRadiusReferenceLength": "167 cm",
      "terrain": "全山地 / 自由滑",
      "skierLevel": "进阶",
      "bindingSetup": "裸板，固定器另配"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "104mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "17.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e408-79f3-934f-8a8df25f1e22",
    "slug": "nordica-enforcer-89-2027",
    "title": "Nordica Enforcer 89 2026/27",
    "model": "Enforcer 89",
    "year": 2027,
    "oneLiner": "Enforcer 系列中偏雪道取向型号，列入 Nordica 2026/27 官方新品目录。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.nordica.com/storage/Product/0A668400001_ENFORCER_89_FLAT.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 173 / 179 / 185 cm",
      "waistWidth": 89,
      "turnRadius": 16.5,
      "turnRadiusReferenceLength": "167 cm",
      "terrain": "雪道 / 全山地",
      "skierLevel": "中级至进阶",
      "bindingSetup": "裸板，固定器另配"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "89mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "16.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全山地"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e417-7df7-bea5-f832c1c3d32f",
    "slug": "nordica-enforcer-94-2027",
    "title": "Nordica Enforcer 94 2026/27",
    "model": "Enforcer 94",
    "year": 2027,
    "oneLiner": "Enforcer 系列雪道与全山地兼顾型号，当前官方页面标注 2026/27 款。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.nordica.com/storage/Product/0A668300001_ENFORCER_94_FLAT.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 173 / 179 / 185 cm",
      "waistWidth": 94,
      "turnRadius": 16.5,
      "turnRadiusReferenceLength": "167 cm",
      "terrain": "雪道 / 全山地",
      "skierLevel": "进阶",
      "bindingSetup": "裸板，固定器另配"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "94mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "16.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全山地"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e423-7dc5-b375-1db3a3568ce5",
    "slug": "nordica-enforcer-99-2027",
    "title": "Nordica Enforcer 99 2026/27",
    "model": "Enforcer 99",
    "year": 2027,
    "oneLiner": "Enforcer 系列全山地型号，2026/27 官方产品页标注木芯与 Pulse Core 结构。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.nordica.com/storage/Product/0A668200001_ENFORCER_99.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 173 / 179 / 185 / 191 cm",
      "waistWidth": 99,
      "turnRadius": 17,
      "turnRadiusReferenceLength": "167 cm",
      "terrain": "全山地",
      "skierLevel": "进阶",
      "bindingSetup": "裸板，固定器另配"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "99mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "17m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e42e-75a0-a97c-6c5eb878a084",
    "slug": "nordica-santa-ana-102-2027",
    "title": "Nordica Santa Ana 102 2026/27",
    "model": "Santa Ana 102",
    "year": 2027,
    "oneLiner": "Santa Ana 女性全山地系列宽板腰型号，2026/27 官方新品目录在售。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.nordica.com/storage/Product/0A548500001_SANTA_ANA_102_FLAT.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "155 / 161 / 167 / 173 / 179 cm",
      "waistWidth": 102,
      "turnRadius": 16.5,
      "turnRadiusReferenceLength": "155 cm",
      "terrain": "全山地 / 自由滑",
      "skierLevel": "中级至进阶",
      "bindingSetup": "裸板，固定器另配"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "102mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "16.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e446-7c8a-add7-1c87a5b4ece1",
    "slug": "rossignol-experience-76-2026",
    "title": "Rossignol Experience 76 Xpress 2025/26",
    "model": "Experience 76 Xpress",
    "year": 2026,
    "oneLiner": "Rossignol 雪道与全山地入门型号，官网说明其侧重易操控 carving 和全雪场使用。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dw0f3e9f73/images/large/RAMFT04_FCMDX02_EXPERIENCE_76_XPRESS_XPRESS_10_GW_B83_BLACK_72DPI_01.jpg?sw=800",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "136 / 144 / 152 / 160 / 168 / 176 cm",
      "waistWidth": 76,
      "turnRadius": 12,
      "turnRadiusReferenceLength": "152 cm",
      "terrain": "雪道 / 全山地",
      "skierLevel": "入门至中级",
      "bindingSetup": "裸板或可选 XPRESS 10 GW"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "76mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "12m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全山地"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "入门至中级"
      }
    ]
  },
  {
    "id": "01a0d24d-2fcd-770a-be1c-687fa656ee5c",
    "slug": "rossignol-forza-40-ca-xpress-2027",
    "title": "Rossignol Forza 40° CA Xpress 2026/27",
    "model": "Forza 40° CA Xpress",
    "year": 2027,
    "oneLiner": "面向中级滑手的雪道 carving 型号，强调易上手的操控与刻滑体验。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dwa510bcb6/images/large/RAPPX05000_72DPI_01_v00.jpg?sh=140",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "150 / 157 / 164 / 171 / 179 cm",
      "waistWidth": 75,
      "turnRadius": 11,
      "turnRadiusReferenceLength": "157 cm",
      "terrain": "雪道 / carving",
      "skierLevel": "中级",
      "bindingSetup": "裸板，可选 XPRESS 11 GW 固定器"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "75mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "11m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / carving"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级"
      }
    ]
  },
  {
    "id": "01a0d22f-e452-784e-b3eb-b1ba9c16ff07",
    "slug": "rossignol-forza-50-cam-2026",
    "title": "Rossignol Forza 50° CAM KONECT 2025/26",
    "model": "Forza 50° CAM KONECT",
    "year": 2026,
    "oneLiner": "面向中级滑手的雪道 carving 系列，官网标注多种板长与可选固定器。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dw562b8531/images/large/RAOPX01000_72DPI_01_v01.jpg?sw=800",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "150 / 157 / 164 / 171 / 179 cm",
      "waistWidth": 75,
      "turnRadius": 12,
      "turnRadiusReferenceLength": "164 cm",
      "terrain": "雪道 / carving",
      "skierLevel": "中级",
      "bindingSetup": "裸板或可选 NX 12 KONECT GW"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "75mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "12m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / carving"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级"
      }
    ]
  },
  {
    "id": "01a0d22f-e46c-7c4a-907f-4c2a75deb835",
    "slug": "rossignol-hero-elite-lt-ti-2027",
    "title": "Rossignol Hero Elite LT TI 2026/27",
    "model": "Hero Elite LT TI",
    "year": 2027,
    "oneLiner": "官方定位为高速长弧雪道竞速风格板，面向技术型滑手。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dwa8eccfa0/images/large/RAPSE01000_72DPI_01_v01.jpg?sw=800",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 172 / 177 / 182 cm",
      "waistWidth": 71,
      "turnRadius": 16,
      "turnRadiusReferenceLength": "172 cm",
      "terrain": "雪道 / 长弧 carving",
      "skierLevel": "进阶",
      "bindingSetup": "裸板或可选 SPX 14 KONECT GW"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "71mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "16m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 长弧 carving"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e479-77ee-847a-9938a1da729b",
    "slug": "rossignol-hero-master-lt-r22-2027",
    "title": "Rossignol Hero Master LT R22 2026/27",
    "model": "Hero Master LT R22",
    "year": 2027,
    "oneLiner": "Hero 系列竞技取向长弧雪道板，2026/27 官方产品目录在售。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dw283c3bb5/images/large/RAPHE01000_72DPI_01_v01.jpg?sw=800",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "169 / 173 / 179 / 183 cm",
      "waistWidth": 70,
      "turnRadius": 17,
      "turnRadiusReferenceLength": "173 cm",
      "terrain": "雪道 / 竞速 / 长弧",
      "skierLevel": "进阶至专家",
      "bindingSetup": "R22 系统板，固定器依套装配置"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "70mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "17m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 竞速 / 长弧"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶至专家"
      }
    ]
  },
  {
    "id": "01a0d22f-e488-7252-ac28-beb307b374d3",
    "slug": "rossignol-soul-102-2027",
    "title": "Rossignol Soul 102 2026/27",
    "model": "Soul 102",
    "year": 2027,
    "oneLiner": "新一代多用途 freeride 雪板，官网列出 164、172、180 cm 等板长。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dwa120bfdc/images/large/RAPMR03000_72DPI_01_v01.jpg?sw=800",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "164 / 172 / 180 cm",
      "waistWidth": 101,
      "turnRadius": 15,
      "turnRadiusReferenceLength": "172 cm",
      "terrain": "全山地 / 自由滑 / 粉雪",
      "skierLevel": "中级至进阶",
      "bindingSetup": "裸板，不含固定器"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "101mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "15m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑 / 粉雪"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e493-7769-9f6a-6dea96e16442",
    "slug": "salomon-mtn-86-carbon-2027",
    "title": "Salomon MTN 86 Carbon 2026/27",
    "model": "MTN 86 Carbon",
    "year": 2027,
    "oneLiner": "Salomon 官方雪板目录中的轻量化巡游系列，定位与固定器需按具体组合确认。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/f142d815-a33c-4a23-ab3a-b31b00bd6bb5/L47824000%2B/PNG-2000px-max-72dpi.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "148 / 156 / 164 / 172 / 180 cm",
      "waistWidth": 86,
      "terrain": "巡游 / 全山地",
      "skierLevel": "中级至进阶",
      "bindingSetup": "裸板，固定器另配"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "86mm"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "巡游 / 全山地"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e49e-75cf-8b65-3bfb53b31650",
    "slug": "salomon-qst-106-2027",
    "title": "Salomon QST 106 2026/27",
    "model": "QST 106",
    "year": 2027,
    "oneLiner": "QST 系列宽板腰 freeride 型号，官方 2026/27 冬季目录在售。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/a71fd066-4d36-4bfa-951d-b45100de98e2/L49189000%2B/PNG-2000px-max-72dpi.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "157 / 165 / 173 / 181 / 189 cm",
      "waistWidth": 106,
      "turnRadius": 16.5,
      "turnRadiusReferenceLength": "157 cm",
      "terrain": "自由滑 / 粉雪",
      "skierLevel": "进阶",
      "bindingSetup": "裸板或依销售套装配置"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "106mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "16.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "自由滑 / 粉雪"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e4a9-75f1-a049-b409544e7724",
    "slug": "salomon-qst-92-2027",
    "title": "Salomon QST 92 2023/24",
    "model": "QST 92",
    "year": 2024,
    "oneLiner": "QST freeride 系列中偏窄板腰的全山地型号，适合雪道与混合雪况。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/bc1e0c3d-981e-48e7-bd6a-b2f40157afe3/L47232400%2B/PNG-2000px-max-72dpi.png?auto=avif&bg-color=f5f5f5&fit=cover&format=pjpg&optimize=medium&width=3840",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "152 / 160 / 168 / 176 / 184 cm",
      "waistWidth": 92,
      "turnRadius": 15,
      "turnRadiusReferenceLength": "176 cm",
      "terrain": "全山地 / 自由滑",
      "skierLevel": "中级至进阶",
      "bindingSetup": "裸板或依销售套装配置"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "92mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "15m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e4b4-7792-85a4-bef71207cf27",
    "slug": "salomon-qst-98-2027",
    "title": "Salomon QST 98 2023/24",
    "model": "QST 98",
    "year": 2024,
    "oneLiner": "QST freeride 系列中宽度适中的全山地型号，主打多雪况适应。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/f1b63fed-8741-4144-802d-b2f40156d659/L47232300%2B/PNG-2000px-max-72dpi.png?auto=avif&bg-color=f5f5f5&fit=cover&format=pjpg&optimize=low&width=3840",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "169 / 176 / 183 / 189 cm",
      "waistWidth": 98,
      "turnRadius": 16,
      "turnRadiusReferenceLength": "176 cm",
      "terrain": "全山地 / 自由滑",
      "skierLevel": "中级至进阶",
      "bindingSetup": "裸板或依销售套装配置"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "98mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "16m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e4c2-7277-9562-c72119100cdd",
    "slug": "salomon-qst-blank-2027",
    "title": "Salomon S/LAB QST Blank 2026/27",
    "model": "S/LAB QST Blank",
    "year": 2027,
    "oneLiner": "QST freeride 系列的宽板腰粉雪型号，官方冬季目录在售。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/c7f0b14e-8431-4677-ad87-b2f301454446/L47713400%2B/PNG-2000px-max-72dpi.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "170 / 178 / 186 / 192 cm",
      "waistWidth": 112,
      "turnRadius": 17,
      "turnRadiusReferenceLength": "170 cm",
      "terrain": "自由滑 / 粉雪",
      "skierLevel": "进阶",
      "bindingSetup": "裸板或依销售套装配置"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "112mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "17m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "自由滑 / 粉雪"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶"
      }
    ]
  },
  {
    "id": "01a0d22f-e4cc-70df-8ca7-17e0122748f9",
    "slug": "salomon-stance-84-2027",
    "title": "Salomon Stance 84 R 2026/27",
    "model": "Stance 84 R",
    "year": 2027,
    "oneLiner": "官方定位为雪道与全山地兼顾的稳定型双板，含板、板芯与固定器系统。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/d46f845f-a04e-4b4c-8419-b45100de593b/L45457300%2B/PNG-2000px-max-72dpi.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "161 / 169 / 177 / 185 cm",
      "waistWidth": 84,
      "turnRadius": 13,
      "turnRadiusReferenceLength": "169 cm",
      "terrain": "雪道 / 全山地",
      "skierLevel": "中级至进阶",
      "bindingSetup": "雪板+板层+固定器"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "84mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "13m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全山地"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级至进阶"
      }
    ]
  },
  {
    "id": "01a0a804-2b12-7504-9310-a349a1410840",
    "slug": "arbor-a-frame-2025",
    "title": "Arbor A-Frame 2025",
    "model": "A-Frame",
    "year": 2025,
    "oneLiner": "一块要求你先把技术练好的板子。它的边刃精度接近硬鞋刻滑板，但依然保留了软鞋的舒适站位。",
    "priceMin": 6599,
    "priceMax": 6599,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.arbor-collective.ca/cdn/shop/files/1-ARBOR_AFRAME_2024_STUDIO_01-rec.png?v=1724274612",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 60.6,
    "brand": {
      "slug": "arbor",
      "name": "Arbor",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 162,
      "effectiveEdge": 1330,
      "sidecut": 9.1,
      "waistWidth": 260,
      "stanceSetback": 25,
      "profile": "纯 Camber",
      "profileFamily": "camber",
      "shape": "定向",
      "core": "FSC 白杨 / 竹",
      "fiberglass": "Triax + 碳纤维带",
      "base": "烧结 7200",
      "weight": 3180,
      "flex": 8.5,
      "damping": 8.5,
      "pop": 5.5,
      "turnRadiusFeel": "长弧，需要主动压板",
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "162cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1330mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "9.1m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "260mm"
      }
    ]
  },
  {
    "id": "01a0a804-2b3b-715a-bb53-944af2efe6f7",
    "slug": "bataleon-evil-twin-2025",
    "title": "Bataleon Evil Twin 2025",
    "model": "Evil Twin",
    "year": 2025,
    "oneLiner": "勺形板头把卡刃这件事基本消除了。它是从新手过渡到公园最平滑的一块板，容错高但不软塌。",
    "priceMin": 4899,
    "priceMax": 4899,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.evo.com/cdn/shop/files/product-image-1103223.jpg?v=1767733151",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.3,
    "brand": {
      "slug": "bataleon",
      "name": "Bataleon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 154,
      "effectiveEdge": 1170,
      "sidecut": 7.4,
      "waistWidth": 251,
      "stanceSetback": 0,
      "profile": "3BT（板头尾勺形 + 板下 Camber）",
      "profileFamily": "hybrid",
      "shape": "真双向",
      "core": "白杨",
      "fiberglass": "Biax",
      "base": "烧结 4400",
      "weight": 2720,
      "flex": 5,
      "damping": 6,
      "pop": 7.5,
      "turnRadiusFeel": "极宽松，入弯无阻力",
      "scenes": [
        "freestyle",
        "beginner"
      ],
      "warranty": 2
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "154cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1170mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.4m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "251mm"
      }
    ]
  },
  {
    "id": "01a0d148-959a-705b-a45f-fe27eba628b8",
    "slug": "bc-stream-r2-2026",
    "title": "BC Stream R-2 2026",
    "model": "R2",
    "year": 2026,
    "oneLiner": "25/26 款锤头刻滑板，采用方向性双向板型与可变拱形；日本含税定价 ¥126,500，按 2026-10-02 参考汇率折算约 ¥5,370 CNY；该型号未见于当前 26/27 目录。",
    "priceMin": 5370,
    "priceMax": 5370,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.follows.co.jp/pic-labo/2526bc-r2-1a.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "bc-stream",
      "name": "BC Stream",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1300,
      "waistWidth": 250,
      "stanceSetback": 20,
      "profile": "Variable Camber",
      "profileFamily": "hybrid",
      "shape": "Directional Twin / Hammerhead",
      "core": "桧木 / 桐木",
      "scenes": [
        "carving",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1300mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "250mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a0d149-2d21-7d3a-9f43-ffe9fad0b875",
    "slug": "bc-stream-riders-spec-dr-2027",
    "title": "BC Stream Riders' Spec DR 2027",
    "model": "Riders' Spec DR",
    "year": 2027,
    "oneLiner": "宽板头与方向性轮廓兼顾压雪道和粉雪；商品资料标注 50 mm setback，不同鼻尾形状版本的滑行表现有别。日本 26/27 零售标价 ¥129,800 含税，按 2026-10-02 参考汇率折算约 ¥5,505 CNY（非中国零售价）。",
    "priceMin": 5505,
    "priceMax": 5505,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.follows.co.jp/pic-labo/2627bc-dr-1.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "bc-stream",
      "name": "BC Stream",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "stanceSetback": 50,
      "profile": "Nose Rocker / Variable Camber",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 野雪浮雪 · 刻滑"
      }
    ]
  },
  {
    "id": "01a0d149-310a-7c01-8891-8a916fc80942",
    "slug": "bc-stream-rx-2027",
    "title": "BC Stream RX 2027",
    "model": "RX",
    "year": 2027,
    "oneLiner": "以深弯和刻滑控制为核心，26/27 款增加 Hard Flex 选项；具体几何数据须按尺码读取。日本 26/27 官方渠道标价 ¥147,400 含税，按 2026-10-02 参考汇率折算约 ¥6,252 CNY（非中国零售价）。",
    "priceMin": 6252,
    "priceMax": 6252,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.follows.co.jp/pic-labo/2627bc-rxn-1.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "bc-stream",
      "name": "BC Stream",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "shape": "Directional",
      "scenes": [
        "carving",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑 · 全山地"
      }
    ]
  },
  {
    "id": "01a0a804-2b57-7d7a-85c9-baeea48afcc2",
    "slug": "burton-custom-camber-2026",
    "title": "Burton Custom Camber 2026",
    "model": "Custom Camber",
    "year": 2026,
    "oneLiner": "全山地基准板。它不试图讨好任何人，只是把「稳定 + 精准」这两件事做到该价位的上限。",
    "priceMin": 6299,
    "priceMax": 6299,
    "priceCurrency": "CNY",
    "coverUrl": "https://eu.burton.com/cdn/shop/files/1068819AI2_1.webp?v=1776120991&width=2880",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.8,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 158,
      "effectiveEdge": 1250,
      "sidecut": 7.9,
      "waistWidth": 253,
      "stanceSetback": 15,
      "profile": "纯 Camber",
      "profileFamily": "camber",
      "shape": "定向双向",
      "core": "FSC 认证杨木 / 双轴玻纤",
      "fiberglass": "Triax + Biax",
      "base": "烧结 7200",
      "weight": 2980,
      "flex": 7,
      "damping": 8,
      "pop": 7.5,
      "turnRadiusFeel": "长弧稳、短弧需发力",
      "scenes": [
        "all-mountain",
        "carving"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "158cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1250mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.9m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "253mm"
      }
    ]
  },
  {
    "id": "01a0fab1-0f00-7bf3-a1a4-252c199a1e38",
    "slug": "burton-custom-camber-2027",
    "title": "Burton Custom Camber Snowboard 2027",
    "model": "Custom Camber",
    "year": 2027,
    "oneLiner": "以传统 Camber 和定向板型兼顾全山巡航与自由式地形；158 尺寸提供 254 mm 板腰与 1215 mm 有效刃长。",
    "priceMin": 4896,
    "priceMax": 4896,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/106881997D_1.webp?v=1790184456",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 158,
      "effectiveEdge": 1215,
      "sidecut": 7.9,
      "waistWidth": 254,
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "Super Fly II 700G Core with Dualzone EGD",
      "fiberglass": "45° Carbon Highlights",
      "base": "Sintered WFO",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "158cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1215mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.9m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "254mm"
      }
    ]
  },
  {
    "id": "01a0fab1-18b2-716f-b9e0-b0190a0cfee6",
    "slug": "burton-good-company-camber-2027",
    "title": "Burton Good Company Camber Snowboard 2027",
    "model": "Good Company Camber",
    "year": 2027,
    "oneLiner": "采用 Camber、Twin 板型与对称弹性设定，面向全山与自由式滑行；152 尺寸板腰 250 mm、有效刃长 1155 mm。",
    "priceMin": 3240,
    "priceMax": 3240,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/2359513A03_1.webp?v=1778421389",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 152,
      "effectiveEdge": 1155,
      "sidecut": 7.6,
      "waistWidth": 250,
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "Twin",
      "core": "Super Fly 800G Core with Dualzone EGD",
      "fiberglass": "Triax",
      "base": "Sintered",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "152cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1155mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.6m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "250mm"
      }
    ]
  },
  {
    "id": "01a0a804-2b6a-7e41-884b-233d2c386488",
    "slug": "burton-process-2026",
    "title": "Burton Process 2026",
    "model": "Process",
    "year": 2026,
    "oneLiner": "比 Custom 软两度、比 DOA 稳一档，正好卡在公园与全山之间的那个位置。",
    "priceMin": 5499,
    "priceMax": 5499,
    "priceCurrency": "CNY",
    "coverUrl": "https://eu.burton.com/cdn/shop/files/106921CA03_1.webp?v=1776121079&width=2880",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.3,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1200,
      "sidecut": 7.7,
      "waistWidth": 252,
      "stanceSetback": 12,
      "profile": "纯 Camber",
      "profileFamily": "camber",
      "shape": "真双向",
      "core": "FSC 杨木 / 双轴玻纤",
      "fiberglass": "Triax + Biax",
      "base": "烧结 7200",
      "weight": 2790,
      "flex": 5,
      "damping": 7,
      "pop": 8.5,
      "turnRadiusFeel": "灵活，中短半径",
      "scenes": [
        "freestyle",
        "all-mountain"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1200mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.7m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a0d149-6a5b-7ead-bee2-c34185dd26ac",
    "slug": "burton-talent-scout-2027",
    "title": "Women's Burton Talent Scout Camber Snowboard 2027",
    "model": "Talent Scout",
    "year": 2027,
    "oneLiner": "Burton 女款公园双向板，Camber 结构强调跳台弹性和道具控制，并采用针对女性滑手调校的软硬设定。官网美区标价 $549.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/132181CBO2_1.webp?v=1783957423&width=2100",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 146,
      "effectiveEdge": 1095,
      "sidecut": 7.04,
      "waistWidth": 240,
      "stanceSetback": 0,
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "True Twin",
      "core": "FSC Super Fly II 700G Core",
      "fiberglass": "Women's Specific Triax",
      "base": "Sintered",
      "scenes": [
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "146cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1095mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.04m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "240mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3d1d-7210-9630-5c480f7aceb3",
    "slug": "capita-aeronaut-2027",
    "title": "CAPiTA Aeronaut Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Aeronaut",
    "year": 2027,
    "oneLiner": "定向传统正拱的度假全山板，强调速度、侧击和连续腾空，适合已经能主动压板并想提升山地表现的滑手。",
    "priceMin": 4896,
    "priceMax": 4896,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/RST02-AERONAUT-TOP.png?v=1776884582",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76.1,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1230,
      "sidecut": 8.5,
      "waistWidth": 253,
      "stanceSetback": 20.3,
      "profile": "ALPINE V3 DIRECTIONAL",
      "profileFamily": "camber",
      "shape": "DIRECTIONAL 0.8\" SETBACK",
      "core": "PANDA HOVER CORE",
      "fiberglass": "HOLYSHEET TRI/BI MAGIC BEAN RESIN",
      "base": "HYPERDRIVE ADV XT BASE",
      "flex": 6,
      "scenes": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1230mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.5m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "253mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3d2d-73a8-bc2f-48dd938460d1",
    "slug": "capita-dark-horse-2027",
    "title": "CAPiTA Dark Horse Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Dark Horse",
    "year": 2027,
    "oneLiner": "以较低门槛切入公园和自由式的双向板，保留跳台、侧击与道具所需的灵活性，也能应付日常度假区巡航。",
    "priceMin": 3600,
    "priceMax": 3600,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FST03-DARK-HORSE-TOP.png?v=1776884600",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.1,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 154,
      "effectiveEdge": 1188,
      "sidecut": 8,
      "waistWidth": 254,
      "stanceSetback": 0,
      "profile": "PARK V1",
      "profileFamily": "hybrid",
      "shape": "TRUE TWIN",
      "core": "DUAL CORE",
      "fiberglass": "HOLYSHEET TRI/BI MAGIC BEAN RESIN",
      "base": "SUPERDRIVE BASE",
      "flex": 6,
      "scenes": [
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "154cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1188mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "254mm"
      }
    ]
  },
  {
    "id": "01a0a804-2b7c-7f80-a691-bc91376d35dd",
    "slug": "capita-defenders-of-awesome-2026",
    "title": "Capita Defenders of Awesome 2026",
    "model": "Defenders of Awesome",
    "year": 2026,
    "oneLiner": "公园里的通用答案。弹性是它的全部性格，起跳时机对了它会把你送得比预期更高。",
    "priceMin": 5299,
    "priceMax": 5299,
    "priceCurrency": "CNY",
    "coverUrl": "https://snowboards.com/files/store/items/lg/f/w/fw26--doa_150.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.4,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 155,
      "effectiveEdge": 1195,
      "sidecut": 7.6,
      "waistWidth": 252,
      "stanceSetback": 0,
      "profile": "Resort V1（Camber 主导 + 板头尾反弓）",
      "profileFamily": "hybrid",
      "shape": "真双向",
      "core": "Dual Core 白杨",
      "fiberglass": "Biax Carbon",
      "base": "挤压 4000",
      "weight": 2760,
      "flex": 5.5,
      "damping": 6,
      "pop": 9,
      "turnRadiusFeel": "灵活，短半径很快",
      "scenes": [
        "freestyle",
        "all-mountain"
      ],
      "warranty": 2
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "155cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1195mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.6m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a0a804-2b94-7ddd-9f9e-ef2a6f7528ec",
    "slug": "capita-defenders-of-awesome-2027",
    "title": "CAPiTA D.O.A. Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Defenders of Awesome",
    "year": 2027,
    "oneLiner": "兼顾度假区全山和自由式的经典双向板，响应、弹性和可玩性平衡，适合想在跳台、侧击和日常巡航之间切换的滑手。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/RST03-D.O.A.-TOP.png?v=1776884618",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.3,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1234,
      "sidecut": 8,
      "waistWidth": 252,
      "stanceSetback": 0,
      "profile": "Resort V1 + Flat Kick Tech",
      "profileFamily": "hybrid",
      "shape": "TRUE TWIN",
      "core": "P2 SUPERLIGHT CORE",
      "fiberglass": "HYBRID CARBON HOLYSHEET BI/BI + MAGIC BEAN RESIN",
      "base": "QUANTUM DRIVE BASE",
      "flex": 5.5,
      "scenes": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1234mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3d80-7075-8d0d-8cd34c833ef6",
    "slug": "capita-indoor-survival-2027",
    "title": "CAPiTA Indoor Survival Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Indoor Survival",
    "year": 2027,
    "oneLiner": "偏公园和度假区的双向自由式板，用较软的硬度换取道具、跳台和地形转换中的灵活度，同时保留足够的脚下响应。",
    "priceMin": 4536,
    "priceMax": 4536,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FST01-INDOOR-SURVIVAL-TOP.png?v=1776884610",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.6,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1211,
      "sidecut": 7.96,
      "waistWidth": 258,
      "stanceSetback": 0,
      "profile": "PARK V1 + FLAT KICK TECH",
      "profileFamily": "hybrid",
      "shape": "TRUE TWIN",
      "core": "META CORE",
      "fiberglass": "HOLYSHEET TRI/BI MAGIC BEAN RESIN",
      "base": "QUANTUM DRIVE BASE",
      "flex": 4.5,
      "scenes": [
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1211mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.96m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "258mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3d92-743d-9053-fbdbb04460ec",
    "slug": "capita-kazu-kokubo-pro-2027",
    "title": "CAPiTA Kazu Kokubo Pro Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Kazu Kokubo Pro",
    "year": 2027,
    "oneLiner": "紧凑而有力量的粉雪定向板，板头浮力和轻微收尾让它在侧country与变化地形里更灵活，适合有主动控板能力的滑手。",
    "priceMin": 4896,
    "priceMax": 4896,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FRD04_KAZU_cb4bcbc1-e63b-4922-ba86-d03579561fe4.jpg?v=1776978826",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.7,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1221,
      "sidecut": 8.4,
      "waistWidth": 255,
      "stanceSetback": 20.3,
      "profile": "RESORT V3 DIRECTIONAL",
      "profileFamily": "hybrid",
      "shape": "DIRECTIONAL 0.8\" SETBACK",
      "core": "PANDA HOVER CORE",
      "fiberglass": "HOLYSHEET TRI/BI + MAGIC BEAN RESIN",
      "base": "HYPERDRIVE ADV XT BASE",
      "flex": 6.5,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1221mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.4m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "255mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3da2-7ba1-a74e-70df2ceee9c0",
    "slug": "capita-mega-death-2027",
    "title": "CAPiTA Mega Death Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Mega Death",
    "year": 2027,
    "oneLiner": "面向高阶滑手的轻量高性能自由滑板，在高速度、硬雪和深雪中追求更强的支撑与响应，价格和使用门槛都较高。",
    "priceMin": 8640,
    "priceMax": 8640,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FRD01-MEGA-DEATH-159_1.png?v=1777402409&width=1024",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.7,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 159,
      "effectiveEdge": 1221,
      "sidecut": 8.4,
      "waistWidth": 259,
      "stanceSetback": 20.3,
      "profile": "Alpine V1 Directional + Flat Kick Tech",
      "profileFamily": "hybrid",
      "shape": "DIRECTIONAL 0.8\" SETBACK",
      "core": "THERMOPOLYMER STARSHIP CORE",
      "fiberglass": "PURE MEGACARBON MARINE GRADE EPOXY RESIN",
      "base": "MEGADRIVE XT BASE",
      "flex": 6.5,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "159cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1221mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.4m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "259mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3db2-7cde-ae77-3bc82a006c5b",
    "slug": "capita-mega-merc-2027",
    "title": "CAPiTA Mega Merc Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Mega Merc",
    "year": 2027,
    "oneLiner": "以全山适应性为核心的高规格定向板，在硬雪、侧country和深雪之间保持强响应，适合想要一块高性能日常板的进阶滑手。",
    "priceMin": 7200,
    "priceMax": 7200,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FRD02_MEGA_MERC_0ecde98f-d861-4a1b-b13f-d286c1c58235.jpg?v=1776978817",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.1,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1215,
      "sidecut": 7.85,
      "waistWidth": 257,
      "stanceSetback": 12.7,
      "profile": "Resort V2 Directional + Flat Kick Tech",
      "profileFamily": "hybrid",
      "shape": "DIRECTIONAL 0.5\" SETBACK",
      "core": "3D THERMOPOLYMER STARSHIP CORE",
      "fiberglass": "HYBRID CARBON HOLYSHEET TRI/TRI FIBERGLASS + MEGACARBON MAGIC BEAN RESIN",
      "base": "MEGADRIVE XT BASE",
      "flex": 7,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1215mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.85m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "257mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3dc2-7632-a94e-dbdd5134359f",
    "slug": "capita-outerspace-living-2027",
    "title": "CAPiTA Outerspace Living Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Outerspace Living",
    "year": 2027,
    "oneLiner": "定向双向与全山混合拱的平衡路线，既能做自由式动作，也能在度假区和浅粉雪里保持稳定的日常可玩性。",
    "priceMin": 3816,
    "priceMax": 3816,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/RST05-OUTERSPACE-LIVING-TOP.png?v=1776884612",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.9,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 154,
      "effectiveEdge": 1168,
      "sidecut": 7.8,
      "waistWidth": 250,
      "stanceSetback": 12.7,
      "profile": "RESORT V3",
      "profileFamily": "hybrid",
      "shape": "DIRECTIONAL TWIN 0.5\" SETBACK",
      "core": "MULTIZONE DUAL CORE",
      "fiberglass": "SPECIAL BLEND FIBERGLASS MAGIC BEAN RESIN",
      "base": "SUPERDRIVE ADV BASE",
      "flex": 5,
      "scenes": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "154cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1168mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "250mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3dd1-7d6f-802e-c06c5f0ffd0d",
    "slug": "capita-pathfinder-2027",
    "title": "CAPiTA Pathfinder Camber Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Pathfinder",
    "year": 2027,
    "oneLiner": "面向进阶初期和预算敏感用户的友好型双向板，转向轻松、容错较高，适合从基础动作走向公园和全山练习。",
    "priceMin": 3240,
    "priceMax": 3240,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FST04-PATHFINDER-TOP.png?v=1776884552",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.7,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 151,
      "effectiveEdge": 1203,
      "sidecut": 7.7,
      "waistWidth": 252,
      "stanceSetback": 0,
      "profile": "Park V2 + Flat Kick Tech",
      "profileFamily": "rocker",
      "shape": "TRUE TWIN",
      "core": "DUAL CORE",
      "fiberglass": "SPECIAL BLEND FIBERGLASS MAGIC BEAN RESIN",
      "base": "SUPERDRIVE BASE",
      "flex": 4,
      "scenes": [
        "freestyle",
        "all-mountain",
        "beginner"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "151cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1203mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.7m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a0a804-2ba2-7ef5-86f7-13c5bfb80560",
    "slug": "capita-horrorscope-2024",
    "title": "CAPiTA Pathfinder Reverse 2024",
    "model": "Pathfinder Reverse",
    "year": 2024,
    "oneLiner": "2024 款 Pathfinder Reverse 是 CAPiTA 对旧 Horrorscope 系列的承接型号；反弓/平底混合板型、153cm 真双向，软弹且容错高。零售商列示 MSRP $429.95，按项目参考汇率 1 USD=¥7.2 折算约 ¥3,096 CNY；本条保留旧 Horrorscope slug 以兼容已有链接。",
    "priceMin": 3096,
    "priceMax": 3096,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0510/1705/6454/files/pathreverse57.jpg?v=1750863390",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.3,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 153,
      "effectiveEdge": 1218,
      "sidecut": 7.8,
      "waistWidth": 254,
      "stanceSetback": 0,
      "profile": "Park V2（插孔间零拱，插孔外反弓，平踢板头/尾）",
      "profileFamily": "rocker",
      "shape": "True Twin",
      "core": "Dual Core",
      "fiberglass": "Biax",
      "base": "Superdrive Ex",
      "flex": 4,
      "scenes": [
        "beginner",
        "freestyle"
      ],
      "warranty": 2
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "153cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1218mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "254mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3de0-7f24-a52d-e593f9412943",
    "slug": "capita-sb-resort-twin-2027",
    "title": "Spring Break Resort Twin Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "SB Resort Twin",
    "year": 2027,
    "oneLiner": "把 Spring Break 的造型和标准度假区双向结构结合起来，适合喜欢跳台、侧击和整山巡航的自由式用户。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/SB04-RESORT-TWIN-TOP.png?v=1776884550",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.3,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1211,
      "sidecut": 7.96,
      "waistWidth": 258,
      "stanceSetback": 0,
      "profile": "RESORT V2 Directional + Flat Kick Tech",
      "profileFamily": "hybrid",
      "shape": "TRUE TWIN",
      "core": "META CORE",
      "fiberglass": "HOLYSHEET TRI/BI MAGIC BEAN RESIN",
      "base": "POWDER DRIVE BASE",
      "flex": 5,
      "scenes": [
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1211mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.96m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "258mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3df3-7ac3-84eb-87f909672484",
    "slug": "capita-sidewinder-2027",
    "title": "CAPiTA Sidewinder Snowboard CAPiTA Snowboards | NA",
    "model": "Sidewinder",
    "year": 2027,
    "oneLiner": "为刻滑和压弯设计的定向板，强调边刃抓地、长弧稳定和高速出弯，适合把主要时间放在整备雪道上的滑手。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/RST06-SIDEWINDER-TOP.png?v=1776884613",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70.9,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 159,
      "effectiveEdge": 1225,
      "sidecut": 7,
      "waistWidth": 258,
      "stanceSetback": 20.3,
      "profile": "Alpine V3 Directional",
      "profileFamily": "hybrid",
      "shape": "DIRECTIONAL 0.8\" SETBACK",
      "core": "DUAL CORE",
      "fiberglass": "SPECIAL BLEND FIBERGLASS MAGIC BEAN RESIN",
      "base": "QUANTUM DRIVE BASE",
      "flex": 5.5,
      "scenes": [
        "carving",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "159cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1225mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "258mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3e02-7077-a96a-8d6930bcff86",
    "slug": "capita-super-doa-2027",
    "title": "CAPiTA Super D.O.A. Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Super D.O.A.",
    "year": 2027,
    "oneLiner": "更强调技术感和响应的双向全山自由式板，适合喜欢跳台、侧击和强节奏巡航、并能驾驭偏硬设定的滑手。",
    "priceMin": 5760,
    "priceMax": 5760,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/RST01-SUPER-D.O.A.-TOP.png?v=1776884610",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.8,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1234,
      "sidecut": 8,
      "waistWidth": 252,
      "stanceSetback": 0,
      "profile": "RESORT V1 + Flat Kick Tech",
      "profileFamily": "hybrid",
      "shape": "TRUE TWIN",
      "core": "3D THERMOPOLYMER STARSHIP CORE",
      "fiberglass": "HYBRID SUPERCARBON HOLYSHEET TRI/TRI + MAGIC BEAN RESIN",
      "base": "HYPERDRIVE / ADV XT BASE",
      "flex": 6,
      "scenes": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1234mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3e13-7f30-8486-49d3fbc75ba6",
    "slug": "capita-the-black-snowboard-of-death-2027",
    "title": "CAPiTA The Black Snowboard Of Death Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "The Black Snowboard of Death",
    "year": 2027,
    "oneLiner": "以全地形性能为核心的经典定向板，兼顾高速压雪、变化雪况和粉雪浮力，适合有经验的全山和自由滑手。",
    "priceMin": 5400,
    "priceMax": 5400,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FRD03_BSOD_43ad6df8-c222-4b12-93af-d408da7f7605.jpg?v=1776978812",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.6,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 159,
      "effectiveEdge": 1221,
      "sidecut": 8.4,
      "waistWidth": 259,
      "stanceSetback": 20.3,
      "profile": "Alpine V1 Directional + Flat Kick Tech",
      "profileFamily": "hybrid",
      "shape": "DIRECTIONAL 0.8\" SETBACK",
      "core": "THERMOPOLYMER HOVER CORE",
      "fiberglass": "HOLYSHEET TRI/TRI + MAGIC BEAN RESIN",
      "base": "HYPERDRIVE ADV XT BASE",
      "flex": 6.5,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "159cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1221mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.4m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "259mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3e23-72ec-bf62-15c88e2a2a4a",
    "slug": "capita-the-matriarch-2027",
    "title": "The Matriarch CAPiTA Snowboards | NA",
    "model": "The Matriarch",
    "year": 2027,
    "oneLiner": "面向精准压弯和自然地形流动的定向正拱板，兼顾高速度支撑与地形变化，适合进阶全山滑行。",
    "priceMin": 5256,
    "priceMax": 5256,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FRD00_MATRIARCH_1.png?v=1762987777",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.5,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 158,
      "effectiveEdge": 1180,
      "sidecut": 8.1,
      "waistWidth": 257,
      "stanceSetback": 20.3,
      "profile": "Alpine V4 Directional",
      "profileFamily": "camber",
      "shape": "DIRECTIONAL 0.8\" SETBACK",
      "core": "TRANSCEND CORE",
      "fiberglass": "HYBRID SUPERCARBON HOLYSHEET TRI/TRI + MAGIC BEAN RESIN",
      "base": "HYPERDRIVE ADV XT BASE",
      "flex": 7,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "158cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1180mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.1m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "257mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3e33-7f40-bb5a-603feeae0213",
    "slug": "capita-the-navigator-2027",
    "title": "CAPiTA The Navigator Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "The Navigator",
    "year": 2027,
    "oneLiner": "为粉雪和野外地形准备的定向板，强调板头浮力、稳定巡航和路线选择，适合把滑行重点放在非压雪区域的用户。",
    "priceMin": 4680,
    "priceMax": 4680,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FRD06-NAVIGATOR-TOP.png?v=1776884611",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.4,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 161,
      "effectiveEdge": 1216,
      "sidecut": 8.3,
      "waistWidth": 260,
      "stanceSetback": 20.3,
      "profile": "RESORT V2 DIRECTIONAL + FLAT KICK TECH",
      "profileFamily": "hybrid",
      "shape": "DIRECTIONAL 0.8\" SETBACK",
      "core": "HOVER CORE",
      "fiberglass": "HOLYSHEET TRI/BI + MAGIC BEAN RESIN",
      "base": "HYPERDRIVE BASE",
      "flex": 5.5,
      "scenes": [
        "powder",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "161cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1216mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.3m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "260mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3e42-77b7-9ae1-38b58a75db95",
    "slug": "capita-ultrafear-2027",
    "title": "CAPiTA Ultrafear Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Ultrafear",
    "year": 2027,
    "oneLiner": "以公园、Jib 和自由式动作为主的双向板，强调灵活、可玩和道具适应性，适合把创意动作放在第一位的滑手。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/FST02-ULTRAFEAR-TOP.png?v=1776884585",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.7,
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 153,
      "effectiveEdge": 1183,
      "sidecut": 8.26,
      "waistWidth": 254,
      "stanceSetback": 0,
      "profile": "Resort V1 + Flat Kick Tech",
      "profileFamily": "hybrid",
      "shape": "TRUE TWIN",
      "core": "P2 SUPERLIGHT CORE",
      "fiberglass": "HYBRID CARBON HOLYSHEET BI/BI",
      "base": "SUPERDRIVE ADV BASE",
      "flex": 5.5,
      "scenes": [
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "153cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1183mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.26m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "254mm"
      }
    ]
  },
  {
    "id": "01a0d149-58a4-763c-9899-6b12afb1001a",
    "slug": "decathlon-all-road-900-2026",
    "title": "DREAMSCAPE All Road 900 2026",
    "model": "All Road 900",
    "year": 2026,
    "oneLiner": "迪卡侬成人全山地与自由滑取向型号，154/160/166cm 可选；英国官网标价 £279.99，按 2026-10-02 参考汇率 1 GBP≈¥8.8475 折算约 ¥2,478 CNY（非中国售价）。154cm 规格为示例尺码。",
    "priceMin": 2478,
    "priceMax": 2478,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2572726/k$71ec9103476ba320ff720d13e85c95ba/picture.jpg?format=auto&f=3000x0",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 154,
      "sidecut": 8.3,
      "waistWidth": 245,
      "stanceSetback": 50,
      "profile": "Camber with nose rocker",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "20mm poplar wood",
      "base": "Sintered",
      "flex": 8,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "154cm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.3m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "245mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a0d149-5bf5-7230-a453-67dcaca4d658",
    "slug": "decathlon-park-ride-500-2026",
    "title": "DREAMSCAPE Park & Ride 500 2026",
    "model": "Park & Ride 500",
    "year": 2026,
    "oneLiner": "迪卡侬全山地与自由式型号，标准正拱配合摇杆与粉雪站位；英国官网原价 £199.99（现为促销价），按 2026-10-02 参考汇率 1 GBP≈¥8.8475 折算约 ¥1,769 CNY（非中国售价）。规格以 156cm 为例。",
    "priceMin": 1769,
    "priceMax": 1769,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2944924/k$e21f8365347b4de89819c934c9ed67d6/picture.jpg?format=auto&f=3000x0",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "sidecut": 8.4,
      "waistWidth": 255,
      "stanceSetback": 20,
      "profile": "Standard Camber with Rocker / Powder Stance",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "Poplar wood",
      "base": "Sintered HDPE",
      "flex": 6,
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.4m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "255mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a0d149-5599-7c14-b2e6-0b88a2c1bfb8",
    "slug": "decathlon-snb-100-2026",
    "title": "DREAMSCAPE SNB 100 2026",
    "model": "SNB 100",
    "year": 2026,
    "oneLiner": "DREAMSCAPE 入门全山地男款，平底与长摇杆、软 flex 3/10、方向性双向板型；加拿大官网原价 CAD $220，按 2026-10-02 参考汇率 1 CAD≈¥4.7121 折算约 ¥1,037 CNY（非中国售价）。规格以 152cm 为例。",
    "priceMin": 1037,
    "priceMax": 1037,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2027365/k%247ef3d02e4e2afe08ebbe0e24d400c10b/tabla-de-snowboard-hombre-snb100.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 152,
      "sidecut": 8.2,
      "waistWidth": 250,
      "stanceSetback": 20,
      "profile": "Flat Camber + Long Rocker",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "20mm poplar wood",
      "base": "Extruded",
      "flex": 3,
      "scenes": [
        "beginner",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "152cm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.2m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "250mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a0a804-2bb3-7ee7-895e-588073f0c0e8",
    "slug": "gnu-rider-s-choice-2025",
    "title": "GNU Rider's Choice 2025",
    "model": "Rider's Choice",
    "year": 2025,
    "oneLiner": "波浪边刃 + C2X 板型的组合让它在冰面上比同级别更抓得住，同时保留了公园需要的弹性。",
    "priceMin": 5199,
    "priceMax": 5199,
    "priceCurrency": "CNY",
    "coverUrl": "https://images.blue-tomato.com/is/image/bluetomato/305258540_front.jpg-G2lrQmzSDnKgLSGW6Q13RDLjzzE/Riders+Choice+Snowboard.jpg?$b1$",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.2,
    "brand": {
      "slug": "gnu",
      "name": "GNU",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1200,
      "sidecut": 7.6,
      "waistWidth": 255,
      "stanceSetback": 10,
      "profile": "C2X（板下反弓 + 板头尾 Camber）",
      "profileFamily": "hybrid",
      "shape": "定向双向",
      "core": "Aspen / Paulownia",
      "fiberglass": "Biax Triax 混合",
      "base": "烧结 UHMW",
      "weight": 2860,
      "flex": 6.5,
      "damping": 7.5,
      "pop": 8,
      "turnRadiusFeel": "抓刃强，波浪边刃",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1200mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.6m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "255mm"
      }
    ]
  },
  {
    "id": "01a0d149-3e08-7c7d-b856-caad70bd6085",
    "slug": "gray-despe-wood-2027",
    "title": "GRAY DESPE WOOD 2027",
    "model": "DESPE WOOD",
    "year": 2027,
    "oneLiner": "木芯与玻纤结构的刻滑入门取向型号，26/27 全长度更新为 Active Camber，并提供部分加宽尺寸。日本官方含税 MSRP ¥93,500，按 2026-10-02 参考汇率折算约 ¥3,968 CNY（非中国零售价）。",
    "priceMin": 3968,
    "priceMax": 3968,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/25_DESPE%20WOOD48-63w/2627_25_DESPE%20WOOD48-63w_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Active Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "Poplar / Paulownia Composite Wood Core",
      "fiberglass": "Full Fiberglass",
      "scenes": [
        "carving",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑 · 全山地"
      }
    ]
  },
  {
    "id": "01a0d149-36de-79b6-8e05-7b0c749b859a",
    "slug": "gray-desperado-2024",
    "title": "GRAY DESPERADO micro/mini 2024",
    "model": "DESPERADO micro/mini",
    "year": 2024,
    "oneLiner": "GRAY 儿童软鞋刻滑板，采用全玻纤结构；2023/24 官方含税价 ¥108,900，按 2026-10-02 参考汇率折算约 ¥4,623 CNY。",
    "priceMin": 4623,
    "priceMax": 4623,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2324/product/18_DESPERADO",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Single Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "fiberglass": "Full Fiberglass",
      "scenes": [
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑"
      }
    ]
  },
  {
    "id": "01a0d149-3a83-7850-a91e-798ce7a5a4bc",
    "slug": "gray-desperado-ti-type-r-2027",
    "title": "GRAY DESPERADO Ti Type-R 2027",
    "model": "DESPERADO Ti Type-R",
    "year": 2027,
    "oneLiner": "面向高水平刻滑的金属强化型号，以锤头轮廓、复合侧切和较强边刃支撑为主要特点。日本官方 MSRP 按尺码 ¥198,000–¥209,000 含税，折算目录价约 ¥8,405–¥8,872 CNY（非中国零售价）。",
    "priceMin": 8405,
    "priceMax": 8872,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/21_DSPRD%20Ti%20type-R/2627_21_DSPRD%20Ti%20type-R_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Vario Camber",
      "profileFamily": "hybrid",
      "shape": "Directional Hammerhead / TripleRadius",
      "core": "Wood Core",
      "scenes": [
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑"
      }
    ]
  },
  {
    "id": "01a0eabd-69ea-7459-9652-c4f3a8a978fd",
    "slug": "gray-dsprd-ti-iz-2027",
    "title": "GRAY DSPRD Ti [iz] 2027",
    "model": "DSPRD Ti [iz]",
    "year": 2027,
    "oneLiner": "26/27 锤头刻滑型号，将 IZANAS 纤维置于芯材下方，并结合上缘 Titanal 金属带、玻纤结构与聚酰胺顶片。日本官方含税 MSRP ¥154,000，按 2026-10-02 参考汇率折算约 ¥6,537 CNY（非中国零售价）。",
    "priceMin": 6537,
    "priceMax": 6537,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/22_DSPRD%20Ti%5Biz%5D/2627_22_DSPRD%20Ti%5Biz%5D_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Single Camber (IIw wide only: Vario Camber)",
      "profileFamily": "camber",
      "shape": "Directional Hammerhead / TripleRadius",
      "core": "Wood Core + IZANAS Fiber",
      "length": 157,
      "effectiveEdge": 1360,
      "sidecutRadii": "9.8/9.2/10.4 m",
      "waistWidth": 246,
      "stanceSetback": 30,
      "fiberglass": "Glass + IZANAS beneath core + upper-edge Titanal ribbon",
      "base": "IS7500 Graphite",
      "scenes": [
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑"
      }
    ]
  },
  {
    "id": "01a0eabd-6db1-701f-82d8-390addef0fd1",
    "slug": "gray-dsprd-ti-type-x-ver-s-2027",
    "title": "GRAY DSPRD Ti Type-X ver.S 2027",
    "model": "DSPRD Ti Type-X ver.S",
    "year": 2027,
    "oneLiner": "面向高水平竞赛刻滑的 26/27 款 Type-X，针对高速大角度走刃优化；ver.S 使用烧结表层配置。日本官方含税 MSRP ¥198,000，按 2026-10-02 参考汇率折算约 ¥8,405 CNY（非中国零售价）。",
    "priceMin": 8405,
    "priceMax": 8405,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/19_DSPRD%20Ti%20type-X%20verS/2627_19_DSPRD%20Ti%20type-X%20verS_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Single Camber",
      "profileFamily": "camber",
      "shape": "Directional Hammerhead",
      "core": "Wood Core",
      "scenes": [
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑"
      }
    ]
  },
  {
    "id": "01a0eabd-70e5-757e-879b-c98eeab99f0e",
    "slug": "gray-epic-2027",
    "title": "GRAY EPIC 2027",
    "model": "EPIC",
    "year": 2027,
    "oneLiner": "中等硬度的高端全双向板，Active Camber 与多半径侧切兼顾灵活性和脚下抓边，适合道具、公园及自由式滑行。日本官方含税 MSRP ¥126,500，按 2026-10-02 参考汇率折算约 ¥5,370 CNY（非中国零售价）。",
    "priceMin": 5370,
    "priceMax": 5370,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/03_EPIC/2627_03_EPIC_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Active Camber",
      "profileFamily": "hybrid",
      "shape": "True Twin",
      "core": "Wood Core",
      "scenes": [
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "自由式 · 全山地"
      }
    ]
  },
  {
    "id": "01a0eabd-73f9-7d21-9653-4b78a20b8ba0",
    "slug": "gray-lovebuzz-58-2027",
    "title": "GRAY LOVEBUZZ 58 2027",
    "model": "LOVEBUZZ 58",
    "year": 2027,
    "oneLiner": "158cm 全山地自由滑型号，低拱、长板头、大侧切半径与新月形板尾，覆盖雪道巡航到粉雪地形。日本官方含税 MSRP ¥93,500，按 2026-10-02 参考汇率折算约 ¥3,968 CNY（非中国零售价）。",
    "priceMin": 3968,
    "priceMax": 3968,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/11_LOVEBUZZ%2058/2627_11_LOVEBUZZ%2058_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 158,
      "profile": "Single Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "Wood Core",
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "158cm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 野雪浮雪 · 刻滑"
      }
    ]
  },
  {
    "id": "01a0eabd-76f7-7b85-a79a-099d7d5af26a",
    "slug": "gray-prodigy-2027",
    "title": "GRAY PRODIGY 2027",
    "model": "PRODIGY",
    "year": 2027,
    "oneLiner": "GRAY 旗舰方向双向板，玻纤与 X 形碳纤结构强调快速回弹、控制力与中高速稳定，覆盖自由式跳台和全山地滑行。日本官方含税 MSRP ¥126,500，按 2026-10-02 参考汇率折算约 ¥5,370 CNY（非中国零售价）。",
    "priceMin": 5370,
    "priceMax": 5370,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/01_PRODIGY/2627_01_PRODIGY_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Single Camber",
      "profileFamily": "camber",
      "shape": "Directional Twin",
      "core": "Wood Core",
      "fiberglass": "Fiberglass + X-shaped Carbon Roving",
      "scenes": [
        "all-mountain",
        "freestyle",
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 自由式 · 刻滑"
      }
    ]
  },
  {
    "id": "01a0eabd-1bf6-7d68-a902-f8468a104453",
    "slug": "gray-sonicalmach-lt-2027",
    "title": "GRAY SONICALMACH LT 2027",
    "model": "SONICALMACH LT",
    "year": 2027,
    "oneLiner": "26/27 跑滑与地形技巧取向雪板，软硬度设计搭配杨木与竹复合板芯；不同长度对应双向、方向双向或定向板形。日本官方含税 MSRP ¥93,500，按 2026-10-02 参考汇率折算约 ¥3,968 CNY（非中国零售价）。",
    "priceMin": 3968,
    "priceMax": 3968,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/17_SONICALMACH%20LT/2627_17_SONICALMACH%20LT_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Single Camber",
      "profileFamily": "camber",
      "shape": "True Twin / Directional Twin / Directional（随长度变化）",
      "core": "Poplar + Bamboo Wood Core",
      "scenes": [
        "carving",
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑 · 自由式 · 全山地"
      }
    ]
  },
  {
    "id": "01a0eabd-79f0-74c1-bbee-29a9bc814f96",
    "slug": "gray-sonicalmach-lt-ver-c-2027",
    "title": "GRAY SONICALMACH LT ver.C 2027",
    "model": "SONICALMACH LT ver.C",
    "year": 2027,
    "oneLiner": "26/27 碳条强化版本，在杨木与竹复合板芯下配置碳纤维，提升回弹；官方列出 54、55W、56EW 三种宽度版本。日本官方含税 MSRP ¥99,000，按 2026-10-02 参考汇率折算约 ¥4,203 CNY（非中国零售价）。",
    "priceMin": 4203,
    "priceMax": 4203,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/18_SONICALMACH%20LT%20verC/2627_18_SONICALMACH%20LT%20verC_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Single Camber",
      "profileFamily": "camber",
      "core": "Poplar + Bamboo Wood Core",
      "scenes": [
        "carving",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑 · 自由式"
      }
    ]
  },
  {
    "id": "01a0eabd-7d0c-7623-b1fc-137566925fca",
    "slug": "gray-tycoon-type-s-iz-2027",
    "title": "GRAY TYCOON Type-S [iz] 2027",
    "model": "TYCOON Type-S [iz]",
    "year": 2027,
    "oneLiner": "26/27 高端竞速刻滑型号，以全金属结构、IZANAS 纤维及复合材料控制弯曲后的回弹，可搭配雪板底板系统。日本官方含税 MSRP ¥198,000，按 2026-10-02 参考汇率折算约 ¥8,405 CNY（非中国零售价）。",
    "priceMin": 8405,
    "priceMax": 8405,
    "priceCurrency": "CNY",
    "coverUrl": "https://graysnowboards.co.jp/wp2021/wp-content/themes/gray/images/img_2627/product/28_TYCOON%20Type-S%5Biz%5D/2627_28_TYCOON%20Type-S%5Biz%5D_main.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Vario Camber",
      "shape": "Directional Alpine",
      "core": "Wood Core + IZANAS Fiber",
      "scenes": [
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑"
      }
    ]
  },
  {
    "id": "01a0d149-7d48-7e81-8bee-78680ac52f0a",
    "slug": "jones-dream-weaver-2-0-2027",
    "title": "Women's Dream Weaver 2.0 Snowboard 2027 | Jones",
    "model": "Dream Weaver 2.0",
    "year": 2027,
    "oneLiner": "偏野雪浮力的女款全山地日常板，形状兼顾雪道巡航、粉雪和多变地形。官网美区标价 $549.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0641/4722/6759/files/J.27.SNW.DRC-gallery-1.webp?v=1782443953&width=1946",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 148,
      "effectiveEdge": 1120,
      "waistWidth": 241,
      "profile": "CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "148cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1120mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "241mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a0bdc1-3e63-7f83-8d65-194d4da16980",
    "slug": "jones-flagship-2027",
    "title": "Men's Flagship Snowboard | Jones",
    "model": "Flagship",
    "year": 2027,
    "oneLiner": "以陡坡、深雪和技术型自由滑为核心的定向板，边刃支撑和粉雪浮力都偏强，适合有经验的全山滑手。",
    "priceMin": 5400,
    "priceMax": 5400,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNM.FLA-gallery-1.webp?v=1782443915&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.2,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 161,
      "effectiveEdge": 1200,
      "sidecut": 9.1,
      "waistWidth": 252,
      "stanceSetback": 20,
      "profile": "Freeride CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "Control Core",
      "fiberglass": "Triax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 3100,
      "flex": 8,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "161cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1200mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "9.1m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a0faeb-3d41-70d8-a202-99f7b4f1da86",
    "slug": "jones-flagship-pro-2027",
    "title": "Jones Men's Flagship PRO Snowboard 2027",
    "model": "Flagship PRO",
    "year": 2027,
    "oneLiner": "面向专家级大山自由滑的超硬定向板，2027 款升级玄武岩交叉铺层；美国官网 MSRP $949.95，按项目 USD/CNY 7.2 参考汇率折算，非中国零售价。",
    "priceMin": 6840,
    "priceMax": 6840,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.jonessnowboards.com/cdn/shop/files/J.27.SNM.UFL-gallery-1.webp?v=1782443801&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 161,
      "effectiveEdge": 1200,
      "sidecut": 9.1,
      "waistWidth": 252,
      "stanceSetback": 20,
      "profile": "Freeride CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "Power Core + Koroyd",
      "base": "Sintered 9900",
      "weight": 2900,
      "flex": 10,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "161cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1200mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "9.1m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3e76-730d-8f77-24b45e6eb736",
    "slug": "jones-freecarver-6000s-2027",
    "title": "Freecarver 6000s Snowboard | Jones",
    "model": "Freecarver 6000s",
    "year": 2027,
    "oneLiner": "为整备雪道短半径压弯设计的全正拱刻滑板，转弯节奏紧凑、边刃反馈直接，适合专注 carving 的进阶滑手。",
    "priceMin": 5040,
    "priceMax": 5040,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNU.FRS-gallery-1.webp?v=1782443909&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.4,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 154,
      "effectiveEdge": 1280,
      "sidecut": 6.5,
      "waistWidth": 248,
      "stanceSetback": 40,
      "profile": "True Medium Camber",
      "profileFamily": "camber",
      "shape": "Carving Directional",
      "core": "Power Core",
      "fiberglass": "Biax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 2700,
      "flex": 6,
      "scenes": [
        "carving",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "154cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1280mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "6.5m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "248mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3e8a-7388-9abf-51587c4f12b4",
    "slug": "jones-frontier-2-0-2027",
    "title": "Men's Frontier 2.0 Snowboard | Jones",
    "model": "Frontier 2.0",
    "year": 2027,
    "oneLiner": "适合整季日常使用的全山定向板，转弯直观、变化雪况中容易掌控，并能在新雪里提供足够浮力。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNM.FRT-gallery-1.webp?v=1782443696&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.9,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 159,
      "effectiveEdge": 1220,
      "sidecut": 7.8,
      "waistWidth": 255,
      "stanceSetback": 20,
      "profile": "Freeride CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "Master Core",
      "fiberglass": "Biax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 2900,
      "flex": 5,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "159cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1220mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "255mm"
      }
    ]
  },
  {
    "id": "01a0a804-2bd5-72e0-a121-e4b37424daec",
    "slug": "jones-hovercraft-2026",
    "title": "Jones Hovercraft 2026",
    "model": "Hovercraft",
    "year": 2026,
    "oneLiner": "浮雪的标杆。板头宽度和后移量让它在新雪里像船一样浮着，树林里转向比看起来灵活得多。",
    "priceMin": 6999,
    "priceMax": 6999,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.jonessnowboards.com/cdn/shop/files/J.26.SNU.HVC-gallery-1.webp?v=1768452295",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 64.4,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 160,
      "effectiveEdge": 1240,
      "sidecut": 8.9,
      "waistWidth": 268,
      "stanceSetback": 50,
      "profile": "Camber + 大勺形板头",
      "profileFamily": "hybrid",
      "shape": "强定向锥形",
      "core": "FSC 白杨 / 竹",
      "fiberglass": "Triax Basalt",
      "base": "烧结 9000",
      "weight": 2990,
      "flex": 7,
      "damping": 8,
      "pop": 5.5,
      "turnRadiusFeel": "深雪里灵活，硬雪面偏钝",
      "scenes": [
        "powder"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "160cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1240mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.9m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "268mm"
      }
    ]
  },
  {
    "id": "01a0a804-2bc6-7aa2-bf0e-65764b3411b3",
    "slug": "jones-hovercraft-2-0-2027",
    "title": "Hovercraft 2.0 Snowboard | Jones",
    "model": "Hovercraft 2.0",
    "year": 2027,
    "oneLiner": "体积偏移的冲浪感定向粉雪板，用更宽的板腰换取浮力和低速灵活性，适合深雪、林间和低角度地形。",
    "priceMin": 4680,
    "priceMax": 4680,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0641/4722/6759/files/J.26.SNU.HVC-gallery-1.webp?v=1768407048&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.3,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1230,
      "sidecut": 9,
      "waistWidth": 263,
      "stanceSetback": 20,
      "profile": "Float CamRock",
      "profileFamily": "hybrid",
      "shape": "Volume-shifted directional",
      "core": "Re-Up Tech Core",
      "fiberglass": "Biax Fiberglass + Flax Fiber",
      "base": "Sintered 8000 Base",
      "weight": 3100,
      "flex": 7,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1230mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "9m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "263mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3ec6-7fca-98ed-46d3867db591",
    "slug": "jones-howler-2027",
    "title": "Men's Howler Snowboard | Jones",
    "model": "Howler",
    "year": 2027,
    "oneLiner": "把强力正拱和自由式动作结合起来的高响应定向板，适合在技术地形、跳台和高速巡航之间切换的高手。",
    "priceMin": 5040,
    "priceMax": 5040,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNM.HOV-gallery-1.webp?v=1785146483&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.8,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 158,
      "effectiveEdge": 1230,
      "sidecut": 8.4,
      "waistWidth": 257,
      "stanceSetback": 20,
      "profile": "High Power Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "Power Core + Koroyd",
      "fiberglass": "Triax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 2800,
      "flex": 8,
      "scenes": [
        "all-mountain",
        "powder",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "158cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1230mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.4m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "257mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3ed6-7270-8ba6-60f22904fed5",
    "slug": "jones-mind-expander-2-0-2027",
    "title": "Mind Expander 2.0 Snowboard | Jones",
    "model": "Mind Expander 2.0",
    "year": 2027,
    "oneLiner": "用冲浪思路重塑全山线路的定向板，适合在粉雪、自然地形和自由式动作中寻找不同走线的进阶用户。",
    "priceMin": 4536,
    "priceMax": 4536,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNU.MEX-gallery-1.webp?v=1782443855&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 154,
      "effectiveEdge": 1140,
      "waistWidth": 257,
      "stanceSetback": 20,
      "profile": "Float CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "Master Core",
      "fiberglass": "Biax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 3000,
      "flex": 7,
      "scenes": [
        "all-mountain",
        "powder",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "154cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1140mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "257mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a0a804-2beb-7718-85a6-8adb633ed8a3",
    "slug": "jones-mountain-twin-2026",
    "title": "Jones Mountain Twin 2026",
    "model": "Mountain Twin",
    "year": 2026,
    "oneLiner": "最没有短板的一块。它不会在任何一项上给你惊喜，但也不会让你在任何一天后悔带它出门。",
    "priceMin": 5899,
    "priceMax": 5899,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.evo.com/cdn/shop/files/product-image-1183297.jpg?v=1767736586",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.6,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1225,
      "sidecut": 8,
      "waistWidth": 255,
      "stanceSetback": 20,
      "profile": "Camber + 板头板尾微摇臂",
      "profileFamily": "hybrid",
      "shape": "定向双向",
      "core": "FSC 白杨 / 玄武岩纤维",
      "fiberglass": "Biax + Basalt",
      "base": "烧结 8000",
      "weight": 2870,
      "flex": 6,
      "damping": 7.5,
      "pop": 7,
      "turnRadiusFeel": "中性，长短弧都好带",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1225mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "255mm"
      }
    ]
  },
  {
    "id": "01a0a804-2bfe-7d8e-b4cc-0bc1b55597ae",
    "slug": "jones-mountain-twin-2027",
    "title": "Men's Mountain Twin Snowboard | Jones",
    "model": "Mountain Twin",
    "year": 2027,
    "oneLiner": "面向整山和自由式切换的定向双向板，压雪、侧击和自然地形都能保持平衡，适合想用一块板覆盖大多数日子的滑手。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNM.MTN-gallery-1_cdsmc7.webp?v=1782443870&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1210,
      "sidecut": 7.8,
      "waistWidth": 254,
      "stanceSetback": 0,
      "profile": "CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "Master Core",
      "fiberglass": "Biax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 2800,
      "flex": 6,
      "scenes": [
        "all-mountain",
        "powder",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1210mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "254mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3f10-7bae-939c-3cc47a2eb86d",
    "slug": "jones-rally-cat-2027",
    "title": "Men's Rally Cat Snowboard | Jones",
    "model": "Rally Cat",
    "year": 2027,
    "oneLiner": "轻松、灵活且带有明显玩心的全山双向板，适合在压雪道、侧击和小型地形之间不断换线的用户。",
    "priceMin": 3600,
    "priceMax": 3600,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNM.MND-gallery-1.webp?v=1782443822&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.8,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1150,
      "sidecut": 7.5,
      "waistWidth": 252,
      "stanceSetback": 20,
      "profile": "True Medium Camber",
      "profileFamily": "camber",
      "shape": "Directional Twin",
      "core": "Master Core",
      "fiberglass": "Biax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 2700,
      "flex": 5,
      "scenes": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1150mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.5m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a0bdc1-3f21-78f9-8c77-9e1a37918358",
    "slug": "jones-storm-chaser-2027",
    "title": "Storm Chaser Snowboard | Jones",
    "model": "Storm Chaser",
    "year": 2027,
    "oneLiner": "面向深雪循环的超宽体积偏移定向板，强调低角度浮力和冲浪感，同时保留硬雪上的基本转弯能力。",
    "priceMin": 5256,
    "priceMax": 5256,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNU.STC-gallery-1.webp?v=1782443829&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.7,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 152,
      "effectiveEdge": 1070,
      "sidecut": 6.9,
      "waistWidth": 275,
      "stanceSetback": 20,
      "profile": "Christenson Surf Rocker",
      "profileFamily": "rocker",
      "shape": "Volume-Shifted Directional",
      "core": "Master Core",
      "fiberglass": "Biax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 2900,
      "flex": 6,
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "152cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1070mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "6.9m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "275mm"
      }
    ]
  },
  {
    "id": "01a0d149-79f7-7d6d-a2cb-98d589661a7e",
    "slug": "jones-twin-sister-2027",
    "title": "Women's Twin Sister Snowboard 2027 | Jones",
    "model": "Twin Sister",
    "year": 2027,
    "oneLiner": "Jones 女款全山地畅销双向板，CamRock 和中等硬度兼顾刻滑、自由式与新雪中的浮力。官网美区标价 $599.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.27.SNW.TWS-gallery-1.webp?v=1773324878&width=1946",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 149,
      "waistWidth": 244,
      "stanceSetback": 20,
      "profile": "CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "Master Core",
      "fiberglass": "Biax Fiberglass",
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "149cm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "244mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 自由式 · 野雪浮雪"
      }
    ]
  },
  {
    "id": "01a0d149-7604-7d2f-ab1e-f8cb504d0a78",
    "slug": "k2-alchemist-2027",
    "title": "K2 Alchemist 2027",
    "model": "Alchemist",
    "year": 2027,
    "oneLiner": "K2 Landscape 系列旗舰定向野雪板，面向专家滑手，以高速稳定、精准控刃和大山地形为主要方向。官网美区标价 $849.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 6120,
    "priceMax": 6120,
    "priceCurrency": "CNY",
    "coverUrl": "https://blauerboardshop.com/cdn/shop/files/K2AlchemistSnowboard2027.png?v=1776976538",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Directional Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 野雪浮雪 · 刻滑"
      }
    ]
  },
  {
    "id": "01a0d149-71ff-764d-94c6-aca436e0a72f",
    "slug": "k2-excavator-2027",
    "title": "K2 Excavator 2027",
    "model": "Excavator",
    "year": 2027,
    "oneLiner": "宽腰短板思路的全山地型号，主打压雪道深弯与新雪浮力，官方建议按常规雪板尺寸适当缩短选择。官网美区标价 $629.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 4536,
    "priceMax": 4536,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.milosport.com/cdn/shop/files/KB2616871398Large.png?v=1774904988&width=800",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Directional Camber",
      "profileFamily": "camber",
      "shape": "Tapered Directional / Volume Shift",
      "core": "S1 Core",
      "base": "Wax-Infused Sintered 4001",
      "scenes": [
        "carving",
        "powder",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑 · 野雪浮雪 · 全山地"
      }
    ]
  },
  {
    "id": "01a0d149-6d77-7fe5-8521-abd56a8025b4",
    "slug": "k2-passport-2027",
    "title": "K2 Passport 2027",
    "model": "Passport",
    "year": 2027,
    "oneLiner": "定向全山自由滑板，兼顾压雪道、粉雪和大山地形；中高级滑手可按脚长在标准与宽版之间选择。官网美区标价 $599.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://blauerboardshop.com/cdn/shop/files/K2PassportSnowboard2027.png?v=1776985303",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1180,
      "waistWidth": 255,
      "stanceSetback": 19,
      "profile": "Directional Combination Camber",
      "profileFamily": "hybrid",
      "shape": "Tapered Directional",
      "core": "A1 Core",
      "base": "Sintered 4000",
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1180mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "255mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a0a804-2c0b-714f-9219-ea5f9d92d6ee",
    "slug": "korua-shapes-cafe-racer-2026",
    "title": "Korua Shapes Cafe Racer 2026",
    "model": "Cafe Racer",
    "year": 2026,
    "oneLiner": "一块只为「走刃」存在的板子。它不会跳、不会转得快，但当你把刃压下去时，它给你的稳定感是别的板给不了的。",
    "priceMin": 6899,
    "priceMax": 6899,
    "priceCurrency": "CNY",
    "coverUrl": "https://original.accentuate.io/6939308982453/1758747603396/KORUA-Shapes-Cafe-Racer-Nicholas-Wolken-Thumbnail-01.jpg?v=1758747603396",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.4,
    "brand": {
      "slug": "korua-shapes",
      "name": "Korua Shapes",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 161,
      "effectiveEdge": 1310,
      "sidecut": 9.4,
      "waistWidth": 262,
      "stanceSetback": 45,
      "profile": "纯 Camber + 长板头",
      "profileFamily": "camber",
      "shape": "强定向",
      "core": "白杨 / 竹混合",
      "fiberglass": "Triax",
      "base": "烧结 9000",
      "weight": 3120,
      "flex": 7.5,
      "damping": 8.5,
      "pop": 5,
      "turnRadiusFeel": "大半径长弧，越滑越快",
      "scenes": [
        "carving",
        "powder"
      ],
      "warranty": 2
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "161cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1310mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "9.4m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "262mm"
      }
    ]
  },
  {
    "id": "01a0a804-2c1f-723d-8b9b-9cd1651c9f93",
    "slug": "lib-tech-t-rice-pro-2025",
    "title": "Lib Tech T.Rice Pro 2025",
    "model": "T.Rice Pro",
    "year": 2025,
    "oneLiner": "为硬雪面和大跳台设计。波浪边刃在冰面上咬得住，落地时板面吸收冲击的能力比同硬度对手好一档。",
    "priceMin": 5699,
    "priceMax": 5699,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.evo.com/cdn/shop/files/product-image-1153304.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.4,
    "brand": {
      "slug": "lib-tech",
      "name": "Lib Tech",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1210,
      "sidecut": 7.7,
      "waistWidth": 256,
      "stanceSetback": 0,
      "profile": "C2（板下反弓 + 板头尾 Camber）",
      "profileFamily": "hybrid",
      "shape": "真双向",
      "core": "Aspen / Paulownia 混合",
      "fiberglass": "Biax + Triax",
      "base": "烧结 UHMW",
      "weight": 2890,
      "flex": 6.5,
      "damping": 7,
      "pop": 8.5,
      "turnRadiusFeel": "抓刃强，波浪边刃",
      "scenes": [
        "freestyle",
        "all-mountain"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1210mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.7m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "256mm"
      }
    ]
  },
  {
    "id": "01a0a804-2c32-72af-9a85-0f61a6ec8d78",
    "slug": "never-summer-proto-slinger-2025",
    "title": "Never Summer Proto Slinger 2025",
    "model": "Proto Slinger",
    "year": 2025,
    "oneLiner": "全山地里性格最鲜明的一块。碳纤层让它的回弹比同价位明显更快，出弯时能感觉到板子在推你。",
    "priceMin": 5499,
    "priceMax": 5499,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.evo.com/cdn/shop/files/product-image-1104917.jpg?v=1767733189",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.8,
    "brand": {
      "slug": "never-summer",
      "name": "Never Summer",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1215,
      "sidecut": 7.9,
      "waistWidth": 254,
      "stanceSetback": 12,
      "profile": "Ripsaw（Camber 主导 + 板头长摇臂）",
      "profileFamily": "hybrid",
      "shape": "定向双向",
      "core": "白杨 + 竹条",
      "fiberglass": "Triax Carbon",
      "base": "烧结 Durasurf",
      "weight": 2840,
      "flex": 6,
      "damping": 7.5,
      "pop": 8,
      "turnRadiusFeel": "入弯快，出弯有推背感",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1215mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.9m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "254mm"
      }
    ]
  },
  {
    "id": "01a0d149-6548-7c35-955e-8a005f1e4ada",
    "slug": "nitro-alternator-2027",
    "title": "Nitro Alternator 2027",
    "model": "Alternator",
    "year": 2027,
    "oneLiner": "定向全山自由式板，传统正拱与中宽腰设计面向山地跳跃、刻滑和变化雪况。Nitro 官方商品目录价 $599.90，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 4319,
    "priceMax": 4319,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/11SB11012-101-157_Alternator_Product-1.jpg?v=1779104369&width=985",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "waistWidth": 254,
      "stanceSetback": 15,
      "profile": "Trüe Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "Powerlite Core",
      "fiberglass": "Bi-Lite Laminates",
      "base": "Sintered Speed Formula II",
      "flex": 8,
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "254mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "8/10"
      }
    ]
  },
  {
    "id": "01a0fab1-2271-7dff-8603-dbb13c01bfec",
    "slug": "nitro-banker-2027",
    "title": "Nitro Banker Snowboard 2027",
    "model": "Banker",
    "year": 2027,
    "oneLiner": "面向全山高速刻滑与粉雪地形的定向板，采用 True Camber、Powercore II 与烧结底板；官方标注硬度 8/10。",
    "priceMin": 4679,
    "priceMax": 4679,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/11SB11004-101-1multBankerII.jpg?v=1787539883",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "waistWidth": 255,
      "stanceSetback": -15,
      "profile": "True Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "Powercore II",
      "fiberglass": "Bi-Lite Laminates",
      "base": "Sintered EcoSpeed HD",
      "flex": 8,
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "255mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "8/10"
      }
    ]
  },
  {
    "id": "01a0d149-5fc3-76c9-80bc-23fc03fc6554",
    "slug": "nitro-beast-2026",
    "title": "Nitro Beast 2026",
    "model": "Beast",
    "year": 2026,
    "oneLiner": "25/26 款高响应公园自由式板，True Camber 与 Twin 板型强调弹性、控刃和耐用性；零售 MSRP $689.95，按项目参考汇率 1 USD=¥7.2 折算约 ¥4,968 CNY。",
    "priceMin": 4968,
    "priceMax": 4968,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/833227-001_Beast_151_Product-1.jpg?v=1755928801&width=995",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "profile": "Trüe Camber",
      "profileFamily": "camber",
      "shape": "True Twin",
      "core": "Powercore II",
      "fiberglass": "Tri-Lite Laminates",
      "base": "Sintered Speed Formula II",
      "flex": 9,
      "scenes": [
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "9/10"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "自由式 · 全山地"
      }
    ]
  },
  {
    "id": "01a0a804-2c45-7613-9918-0b143a5890ce",
    "slug": "nitro-team-2026",
    "title": "Nitro Team 2026",
    "model": "Team",
    "year": 2026,
    "oneLiner": "同价位里最难被挑出毛病的一块。它把全山地和公园的边界模糊掉了，价格还压在 5000 以内。",
    "priceMin": 4599,
    "priceMax": 4599,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.nitrosnow.ca/cdn/shop/files/22_82ac62fb-84b5-43f9-ad67-b43bfc261588.png?v=1784751877",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.9,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1205,
      "sidecut": 7.8,
      "waistWidth": 253,
      "stanceSetback": 15,
      "profile": "Cam-Out Camber",
      "profileFamily": "hybrid",
      "shape": "定向双向",
      "core": "Powerlite 白杨",
      "fiberglass": "Biax",
      "base": "烧结 Speedlite",
      "weight": 2810,
      "flex": 6,
      "damping": 7,
      "pop": 7.5,
      "turnRadiusFeel": "中性偏快，好带",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 2
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1205mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "253mm"
      }
    ]
  },
  {
    "id": "01a0d149-4433-792a-8d2d-b7574cb6bdb9",
    "slug": "ogasaka-ct-2026",
    "title": "OGASAKA CT 2026",
    "model": "CT",
    "year": 2026,
    "oneLiner": "面向从初级到高水平滑手的全能刻滑板，方向性板型与较均衡的软硬设定兼顾刻滑和日常滑行；25/26 官方含税价 ¥114,400，按 2026-10-02 参考汇率折算约 ¥4,856 CNY。",
    "priceMin": 4856,
    "priceMax": 4856,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.ogasaka-snowboard.com/2025-img/03_ct_02.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "ogasaka",
      "name": "OGASAKA",
      "nameCn": "小贺坂"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "NV Core",
      "fiberglass": "Glass Fiber Carbon Composite",
      "base": "Sintered Graphite",
      "scenes": [
        "carving",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑 · 全山地"
      }
    ]
  },
  {
    "id": "01a0d149-412a-7332-ba5f-19fc0bb56d2f",
    "slug": "ogasaka-fc-2026",
    "title": "OGASAKA FC 2026",
    "model": "FC",
    "year": 2026,
    "oneLiner": "半锤头轮廓的自由式刻滑板，长有效边刃强调抓雪和弯中稳定；25/26 官方 157cm 含税价 ¥126,500，按 2026-10-02 参考汇率折算约 ¥5,370 CNY。",
    "priceMin": 5370,
    "priceMax": 5370,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.ogasaka-snowboard.com/2025-img/08_fc_03.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "ogasaka",
      "name": "OGASAKA",
      "nameCn": "小贺坂"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1280,
      "waistWidth": 249,
      "stanceSetback": 28,
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "Directional Semi-Hammerhead",
      "core": "OGK2 Core",
      "base": "Sintered Graphite",
      "scenes": [
        "carving",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1280mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "249mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      }
    ]
  },
  {
    "id": "01a0d149-47b1-7c7c-9796-72a61000c4c2",
    "slug": "ogasaka-shin-2026",
    "title": "OGASAKA SHIN 2026",
    "model": "SHIN",
    "year": 2026,
    "oneLiner": "面向粉雪和全山地的系列雪板，官方将其定位为适应多种雪况的中高级型号；25/26 官方含税价 ¥132,000，按 2026-10-02 参考汇率折算约 ¥5,603 CNY；不同长度的尺寸与结构不可混用。",
    "priceMin": 5603,
    "priceMax": 5603,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.ogasaka-snowboard.com/2025-img/12_shin_160.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "ogasaka",
      "name": "OGASAKA",
      "nameCn": "小贺坂"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 160,
      "waistWidth": 260,
      "stanceSetback": 20,
      "shape": "Directional",
      "core": "OGK2 Core",
      "base": "Sintered Graphite",
      "scenes": [
        "powder",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "160cm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "260mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "野雪浮雪 · 全山地"
      }
    ]
  },
  {
    "id": "01a0a804-2c54-727f-919c-d84cdf5db3a9",
    "slug": "ride-algorythm-2026",
    "title": "Ride Algorythm 2026",
    "model": "Algorythm",
    "year": 2026,
    "oneLiner": "为深雪日准备的重武器。板头浮力大到你会忘记自己脚下有 3 公斤的东西，回到压雪道也依然稳。",
    "priceMin": 7299,
    "priceMax": 7299,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.milosport.com/cdn/shop/files/RD2510321398Large.png?v=1742933585&width=2048",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.6,
    "brand": {
      "slug": "ride",
      "name": "Ride",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 160,
      "effectiveEdge": 1265,
      "sidecut": 8.6,
      "waistWidth": 264,
      "stanceSetback": 40,
      "profile": "Camber + 大板头摇臂",
      "profileFamily": "hybrid",
      "shape": "强定向锥形",
      "core": "白杨 / 竹 / 碳纤维梁",
      "fiberglass": "Triax Carbon",
      "base": "烧结 9000",
      "weight": 3050,
      "flex": 8,
      "damping": 9,
      "pop": 6,
      "turnRadiusFeel": "大弧为主，深雪里转向轻盈",
      "scenes": [
        "powder",
        "carving"
      ],
      "warranty": 3
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "160cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1265mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.6m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "264mm"
      }
    ]
  },
  {
    "id": "01a0faeb-2199-7ca6-b03f-91abcc16ccf8",
    "slug": "ride-deep-fake-2027",
    "title": "RIDE Deep Fake Snowboard 2027",
    "model": "Deep Fake",
    "year": 2027,
    "oneLiner": "高阶定向全山板，主打快速换刃、硬雪抓边与粉雪浮力；美国官网 MSRP $799.95，按项目 USD/CNY 7.2 参考汇率折算，非中国零售价。",
    "priceMin": 5760,
    "priceMax": 5760,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.media.amplience.net/s/ride/ride_2627_deep-fake_RD261850?w=1200&qlt=90&fmt=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "ride",
      "name": "Ride",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1190,
      "waistWidth": 251,
      "profile": "Directional Extra Camber",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "Performance Core（白杨 / 竹 / 泡桐）",
      "fiberglass": "Pre-Cured Glass",
      "base": "Sintered Low Friction Race Base",
      "scenes": [
        "all-mountain",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1190mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "251mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a0faeb-3025-7cf9-9504-7d796a021b40",
    "slug": "ride-warpig-2027",
    "title": "RIDE WARPIG Snowboard 2027",
    "model": "WARPIG",
    "year": 2027,
    "oneLiner": "宽体积短板型定向全山板，兼顾压雪道刻滑、跳台和粉雪；美国官网 MSRP $599.95，按项目 USD/CNY 7.2 参考汇率折算，非中国零售价。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.media.amplience.net/s/ride/ride_2627_warpig_RD261857?w=1200&qlt=90&fmt=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "ride",
      "name": "Ride",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 154,
      "effectiveEdge": 1146,
      "waistWidth": 270,
      "profile": "Zero Camber",
      "shape": "Directional volume-shifted",
      "core": "Performance Core（白杨 / 竹 / 泡桐）",
      "fiberglass": "Hybrid Glass",
      "base": "Sintered 4000",
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "154cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1146mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "270mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 自由式 · 野雪浮雪"
      }
    ]
  },
  {
    "id": "01a0d149-51de-7454-ab33-37a80c6f1a61",
    "slug": "salomon-assassin-2026",
    "title": "Salomon Assassin 2026",
    "model": "Assassin",
    "year": 2026,
    "oneLiner": "面向全山日常滑行的多用途板，方向性双向板型与 Rock Out Camber 兼顾浮雪、刻滑和自由式；25/26 MSRP $649.95，按项目参考汇率 1 USD=¥7.2 折算约 ¥4,680 CNY。",
    "priceMin": 4680,
    "priceMax": 4680,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/af8e2e75-eeed-4307-9ef2-b3b8010090b3/L49291700/PNG-2000px-max-72dpi.png?width=3840&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "sidecut": 7.1,
      "waistWidth": 248,
      "profile": "Rock Out Camber",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "Popster",
      "fiberglass": "BIAX HD",
      "base": "Sintered EG",
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.1m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "248mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 自由式 · 野雪浮雪"
      }
    ]
  },
  {
    "id": "01a0d149-4e97-7482-bed3-233b96946239",
    "slug": "salomon-assassin-pro-2027",
    "title": "Salomon Assassin Pro 2027",
    "model": "Assassin Pro",
    "year": 2027,
    "oneLiner": "全山与自由式兼顾的进阶型号，Rock Out Camber、Ghost Carbon Beams 与 Gunslinger Sidewalls 面向高响应滑行。2027 美区零售标价 $699.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 5040,
    "priceMax": 5040,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/27ef3c33-710b-4b27-8734-b3b801009110/L49292000/PNG-2000px-max-72dpi.png?width=3840&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "sidecut": 7.3,
      "waistWidth": 248,
      "profile": "Rock Out Camber",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "Ghost Green Core / Popster Core",
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ]
    },
    "highlights": [
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.3m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "248mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 自由式 · 野雪浮雪"
      }
    ]
  },
  {
    "id": "01a0d149-4b30-7fde-b329-a10b506c93b3",
    "slug": "salomon-huck-knife-2027",
    "title": "Salomon Huck Knife 2027",
    "model": "Huck Knife",
    "year": 2027,
    "oneLiner": "以跳台、道具和公园自由式为主的真双向板，Quad Camber 取向强调弹性、响应和落地稳定。2027 美区零售标价 $579.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 4176,
    "priceMax": 4176,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/e650fee6-2dae-488b-9c35-b3b80100923d/L49292200/PNG-2000px-max-72dpi.png?width=3840&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "sidecut": 7.1,
      "waistWidth": 248,
      "profile": "Quad Camber",
      "profileFamily": "camber",
      "shape": "True Twin",
      "core": "Popster",
      "base": "Sintered",
      "scenes": [
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "156cm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.1m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "248mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      }
    ]
  },
  {
    "id": "01a0a804-2c66-7a84-8a68-a17b879beccb",
    "slug": "salomon-sight-2026",
    "title": "Salomon Sight 2026",
    "model": "Sight",
    "year": 2026,
    "oneLiner": "它存在的意义就是让你少摔几次。板头板尾的反弓把卡刃概率压到很低，价格还留在入门区间。",
    "priceMin": 3299,
    "priceMax": 3299,
    "priceCurrency": "CNY",
    "coverUrl": "https://salomon.jp/cdn/shop/files/L47924900_0_VIR_SIGHT_156.png?v=1756098039",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.2,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 155,
      "effectiveEdge": 1180,
      "sidecut": 7.8,
      "waistWidth": 254,
      "stanceSetback": 10,
      "profile": "Rocker-Camber-Rocker",
      "profileFamily": "hybrid",
      "shape": "定向",
      "core": "白杨 + 泡棉",
      "fiberglass": "Biax",
      "base": "挤压 3500",
      "weight": 2650,
      "flex": 4,
      "damping": 5.5,
      "pop": 4.5,
      "turnRadiusFeel": "宽松，容错高",
      "scenes": [
        "beginner",
        "all-mountain"
      ],
      "warranty": 2
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "155cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1180mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "254mm"
      }
    ]
  },
  {
    "id": "01a0d171-cd26-7b34-9dc1-569100b9cab6",
    "slug": "burton-cartel-re-flex-2027",
    "title": "Burton Cartel Re:Flex 2027",
    "model": "Cartel Re:Flex",
    "year": 2027,
    "oneLiner": "Cartel 系列通用安装版本，官方定位为兼顾响应与多场景的全能固定器。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/1053917E7W_1.webp?v=1783620002&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex，兼容主要雪板安装系统（旧款 Burton 3D 需另配圆盘）",
      "bootCompatibility": "Re:Flex 多板型安装；适配普通绑带雪鞋",
      "bindingSizeGuide": "Burton 男款尺码表：S 对应雪鞋 US 6–8 / Mondo 24–26；M 对应 US 8–11 / Mondo 26–29；L 对应 US 10+ / Mondo 28+。官方区间有重叠，请按具体雪鞋试配。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-cd59-7f2a-ade6-80f0ce04387b",
    "slug": "burton-cartel-x-re-flex-2027",
    "title": "Burton Cartel X Re:Flex 2027",
    "model": "Cartel X Re:Flex",
    "year": 2027,
    "oneLiner": "Cartel X 通用安装版本，面向需要更强支撑和控制的全山地滑行。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/2223010FA9_1.webp?v=1783620024&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "stiff",
      "mountingSystem": "Re:Flex，兼容主要雪板安装系统（旧款 Burton 3D 需另配圆盘）",
      "bootCompatibility": "Re:Flex 多板型安装；适配普通绑带雪鞋",
      "bindingSizeGuide": "Burton 男款尺码表：S 对应雪鞋 US 6–8 / Mondo 24–26；M 对应 US 8–11 / Mondo 26–29；L 对应 US 10+ / Mondo 28+。官方区间有重叠，请按具体雪鞋试配。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-cd6b-7eb7-8389-8d95d4fd3f72",
    "slug": "burton-freestyle-re-flex-2027",
    "title": "Burton Freestyle Re:Flex 2027",
    "model": "Freestyle Re:Flex",
    "year": 2027,
    "oneLiner": "偏柔和脚感的传统绑带款，适合自由式与日常全山地使用。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/105441BE8FRG_1.webp?v=1784128020&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "soft",
      "mountingSystem": "Re:Flex，兼容主要雪板安装系统（旧款 Burton 3D 需另配圆盘）",
      "bootCompatibility": "Re:Flex 多板型安装；适配普通绑带雪鞋",
      "bindingSizeGuide": "Burton 男款尺码表：S 对应雪鞋 US 6–8 / Mondo 24–26；M 对应 US 8–11 / Mondo 26–29；L 对应 US 10+ / Mondo 28+。官方区间有重叠，请按具体雪鞋试配。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "柔软"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-cd78-75f7-a6f8-4abf7eb8b688",
    "slug": "burton-genesis-re-flex-2027",
    "title": "Burton Genesis Re:Flex 2027",
    "model": "Genesis Re:Flex",
    "year": 2027,
    "oneLiner": "采用 Genesis 缓震结构的绑带款，主打舒适脚感与全山地性能。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/1054719E9M_1.webp?v=1784135138&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex，兼容主要雪板安装系统（旧款 Burton 3D 需另配圆盘）",
      "bootCompatibility": "Re:Flex 多板型安装；适配普通绑带雪鞋",
      "bindingSizeGuide": "Burton 男款尺码表：S 对应雪鞋 US 6–8 / Mondo 24–26；M 对应 US 8–11 / Mondo 26–29；L 对应 US 10+ / Mondo 28+。官方区间有重叠，请按具体雪鞋试配。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-cd86-79f8-944e-e357366379bc",
    "slug": "burton-lexa-x-est-2027",
    "title": "Burton Lexa X EST 2027",
    "model": "Lexa X EST",
    "year": 2027,
    "oneLiner": "Burton 女款 Lexa X EST 固定器，EST 结构对应 The Channel 安装系统。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/2223314E9R_1.webp?v=1783620802&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "EST，仅适配 Burton The Channel",
      "bootCompatibility": "EST 版本仅用于 Burton The Channel 雪板；适配普通绑带雪鞋",
      "bindingSizeGuide": "Burton 女款尺码表：S 对应雪鞋 US 4–6 / Mondo 21–23；M 对应 US 6–8 / Mondo 23–25；L 对应 US 8+ / Mondo 25+。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-cd91-7d2c-b73c-34cc569d209c",
    "slug": "burton-mission-re-flex-2027",
    "title": "Burton Mission Re:Flex 2027",
    "model": "Mission Re:Flex",
    "year": 2027,
    "oneLiner": "Burton 入门进阶全山地绑带款，官方强调缓震与通用安装兼容。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/1054617E9K_1.webp?v=1783620127&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex，兼容主要雪板安装系统（旧款 Burton 3D 需另配圆盘）",
      "bootCompatibility": "Re:Flex 多板型安装；适配普通绑带雪鞋",
      "bindingSizeGuide": "Burton 男款尺码表：S 对应雪鞋 US 6–8 / Mondo 24–26；M 对应 US 8–11 / Mondo 26–29；L 对应 US 10+ / Mondo 28+。官方区间有重叠，请按具体雪鞋试配。",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0d171-cd9c-7c42-ab81-d88c9e19abcd",
    "slug": "burton-step-on-genesis-re-flex-2027",
    "title": "Burton Step On Genesis Re:Flex 2027",
    "model": "Step On Genesis Re:Flex",
    "year": 2027,
    "oneLiner": "结合 Step On 快穿与 Genesis 缓震结构；Re:Flex 安装兼容多种雪板系统。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/2296011E9M_1.webp?v=1782872039&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "step-in",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex，兼容主要雪板安装系统（旧款 Burton 3D 需另配圆盘）",
      "bootCompatibility": "仅兼容 Burton Step On 雪鞋；Re:Flex 多板型安装",
      "bindingSizeGuide": "Burton 男款 Step On 尺码表：S 对应雪鞋 US 6–8 / Mondo 24–26 / CN 240–260；M 对应 US 8.5–10.5 / Mondo 26.5–28.5 / CN 265–285；L 对应 US 11–13 / Mondo 29–31 / CN 290–310；XL 对应 US 14–15 / Mondo 32–33 / CN 320–330。仅配 Burton Step On 雪鞋。",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "踩入式"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0d171-cda8-728b-b82d-df8823fc368e",
    "slug": "burton-step-on-re-flex-2027",
    "title": "Burton Step On Re:Flex 2027",
    "model": "Step On Re:Flex",
    "year": 2027,
    "oneLiner": "Step On 快穿系统的 Re:Flex 版本，须与 Step On 雪鞋配套使用。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/1728316E7W_1.webp?v=1783620482&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "step-in",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex，兼容主要雪板安装系统（旧款 Burton 3D 需另配圆盘）",
      "bootCompatibility": "仅兼容 Burton Step On 雪鞋；Re:Flex 多板型安装",
      "bindingSizeGuide": "Burton 男款 Step On 尺码表：S 对应雪鞋 US 6–8 / Mondo 24–26 / CN 240–260；M 对应 US 8.5–10.5 / Mondo 26.5–28.5 / CN 265–285；L 对应 US 11–13 / Mondo 29–31 / CN 290–310；XL 对应 US 14–15 / Mondo 32–33 / CN 320–330。仅配 Burton Step On 雪鞋。",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "踩入式"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-5e10-7026-bf38-780f4de363f6",
    "slug": "cosone-step-on-binding-2026",
    "title": "COSONE Step On 快穿固定器 2026",
    "model": "Step On",
    "year": 2026,
    "oneLiner": "COSONE 官网本季精选固定器，官方称其为 Step On 快穿款；具体雪鞋兼容范围待品牌进一步说明。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "cosone",
      "name": "COSONE",
      "nameCn": "COSONE"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "step-in"
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "踩入式"
      }
    ]
  },
  {
    "id": "01a0d171-cdb4-7b9c-a7ea-7957096ae6e9",
    "slug": "decathlon-snb-500-binding-2026",
    "title": "Decathlon SNB 500 2026",
    "model": "SNB 500",
    "year": 2026,
    "oneLiner": "国内京东可见 200+ 条评论的入门全山地款；官方列出 EVA 缓震和传统扣带。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2573496/k%24353e5fd924967da12911035b5eeb0342/picture.jpg?format=webp&f=3000x0",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "插孔圆盘；兼容常规及 Burton 3D 插孔，不兼容 Channel",
      "bootCompatibility": "兼容常规及 3D 插孔；不兼容 Burton Channel；普通绑带雪鞋",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-9716-7e7d-9884-d5341096a0ce",
    "slug": "flow-fenix-binding-2027",
    "title": "Flow Fenix 2027",
    "model": "Fenix",
    "year": 2027,
    "oneLiner": "Flow 后入式固定器，官网描述其定位兼顾公园动作与雪场巡航。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0685/4131/7295/files/N.27.BNU.FEF.400-Flow_Fenix_Cyber_Blue-1.webp?v=1788232266&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flow",
      "name": "Flow",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "mid-soft",
      "mountingSystem": "Flow/Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：S US 男/Youth 2–4.5 / EU 35–36；M 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "后入式快穿"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中偏软"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-9a2b-74f4-8da5-95412f30dbe6",
    "slug": "flow-fuse-binding-2026",
    "title": "Flow Fuse 2026",
    "model": "Fuse",
    "year": 2026,
    "oneLiner": "Flow 后入式固定器，Fusion 一体式绑带协助快速进入后仰高背结构。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0674/9582/1405/files/High-_0024_FLOW_FUSE_WHITE_fusion.jpg?v=1788232288&width=800",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flow",
      "name": "Flow",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "mid-stiff",
      "mountingSystem": "Flow/Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：M US 男/Youth 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "后入式快穿"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-9d36-76fe-a7a0-595fddec7151",
    "slug": "flow-fuse-hybrid-binding-2026",
    "title": "Flow Fuse Hybrid 2026",
    "model": "Fuse Hybrid",
    "year": 2026,
    "oneLiner": "Flow 后入式固定器的 Hybrid 绑带版本，保留传统双绑带脚感并支持快速穿脱。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0685/4131/7295/files/N.26.BNU.FUH.GN-Flow_Fuse_Hybrid_Khaki-1.webp?v=1786448686&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flow",
      "name": "Flow",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "mid-stiff",
      "mountingSystem": "Flow/Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：M US 男/Youth 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "后入式快穿"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-a04b-7973-a2c3-5037a58d426a",
    "slug": "flow-nexus-binding-2027",
    "title": "Flow Nexus 2027",
    "model": "Nexus",
    "year": 2027,
    "oneLiner": "Flow 后入式固定器，官网介绍采用单片 Fusion 绑带与后仰高背穿脱结构。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0685/4131/7295/files/N.27.BNU.NEF.001-Flow_Nexus_Black-1_bql3pa.webp?v=1788232250&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flow",
      "name": "Flow",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "soft",
      "mountingSystem": "Flow/Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：S US 男/Youth 2–4.5 / EU 35–36；M 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "后入式快穿"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "柔软"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-a370-7287-9ade-2a8dc1dbc3bf",
    "slug": "flow-nx2-carbon-binding-2027",
    "title": "Flow NX2 Carbon 2027",
    "model": "NX2 Carbon",
    "year": 2027,
    "oneLiner": "Flow 高背后仰式固定器，官网标注铝合金底板与碳纤维复合高背。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0685/4131/7295/files/Flow-NX2-Carbon-Fusion-Black-1.webp?v=1786507660&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flow",
      "name": "Flow",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "pro-stiff",
      "mountingSystem": "Flow/Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：M US 男/Youth 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "后入式快穿"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "专业硬朗"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-a67a-7a59-a463-796007366c69",
    "slug": "flow-nx2-hybrid-binding-2027",
    "title": "Flow NX2 Hybrid 2027",
    "model": "NX2 Hybrid",
    "year": 2027,
    "oneLiner": "Flow NX2 系列后入式固定器，采用 Hybrid 绑带配置。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0685/4131/7295/files/N.27.BNU.N2H.001-Flow_NX2_Hybrid_Black-1.webp?v=1788231960&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flow",
      "name": "Flow",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "stiff",
      "mountingSystem": "Flow/Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：M US 男/Youth 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "后入式快穿"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-cdc0-75bd-8984-e4b6b0c647bd",
    "slug": "flux-cv-2027",
    "title": "FLUX CV 2027",
    "model": "CV",
    "year": 2027,
    "oneLiner": "26-27 刻滑与全山地取向型号，官方介绍其加高脚床及可调节结构。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0676/1031/3014/files/2627-cv-purple.png?v=1787656749&width=1160",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "mountingSystem": "FLUX Flexible Mounting Disk；圆盘孔位以对应雪板系统核对",
      "bootCompatibility": "FLUX 固定器安装圆盘；适配普通绑带雪鞋",
      "terrain": [
        "carving",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "7"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "刻滑 · 全山地"
      }
    ]
  },
  {
    "id": "01a0d171-cdcd-78fa-b5c0-c01c889ea425",
    "slug": "flux-ds-2027",
    "title": "FLUX DS 2027",
    "model": "DS",
    "year": 2027,
    "oneLiner": "FLUX 自由式全能款，26-27 官方页面介绍轻量底座与 Cloud Strap。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.fluxsnowboarding.com/cdn/shop/files/25_1_bk_bs.png?v=1758571720&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "mid-stiff",
      "mountingSystem": "FLUX Flexible Mounting Disk；圆盘孔位以对应雪板系统核对",
      "bootCompatibility": "FLUX 固定器安装圆盘；适配普通绑带雪鞋",
      "terrain": [
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "自由式 / 公园 · 全山地"
      }
    ]
  },
  {
    "id": "01a0d171-cdd7-735a-b5f7-1ee5f9c820ad",
    "slug": "flux-gs-2026",
    "title": "FLUX GS 2026",
    "model": "GS",
    "year": 2026,
    "oneLiner": "女款全能固定器，官方介绍其沿用 DS 特性并兼顾活动范围与舒适度。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0676/1031/3014/files/60_1_f25-bdg-302-gs-blk.png?v=1705538624&width=1160",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 3,
      "mountingSystem": "FLUX Flexible Mounting Disk；圆盘孔位以对应雪板系统核对",
      "bootCompatibility": "FLUX 固定器安装圆盘；适配普通绑带雪鞋",
      "terrain": [
        "freestyle",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "3"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "自由式 / 公园 · 全山地"
      }
    ]
  },
  {
    "id": "01a0d171-cdf6-78f5-88a2-a46fd8a67767",
    "slug": "flux-xf-2026",
    "title": "FLUX XF 2026",
    "model": "XF",
    "year": 2026,
    "oneLiner": "25-26 XF 型号，官方覆盖公园、刻滑、粉雪与全山地取向。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0676/1031/3014/files/23_1_gmable_bs-1.png?v=1775183864&width=1160",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "mountingSystem": "FLUX Flexible Mounting Disk；圆盘孔位以对应雪板系统核对",
      "bootCompatibility": "FLUX 固定器安装圆盘；适配普通绑带雪鞋",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "7"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-cdff-7b39-9f2f-bf3e24ae584e",
    "slug": "flux-xv-2026",
    "title": "FLUX XV 2026",
    "model": "XV",
    "year": 2026,
    "oneLiner": "FLUX 高阶硬质型号，官方介绍其碳纤维高背与轻量化响应结构。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0676/1031/3014/files/2_1_xv__bronze_bs-1.png?v=1757410220&width=1160",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 9,
      "mountingSystem": "FLUX Flexible Mounting Disk；圆盘孔位以对应雪板系统核对",
      "bootCompatibility": "FLUX 固定器安装圆盘；适配普通绑带雪鞋",
      "terrain": [
        "freeride",
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "9"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "野雪 / freeride · 全山地"
      }
    ]
  },
  {
    "id": "01a0d171-ce0b-70fa-ab1f-bac6788aa429",
    "slug": "jones-mercury-binding-2026",
    "title": "Jones Mercury 2026",
    "model": "Mercury",
    "year": 2026,
    "oneLiner": "全地形 freeride 取向固定器，采用 SkateTech 力量传递结构。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.26.BNM.MER.GY-gallery-1.webp?v=1768450607&width=1946",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "mountingSystem": "Universal Disk；兼容 4x4、2x4 与 EST/Channel",
      "bootCompatibility": "通用圆盘适配 4x4、2x4 与 Channel；普通绑带雪鞋",
      "bindingSizeGuide": "Jones 男款：S 对应雪鞋 US 5–7 / EU 36.5–39.5 / Mondo 23.5–25；M 对应 US 7.5–10 / EU 40–43 / 25.5–28；L 对应 US 10.5+ / EU 43.5+ / 28.5+。女款：S US 5–8.5 / EU 35–39.5 / Mondo 22–25；M US 9–11.5 / EU 40–42.5 / 25.5–27.5。",
      "terrain": [
        "all-mountain",
        "freeride",
        "freestyle"
      ],
      "brandFlexScore10": 7,
      "brandResortScore10": 9,
      "brandPowScore10": 9,
      "brandParkScore10": 8
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "7"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-ce15-79e6-9ac9-bcbc36c8708c",
    "slug": "jones-mercury-fase-binding-2026",
    "title": "Jones Mercury FASE 2026",
    "model": "Mercury FASE",
    "year": 2026,
    "oneLiner": "Mercury 加入 FASE 快速绑带系统，支持单手穿入并可回退传统绑带操作。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.26.BNU.MHF.C4-gallery-8.webp?v=1776481535&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "fast-entry",
      "flex": 7,
      "flexFeel": "medium",
      "mountingSystem": "Universal Disk；兼容 4x4、2x4 与 EST/Channel",
      "bootCompatibility": "FASE 官方称兼容各品牌普通雪鞋",
      "bindingSizeGuide": "Jones Mercury FASE：S 对应雪鞋 US 男/Youth 5–8、女 6.5–9.5 / EU 37.5–41 / Mondo 23–26；M 对应 US 男/Youth 8.5–10.5、女 10–12 / EU 41.5–44 / 26.5–28.5；L 对应 US 男/Youth 11–14、女 12.5–15.5 / EU 44.5–48 / 29–31。",
      "terrain": [
        "all-mountain",
        "freeride",
        "freestyle"
      ],
      "brandFlexScore10": 7,
      "brandResortScore10": 10,
      "brandPowScore10": 10,
      "brandParkScore10": 6
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "快速穿脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "7"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-ce1e-746f-b8ae-a512e0d7edbc",
    "slug": "jones-orion-binding-2026",
    "title": "Jones Orion 2026",
    "model": "Orion",
    "year": 2026,
    "oneLiner": "Jones 2026 全山地固定器，官方页面列出多场景取向与常规双绑带结构。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0694/6291/7272/files/J.26.BNM.ORI.BU-gallery-1.webp?v=1768452354&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Disk；兼容 4x4、2x4 与 EST/Channel",
      "bootCompatibility": "Jones 通用圆盘；普通绑带雪鞋",
      "bindingSizeGuide": "Jones 男款：S 对应雪鞋 US 5–7 / EU 36.5–39.5 / Mondo 23.5–25；M 对应 US 7.5–10 / EU 40–43 / 25.5–28；L 对应 US 10.5+ / EU 43.5+ / 28.5+。女款：S US 5–8.5 / EU 35–39.5 / Mondo 22–25；M US 9–11.5 / EU 40–42.5 / 25.5–27.5。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "brandFlexScore10": 6,
      "brandResortScore10": 9,
      "brandPowScore10": 8,
      "brandParkScore10": 9
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-ce29-7f0d-a364-d9771ae03879",
    "slug": "nidecker-kaon-plus-2026",
    "title": "Nidecker Kaon Plus 2026",
    "model": "Kaon Plus",
    "year": 2026,
    "oneLiner": "中硬度双绑带全能款，配备 Multi-Disk 与无工具绑带调节。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0674/9582/1405/files/N.26.BNU.KAP.BK-Kaon_Plus_Bio_Black-1.webp?v=1786632652&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nidecker",
      "name": "Nidecker",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "mid-stiff",
      "mountingSystem": "Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bootCompatibility": "Multi-Disk 兼容常见 4 孔与 Channel；普通绑带雪鞋",
      "bindingSizeGuide": "Nidecker 官方商品页尺码：S EU 35–36；M 37–41；L 41.5–44.5；XL 45–49.5。",
      "terrain": [
        "all-mountain"
      ],
      "brandFlexScore": 3,
      "brandResortScore": 4,
      "brandPowScore": 4,
      "brandParkScore": 4
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0d171-ce33-7328-b8af-3d87718dcf67",
    "slug": "nidecker-lt-supermatic-2026",
    "title": "Nidecker LT Supermatic 2026",
    "model": "LT Supermatic",
    "year": 2026,
    "oneLiner": "Supermatic 轻量快速穿脱系列，侧重支撑、响应与快速进出。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0674/9582/1405/files/N.26.BNU.SPL.C5-LT_Supermatic_Bio_Black-1.webp?v=1786460721&width=1946",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nidecker",
      "name": "Nidecker",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "stiff",
      "mountingSystem": "Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bootCompatibility": "无需专用雪鞋；官方称兼容几乎所有品牌雪鞋",
      "bindingSizeGuide": "Nidecker 官方商品页尺码：M EU 37.5–41；L 41.5–44；XL 44.5–47。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "brandFlexScore": 4,
      "brandResortScore": 5,
      "brandPowScore": 4,
      "brandParkScore": 3
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "后入式快穿"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-ce3f-721c-9f76-efdbb245281f",
    "slug": "nidecker-og-supermatic-2026",
    "title": "Nidecker OG Supermatic 2026",
    "model": "OG Supermatic",
    "year": 2026,
    "oneLiner": "后入式快速穿脱固定器，可在需要时按传统绑带方式使用。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0674/9582/1405/files/N.26.BNU.SPM.BN-OG_Supermatic_Desert-1.webp?v=1786464048&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nidecker",
      "name": "Nidecker",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "mid-stiff",
      "mountingSystem": "Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bootCompatibility": "无需专用雪鞋；官方称兼容几乎所有品牌雪鞋",
      "bindingSizeGuide": "Nidecker 官方商品页尺码：S EU 35.5–37.5；M 37.5–41；L 41.5–44；XL 44.5–47。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "brandFlexScore": 3,
      "brandResortScore": 5,
      "brandPowScore": 3,
      "brandParkScore": 3
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "后入式快穿"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-a99c-7ddb-8c93-daaec3ec49c8",
    "slug": "nidecker-orbit-binding-2027",
    "title": "Nidecker Orbit 2027",
    "model": "Orbit",
    "year": 2027,
    "oneLiner": "Nidecker 双绑带固定器，官方列出可调 heelcup、脚床、前绑带位置与高背旋转。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0685/4131/7295/files/N.27.BNU.OBS.744-Orbit_Ned-1.webp?v=1789478433&width=1200",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nidecker",
      "name": "Nidecker",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "mid-stiff",
      "mountingSystem": "Nidecker 标准圆盘；孔位与 Channel 适配请按具体圆盘核对",
      "bindingSizeGuide": "Nidecker 美国官方商品页男款/Youth 尺码：M US 5–8；L 8.5–11；XL 11.5–15。",
      "terrain": [
        "all-mountain"
      ],
      "brandFlexScore": 3,
      "brandResortScore": 4,
      "brandPowScore": 3,
      "brandParkScore": 5
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-acae-71a8-87af-3348a30300e0",
    "slug": "nitro-fate-binding-2027",
    "title": "Nitro Fate 女款 2027",
    "model": "Fate",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 女款全山地固定器，官方目录将其列为经典全山地型号。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG21011-103_Fate-Womens-Bindings_Nitro-x-Hailey-Langland_Product-1.jpg?v=1779339397&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bindingSizeGuide": "Nitro 女款官方尺码：S US 女 4–7.5 / MP 21–24.5 / EU 33.5–38；S/M US 女 6–11 / MP 23–28 / EU 36–43。区间有重叠，试穿确认。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 9,
      "brandResponseScore": 7
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-afbe-768c-9cbc-4fdb57eb034a",
    "slug": "nitro-one-binding-2027",
    "title": "Nitro One 2027",
    "model": "One",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 自由式全山地固定器，官方定位为兼顾山地滑行的自由式型号。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG11006-102_One-Bindings_Nitro-x-Motorhead_Product-1.jpg?v=1779339370&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bindingSizeGuide": "Nitro One 官方尺码：M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 男 11–14 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 8,
      "brandResponseScore": 6
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-b2c6-74dd-b2ce-163dc89c350b",
    "slug": "nitro-phantom-binding-2027",
    "title": "Nitro Phantom 2027",
    "model": "Phantom",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 全山地固定器，官方列出 Universal Mini Disc 与 Channel 兼容信息。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG11002-103_Phantom-Bindings_Nitro-x-Eero-Ettala_Product-1.jpg?v=1779339347&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "官方标注适配中宽及偏宽雪鞋；Universal Mini Disc 兼容 2x4 与 Channel",
      "bindingSizeGuide": "Nitro Phantom 官方尺码：M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 男 11–14 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "brandComfortScore": 10,
      "brandResponseScore": 8
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-ce4b-71bf-9c88-5e4533ed1c07",
    "slug": "nitro-phantom-plus-binding-2027",
    "title": "Nitro Phantom+ 2027",
    "model": "Phantom+",
    "year": 2027,
    "oneLiner": "Nitro Phantom+ 高阶 freeride 固定器，列入 26-27 官方目录。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG11001-101_PhantomPlus-Bindings_Ultra-Black_Product-1.jpg?v=1779339335&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "普通绑带雪鞋",
      "bindingSizeGuide": "Nitro Phantom+ 官方尺码：M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 男 11–14 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "brandComfortScore": 10,
      "brandResponseScore": 9
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-b614-7c53-9ac5-1a51800013c5",
    "slug": "nitro-poison-binding-2027",
    "title": "Nitro Poison 女款 2027",
    "model": "Poison",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 女款全山地固定器，官方目录标注为 All-Mountain 系列。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG21009-101_Poison-Womens-Bindings_Ultra-Black_Product-1.jpg?v=1779339363&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bindingSizeGuide": "Nitro Poison 女款官方尺码：S/M 单一尺码，适配 US 女码 6–11 / MP 23–28 / EU 36–43。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 10,
      "brandResponseScore": 8
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-b93d-7a1e-bbeb-ee3e4f06f98d",
    "slug": "nitro-rambler-binding-2027",
    "title": "Nitro Rambler 2027",
    "model": "Rambler",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 全地形绑带固定器，官方标注 Universal Mini Disc 兼容 2x4 与 Channel。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG11007-103_Rambler-Bindings_Lite-Acid_Product-1.jpg?v=1779339376&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "Universal Mini Disc 兼容 2x4 与 Channel；适配常规绑带雪鞋",
      "bindingSizeGuide": "Nitro Rambler 官方尺码：M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 男 11–14 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain"
      ],
      "brandComfortScore": 7,
      "brandResponseScore": 5
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-bc6e-7dfb-aaf7-fd7dbf2b1f8c",
    "slug": "nitro-talent-binding-2027",
    "title": "Nitro Talent 2027",
    "model": "Talent",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 男女通用固定器，品牌官方将其定位为普适型产品。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG41008-105_Talent-Unisex-Bindings_Bubble-Gum_Product-1.jpg?v=1779339424&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bindingSizeGuide": "Nitro Talent 官方尺码：S US 男 3–6.5、女 3.5–7 / MP 21–24.5 / EU 33.5–38；M 男 7–10.5、女 7.5–11 / MP 25–28.5 / EU 38.5–43.5；L 男 11–14、女 11.5–14.5 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 7,
      "brandResponseScore": 4
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-ce57-73cf-a90c-59f75e342ecd",
    "slug": "nitro-team-binding-2027",
    "title": "Nitro Team 2027",
    "model": "Team",
    "year": 2027,
    "oneLiner": "Nitro 经典全能绑带系列，26-27 官方目录列出多种颜色版本。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG11005-104_Team-Bindings_Vivid-Orange_Product-1.jpg?v=1779339368&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "普通绑带雪鞋",
      "bindingSizeGuide": "Nitro Team 官方尺码：M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 男 11–14 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 9,
      "brandResponseScore": 7
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-ce61-7259-b23e-50f2d6dc6df5",
    "slug": "nitro-team-pro-binding-2027",
    "title": "Nitro Team Pro 2027",
    "model": "Team Pro",
    "year": 2027,
    "oneLiner": "Team 系列高阶版本，官方以 Pro-caliber performance 定位。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/12BG11003-103_Team-Pro-Bindings_Nitro-x-Markus-Kleveland_Product-1.jpg?v=1779339350&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "普通绑带雪鞋",
      "bindingSizeGuide": "Nitro Team Pro 官方尺码：S/M US 男 5–10、女 5.5–10.5 / MP 23–28 / EU 36–43；M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L 男 11–14 / MP 29–32 / EU 44–48。官方区间有重叠，试穿确认。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 9,
      "brandResponseScore": 8
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-bf83-71e6-936d-dfed4425a949",
    "slug": "rome-390-boss-aw-binding-2027",
    "title": "Rome 390 Boss AW 2027",
    "model": "390 Boss AW",
    "year": 2027,
    "oneLiner": "Rome 2026–27 AsymWrap 平台传统绑带款，官方定位兼顾自由式脚感与全山地用途。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0370/4055/4115/files/2627-rome-390-boss-aw-c2-acid-binding-1-1782374511046.jpg?v=1787636963&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rome",
      "name": "Rome Snowboards",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 6,
      "mountingSystem": "Rome 标准圆盘；具体孔位兼容以随附圆盘说明为准",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "6"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-c28d-7b08-86e2-3225eabf8876",
    "slug": "rome-390-boss-fw-binding-2027",
    "title": "Rome 390 Boss FW 2027",
    "model": "390 Boss FW",
    "year": 2027,
    "oneLiner": "Rome 2026–27 FullWrap 平台绑带款，官方强调落地支撑与稳定连接。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0370/4055/4115/files/2627-rome-390-boss-fw-c3-artifact-binding-1-1782373333346.jpg?v=1787636962&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rome",
      "name": "Rome Snowboards",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "mountingSystem": "Rome 标准圆盘；具体孔位兼容以随附圆盘说明为准",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "7"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-c598-74ec-899b-7f3b763005f6",
    "slug": "rome-brass-aw-binding-2027",
    "title": "Rome Brass AW 女款 2027",
    "model": "Brass AW",
    "year": 2027,
    "oneLiner": "Rome 2026–27 女款 AsymWrap 传统绑带固定器，官方描述为偏灵活、易上手的脚感。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0370/4055/4115/files/2627_ROME_WEB_BN_BRASS-AW_C2-TEAM_1.jpg?v=1787636962&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rome",
      "name": "Rome Snowboards",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 6,
      "mountingSystem": "Rome 标准圆盘；具体孔位兼容以随附圆盘说明为准",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "6"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-c954-7180-a68f-19261e8c9565",
    "slug": "rome-katana-aw-binding-2027",
    "title": "Rome Katana AW 2027",
    "model": "Katana AW",
    "year": 2027,
    "oneLiner": "Rome 2026–27 传统绑带全山地固定器，官方主打调节范围与舒适性。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0370/4055/4115/files/2627-rome-katana-aw-c2-sage-binding-1-1782373162882.jpg?v=1787636963&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rome",
      "name": "Rome Snowboards",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 8,
      "mountingSystem": "Rome 标准圆盘；具体孔位兼容以随附圆盘说明为准",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "8"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-cca4-72a8-abbc-1ba75250c380",
    "slug": "rome-katana-aw-fase-binding-2027",
    "title": "Rome Katana AW FASE 2027",
    "model": "Katana AW FASE",
    "year": 2027,
    "oneLiner": "Rome Katana AW 平台的 FASE 快速穿脱版本，官方主打可调节性与全山地适用。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0370/4055/4115/files/2627_ROME_WEB_BN_KATANA-AW-FASE_C1-BLACK_1_49371da6-92c0-48d4-a570-a94f41a3051f.jpg?v=1788382126&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rome",
      "name": "Rome Snowboards",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "fast-entry",
      "flex": 8,
      "mountingSystem": "Rome 标准圆盘；具体孔位兼容以随附圆盘说明为准",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "快速穿脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "8"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-cfdc-7ffb-ac52-83ba86693f7c",
    "slug": "rome-katana-aw-pro-fase-binding-2027",
    "title": "Rome Katana AW Pro FASE 2027",
    "model": "Katana AW Pro FASE",
    "year": 2027,
    "oneLiner": "Rome 2026–27 碳纤维取向全山地固定器，结合 AsymWrap 平台与 FASE 快速穿脱系统。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0370/4055/4115/files/2627_ROME_WEB_BN_KATANA-PRO-AW-FASE_C1-STALE_1_78442129-1b64-47c3-82dc-610e0a874fb6.jpg?v=1787609403&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rome",
      "name": "Rome Snowboards",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "fast-entry",
      "flex": 9,
      "mountingSystem": "Rome 标准圆盘；具体孔位兼容以随附圆盘说明为准",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "快速穿脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "9"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-d2e8-7f48-830f-325d83098a2c",
    "slug": "rome-katana-fw-pro-binding-2027",
    "title": "Rome Katana FW Pro 2027",
    "model": "Katana FW Pro",
    "year": 2027,
    "oneLiner": "Rome 2026–27 FullWrap 碳纤维传统绑带款，面向高响应全山地滑行。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0370/4055/4115/files/2627_ROME_WEB_BN_KATANA-PRO-FW_C1-BLACK_1_ffa43267-dae6-4049-a34f-5909b145fe75.jpg?v=1787636962&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rome",
      "name": "Rome Snowboards",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 9,
      "mountingSystem": "Rome 标准圆盘；具体孔位兼容以随附圆盘说明为准",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "9"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-d619-79c1-a800-9c0d8cb1bf68",
    "slug": "rome-volt-fase-binding-2027",
    "title": "Rome Volt FASE 2027",
    "model": "Volt FASE",
    "year": 2027,
    "oneLiner": "Rome 2026–27 快穿固定器新品，采用 MonoFrame 底盘与 FASE 系统。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0370/4055/4115/files/2627_ROME_WEB_BN_MENS-VOLT-FASE_C1-BLACK_1_38fd3f25-1d31-4eb0-8c80-709d1b93c9d2.jpg?v=1787607576&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "rome",
      "name": "Rome Snowboards",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "fast-entry",
      "flex": 5,
      "mountingSystem": "Rome 标准圆盘；具体孔位兼容以随附圆盘说明为准",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "快速穿脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "5"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-d922-7681-b821-bb70ae698b42",
    "slug": "salomon-district-binding-2026",
    "title": "Salomon DISTRICT 2026",
    "model": "DISTRICT",
    "year": 2026,
    "oneLiner": "采用 Shadow Fit 结构的全山地/自由式固定器，官网标注中等硬度。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/fb6d3e52-e631-4fe0-9ca7-b36001082c68/L49290100/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bootCompatibility": "官网标注 Universal disc，适配市场常见雪板安装系统；普通绑带雪鞋",
      "bindingSizeGuide": "Salomon 官方通用尺码表：S US男3.5–7 / 女4–8 / EU34.5–39；S/M 男7.5–8 / 女8.5–9 / EU40–40.5；M 男8.5–9.5 / 女9.5–10.5 / EU41.5–42.5；M/L 男10–10.5 / 女11–11.5 / EU43–43.5；L 男11–13.5 / 女12–14.5 / EU44–47。尺码区间重叠，具体型号尺码以商品页为准。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-dc31-7ffc-9890-ec8f20c65c7a",
    "slug": "salomon-district-pro-binding-2026",
    "title": "Salomon DISTRICT PRO 2026",
    "model": "DISTRICT PRO",
    "year": 2026,
    "oneLiner": "Salomon 当前全山地固定器系列中的进阶型号，国内零售目录可见该产品。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/2dd43218-0575-4f37-92d2-b360010835d6/L49289600/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "stiff",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bindingSizeGuide": "Salomon 官方通用尺码表：S US男3.5–7 / 女4–8 / EU34.5–39；S/M 男7.5–8 / 女8.5–9 / EU40–40.5；M 男8.5–9.5 / 女9.5–10.5 / EU41.5–42.5；M/L 男10–10.5 / 女11–11.5 / EU43–43.5；L 男11–13.5 / 女12–14.5 / EU44–47。尺码区间重叠，具体型号尺码以商品页为准。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-df66-7111-ac33-2c25b3751cf8",
    "slug": "salomon-edb-binding-2026",
    "title": "Salomon EDB 2026",
    "model": "EDB",
    "year": 2026,
    "oneLiner": "Salomon 全山地固定器，官网当前目录同时提供该款与 EDB PRIME。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/4e88d690-8431-4ab7-b0f7-b36001082530/L45439300/PNG-2000px-max-72dpi.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bindingSizeGuide": "Salomon 官方通用尺码表：S US男3.5–7 / 女4–8 / EU34.5–39；S/M 男7.5–8 / 女8.5–9 / EU40–40.5；M 男8.5–9.5 / 女9.5–10.5 / EU41.5–42.5；M/L 男10–10.5 / 女11–11.5 / EU43–43.5；L 男11–13.5 / 女12–14.5 / EU44–47。尺码区间重叠，具体型号尺码以商品页为准。",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-e27b-71be-b57a-ffc39b5fbe98",
    "slug": "salomon-edb-prime-binding-2026",
    "title": "Salomon EDB PRIME 2026",
    "model": "EDB PRIME",
    "year": 2026,
    "oneLiner": "Salomon 全山地固定器，国内京东页面可见该型号评价，规格以官方型号页为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/06801898-0c9a-4476-b079-b31b00b424be/L47939700/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "stiff",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bindingSizeGuide": "Salomon 官方通用尺码表：S US男3.5–7 / 女4–8 / EU34.5–39；S/M 男7.5–8 / 女8.5–9 / EU40–40.5；M 男8.5–9.5 / 女9.5–10.5 / EU41.5–42.5；M/L 男10–10.5 / 女11–11.5 / EU43–43.5；L 男11–13.5 / 女12–14.5 / EU44–47。尺码区间重叠，具体型号尺码以商品页为准。",
      "terrain": [
        "all-mountain"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a0e5dc-e5a1-7235-bd4a-b4fc1f4ff1dc",
    "slug": "salomon-highlander-binding-2026",
    "title": "Salomon HIGHLANDER 2026",
    "model": "HIGHLANDER",
    "year": 2026,
    "oneLiner": "Salomon 男款全山地固定器，官网列为当前产品型号。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/68e6042c-dc3a-4478-a479-b360010827af/L49289500/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "stiff",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bindingSizeGuide": "Salomon 官方通用尺码表：S US男3.5–7 / 女4–8 / EU34.5–39；S/M 男7.5–8 / 女8.5–9 / EU40–40.5；M 男8.5–9.5 / 女9.5–10.5 / EU41.5–42.5；M/L 男10–10.5 / 女11–11.5 / EU43–43.5；L 男11–13.5 / 女12–14.5 / EU44–47。尺码区间重叠，具体型号尺码以商品页为准。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0e5dc-e8ba-7bc1-8703-eadd0bda840e",
    "slug": "salomon-hologram-binding-2026",
    "title": "Salomon HOLOGRAM 2026",
    "model": "HOLOGRAM",
    "year": 2026,
    "oneLiner": "Salomon 全山地固定器，纳入品牌当前官方固定器目录。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/9daa7dca-1d3d-4022-b448-b360010834ff/L49289300/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bindingSizeGuide": "Salomon 官方通用尺码表：S US男3.5–7 / 女4–8 / EU34.5–39；S/M 男7.5–8 / 女8.5–9 / EU40–40.5；M 男8.5–9.5 / 女9.5–10.5 / EU41.5–42.5；M/L 男10–10.5 / 女11–11.5 / EU43–43.5；L 男11–13.5 / 女12–14.5 / EU44–47。尺码区间重叠，具体型号尺码以商品页为准。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-ebcb-778d-885c-6ae2da03f95a",
    "slug": "salomon-pact-binding-2026",
    "title": "Salomon PACT 2026",
    "model": "PACT",
    "year": 2026,
    "oneLiner": "Salomon 男款全山地绑带固定器，官网将其列入当前单板固定器产品线。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/8e5e6b58-7bb3-4636-9c58-b2f4013ba909/L47671400/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "soft",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bindingSizeGuide": "Salomon 官方通用尺码表：S US男3.5–7 / 女4–8 / EU34.5–39；S/M 男7.5–8 / 女8.5–9 / EU40–40.5；M 男8.5–9.5 / 女9.5–10.5 / EU41.5–42.5；M/L 男10–10.5 / 女11–11.5 / EU43–43.5；L 男11–13.5 / 女12–14.5 / EU44–47。尺码区间重叠，具体型号尺码以商品页为准。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "柔软"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0e5dc-eee2-75b7-a627-b05a381ff0dd",
    "slug": "salomon-rhythm-binding-2026",
    "title": "Salomon RHYTHM 2026",
    "model": "RHYTHM",
    "year": 2026,
    "oneLiner": "Salomon 入门进阶向全山地绑带固定器，官网列出柔和脚感与通用安装圆盘。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/f0c57cc4-3429-4574-a398-b36001082f58/L45450200/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "soft",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bootCompatibility": "官网标注 Universal disc，适配市场常见雪板安装系统；普通绑带雪鞋",
      "bindingSizeGuide": "Salomon 官方通用尺码表：S US男3.5–7 / 女4–8 / EU34.5–39；S/M 男7.5–8 / 女8.5–9 / EU40–40.5；M 男8.5–9.5 / 女9.5–10.5 / EU41.5–42.5；M/L 男10–10.5 / 女11–11.5 / EU43–43.5；L 男11–13.5 / 女12–14.5 / EU44–47。尺码区间重叠，具体型号尺码以商品页为准。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "柔软"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-ce6b-79a5-90d3-ceba1bf92897",
    "slug": "union-atlas-2027",
    "title": "Union Binding Company Atlas 2027",
    "model": "Atlas",
    "year": 2027,
    "oneLiner": "面向中高级滑手的中硬度全山地款，官方列出 8/10 硬度。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0095/2254/4745/files/UN26_ATLAS_BLACK_2000x.jpg?v=1785333183",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 8,
      "mountingSystem": "Camber Disk + Washer；4x4、4x2 与 Channel",
      "bootCompatibility": "适配常见 4x4、4x2 与 Channel 安装；普通绑带雪鞋",
      "bindingSizeGuide": "Union 男款/Unisex 尺码参考：S 对应雪鞋 US 男码 6–8 / Mondo 240–260；M 对应 8.5–10.5 / 265–285；L 对应 11–13 / 290–310；XL 对应 14–15 / 320–330。最终按具体雪鞋外长与官方尺码表确认。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "8"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-ce7a-7505-a741-42c3d15cf78a",
    "slug": "union-atlas-pro-2027",
    "title": "Union Binding Company Atlas Pro 2027",
    "model": "Atlas Pro",
    "year": 2027,
    "oneLiner": "采用锻造碳纤维等高响应结构，定位高阶全山地与强支撑滑行。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0095/2254/4745/files/UN26_ATLAS_PRO_BLACK_2000x.jpg?v=1785333161",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 9,
      "mountingSystem": "Camber Disk + Washer；4x4、4x2 与 Channel",
      "bootCompatibility": "官方列出 4x4、4x2 与 Channel 安装；普通绑带雪鞋",
      "bindingSizeGuide": "Union 男款/Unisex 尺码参考：S 对应雪鞋 US 男码 6–8 / Mondo 240–260；M 对应 8.5–10.5 / 265–285；L 对应 11–13 / 290–310；XL 对应 14–15 / 320–330。最终按具体雪鞋外长与官方尺码表确认。",
      "terrain": [
        "all-mountain",
        "freeride"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "9"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a0d171-ce83-765f-8c76-9ec51b0524fd",
    "slug": "union-force-2027",
    "title": "Union Binding Company Force 2027",
    "model": "Force",
    "year": 2027,
    "oneLiner": "Union 全山地工作马型固定器，官方列出 7/10 硬度与全地形定位。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0095/2254/4745/files/UN26_FORCE_BLACK_2000x.jpg?v=1785333204",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "mountingSystem": "Camber Disk；4x4、4x2 与 Channel",
      "bootCompatibility": "Union 标准安装圆盘；适配普通绑带雪鞋",
      "bindingSizeGuide": "Union 男款尺码参考：S 对应雪鞋 US 男码 6–8 / Mondo 240–260；M 对应 8.5–10.5 / 265–285；L 对应 11–13 / 290–310；XL 对应 14–15 / 320–330。最终按具体雪鞋外长与官方尺码表确认。",
      "terrain": [
        "all-mountain",
        "freeride",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "7"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-ce8d-76d5-bcbf-e4e6af517ae8",
    "slug": "union-force-classic-2027",
    "title": "Union Binding Company Force Classic 2027",
    "model": "Force Classic",
    "year": 2027,
    "oneLiner": "Force 经典款全地形绑带固定器，官方页面列出 6/10 硬度。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0095/2254/4745/files/UN26_FORCE_CLASSIC_BLACK_2000x.jpg?v=1785333201",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 6,
      "mountingSystem": "Camber Disk；4x4、4x2 与 Channel",
      "bootCompatibility": "Union 标准安装圆盘；适配普通绑带雪鞋",
      "bindingSizeGuide": "Union 男款尺码参考：S 对应雪鞋 US 男码 6–8 / Mondo 240–260；M 对应 8.5–10.5 / 265–285；L 对应 11–13 / 290–310；XL 对应 14–15 / 320–330。最终按具体雪鞋外长与官方尺码表确认。",
      "terrain": [
        "all-mountain",
        "freeride",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "6"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 野雪 / freeride · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-ce96-75b3-b41b-f3751624d68b",
    "slug": "union-legacy-2027",
    "title": "Union Binding Company Legacy 2027",
    "model": "Legacy",
    "year": 2027,
    "oneLiner": "偏柔软脚感的女款公园与自由式固定器，官方强调减震与板面自然弯曲。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0095/2254/4745/files/UN26_LEGACY_BLACK_2000x.jpg?v=1785333238",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 5,
      "mountingSystem": "Union Mini Disk；兼容常见 4 孔系统",
      "bootCompatibility": "Union Mini Disk；适配普通绑带雪鞋",
      "bindingSizeGuide": "Union 女款尺码参考：S 对应雪鞋 US 女码 5–6 / Mondo 220–230；M 对应 6.5–8.5 / 235–255；L 对应 9–11 / 260–280。最终按具体雪鞋外长与官方尺码表确认。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "5"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-cea0-7a4b-ac61-0c8030b4bd43",
    "slug": "union-trilogy-2027",
    "title": "Union Binding Company Trilogy 2027",
    "model": "Trilogy",
    "year": 2027,
    "oneLiner": "Union 女款全山地固定器，官方定位覆盖雪道、粉雪与公园场景。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0656/0251/9280/files/UN26_TRILOGY_BLACK_2000x.jpg?v=1782986724",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "mountingSystem": "Camber Disk；4x4、4x2 与 Channel",
      "bootCompatibility": "Union 标准安装圆盘；适配普通绑带雪鞋",
      "bindingSizeGuide": "Union 女款尺码参考：S 对应雪鞋 US 女码 5–6 / Mondo 220–230；M 对应 6.5–8.5 / 235–255；L 对应 9–11 / 260–280。最终按具体雪鞋外长与官方尺码表确认。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "7"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d171-cea9-7a46-9fa5-d612638ee6b3",
    "slug": "union-ultra-2027",
    "title": "Union Binding Company Ultra 2027",
    "model": "Ultra",
    "year": 2027,
    "oneLiner": "以缓震和板感为重点的女款自由式固定器，官方介绍其悬挂式缓震结构。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0095/2254/4745/files/UN26_ULTRA_WOMEN_BLUE_2000x.jpg?v=1785333221",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 6,
      "mountingSystem": "Union Mini Disk；兼容常见 4 孔系统",
      "bootCompatibility": "Union 标准安装圆盘；适配普通绑带雪鞋",
      "bindingSizeGuide": "Union 女款尺码参考：S 对应雪鞋 US 女码 5–6 / Mondo 220–230；M 对应 6.5–8.5 / 235–255；L 对应 9–11 / 260–280。最终按具体雪鞋外长与官方尺码表确认。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ]
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "6"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a0d1bf-83d0-740a-a5b3-61d31d44d020",
    "slug": "burton-ion-boa-2027",
    "title": "Burton Ion BOA 2027",
    "model": "Ion BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；双区高功率 BOA。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/1857913AH2_1.webp?v=1778423456&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区高功率 BOA"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区高功率 BOA"
      }
    ]
  },
  {
    "id": "01a0d1bf-840a-7e13-80b4-7f16a5a87b2c",
    "slug": "burton-ion-step-on-2027",
    "title": "Burton Ion Step On 2027",
    "model": "Ion Step On",
    "year": 2027,
    "oneLiner": "官方档案型号；Speed Zone 系带与可调 BOA 压紧带，Step On 系统需配专用固定器。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/2031910A02_1.webp?v=1779495951&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Speed Zone + BOA 压紧带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Speed Zone + BOA 压紧带"
      }
    ]
  },
  {
    "id": "01a0d1bf-841a-7249-b23d-b56b5e5dec09",
    "slug": "burton-moto-boa-2027",
    "title": "Burton Moto BOA 2027",
    "model": "Moto BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；单 BOA 旋钮。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/1317614E7M_1.webp?v=1783620135&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "单 BOA 旋钮"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "单 BOA 旋钮"
      }
    ]
  },
  {
    "id": "01a0d1bf-8427-7e42-a2db-502d0d990f85",
    "slug": "burton-photon-boa-2027",
    "title": "Burton Photon BOA 2027",
    "model": "Photon BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；双区 BOA。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0804/4062/3361/files/1508613AUA_1.webp?v=1783620155&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 BOA"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 BOA"
      }
    ]
  },
  {
    "id": "01a0d1bf-8432-7edc-90d4-ada1b7303a79",
    "slug": "k2-boundary-2027",
    "title": "K2 Boundary 2027",
    "model": "Boundary",
    "year": 2027,
    "oneLiner": "官方档案型号；BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.media.amplience.net/i/k2/k2_2627_boundary_brown_KB261666_1?w=1200&qlt=90&fmt=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-843b-71b5-b1c9-cdc9c47112d1",
    "slug": "k2-maysis-2027",
    "title": "K2 Maysis 2027",
    "model": "Maysis",
    "year": 2027,
    "oneLiner": "官方档案型号；单 BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.media.amplience.net/i/k2/k2_2627_maysis_black_KB261665_1?w=1200&qlt=90&fmt=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "单 BOA 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "单 BOA 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-8446-7a09-b10d-2d1b4073abf1",
    "slug": "k2-raider-2027",
    "title": "K2 Raider 2027",
    "model": "Raider",
    "year": 2027,
    "oneLiner": "官方档案型号；单 BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.media.amplience.net/i/k2/k2_2627_raider_sand_KB261667_1?w=1200&qlt=90&fmt=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "单 BOA 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "单 BOA 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-844e-7001-ad1a-44b051c41378",
    "slug": "k2-taro-tamai-snowsurfer-rs-2027",
    "title": "K2 Taro Tamai Snowsurfer RS 2027",
    "model": "Taro Tamai Snowsurfer RS",
    "year": 2027,
    "oneLiner": "官方档案型号；系带方式及兼容参数留待补充。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.media.amplience.net/s/k2/k2_2627_taro-tamai-rs_KB261654?w=1200&qlt=90&fmt=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "系带方式及兼容参数留待补充"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "系带方式及兼容参数留待补充"
      }
    ]
  },
  {
    "id": "01a0d1bf-8459-72f5-9d70-391b68964eba",
    "slug": "nitro-bianca-tls-plus-2027",
    "title": "Nitro Bianca TLS+ 2027",
    "model": "Bianca TLS+",
    "year": 2027,
    "oneLiner": "官方档案型号；女款；TLS+ 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/13BT21018-102_Bianca-TLSPlus-Womens-Boots_Light-Grey_Product-1.jpg?v=1779339472&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "女款"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "女款"
      }
    ]
  },
  {
    "id": "01a0d1bf-8464-7f98-85cf-2b3c2d10bbd0",
    "slug": "nitro-sentinel-boa-2027",
    "title": "Nitro Sentinel BOA 2027",
    "model": "Sentinel BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/13BT11014-103_Sentinel-BOA-Boots_Brown_Product-1.jpg?v=1779339447&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-8470-78b0-a186-afe1ff95c313",
    "slug": "nitro-sentinel-tls-2027",
    "title": "Nitro Sentinel TLS 2027",
    "model": "Sentinel TLS",
    "year": 2027,
    "oneLiner": "官方档案型号；TLS 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/13BT11015-102_Sentinel-TLS-Boots_Sand_Product-1.jpg?v=1779339466&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-8479-764b-aeb8-eca97bb259a8",
    "slug": "nitro-tangent-tls-2027",
    "title": "Nitro Tangent TLS 2027",
    "model": "Tangent TLS",
    "year": 2027,
    "oneLiner": "官方档案型号；TLS 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/13BT11017-101_Tangent-TLS-Boots_Black_Product-1.jpg?v=1779339456&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-8486-7469-97e1-58ef39e8eac8",
    "slug": "nitro-team-boa-2027",
    "title": "Nitro Team BOA 2027",
    "model": "Team BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/13BT11006-103_Team-BOA-Boots_Grey_Product-1.jpg?v=1779339445&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-8494-7b08-86a5-a208f749a552",
    "slug": "nitro-team-pro-mk-tls-2027",
    "title": "Nitro Team Pro MK TLS 2027",
    "model": "Team Pro MK TLS",
    "year": 2027,
    "oneLiner": "官方档案型号；TLS 系带；MK 系列。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/13BT11004-101_Team-Pro-MK-TLS-Boots_Black_Product-1.jpg?v=1779339426&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-849e-7852-841c-8e0df0f15123",
    "slug": "nitro-team-tls-2027",
    "title": "Nitro Team TLS 2027",
    "model": "Team TLS",
    "year": 2027,
    "oneLiner": "官方档案型号；TLS 双区快速系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/13BT11008-102_Team-TLS-Boots_White-Black_Product-1.jpg?v=1779339453&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 双区快速系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 双区快速系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-84a9-7a2e-97e1-191999fdf096",
    "slug": "nitro-team-tls-wide-2027",
    "title": "Nitro Team TLS Wide 2027",
    "model": "Team TLS Wide",
    "year": 2027,
    "oneLiner": "官方档案型号；宽楦；TLS 双区快速系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/13BT11007-101_Team-TLS-Wide-Boots_Black_Product-1.jpg?v=1779339428&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "宽楦"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "宽楦"
      }
    ]
  },
  {
    "id": "01a0d1bf-84b1-7f06-856f-483cf92317eb",
    "slug": "nitro-venture-boa-2027",
    "title": "Nitro Venture BOA 2027",
    "model": "Venture BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/848717-001_Venture-BOA_Black_Product-1-907x1200-3f31ab6d-6a6e-427e-9605-79fef5a5df1f.jpg?v=1788164587&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-84ba-7d7a-bdcf-0fd2c64926b5",
    "slug": "nitro-venture-pro-tls-2027",
    "title": "Nitro Venture Pro TLS 2027",
    "model": "Venture Pro TLS",
    "year": 2027,
    "oneLiner": "官方档案型号；TLS 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/848713-004_Venture-Pro-TLS-Boots_X-Bryan-Fox-26-27_Product-1-1050x1200-b16c651f-af5e-45db-8f48-8ec7b15da6d1.jpg?v=1788162591&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-84c5-7e91-8145-56a5c5f8b26e",
    "slug": "nitro-venture-step-on-tls-2027",
    "title": "Nitro Venture Step On TLS 2027",
    "model": "Venture Step On TLS",
    "year": 2027,
    "oneLiner": "官方档案型号；TLS 系带，Step On 系统需配专用固定器。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/848716-001_Venture-TLS-Step-On_Black_Product-1-881x1200-28135e1d-80c9-4401-942d-ae41d4772763.jpg?v=1788164992&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-84cd-7b85-82ae-54845014f9df",
    "slug": "nitro-venture-tls-2027",
    "title": "Nitro Venture TLS 2027",
    "model": "Venture TLS",
    "year": 2027,
    "oneLiner": "官方档案型号；TLS 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0580/2773/7217/files/848718-001_Venture-TLS_Black_Product-1-907x1200-b42c32a4-4a29-4623-92ea-4e34fea2dd63.jpg?v=1788164782&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-84da-7e47-80e0-b68be676dfa0",
    "slug": "salomon-dialogue-dual-boa-2027",
    "title": "Salomon Dialogue Dual BOA 2027",
    "model": "Dialogue Dual BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；双区 BOA；官方标注中等硬度。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/ffcd71ac-1349-455b-8d18-b40c01097548/L49259900/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 BOA"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 BOA"
      }
    ]
  },
  {
    "id": "01a0d1bf-84e2-75ae-8821-4b27579ec9b9",
    "slug": "salomon-dialogue-dual-boa-team-2027",
    "title": "Salomon Dialogue Dual BOA Team 2027",
    "model": "Dialogue Dual BOA Team",
    "year": 2027,
    "oneLiner": "官方档案型号；双区 BOA。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/5b8f5563-c91f-4f49-b794-b36700db5564/L49278500/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 BOA"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 BOA"
      }
    ]
  },
  {
    "id": "01a0d1bf-84ec-78d7-997a-49abe216a858",
    "slug": "salomon-dialogue-dual-boa-wide-2027",
    "title": "Salomon Dialogue Dual BOA Wide 2027",
    "model": "Dialogue Dual BOA Wide",
    "year": 2027,
    "oneLiner": "官方档案型号；宽楦；双区 BOA。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/f11bca7a-d437-4723-9233-b3e200a0ffbd/L45448100/PNG-2000px-max-72dpi.png?width=2000&fit=cover&optimize=medium&format=png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "宽楦"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "宽楦"
      }
    ]
  },
  {
    "id": "01a0d1bf-84f5-755a-9e9b-fb18482cffdb",
    "slug": "salomon-echo-dual-boa-2027",
    "title": "Salomon Echo Dual BOA 2027",
    "model": "Echo Dual BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；双区 BOA。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/a49973b1-d25c-4d92-8003-b3600109189a/L49298000/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 BOA"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 BOA"
      }
    ]
  },
  {
    "id": "01a0d1bf-84ff-7a5e-8e71-7a744721aa6c",
    "slug": "salomon-faction-boa-2027",
    "title": "Salomon Faction BOA 2027",
    "model": "Faction BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/eda3d183-166b-40cf-9bbc-b36001090e5c/L49140500/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-850a-737b-8ec9-189b0684fe5e",
    "slug": "salomon-launch-boa-sj-boa-2027",
    "title": "Salomon Launch BOA SJ BOA 2027",
    "model": "Launch BOA SJ BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；BOA 配合内部脚跟锁定系统。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/0014fcf7-0671-47c1-8bdd-b40c010d18ef/L49262200/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA 配合内部脚跟锁定系统"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA 配合内部脚跟锁定系统"
      }
    ]
  },
  {
    "id": "01a0d1bf-8517-7d76-8654-5cdbc22c6a8e",
    "slug": "salomon-malamute-dual-boa-2027",
    "title": "Salomon Malamute Dual BOA 2027",
    "model": "Malamute Dual BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；双区 BOA。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/3d71cf3c-5e2c-4237-b2c2-b2f4008d48ad/L47773300/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 BOA"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 BOA"
      }
    ]
  },
  {
    "id": "01a0d1bf-8520-7e28-8af4-dc28f5616167",
    "slug": "salomon-titan-boa-2027",
    "title": "Salomon Titan BOA 2027",
    "model": "Titan BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/2f5a59c3-6fa1-4e55-9a3a-b2f800ae89f1/L47242900/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA 系带"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA 系带"
      }
    ]
  },
  {
    "id": "01a0d1bf-852b-751a-886d-dca65d2bbe24",
    "slug": "salomon-trek-2027",
    "title": "Salomon Trek 2027",
    "model": "Trek",
    "year": 2027,
    "oneLiner": "官方档案型号；徒步/登山取向单板雪鞋。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/39e8cd4e-f1cd-44d9-95bd-b2f800ae88fa/L47033600/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "徒步/登山取向单板雪鞋"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "徒步/登山取向单板雪鞋"
      }
    ]
  },
  {
    "id": "01a0d1bf-8534-788d-a572-5dcd0f82600f",
    "slug": "salomon-x-approach-lace-sj-boa-2027",
    "title": "Salomon X Approach Lace SJ BOA 2027",
    "model": "X Approach Lace SJ BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；鞋带与 BOA 脚跟锁定组合。尺码与脚感以实际试穿为准。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.dam.salomon.com/2d8d238e-a3de-42e8-8636-b3600108ff81/L45418900/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "鞋带与 BOA 脚跟锁定组合"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "鞋带与 BOA 脚跟锁定组合"
      }
    ]
  },
  {
    "id": "01a0c879-0dd2-7d51-bb80-a6285e4252ea",
    "slug": "amazfit-t-rex-3-pro-48mm-2026",
    "title": "T-Rex 3 PRO 五級鈦合金智慧手錶",
    "model": "T-Rex 3 Pro 48mm",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "amazfit",
      "name": "Amazfit",
      "nameCn": "华米 Amazfit"
    },
    "categorySlug": "sports-watch",
    "specs": {
      "watchType": "户外运动智能手表",
      "caseSize": "48mm",
      "displaySize": 1.5,
      "displayType": "AMOLED",
      "peakBrightness": 3000,
      "displayGlass": "蓝宝石镜面玻璃",
      "weight": 75,
      "waterResistance": 10,
      "materials": "表壳-纤维增强聚合物 表圈与按键：5级钛合金",
      "batteryCapacity": 700,
      "batteryLife": 25,
      "gnssBatteryLife": 116,
      "positioning": "双频六星定位系统（GPS、GLONASS、GALILEO、BDS、QZSS、NAVIC）圆极化GNSS天线技术",
      "offlineNavigation": true,
      "sportsModes": "180+",
      "healthSensors": "BioTracker™ 6.0 PPG 生物识别传感器 (5PD+2LED)"
    },
    "highlights": [
      {
        "key": "displaySize",
        "label": "屏幕尺寸",
        "value": "1.5英寸"
      },
      {
        "key": "peakBrightness",
        "label": "峰值亮度",
        "value": "3000nits"
      },
      {
        "key": "weight",
        "label": "重量",
        "value": "75g"
      },
      {
        "key": "waterResistance",
        "label": "防水等级",
        "value": "10ATM"
      }
    ]
  },
  {
    "id": "01a0c87c-0073-7d8e-ac08-7f61ea98506a",
    "slug": "sirui-t-1204sk-2026",
    "title": "思锐T-S系列三脚架 - 广东思锐光学股份有限公司官网",
    "model": "T-1204SK",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "sirui",
      "name": "SIRUI",
      "nameCn": "思锐"
    },
    "categorySlug": "tripod",
    "specs": {
      "material": "碳纤维",
      "compatibleBallHead": "K-10X/G-10X/G11",
      "sections": 4,
      "tubeMaxDiameter": 25.8,
      "tubeMinDiameter": 15,
      "minHeight": 140,
      "maxHeight": 980,
      "maxHeightExtended": 1300,
      "retractedHeight": 480,
      "foldedHeight": 370,
      "monopodMaxHeight": 1340,
      "monopodMinHeight": 330,
      "weight": 1.2,
      "loadCapacity": 12
    },
    "highlights": [
      {
        "key": "sections",
        "label": "脚管节数",
        "value": "4节"
      },
      {
        "key": "tubeMaxDiameter",
        "label": "管径上限",
        "value": "25.8mm"
      },
      {
        "key": "tubeMinDiameter",
        "label": "管径下限",
        "value": "15mm"
      },
      {
        "key": "minHeight",
        "label": "最低高度",
        "value": "140mm"
      }
    ]
  },
  {
    "id": "01a0c879-0de1-7c52-b51d-cee0d9821a30",
    "slug": "dji-osmo-pocket-3-2023",
    "title": "Osmo Pocket 3 - 技术参数 - DJI 大疆创新",
    "model": "Osmo Pocket 3",
    "year": 2023,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "dji",
      "name": "DJI",
      "nameCn": "大疆"
    },
    "categorySlug": "video-camera",
    "specs": {
      "cameraSensor": "1 英寸 CMOS",
      "maxVideo": "4K/120fps",
      "screenSize": 2,
      "stabilization": "三轴机械云台增稳",
      "verticalShooting": true
    },
    "highlights": [
      {
        "key": "screenSize",
        "label": "屏幕尺寸",
        "value": "2英寸"
      }
    ]
  },
  {
    "id": "01a0c87c-008a-721e-91f5-75715e144089",
    "slug": "godox-sl60iibi-2026",
    "title": "SL60IID/SL60IIBi-神牛产品-Godox神牛 - 官方网站",
    "model": "SL60IIBi",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "brand": {
      "slug": "godox",
      "name": "Godox",
      "nameCn": "神牛"
    },
    "categorySlug": "video-light",
    "specs": {
      "lightType": "COB 摄影灯",
      "power": 75,
      "colorTemperature": "2800K~6500K",
      "illuminance": 25100,
      "dimmingRange": "0%~100%",
      "cri": 96,
      "tlci": 97,
      "fxEffects": 11,
      "controlMethods": "2.4GHz控制/蓝牙控制/灯体控制",
      "transmissionDistance": 30,
      "workingTemperature": "-10℃~40℃",
      "dimensions": "140mm*236mm*215mm",
      "weight": 1.5,
      "mount": "保荣卡口",
      "lowNoise": true
    },
    "highlights": [
      {
        "key": "power",
        "label": "最大功率",
        "value": "75W"
      },
      {
        "key": "illuminance",
        "label": "最高照度",
        "value": "25100lux"
      },
      {
        "key": "cri",
        "label": "显色指数下限",
        "value": "96"
      },
      {
        "key": "tlci",
        "label": "电视光源一致性指数下限",
        "value": "97"
      }
    ]
  }
];
