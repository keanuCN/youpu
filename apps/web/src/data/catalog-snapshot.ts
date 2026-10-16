/**
 * 公开目录快照。
 *
 * 由 apps/web/scripts/export-catalog-snapshot.ts 自动生成，请勿手工编辑。
 * 事实字段来自公开 API 或校验后的 seed；seed 导出保留既有社区统计，不伪造评分。
 * 编辑分析、评分分布等内容继续由本地内容包维护。
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
  editorialScores?: Record<string, number> | null;
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
  "source": "http://115.190.156.88/youpu",
  "generatedAt": "2026-10-16T02:42:17.568Z",
  "total": 326,
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
    "ski-protection",
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
    "id": "01a12e89-5509-7f83-b9b6-cc86b0a77d0b",
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
    "editorialScores": {
      "value": 8.6,
      "battery": 7.4,
      "lowLight": 8.2,
      "usability": 8.6,
      "imageQuality": 8.6,
      "stabilization": 9
    },
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
    "id": "01a12e89-551d-7ed8-a768-3dfac04c97f0",
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
    "editorialScores": {
      "value": 8.2,
      "battery": 9.5,
      "lowLight": 8.7,
      "usability": 9,
      "imageQuality": 9.1,
      "stabilization": 9
    },
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
    "id": "01a12e89-552b-77c2-a632-7d95ad72b262",
    "slug": "dji-osmo-action-6-2026",
    "title": "DJI Osmo Action 6",
    "model": "Osmo Action 6",
    "year": 2026,
    "oneLiner": "以 1/1.1 英寸方形传感器、可变光圈和 8K 视频为核心的旗舰运动相机，适合希望兼顾运动记录与低光创作的人。",
    "priceMin": 2998,
    "priceMax": 2998,
    "priceCurrency": "CNY",
    "coverUrl": "https://se-cdn.djiits.com/tpc/uploads/spu/cover/12bba4939cd4f341e741cdf5d2c8d9b0@ultra.png?format=webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 90.9,
    "editorialScores": {
      "value": 7.8,
      "battery": 9.3,
      "lowLight": 9.4,
      "usability": 8.8,
      "imageQuality": 9.6,
      "stabilization": 9.2
    },
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
    "id": "01a12e89-5539-7e67-b59a-dabaddecc959",
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
    "editorialScores": {
      "value": 8.4,
      "battery": 7.3,
      "lowLight": 7,
      "usability": 7.8,
      "imageQuality": 8.4,
      "stabilization": 8.8
    },
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
    "id": "01a12e89-5548-75dd-afb6-f6db9b097fac",
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
    "editorialScores": {
      "value": 8,
      "battery": 8,
      "lowLight": 7.2,
      "usability": 8.2,
      "imageQuality": 8.9,
      "stabilization": 9.3
    },
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
    "id": "01a12e89-5554-7820-9fb1-654461b3989d",
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
    "editorialScores": {
      "value": 7.8,
      "battery": 8.2,
      "lowLight": 7.5,
      "usability": 8.4,
      "imageQuality": 9,
      "stabilization": 9.5
    },
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
    "id": "01a12e89-5570-7633-940c-f21305ac218c",
    "slug": "insta360-ace-pro-2023",
    "title": "Insta360 Ace Pro",
    "model": "Ace Pro",
    "year": 2023,
    "oneLiner": "以 1/1.3 英寸大底、翻转触控屏和 8K 记录为核心，适合旅行 Vlog 与运动混合创作。",
    "priceMin": 1698,
    "priceMax": 1698,
    "priceCurrency": "CNY",
    "coverUrl": "https://res.insta360.com/static/a7e1e6632afa8dc15821776d712a352f/acepro&ace.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 84.4,
    "editorialScores": {
      "value": 8,
      "battery": 7,
      "lowLight": 9,
      "usability": 8,
      "imageQuality": 9.2,
      "stabilization": 8.8
    },
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
    "id": "01a12e89-5561-76ba-b91b-b18d93e3c0da",
    "slug": "insta360-ace-pro-2-2024",
    "title": "Insta360 Ace Pro 2",
    "model": "Ace Pro 2",
    "year": 2024,
    "oneLiner": "以 1/1.3 英寸 8K 传感器、翻转触控屏和低光模式为核心，适合运动与 Vlog 混合拍摄。",
    "priceMin": 2398,
    "priceMax": 2398,
    "priceCurrency": "CNY",
    "coverUrl": "https://wassets.insta360.com/common/4d7317543e0f4fee9b0b037a4d24d961/pc-acepro2-CN.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 88.3,
    "editorialScores": {
      "value": 7.8,
      "battery": 8,
      "lowLight": 9.5,
      "usability": 8.4,
      "imageQuality": 9.5,
      "stabilization": 9.1
    },
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
    "id": "01a12e89-557e-7b39-9db2-f76928989da1",
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
    "editorialScores": {
      "value": 8.4,
      "battery": 7.4,
      "lowLight": 5.8,
      "usability": 9.1,
      "imageQuality": 6.8,
      "stabilization": 7.5
    },
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
    "id": "01a12e89-558d-7c0b-b1c4-1c7640916177",
    "slug": "insta360-go-3s-2024",
    "title": "Insta360 GO 3S",
    "model": "GO 3S",
    "year": 2024,
    "oneLiner": "轻量化的 4K 拇指相机，优先解决佩戴、磁吸和第一视角记录问题。",
    "priceMin": 1898,
    "priceMax": 1988,
    "priceCurrency": "CNY",
    "coverUrl": "https://res.insta360.com/static/a3b716298df7f6da544fcdaf70ffe21f/GO3S.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.6,
    "editorialScores": {
      "value": 7.8,
      "battery": 7.1,
      "lowLight": 6.2,
      "usability": 9.2,
      "imageQuality": 7.5,
      "stabilization": 8
    },
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
    "id": "01a12e89-559b-70f5-a3e2-c4479dafd852",
    "slug": "insta360-x5-2026",
    "title": "影石Insta360 X5 — 8K 旗舰款全景运动相机",
    "model": "X5",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 2898,
    "priceMax": 2898,
    "priceCurrency": "CNY",
    "coverUrl": "https://res.insta360.com/static/948825431b2183b22a6c4bafd914f253/x5-single.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-55aa-75b1-be32-8d995c7f94a4",
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
    "editorialScores": {
      "power": 7.8,
      "speed": 9.2,
      "value": 7,
      "control": 8,
      "defense": 8.8,
      "forgiveness": 6.7
    },
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
    "id": "01a12e89-55b6-7c40-afe5-3b5c2450f669",
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
    "editorialScores": {
      "power": 9.4,
      "speed": 7.1,
      "value": 7,
      "control": 8,
      "defense": 7,
      "forgiveness": 5.4
    },
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
    "id": "01a12e89-55c5-7398-9d93-30f966f3e277",
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
    "editorialScores": {
      "power": 7.7,
      "speed": 7.5,
      "value": 7.4,
      "control": 9.4,
      "defense": 8.7,
      "forgiveness": 7
    },
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
    "id": "01a12e89-55d2-76c4-94c3-0d326c692c61",
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
    "editorialScores": {
      "power": 9.4,
      "speed": 7.2,
      "value": 7.2,
      "control": 8,
      "defense": 7.2,
      "forgiveness": 5.4
    },
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
    "id": "01a12e89-55df-76fe-8438-b09740821289",
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
    "editorialScores": {
      "power": 8.5,
      "speed": 9.4,
      "value": 7,
      "control": 7.8,
      "defense": 9,
      "forgiveness": 5.8
    },
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
    "id": "01a12e89-55eb-77ae-8b6d-874bac4e7b4c",
    "slug": "igpsport-bsc500-2025",
    "title": "BSC500 - 全彩大屏进阶码表，大有声色 - iGPSPORT迹驰",
    "model": "BSC500",
    "year": 2025,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://hwcdn.igpsport.cn/picture/2026/3/e17df6969312a74891b19c2fe010a2df.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-55f5-7533-a623-f0d1da2a2ac3",
    "slug": "igpsport-igs800-2024",
    "title": "iGS800 - 彩屏触控GPS骑行码表 - iGPSPORT迹驰",
    "model": "iGS800",
    "year": 2024,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://hwcdn.igpsport.cn/picture/2024/10/cfaff525d66c72194eeb9885e027f2dc.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-55ff-7a09-8757-027d1905c515",
    "slug": "insta360-x4-2024",
    "title": "影石Insta360 X4-8K 全景运动相机",
    "model": "X4",
    "year": 2024,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://res.insta360.com/static/9b3f6248055c4b255cdd5bdc5e9b8b64/x4-new.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-560c-72fa-9ba6-15ecc555a1e4",
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
    "editorialScores": {
      "value": 7.2,
      "casting": 8.5,
      "control": 8.6,
      "strength": 5.8,
      "sensitivity": 8.7,
      "versatility": 7.2
    },
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
    "id": "01a12e89-5619-70c7-9166-0617f658fc34",
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
    "editorialScores": {
      "value": 7.6,
      "casting": 8.4,
      "control": 8.2,
      "strength": 7.5,
      "sensitivity": 8,
      "versatility": 8.8
    },
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
    "id": "01a12e89-5626-7004-aa46-2fa9679f9748",
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
    "editorialScores": {
      "value": 7.4,
      "casting": 8.1,
      "control": 8.5,
      "strength": 9,
      "sensitivity": 7.8,
      "versatility": 8
    },
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
    "id": "01a12e89-5633-731a-9d18-fe58ec9c8b98",
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
    "editorialScores": {
      "value": 7.3,
      "casting": 8.8,
      "control": 8.4,
      "strength": 6.5,
      "sensitivity": 8.6,
      "versatility": 8
    },
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
    "id": "01a12e89-563e-7e5f-a4b5-7ec65032bac4",
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
    "editorialScores": {
      "value": 8,
      "casting": 8.3,
      "control": 8,
      "strength": 5.8,
      "sensitivity": 8.4,
      "versatility": 7.2
    },
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
    "id": "01a12e89-564a-7952-9913-a430fd9aab3b",
    "slug": "dji-avata-2-2024",
    "title": "DJI Avata 2 - 第一视角飞行体验无人机 - 技术参数 - DJI 大疆创新",
    "model": "Avata 2",
    "year": 2024,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www-cdn.djiits.com/dps/1f935fa76926168b331d6b19ccf706ae.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5655-7b9d-b010-90abd01585c2",
    "slug": "dji-mini-4-pro-2023",
    "title": "DJI Mini 4 Pro - 技术参数 - DJI 大疆创新",
    "model": "Mini 4 Pro",
    "year": 2023,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www-cdn.djiits.com/dps/2c41dfd2287630138f23b84aaa543727.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5661-7acc-9da4-3eac592dcb18",
    "slug": "akko-5075b-plus-asa-clear-2026",
    "title": "5075B Plus ASA Clear | Akko Official Global Site",
    "model": "5075B Plus ASA Clear",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://en.akkogear.com/wp-content/uploads/2024/11/5075B-Plus-ASA-Clear-1.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-566c-79e0-bfd8-fa50bdbd80b3",
    "slug": "akko-5108-v5-the-legend-of-hei-2026",
    "title": "Akko The Legend of Hei 5108 V5 108-Key Tri-Mode Mechanical Keyboard",
    "model": "Akko The Legend of Hei 5108 V5",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://en.akkogear.com/wp-content/uploads/2026/05/The-Legend-of-Hei-5108-V5-1.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5678-7e4d-84f0-18b89531f2e8",
    "slug": "akko-mod007-v5-he-2026",
    "title": "MOD007 V5 HE 三模磁轴键盘 - Akko",
    "model": "MOD007 V5 HE",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 740,
    "priceMax": 740,
    "priceCurrency": "CNY",
    "coverUrl": "https://33357402.s21i.faiusr.com/2/ABUIABACGAAgvLmDzgYo08q5ogQwoAY4oAY.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
        "value": "0.005mm"
      }
    ]
  },
  {
    "id": "01a12e89-568f-7687-85e1-b33b3dca066c",
    "slug": "aula-f108-pro-2026",
    "title": "AULA F108 Pro 108-Key Tri-Mode Mechanical Keyboard",
    "model": "AULA F108 Pro",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0552/2803/9264/files/4_470afb17-1075-4b9a-b085-0f4ce8568ac4.jpg?v=1756891443&width=900",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-569b-77eb-80fc-0c49baf4acfe",
    "slug": "aula-f2088-104-white-punk-2026",
    "title": "AULA F2088 104-Key White Punk Mechanical Gaming Keyboard",
    "model": "AULA F2088 104键朋克版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.aulastar.com/uploads/allimg/20231018/1-23101Q01251155.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-56a6-7816-aef0-c0afb2b52f58",
    "slug": "aula-f75-2026",
    "title": "AULA 75% Gasket Wireless Mechanical Keyboard – Aula Gear",
    "model": "AULA F75",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0552/2803/9264/files/203A5822.jpg?v=1734921227&width=1600",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-56b2-798c-93e0-e98b489b356a",
    "slug": "aula-f75-max-2026",
    "title": "AULA F75 MAX – Aula Gear",
    "model": "AULA F75 Max",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 279,
    "priceMax": 319,
    "priceCurrency": "CNY",
    "coverUrl": "https://aulagear.com/cdn/shop/files/IMG_5706.png?v=1734344767&width=900",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-56be-7654-ac39-e207f1cdc8f7",
    "slug": "aula-f87-pro-v2-2026",
    "title": "AULA F87 PRO V2 – Aula Gear",
    "model": "AULA F87 Pro V2",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0552/2803/9264/files/AULA_F87_PRO_V2_16.1.png?v=1769502456&width=900",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-56cc-74e1-a71e-672a60f2ee08",
    "slug": "aula-f99-pro-2026",
    "title": "96% Gasket-Mounted Triple-Mode Mechanical Keyboard with Knob – Aula Gear",
    "model": "AULA F99 Pro",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 339,
    "priceMax": 359,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0664/2768/3040/files/96_1.jpg?v=1724825820&width=900",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-56d9-708d-a5ea-349b863010d8",
    "slug": "aula-hero-68-he-white-side-printed-2026",
    "title": "狼蛛 HERO 68HE 白色侧刻 磁轴键盘",
    "model": "AULA HERO 68 HE 白色侧刻",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0552/2803/9264/files/AULA_HERO_68_HE_main_001.png?v=1744355575&width=900",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-56e5-73f7-9b7d-488f50041e40",
    "slug": "aula-hero68xs-phantom-black-snow-god-2026",
    "title": "狼蛛 HERO68XS 幻影黑 雪神磁轴三模电竞键盘",
    "model": "AULA HERO68XS 幻影黑 雪神磁轴",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn2.aulacn.com/storage/20260403/Suh1775210422euFXdZ.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
        "value": "0.005mm"
      },
      {
        "key": "batteryCapacity",
        "label": "电池容量",
        "value": "6000mAh"
      }
    ]
  },
  {
    "id": "01a12e89-56f1-73ab-8402-a4a376ed61f5",
    "slug": "aula-s500-wired-2026",
    "title": "AULA S500 Mechanical Keyboard",
    "model": "AULA S500",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.aulastar.com/uploads/allimg/20250725/1-250H51FF6414.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-56fc-7ccc-ba4c-08318de441f9",
    "slug": "aula-s75-pro-2026",
    "title": "AULA S75 PRO Mechanical Keyboard",
    "model": "AULA S75 Pro",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0724/6381/0737/files/1-250H51H524304.jpg?v=1766777542&width=900",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5707-7580-b267-604b4cb4f166",
    "slug": "cherry-mx30s-rgb-2026",
    "title": "MX3.0S RGB-CHERRY樱桃",
    "model": "CHERRY MX3.0S RGB",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn6.zhuocms.com/storage/wwwcherrycn/Game%20keyboard/202404/116617b7c5dccfb.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5712-7ae6-9785-57e73cd5b9b3",
    "slug": "dareu-a98-pro-rt-2026",
    "title": "达尔优 A98 专业版 RT 三模机械键盘",
    "model": "DAREU A98 专业版 RT 版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://media.dareu.com/dareu/images/sha256/bf/bf19fe6434c0eb1921a5fb6a02eba5d8bf85537c1e7b834e668466c83850175b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-571e-7a29-b15c-0ebf02fdd9c4",
    "slug": "dareu-cool68-ocean-blue-2026",
    "title": "达尔优 COOL68 云海蓝 磁轴电竞键盘",
    "model": "DAREU COOL68 云海蓝",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0705/7172/0858/files/cool68-3.png?v=1764657562&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-572a-7fbf-9f1d-a308dacb5229",
    "slug": "mchose-g87-v2-2026",
    "title": "MCHOSE G87 V2 87-Key Tri-Mode Mechanical Keyboard",
    "model": "MCHOSE G87 V2",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 329,
    "priceMax": 329,
    "priceCurrency": "CNY",
    "coverUrl": "https://img.alicdn.com/bao/uploaded/i1/2213920268321/O1CN01FRvqQX2BL4m9LP6Y1_%21%214611686018427379745-0-item_pic.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5733-7130-8748-5bc165ce5e6c",
    "slug": "mchose-k99-v3-2026",
    "title": "MCHOSE K99 V3 Keyboard: Wireless, 98% Layout – Tri-Mode",
    "model": "MCHOSE K99 V3",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0846/5727/5175/files/mchose-official-black-gold-icy-creamsicle-switch-mchose-k99-v3-98-layout-wireless-mechanical-keyboard-1234606053.jpg?v=1778497876&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-573e-776b-8ddc-91a9658bda7a",
    "slug": "melgeek-made68-pro-plus-2026",
    "title": "MelGeek MADE68 Pro+ Hall Effect Gaming Keyboard | Rapid Trigger 65% $139",
    "model": "MADE68 Pro+",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0078/2863/5712/files/P_1600x.png?v=1787743786",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-574a-7f93-bc4a-a6cf5ffccd27",
    "slug": "monsgeek-m2-v5-he-2026",
    "title": "M2 V5 HE Fully Assembled - MonsGeek",
    "model": "M2 V5 HE",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.monsgeek.com/wp-content/uploads/2025/12/M2-V5-HE-Magnetic-Switch-Keyboard-White.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5756-7a11-a956-6f671fb88632",
    "slug": "monsgeek-m2-v5-via-2026",
    "title": "M2 V5 VIA - MonsGeek",
    "model": "M2 V5 VIA",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.monsgeek.com/wp-content/uploads/2025/06/MonsGeek-M2-V5-VIA-Keyboard-X5.png",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-576c-76a9-a4a3-e35d920ebad3",
    "slug": "rapoo-v700diy-98-2026",
    "title": "V700DIY-98长续航版 - 客制化多模式无线背光游戏机械键盘 - 雷柏科技",
    "model": "雷柏 V700DIY-98 长续航版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://rpw.rapoo.cn/goods/gallery/1758851973229.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5779-74a3-86fc-f5b6e0c297ed",
    "slug": "rapoo-v700rgb-alloy-2026",
    "title": "V700RGB合金版 - 幻彩RGB背光游戏机械键盘 - 雷柏科技",
    "model": "雷柏 V700RGB 合金版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://rpw.rapoo.cn/goods/gallery/1603712684711.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5761-7ec1-9260-2f43493dfc49",
    "slug": "rapoo-v500pro-2026",
    "title": "V500PRO - 混彩背光游戏机械键盘 - 雷柏科技",
    "model": "V500PRO",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 199,
    "priceMax": 199,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.rapoo-eu.com/wp-content/uploads/2020/08/1514278395-9465-600x388.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5786-7b74-b5dc-1e463bac5010",
    "slug": "rog-azoth-extreme-edition-20-2026",
    "title": "ROG 夜魔 EXTREME 20周年版 75% 三模客制化机械键盘",
    "model": "ROG 夜魔 EXTREME 20周年版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 3599,
    "priceMax": 3599,
    "priceCurrency": "CNY",
    "coverUrl": "https://dlcdnwebimgs.asus.com.cn/gain/60038A14-350D-4865-B273-603AD4B3196E",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-579d-70b0-b931-403c22a23733",
    "slug": "vgn-neon-68-super-competitive-plus-2026",
    "title": "VGN Neon 68 Extreme Magnetic Switch Keyboard",
    "model": "VGN 霓虹68 超竞版+ 天霸轴 黑武士",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 329,
    "priceMax": 329,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0775/4927/3398/files/33ffae0206d3c7cd1aadac09875e5e96_ae4f51ed-1234-4360-a45b-12905c7f6735_1024x1024.jpg?v=1769500977",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
        "value": "0.001mm"
      }
    ]
  },
  {
    "id": "01a12e89-5792-733b-b1dd-b45baab3cdc5",
    "slug": "vgn-n75-v2-2026",
    "title": "VGN N75 V2 Wireless RGB Mechanical Keyboard",
    "model": "VGN N75 V2 三模版",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://vgnlab.com/cdn/shop/files/20260226104240_186_71_medium.png?v=1772084931",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-57aa-790d-bd7d-dfa38de0c126",
    "slug": "vgn-v87-v2-2026",
    "title": "VGN V87 V2 冰山雪莲侧刻 动力金轴",
    "model": "VGN V87 V2",
    "year": 2026,
    "oneLiner": null,
    "priceMin": 249,
    "priceMax": 249,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0775/4927/3398/files/ce315e972c541e4953f1a898508b59ec_1024x1024.jpg?v=1762153398",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-57b7-747a-9e8a-7e920f60da11",
    "slug": "vgn-v98pro-v4-2026",
    "title": "VGN V98 Pro V4 Wireless Mechanical Keyboard",
    "model": "VGN V98Pro V4",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0775/4927/3398/files/bfaae0976f84910970d105ca2aac2c08_1024x1024.jpg?v=1780296191",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5682-7d77-bfd6-4d4b02314272",
    "slug": "atk-rs6-ultra-white-shadow-warrior-2026",
    "title": "ATK RS6 Ultra 白影战士 冰刃轴 电竞磁轴键盘",
    "model": "ATK RS6 Ultra 白影战士 冰刃轴",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0691/4942/5882/files/ATK_RS6_White.jpg?v=1763534451&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
        "value": "0.001mm"
      }
    ]
  },
  {
    "id": "01a12e89-57c3-7a9b-9bf2-30d99c278964",
    "slug": "vxe-v75-x-2026",
    "title": "Wireless Mechanical Gaming Keyboard | Semi-Aluminum",
    "model": "VXE V75 X",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0691/4942/5882/files/ATK_V75X_Black.jpg?v=1741856682&width=1920",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-57cf-73f0-96e3-dadce96968c8",
    "slug": "wobkey-rainy75-pro-2026",
    "title": "WOBKEY Rainy 75 | Custom Aluminum 75 Keyboard",
    "model": "Rainy 75 Pro",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.wobkey.com/cdn/shop/files/3500_dd7a8372-ed99-4a0a-a932-e4ed6e94d9bb.jpg?v=1703696458&width=900",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-57da-7f39-93a7-751d2c3d08fd",
    "slug": "nisi-true-color-cpl-2022",
    "title": "TRUE COLOR 色彩保真CPL – NiSi 耐司-专业电影及相机光学镜头滤镜品牌 %",
    "model": "TRUE COLOR CPL",
    "year": 2022,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.nisioptics.com/wp-content/uploads/2022/04/truecolor-cpl-7.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-57e3-7e02-9f76-ab435afd104a",
    "slug": "dji-osmo-mobile-7p-2026",
    "title": "Osmo Mobile 7 系列 - 技术参数 - DJI 大疆创新",
    "model": "Osmo Mobile 7P",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www-cdn.djiits.com/dps/a7708af25a1dc35111970080310f53f8.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-57ef-7114-85bc-e0c58cc02007",
    "slug": "timemore-sculptor-078s-2026",
    "title": "【泰摩咖啡】電動磨豆機TEG078S-黑色(雕刻家系列-手沖/義式雙用) – 泰摩TIMEMORE臺灣官方網站",
    "model": "TEG078S",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.timemore.com/cdn/shop/files/078S.jpg?v=1713171847",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-57fa-7349-8d74-425e990110a3",
    "slug": "viltrox-af-56mm-f1-2-pro-xf-2025",
    "title": "Viltrox AF 56mm F1.2 Pro XF Lens for Fujifilm| APS-C Portrait Master – Viltrox Store",
    "model": "AF 56mm F1.2 Pro XF",
    "year": 2025,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0104/0380/7298/files/AF_56mm_F1.2_Pro_XF-Front_view2.png?v=1756881179",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-5803-7f7c-9a52-195f985ab7d0",
    "slug": "lexar-professional-1066x-sd-silver-2026",
    "title": "Lexar Professional 1066x SDXC UHS-I 存储卡SILVER系列 | Lexar雷克沙",
    "model": "Professional 1066x SDXC UHS-I SILVER",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www-oss.lexar.com/uploads/product_images/1066sd_feature_1.jpg?202610141404",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-580e-73d6-a461-c012f1ab9296",
    "slug": "dji-mic-mini-2026",
    "title": "DJI Mic Mini - 技术参数 - DJI 大疆创新",
    "model": "DJI Mic Mini",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www-cdn.djiits.com/dps/0c9daf2d32521c9310b9d53b1bbb4121.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-581c-7ded-a519-07a3229054b9",
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
    "editorialScores": {
      "value": 8.7,
      "comfort": 8.8,
      "control": 8.7,
      "climbing": 8.7,
      "descending": 8.5,
      "versatility": 9.2
    },
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": null
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
    "id": "01a12e89-582a-7e88-809d-a8e6e450575d",
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
    "editorialScores": {
      "value": 8.4,
      "comfort": 8.8,
      "control": 9.1,
      "climbing": 8.2,
      "descending": 9.3,
      "versatility": 9.1
    },
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": null
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
    "id": "01a12e89-5838-7903-a327-f577cb893e52",
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
    "editorialScores": {
      "value": 7.2,
      "comfort": 9.1,
      "control": 9.3,
      "climbing": 8.1,
      "descending": 9.4,
      "versatility": 9.1
    },
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
    "id": "01a12e89-5846-7829-8187-75d8cab77c6d",
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
    "editorialScores": {
      "value": 8.4,
      "comfort": 6.8,
      "control": 8.2,
      "climbing": 9.3,
      "descending": 7.3,
      "versatility": 7.8
    },
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
    "id": "01a12e89-5854-771f-aaa9-f12d07474de8",
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
    "editorialScores": {
      "value": 6.8,
      "comfort": 8.1,
      "control": 9.2,
      "climbing": 9.7,
      "descending": 8.8,
      "versatility": 8.1
    },
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
    "id": "01a12e89-5861-72b7-bb50-0bf43393c523",
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
    "editorialScores": {
      "value": 8.1,
      "comfort": 9.3,
      "control": 9.1,
      "climbing": 8.4,
      "descending": 9.2,
      "versatility": 9.4
    },
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
    "id": "01a12e89-586f-7065-ae9d-77e157d0f853",
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
    "editorialScores": {
      "value": 8.1,
      "comfort": 7.3,
      "climbing": 8.4,
      "handling": 8.5,
      "versatility": 7.6,
      "speedEfficiency": 9.4
    },
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": null
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
    "id": "01a12e89-587f-7f9b-a802-332b02db2ee7",
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
    "editorialScores": {
      "value": 8.8,
      "comfort": 9.1,
      "climbing": 7.9,
      "handling": 8.2,
      "versatility": 9.1,
      "speedEfficiency": 8.1
    },
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": null
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
    "id": "01a12e89-588c-7724-9fbe-249cf14e5377",
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
    "editorialScores": {
      "value": 8.5,
      "comfort": 9.1,
      "climbing": 8,
      "handling": 8.3,
      "versatility": 9.2,
      "speedEfficiency": 8.3
    },
    "brand": {
      "slug": "canyon",
      "name": "Canyon",
      "nameCn": null
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
    "id": "01a12e89-5899-744c-8849-39d7396a3337",
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
    "editorialScores": {
      "value": 8.7,
      "comfort": 9.2,
      "climbing": 7.7,
      "handling": 8.3,
      "versatility": 9.3,
      "speedEfficiency": 7.9
    },
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
    "id": "01a12e89-58a5-7d98-985f-643f7918628c",
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
    "editorialScores": {
      "value": 7.6,
      "comfort": 7.8,
      "climbing": 8.3,
      "handling": 8.7,
      "versatility": 7.8,
      "speedEfficiency": 9.6
    },
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
    "id": "01a12e89-58b1-75c1-935c-d6c24f6565cb",
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
    "editorialScores": {
      "value": 7.8,
      "comfort": 8.2,
      "climbing": 9.1,
      "handling": 9,
      "versatility": 8.8,
      "speedEfficiency": 9.1
    },
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
    "id": "01a12e89-58bd-7e10-b221-df1fe8674df3",
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
    "editorialScores": {
      "value": 6.8,
      "comfort": 8,
      "climbing": 9.6,
      "handling": 9.3,
      "versatility": 8.2,
      "speedEfficiency": 9.6
    },
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
    "id": "01a12e89-58c9-77bd-81b6-2c9184e0a66c",
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
    "editorialScores": {
      "value": 7.9,
      "comfort": 7.9,
      "climbing": 9,
      "handling": 9,
      "versatility": 8.4,
      "speedEfficiency": 9.1
    },
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
    "id": "01a13d55-46c1-7150-8001-35af916dac95",
    "slug": "decathlon-dbck-500-junior-2026",
    "title": "DREAMSCAPE DBCK 500 儿童背部护具",
    "model": "DREAMSCAPE DBCK 500 Junior Back Protector Vest",
    "year": 2026,
    "oneLiner": "轻柔、透气的儿童背心式护背，适用 6–14 岁身高范围；官方商品页的 EN 防护标准描述与测试区块冲突，等级待核。可接入指定 Teen SNB 500 Boy/Girl 外套的 ZIPROTEC 系统。",
    "priceMin": 399,
    "priceMax": 399,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2598966/k%24261e05a2209b76268de8ce15bc58fc5c/picture.jpg?f=3000x0&format=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "ski-protection",
    "specs": {
      "protectorType": "back-vest",
      "protectionStandard": "官方商品页冲突待核：描述写 EN 1621-2 Level 1，测试区块写 EN 1621-1 Level 1；未找到该款对应的符合性声明进行交叉核验",
      "coverage": "全背部",
      "useSports": [
        "skiing",
        "snowboard",
        "mtb"
      ],
      "availableSizes": [
        "6y",
        "8y",
        "10y",
        "12y",
        "14y"
      ],
      "fitAdvice": "官方建议按孩子平时穿着尺码，并明确选择以身高为主、胸围为参考。护背应贴合且运动时保持稳定；接近尺码边界时试穿。",
      "jacketCompatibility": "官方确认可与 Teen Boys' SNB 500 Jacket（8829923）及 Girls' SNB 500 Jacket（8829925）通过 ZIPROTEC 连接；不能据此推定兼容其他儿童或成人外套。",
      "attachment": "背心式穿着，侧边调节，带裤袢连接带；通过 ZIPROTEC 内拉链和背部挂点连接指定兼容外套。",
      "materials": "护垫为 100% 聚氨酯；主体 86% 聚酯纤维、14% 氨纶；包边 78% 聚酰胺、22% 氨纶；拼片 65% 聚酰胺、35% 氨纶。",
      "styleCode": "Decathlon ID 8585102（灰色）；R-p-312102",
      "seasonEvidence": "商品页没有明确雪季；2026 是本次数据采集标签，不代表已确认年款。",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "英国 Decathlon DREAMSCAPE 官方零售页面",
      "priceSource": "https://www.decathlon.co.uk/p/junior-mtb-ski-and-snowboard-back-protector-vest-dbck-500/312102/c251m8585102",
      "priceStatus": "英国官网当前显示 GBP 44.99，原价 GBP 54.99；按 ECB 2026-10-14 汇率 GBP/EUR 0.84385、CNY/EUR 7.4925 折算 CNY 399.46。法国官网橙色变体 ID 9002193 标价 EUR 54.99，作为另一地区款色参考。所有人民币金额均为地区价格折算，不是中国售价；运费、税费与支付汇率另计，价格和库存会变化。"
    },
    "highlights": [
      {
        "key": "protectorType",
        "label": "护具类型",
        "value": "背心式护背"
      },
      {
        "key": "useSports",
        "label": "适用运动",
        "value": "双板滑雪 · 单板滑雪 · 山地自行车"
      }
    ]
  },
  {
    "id": "01a13d55-46cf-79ac-929c-3b8193507156",
    "slug": "decathlon-dbck-500-m-2026",
    "title": "DREAMSCAPE DBCK 500 男款背部护具",
    "model": "DREAMSCAPE DBCK 500 Men's Back Protector Vest",
    "year": 2026,
    "oneLiner": "背心式软护背，官方页面对 EN 防护标准的描述与测试区块不一致；2025 符合性声明列出另一组标准，等级映射待核。可通过 ZIPROTEC 与 SNB 500/900 外套组合；M 码胸围区间与相邻尺码重叠。",
    "priceMin": 449,
    "priceMax": 449,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p3014512/k%2463949858dcbbe0005995c5bb191761b7/picture.jpg?f=3000x0&format=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "ski-protection",
    "specs": {
      "protectorType": "back-vest",
      "protectionStandard": "官方资料冲突待核：商品描述写 EN 1621-2 Level 1，测试区块写 EN 1621-1 Level 1；2025 符合性声明列 VPSki-009 与 VêtProVTT-008，未列上述 EN 标准，三者关系未确认",
      "coverage": "全背部",
      "useSports": [
        "skiing",
        "snowboard",
        "mtb"
      ],
      "availableSizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "2XL"
      ],
      "fitAdvice": "官方页面建议按平时尺码选择；德国同货号 Ref 8494020 页面尺码选择器列 XS、S、M、L、XL、2XL，但官方胸围/身高建议表仅覆盖 S–2XL，未提供 XS 对应数据。护具需贴合并保持稳定，胸围处于临界或 M 区间时先核实官方尺码表异常值；XS 选码也应先向商家确认。",
      "jacketCompatibility": "DREAMSCAPE 官方说明 ZIPROTEC 可与 SNB JKT 500、SNB JKT 900 系列外套组合；下单时按护具与外套同尺码确认具体款式接口。",
      "attachment": "弹性背心穿着，侧边调节；另有裤袢连接带，官方说明可 ZIPROTEC 拉链连接兼容外套。",
      "materials": "注塑聚氨酯泡棉；主体面料为聚酰胺、聚酯与氨纶混纺。",
      "styleCode": "Ref 8494020（灰色）；Ref 8903324（黑色）",
      "seasonEvidence": "商品页没有明确雪季；2026 是本次数据采集标签，不代表已确认年款。",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "法国 Decathlon DREAMSCAPE 官方零售页面",
      "priceSource": "https://www.decathlon.fr/p/gilet-de-protection-dorsale-vtt-ski-et-snowboard-homme-dbck-500-gris/_/R-p-173334",
      "priceStatus": "法国页面列出的常规价 EUR 59.99，按 ECB 2026-10-14 EUR/CNY 7.4925 折算为 CNY 449.48；法国促销 EUR 39.99 已注明截至 2026-09-14。德国官方同货号页面当前显示 EUR 39.99，按同一汇率折算为 CNY 299.63，作为德国地区独立价格快照。价格字段仍以法国常规挂牌为主参考；地区价格不同，不合并成通用价格区间，也都不是中国售价。运费、税费及汇率差异未计。"
    },
    "highlights": [
      {
        "key": "protectorType",
        "label": "护具类型",
        "value": "背心式护背"
      },
      {
        "key": "useSports",
        "label": "适用运动",
        "value": "双板滑雪 · 单板滑雪 · 山地自行车"
      }
    ]
  },
  {
    "id": "01a13d55-46da-7b2c-b462-af9de6d2eb14",
    "slug": "decathlon-dbck-500-w-2026",
    "title": "DREAMSCAPE DBCK 500 女款背部护具",
    "model": "DREAMSCAPE DBCK 500 Women's Back Protector Vest",
    "year": 2026,
    "oneLiner": "轻柔、透气的女款背心式护背，官方提供 XS–XL 胸围与身高建议；商品页的 EN 防护标准描述与测试区块冲突，2025 符合性声明另列标准，等级映射待核。兼容 SNB 500/900 外套 ZIPROTEC 系统。",
    "priceMin": 444,
    "priceMax": 444,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p3014427/k%24696c8ed65393c16ba1ef3268e2a09f77/picture.jpg?f=3000x0&format=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "ski-protection",
    "specs": {
      "protectorType": "back-vest",
      "protectionStandard": "官方资料冲突待核：商品描述写 EN 1621-2 Level 1，测试区块写 EN 1621-1 Level 1；2025 符合性声明列 VPSki-009 与 VêtProVTT-008，未列上述 EN 标准，三者关系未确认",
      "coverage": "全背部",
      "weightRangeGr": "500–600 g",
      "useSports": [
        "skiing",
        "snowboard",
        "mtb"
      ],
      "availableSizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "fitAdvice": "英国官网建议选择平时尺码；护背应贴合身体并保持稳定，胸围或身高处于相邻档交界时试穿确认。卖点文字称四个尺码，但选择器及尺码表列五码，按选择器/尺码表记录并保留来源差异。",
      "jacketCompatibility": "官方说明可通过 ZIPROTEC 与 SNB JKT 500、SNB JKT 900 系列外套组合；购买时核对具体外套款式、尺码和拉链接口。",
      "attachment": "背心式穿着，侧边调节，带裤袢连接带；可通过 ZIPROTEC 拉链连接兼容外套。",
      "materials": "护垫为 100% 聚氨酯；主体 95% 聚酯纤维、5% 氨纶；胸部拼片 84% 聚酯纤维、16% 氨纶；侧片 65% 聚酰胺、35% 氨纶。",
      "styleCode": "Decathlon ID 8903323（英国黑蓝款）；产品系列 Ref 327580",
      "seasonEvidence": "商品页没有明确雪季；2026 是本次数据采集标签，不代表已确认年款。",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "英国 Decathlon DREAMSCAPE 官方零售页面",
      "priceSource": "https://www.decathlon.co.uk/p/womens-mtb-ski-and-snowboard-back-protector-vest-dbck-500-black-navy/327580/c43c382m8903323",
      "priceStatus": "官方页面当前显示 GBP 49.99，原价 GBP 59.99。按 ECB 2026-10-14 汇率 GBP/EUR 0.84385、CNY/EUR 7.4925 折算为 CNY 443.86。该金额是英国促销参考价，不是中国售价；运费、税费与支付汇率另计，促销和库存会变化。法国官网同系列页面常规价 EUR 59.99，地区价格分开记录。"
    },
    "highlights": [
      {
        "key": "protectorType",
        "label": "护具类型",
        "value": "背心式护背"
      },
      {
        "key": "useSports",
        "label": "适用运动",
        "value": "双板滑雪 · 单板滑雪 · 山地自行车"
      }
    ]
  },
  {
    "id": "01a13d55-46e2-72ae-bd72-47cc5b77333e",
    "slug": "decathlon-dbck-900-m-2026",
    "title": "DREAMSCAPE DBCK 900 男款背部护具",
    "model": "DREAMSCAPE DBCK 900 Men's Back Protector Vest",
    "year": 2026,
    "oneLiner": "轻量、高透气的背心式护背，2024 欧盟符合性声明确认款号 8738342 对应 DBCK900 M，并列出 PPE Regulation 2016/425 与 VPski-009 / VêtProVTT-008；声明未注明 EN 1621 等级，商品页与说明书标示仍有冲突。M 码胸围区间与相邻尺码重叠，应先向商家核实。",
    "priceMin": 710,
    "priceMax": 710,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2704381/k%24ab0c91c40be9e2f58234589b5e0d9ce8/picture.jpg?f=3000x0&format=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "ski-protection",
    "specs": {
      "protectorType": "back-vest",
      "protectionStandard": "2024 欧盟符合性声明将该型号列入 PPE Regulation (EU) 2016/425，并列技术规范 VPski-009 与 VêtProVTT-008；声明未列 EN 1621 标准或等级。商品页正文标注 EN 1621-2 Level 1、测试段另写 EN 1621-1 Level 1，使用说明出现 Level 2，互相冲突，不发布单一等级结论。",
      "coverage": "全背部",
      "useSports": [
        "skiing",
        "snowboard",
        "mtb"
      ],
      "availableSizes": [
        "S",
        "M",
        "L",
        "XL",
        "2XL"
      ],
      "fitAdvice": "官方提供胸围和身高参考；对应商品号的使用说明还要求量腰到肩的距离，穿好后确认背部保护区域覆盖到位、调节腰带并活动检查护具是否移位。过大或过小都会降低保护效果。因 M 胸围范围异常重叠，临界尺码应咨询商家并试穿确认贴合度，不按单一身高推断尺码。",
      "jacketCompatibility": "DREAMSCAPE 官方说明 ZIPROTEC 可连接男款 SNB 500 与 SNB 900 外套；产品页列出款号 8758723、8809963、8600856。使用说明称护具与雪服应为同一尺码；购买前确认目标外套款号、尺码和拉链配置。",
      "attachment": "弹性护背背心，侧边调节，带裤袢连接带；通过 ZIPROTEC 拉链与兼容外套连接。",
      "materials": "护垫为 100% 苯乙烯-乙烯-丁二烯共聚物（SBS）；主体 78% 聚酯纤维、22% 氨纶；内层为聚酯纤维；背部面料为聚酯纤维与氨纶。",
      "styleCode": "Decathlon ID 8738342",
      "seasonEvidence": "商品页没有明确雪季；2026 是本次数据采集标签，不代表已确认年款。",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "英国 Decathlon DREAMSCAPE 官方零售页面",
      "priceSource": "https://www.decathlon.co.uk/p/mens-mtb-skiing-and-snowboarding-back-protector-vest-dbck-900-black/339069/c382m8738342",
      "priceStatus": "官方页面当前显示 GBP 79.99，原价 GBP 99.99。按 ECB 2026-10-14 汇率 GBP/EUR 0.84385、CNY/EUR 7.4925 折算为 CNY 710.23。此为英国地区促销参考价，不是中国售价；运输、税费与支付汇率另计，促销和库存可能变化。"
    },
    "highlights": [
      {
        "key": "protectorType",
        "label": "护具类型",
        "value": "背心式护背"
      },
      {
        "key": "useSports",
        "label": "适用运动",
        "value": "双板滑雪 · 单板滑雪 · 山地自行车"
      }
    ]
  },
  {
    "id": "01a13d55-46ea-7411-8d8c-a54802a27563",
    "slug": "quechua-fs-300-ski-snowboard-helmet-2026",
    "title": "QUECHUA FS 300 滑雪与单板头盔",
    "model": "FS 300",
    "year": 2026,
    "oneLiner": "ABS 硬壳与 EPS 内衬，EN 1077:2007 Class B；S/M/L 对应 52–62 cm 头围。2026 为采集标签，官方页面未确认具体雪季。",
    "priceMin": 355,
    "priceMax": 355,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2977665/k%24ddb3016d4dc9373eb8837ea16e0d23a4/picture.jpg?f=3000x0&format=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "quechua",
      "name": "Quechua",
      "nameCn": "Quechua（迪卡侬）"
    },
    "categorySlug": "ski-protection",
    "specs": {
      "protectorType": "helmet",
      "protectionStandard": "EN 1077:2007",
      "protectionClass": "class-b",
      "coverage": "滑雪头盔；官方说明 Class B 覆盖范围较 Class A 小，抗穿透保护也较低。",
      "weightRangeGr": "520 g（M码）",
      "useSports": [
        "skiing",
        "snowboard"
      ],
      "availableSizes": [
        "S",
        "M",
        "L"
      ],
      "fitAdvice": "官方建议按平时尺码选择；页面提示 FS 300 前额高度略低于其他 Wedze 头盔，建议试戴确认贴合度。",
      "attachment": "后部旋钮调节系统（Turnring）与可调节下颌带；内衬泡棉可拆洗。",
      "materials": "ABS 硬壳、EPS 内胆、聚酯内衬。",
      "helmetSafetyGuidance": "发生撞击后应更换；无严重撞击时官方建议最长使用 5 年（从制造日期起算）。厚帽及加装运动相机可能影响安全性；本款无镜片，可兼容眼镜与雪镜。",
      "styleCode": "8524785",
      "seasonEvidence": "官方商品页未标注具体雪季或年款；2026 仅为采集标签。",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "英国 Decathlon 官方商品页",
      "priceSource": "https://www.decathlon.co.uk/p/adults-and-kids-ski-and-snowboard-helmet-fs-300-black/166071/c382c76m8524785",
      "priceStatus": "英国挂牌价 GBP 39.99，按 ECB 2026-10-14 GBP/EUR 0.84385、EUR/CNY 7.4925 折合 CNY 355.07；这是英国地区折算参考，不是中国售价，未计运费、税费及汇率差异。"
    },
    "highlights": [
      {
        "key": "protectorType",
        "label": "护具类型",
        "value": "滑雪头盔"
      },
      {
        "key": "protectionClass",
        "label": "防护类别",
        "value": "Class B"
      },
      {
        "key": "useSports",
        "label": "适用运动",
        "value": "双板滑雪 · 单板滑雪"
      }
    ]
  },
  {
    "id": "01a13d55-46f1-7c6e-af2f-402ae8ea2795",
    "slug": "wedze-h-fr-900-mips-helmet-2026",
    "title": "WEDZE H-FR 900 MIPS 滑雪头盔",
    "model": "H-FR 900 MIPS",
    "year": 2026,
    "oneLiner": "ABS/PC 混合壳体、MIPS 与 RECCO，EN 1077:2007 Class B；M 码 500 g。2026 为采集标签，官方资料未确认具体雪季。",
    "priceMin": 888,
    "priceMax": 888,
    "priceCurrency": "CNY",
    "coverUrl": "https://contents.mediadecathlon.com/p2576864/k%24aae088041e430d3d2c214bb9d0f8953e/picture.jpg?f=3000x0&format=auto",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "wedze",
      "name": "WEDZE",
      "nameCn": "WEDZE（迪卡侬）"
    },
    "categorySlug": "ski-protection",
    "specs": {
      "protectorType": "helmet",
      "protectionStandard": "EN 1077:2007",
      "protectionClass": "class-b",
      "coverage": "滑雪与单板头部防护；Class B 依 EN 1077:2007 测试冲击吸收和抗穿透能力。",
      "impactTechnology": "MIPS 低摩擦层；官方说明可在特定斜向冲击时多方向移动约 10–15 mm，以降低传递至头部的旋转力。",
      "weightRangeGr": "500 g（M码）",
      "ventilation": "可调通风；后部拨片在静止与滑行状态间切换气流路径。",
      "rescueSystem": "集成 RECCO 反射器，需由救援人员使用 RECCO 探测器搜寻；不替代雪崩信标或其他救援装备。",
      "useSports": [
        "skiing",
        "snowboard"
      ],
      "availableSizes": [
        "S",
        "M",
        "L"
      ],
      "fitAdvice": "官方建议按平时尺码选择；后旋钮调节头围，支持高度调整，耳罩为 3D 结构。建议试戴并确认与雪镜贴合。",
      "attachment": "后部 Turnring 旋钮、可调下颌带及高度调节；泡棉可拆卸；无固定式或可拆式下巴护罩、无镜片。",
      "materials": "ABS 与聚碳酸酯混合外壳、EPS 内衬、聚氨酯泡棉。",
      "helmetSafetyGuidance": "受到撞击后应更换；官方建议至少每 5 年更换一次，发生严重撞击则提前更换。MIPS 只描述特定斜向冲击下的旋转力管理，不应理解为不会脑震荡或可替代正确佩戴。",
      "styleCode": "8773682（英国黑/白款）；官方 FR 900 MIPS 支持页还列出 8503323、8660329、8817967 等参考号，未跨色款合并价格。",
      "intendedUse": "Decathlon 将其列为进阶水平、高频使用的 freeride 头盔；这是商品定位标签，不是安全等级或使用限制。",
      "seasonEvidence": "官方商品页未标注具体雪季；Decathlon 支持页列有 2021–2024 年合规声明下载入口，但不能据此认定为这些雪季款。2026 仅为采集标签。",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "英国 Decathlon 官方商品页",
      "priceSource": "https://www.decathlon.co.uk/p/adult-s-ski-helmet-freeride-fr-900-mips-black-and-white/302052/c382c227m8773682",
      "priceStatus": "英国官方页当前列价 GBP 99.99，页面原价 GBP 109.99；按 ECB 2026-10-14 GBP/EUR 0.84385、EUR/CNY 7.4925 折合 CNY 887.81。此前记录的 GBP 109.99（折合 CNY 976.60）已成为该页显示的原价。当前折算为英国促销参考，不是中国售价；页面未选定具体尺码结账，库存与运费税费另核。",
      "sizeEvidence": "英国官方同款页面当前只列 S/M；比利时官方页面以同款货号 8773682 列出 S/M/L 头围范围。尺码范围可交叉核实，但各地区尺码库存、价格和配送状态不通用。"
    },
    "highlights": [
      {
        "key": "protectorType",
        "label": "护具类型",
        "value": "滑雪头盔"
      },
      {
        "key": "protectionClass",
        "label": "防护类别",
        "value": "Class B"
      },
      {
        "key": "useSports",
        "label": "适用运动",
        "value": "双板滑雪 · 单板滑雪"
      }
    ]
  },
  {
    "id": "01a12e89-58d5-7ab5-b7ef-dce3329a4041",
    "slug": "decathlon-snb-500-ziprotect-jacket-2026",
    "title": "Men's Warm and Durable Snowboard Jacket SNB 500 Ziprotect",
    "model": "SNB 500 Ziprotect Men's Snowboard Jacket",
    "year": 2026,
    "oneLiner": "英国官方页列 10,000 mm 防水并全压胶；迪卡侬部分地区页面出现 15,000 mm 冲突标注，防水等级待品牌核实。身体与袖部采用不同克重合成棉填充，实际保暖表现仍取决于内搭和环境。",
    "priceMin": 887,
    "priceMax": 1153,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/75971d33521217f626006282bfcfa19fb89a248c586616a91ceff628feb0b9e0.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "fabric": "100% Polyamide",
      "features": "ZIPROTEC 明确兼容 DREAMSCAPE DBCK 500 M 或 DBCK 900 M 背护；长款剪裁为穿戴背护时提供活动空间。",
      "skiPassPocket": true,
      "helmetCompatibleHood": true,
      "ziprotectCompatible": true,
      "availableSizes": [
        "S",
        "M",
        "L",
        "XL",
        "2XL"
      ],
      "sizeGuide": "英国官网尺码选项 S、M、L、XL、2XL，并建议选择平时穿着尺码。迪卡侬英国通用男装身体胸围参考为 S 87–92 cm、M 93–100 cm、L 101–108 cm、XL 109–118 cm、2XL 119–130 cm；这是品牌通用人体尺寸表，不是本款成衣胸围或款号级试穿数据，衣服松量及成衣尺寸仍未知。",
      "seasonEvidence": "当前英国商品页未直接标注该夹克的雪季；2026 年份暂作为档案标签，年款待核。",
      "level": "官网标注适合所有水平",
      "weather": "官网标注适合寒冷天气；身体填充 100 g/m²、袖部 80 g/m²，实际保暖感受仍受内搭和环境影响",
      "pocketCountEvidence": "营销区称 5 个安全口袋（含 1 个雪票袋），技术参数区列 7 个口袋；页面口径冲突，暂不归一成单一数量。",
      "officialPrice": "GBP 129.99",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Decathlon 英国官网；£99.99 为指定卡其/黑色变体促销价，页面原价 £129.99",
      "priceSource": "https://www.decathlon.co.uk/p/mens-warm-durable-snowboard-jacket-snb-500-ziprotect-camel-and-black/350525/c152c382m8881806",
      "priceStatus": "英国官网标价 GBP 129.99，按 ECB 2026-10-13 GBP/CNY 交叉参考汇率折算为 CNY 1152.61；指定颜色促销 GBP 99.99 折算为 CNY 886.60。不是中国售价，运费及税费依结账地而定。"
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
        "value": "宽松剪裁"
      },
      {
        "key": "seamTaping",
        "label": "压胶",
        "value": "全压胶"
      }
    ]
  },
  {
    "id": "01a13d55-1afe-7d59-8194-db62b754d56e",
    "slug": "kailas-bm45-full-finger-ski-gloves-2026",
    "title": "Kailas BM45 Full-Finger Ski Gloves",
    "model": "BM45 Full-Finger Ski Gloves",
    "year": 2026,
    "oneLiner": "GORE-TEX 防水透湿内衬、3M 保暖填充与山羊皮掌面，适用于滑雪。",
    "priceMin": 990,
    "priceMax": 1100,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/df03d564597ae82dcf61c4af834e4b1b06bb4e6931a3b0bdd9003d565403d149.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "kailas",
      "name": "KAILAS",
      "nameCn": "凯乐石"
    },
    "categorySlug": "skiing-apparel",
    "specs": {
      "garmentType": "gloves",
      "insulation": "3M insulation",
      "membrane": "GORE-TEX",
      "palmMaterial": "goat leather",
      "features": "魔术贴袖口；手背防护衬垫；弯指剪裁；拇指擦镜布；腕带；收纳扣。",
      "availableColors": "Black",
      "waterRepellent": true,
      "windproof": true,
      "breathable": true,
      "availableSizes": [
        "S",
        "M",
        "L"
      ],
      "sizeGuide": "凯乐石官方通用中性手套尺码表将 S/M/L 对应手掌围度 180–198/200–213/213–230 mm，中指长 78/82/93 mm；这是品牌通用参考，不是 BM45 款号专属说明，手套内衬厚度和个人偏好仍可能影响合手感。",
      "styleCode": "KM256200117159706",
      "seasonEvidence": "当前官方商品页未标注雪季；2026 为档案年份，具体年款待核。",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "中国大陆天猫凯乐石官方旗舰店活动价快照（由 Hooos 聚合页转录）",
      "priceSource": "https://tao.hooos.com/goods_kavWQKZSYtaxo82KARtGG5CPtJ-zzQnnasovJRDw5RsJ.html",
      "priceStatus": "Hooos 聚合页将 KM2562001 对应商品标为天猫凯乐石官方旗舰店，正文显示原价 CNY 1,100、活动价 CNY 990、活动期 2026-10-07 至 2026-10-31；页面 Open Graph 与描述元数据仍显示 CNY 1,100，存在页内价差，故按正文将 CNY 990 记为活动快照、CNY 1,100 记为挂牌价，不代表核实过的结账价。该来源不是天猫原始商品页，直达购买/结账金额未独立核实。KAILAS 美国官网同 SKU 页面仍列 USD 159，官方集合页曾列 USD 143.10；按 ECB 2026-10-14 汇率折算 CNY 1,064.14 / 957.73，仅保留为海外对照。"
    },
    "highlights": [
      {
        "key": "garmentType",
        "label": "款式",
        "value": "滑雪手套"
      },
      {
        "key": "waterRepellent",
        "label": "防泼水",
        "value": "是"
      },
      {
        "key": "windproof",
        "label": "防风",
        "value": "是"
      },
      {
        "key": "breathable",
        "label": "透气",
        "value": "是"
      }
    ]
  },
  {
    "id": "01a12e8a-3d4d-7432-9baf-f4c292461449",
    "slug": "kailas-bm45-gtx-ski-pants-2026",
    "title": "Kailas BM45 GTX Ski Pants",
    "model": "BM45 GTX Ski Pants",
    "year": 2026,
    "oneLiner": "75D 三层 GORE-TEX 滑雪裤，品牌推荐大山、野雪与非雪道滑行；带 RECCO 反射器、可拆卸背带和通风侧拉链。",
    "priceMin": 2800,
    "priceMax": 2800,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/76a3b36e68b5543cfc2d3b81ecd5e875aee1fa47a5bda5af24095a845e4b4622.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "fabric": "75D 3L GORE-TEX",
      "recco": true,
      "suspenders": true,
      "articulatedKnees": true,
      "corduraReinforced": true,
      "availableSizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "sizeGuide": "官网尺码选项为 S、M、L、XL；未找到对应成衣尺寸表，不能从尺码名推断腰围或臀围。",
      "styleCode": "KG2541316",
      "seasonEvidence": "当前官方页面未直接标注该裤款雪季；2026 年份暂作为档案标签，年款待核。",
      "weather": "面向寒冷滑雪环境；商品页未标注温度等级",
      "recommendedUse": "大山滑雪 / 野雪 / 非雪道滑行（KAILAS 官方商品页推荐用途）",
      "officialPrice": "CNY 2800",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "凯乐石微商城；货号 KG2541316",
      "priceSource": "https://detail.youzan.com/show/goods?alias=271lvpwy1x7q3ac&from_source=gbox_seo",
      "priceStatus": "凯乐石微商城同货号标价 CNY 2800；凯乐石美国官方店另标 USD 405，按 ECB 2026-10-13 汇率折算约 CNY 2710.98。地区价格有差异；人民币店铺标价为首选参考，非跨境到手价。雪季未由当前商品页确认。"
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
    "id": "01a13d55-1b05-77fb-a929-9cb0d1e67505",
    "slug": "kailas-bm45-high-cut-ski-socks-2026",
    "title": "Kailas BM45 High-Cut Ski Socks Unisex",
    "model": "BM45 High-Cut Ski Socks Unisex",
    "year": 2026,
    "oneLiner": "美利奴羊毛高筒滑雪袜，采用分左右脚立体鞋头、足弓与踝部支撑及无缝袜头。",
    "priceMin": 221,
    "priceMax": 221,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9e34579d1b40f7bdca30c7f9b4f807e49ead36c3ac4bc47525639e4cf26f9bb3.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "kailas",
      "name": "KAILAS",
      "nameCn": "凯乐石"
    },
    "categorySlug": "skiing-apparel",
    "specs": {
      "garmentType": "socks",
      "fabric": "美利奴羊毛、Lycra 与透气网布",
      "features": "毛圈缓冲；足弓和踝部支撑；左右脚分体立体鞋头；无缝袜头。",
      "availableColors": "Lightning Purple 22364",
      "availableSizes": [
        "S",
        "M",
        "L"
      ],
      "sizeGuide": "凯乐石官方通用中性袜码表将 S/M/L 对应脚长 240–260/260–280/280–300 mm 与欧码 37–39/40–42/43–45；这是品牌通用参考，不是 BM45 款号专属说明，穿着厚度和个人偏好仍可能影响合脚感。",
      "styleCode": "KH250100322364705",
      "seasonEvidence": "当前官方商品页未标注雪季；2026 为档案年份，具体年款待核。",
      "officialPrice": "USD 33.00",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Kailas 美国官网",
      "priceSource": "https://kailasgear.com/products/kailas-bm45-high-cut-ski-socks-unisex",
      "priceStatus": "美国官网标价 USD 33；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算约 CNY 220.86。海外地区参考价，非中国售价；未计跨境税费、运费及支付汇差。"
    },
    "highlights": [
      {
        "key": "garmentType",
        "label": "款式",
        "value": "滑雪袜"
      }
    ]
  },
  {
    "id": "01a12e8a-3d64-7d92-a283-5c0d5edf58bc",
    "slug": "kailas-bm45-max-mens-down-jacket-95g-2026",
    "title": "Kailas BM45 MAX Down Ski Jacket Men's 95g",
    "model": "BM45 MAX Down Ski Jacket Men's",
    "year": 2026,
    "oneLiner": "常规版男款，40D 三层 GORE-TEX 面料，填充 95g 800FP 羽绒。",
    "priceMin": 6158,
    "priceMax": 6158,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/541e235efa6bb728e7f4fd1360ac5b69486f9c0d2ff5fc0df6c515b27ce170ba.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "fabric": "40D 3L GORE-TEX",
      "recco": true,
      "version": "regular",
      "skiPassPocket": true,
      "helmetCompatibleHood": true,
      "availableSizes": [
        "S",
        "M",
        "L"
      ],
      "sizeGuide": "KAILAS 美国官网当前列 S/M/L，未展示本款尺码表入口、人体围度或成衣尺寸。品牌通用指南称装备采用 athletic / technical cut、各地区尺码标准可能不同，并建议严格按图表测量选码；但该指南只列男女鞋、手套和袜子表，没有服装图表，不能据此换算 KG2531144。京东公开索引另出现同款号赤缇红 XXS 变体，但未给身材数据、变体价或可下单库存；中外尺码标签不能直接换算。当前 availableSizes 仅表示美国官网所列尺码。",
      "styleCode": "KG2531144",
      "seasonEvidence": "当前官方页说明 95g 800FP、Y-Cut 常规版和 40D 三层 GORE-TEX，但未标注雪季；2026 年份暂作为档案标签，年款待核。",
      "recommendedUse": "雪道滑行 / 极寒保暖（KAILAS 官方商品页推荐用途）",
      "officialPrice": "USD 920.00",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Kailas 美国官方商店；货号 KG2531144",
      "priceSource": "https://kailasgear.com/products/kailas-bm45-max-down-ski-jacket-mens",
      "priceStatus": "2026-10-15 复核美国官方同货号标价 USD 920，按 ECB 2026-10-13 交叉汇率折算 CNY 6158.28，仅作美国地区参考。京东检索页找到精确款色尺码商品（商品 ID 10221071731160，KG2531144 赤缇红 S），但详情只返回浏览器兼容提示，未能读取人民币金额、卖家和当前可售状态；中国售价仍未核实。海外税费与配送另计；页面未确认本档案雪季。"
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
    "id": "01a12e8a-3d59-7077-92af-bd72235fb205",
    "slug": "kailas-bm45-max-mens-down-jacket-100g-2026",
    "title": "Kailas BM45 MAX Down Ski Jacket Men's 100g Long",
    "model": "BM45 MAX Down Ski Jacket Men's (100g 800FP Long)",
    "year": 2026,
    "oneLiner": "加长版男款，40D 三层 GORE-TEX 面料，填充 100g 800FP 羽绒。",
    "priceMin": 6627,
    "priceMax": 6627,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/6560f6b091a1c8b570da765e326214ec1bce418727b074dc3cc47b88b20bb4a6.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "venting": true,
      "powderSkirt": true,
      "fabric": "40D 3L GORE-TEX",
      "recco": true,
      "version": "long",
      "skiPassPocket": true,
      "helmetCompatibleHood": true,
      "availableSizes": [
        "S",
        "M",
        "L"
      ],
      "sizeGuide": "官网尺码选项为 S、M、L；未找到对应成衣尺寸表，不能从尺码名推断胸围或衣长。",
      "styleCode": "KG2531143",
      "seasonEvidence": "当前官方页说明 100g 800FP、H-Cut 加长版和 40D 三层 GORE-TEX，但未标注雪季；2026 年份暂作为档案标签，年款待核。",
      "officialPrice": "USD 990.00",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Kailas 美国官方商店；货号 KG2531143",
      "priceSource": "https://kailasgear.com/products/kailas-bm45-max-down-ski-jacket-mens-1",
      "priceStatus": "2026-10-15 复核美国官方同货号标价 USD 990，按 ECB 2026-10-13 交叉汇率折算 CNY 6626.84；未找到可验证的中国店 KG2531143 人民币标价，不作为中国售价，也不套用 95g 常规版价格。海外税费与配送另计；页面未确认本档案雪季。"
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
        "value": "男款 H 型运动剪裁"
      },
      {
        "key": "venting",
        "label": "通风拉链",
        "value": "是"
      }
    ]
  },
  {
    "id": "01a12e8a-3d6f-7c42-ab43-1b348deb9296",
    "slug": "kailas-bm45-max-womens-down-jacket-95g-2026",
    "title": "Kailas BM45 MAX Down Ski Jacket Women's 95g",
    "model": "BM45 MAX Down Ski Jacket Women's",
    "year": 2026,
    "oneLiner": "女款 BM45 MAX，40D 三层 GORE-TEX 面料，填充 95g 800FP 羽绒。",
    "priceMin": 6200,
    "priceMax": 6200,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/0aae5458750ed3d4147309ee4e97baab874239f884e422c182fece3bef277806.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "fabric": "40D 3L GORE-TEX",
      "recco": true,
      "skiPassPocket": true,
      "helmetCompatibleHood": true,
      "availableSizes": [
        "S",
        "M",
        "L"
      ],
      "sizeGuide": "官网尺码选项为 S、M、L；未找到对应成衣尺寸表，不能从尺码名推断胸围或衣长。",
      "styleCode": "KG2531244",
      "seasonEvidence": "当前官方页说明女款 95g 800FP、Y-Cut 和 40D 三层 GORE-TEX，但未标注雪季；2026 年份暂作为档案标签，年款待核。",
      "officialPrice": "CNY 6200",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "凯乐石微商城（中国大陆），同货号 KG2531244",
      "priceSource": "https://detail.youzan.com/show/goods?alias=2g2sri0raz5wrkp&from_source=gbox_seo",
      "priceStatus": "凯乐石微商城精确货号 KG2531244 标价 CNY 6200，作为人民币参考价；美国官方店另列 USD 920，约折 CNY 6158.28，仅作地区价格交叉参考。微商城页面未确认库存与雪季，成交及配送费用以购买页为准。"
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
    "id": "01a12e8a-3d7a-76bc-a40d-65011c12114f",
    "slug": "kailas-bm45-pro-ski-bibs-unisex-2026",
    "title": "Kailas BM45 PRO Ski Bibs Unisex",
    "model": "BM45 PRO Ski Bibs Unisex",
    "year": 2026,
    "oneLiner": "面向大山滑雪、滑雪登山与野雪场景的 100D 三层 GORE-TEX Pro 背带裤，带通风拉链、膝部立体剪裁与 Cordura 加固。",
    "priceMin": 3882,
    "priceMax": 3882,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/59de7eb346150a2aecb05c80a84d6d24cac59e45cf50fb36876140f72a151dd4.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "fabric": "100D 3L GORE-TEX Pro",
      "recco": true,
      "suspenders": true,
      "articulatedKnees": true,
      "corduraReinforced": true,
      "availableSizes": [
        "S",
        "M",
        "L"
      ],
      "sizeGuide": "官网尺码选项为 S、M、L，版型为 Relaxed；通用尺码指南只列鞋、手套和袜子图表，未提供此裤款成衣尺寸或腰围、臀围、大腿围、裤内长和裤长数据。不可从尺码名推断围度。",
      "styleCode": "KG2541314",
      "officialPrice": "USD 580.00",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Kailas 美国官方商店；货号 KG2541314",
      "priceSource": "https://kailasgear.com/products/kailas-bm45-pro-ski-bibs-unisex",
      "priceStatus": "2026-10-15 复核美国官方同货号标价 USD 580，按 ECB 2026-10-13 交叉汇率折算 CNY 3882.39；京东精确商品页 ID 10221071823387 对应 KG2541314，但页面未展示人民币价格且详情无法读取。京东另有自营 BM45 PRO 背带裤列表，未显示款号与价格，暂不能确认其与 KG2541314 的映射。拼多多同名结果带 region=SG 并以新加坡元展示，排除为中国报价。当前 CNY 3882.39 仅为美国地区折算参考，不是中国售价；海外税费与配送另计，页面未确认本档案雪季。"
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
    "id": "01a13b73-16f5-7421-a503-e8ccfb3ed367",
    "slug": "atomic-bent-100-2027",
    "title": "Atomic Bent 100 2026/27",
    "model": "Bent 100",
    "year": 2027,
    "oneLiner": "官方定位为全山地自由滑一板多用，HRZN 3D 与 Powder Rocker 增强软雪浮力；179 cm 单只重量 1700 g。",
    "priceMin": 5689,
    "priceMax": 5689,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ae547a24eacee25c0d14bfce7a5720a20ca250469f9a3042c90c1d254d61e172.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "158 / 165 / 172 / 179 / 186 cm",
      "profile": "Powder Rocker 20/65/15（板头和板尾摇臂，脚下反拱）",
      "waistWidth": 100,
      "core": "Light Woodcore（杨木）",
      "turnRadius": 18,
      "construction": "Dura Cap Sidewall",
      "turnRadiusReferenceLength": "172 cm",
      "sidecutDimensions": "158: 124.5-100-115 mm / 16.5 m；165: 126-100-116.5 mm / 17 m；172: 127.5-100-118 mm / 18 m；179: 128.5-100-119 mm / 19 m；186: 129.5-100-120 mm / 19.5 m",
      "technologies": "HRZN 3D Bent；Resist Edge Park；Directional Shape；Glossy Topsheet",
      "terrain": "全山地 / 自由滑 / 粉雪",
      "weightPerSki": 1700,
      "skierLevel": "入门至专家",
      "weightReferenceLength": "179 cm",
      "baseEdgeAngle": 1,
      "bindingSetup": "裸板，不含固定器",
      "sideEdgeAngle": 87,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方单只裸板重量，仅在 179 cm 公开；其他长度不推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "当前规格、官方图片及官网商品页对应 article AA0030952；Atomic 25/26 目录和零售页将 AA0030694 列为 25/26，而 Yodobashi、Sport Kaufmann、Ochsner Sport 等 26/27 商品页将 AA0030952 明确列为 26/27。以精确货号区分相邻雪季，官网产品页自身未直接标注季节。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.atomic.com/en-us/products/bent-100-aa7366-202600；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Atomic 美国官网裸板挂牌价",
      "priceSource": "https://www.atomic.com/en-us/products/bent-100-aa7366-202600",
      "priceStatus": "Atomic 美国官网按 article AA0030952 列 USD 850.00（页面注明 exc. VAT）；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,688.81。26/27 雪季由同货号零售页确认；美国官网页未直接标年款。另有欧洲零售页显示不同市场挂牌价，故本价仅为美国市场官方价参考，不是中国售价，税费未计。"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "100mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "18m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑 / 粉雪"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "入门至专家"
      }
    ]
  },
  {
    "id": "01a12e89-58f9-7be9-afb5-292ec57711cc",
    "slug": "atomic-bent-chetler-120-2026",
    "title": "Atomic Bent Chetler 120 2025/26",
    "model": "Bent Chetler 120",
    "year": 2026,
    "oneLiner": "Atomic 粉雪自由滑旗舰型号，120 mm 板腰搭配 Powder Rocker 30/40/30 与 HRZN 3D；184 cm 单只重量 1800 g。",
    "priceMin": 7998,
    "priceMax": 7998,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9d3ff1cc56d19f7a3f6e8a0cec8571c0edca3e3d6a753ea2996ece6ee4f53096.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "176 / 184 / 192 cm",
      "profile": "Powder Rocker 30/40/30（板头、板尾摇臂，脚下反拱）",
      "waistWidth": 120,
      "core": "Light Woodcore（杨木）",
      "turnRadius": 19,
      "construction": "Dura Cap Sidewall",
      "turnRadiusReferenceLength": "184 cm",
      "sidecutDimensions": "176: 142-120-133 mm / 18 m；184: 143-120-134 mm / 19 m；192: 144-120-135 mm / 20 m",
      "technologies": "HRZN 3D Bent；Directional Shape；Glossy Topsheet",
      "terrain": "粉雪 / 全山地自由滑",
      "weightPerSki": 1800,
      "skierLevel": "进阶至专家",
      "weightReferenceLength": "184 cm",
      "baseEdgeAngle": 1,
      "bindingSetup": "自由地带商品页未明确是否包含固定器，购买前需向商家核实",
      "sideEdgeAngle": 87,
      "geometryNotes": "官方日本 25/26 页面列出 176/184/192 cm 对应 18/19/20 m 半径，并明确 184 cm 为 143-120-134 mm；其他长度的板头/板尾宽不推算。",
      "weightBasis": "现有重量仅对应档案所列参考长度；逐长度重量及是否含固定器需进一步核对，不能当作所有尺码的通用重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "Atomic 日本 2526 官方自由滑专题对应 2025/26 雪季。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://atomicsnow.jp/pages/2526-freeride-skiandboots；https://www.atomic.com/en-us/products/bent-chetler-120-aa7364-202600；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "中国大陆自由地带雪具连锁有赞商品页",
      "priceSource": "https://detail.youzan.com/show/goods?alias=2fwj4g8h5inpkkh&from_source=gbox_seo",
      "priceStatus": "卖家商品页标题标注 25/26 新品，挂牌价 CNY 7,998，另列 CNY 100 运费。未确认实际成交、库存、尺码变体和固定器是否包含；该页面报价不代表长期价格。"
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
    "id": "01a12e89-5904-7f8e-ab88-05af51b7fd11",
    "slug": "atomic-redster-q7-2026",
    "title": "Atomic Redster Q7 Revoshock C 2025/26",
    "model": "Redster Q7 Revoshock C",
    "year": 2026,
    "oneLiner": "Redster Q 系列雪道板，2025/26 厂商目录列出 152–176 cm 四档尺寸。",
    "priceMin": 6443,
    "priceMax": 6443,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/6d2e0258e4170d5a18f7361161603a20eec81fc07c8f748ec706c37fba4f42da.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "152 / 160 / 168 / 176 cm",
      "terrain": "雪道 / 全地域",
      "skierLevel": "中级至进阶",
      "bindingSetup": "含 MI 12 GW 固定器",
      "geometryNotes": "2025/26 厂商目录按 AASS03668 提供四档逐长度尺寸与半径；重量参考值对应 168 cm，含板和固定器。",
      "weightBasis": "厂商目录仅给出 168 cm 单只参考重量 2643 g，含板和固定器；其它长度不推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 2025/26 厂商目录确认 Q7 货号 AASS03668，长度 152/160/168/176 cm。产品图现改为 Vail 25/26 同货号 AASS03668 零售页配图；该图不是 Atomic 官方 CDN 图，转载展示授权待核。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-us/collections/ato-men-skis-all-skis；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "奥地利/德国零售商 2025/26 固定器套装挂牌价",
      "priceSource": "https://www.ski-andmore.de/ski-alpin/sportcarver/atomic-redster-q7-revoshock-c-inkl-mi-12-gw-bindung-2025-26_113858",
      "priceStatus": "精确型号/季节零售页以货号 AASS03668-176 列示 2025/26 Q7 + MI 12 GW 套装原价 EUR 859.99；按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 6,443.48。零售商当时另列促销价，未将促销价写入种子；不是中国售价，跨境费用未计。"
    },
    "highlights": [
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
    "id": "01a12e89-590f-76b4-9f22-33a4803ad312",
    "slug": "atomic-redster-q7-2027",
    "title": "Atomic Redster Q7 Revoshock C 2026/27",
    "model": "Redster Q7 Revoshock C",
    "year": 2027,
    "oneLiner": "全地域雪道系统板，174 cm 半径 14.2 m、板腰 75 mm，单支含固定器重量 2811 g。",
    "priceMin": 6035,
    "priceMax": 6035,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/07479be30116559c9cfec8729c338e392fb6ccf1eb8ebea467295d412f4e31a5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "153 / 160 / 167 / 174 / 181 cm",
      "profile": "Active Camber 0/100/0",
      "waistWidth": 75,
      "core": "Power Woodcore（白蜡木与杨木）",
      "turnRadius": 14.2,
      "construction": "Dura Cap Sidewall",
      "turnRadiusReferenceLength": "174 cm",
      "sidecutDimensions": "153 cm: 121-75-106 mm / 11.8 m；160 cm: 123-75-107.5 mm / 12.6 m；167 cm: 125-75-109 mm / 13.4 m；174 cm: 127-75-110.5 mm / 14.2 m；181 cm: 129-75-112 mm / 15 m",
      "technologies": "Revoshock C；All-Condition Piste Shape；TI Powered；Structured Topsheet；World Cup Base Finish；Tip Protector；Pro Trak",
      "terrain": "雪道 / 全地域",
      "weightPerSki": 2811,
      "skierLevel": "中级至进阶",
      "weightReferenceLength": "174 cm",
      "baseEdgeAngle": 0.8,
      "bindingSetup": "含 MI 12 GW 固定器",
      "sideEdgeAngle": 87,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方按单只标注重量，对应 MI 12 GW 套装与参考板长；其他长度未公布，不折算为一对裸板重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 日本官网目录页列有 2026/27 目录入口；官网商品页确认型号与 AASS03788 货号，但未直接标雪季。Mahsport、Wrosport 等零售商品页把同型号/货号标为 2026/27，故以官网型号身份和多家 SKU 对应零售记录交叉确认；旧季记录仍单独保留。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-int/products/redster-q7-revoshock-c-mi-12-gw-aa7471-202600；https://www.grip-walk.com/faq/",
      "officialPrice": "JPY 142890",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Atomic 日本官方商店；AASS03788，选中变体 AASS03788160",
      "priceSource": "https://atomicsnow.jp/products/aass03788",
      "priceStatus": "Atomic 日本官方店页面对应 AASS03788、选中 160 cm 变体 AASS03788160，标价 JPY 142,890（含税）；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 6,035.31。页面标记线上不可购买，建议到店查询；运费按结账计算。此为日本官方参考价，不是中国售价或成交价，跨境运输及进口费用未计。"
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
        "value": "14.2m"
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
    "id": "01a12e89-591b-719c-8b31-8dbc61ea1113",
    "slug": "atomic-redster-q7-8-2026",
    "title": "Atomic Redster Q7.8 Revoshock C 2025/26",
    "model": "Redster Q7.8 Revoshock C",
    "year": 2026,
    "oneLiner": "Redster Q 系列雪道板，官方目录列出多档板长并配 MI 12 GW 固定器。",
    "priceMin": 6743,
    "priceMax": 6743,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/20c3a63734fa403231712a162bc375a2c50ee7b457444fb63b925bd3d270dde1.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "159 / 166 / 173 / 181 cm",
      "terrain": "雪道 / 全地域",
      "skierLevel": "中级至进阶",
      "bindingSetup": "含 MI 12 GW 固定器",
      "geometryNotes": "2025/26 厂商目录按 AASS03666 提供四档逐长度尺寸与半径；重量参考值对应 173 cm，含板和固定器。",
      "weightBasis": "厂商目录仅给出 173 cm 单只参考重量 2710 g，含板和固定器；其它长度不推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 2025/26 厂商目录确认 Q7.8 货号 AASS03666，长度 159/166/173/181 cm；Skitreff 2025/26 商品页以同一货号列示该套装，图片来自同页产品图库。图片展示授权待核。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-us/collections/ato-men-skis-all-skis；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "德国零售商 2025/26 固定器套装建议零售价",
      "priceSource": "https://www.intersport.de/p/atomic-herren-ski-redster-q78-rvsk-c-mi-12-gw-p2229852",
      "priceStatus": "INTERSPORT 页面以货号 AASS03666 列示 Q7.8 + MI 12 GW 2025/26 套装，建议零售价 EUR 899.99，页面促销价另有显示；按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 6,743.18。不是中国售价，跨境费用未计。"
    },
    "highlights": [
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
    "id": "01a12e89-5926-72b8-9ccd-6e7530044343",
    "slug": "atomic-redster-q7-8-2027",
    "title": "Atomic Redster Q7.8 Revoshock C 2026/27",
    "model": "Redster Q7.8 Revoshock C",
    "year": 2027,
    "oneLiner": "全地域雪道系统板，173 cm 板腰 84.5 mm、半径 14.4 m，单支含固定器重量 2880 g。",
    "priceMin": 6035,
    "priceMax": 6035,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9adfc2a865b298f340fc350eea82a34bc0d2a296f305151797ebd86a1ca898ac.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "159 / 166 / 173 / 181 cm",
      "profile": "Active Camber 0/100/0",
      "waistWidth": 84.5,
      "core": "Power Woodcore（白蜡木与杨木）",
      "turnRadius": 14.4,
      "construction": "Dura Cap Sidewall",
      "turnRadiusReferenceLength": "173 cm",
      "sidecutDimensions": "159 cm: 130-83.5-115 mm / 12.8 m；166 cm: 132-84-117.5 mm / 13.6 m；173 cm: 134-84.5-118.8 mm / 14.4 m；181 cm: 136-85-120.5 mm / 15.2 m",
      "technologies": "Revoshock C；All-Condition Piste Shape；TI Powered；Structured Topsheet；World Cup Base Finish；Tip Protector；Pro Trak",
      "terrain": "雪道 / 全地域",
      "weightPerSki": 2880,
      "skierLevel": "中级至进阶",
      "weightReferenceLength": "173 cm",
      "bindingSetup": "含 MI 12 GW 固定器",
      "sideEdgeAngle": 87,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方按单只标注重量，对应 MI 12 GW 套装与参考板长；其他长度未公布，不折算为一对裸板重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 日本官网目录页列有 2026/27 目录入口；官网商品页确认型号与 AASS03786 货号，但未直接标雪季。Skihaus Hellenberg、Sport Conrad 等零售商品页把同型号/货号标为 2026/27，故以官网型号身份和多家 SKU 对应零售记录交叉确认；旧季记录仍单独保留。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-us/products/redster-q7-8-revoshock-c-mi-12-gw-aa7470-202600；https://www.grip-walk.com/faq/",
      "officialPrice": "JPY 142890",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Atomic 日本官方商店；AASS03786，选中变体 AASS03786166",
      "priceSource": "https://atomicsnow.jp/products/aass03786",
      "priceStatus": "Atomic 日本官方店页面对应 AASS03786、选中 166 cm 变体 AASS03786166，标价 JPY 142,890（含税）；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 6,035.31。页面标记线上不可购买，建议到店查询；运费按结账计算。此为日本官方参考价，不是中国售价或成交价，跨境运输及进口费用未计。"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "84.5mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "14.4m"
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
    "id": "01a12e89-5931-732e-b7d6-dbbbaaac761b",
    "slug": "atomic-redster-q9-2026",
    "title": "Atomic Redster Q9 Revoshock S 2025/26",
    "model": "Redster Q9 Revoshock S",
    "year": 2026,
    "oneLiner": "Redster Q 系列雪道板，官方目录列出 153–181 cm 尺寸范围。",
    "priceMin": 8691,
    "priceMax": 8691,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/cccc5392b876727a1bd5ebeb722eb1269a144c75598eff28a33958467947eaad.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "152 / 160 / 168 / 176 cm",
      "terrain": "雪道 / 全地域",
      "skierLevel": "进阶",
      "bindingSetup": "含 I 12 GW 固定器套装",
      "geometryNotes": "2025/26 厂商目录按 AASS03664 提供四档逐长度尺寸与半径；重量参考值对应 168 cm，含板和固定器。",
      "weightBasis": "厂商目录仅给出 168 cm 单只参考重量 2995 g，含板和固定器；其它长度不推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 2025/26 厂商目录确认 Q9 货号 AASS03664，长度 152/160/168/176 cm；FUSO 25/26 商品页以同一货号列出套装与 160/168 cm 规格，图片来自该页商品图库。图片展示授权待核。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-us/collections/ato-men-skis-all-skis；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "奥地利零售商 2025/26 固定器套装挂牌价",
      "priceSource": "https://www.bruendl.at/de/produkte-marken/produkte/ausruestung/atomic-redster-q9-rvsk-s--i-12-gw",
      "priceStatus": "Bründl 页面按货号 AASS03664 列示 Q9 + I 12 GW 套装参考挂牌 EUR 1,159.99，并同时展示其促销价；按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 8,691.23。不是中国售价，跨境费用未计。"
    },
    "highlights": [
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
    "id": "01a12e89-593c-737c-9896-a5c414e815f2",
    "slug": "atomic-redster-q9-2027",
    "title": "Atomic Redster Q9 Revoshock S 2026/27",
    "model": "Redster Q9 Revoshock S",
    "year": 2027,
    "oneLiner": "全地域雪道竞速取向系统板；174 cm 半径 14.2 m，单支含固定器重量 3189 g。",
    "priceMin": 8447,
    "priceMax": 8447,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a53499ad3e5bd8f51cecfe71f80a0c8382da2910cc040684d25d1f747d01204d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "153 / 160 / 167 / 174 / 181 cm",
      "profile": "Active Camber 0/100/0",
      "waistWidth": 75,
      "core": "Power Woodcore（白蜡木与杨木）",
      "turnRadius": 14.2,
      "construction": "Ultrawall 全侧墙结构",
      "turnRadiusReferenceLength": "174 cm",
      "sidecutDimensions": "153 cm: 121-75-106 mm / 11.8 m；160 cm: 123-75-107.5 mm / 12.6 m；167 cm: 125-75-109 mm / 13.4 m；174 cm: 127-75-110.5 mm / 14.2 m；181 cm: 129-75-112 mm / 15 m",
      "technologies": "Revoshock S；Carbon Boost；All-Condition Piste Shape；Structured Topsheet；World Cup Base Finish；Tip Protector；Icon Flex Interface",
      "terrain": "雪道 / 全地域",
      "weightPerSki": 3189,
      "skierLevel": "进阶至专家",
      "weightReferenceLength": "174 cm",
      "baseEdgeAngle": 0.8,
      "bindingSetup": "含 I 12 GW 固定器",
      "sideEdgeAngle": 87,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方按单只标注重量，对应 I 12 GW 套装与参考板长；其他长度未公布，不折算为一对裸板重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 日本官网目录页列有 2026/27 目录入口；官网商品页确认型号与 AASS03784 货号，但未直接标雪季。Skihaus Hellenberg、SkiRace24 等零售商品页把同型号/货号标为 2026/27，故以官网型号身份和多家 SKU 对应零售记录交叉确认；旧季记录仍单独保留。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-us/products/redster-q9-revoshock-s-i-12-gw-aa7469-202600；https://www.grip-walk.com/faq/",
      "officialPrice": "JPY 199980",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Atomic 日本官方商店；AASS03784，选中变体 AASS03784160",
      "priceSource": "https://atomicsnow.jp/products/aass03784",
      "priceStatus": "Atomic 日本官方店页面对应 AASS03784、选中 160 cm 变体 AASS03784160，标价 JPY 199,980（含税）；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 8,446.64。页面标记线上不可购买，建议到店查询；运费按结账计算。此为日本官方参考价，不是中国售价或成交价，跨境运输及进口费用未计。"
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
        "value": "14.2m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全地域"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶至专家"
      }
    ]
  },
  {
    "id": "01a12e89-5947-7e0e-9e16-edd478fe8c4a",
    "slug": "atomic-redster-q9-8-2026",
    "title": "Atomic Redster Q9.8 Revoshock S 2025/26",
    "model": "Redster Q9.8 Revoshock S",
    "year": 2026,
    "oneLiner": "Atomic Redster 雪道全能系列，官方商品目录列出多种板长与固定器配置。",
    "priceMin": 8991,
    "priceMax": 8991,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/283a7e22b6c3ee06b6fc59f3e9ebffc837c6ef875b8c516586137a219e70b810.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "159 / 166 / 173 / 181 cm",
      "terrain": "雪道 / 全地域",
      "skierLevel": "进阶",
      "bindingSetup": "含 X 12 GW 或 I 12 GW 固定器套装，依 SKU 区分",
      "geometryNotes": "2025/26 厂商目录按 AASS03662 提供四档逐长度尺寸与半径；重量参考值对应 173 cm，含板和固定器。",
      "weightBasis": "厂商目录仅给出 173 cm 单只参考重量 3223 g，含板和固定器；其它长度不推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 2025/26 厂商目录确认 Q9.8 货号 AASS03662，长度 159/166/173/181 cm；Bill & Paul's 25/26 商品页以同一货号列出套装及逐长度参数，图片来自同页产品图库。图片展示授权待核。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-us/collections/ato-men-skis-all-skis；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "德国零售商 2025/26 固定器套装建议零售价",
      "priceSource": "https://sport-kaufmann.de/wintersport/ski-alpin/ski/racecaver/366937/atomic-redster-q9-8-revoshock-s-i-12-gw-2025/26-allmountainski",
      "priceStatus": "Sport Kaufmann 页面按货号 AASS03662 列示 Q9.8 + I 12 GW 2025/26 套装建议零售价 EUR 1,199.99，另列优惠价；按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 8,990.93。不是中国售价，跨境费用未计。"
    },
    "highlights": [
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
    "id": "01a12e89-5952-7c1a-9889-763919b42d20",
    "slug": "atomic-redster-q9-8-2027",
    "title": "Atomic Redster Q9.8 Revoshock S 2026/27",
    "model": "Redster Q9.8 Revoshock S",
    "year": 2027,
    "oneLiner": "Q 系列宽腰雪道系统板，173 cm 板腰 84.5 mm、半径 14.4 m，单支含固定器重量 3344 g。",
    "priceMin": 8447,
    "priceMax": 8447,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/38621471f4460b7cecd893ee206ffcdb815efb822d24316c38665f7c0d3fc024.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "159 / 166 / 173 / 181 cm",
      "profile": "Active Camber 0/100/0",
      "waistWidth": 84.5,
      "core": "Power Woodcore（白蜡木与杨木）",
      "turnRadius": 14.4,
      "construction": "Ultrawall 全侧墙结构",
      "turnRadiusReferenceLength": "173 cm",
      "sidecutDimensions": "159 cm: 130-83.5-115 mm / 12.8 m；166 cm: 132-84-117.5 mm / 13.6 m；173 cm: 134-84.5-118.8 mm / 14.4 m；181 cm: 136-85-120.5 mm / 15.2 m",
      "technologies": "Revoshock S；Carbon Boost；All-Condition Piste Shape；TI Powered；Structured Topsheet；World Cup Base Finish；Tip Protector；Icon Flex Interface",
      "terrain": "雪道 / 全地域",
      "weightPerSki": 3344,
      "skierLevel": "进阶至专家",
      "weightReferenceLength": "173 cm",
      "baseEdgeAngle": 0.8,
      "bindingSetup": "含 I 12 GW 固定器",
      "sideEdgeAngle": 87,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方按单只标注重量，对应 I 12 GW 套装与参考板长；其他长度未公布，不折算为一对裸板重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 日本官网目录页列有 2026/27 目录入口；官网商品页确认型号与 AASS03782 货号，但未直接标雪季。Skihaus Hellenberg、SkiRace24 等零售商品页把同型号/货号标为 2026/27，故以官网型号身份和多家 SKU 对应零售记录交叉确认；旧季记录仍单独保留。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-us/products/redster-q9-8-revoshock-s-i-12-gw-aa7468-202600；https://www.grip-walk.com/faq/",
      "officialPrice": "JPY 199980",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Atomic 日本官方商店；AASS03782，选中变体 AASS03782166",
      "priceSource": "https://atomicsnow.jp/products/aass03782",
      "priceStatus": "Atomic 日本官方店页面对应 AASS03782、选中 166 cm 变体 AASS03782166，标价 JPY 199,980（含税）；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 8,446.64。页面标记线上不可购买，建议到店查询；运费按结账计算。此为日本官方参考价，不是中国售价或成交价，跨境运输及进口费用未计。"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "84.5mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "14.4m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 全地域"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶至专家"
      }
    ]
  },
  {
    "id": "01a12e89-595d-7075-8fc5-cd35253ef883",
    "slug": "atomic-redster-s9-2026",
    "title": "Atomic Redster S9 Revoshock S 2025/26",
    "model": "Redster S9 Revoshock S",
    "year": 2026,
    "oneLiner": "Atomic Redster 官方目录中的雪道竞速小回转型号。",
    "priceMin": 8691,
    "priceMax": 8691,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/430d6517839959a7d403a34465f16c2fc2770d39998ae7d829f2566e912528c3.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "atomic",
      "name": "Atomic",
      "nameCn": "阿托米克"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "155 / 160 / 165 / 170 cm",
      "terrain": "雪道 / 竞速 / 小回转",
      "skierLevel": "进阶",
      "bindingSetup": "含 I 12 GW 固定器套装",
      "geometryNotes": "2025/26 厂商目录按 AASS03628 提供四档逐长度尺寸与半径；重量参考值对应 165 cm，含板和固定器。",
      "weightBasis": "厂商目录仅给出 165 cm 单只参考重量 3181 g，含板和固定器；其它长度不推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Atomic 2025/26 厂商目录确认 S9 货号 AASS03628，长度 155/160/165/170 cm；目录货号与现有图片货号一致。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.atomic.com/en-us/collections/ato-men-skis-all-skis；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "德国零售商 2025/26 固定器套装建议零售价",
      "priceSource": "https://sport-kaufmann.de/wintersport/ski-alpin/ski/slalomcarver/366935/atomic-redster-s9-revoshock-s-i-12-gw-2025/26-slalomski",
      "priceStatus": "Sport Kaufmann 页面以货号 AASS03628 列示 S9 + I 12 GW 2025/26 套装建议零售价 EUR 1,159.99，并同时展示优惠价；按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 8,691.23。不是中国售价，跨境费用未计。"
    },
    "highlights": [
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
    "id": "01a12e89-5974-76eb-a0b3-f0f8b1d7409e",
    "slug": "head-e-slr-2026",
    "title": "HEAD Worldcup Rebels e.SLR 2025/26",
    "model": "e.SLR",
    "year": 2026,
    "oneLiner": "京东海德雪板排行出现的民用小回转型号，定位偏雪道 carving。",
    "priceMin": 2622,
    "priceMax": 2622,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/18d3bc70737288db6bfa1d884f7588e85c5388d1686389f676f04ce5dbbd95e4.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "bindingSetup": "雪板+固定器，按具体 SKU 核对",
      "geometryNotes": "HEAD 25/26 手册按 313365 确认长度与 163 cm 参考几何；同货号零售商品规格列出四档半径，并复录相同 sidecut。重量未录入。",
      "weightBasis": "尚缺可核对的逐长度重量，不以同系列或其他年款推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "HEAD Hardgoods Workbook 2025/26 列明 article 313365 及四个长度；零售归档页标注同一 article 与 2025/26 雪季。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.head.com/en_SE/product/worldcup-rebels-e-slr-313365-set；https://www.skiandbikes.com/image/document/head_workbook_2526_en.pdf；https://www.sportokay.com/at_en/head-worldcup-rebels-e-slr-pr-11-gw-skiset-2026.html；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "德国零售比价页同货号最低挂牌参考",
      "priceSource": "https://preisvergleich.heise.de/head-worldcup-rebels-e-slr-pr-11-gw-inkl-bindung-modell-2025-2026-313365-a3617720.html",
      "priceStatus": "德国比价页按 HEAD article 313365 列出 2025/26 e.SLR + PR 11 GW 套装，2026-10-15 复核最低挂牌 EUR 349.90，Sport Robl 标注有货，另列 EUR 29.90 配送费；该报价本身对应 2026-09-13 的价格更新记录，价格和库存可能变化。按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 2,621.63，不含配送费，是欧洲零售参考而非中国售价。京东列表另有 313365+100911 雪板固定器组合的含雪鞋/配件套装线索，直达页不可读且无可核实的变体价和库存，不替代本款雪板+固定器价格；见 data/raw/skis/head/e-slr-2025-26.json。"
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
    "id": "01a13b73-1701-7cac-a5d1-1556b540a1c7",
    "slug": "head-easy-joy-2027",
    "title": "HEAD Easy Joy 2026/27（315656）",
    "model": "Easy Joy",
    "year": 2027,
    "oneLiner": "面向初学者的雪道女款双板，官方定位为低速、短弯和易控；价格为日本零售商折算人民币的缺货参考价。",
    "priceMin": 2531,
    "priceMax": 2531,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/86c567a2662c036ade53fedb38622997a57c6b048c93cc7e4b8ffc4e15a8f52a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "143 / 148 / 153 / 158 / 163 cm",
      "profile": "Allride Rocker；板头 rocker 20%、camber 80%、板尾 rocker 0%",
      "waistWidth": 70,
      "core": "Synthetic Core",
      "construction": "LYT Tech Construction；Power Fiber Jacket Construction",
      "turnRadiusReferenceLength": "163 cm",
      "terrain": "雪道",
      "skierLevel": "初学者",
      "bindingSetup": "含 JOY 9 GW SLR 固定器的系统套装；具体绑定配置按地区 SKU 核实",
      "geometryNotes": "HEAD 26/27 目录确认 article 315656 与 163 cm 参考规格；HEAD 官方俄语区商店商品货号 31565601、雪季 2026/27，并提供 143/148/153/158/163 cm 五档完整三围和半径。HEAD 加拿大国际 SKU 315656.SET 页面另直接确认 143 cm 几何。此前 31655507 候选货号不同，未用于本尺码表。此款不是 25/26 EASY JOY R 租赁款。",
      "weightBasis": "HEAD 官方页面默认选中 143 cm 时显示 1698 g，但未说明重量按单只还是一对计；本档案不录入重量。",
      "seasonEvidence": "HEAD 26/27 Hardgoods 目录及 HEAD 国际产品页确认 article 315656、2026/27 与产品定位。HEAD 官方俄语区商店列货号 31565601、2026/27、JOY 9 GW SLR 套装及五档规格；后缀与国际 article 同根，按地区商品记录保留 SKU 差异。旧候选货号 31655507 不用于匹配。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.head.com/en_GB/product/easy-joy-315656-set; https://head.ru/ski/shop/skis/8374/138146/; https://www.eski.sk/image/document/head-hardgoods-26-27-en.pdf",
      "articleNumber": "315656",
      "base": "UHM C Base",
      "speed": "低速",
      "turnShape": "短弯",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "日本 Tanabe Sports；以网站人民币界面显示的折算价记录，原报价 JPY 59,800",
      "priceSource": "https://tanabesports.net/index_zhcn_cny_456-457.html?keyword=head",
      "priceStatus": "日本零售商页面将促销挂牌价 JPY 59,800 折算显示为 CNY 2,531.04；查询时无库存，不含运费/进口税，非中国售价，页面汇率可能变化。"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "70mm"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "初学者"
      }
    ]
  },
  {
    "id": "01a12e89-598a-765a-bbf4-8d8223ebbc57",
    "slug": "head-shape-e-v5-2026",
    "title": "HEAD Shape e-V5 2025/26",
    "model": "Shape e-V5",
    "year": 2026,
    "oneLiner": "HEAD Shape 雪道系列型号，采用 74 mm 板腰与前摇设计，定位于雪道巡航与 carving。",
    "priceMin": 2480,
    "priceMax": 2480,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/f5cbbf386033670c136bfb69e5ae15d74a06c3733f117f6fd2ce9beaa4432093.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "bindingSetup": "PR 11 GW 系统固定器套装",
      "geometryNotes": "HEAD 25/26 手册按 315255 确认长度与 170 cm 参考几何；同货号零售规格列出五档半径，并复录五档相同 sidecut。重量未录入。",
      "weightBasis": "尚缺可核对的逐长度重量，不以同系列或其他年款推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "HEAD 官方 25/26 目录列明 Shape e.V5、SKU 315255 与板长；逐长度 radius 来源为同 SKU 25/26 商品资料，详见证据审计。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://head.ru/ski/shop/skis/discounts/CF854649-178B-30D5-CA92-E692F4F09C64/104214/；https://www.tanabesports.jp/ts/wp-content/uploads/2025/05/25-26_HEAD_user.pdf；https://preisvergleich.heise.de/head-shape-e-v5-performance-pr-11-gw-inkl-bindung-modell-2025-2026-315255-a3620573.html；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "日本 Tanabe Sports 中文商品页动态折算显示人民币，商品货号 315255",
      "priceSource": "https://tanabesports.net/goods_zhcn_cny_44295.html",
      "priceStatus": "2025/26 对应商品页显示促销价 JPY 58,700，并动态折算显示 CNY 2,480.43；页面列出 149/156/163/170 cm。该数为日本零售商折算参考价，不是中国国内售价；页面汇率可能变化，跨境运费、关税未计，且尺码即时库存需下单前核对。"
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
    "id": "01a12e89-5995-7eb6-887e-02601ef58abc",
    "slug": "head-shape-v2-2026",
    "title": "HEAD Shape V2 2025/26",
    "model": "Shape V2",
    "year": 2026,
    "oneLiner": "京东双板榜单中的热门入门全地域系列；套装评价仅作国内关注度参考。",
    "priceMin": 1880,
    "priceMax": 1880,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/0185f37d22e3339458b4af3de70a9dba07681a07646e6a3f28f8123ecf8320db.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "142 / 149 / 156 / 163 / 170 cm",
      "waistWidth": 70,
      "turnRadius": 12.5,
      "turnRadiusReferenceLength": "170 cm",
      "terrain": "全地域 / 雪道",
      "skierLevel": "入门至初中级",
      "bindingSetup": "雪板+固定器或套装，按具体 SKU 核对",
      "geometryNotes": "HEAD 25/26 手册按 315285 确认长度与 170 cm 参考几何；同货号零售规格列出六档半径，并复录六档相同 sidecut。重量未录入。",
      "weightBasis": "尚缺可核对的逐长度重量，不以同系列或其他年款推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "HEAD 官方 25/26 目录列明 Shape V2、SKU 315285 及长度；同 SKU 商品资料确认季节和参考几何。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://boutique.sommets.com/en/products/head-skis-shape-v2；https://www.tanabesports.jp/ts/wp-content/uploads/2025/05/25-26_HEAD_user.pdf；https://preisvergleich.heise.de/head-shape-v2-performance-pr-11-gw-inkl-bindung-modell-2025-2026-315285-a3620670.html；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "日本 Tanabe Sports 中文商品页动态折算显示人民币，商品货号 315285",
      "priceSource": "https://tanabesports.net/goods_zhcn_cny_45065.html",
      "priceStatus": "商品页显示促销价 JPY 44,500，并动态折算显示 CNY 1,880.39；页面标注 2026 款和 article 315285。此为日本零售商参考价，不是中国国内售价；页面汇率可能变化，跨境运费、关税未计；页面列有多个尺码但具体尺码库存需下单前确认。"
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
    "id": "01a12e89-59a1-7d9b-8c2f-30f290f5d81a",
    "slug": "head-shape-v2-r-2026",
    "title": "HEAD Shape V2 R 2025/26",
    "model": "Shape V2 R",
    "year": 2026,
    "oneLiner": "HEAD V-shape 入门全地域系列；国内平台存在板+固定器销售款。",
    "priceMin": 2229,
    "priceMax": 2229,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/717afc7206162d5bbed029bc241f5fc3b73f673a581466e6ed837172fe888e77.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "142 / 149 / 156 / 163 / 170 / 177 cm",
      "profile": "Allride Rocker",
      "waistWidth": 70,
      "core": "Synthetic Core",
      "turnRadius": 12.5,
      "construction": "LYT Tech Construction；Power Fiber Jacket Construction",
      "turnRadiusReferenceLength": "170 cm",
      "technologies": "ERA 3.0",
      "terrain": "全地域 / 雪道",
      "skierLevel": "入门至初中级",
      "bindingSetup": "HEAD 25/26 Workbook 对 316225 列 rental base 与 PR 11 GW（114517）；Trojan Sport 2026 套装页对应 316225#114517。另有零售商将 316225 配 PR 10 GW，按实际 SKU 核对，不能混作同一套装。",
      "geometryNotes": "HEAD 25/26 Hardgoods Workbook 对 article 316225 列出六个长度（142/149/156/163/170/177 cm）及 170 cm 参考几何 128-70-108 mm、12.5 m；同季 Rental Handbook 的租赁配置只列 142/149/156/163/170 cm 五个长度，并将 170 cm 半径记为 12.4 m。两份原厂资料的货品配置范围和半径存在差异，故保留六档目录选项与 12.5/12.4 m 冲突，不将 177 cm 默认为租赁配置可供长度。精确货号零售规格页另逐项列出 156 cm（128-70-108 mm、10.5 m）和 163 cm（128-70-108 mm、11.2 m），已补入这两行；该零售页未注明雪季。其它长度不外推，170 cm 采用官方 Hardgoods Workbook 数值并保留冲突说明。",
      "weightBasis": "尚缺可核对的逐长度重量，不以同系列或其他年款推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "HEAD Hardgoods Workbook 2025/26 列明 Shape V2 R article 316225、六个长度和参考几何。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.head.com/en_US/product/shape-v2-r-316225；https://www.skiandbikes.com/image/document/head_workbook_2526_en.pdf；https://www.grip-walk.com/faq/",
      "articleNumber": "316225",
      "base": "UHM C Base black",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Trojan Sport 波兰；HEAD Shape V2 R 316225 + PR 11 GW 114517，142 cm 变体",
      "priceSource": "https://trojansport.pl/narty-head-shape-v2-r-2026-pr-11-gw.html",
      "priceStatus": "Trojan Sport 页面当前将商品标为 HEAD Shape V2 R 2026 + PR 11 GW，商品 ID 316225#114517；选中 142 cm，含税挂牌 PLN 1,298.99，价史显示该价截至 2026-10-15 且页面标注库存余量少。按 ECB 2026-10-14 PLN/EUR 4.3658、EUR/CNY 7.4925 折算为 CNY 2,229.30，作为与 HEAD 目录 PR 11 配置相符的波兰地区套装参考；不是中国价或裸板价。Esqui Outlet 西班牙 316225 + PR 10 GW 114528 套装 EUR 279.99（CNY 2,097.83）及 Emmecisport EUR 299（CNY 2,240.26）仍留作不同绑定配置的地区旁证，不再作为本种子主价。Bottero Ski 对参考号 316225 252 的 Winter 2026 商品 EUR 190（CNY 1,423.58）明确缺货，仅作历史参考。所有地区价均不代表中国售价；跨境运费、进口税及配送限制另核。"
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
    "id": "01a12e89-59ad-784c-a7f9-d74c6ac520d4",
    "slug": "head-supershape-e-magnum-2026",
    "title": "HEAD Supershape e-Magnum 2025/26",
    "model": "Supershape e-Magnum",
    "year": 2026,
    "oneLiner": "HEAD Supershape 雪道系列，官方产品页列出 149–177 cm 多个板长。",
    "priceMin": 7355,
    "priceMax": 7355,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn-mdb.head.com/CDN3/D/313306.SET_31330602/5/683x911/supershape-e-magnum-with-binding-protector-evo-pr-11-gw.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "149 / 156 / 163 / 170 / 177 cm",
      "profile": "Speedrocker：板头 Rocker 6% / Camber 94% / 板尾 Rocker 0%（149 cm 页面展示）",
      "waistWidth": 72,
      "turnRadius": 13.1,
      "turnRadiusReferenceLength": "170 cm",
      "terrain": "雪道",
      "skierLevel": "进阶",
      "bindingSetup": "含 Protector EVO PR 11 GW 固定器套装",
      "geometryNotes": "部分长度已核对：只展示实际取得的默认长度几何和官方参考长度半径；其他可选板长的几何仍待取得，不表示完整尺码覆盖。",
      "weightBasis": "页面展示 Weight 数值，但未明确单只/一对及是否含固定器，本轮不映射为可比较重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "官方商品号 313306.SET 已核对，当前页面没有直接标注销售雪季；2025/26 待目录确认。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.head.com/en_US/product/supershape-e-magnum-313306-set；https://www.grip-walk.com/faq/"
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
    "id": "01a13b73-1708-797f-a2a7-d6aea8d62715",
    "slug": "head-supershape-e-magnum-2027",
    "title": "HEAD Supershape e-Magnum 2026/27（313306）",
    "model": "Supershape e-Magnum",
    "year": 2027,
    "oneLiner": "HEAD 官方将其定位为 Supershape 系列中适用范围广的雪道板，可在不同速度下滑短弯或长弯，并强调刃抓地与回弹。",
    "priceMin": 7355,
    "priceMax": 7355,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/dd28c8c9f6d45b9109e1958e2c85f19c9d98fe3bb86496ece69dddf7139c247f.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "149 / 156 / 163 / 170 / 177 cm",
      "profile": "Speedrocker：板头 Rocker 6% / Camber 94% / 板尾 Rocker 0%（HEAD 官方页选中 149 cm 时显示）",
      "waistWidth": 72,
      "turnRadius": 13.1,
      "turnRadiusReferenceLength": "170 cm",
      "technologies": "Crossforce Carbon（官方称其将力量传入板体结构）",
      "terrain": "雪道",
      "skierLevel": "进阶",
      "bindingSetup": "含 Protector EVO PR 11 GW 固定器套装",
      "geometryNotes": "26/27 HEAD Hardgoods 手册确认 article 313306、五个板长及 170 cm 参考几何；官方商品页按 313306.SET 展示 149 cm 规格。Sport Bittl 和 HEAD 合作商 VOSIsportSHOP 的 26/27 同货号页面给出五档逐码三围与半径。25/26 article 313305 与本档案分开，不混用。",
      "weightBasis": "页面展示 Weight 数值，但未明确单只/一对及是否含固定器，本轮不映射为可比较重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "HEAD 26/27 Hardgoods Workbook 列 Supershape e-Magnum article 313306；HEAD 当前商品页货号为 313306.SET，合作零售页明确标注 2026/27 且列出同货号。HEAD 25/26 Workbook 对应货号是 313305，原档案雪季错配已纠正。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.head.com/en_US/product/supershape-e-magnum-313306-set；https://www.grip-walk.com/faq/",
      "speed": "Fast",
      "turnShape": "Medium Radius",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "HEAD 美国官网挂牌参考",
      "priceSource": "https://www.head.com/en_US/product/supershape-e-magnum-313306-set",
      "priceStatus": "HEAD 美国官网按商品号 313306.SET 显示 USD 1,099.00，页面核对时已 Out of Stock；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 7,355.30。该页面当前含 PROTECTOR EVO PR 13 GW 与 PRD 12 GW 绑定选项，价格配置需按结账选择确认。雪季由 HEAD 26/27 手册货号及同货号合作商页面确认；美国参考价不是中国售价。"
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
    "id": "01a12e89-5968-7b59-b8d7-35aca2942af5",
    "slug": "head-e-sl-pro-2026",
    "title": "HEAD Worldcup Rebels e-SL Pro 2025/26（313235）",
    "model": "Worldcup Rebels e-SL Pro",
    "year": 2026,
    "oneLiner": "官方归类为雪道竞速小回转板，面向有经验滑手；绑定组合依具体套装。",
    "priceMin": 7529,
    "priceMax": 7529,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/884f4d90cb21ff8d61cb667a939a5d4514e7730b9f744f04c9564c079b4ccaeb.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "150 / 155 / 160 / 165 / 170 cm",
      "profile": "Rebel Camber：Camber 100%（150 cm 页面展示）",
      "terrain": "雪道 / 竞速 / 小回转",
      "skierLevel": "专家",
      "bindingSetup": "HEAD 25/26 目录列出 WCR 14 Short 板层与 Freeflex ST 16 套装配置；地区零售 SKU 可能搭配不同固定器，购买前按实际货号核对。",
      "geometryNotes": "HEAD 25/26 官方商品页按货号 31323506 明确列出五个长度的完整几何表；商品套装为 FF 11 GW，不能与 313235 的目录默认绑定表混为同一地区 SKU。",
      "weightBasis": "尚未找到该雪季精确货号的官方重量口径，本档案不记录重量。",
      "bindingCompatibility": "HEAD 俄罗斯地区 31323506 套装列出 FF 11 GW；其他市场 SKU 可能使用不同固定器，按实际配置核对靴底兼容性。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "HEAD 25/26 Hardgoods Workbook 对应 article 313235；HEAD 官方俄罗斯地区页明确标注 2025/2026、商品号 31323506 和 FF 11 GW 套装。313236 属于下一雪季，已另建档案。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://head.ru/ski/shop/skis/discounts/6265/104054/; https://www.eski.sk/image/document/head_workbook_2526_en.pdf; https://www.grip-walk.com/faq/",
      "articleNumber": "313235",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "HEAD 美国 2025/26 官方零售价格表（裸板；绑定栏为 ---）",
      "priceSource": "https://img1.wsimg.com/blobby/go/3c75046d-27b1-48f2-8c85-4fcee384abf2/downloads/383a3ba9-007e-442e-a92d-fdc0140aa976/HEAD_RETAIL%20PRICING_FOR%20PRINT_12.20_01%202_combi.pdf?ver=1744650386194",
      "priceStatus": "HEAD 美国 2025/26 官方零售表对 article 313235 列裸板 MSRP USD 1,125、MAP USD 999，折算 MSRP 为 CNY 7,529.31。HEAD 加拿大官方 313235 商品页另显示含 Freeflex 14 GW 的套装最终价 CAD 1,359（查询时缺货），按 ECB 2026-10-14 汇率折算 CNY 6,396.73；套装配置和地区不同，不与美国裸板价合并。两者均非中国售价，未计跨境运费、税费及进口成本。"
    },
    "highlights": [
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 竞速 / 小回转"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "专家"
      }
    ]
  },
  {
    "id": "01a13d55-1aec-7267-8041-283f3c890814",
    "slug": "head-e-sl-pro-2027",
    "title": "HEAD Worldcup Rebels e-SL Pro 2026/27（313236）",
    "model": "Worldcup Rebels e-SL Pro",
    "year": 2027,
    "oneLiner": "官方归类为雪道竞速小回转板，面向有经验滑手；绑定组合依具体套装核对。",
    "priceMin": 9815,
    "priceMax": 9815,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/7da8867585f1c79d05913186ca423f6e3858d9a656f2cc2f667ddd38d9992182.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "150 / 155 / 160 / 165 / 170 cm",
      "profile": "Rebel Camber；HEAD 官方页在选中 150 cm 时列出 camber 100%、tip rocker 0%、tail rocker 0%",
      "technologies": "Graphene；Titanal；EMC 电子减震系统",
      "terrain": "雪道 / 竞速 / 小回转",
      "skierLevel": "专家",
      "bindingSetup": "HEAD 官方商品页提供不含固定器选项，也可选配不同 Freeflex / Protector 固定器；核对实际结账 SKU。",
      "geometryNotes": "HEAD 官方 26/27 商品页确认货号 313236.SET、长度选项及 150 cm 默认规格，并提供 160 cm 参考半径。HEAD 俄罗斯官方零售页及 XSPO 的 26h-HEA313236 商品页均列出五档逐码几何；165/170 cm 半径采用多来源一致的 12.9/13.7 m。Ski Catalogue 对这两档分别列 12.8/13.6 m，冲突保留于原始证据。",
      "weightBasis": "官方商品页显示 2225 g，但页面读取到的重量长度与单只/一对口径不够清楚，本档案不映射为可比较重量。",
      "bindingCompatibility": "按实际所选固定器型号与雪靴底标准核对；系列可选绑定不等于所有版本通用 GripWalk。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。",
      "seasonEvidence": "HEAD 26/27 Hardgoods Workbook 将 article 313236 对应 WC Rebels e-SL Pro；官方 HEAD 商品页 SKU 为 313236.SET。25/26 使用 article 313235，另见 head-e-sl-pro-2026。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.head.com/product/worldcup-rebels-e-sl-pro-313236-set; https://www.eski.sk/image/document/head-hardgoods-26-27-en.pdf; https://www.grip-walk.com/faq/",
      "articleNumber": "313236.SET",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "HEAD 摩纳哥官方页面裸板起始挂牌价",
      "priceSource": "https://www.head.com/fr_MC/product/worldcup-rebels-e-sl-pro-313236-set",
      "priceStatus": "HEAD 官方摩纳哥页面按货号 313236.SET 列裸板起始价 EUR 1,310.00；不同固定器为加价选项。按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 9,815.18。摩纳哥地区参考，不是中国售价；页面价格和库存可能变化。"
    },
    "highlights": [
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 竞速 / 小回转"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "专家"
      }
    ]
  },
  {
    "id": "01a13d55-1af2-7810-ac40-7de3625ae202",
    "slug": "head-e-slr-2027",
    "title": "HEAD Worldcup Rebels e.SLR 2026/27（313366）",
    "model": "Worldcup Rebels e.SLR",
    "year": 2027,
    "oneLiner": "HEAD 新雪季雪道小回转板，适合有经验的滑手在整备雪道上练习快速、精准的刻滑弯。",
    "priceMin": 5470,
    "priceMax": 5470,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ae79059354523e684e724fade39b46aac05abd41fbf3f1dc979bd8b91672fd3c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "head",
      "name": "HEAD",
      "nameCn": "海德"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "149 / 156 / 163 / 170 cm",
      "profile": "Rebel Camber；HEAD 官方页在选中 149 cm 时列出 camber 100%、tip rocker 0%、tail rocker 0%",
      "waistWidth": 66,
      "core": "Full Woodcore",
      "turnRadius": 11.2,
      "construction": "Metal layers",
      "turnRadiusReferenceLength": "163 cm",
      "technologies": "Graphene；Titanal layers；EMC 电子减震系统",
      "terrain": "整备雪道",
      "skierLevel": "中级进阶至专家；HEAD 官方标注 Advanced",
      "bindingSetup": "HEAD 官方套装页提供 PR 11 GW 标准选项及 PROTECTOR EVO PR 11 GW 加价选项；下单前核对实际固定器和安装选项。",
      "geometryNotes": "HEAD 26/27 Workbook 确认 article 313366、四个长度、163 cm 参考几何和 PR 11 GW；HEAD 官方商品页直接显示 149 cm 的 123/66/107 mm、R9.2 及重量。Skitreff 精确 2026/27 套装页补充其余三档几何与半径。",
      "weightBasis": "HEAD 商品页选中 149 cm 时显示 1995 g，但未明确该重量是单只/一对及是否含固定器，因此暂不录为可比较重量。",
      "bindingCompatibility": "标准套装页列 PR 11 GW，HEAD 表示该固定器兼容 GripWalk；仍须按具体雪靴底标识及固定器型号核对，不把 GW 视为兼容所有徒步靴底。",
      "mountingNotes": "固定器安装和释放值应由专业店根据靴底长度、体重、年龄及能力设定并校验；下单前区分预装、未安装及保护型固定器选项。",
      "seasonEvidence": "HEAD 26/27 Hardgoods Workbook 将 article 313366 对应 Worldcup Rebels e.SLR；HEAD 25/26 的 313365 单独记录于 head-e-slr-2026，不跨季混用。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.head.com/en_SL/product/worldcup-rebels-e-slr-313366-set; https://www.eski.sk/image/document/head-hardgoods-26-27-en.pdf; https://www.grip-walk.com/faq/",
      "articleNumber": "313366.SET",
      "speed": "Fast",
      "turnShape": "Short Radius",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "HEAD 斯洛文尼亚官方商品页；Worldcup Rebels e.SLR 313366.SET，PR 11 GW 套装页面",
      "priceSource": "https://www.head.com/en_SL/product/worldcup-rebels-e-slr-313366-set",
      "priceStatus": "HEAD 斯洛文尼亚官方 313366.SET 页面列 EUR 730 final price，图片及选项对应 PR 11 GW 套装，PROTECTOR EVO PR 11 GW 需加 EUR 50。按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 5,469.53；官方区域参考，不是中国售价，价格、绑定选择及库存会变化。韩国 ONE8 同货号 313366 + PR 11 GW 页面另列 KRW 1,843,000（ECB 汇率折 CNY 9,227.07），但页面标记为新款预览/预约专用，未证明可立即下单，故只作韩国挂牌参考，不并入当前主价；详见 data/raw/skis/head/e-slr-313366-2026-27.json。"
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
        "value": "整备雪道"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级进阶至专家；HEAD 官方标注 Advanced"
      }
    ]
  },
  {
    "id": "01a12e89-59ba-7e9f-84b2-1e430c55b1b5",
    "slug": "nordica-enforcer-104-2027",
    "title": "Nordica Enforcer 104 2026/27",
    "model": "Enforcer 104",
    "year": 2027,
    "oneLiner": "26/27 Enforcer 系列最宽的全山地型号，面向粉雪与多变雪况；双层钛金属与 Pulse Core 提供稳定支撑。",
    "priceMin": 6023,
    "priceMax": 6023,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/f818c24c9eb4c0d51a0112bc9dad02c70ff6d55de688aca06f71ec686d424e99.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 173 / 179 / 185 / 191 cm",
      "profile": "All Mountain Rocker（板头、板尾摇臂）",
      "waistWidth": 104,
      "core": "Performance Wood + Pulse Core",
      "turnRadius": 17.5,
      "construction": "2 Ti Pulse Core；金属夹层与侧墙结构",
      "turnRadiusReferenceLength": "167 cm",
      "sidecutDimensions": "167 cm: 132.5-104-122.5 mm；191 cm: 137.5-104-127.5 mm（官方展示尺寸）；半径：167/17.5、173/18、179/18.5、185/19、191/19.5 m",
      "technologies": "True Tip；Unlocked Tail Shape",
      "terrain": "全山地 / 自由滑",
      "skierLevel": "进阶",
      "weightReferenceLength": "191 cm",
      "weightPerPair": 4660,
      "baseEdgeAngle": 0.9,
      "bindingSetup": "裸板，固定器另配",
      "sideEdgeAngle": 87.5,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方 Weight per pair：一对裸板重量；每个板长分别记录，不推算单只重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "官方页面标题明确标注 2026/27，逐长度数据于 2026-10-13 提取。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.nordica.com/usa/en/collection/men/skis/enforcer/enforcer-104-flat；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "美国 evo 零售挂牌价；非品牌 MSRP",
      "priceSource": "https://www.evo.com/collections/nordica-enforcer",
      "priceStatus": "evo Nordica Enforcer 商品列表列 2027 款 Enforcer 104，挂牌 USD 899.99；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 6,023.38。美国零售参考，不是品牌 MSRP 或中国售价；未计税费、运费及汇兑成本。"
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
    "id": "01a12e89-59c6-73aa-ad5c-1d1a848a1b0a",
    "slug": "nordica-enforcer-89-2027",
    "title": "Nordica Enforcer 89 2026/27",
    "model": "Enforcer 89",
    "year": 2027,
    "oneLiner": "26/27 Enforcer 系列偏雪道取向型号，双层钛金属与 Pulse Core 增强操控和稳定；官方提供 167–185 cm 四种长度。",
    "priceMin": 5019,
    "priceMax": 5019,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/516ce72ca37e65010611b78e06ff82863926fdfd6b55e934cdef4979d1194b7c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 173 / 179 / 185 cm",
      "profile": "All Mountain Rocker（板头、板尾摇臂）",
      "waistWidth": 89,
      "core": "Performance Wood + Pulse Core",
      "turnRadius": 16.5,
      "construction": "2 Ti Pulse Core；金属夹层与侧墙结构",
      "turnRadiusReferenceLength": "167 cm",
      "sidecutDimensions": "167 cm: 120-89-108 mm；185 cm: 124-89-112 mm（官方展示尺寸）；半径：167/16.5、173/17、179/17.5、185/18 m",
      "technologies": "True Tip；Unlocked Tail Shape",
      "terrain": "雪道 / 全山地",
      "skierLevel": "中级至进阶",
      "weightReferenceLength": "185 cm",
      "weightPerPair": 4120,
      "baseEdgeAngle": 0.9,
      "bindingSetup": "裸板，固定器另配",
      "sideEdgeAngle": 87.5,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方 Weight per pair：一对裸板重量；每个板长分别记录，不推算单只重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "官方页面标题明确标注 2026/27，逐长度数据于 2026-10-13 提取。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.nordica.com/usa/en/collection/men/skis/enforcer/enforcer-89-flat；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "美国 SkiEssentials 零售挂牌价；非品牌 MSRP",
      "priceSource": "https://www.skiessentials.com/products/2027-nordica-enforcer-89-skis-0a668400",
      "priceStatus": "SkiEssentials 页面列 2027 款、货号 0A668400，挂牌 USD 749.99；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,019.47。美国零售参考，不是品牌 MSRP 或中国售价；未计税费、运费及汇兑成本。"
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
    "id": "01a12e89-59d1-7358-8e54-3b0056161e5e",
    "slug": "nordica-enforcer-94-2027",
    "title": "Nordica Enforcer 94 2026/27",
    "model": "Enforcer 94",
    "year": 2027,
    "oneLiner": "26/27 全山地型号，双层钛金属与 Pulse 弹性芯增强稳定和减震；官方提供 167–185 cm 四种长度。",
    "priceMin": 5354,
    "priceMax": 5354,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/6458022cfd9079e1505bf507f45b388e85530ad3d39ba259732049706c531223.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 173 / 179 / 185 cm",
      "profile": "All Mountain Rocker（板头、板尾摇臂）",
      "waistWidth": 94,
      "core": "Performance Wood + Pulse Core",
      "turnRadius": 18,
      "construction": "2 Ti Pulse Core；金属夹层与侧墙结构",
      "turnRadiusReferenceLength": "185 cm",
      "sidecutDimensions": "167 cm: 125-94-113 mm；185 cm: 128.5-94-116.5 mm（官方页面展示尺寸）；半径：167/16.5、173/17、179/17.5、185/18 m",
      "technologies": "True Tip；Unlocked Tail Shape",
      "terrain": "雪道 / 全山地",
      "skierLevel": "进阶",
      "weightReferenceLength": "185 cm",
      "weightPerPair": 4260,
      "baseEdgeAngle": 0.9,
      "bindingSetup": "裸板，固定器另配",
      "sideEdgeAngle": 87.5,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方 Weight per pair：一对裸板重量；每个板长分别记录，不推算单只重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "官方页面标题明确标注 2026/27，逐长度数据于 2026-10-13 提取。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.nordica.com/usa/en/collection/men/skis/enforcer/enforcer-94-flat；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "美国 SkiEssentials 零售挂牌价；非品牌 MSRP",
      "priceSource": "https://www.skiessentials.com/products/2027-nordica-enforcer-94-skis-0a668300",
      "priceStatus": "SkiEssentials 页面列 2027 款、货号 0A668300，挂牌 USD 799.99；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,354.11。美国零售参考，不是品牌 MSRP 或中国售价；未计税费、运费及汇兑成本。"
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
        "value": "18m"
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
    "id": "01a12e89-59dc-7e27-95f8-91bc3dd99a6f",
    "slug": "nordica-enforcer-99-2027",
    "title": "Nordica Enforcer 99 2026/27",
    "model": "Enforcer 99",
    "year": 2027,
    "oneLiner": "26/27 全山地宽腰型号，双层钛金属与 Pulse Core 结构；官方列出 167–191 cm 五种长度。",
    "priceMin": 5689,
    "priceMax": 5689,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c1bba11f3a87281343fcc775b123740b1a1f1e126b25dc1fdaca23b2bbc7674b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 173 / 179 / 185 / 191 cm",
      "profile": "All Mountain Rocker（板头、板尾摇臂）",
      "waistWidth": 99,
      "core": "Performance Wood + Pulse Core",
      "turnRadius": 17,
      "construction": "2 Ti Pulse Core；金属夹层与侧墙结构",
      "turnRadiusReferenceLength": "167 cm",
      "sidecutDimensions": "167 cm: 129-99-117 mm；191 cm: 134-99-122 mm（官方展示尺寸）；半径：167/17、173/17.5、179/18、185/18.5、191/19 m",
      "technologies": "True Tip；Unlocked Tail Shape",
      "terrain": "全山地",
      "skierLevel": "进阶",
      "weightReferenceLength": "191 cm",
      "weightPerPair": 4540,
      "baseEdgeAngle": 0.9,
      "bindingSetup": "裸板，固定器另配",
      "sideEdgeAngle": 87.5,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方 Weight per pair：一对裸板重量；每个板长分别记录，不推算单只重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "官方页面标题明确标注 2026/27，逐长度数据于 2026-10-13 提取。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.nordica.com/usa/en/collection/men/skis/enforcer/enforcer-99-flat；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "美国 evo 零售挂牌价；非品牌 MSRP",
      "priceSource": "https://www.evo.com/collections/nordica-enforcer",
      "priceStatus": "evo Nordica Enforcer 商品列表列 2027 款 Enforcer 99，挂牌 USD 849.99；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,688.75。美国零售参考，不是品牌 MSRP 或中国售价；未计税费、运费及汇兑成本。"
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
    "id": "01a12e89-59e9-7ea5-ac69-d9b990dac8eb",
    "slug": "nordica-santa-ana-102-2027",
    "title": "Nordica Santa Ana 102 2026/27",
    "model": "Santa Ana 102",
    "year": 2027,
    "oneLiner": "26/27 Santa Ana 女性全山地宽板腰型号，采用 Terrain Specific Metal 与 Pulse Core；官方提供 155–179 cm 五种长度。",
    "priceMin": 6023,
    "priceMax": 6023,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1aa882f988529ce9ab67470601aad0af28ad6eeebd9bdb51833e18ea5987f63a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "155 / 161 / 167 / 173 / 179 cm",
      "profile": "All Mountain Rocker（板头、板尾摇臂）",
      "waistWidth": 102,
      "core": "Performance Wood + Pulse Core",
      "turnRadius": 16.5,
      "construction": "TSM Pulse Core；Terrain Specific Metal 金属层",
      "turnRadiusReferenceLength": "155 cm",
      "sidecutDimensions": "155 cm: 128-102-118 mm；179 cm: 133-102-123 mm（官方展示尺寸）；半径：155/16.5、161/17、167/17.5、173/18、179/18.5 m",
      "technologies": "True Tip",
      "terrain": "全山地 / 自由滑",
      "skierLevel": "中级至进阶",
      "weightReferenceLength": "179 cm",
      "weightPerPair": 4320,
      "baseEdgeAngle": 0.9,
      "bindingSetup": "裸板，固定器另配",
      "sideEdgeAngle": 87.5,
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方 Weight per pair：一对裸板重量；每个板长分别记录，不推算单只重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "官方页面标题明确标注 2026/27，逐长度数据于 2026-10-13 提取。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.nordica.com/canada/en/collection/women/skis/santa-ana/santa-ana-102；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "美国 SkiEssentials 零售挂牌价；非品牌 MSRP",
      "priceSource": "https://www.skiessentials.com/products/2026-nordica-santa-ana-102-women-s-skis-0a548500",
      "priceStatus": "SkiEssentials 页面列 2027 款、货号 0A548500，挂牌 USD 899.99；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 6,023.38。美国零售参考，不是品牌 MSRP 或中国售价；未计税费、运费及汇兑成本。"
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
    "id": "01a12e89-59f4-7e1f-b591-7fad46b7d83a",
    "slug": "nordica-unleashed-98-2027",
    "title": "Nordica Unleashed 98 2026/27",
    "model": "Unleashed 98",
    "year": 2027,
    "oneLiner": "Unleashed 自由滑全山地系列，Nordica 新季产品目录列有 98 与 98 CA 两种结构款。",
    "priceMin": 5019,
    "priceMax": 5019,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/efa874ef1411b6231151114832f87e43cf7e130ce6ca93a06ef4d9ef175515e4.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "156 / 162 / 168 / 174 / 180 / 186 cm",
      "waistWidth": 98,
      "terrain": "全山地 / 自由滑",
      "skierLevel": "中级至进阶",
      "bindingSetup": "裸板，固定器另配",
      "geometryNotes": "Nordica 26/27 目录按货号 0A669400001 列出六个长度的完整 sidecut 和半径。官网交互页面对 156/168/174/180/186 cm 显示 15.5/16.5/17/18/19 m，与目录 15.3/16.7/17.4/18.1/18.8 m 不同；表中采用同季目录逐码值并保留此冲突，详见原始证据。",
      "weightBasis": "官网只公开 156 cm 与 186 cm 的双只重量；其它长度重量待核，不按邻码推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "Nordica 官方产品页明确标注 Unleashed 98 2026/27，SKU 0A669400001；26/27 品牌目录按同一货号列出逐码几何。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.nordica.com/usa/en/collection/men/skis/unleashed/unleashed-98-2；https://www.skiandbikes.com/image/document/katalog_-_nordica_fw26.pdf；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "美国 evo 零售挂牌价；非品牌 MSRP",
      "priceSource": "https://www.evo.com/collections/nordica-skis",
      "priceStatus": "evo Nordica 商品列表列 2027 款 Unleashed 98，挂牌 USD 749.99；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,019.47。美国零售参考，不是品牌 MSRP 或中国售价；未计税费、运费及汇兑成本。"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "98mm"
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
    "id": "01a13d55-1af9-7864-97f0-524cc7b60c14",
    "slug": "nordica-unleashed-98-ca-2027",
    "title": "Nordica Unleashed 98 CA 2026/27",
    "model": "Unleashed 98 CA",
    "year": 2027,
    "oneLiner": "无金属夹层的全山地自由滑款；比 Unleashed 98 更轻、更柔和，官方强调树林、雪道与软雪中的灵活性。",
    "priceMin": 4350,
    "priceMax": 4350,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/8e5d34faa16f2f3cf582487a263174901bc73753db0886b2c3996c1f82c6b63a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nordica",
      "name": "Nordica",
      "nameCn": "诺帝卡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "156 / 162 / 168 / 174 / 180 / 186 cm",
      "profile": "Freeride Flow Shape",
      "waistWidth": 98,
      "turnRadius": 17.4,
      "construction": "Full Wood Core with Carbon Stringers；Lite Performance Wood + Carbon + Sidewall",
      "turnRadiusReferenceLength": "174 cm",
      "terrain": "全山地 / 自由滑 / 雪道、树林与软雪",
      "skierLevel": "官方等级图示覆盖 Beginner 至 Expert，未细分单一推荐水平",
      "baseEdgeAngle": 0.9,
      "bindingSetup": "裸板，固定器另配；Nordica 建议搭配 Marker Griffon 13，具体制动器宽度按实际固定器型号核对",
      "sideEdgeAngle": 87.5,
      "geometryNotes": "Nordica 26/27 目录将商品货号 0A6695 00 001 对应 Unleashed 98 CA，给出六个长度的逐码板型与半径。官方交互商品页及 Comor 商品表部分半径采用 15.5/16/16.5/17/18/19 m 的圆整值；此处采用当季目录的 15.3/16.0/16.7/17.4/18.1/18.8 m，并在原始审计中保留冲突。不要与带 Drift Lock Metal 的 Unleashed 98（货号 0A669400001）合并。",
      "weightBasis": "Comor 2027 商品表提供六个长度的双只重量；不是单只重量。156 cm 与 186 cm 数值可由 Nordica 官方产品页交叉确认。",
      "seasonEvidence": "Nordica 官方 2026/27 商品页标注 Unleashed 98 CA 与 SKU 0A669500001；26/27 官方目录将 article 0A6695 00 001 列为 Unleashed 98 CA flat。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.nordica.com/usa/en/collection/men/skis/unleashed/unleashed-98-ca-2; https://www.skiandbikes.com/image/document/katalog_-_nordica_fw26.pdf; https://www.grip-walk.com/faq/",
      "articleNumber": "0A669500001",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "SkiEssentials 美国零售页面；裸板挂牌价，SKU 0A669500",
      "priceSource": "https://hv2.skiessentials.com/products/2027-nordica-unleashed-98-ca-skis-0a669500",
      "priceStatus": "SkiEssentials 页面列 2027 款、SKU 0A669500、裸板价 USD 649.99；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 4,350.20。美国地区挂牌参考，不是中国售价或成交价，未计税费、运费及汇兑成本。"
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
        "value": "17.4m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑 / 雪道、树林与软雪"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "官方等级图示覆盖 Beginner 至 Expert，未细分单一推荐水平"
      }
    ]
  },
  {
    "id": "01a12e89-5a00-7f34-8fed-7b07abe51c48",
    "slug": "rossignol-experience-76-2026",
    "title": "Rossignol Experience 76 Xpress 2025/26",
    "model": "Experience 76 Xpress",
    "year": 2026,
    "oneLiner": "Rossignol 雪道与全山地入门型号，官网说明其侧重易操控 carving 和全雪场使用。",
    "priceMin": 3212,
    "priceMax": 3212,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/97ed0dd53fd1004cbb2e29463ed8fd1e8a44878a308371715eb65fd726160e43.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "bindingSetup": "裸板或可选 XPRESS 10 GW",
      "geometryNotes": "逐长度尺寸、半径及双只重量来自 Rossignol 官方产品页；产品页未标注销售雪季，25/26 归档依据及限制见 raw 证据。",
      "weightBasis": "官方产品页按 kg/pair 给出六个长度的整对雪板重量，逐码录入克数，没有折算成单只重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "官方 25/26 产品目录入口确认该季资料发布；RAMFT04000 规格与官方产品页对应，但产品页未直接标雪季，季节归属仍保留此限制。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.rossignol.com/us-en/experience-76-xpress-RAMFT04000152.html；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Rossignol 美国官网挂牌价（无固定器选项）",
      "priceSource": "https://www.rossignol.com/us-en/experience-76-xpress-RAMFT04000.html",
      "priceStatus": "美国官网当前页面列 USD 479.95，默认说明为无固定器；页面同时展示 XPRESS 10 GW B83 固定器选项并标示 included in price，实际配置以结账所选项为准。按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 3,212.17。产品页未直接标注雪季；美元价仅作美国市场参考，不是中国售价，美国税费及跨境费用未计。"
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
    "id": "01a12e89-5a0d-793b-a32a-f7e78b4db8c6",
    "slug": "rossignol-forza-40-ca-xpress-2027",
    "title": "Rossignol Forza 40° CA Xpress 2026/27",
    "model": "Forza 40° CA Xpress",
    "year": 2027,
    "oneLiner": "面向中级滑手的雪道 carving 型号，强调易上手的操控与刻滑体验。",
    "priceMin": 4046,
    "priceMax": 4046,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c592027a8ab4a2dee9b9eb99d67d615cd9a9c6f449fbace9c123250bffebeeec.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "150 / 157 / 164 / 171 / 179 cm",
      "waistWidth": 75,
      "core": "PEFC 认证杨木板芯",
      "turnRadius": 11,
      "construction": "Rectangular Full Sidewall",
      "turnRadiusReferenceLength": "157 cm",
      "technologies": "V-Profile；Carbon Beam",
      "terrain": "雪道 / carving",
      "skierLevel": "中级",
      "bindingSetup": "裸板，可选 XPRESS 11 GW 固定器",
      "geometryNotes": "完整逐长度几何来自对应官方 SKU。板长为 cm，板宽为 mm，半径为 m；规格表不代表当前库存。",
      "weightBasis": "Au Vieux Campeur 2027 页面列一对重量 3000–3500 g；商品为雪板 + XPRESS 11 GW 套装，但页面未说明重量是否含固定器。Rossignol 官方页同型号列 1.5–1.8 kg/pair，两组数据冲突；逐码表采用零售商明示的 pair 数值并标注口径待核，不作为裸板重量比较。",
      "bindingCompatibility": "可选 XPRESS 11 GW：成人 Alpine ISO 5355 A / GripWalk ISO 23223 A，BSL 260–385 mm。要求 XPRESS 系统；不能套用 KONECT 的调节范围。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Rossignol 德国官方商品页标注 NEUE KOLLEKTION FW2627，SKU RAPPX05000；档案 2026/27 年份获品牌页面确认。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.rossignol.com/ca-en/mens-forza-40-ca-xpress-piste-skis-RAPPX05000.html；https://www.rossignol.com/cz-en/mens-forza-40-ca-xpress-piste-skis-RAPPX05000150.html；https://www.rossignol.com/kr-ko/mens-forza-40-ca-xpress-piste-skis-RAPPX05000157.html；https://www.rossignol.com/de-de/herren-pisten-ski-forza-40%C2%B0-ca-xpress-RAPPX05000164.html；https://www.rossignol.com/ch-de/herren-pisten-ski-forza-40%C2%B0-ca-xpress-RAPPX05000171.html；https://www.rossignol.com/hr-en/mens-forza-40-ca-xpress-piste-skis-RAPPX05000179.html；https://www.auvieuxcampeur.fr/ski-piste-forza-40-ca-xpress-11gw-b83-blac-1.html；https://www.grip-walk.com/faq/",
      "officialPrice": "EUR 540.00",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Rossignol 德国官网裸板挂牌价",
      "priceSource": "https://www.rossignol.com/de-de/herren-pisten-ski-forza-40%C2%B0-ca-xpress-RAPPX05000.html",
      "priceStatus": "德国官方页面列 EUR 540.00，并注明不含固定器；按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 4,045.95。仅为德国官网参考，不是中国售价；未计跨境配送、进口及支付汇兑费用。"
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
    "id": "01a12e89-5a18-7114-abdc-df6a6e329ed5",
    "slug": "rossignol-forza-50-cam-2026",
    "title": "Rossignol Forza 50° CAM KONECT 2025/26",
    "model": "Forza 50° CAM KONECT",
    "year": 2026,
    "oneLiner": "面向中级滑手的雪道 carving 系列，官网标注多种板长与可选固定器。",
    "priceMin": 6023,
    "priceMax": 6023,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b58688ad4fff8b5a9afdb5e8a94cf78e1f49f5b67be88f167f55eb320bc79a04.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "150 / 157 / 164 / 171 / 179 cm",
      "profile": "Tip Rocker + 传统 Camber",
      "waistWidth": 75,
      "core": "PEFC 认证杨木板芯",
      "turnRadius": 12,
      "construction": "Rectangular Full Sidewall",
      "turnRadiusReferenceLength": "164 cm",
      "technologies": "V-Profile；Carbon Alloy Matrix；Mini Cap；Premium Hardtop；Sintered HD Base",
      "terrain": "雪道 / carving",
      "skierLevel": "中级",
      "weightReferenceLength": "171 cm",
      "weightPerPair": 2900,
      "bindingSetup": "裸板或可选 NX 12 KONECT GW",
      "geometryNotes": "完整逐长度几何来自对应官方 SKU。板长为 cm，板宽为 mm，半径为 m；规格表不代表当前库存。",
      "weightBasis": "逐码重量采用 Rossignol 25/26 原厂目录对 RAOPX01 明确列出的 kg/pair without bindings；美国官网约 1.5–1.8 kg 数值与澳大利亚官方页明确的 1/2 pair、Sporting Life 的 per ski 标注吻合，判断为官网逐码表的单位标签错误。重量指一对裸板，不含固定器；不与 26/27 含固定器套装重量混用。官网标签仍待品牌修正。",
      "bindingCompatibility": "可选 NX 12 KONECT GW B80：官方支持成人 Alpine ISO 5355 A / GripWalk ISO 23223 靴底，BSL 260–375 mm。仅适用于此固定器选项，无固定器版本需另核对。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "官方 25/26 目录列 Forza 50° CAM、型号代码 RAOPX01，规格与 RAOPX01000 页面逐码对应；Rossignol 日本发布的 26/27 目录公告及斯洛伐克官方店 26/27 列表又确认该型号延续销售。美国商品页 SKU 为 RAOPX01000，本档保留 25/26 起始归档标签并注明 26/27 carry-over，不据此拆成重复商品。",
      "sourceCheckedAt": "2026-10-16",
      "compatibilitySources": "https://www.rossignol.com/us-en/rossignol-forza-50-cam-skis-konect-RAOPX01000.html；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 899.95",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Rossignol 美国官网裸板挂牌价",
      "priceSource": "https://www.rossignol.com/us-en/rossignol-forza-50-cam-skis-konect-RAOPX01000.html",
      "priceStatus": "美国官方 RAOPX01000 商品页挂牌 USD 899.95，默认显示无固定器，并提供 NX 12 KONECT GW 固定器选项；页面未标雪季，因此此价格不作为 2025/26 年款的直接佐证。按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 6,023.11。美国官网参考，不是中国售价；税费、跨境运输和进口费用未计。"
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
    "id": "01a12e89-5a24-79bb-b944-f72129175ac6",
    "slug": "rossignol-forza-60-ti-2027",
    "title": "Rossignol Forza 60° TI KONECT 2026/27",
    "model": "Forza 60° TI KONECT",
    "year": 2027,
    "oneLiner": "Forza 雪道 carving 系列高阶款；Rossignol 斯洛伐克官方商城列为 2026/27 款。",
    "priceMin": 6692,
    "priceMax": 6692,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/187e02e3a4b8dd5e726fabe68eb804a3753e3f7469af3b2609c6f7a7bb746077.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "156 / 164 / 171 / 179 cm",
      "profile": "Tip Rocker；传统 Camber",
      "waistWidth": 75,
      "core": "PEFC 杨木木芯",
      "turnRadius": 11,
      "construction": "Rectangular Full Sidewall",
      "turnRadiusReferenceLength": "156 cm",
      "sidecutDimensions": "156 cm: 130-75-112 mm / 11 m；164 cm: 130-75-112 mm / 12 m；171 cm: 130-75-112 mm / 13 m；179 cm: 130-75-112 mm / 14 m",
      "technologies": "V-Profile；Titanal Beam；Carbon Alloy Matrix；Reinforced Torsion Tip Technology；V-A-S；Sintered HD Base；Premium Hardtop；Oversized Sidecut",
      "terrain": "雪道 / carving",
      "skierLevel": "进阶至专家",
      "bindingSetup": "KONECT 系统板；商品页可选无固定器或 SPX 12 KONECT 固定器",
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。",
      "weightBasis": "官方重量字段的单位或配置口径尚需确认，本轮不填逐长度重量。",
      "bindingCompatibility": "官方可选 SPX 12 KONECT GW B80：成人 Alpine ISO 5355 A / GripWalk ISO 23223 A，BSL 260–375 mm。仅适用于该固定器选项；选择无固定器版本时需另核对实际配置。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Rossignol 斯洛伐克官方商城将 Forza 60' TI KONECT + NX 12 KONECT GW（型号族 RAOPS01）列为 Model 26/27；种子厂商货号 RAOPS01000 与该型号族前缀对应。故归档为 2026/27。美国官方单品页仍未直接注明雪季；SkiEssentials 2027 延续款测试及两家同型号零售页另作交叉核对。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.rossignol.com/us-en/rossignol-forza-60-ti-skis-konect-RAOPS01000.html；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 999.95",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Rossignol 美国官网无固定器选项挂牌价",
      "priceSource": "https://www.rossignol.com/us-en/rossignol-forza-60-ti-skis-konect-RAOPS01000.html",
      "priceStatus": "美国官网 RAOPS01000 无固定器选项 USD 999.95，按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 6,692.39；另有 Rossignol 斯洛伐克官方商城 26/27 含 NX 12 固定器套装 EUR 760，折算 CNY 5,694.30。两者配置不同，均为境外官网参考价，不是中国售价；税费口径、跨境运费与进口成本另核。雪季已由品牌区域商城同型号 26/27 条目确认。"
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
        "value": "进阶至专家"
      }
    ]
  },
  {
    "id": "01a12e89-5a2f-7d1f-914c-8cb1898c09d9",
    "slug": "rossignol-hero-elite-lt-ti-2027",
    "title": "Rossignol Hero Elite LT TI 2026/27",
    "model": "Hero Elite LT TI",
    "year": 2027,
    "oneLiner": "官方定位为高速长弧雪道竞速风格板，面向技术型滑手。",
    "priceMin": 9035,
    "priceMax": 9035,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/f95f17368ab7bc0811b23a24c7d76e853df71442d47e0b0adac41e01ea4b163b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "167 / 172 / 177 / 182 cm",
      "profile": "Tip Rocker + 传统 Camber",
      "waistWidth": 71,
      "core": "PEFC 认证山毛榉木板芯",
      "turnRadius": 16,
      "construction": "Rectangular Full Sidewall；Full Titanal Layer",
      "turnRadiusReferenceLength": "172 cm",
      "technologies": "Power Tip；Predictive Sidecut；LCT；V-Profile；Sintered HD Base；Premium Hardtop",
      "terrain": "雪道 / 长弧 carving",
      "skierLevel": "进阶至专家",
      "bindingSetup": "裸板或可选 SPX 14 KONECT GW",
      "geometryNotes": "完整逐长度几何来自对应官方 SKU。板长为 cm，板宽为 mm，半径为 m；规格表不代表当前库存。",
      "weightBasis": "官方列名为 kg/pair，但具体配置口径仍待确认；本轮保留来源中的数值，不折算为单只或套装重量。",
      "bindingCompatibility": "可选 SPX 14 KONECT GW B80：成人 Alpine ISO 5355 A / GripWalk ISO 23223 A，BSL 260–375 mm。仅适用于此固定器选项；系统板不能任意替换为其他轨道固定器。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "官方 RAPSE01000 页面明确标注 NEW COLLECTION FW2627。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.rossignol.com/us-en/hero-elite-lt-ti-alpine-skis-RAPSE01000.html；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 1349.95",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Rossignol 美国官网系统雪板挂牌价",
      "priceSource": "https://www.rossignol.com/us-en/hero-elite-lt-ti-alpine-skis-RAPSE01000.html",
      "priceStatus": "Rossignol 美国官网列示 FW2627、货号 RAPSE01000，挂牌 USD 1,349.95；页面称 System Ski 并提供 SPX 14 KONECT GW 固定器选项，按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 9,034.84。美国官网参考价，不是中国售价；税费、跨境运输与进口费用未计。"
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
        "value": "进阶至专家"
      }
    ]
  },
  {
    "id": "01a12e89-5a3a-7b12-aec0-53fda3214635",
    "slug": "rossignol-hero-master-lt-r22-2027",
    "title": "Rossignol Hero Master LT R22 2026/27",
    "model": "Hero Master LT R22",
    "year": 2027,
    "oneLiner": "Hero 系列竞技取向长弧雪道板，2026/27 官方产品目录在售。",
    "priceMin": 9570,
    "priceMax": 9570,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/06e412fd386ed484f416741845004db744130b301de6f1a752ca50b3483fc598.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "169 / 173 / 179 / 183 cm",
      "profile": "Full Camber",
      "core": "PEFC 认证山毛榉木板芯",
      "construction": "Rectangular Full Sidewall；Full Titanal Layer",
      "technologies": "LCT；Cascade Tip；Oversized Sidecut；Sintered UHD Base",
      "terrain": "雪道 / 竞速 / 长弧",
      "skierLevel": "专家",
      "bindingSetup": "R22 系统板，固定器依套装配置",
      "geometryNotes": "完整逐长度几何来自对应官方 SKU。板长为 cm，板宽为 mm，半径为 m；规格表不代表当前库存。",
      "weightBasis": "官方列名为 kg/pair，但具体配置口径仍待确认；本轮保留来源中的数值，不折算为单只或套装重量。",
      "bindingCompatibility": "官方可选 SPX 14 ROCKERACE GW / SPX 15 ROCKERACE GW MASTER，要求 R22 板层；支持成人 Alpine ISO 5355 A / GripWalk ISO 23223 A。不能把 KONECT 或 XPRESS 当作 R22 的通用替代。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "官方 RAPHE01000 页面明确标注 NEW COLLECTION FW2627。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.rossignol.com/se-en/hero-master-lt-r22-alpine-skis-RAPHE01000.html；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 1429.95",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Rossignol 美国官网裸板挂牌价",
      "priceSource": "https://www.rossignol.com/us-en/hero-master-lt-r22-alpine-skis-RAPHE01000.html",
      "priceStatus": "Rossignol 美国官网列示 FW2627、货号 RAPHE01000，裸板 USD 1,429.95（页面注明不参加网站促销）；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 9,570.25。美国官网折算参考，不是中国售价；未计美国税费、跨境运输、进口费用及支付汇兑成本。"
    },
    "highlights": [
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "雪道 / 竞速 / 长弧"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "专家"
      }
    ]
  },
  {
    "id": "01a12e89-5a46-76cc-a39a-df810718ff61",
    "slug": "rossignol-soul-102-2027",
    "title": "Rossignol Soul 102 2026/27",
    "model": "Soul 102",
    "year": 2027,
    "oneLiner": "2026/27 全山地自由滑雪板，172 cm 板腰 102 mm，采用渐进式板型与 Tip & Tail Rocker。",
    "priceMin": 5354,
    "priceMax": 5354,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/4305639f81773ce13bffd8921c689aed154bb92ea82a83fe5f3738cfe61ffa98.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "rossignol",
      "name": "Rossignol",
      "nameCn": "金鸡"
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "156 / 164 / 172 / 180 / 188 cm",
      "profile": "Tip & Tail Rocker",
      "waistWidth": 102,
      "core": "PEFC 杨木木芯；LCT 木芯结构",
      "turnRadius": 16,
      "construction": "Rectangular Full Sidewall",
      "turnRadiusReferenceLength": "172 cm",
      "sidecutDimensions": "156 cm: 135-100-125 mm / 14 m；164 cm: 135-101-125 mm / 15 m；172 cm: 135-102-125 mm / 16 m；180 cm: 135-102-125 mm / 17 m；188 cm: 135-104-125 mm / 18 m",
      "technologies": "Air Tip；Titanal Beam；V-A-S；LCT；Progressive Sidecut；Sintered HD Base",
      "terrain": "全山地 / 自由滑 / 粉雪",
      "skierLevel": "进阶至专家",
      "bindingSetup": "裸板，不含固定器",
      "geometryNotes": "已整理官方逐长度参数；板头、板腰、板尾为 mm，半径为 m，板长为 cm。档案顶部标量只代表参考长度，不能套用到其他板长。 板腰随板长变化，官方历史规格包含 156/188 cm，当前美国页面仅列 164/172/180 cm；规格不代表库存。",
      "weightBasis": "Rossignol 精确货号 RAPMR03000 的西班牙、捷克官方逐码页把 1.75–2.2 kg 标为 kg/pair，但奥地利官方页又写 180 cm 为 2.05 kg/半双；REI 同季商品页明示 180 cm 每双约 4.30 kg。单位和数值仍不完全一致，且第三方目录未能确认与本 SKU 的对应关系，因此暂不填逐码重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "官方页面标注 NEW COLLECTION FW2627。",
      "sourceCheckedAt": "2026-10-13",
      "compatibilitySources": "https://www.rossignol.com/us-en/soul-102-alpine-skis-RAPMR03000.html；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 799.95",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Rossignol 美国官网裸板挂牌价",
      "priceSource": "https://www.rossignol.com/us-en/soul-102-alpine-skis-RAPMR03000.html",
      "priceStatus": "Rossignol 美国官网列示 FW2627、货号 RAPMR03000，裸板 USD 799.95（页面注明不参加网站促销）；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,353.84。加拿大官网同货号裸板列价 CAD 899.95，按 EUR/CAD 1.5918、EUR/CNY 7.4925 折算 CNY 4,236.01，作为加拿大地区交叉参考。两地折算均非中国售价；未计当地税费、跨境运输、进口费用及支付汇兑成本，尺码选项不代表库存或结账可售。"
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
        "value": "16m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑 / 粉雪"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "进阶至专家"
      }
    ]
  },
  {
    "id": "01a12e89-5a52-7cf7-a92b-2564e57321b8",
    "slug": "salomon-mtn-86-carbon-2027",
    "title": "Salomon MTN 86 Carbon 2026/27",
    "model": "MTN 86 Carbon",
    "year": 2027,
    "oneLiner": "Salomon 官方雪板目录中的轻量化巡游系列，定位与固定器需按具体组合确认。",
    "priceMin": 5019,
    "priceMax": 5019,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/426c17a9de39ebe5c173f59c08ece1067f49e2c487b454533e26a16e1ea7ed1d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "148 / 156 / 164 / 172 / 180 cm",
      "waistWidth": 86,
      "turnRadius": 17,
      "turnRadiusReferenceLength": "148 cm",
      "terrain": "巡游 / 全山地",
      "skierLevel": "中级至进阶",
      "bindingSetup": "裸板，固定器另配",
      "geometryNotes": "Salomon 26/27 目录的完整五码含板头/腰/尾、半径、midsole 与每只重量；官网对应 L47824000+ SKU 页面复核板长和板型。",
      "weightBasis": "官网净重为双只总重；Salomon 26/27 目录另列每只重量。sizeSpecs 按双只口径记录，逐只值仅用于交叉核对。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "26/27 目录列出 MTN 86 Carbon 及 L47824000+ 货号；Salomon 官网同货号商品页列出相同五个板长。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.salomon.com/en-us/product/mtn-86-carbon-li8310；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 749.95",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Salomon 美国官网裸板挂牌价",
      "priceSource": "https://www.salomon.com/en-us/product/mtn-86-carbon-li8310",
      "priceStatus": "Salomon 美国官网当前页面按货号 L47824000+ 列 USD 749.95，内容为 skis only；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,019.21。页面未直接标季，26/27 年份依据独立目录与同货号核对；美国参考价，不是中国售价，税费及跨境费用未计。"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "86mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "17m"
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
    "id": "01a12e89-5a5e-7570-938f-fdfec8bbec1f",
    "slug": "salomon-qst-100-2027",
    "title": "Salomon QST 100 2026/27",
    "model": "QST 100",
    "year": 2027,
    "oneLiner": "QST 系列全山地自由滑型号，100 mm 板腰兼顾雪道巡航与软雪探索。",
    "priceMin": 5019,
    "priceMax": 5019,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/7ac868c7147c44605208788738da8b6d76bed015d3e7adb8067910a146c0aaab.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "148 / 156 / 164 / 172 / 180 / 188 cm",
      "profile": "Freeride Profile；Rocker-Camber-Rocker",
      "waistWidth": 100,
      "core": "全杨木木芯",
      "turnRadius": 16.5,
      "construction": "Full Sandwich Sidewalls；Ti Binding Reinforcement",
      "turnRadiusReferenceLength": "172 cm",
      "sidecutDimensions": "148 cm: 130-100-118 mm / 13.5 m；156 cm: 131-100-119 mm / 14.5 m；164 cm: 132-100-120 mm / 15.5 m；172 cm: 133-100-121 mm / 16.5 m；180 cm: 134-100-122 mm / 17.5 m；188 cm: 135-100-123 mm / 18.5 m",
      "technologies": "Cork Damplifier；Basalt Superlight Fibers；Fiberglass",
      "terrain": "全山地 / 自由滑 / 粉雪",
      "weightPerSki": 1780,
      "skierLevel": "中级至进阶",
      "weightReferenceLength": "172 cm",
      "bindingSetup": "裸板，不含固定器",
      "geometryNotes": "六个长度的板头/腰/尾宽与半径由 Salomon 官网逐长度表核对；26/27 目录为 156–188 cm 补充 midsole 和单只重量。",
      "weightBasis": "官网提供六个长度的净重（按双只记录），26/27 目录另提供 156–188 cm 每只重量且明确不含固定器；148 cm 不补推目录单只重量。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "Salomon 26/27 目录列明 QST 100 BLACK、货号 L49189200+ 与五个长度；官网同货号页面给出六个长度的完整几何和双只净重。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.salomon.com/en-us/product/qst-100-black-li9359；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 749.95",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Salomon 美国官网裸板挂牌价",
      "priceSource": "https://www.salomon.com/en-us/product/qst-100-black-li9359",
      "priceStatus": "Salomon 美国官网当前页面按货号 L49189200+ 列 USD 749.95，内容为 skis only；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,019.21。页面未直接标季，26/27 年份按 Salomon 官方目录和同货号核对；美国参考价，不是中国售价，税费及跨境费用未计。"
    },
    "highlights": [
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "100mm"
      },
      {
        "key": "turnRadius",
        "label": "转弯半径",
        "value": "16.5m"
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
    "id": "01a12e89-5a69-70c5-b6fe-e051afd7d3ea",
    "slug": "salomon-qst-106-2027",
    "title": "Salomon QST 106 2026/27",
    "model": "QST 106",
    "year": 2027,
    "oneLiner": "QST 系列宽板腰 freeride 型号，106 mm 板腰；173 cm 单支重量 1800 g。",
    "priceMin": 5688,
    "priceMax": 5688,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/60e833241b9587ce6c742f460a858934b6fb82ea919d9ac7ceda521ccd2aba74.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "157 / 165 / 173 / 181 / 189 cm",
      "profile": "Rocker-Camber-Rocker（Freeride Profile）",
      "waistWidth": 106,
      "core": "全杨木木芯",
      "turnRadius": 18.5,
      "construction": "Full Sandwich Sidewalls；Ti Binding Reinforcement",
      "turnRadiusReferenceLength": "173 cm",
      "sidecutDimensions": "157 cm: 136-106-123 mm / 16.5 m；165 cm: 137-106-124 mm / 17.5 m；173 cm: 138-106-125 mm / 18.5 m；181 cm: 139-106-126 mm / 19.5 m；189 cm: 140-106-127 mm / 20.5 m",
      "technologies": "Cork Damplifier；Basalt Superlight Fibers；Fiberglass",
      "terrain": "自由滑 / 粉雪",
      "weightPerSki": 1800,
      "skierLevel": "进阶",
      "weightReferenceLength": "173 cm",
      "bindingSetup": "裸板，不含固定器",
      "geometryNotes": "各长度板头/腰/尾宽、侧切半径、重量和 MIDSOLE 均来自对应 26/27 目录，详见 raw 证据；没有跨尺寸插值。",
      "weightBasis": "26/27 Salomon 目录逐长度列出单只裸板重量（未含固定器），表内每个长度独立录入。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "2026/27 官方 Salomon 目录列明产品名、货号 L47774500+ 和完整长度表；官方产品页确认对应 SKU 与尺寸。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.salomon.com/en-us/product/qst-106-almond-milk-li8133；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 849.95",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Salomon 美国官网裸板挂牌价",
      "priceSource": "https://www.salomon.com/en-us/product/qst-106-almond-milk-li8133",
      "priceStatus": "Salomon 美国官网当前页面按货号 L47774500+ 列 USD 849.95，内容为 skis only；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,688.48。日本 26/27 季节目录列税入 JPY 132,000（折合 CNY 5,575.34）；有贺园零售页对精确货号列含税 JPY 112,200（折合 CNY 4,739.04），但页面的销售结束提示与购买控件/尺码状态不一致，仅作零售挂牌快照。各价格是不同地区参考，不是中国售价；税费口径与库存按各来源说明，跨境配送和进口费用未计。"
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
        "value": "18.5m"
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
    "id": "01a12e89-5a75-7c97-af4f-f5b897c19652",
    "slug": "salomon-qst-92-2024",
    "title": "Salomon QST 92 2023/24",
    "model": "QST 92",
    "year": 2024,
    "oneLiner": "92 mm 板腰的全山地自由滑雪板；此档案记录 2023/24 旧款，不代表后续 QST 92 或 QST 94。",
    "priceMin": 2530,
    "priceMax": 2530,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/108d820dfaa9bdc4f1c71b035cf580763d58c8c895a4cb3cceee5e8305bca8b9.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "160 / 168 / 176 / 184 cm",
      "profile": "Rocker-Camber-Rocker（Freeride Profile）",
      "waistWidth": 92,
      "core": "全杨木木芯",
      "turnRadius": 14,
      "construction": "Full Sandwich Sidewalls；Ti Binding Reinforcement",
      "turnRadiusReferenceLength": "168 cm",
      "technologies": "C/FX；Double Sidewalls",
      "terrain": "全山地 / 自由滑",
      "weightPerSki": 1680,
      "skierLevel": "中级",
      "weightReferenceLength": "168 cm",
      "bindingSetup": "裸板，不含固定器",
      "geometryNotes": "货号 L47232400+ 的 2023/24 目录逐尺码表列出四个长度的板头/腰/尾宽、半径和单只重量。该旧货号不可用于证明 2026/27 年款；后续 QST 92/94 应按其自身 SKU 和雪季区分。",
      "weightBasis": "Salomon 编制的 2023/24 日本规格目录按每只雪板列重；数据仅适用于表内对应长度，不含固定器。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "Salomon 编制的 2023/24 日本雪板规格目录以货号 L47232400+ 列出 QST 92 与四个长度。Salomon 当前官方产品页仍显示相同货号，但没有单独标注雪季；本档案按同货号 2023/24 目录归档，不标为 2026/27。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.salomon.com/en-gb/product/qst-92-li4911/L47232400%2B；https://www.grip-walk.com/faq/",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Alpen 日本零售页；2023/24、176 cm 单板",
      "priceSource": "https://store.alpen-group.jp/Form/Product/ProductDetail.aspx?bid=0247&pid=5031102414-0001&shop=0",
      "priceStatus": "Alpen 页面标题标注 23/24 QST 92，制造商货号 L47232400，176 cm 选项挂牌 JPY 59,900（页面同时列制造商建议价 JPY 93,500），且为单板不含固定器；页面说明库存与实体店共享，下单后仍可能取消。按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 2,530.02。仅是日本商家单一长度的旧款挂牌参考，不代表中国售价或稳定库存；Salomon 官方页当前标记该商品不在官网销售。"
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
        "value": "14m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级"
      }
    ]
  },
  {
    "id": "01a12e89-5a7f-770e-91cf-b3579a87be4e",
    "slug": "salomon-qst-94-2027",
    "title": "Salomon QST 94 2026/27",
    "model": "QST 94",
    "year": 2027,
    "oneLiner": "新一代 QST 全山地自由滑雪板，94 mm 板腰兼顾雪道抓边与软雪浮力。",
    "priceMin": 5019,
    "priceMax": 5019,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/4301a90c8e4928c62cc826506a03186ee61d3fb642477ada7a3eb71f61ad5d9c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "156 / 164 / 172 / 180 / 188 cm",
      "profile": "Freeride Profile",
      "waistWidth": 94,
      "core": "全杨木木芯",
      "turnRadius": 15.5,
      "construction": "Full Sandwich Sidewalls；Ti Binding Reinforcement",
      "turnRadiusReferenceLength": "172 cm",
      "sidecutDimensions": "156 cm: 131-94-117 mm / 13.5 m；164 cm: 132-94-118 mm / 14.5 m；172 cm: 133-94-119 mm / 15.5 m；180 cm: 134-94-120 mm / 16.5 m；188 cm: 135-94-121 mm / 17.5 m",
      "technologies": "Cork Damplifier；Basalt Superlight Fibers；Fiberglass",
      "terrain": "全山地 / 自由滑",
      "weightPerSki": 1700,
      "skierLevel": "中级（Salomon 美国官网）；德国官网标注进阶，官方地区页面等级不一致。",
      "weightReferenceLength": "172 cm",
      "bindingSetup": "裸板，不含固定器",
      "geometryNotes": "板头/腰/板尾、半径、鞋底下有效长度及整双净重均来自 Salomon 德国官网按货号 L49189300+ 的逐码表；Tanabe 2026/27 试乘页将该型号置于 25/26 延续款部分，且 188 cm 单只重量疑似异常，未用于种子。",
      "weightBasis": "Salomon 德国官网逐码净重表按整双裸板给出 3040/3200/3400/3620/3880 g，已映射为 weightPerPair；Tanabe 对 156/172 cm 分别列单只 1520/1700 g，交叉确认口径。Tanabe 对 188 cm 的单只重量 2940 g 与官方整双 3880 g 不相容，明确排除该零售值。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "Salomon 美国/德国官方商品页以货号 L49189300+ 提供当前 QST 94 Lilac 款及完整尺码，但未直接标雪季。Tanabe 的 2026/27 试乘报告将 QST 94 列于“25/26 延续款”；SkiEssentials、Sporting Life 与 Snow-How 的精确型号/货号商品页标为 2027 或 2026/27。综合归档为 2026/27 延续款，并保留官方页未注明雪季、试乘页沿用旧季标签的边界。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.salomon.com/en-us/product/qst-94-lilac-li9360；https://www.grip-walk.com/faq/",
      "articleNumber": "L49189300+",
      "officialPrice": "USD 749.95",
      "priceCheckedAt": "2026-10-15",
      "priceMarket": "Salomon 美国官网裸板挂牌价",
      "priceSource": "https://www.salomon.com/en-us/product/qst-94-lilac-li9360",
      "priceStatus": "美国官网同货号 L49189300+ 列 USD 749.95，明确为 skis only；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,019.21。德国官网同货号列 EUR 550，商品包也仅含雪板，折算 CNY 4,120.88。两者是地区官网挂牌折算参考，不是中国售价；税费口径、跨境运输、进口及支付汇兑费用未计。"
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
        "value": "15.5m"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 / 自由滑"
      },
      {
        "key": "skierLevel",
        "label": "适合水平",
        "value": "中级（Salomon 美国官网）；德国官网标注进阶，官方地区页面等级不一致。"
      }
    ]
  },
  {
    "id": "01a12e89-5a8a-7a58-a3df-444e7e80ee19",
    "slug": "salomon-qst-98-2024",
    "title": "Salomon QST 98 2023/24",
    "model": "QST 98",
    "year": 2024,
    "oneLiner": "98 mm 板腰的全山地自由滑雪板；此档案记录 2023/24 旧款。",
    "priceMin": 4720,
    "priceMax": 4720,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ed4de590b145d4c8b89015c768572d9298283e7352080657bb93028ee731ffb4.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "169 / 176 / 183 / 189 cm",
      "profile": "Rocker-Camber-Rocker（Freeride Profile）",
      "waistWidth": 98,
      "core": "全杨木木芯",
      "turnRadius": 15,
      "construction": "Full Sandwich Sidewalls；Ti Binding Reinforcement",
      "turnRadiusReferenceLength": "169 cm",
      "technologies": "Cork Damplifier；C/FX；Double Sidewalls",
      "terrain": "全山地 / 自由滑",
      "weightPerSki": 1740,
      "skierLevel": "中级至进阶",
      "weightReferenceLength": "169 cm",
      "bindingSetup": "裸板，不含固定器",
      "geometryNotes": "货号 L47232300+ 的 2023/24 目录逐尺码表列出四个长度的板头/腰/尾宽、半径和单只重量。Salomon 当前官方产品页仍显示同一货号和四个长度，但不单独标注雪季；本档案按 2023/24 目录归档，不标为 2026/27。",
      "weightBasis": "Salomon 编制的 2023/24 日本规格目录按每只雪板列重；数据仅适用于表内对应长度，不含固定器。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "裸板须另外选配固定器，核对安装说明、制动器宽度和雪靴 BSL；由专业店安装并按本人信息调节、校验释放。",
      "seasonEvidence": "Salomon 编制的 2023/24 日本雪板规格目录以货号 L47232300+ 列出 QST 98 与四个长度。Salomon 当前官方产品页确认同一货号及尺码；本档案按 2023/24 目录归档，不标为 2026/27。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.salomon.com/en-gb/product/qst-98-li4910/L47232300%2B?sizeId=L47232300169；https://www.grip-walk.com/faq/",
      "officialPrice": "EUR 630.00",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Salomon 欧洲官网存档挂牌价",
      "priceSource": "https://www.salomon.com/es-es/product/qst-98-li4910/L47232300%2B",
      "priceStatus": "Salomon 西班牙官方页面曾按货号 L47232300+ 显示 EUR 630.00，但该商品已不在官网销售；按 ECB 2026-10-14 EUR/CNY 7.4925 折算历史挂牌参考 CNY 4,720.27。该数仅供 2023/24 旧款档案参考，不代表当前可购价格或中国售价。"
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
    "id": "01a12e89-5a94-7d5b-80fd-222b0976bc6a",
    "slug": "salomon-qst-blank-2027",
    "title": "Salomon S/LAB QST Blank 2026/27",
    "model": "S/LAB QST Blank",
    "year": 2027,
    "oneLiner": "QST freeride 系列的宽板腰粉雪型号，官方冬季目录在售。",
    "priceMin": 6023,
    "priceMax": 6023,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/fd5901586ca99b65a215d16b5a1889f42471ee9ca479b363d896fc346b5c6a4b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "skis",
    "specs": {
      "lengthOptions": "170 / 178 / 186 / 192 cm",
      "waistWidth": 112,
      "turnRadius": 19,
      "turnRadiusReferenceLength": "186 cm",
      "terrain": "自由滑 / 粉雪",
      "skierLevel": "进阶",
      "bindingSetup": "裸板或依销售套装配置",
      "geometryNotes": "26/27 目录提供 178/186/192 cm 完整几何、半径、midsole 和单只重量；Salomon 官方商品页所选 170 cm 显示 137-112-126 mm、17 m，已补录，不推算重量或 midsole。",
      "weightBasis": "26/27 目录对 178/186/192 cm 列出单只裸板重量；官网所选 170 cm 页面给出几何和半径，但未提供该尺码可核对的重量及 midsole 数据。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "26/27 Salomon 目录列出 S/LAB QST BLANK、货号 L47713400+，含 178/186/192 cm 尺码表；官网同货号 170 cm 选中状态显示尺寸和半径。",
      "sourceCheckedAt": "2026-10-14",
      "compatibilitySources": "https://www.salomon.com/en-us/product/s-lab-qst-blank-li7032/L47713400%2B；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 899.95",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Salomon 美国官网裸板挂牌价",
      "priceSource": "https://www.salomon.com/en-us/product/s-lab-qst-blank-li7032",
      "priceStatus": "Salomon 美国官网当前页面按货号 L47713400+ 列 USD 899.95，内容为 skis only；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 6,023.11。页面尺寸选项与26/27目录不完全一致，季节取自26/27目录及同货号匹配；美国参考价，不是中国售价，税费与跨境费用未计。"
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
        "value": "19m"
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
    "id": "01a12e89-5a9f-7fe6-9af8-7d0af5ad2d37",
    "slug": "salomon-stance-84-2027",
    "title": "Salomon Stance 84 R 2026/27",
    "model": "Stance 84 R",
    "year": 2027,
    "oneLiner": "雪道与全山地兼顾的稳定型双板；2027 延续款身份由年度测试与零售商品页交叉确认，含板、板托及固定器系统。",
    "priceMin": 5354,
    "priceMax": 5354,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/61ea873a212fb988c7e143811c56ba276e793f8272fd3ed29148fed78012eb81.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
      "bindingSetup": "雪板+板层+固定器",
      "geometryNotes": "Salomon 官网商品页按货号 L45457300+ 给出四个长度的板头/腰/尾宽、半径和套装净重；官方 26/27 日本目录未收录该型号，但 SkiEssentials 2027 延续款测试和零售页明确标为 2027，商品系列名称与规格可对应。此雪季判断来自第三方交叉来源，不声称官方目录列出。",
      "weightBasis": "尚缺可核对的逐长度重量，不以同系列或其他年款推算。",
      "bindingCompatibility": "实际兼容性取决于固定器型号与靴底类型。核对 Alpine / GripWalk 标识、成人或儿童靴底及 BSL 鞋底外壳长度（mm）；鞋码不能代替 BSL，GW 标识也不表示兼容所有巡游靴。",
      "mountingNotes": "按实际 SKU 核对是否含固定器、系统板/轨道与对应固定器；由专业店根据雪靴 BSL 调节并校验释放。商品标题出现系统名称不等于固定器已包含。",
      "seasonEvidence": "Salomon 26/27 日本雪板目录未列 Stance 84 R；Salomon 当前官方商品页按 L45457300+ 提供四码规格但未标雪季。SkiEssentials 的 2027 年度测试称其为 2027 延续款；Sporting Life 与 Bottero Ski 的商品页将 Stance 84 R + MI12 GW 标为 2027，后者同时列出 L45457300/L45436800 系列货号。雪季经第三方型号/货号交叉确认，官方目录缺项如实保留。",
      "sourceCheckedAt": "2026-10-15",
      "compatibilitySources": "https://www.salomon.com/en-us/product/stance-84-r-and-mi12-li1721；https://www.grip-walk.com/faq/",
      "officialPrice": "USD 799.95",
      "priceCheckedAt": "2026-10-14",
      "priceMarket": "Salomon 美国官网雪板系统套装挂牌价",
      "priceSource": "https://www.salomon.com/en-us/product/stance-84-r-and-mi12-li1721",
      "priceStatus": "Salomon 美国官网按货号 L45457300+ 列 USD 799.95，包装内容为雪板、板托及固定器；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算 CNY 5,353.84。雪季由独立年度测试与同名零售商品页交叉确认，不由价格推断。美国参考价，不是中国售价，税费与跨境费用未计。"
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
    "id": "01a12e89-5aaf-74de-af0c-14a893ba0cfe",
    "slug": "arbor-a-frame-2025",
    "title": "Arbor A-Frame 2025",
    "model": "A-Frame",
    "year": 2025,
    "oneLiner": "长半径侧切与 RWD 碳纤维结构，主打粉雪中的控制力，同时也可作为日常全山板滑行。",
    "priceMin": 6599,
    "priceMax": 6599,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/00c63df186b679ae10541b5ef13cb43660996bf5a064dae08dde30b838cd6812.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 57.6,
    "editorialScores": {
      "park": 2,
      "float": 8.5,
      "value": 5.5,
      "response": 7.5,
      "stability": 7.5,
      "forgiveness": 3
    },
    "brand": {
      "slug": "arbor",
      "name": "Arbor",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 162,
      "effectiveEdge": 1196,
      "sidecutRadii": "9.3 / 8.4 / 9.3 m",
      "waistWidth": 256,
      "stanceSetback": 10,
      "profile": "Parabolic Camber / System Camber",
      "profileFamily": "camber",
      "shape": "定向",
      "core": "Highland III Core",
      "fiberglass": "Mixed Glassing",
      "base": "Sintered Base",
      "weight": 3180,
      "flex": 8.5,
      "damping": 8.5,
      "pop": 5.5,
      "turnRadiusFeel": "长弧，需要主动压板",
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "warranty": 3,
      "officialPrice": "USD 334.95–389.95",
      "priceMarket": "原币 USD；来源商店 www.arborcollective.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.arborcollective.com/products/a-frame-snowboard-25",
      "priceStatus": "当前同名产品系列官方挂牌价，页面未确认本档案年份；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
        "value": "1196mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "256mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      }
    ]
  },
  {
    "id": "01a12e89-5abd-7a09-9b83-b3a111ded19d",
    "slug": "bataleon-evil-twin-2025",
    "title": "Bataleon Evil Twin 2025",
    "model": "Evil Twin",
    "year": 2025,
    "oneLiner": "3BT 与 Sidekick 配合中等 Camber 和真双向板型，定位公园与全山自由式；试滑反馈偏灵活、宽容，但板头尾在高速和烂雪中不适合强压。",
    "priceMin": 4899,
    "priceMax": 4899,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/358585346e9f908665b4ad8bf6fc3e7388482ee37224fb46ac6757c12fa63782.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.1,
    "editorialScores": {
      "park": 8.5,
      "float": 7,
      "value": 8,
      "response": 7.5,
      "stability": 5.5,
      "forgiveness": 9
    },
    "brand": {
      "slug": "bataleon",
      "name": "Bataleon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "151 / 154 / 156W / 157 / 159 / 159W",
      "length": 154,
      "effectiveEdge": 1175,
      "sidecut": 7.94,
      "waistWidth": 250,
      "stanceSetback": 0,
      "profile": "3BT + Sidekick（中等 Camber）",
      "profileFamily": "hybrid",
      "shape": "真双向",
      "core": "Ultra Light Core（70%泡桐木/30%白杨木）+ Central Super Tube 碳管",
      "fiberglass": "Triax + 碳纤维加强条",
      "base": "Hyper Glide S 烧结底板",
      "weight": 2720,
      "flex": 5,
      "damping": 6,
      "pop": 7.5,
      "turnRadiusFeel": "中等半径，勺形边缘降低入弯咬刃感",
      "scenes": [
        "freestyle",
        "beginner"
      ],
      "warranty": 2,
      "selectionNotes": "各尺寸几何、建议体重及鞋码依据 Bataleon Argentina 官方页面：https://bataleon.com.ar/shop/evil-twin/（2024/25 型号表）。",
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "1175mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.94m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "250mm"
      }
    ]
  },
  {
    "id": "01a12e89-5acb-7e8e-bc82-cafb05d921bb",
    "slug": "bc-stream-r2-2026",
    "title": "BC Stream R-2 2026",
    "model": "R2",
    "year": 2026,
    "oneLiner": "25/26 款锤头刻滑板，采用方向性双向板型与可变拱形；日本含税定价 ¥126,500，按 2026-10-02 参考汇率折算约 ¥5,370 CNY；该型号未见于当前 26/27 目录。",
    "priceMin": 5370,
    "priceMax": 5370,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/e153b1f02de5503aefc752d49dad2baa77f4009f500d7c403f4acccbfc494dff.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 62.1,
    "editorialScores": {
      "park": 3,
      "float": 5.8,
      "value": 6.8,
      "response": 8.4,
      "stability": 7.9,
      "forgiveness": 4.6
    },
    "brand": {
      "slug": "bc-stream",
      "name": "BC Stream",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1300,
      "sidecutRadii": "9.2 / 8.8 / 8.4 / 8.8 / 9.2 m",
      "waistWidth": 250,
      "stanceSetback": 20,
      "profile": "Variable Camber",
      "profileFamily": "hybrid",
      "shape": "Directional Twin / Hammerhead",
      "core": "桧木 / 桐木",
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5adb-7310-8e35-9a73e88b7af8",
    "slug": "bc-stream-riders-spec-dr-2027",
    "title": "BC Stream Riders' Spec DR 2027",
    "model": "Riders' Spec DR",
    "year": 2027,
    "oneLiner": "宽板头与方向性轮廓兼顾压雪道和粉雪；商品资料标注 50 mm setback，不同鼻尾形状版本的滑行表现有别。日本 26/27 零售标价 ¥129,800 含税，按 2026-10-02 参考汇率折算约 ¥5,505 CNY（非中国零售价）。",
    "priceMin": 5505,
    "priceMax": 5505,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/beb0de848c718ae06a5e11c62274a03b74d70ea3f2d850dacb989a1a9970c58a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.9,
    "editorialScores": {
      "park": 5.8,
      "float": 8,
      "value": 7.1,
      "response": 8,
      "stability": 8.2,
      "forgiveness": 6.3
    },
    "brand": {
      "slug": "bc-stream",
      "name": "BC Stream",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1190,
      "sidecutRadii": "8.8 / 8.5 / 8.2 / 8.8 / 9.4 m",
      "waistWidth": 260,
      "stanceSetback": 50,
      "profile": "Nose Rocker / Variable Camber",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "260mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5aeb-7c6d-a235-33c5b23775ce",
    "slug": "bc-stream-rx-2027",
    "title": "BC Stream RX 2027",
    "model": "RX",
    "year": 2027,
    "oneLiner": "26/27 定向刻滑板，提供 Regular 与 Hard 两种硬度选项；各尺码几何参数按 26/27 商品规格逐项记录。日本含税标价 ¥147,400，按 2026-10-02 参考汇率折算约 ¥6,252 CNY（非中国零售价）。",
    "priceMin": 6252,
    "priceMax": 6252,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9e786055ddefcaace6ca01255c9eec008fb76d7d19d0be3c18abb0ed23989e36.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.1,
    "editorialScores": {
      "park": 2.5,
      "float": 5.5,
      "value": 6.8,
      "response": 9,
      "stability": 9.1,
      "forgiveness": 3.8
    },
    "brand": {
      "slug": "bc-stream",
      "name": "BC Stream",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 159,
      "effectiveEdge": 1340,
      "sidecutRadii": "9.3 / 9.0 / 8.7 / 9.3 / 9.9 m",
      "waistWidth": 252,
      "shape": "Directional",
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "1340mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "刻滑 · 全山地"
      }
    ]
  },
  {
    "id": "01a12e89-5afa-76c2-9d6f-9b0631451eab",
    "slug": "burton-custom-camber-2026",
    "title": "Burton Custom Camber 2026",
    "model": "Custom Camber",
    "year": 2026,
    "oneLiner": "经典全山地 Camber：压雪道刻滑和常规雪场速度下稳定、响应直接；遇到烂雪或极高速仍会有震动与性能边界。",
    "priceMin": 5998,
    "priceMax": 5998,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/53568d9621b032d7a80ec341e17cff04f2e0ed04bfe6ff680133df113f29370e.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67.8,
    "editorialScores": {
      "park": 5.5,
      "float": 6,
      "value": 6.5,
      "response": 8.5,
      "stability": 8.5,
      "forgiveness": 5
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "150 / 154 / 156 / 158 / 162 / 154W / 158W / 162W / 166W / 170W",
      "length": 158,
      "effectiveEdge": 1215,
      "sidecut": 7.9,
      "waistWidth": 254,
      "stanceSetback": 15,
      "profile": "纯 Camber",
      "profileFamily": "camber",
      "shape": "定向双向",
      "core": "Super Fly II 700G Core + Dualzone EGD（FSC 认证）",
      "fiberglass": "45° Carbon Highlights",
      "base": "WFO 烧结底板",
      "weight": 2980,
      "flex": 7,
      "damping": 8,
      "pop": 7.5,
      "turnRadiusFeel": "长弧稳、短弧需发力",
      "scenes": [
        "all-mountain",
        "carving"
      ],
      "warranty": 3,
      "selectionNotes": "板长、建议体重、板腰、有效刃长、站距与板头尾宽依据 Burton 2026 官方尺码表：https://eu.burton.com/en-gb/products/mens-burton-custom-camber-snowboard-106881a-o?variant=42867455721549。",
      "priceMarket": "中国 SPADERS 微信认证店铺；25/26 Custom Glow 与 M Custom Jungle 均挂牌 CNY 5,998",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://detail.youzan.com/show/goods?alias=3ersstb5f52viu3&from_source=gbox_seo",
      "priceStatus": "中国零售商挂牌参考，不是成交价；页面未显示 Burton 货号、具体尺码或库存，不能确认挂牌价适用于所有尺寸。原种子 CNY 6,299 无可核查来源，已用该同季本地挂牌价替换。"
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
    "id": "01a12e89-5b0a-7dfb-84e7-f8fc1147409e",
    "slug": "burton-custom-camber-2027",
    "title": "Burton Custom Camber Snowboard 2027",
    "model": "Custom Camber",
    "year": 2027,
    "oneLiner": "以传统 Camber 和定向板型兼顾全山巡航与自由式地形；158 尺寸提供 254 mm 板腰与 1215 mm 有效刃长。",
    "priceMin": 4553,
    "priceMax": 4553,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b653a6f785d0e68f6e50f0806e10c42d9ef45fa0d165a953c4f2da4b3f571f8c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.6,
    "editorialScores": {
      "park": 7.4,
      "float": 7.3,
      "value": 6.7,
      "response": 8.2,
      "stability": 8.7,
      "forgiveness": 6.1
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "150 / 154 / 156 / 158 / 162 / 154W / 158W / 162W / 166W / 170W",
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
      "warranty": 3,
      "officialPrice": "JPY 107800",
      "priceMarket": "Burton 日本官方商店；型号 106881、色款代码 27WIN-106881",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/mens-burton-custom-camber-snowboard-106881",
      "priceStatus": "Burton 日本官方商品页 2027 款型号 106881 标价 JPY 107,800；Yahoo! Shopping Japan 的 MOVE Select 对 26-27 Faded、货号 106881AI66RG、JAN 9010884397401 挂牌 JPY 107,800，交叉确认日本地区价格。零售页自称正規代理店商品，授权未独立核实；2026-10-15 页面显示 150、156 cm 余量少，154、158、162 cm 缺货，仅是当日快照。按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 4,553.20。国内另发现聚合页 CNY 5,998 线索，自述来自天猫 BURTON 官方旗舰店，但标题同时列 106881 Camber 与 107071 Flying V，未展示本款 27WIN-106881 的具体变体，故不作为中国售价。中国京东索引另出现 26/27、106881、156 cm 商品标题，详情页无法读取人民币价格、卖家和库存；相同货号的 25/26 CNY 6,798 线索不映射本雪季。日本价格仅为地区参考，不是中国售价，运费、跨境配送和进口费用未计。"
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
    "id": "01a12e89-5b1b-7b75-89d1-bd5947a4f490",
    "slug": "burton-good-company-camber-2027",
    "title": "Burton Good Company Camber Snowboard 2027",
    "model": "Good Company Camber",
    "year": 2027,
    "oneLiner": "采用 Camber、Twin 板型与对称弹性设定，面向全山与自由式滑行；152 尺寸板腰 250 mm、有效刃长 1155 mm。",
    "priceMin": 2788,
    "priceMax": 2788,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9ff5ca8ae0863c158baeb5cf587fd0af508f1f1ef109343f68228dc7e57555f5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.3,
    "editorialScores": {
      "park": 8.5,
      "float": 4.7,
      "value": 8.4,
      "response": 6.7,
      "stability": 6.8,
      "forgiveness": 8.4
    },
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
      "warranty": 3,
      "officialPrice": "JPY 66000",
      "priceMarket": "Burton 日本官方商店；型号 235951、色款代码 27WIN-235951",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/burton-good-company-camber-snowboard-235951",
      "priceStatus": "Burton 日本官方商品页 2027 款型号 235951 标价 JPY 66,000；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 2,787.67。页面列出 135/140/145/148/152/155/159/155W/159W/162W，145 与 162W 当时标为售罄。页面未明确税费口径；日本官方店折算参考，不是中国售价，运费、跨境配送和进口费用未计。"
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
    "id": "01a12e89-5b2c-728f-a534-084fdd897bc6",
    "slug": "burton-process-2026",
    "title": "Burton Process 2026",
    "model": "Process",
    "year": 2026,
    "oneLiner": "PurePop Camber、Twin Shape 与 Twin Flex 带来双向自由式脚感，官方定位覆盖跳台、侧击与全山巡航；它不是深粉雪或强攻刻滑专板。",
    "priceMin": 5499,
    "priceMax": 5499,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/aea2e86e3e83318c1fef15e1fe0caa292a5bfccc024e86fb9b5ee71912d843d2.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.5,
    "editorialScores": {
      "park": 8.5,
      "float": 5.5,
      "value": 7.5,
      "response": 7.5,
      "stability": 7,
      "forgiveness": 7.5
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1215,
      "sidecut": 8.1,
      "waistWidth": 252,
      "stanceSetback": 12.5,
      "profile": "PurePop Camber",
      "profileFamily": "hybrid",
      "shape": "Twin（真双向）",
      "core": "Super Fly II 700G Core + Dualzone EGD",
      "fiberglass": "Triax",
      "base": "Sintered Base",
      "flex": 5,
      "damping": 7,
      "pop": 8.5,
      "turnRadiusFeel": "灵活，中短半径",
      "scenes": [
        "freestyle",
        "all-mountain"
      ],
      "warranty": 3,
      "priceCheckedAt": "2026-10-15",
      "priceStatus": "SPADERS 中国店铺页面显示同季 PROCESS CNY 4,998，但没有确认 Camber/Flying V、制造商货号或尺码；仅作同季款系挂牌线索，不覆盖当前主价 CNY 5,499。京东索引另列 106921 / 106921CA03RG 157 cm，但商品详情未显示可核查的价格。"
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
        "value": "8.1m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
      }
    ]
  },
  {
    "id": "01a12e89-5b3a-71e8-80b8-bb2554c7ad9c",
    "slug": "burton-talent-scout-2027",
    "title": "Women's Burton Talent Scout Camber Snowboard 2027",
    "model": "Talent Scout",
    "year": 2027,
    "oneLiner": "Burton 女款公园双向板，Camber 结构强调跳台弹性和道具控制，并采用针对女性滑手调校的软硬设定。",
    "priceMin": 3159,
    "priceMax": 3159,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ebcc6f734a119bd543f9d14b842df700bcc43310ec563d18c649119a4b27c5f8.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.8,
    "editorialScores": {
      "park": 9,
      "float": 4.6,
      "value": 7.8,
      "response": 8,
      "stability": 7.3,
      "forgiveness": 6.3
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "138 / 141 / 146 / 149 / 152",
      "length": 146,
      "widthVariant": "standard",
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
      ],
      "officialPrice": "JPY 74800",
      "priceMarket": "Burton 日本官方商店；型号 132181、色款代码 27WIN-132181",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/en-jp/products/womens-burton-talent-scout-camber-snowboard-132181",
      "priceStatus": "Burton 日本官方商品页 2027 款型号 132181 标价 JPY 74,800；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 3,159.36。页面列出 138/141/146/149/152，152 当时标为售罄。页面未明确税费口径；日本官方店折算参考，不是中国售价，运费、跨境配送和进口费用未计。"
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
    "id": "01a12e89-5b48-7b6a-8e5c-c444f280f015",
    "slug": "capita-aeronaut-2027",
    "title": "CAPiTA Aeronaut Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Aeronaut",
    "year": 2027,
    "oneLiner": "定向传统正拱的度假全山板，强调速度、侧击和连续腾空，适合已经能主动压板并想提升山地表现的滑手。",
    "priceMin": 4551,
    "priceMax": 4551,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c5b1db97016ff8652186d210fa478180a47646ffe10ed47913fbb4e2718b0912.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76.1,
    "editorialScores": {
      "park": 7.2,
      "float": 7.4,
      "value": 7.1,
      "response": 8.5,
      "stability": 8.6,
      "forgiveness": 6.5
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "153 / 155 / 157 / 159 / 161 / 156W / 158W / 160W / 162W",
      "length": 157,
      "widthVariant": "standard",
      "effectiveEdge": 1230,
      "sidecutRadii": "8.5/7.5 m",
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
      ],
      "priceMarket": "CAPiTA 美国官方商店；日本 Murasaki Sports 同款页面交叉核对 JPY 107,800 含税",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://capitasnowboarding.com/products/capita-aeronaut-mens-snowboard-2027",
      "priceStatus": "CAPiTA 美国官方页面标价 USD 679.95；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算为 CNY 4,550.71。日本 Murasaki Sports 的 26/27 同型号页面标价 JPY 107,800（含税），按 EUR/JPY 177.39、EUR/CNY 7.4925 折算约 CNY 4,553.20，与美国官方价交叉接近。价格是美国官方售价折算参考，不是中国售价；美国税费、汇兑、跨境运输及进口费用未计。原种子 CNY 4,896 未找到可回查依据，已用来源可核的折算值替换。"
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
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "253mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      }
    ]
  },
  {
    "id": "01a12e89-5b5a-71f0-8bc3-f15ff5ee07a2",
    "slug": "capita-dark-horse-2027",
    "title": "CAPiTA Dark Horse Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Dark Horse",
    "year": 2027,
    "oneLiner": "以较低门槛切入公园和自由式的双向板，保留跳台、侧击与道具所需的灵活性，也能应付日常度假区巡航。",
    "priceMin": 3600,
    "priceMax": 3600,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/30ac807dc05915423d65c16474e9ba76610b00a437d7e902dc8dc25672bc3b1a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73,
    "editorialScores": {
      "park": 8.6,
      "float": 4.8,
      "value": 8.2,
      "response": 7.2,
      "stability": 7,
      "forgiveness": 8
    },
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
      ],
      "officialPrice": "USD 499.95",
      "priceMarket": "原币 USD；来源商店 capitasnowboarding.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://capitasnowboarding.com/products/capita-dark-horse-mens-snowboard-2027",
      "priceStatus": "对应目标年份的官方页面挂牌价；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
    "id": "01a12e89-5b6c-711f-ba6e-32a7dd4d315e",
    "slug": "capita-defenders-of-awesome-2026",
    "title": "Capita Defenders of Awesome 2026",
    "model": "Defenders of Awesome",
    "year": 2026,
    "oneLiner": "Resort True Twin 配 Resort V1 + Flat Kick Tech；P2 Superlight 芯材与 Hybrid Carbon HolySheet 主打轻量、响应和弹性。",
    "priceMin": 5299,
    "priceMax": 5299,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/aa1707afc83a7b08d1fe8af8fcde3ff98351081be5511310f1576aa6c91eb854.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.6,
    "editorialScores": {
      "park": 9.5,
      "float": 5.5,
      "value": 8.5,
      "response": 8,
      "stability": 7,
      "forgiveness": 7
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "148 / 150 / 152 / 154 / 156 / 158 / 160 / 162 / 164 / 151W / 153W / 155W / 157W / 159W / 161W / 163W",
      "length": 156,
      "effectiveEdge": 1233,
      "sidecut": 8,
      "waistWidth": 252,
      "stanceSetback": 0,
      "profile": "Resort V1 + Flat Kick Tech",
      "profileFamily": "hybrid",
      "shape": "True Twin",
      "core": "P2 Superlight Core",
      "fiberglass": "Hybrid Carbon HolySheet Bi/Bi + Magic Bean Resin",
      "base": "Quantum Drive（Sublimation）",
      "weight": 2760,
      "flex": 5.5,
      "damping": 6,
      "pop": 9,
      "turnRadiusFeel": "灵活，短半径很快",
      "scenes": [
        "freestyle",
        "all-mountain"
      ],
      "warranty": 2,
      "selectionNotes": "尺码表来自 Melbourne Snowboard 的 2026 款商品页（零售商数据）；Sportano 同年页面交叉核对时，163W 有效刃长出现 3 mm 差异，本档案保留主来源数值：https://www.melbournesnowboard.com.au/products/capita-defenders-of-awesome-2026",
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "1233mm"
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
    "id": "01a12e89-5b7d-70a0-b754-f988d97a4e91",
    "slug": "capita-defenders-of-awesome-2027",
    "title": "CAPiTA D.O.A. Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Defenders of Awesome",
    "year": 2027,
    "oneLiner": "兼顾度假区全山和自由式的经典双向板，响应、弹性和可玩性平衡，适合想在跳台、侧击和日常巡航之间切换的滑手。",
    "priceMin": 3763,
    "priceMax": 3763,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/51dcbbbec72249f9fcf42c4ce7887dab628d147fabf56b4c0552691e438eaea7.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.3,
    "editorialScores": {
      "park": 8.1,
      "float": 6.4,
      "value": 7.5,
      "response": 8,
      "stability": 7.9,
      "forgiveness": 7.1
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "148 / 150 / 152 / 154 / 156 / 158 / 160 / 162 / 164 / 151W / 153W / 155W / 157W / 159W / 161W / 163W",
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
      ],
      "priceMarket": "CAPiTA 日本官方商店；日本地区挂牌价参考",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.capitasnowboarding.com/products/capita-d-o-a-mens-snowboard-2027",
      "priceStatus": "CAPiTA 日本官方店 D.O.A. 2026/27 显示 JPY 89,100；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 3,763.36。商品页列出 148–164 及 151W–163W。页面未明确税费口径；该折算是日本官方店参考，不是中国售价，跨境运费和进口费用未计。"
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
    "id": "01a12e89-5b9a-7652-a98c-6c8ae27fd8f1",
    "slug": "capita-indoor-survival-2027",
    "title": "CAPiTA Indoor Survival Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Indoor Survival",
    "year": 2027,
    "oneLiner": "偏公园和度假区的双向自由式板，用较软的硬度换取道具、跳台和地形转换中的灵活度，同时保留足够的脚下响应。",
    "priceMin": 4536,
    "priceMax": 4536,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b3aacbb5af6a60e434334eabe7e624f3259f431d0e2c7f4a1322decc35aed829.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.6,
    "editorialScores": {
      "park": 9,
      "float": 5.7,
      "value": 7,
      "response": 7.8,
      "stability": 7.2,
      "forgiveness": 8
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "150 / 152 / 154 / 156 / 158 / 160 / 155W / 158W / 161W",
      "length": 156,
      "widthVariant": "standard",
      "effectiveEdge": 1211,
      "sidecutRadii": "7.96/3/-1.5/3/7.96 m",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "258mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5ba7-7127-aca0-194c86ecbb79",
    "slug": "capita-kazu-kokubo-pro-2027",
    "title": "CAPiTA Kazu Kokubo Pro Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Kazu Kokubo Pro",
    "year": 2027,
    "oneLiner": "紧凑而有力量的粉雪定向板，板头浮力和轻微收尾让它在侧country与变化地形里更灵活，适合有主动控板能力的滑手。",
    "priceMin": 4551,
    "priceMax": 4551,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/427873c70e521e0dc2af10909d1d37e901a417e334de47fd6db5274513550fc7.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.7,
    "editorialScores": {
      "park": 5.5,
      "float": 9,
      "value": 7,
      "response": 8.4,
      "stability": 8.4,
      "forgiveness": 6.8
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "151 / 154 / 157 / 160 / 155W / 158W / 161W / 164W",
      "length": 157,
      "widthVariant": "standard",
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
      ],
      "priceMarket": "CAPiTA 美国官方商店；日本 Moriyama Sports 同款页面交叉核对 JPY 107,800 含税",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://capitasnowboarding.com/products/capita-kazu-kokubo-pro-mens-snowboard-2027",
      "priceStatus": "CAPiTA 美国官方页面标价 USD 679.95；按 ECB 2026-10-14 EUR/USD 1.1195、EUR/CNY 7.4925 折算为 CNY 4,550.71。日本 Moriyama Sports 的 26/27 同型号页面标价 JPY 107,800（含税），按 EUR/JPY 177.39、EUR/CNY 7.4925 折算约 CNY 4,553.20，与美国官方价交叉接近。价格是美国官方售价折算参考，不是中国售价；美国税费、汇兑、跨境运输及进口费用未计。原种子 CNY 4,896 未找到可回查依据，已用来源可核的折算值替换。"
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
    "id": "01a12e89-5bb4-73a1-9276-ba74f23dc8f3",
    "slug": "capita-mega-death-2027",
    "title": "CAPiTA Mega Death Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Mega Death",
    "year": 2027,
    "oneLiner": "面向高阶滑手的轻量高性能自由滑板，在高速度、硬雪和深雪中追求更强的支撑与响应，价格和使用门槛都较高。",
    "priceMin": 6969,
    "priceMax": 6969,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/6e914df1bdd38be9ce8230cb27d7f3a1af4b608ba980defb64b6c08d4ae50eed.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.7,
    "editorialScores": {
      "park": 4.8,
      "float": 8.8,
      "value": 5.9,
      "response": 9.2,
      "stability": 9,
      "forgiveness": 5.8
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "156 / 159 / 162 / 157W / 161W / 165W / 169W",
      "length": 159,
      "widthVariant": "standard",
      "effectiveEdge": 1221,
      "sidecutRadii": "8.4/8.0/7.8 m",
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
      ],
      "priceMarket": "CAPiTA 日本官方商店；美国官网同款 USD 1,199.95 作地区价差对照",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://jp.capitasnowboarding.com/products/capita-mega-death-mens-snowboard-2027",
      "priceStatus": "CAPiTA 日本官方页面标价 JPY 165,000，按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 6,969.18，作为亚洲地区价格参考。美国官网同款标价 USD 1,199.95，按 EUR/USD 1.1195、EUR/CNY 7.4925 折算为 CNY 8,030.93，说明地区定价有明显差异。本次检索未找到可核实的中国销售报价；以上均非中国售价，跨境费用、汇兑和税费影响未计。原种子 CNY 8,640 未找到可回查依据，已替换为日本官网折算参考。"
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
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "259mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5bbf-7221-8c83-d090c2af734c",
    "slug": "capita-mega-merc-2027",
    "title": "CAPiTA Mega Merc Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Mega Merc",
    "year": 2027,
    "oneLiner": "以全山适应性为核心的高规格定向板，在硬雪、侧country和深雪之间保持强响应，适合想要一块高性能日常板的进阶滑手。",
    "priceMin": 6505,
    "priceMax": 6505,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/19ad1668fb76353eefaf055b1b9a856cb014b632c1d08717b61e1e61bdc47f54.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.1,
    "editorialScores": {
      "park": 5.5,
      "float": 8,
      "value": 6.2,
      "response": 9,
      "stability": 8.9,
      "forgiveness": 6.2
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "153 / 155 / 157 / 159 / 161 / 156W / 158W / 160W",
      "length": 157,
      "widthVariant": "standard",
      "effectiveEdge": 1215,
      "sidecutRadii": "7.85/3/-1.5/3/7.85 m",
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
      ],
      "priceMarket": "CAPiTA 日本官方商店；美国官网同款 USD 999.95 作地区价差对照",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://jp.capitasnowboarding.com/products/capita-mega-merc-mens-snowboard-2027",
      "priceStatus": "CAPiTA 日本官方页面标价 JPY 154,000，按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 6,504.57，作为亚洲地区价格参考。美国官网同款标价 USD 999.95，按 EUR/USD 1.1195、EUR/CNY 7.4925 折算为 CNY 6,692.39；两地官方价接近但并不相同。本次检索未找到可核实的中国销售报价；以上均非中国售价，跨境费用、汇兑和税费影响未计。原种子 CNY 7,200 未找到可回查依据，已替换为日本官网折算参考。"
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
    "id": "01a12e89-5bcc-797f-91ae-967fbb89af90",
    "slug": "capita-outerspace-living-2027",
    "title": "CAPiTA Outerspace Living Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Outerspace Living",
    "year": 2027,
    "oneLiner": "定向双向与全山混合拱的平衡路线，既能做自由式动作，也能在度假区和浅粉雪里保持稳定的日常可玩性。",
    "priceMin": 3816,
    "priceMax": 3816,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b0bfe217bf3106394fce1fcc237b6c9420ca3047b3c1c9db1022e94d6f372155.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.9,
    "editorialScores": {
      "park": 7.4,
      "float": 7,
      "value": 7.8,
      "response": 7.7,
      "stability": 7.6,
      "forgiveness": 7.4
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "148 / 150 / 152 / 154 / 156 / 158 / 160 / 155W / 157W / 159W / 161W",
      "length": 154,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5bd8-7129-9a41-595f4772b2ba",
    "slug": "capita-pathfinder-2027",
    "title": "CAPiTA Pathfinder Camber Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Pathfinder",
    "year": 2027,
    "oneLiner": "面向进阶初期和预算敏感用户的友好型双向板，转向轻松、容错较高，适合从基础动作走向公园和全山练习。",
    "priceMin": 3240,
    "priceMax": 3240,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/392d6e84e727b0278e7a1709421e43855291b3081322c8197785a550566d4797.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.7,
    "editorialScores": {
      "park": 7.8,
      "float": 5.2,
      "value": 8.8,
      "response": 6.4,
      "stability": 6.5,
      "forgiveness": 8.5
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "145 / 147 / 149 / 151 / 153 / 155 / 157 / 153W / 155W / 157W / 159W",
      "length": 151,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5b8c-793a-b689-118452229244",
    "slug": "capita-horrorscope-2024",
    "title": "CAPiTA Pathfinder Reverse 2024",
    "model": "Pathfinder Reverse",
    "year": 2024,
    "oneLiner": "2024 款 Pathfinder Reverse 采用 Park V2 与方向双向板型，提供松弛、容易转向的自由式脚感，适合平花和公园进阶；保留旧 Horrorscope slug 以兼容已有链接。CNY 3096 仅为美国零售商页面标注原价 USD 429.95 按项目旧参考汇率换算的估值，不代表中国市场实售价。",
    "priceMin": 3096,
    "priceMax": 3096,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/325df1e96c47f04e82dec5c04fa5e91d76556163525f2d4c4a2d9720ac0d0cc0.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73,
    "editorialScores": {
      "park": 8.5,
      "float": 5.5,
      "value": 8.1,
      "response": 7.2,
      "stability": 5.8,
      "forgiveness": 9
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "145 / 147 / 149 / 151 / 153 / 155 / 157 / 151W / 153W / 155W / 157W / 159W / 162W",
      "length": 151,
      "effectiveEdge": 1202,
      "sidecut": 7.7,
      "waistWidth": 252,
      "profile": "Park V2（插入区平底，插入区外反弓 + Flat Kick）",
      "profileFamily": "rocker",
      "shape": "Directional Twin",
      "core": "FSC Certified Dual Core（杨木芯 + 山毛榉木条）",
      "fiberglass": "Special Blend 双轴玻纤 + Magic Bean 树脂",
      "base": "Superdrive EX（sintruded）",
      "flex": 4,
      "damping": 5,
      "pop": 7,
      "turnRadiusFeel": "灵活、平底滑行感明显，重压和高速下稳定性有限",
      "scenes": [
        "beginner",
        "freestyle"
      ],
      "warranty": 2,
      "selectionNotes": "旧 slug capita-horrorscope-2024 保留兼容；此档案实际为 2023/24 Pathfinder Reverse。尺码数据来自标注 2024 款且声明数据由厂商提供的零售商页面：https://pacificboarder.com/products/capita-mens-pathfinder-reverse-camber-snowboard-2024",
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "1202mm"
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
    "id": "01a12e89-5be3-75bd-b160-2ed954061d96",
    "slug": "capita-sb-resort-twin-2027",
    "title": "Spring Break Resort Twin Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "SB Resort Twin",
    "year": 2027,
    "oneLiner": "把 Spring Break 的造型和标准度假区双向结构结合起来，适合喜欢跳台、侧击和整山巡航的自由式用户。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/0394ffd4bb91083c6307a8cf7fc46a44a2bd9b30157d3b75fdf0e60bf11a6df5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.3,
    "editorialScores": {
      "park": 8.4,
      "float": 6.5,
      "value": 7,
      "response": 7.4,
      "stability": 7.1,
      "forgiveness": 7.6
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "152 / 154 / 156 / 158 / 160 / 155W / 158W",
      "length": 156,
      "widthVariant": "standard",
      "effectiveEdge": 1211,
      "sidecutRadii": "7.96/3/-1.5/3/7.96 m",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "258mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5bef-7231-8baf-bb1a907be69d",
    "slug": "capita-sidewinder-2027",
    "title": "CAPiTA Sidewinder Snowboard CAPiTA Snowboards | NA",
    "model": "Sidewinder",
    "year": 2027,
    "oneLiner": "为刻滑和压弯设计的定向板，强调边刃抓地、长弧稳定和高速出弯，适合把主要时间放在整备雪道上的滑手。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/0048b1606a71a24d6eacf39f6e6b38dd28542cf945be06bd947d2006376c71d1.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70.9,
    "editorialScores": {
      "park": 4.6,
      "float": 6.9,
      "value": 7,
      "response": 8.8,
      "stability": 8.7,
      "forgiveness": 5.8
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "153 / 156 / 159 / 162",
      "length": 159,
      "widthVariant": "standard",
      "effectiveEdge": 1225,
      "sidecutRadii": "7.0/6.5 m",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "258mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5bfb-7013-ae76-052b81c6f9d5",
    "slug": "capita-super-doa-2027",
    "title": "CAPiTA Super D.O.A. Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Super D.O.A.",
    "year": 2027,
    "oneLiner": "更强调技术感和响应的双向全山自由式板，适合喜欢跳台、侧击和强节奏巡航、并能驾驭偏硬设定的滑手。",
    "priceMin": 5575,
    "priceMax": 5575,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/cd26ddffb8e12aac4d463a1eb1057db0bbbe98efb988ff0333249c68ccbf3e22.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.8,
    "editorialScores": {
      "park": 8.4,
      "float": 6.5,
      "value": 6.6,
      "response": 8.8,
      "stability": 8.5,
      "forgiveness": 6.3
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "152 / 154 / 156 / 158 / 160 / 155W / 157W / 159W / 161W / 163W",
      "length": 156,
      "widthVariant": "standard",
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
      ],
      "priceMarket": "CAPiTA 日本官方商店；美国官网同款 USD 799.95 作地区价差对照",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://jp.capitasnowboarding.com/products/capita-super-d-o-a-mens-snowboard-2027",
      "priceStatus": "CAPiTA 日本官方页面标价 JPY 132,000，按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 5,575.34，作为亚洲地区价格参考。美国官网同款标价 USD 799.95，按 EUR/USD 1.1195、EUR/CNY 7.4925 折算为 CNY 5,353.84；两地官方价接近但并不相同。本次检索未找到可核实的中国销售报价；以上均非中国售价，跨境费用、汇兑和税费影响未计。原种子 CNY 5,760 未找到可回查依据，已替换为日本官网折算参考。"
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
    "id": "01a12e89-5c07-769b-8e0f-72d0ccd2a607",
    "slug": "capita-the-black-snowboard-of-death-2027",
    "title": "CAPiTA The Black Snowboard Of Death Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "The Black Snowboard of Death",
    "year": 2027,
    "oneLiner": "以全地形性能为核心的经典定向板，兼顾高速压雪、变化雪况和粉雪浮力，适合有经验的全山和自由滑手。",
    "priceMin": 4971,
    "priceMax": 4971,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/40291109baa9dd47076ff5a9ae652aaa8722de51eed89b342428aa93f0020d2c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.6,
    "editorialScores": {
      "park": 5.3,
      "float": 8.2,
      "value": 6.8,
      "response": 8.7,
      "stability": 8.8,
      "forgiveness": 6.4
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "156 / 159 / 162 / 157W / 161W / 165W / 169W",
      "length": 159,
      "widthVariant": "standard",
      "effectiveEdge": 1221,
      "sidecutRadii": "8.4/8.0/7.8 m",
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
      ],
      "priceMarket": "CAPiTA 日本官方商店；美国官网同款 USD 749.95 作地区价差对照",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://jp.capitasnowboarding.com/products/capita-the-black-snowboard-of-death-mens-snowboard-2027",
      "priceStatus": "CAPiTA 日本官方页面标价 JPY 117,700，按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 4,971.35，作为亚洲地区价格参考。美国官网同款标价 USD 749.95，按 EUR/USD 1.1195、EUR/CNY 7.4925 折算为 CNY 5,019.21；两地官方价接近但并不相同。本次检索未找到可核实的中国销售报价；以上均非中国售价，跨境费用、汇兑和税费影响未计。原种子 CNY 5,400 未找到可回查依据，已替换为日本官网折算参考。"
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
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "259mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5c16-75ab-a657-ce212b1522d0",
    "slug": "capita-the-matriarch-2027",
    "title": "The Matriarch CAPiTA Snowboards | NA",
    "model": "The Matriarch",
    "year": 2027,
    "oneLiner": "面向精准压弯和自然地形流动的定向正拱板，兼顾高速度支撑与地形变化，适合进阶全山滑行。",
    "priceMin": 4600,
    "priceMax": 4600,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2e18e2a4ec28cd5652197355fc9687713f79b7b1b470e8194820e6285a1eba82.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.5,
    "editorialScores": {
      "park": 5.8,
      "float": 7.9,
      "value": 6.6,
      "response": 8.8,
      "stability": 8.6,
      "forgiveness": 5.9
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "155 / 158 / 161 / 157W / 160W",
      "length": 158,
      "widthVariant": "standard",
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
      ],
      "priceMarket": "CAPiTA 日本官方商店；美国官网同款 USD 729.95 作地区价差对照",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://jp.capitasnowboarding.com/products/capita-the-matriarch-mens-snowboard-2027",
      "priceStatus": "CAPiTA 日本官方页面标价 JPY 108,900，按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 4,599.66，作为亚洲地区价格参考。美国官网同款标价 USD 729.95，按 EUR/USD 1.1195、EUR/CNY 7.4925 折算为 CNY 4,885.35；两地官方价存在地区差异。本次检索未找到可核实的中国销售报价；以上均非中国售价，跨境费用、汇兑和税费影响未计。原种子 CNY 5,256 未找到可回查依据，已替换为日本官网折算参考。"
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
    "id": "01a12e89-5c22-793f-aa23-75f39820e5db",
    "slug": "capita-the-navigator-2027",
    "title": "CAPiTA The Navigator Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "The Navigator",
    "year": 2027,
    "oneLiner": "为粉雪和野外地形准备的定向板，强调板头浮力、稳定巡航和路线选择，适合把滑行重点放在非压雪区域的用户。",
    "priceMin": 4680,
    "priceMax": 4680,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2c447a12b82e08adbd25e73bbfdc6ca589eb3afb4f15904aa16714bdd65b21c9.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.4,
    "editorialScores": {
      "park": 4.8,
      "float": 9,
      "value": 6.8,
      "response": 8,
      "stability": 8.2,
      "forgiveness": 6.9
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "155 / 158 / 161 / 164 / 167",
      "length": 161,
      "widthVariant": "standard",
      "effectiveEdge": 1216,
      "sidecutRadii": "8.3/7.2/8.3 m",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "260mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5c2f-74c5-9fd9-4058b97ff101",
    "slug": "capita-ultrafear-2027",
    "title": "CAPiTA Ultrafear Snowboard 2027 CAPiTA Snowboards | NA",
    "model": "Ultrafear",
    "year": 2027,
    "oneLiner": "以公园、Jib 和自由式动作为主的双向板，强调灵活、可玩和道具适应性，适合把创意动作放在第一位的滑手。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/76d6ea312d937b93a14137be6db79980a32985e22f36936271ddb525a5e0ddb6.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.7,
    "editorialScores": {
      "park": 9.2,
      "float": 4.9,
      "value": 7.9,
      "response": 7.1,
      "stability": 6.8,
      "forgiveness": 8.4
    },
    "brand": {
      "slug": "capita",
      "name": "Capita",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "149 / 151 / 153 / 155 / 157 / 153W / 155W / 157W",
      "length": 153,
      "widthVariant": "standard",
      "effectiveEdge": 1183,
      "sidecut": 7.8,
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a1428d-09ca-7c8c-a067-855184d631e2",
    "slug": "cosone-pro-all-mountain-2026",
    "title": "COSONE Pro 全能板 2026",
    "model": "COSONE Pro 全能板",
    "year": 2026,
    "oneLiner": "官网首页确认的 2026 男女通用款，挂牌价 ¥3,999；官方暂未提供可核验的尺码、硬度和技术参数，本档案暂不作性能评分。",
    "priceMin": 3999,
    "priceMax": 3999,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "cosone",
      "name": "COSONE",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "officialPrice": "CNY 3999",
      "priceMarket": "COSONE 官网首页商品卡",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.cos1.net/",
      "priceStatus": "官网首页卡片展示 CNY 3,999；首页其他导航和按钮为占位链接，无法确认具体型号参数、库存或是否可下单。仅保留展示价快照。"
    },
    "highlights": []
  },
  {
    "id": "01a12e89-5c3c-702f-85f5-65b30a968c18",
    "slug": "decathlon-all-road-900-2026",
    "title": "DREAMSCAPE All Road 900 2026",
    "model": "All Road 900",
    "year": 2026,
    "oneLiner": "迪卡侬成人全山地与自由滑取向型号，154/160/166cm 可选；英国官网页面标价 £279.99，按 ECB 2026-10-14 汇率折算约 ¥2,486 CNY（非中国售价，页面价格与库存动态变化）。154cm 规格为示例尺码。",
    "priceMin": 2486,
    "priceMax": 2486,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2e556dc2186ce25b188a7f434b67e7dcc5a7ded213fca60c4282937370bb598d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.9,
    "editorialScores": {
      "park": 3,
      "float": 8.3,
      "value": 8.4,
      "response": 8.7,
      "stability": 8.6,
      "forgiveness": 3.8
    },
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "154 / 160 / 166",
      "length": 154,
      "sidecut": 8.3,
      "waistWidth": 245,
      "stanceSetback": 50,
      "profile": "Camber with nose rocker",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "20mm poplar wood",
      "base": "Sintered",
      "weight": 2500,
      "flex": 8,
      "scenes": [
        "all-mountain",
        "powder"
      ],
      "selectionNotes": "154/160/166 的尺寸、几何、推荐站距与体重依据 Decathlon 官方页面：https://www.decathlon.co.uk/p/adults-snowboarding-board-for-slope-and-freeride-all-road-900/332434/c314c29m8643399。该页逐尺寸规格表及特性说明列 setback 50 mm，另一段地形说明列 35 mm；种子沿用逐尺寸表的 50 mm，冲突未解决。页面未注明具体生产雪季，2026 为采集快照标签。",
      "priceCheckedAt": "2026-10-15",
      "priceStatus": "CNY 2,486 为英国官方页 GBP 279.99 按 ECB 2026-10-14 汇率折算，不是中国售价；页面价格与库存动态变化。京东结果出现 ALL ROAD 900 条目号 4263566/4263567（其中 4263567 标注 166 cm），但未显示当前人民币金额，也未核实授权店铺及与本档案雪季的关系，暂不作为中国报价。"
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
    "id": "01a12e89-5c49-7e5f-be8d-baf10139dd7a",
    "slug": "decathlon-park-ride-500-2026",
    "title": "DREAMSCAPE Park & Ride 500 2026",
    "model": "Park & Ride 500",
    "year": 2026,
    "oneLiner": "迪卡侬全山地与自由式型号，标准正拱配合摇杆与粉雪站位；英、土官方页折算约 ¥1,776–1,965 CNY（地区参考，非中国售价）。规格以 156cm 为例。",
    "priceMin": 1776,
    "priceMax": 1965,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2f2359044c2efbcc9ae547b2ca096327d99317dec38890ee0546f2dcaa0ea891.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.9,
    "editorialScores": {
      "park": 7,
      "float": 7.2,
      "value": 8.4,
      "response": 7.5,
      "stability": 7.2,
      "forgiveness": 6.5
    },
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "152 / 153 MW / 156 / 158 W",
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
      ],
      "selectionNotes": "尺寸、宽度、半径、推荐站距、适用身高与标称重量依据 Decathlon 官方页面：https://www.decathlon.co.uk/p/mens-all-mountain-and-freestyle-snowboard-park-and-ride-500-green/306010/c49c1m8938817。标称重量公差 ±6%；标准站位后移 20 mm，Powder Stance 为 60 mm。页面未注明生产雪季，2026 为采集快照标签。",
      "priceMarket": "Decathlon 英国与土耳其官方商店，SKU 8938817；均为地区参考价，非中国售价",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.decathlon.co.uk/p/mens-all-mountain-and-freestyle-snowboard-park-and-ride-500-green/306010/c49c1m8938817",
      "priceStatus": "CNY 1,775.70 为英国官方页 GBP 199.99 的折算值；CNY 1,964.86 为土耳其官方页 TRY 14,500 的折算值，两页均对应 SKU 8938817，均非中国售价。按 ECB 2026-10-14 EUR/GBP 0.84385、EUR/TRY 55.2921、EUR/CNY 7.4925 折算。土耳其页当时列出 152/153 MW/156/158 W，但均显示缺货；英国价与库存动态变化。尚未核实中国官方或授权渠道报价，税费、配送及进口费用不计入。"
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
    "id": "01a12e89-5c56-7f35-bb37-bbba78d76061",
    "slug": "decathlon-snb-100-2026",
    "title": "DREAMSCAPE SNB 100 2026",
    "model": "SNB 100",
    "year": 2026,
    "oneLiner": "DREAMSCAPE 入门全山地男款，平底与长摇杆、软 flex 3/10、方向性双向板型；加拿大官网页面显示促销价 CAD $165（原价 CAD $220），按 ECB 2026-10-14 汇率折算约 ¥777 CNY（非中国售价，促销与库存动态变化）。规格以 152cm 为例。",
    "priceMin": 777,
    "priceMax": 777,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/592023b2cd65264ef7949e93696d2eb26c5302ab23e8263f05aac6ab829ef245.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 60.5,
    "editorialScores": {
      "park": 5.7,
      "float": 4.2,
      "value": 9.2,
      "response": 4.3,
      "stability": 4.4,
      "forgiveness": 9
    },
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "152 / 156 / 160 MW",
      "length": 152,
      "sidecut": 8.2,
      "waistWidth": 250,
      "stanceSetback": 20,
      "profile": "Flat Camber + Long Rocker",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "20mm poplar wood",
      "base": "Extruded",
      "weight": 2767,
      "flex": 3,
      "scenes": [
        "beginner",
        "all-mountain"
      ],
      "selectionNotes": "尺寸、板宽、半径、推荐站距与标称重量依据 Decathlon 官方页面：https://www.decathlon.co.uk/p/mens-all-mountain-snowboarding-board-snb-100-beige/309522/c179m8996555。标称重量公差 ±6%。",
      "priceCheckedAt": "2026-10-15",
      "priceStatus": "CNY 777 为加拿大官方页 CAD 165 促销价按 ECB 2026-10-14 汇率折算；同页原价 CAD 220 约合 CNY 1,036。加拿大价格不代表中国售价，促销与库存动态变化。京东结果出现 SNB 100 156 cm、条目号 4278169，但未显示当前人民币金额，也未核实授权店铺及与本档案的雪季对应关系，暂不作为中国报价。"
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
    "id": "01a13e3c-2c18-7600-bc3e-f94450723394",
    "slug": "donek-knapton-twin-custom-2026",
    "title": "Donek Knapton Twin 定制单板",
    "model": "Knapton Twin Custom",
    "year": 2026,
    "oneLiner": "为激进软靴刻滑与自由式滑手设计的定制 Twin；板宽、硬度和侧切按靴码与滑手需求调整，没有固定尺码表。",
    "priceMin": 5789,
    "priceMax": 5789,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "donek",
      "name": "Donek",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "按需求定制；下单前需与 Donek 沟通确认",
      "profile": "未在型号页明确列出",
      "shape": "Twin",
      "core": "Poplar and ash core",
      "fiberglass": "Triax fiberglass",
      "base": "Perlatech 8223",
      "sidewall": "ABS",
      "flexRange": "7–12（按体重及滑手需求定制）",
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "abilityLevel": "中级至高级",
      "customization": "板宽按靴码或需求调整；硬度按体重或需求调整；侧切按需求调整",
      "officialPrice": "USD 865",
      "priceMarket": "Donek 官方美国站基础定制价",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://donek.com/product/knapton/",
      "priceStatus": "官方美国站挂牌 USD 865，按 ECB 2026-10-14 参考汇率折算约 CNY 5,789.20；是基础定制价的地区参考，不是中国售价或最终成交价。定制参数、运费、税费及进口费用另计；官网要求订购前与工程人员确认参数。"
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
    "id": "01a13e3c-2c22-7a0f-8d1d-578606bc39cc",
    "slug": "donek-raven-custom-2026",
    "title": "Donek Raven 定制单板",
    "model": "Raven Custom",
    "year": 2026,
    "oneLiner": "Donek 全山地定制方向板，板头更宽以增加浮力，同时保留较易反脚滑行的轮廓；硬度按滑手体重设定，没有固定尺码表。",
    "priceMin": 5789,
    "priceMax": 5789,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "donek",
      "name": "Donek",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "按滑手尺寸和需求定制",
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "Aspen, poplar and ash laminates",
      "fiberglass": "Triaxial fiberglass",
      "base": "Perlatech 8223",
      "sidewall": "ABS",
      "flexRange": "5–6（随滑手体重调整）",
      "scenes": [
        "all-mountain",
        "carving",
        "powder",
        "freestyle"
      ],
      "customization": "板宽和硬度按滑手需求调整；产品介绍称侧切固定，但定制选项又列出可调侧切，订购前需向 Donek 确认。",
      "officialPrice": "USD 865",
      "priceMarket": "Donek 官方美国站基础定制价",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://donek.com/product/raven/",
      "priceStatus": "官方美国站挂牌 USD 865，按 ECB 2026-10-14 参考汇率折算 CNY 5,789.20；是基础定制价的地区参考，不是中国售价或最终成交价。最终尺寸、定制费用、运费、税费及进口费用需另行确认。"
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
        "value": "全山地 · 刻滑 · 野雪浮雪 · 自由式"
      }
    ]
  },
  {
    "id": "01a12e89-5c65-7722-9e9e-c2da6005f9a5",
    "slug": "gnu-rider-s-choice-2025",
    "title": "GNU Rider's Choice 2025",
    "model": "Rider's Choice",
    "year": 2025,
    "oneLiner": "非对称双向与 C2 Hybrid 全山自由式板；旧款滑测显示跳台和 switch 较突出，深粉雪与 jib 并非强项，25/26 款缺少同季独立滑测。",
    "priceMin": 5199,
    "priceMax": 5199,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/f3632d0ba392bbfdd7fa5058207227329d8eaeb106839dfe9ec237b64d54397b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.2,
    "editorialScores": {
      "park": 7.5,
      "float": 7,
      "value": 8,
      "response": 8,
      "stability": 8,
      "forgiveness": 6.5
    },
    "brand": {
      "slug": "gnu",
      "name": "GNU",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157.5,
      "effectiveEdge": 1200,
      "sidecutRadii": "7.8 / 8.2 m",
      "waistWidth": 255,
      "stanceSetback": 0,
      "profile": "C2 Hybrid / GNU C2x",
      "profileFamily": "hybrid",
      "shape": "非对称双向",
      "core": "3-D Delightwood Asym Chip",
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
      "warranty": 3,
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157.5cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1200mm"
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
    "id": "01a12e89-5c76-7408-be2e-8941db4fd272",
    "slug": "gray-despe-wood-2027",
    "title": "GRAY DESPE WOOD 2027",
    "model": "DESPE WOOD",
    "year": 2027,
    "oneLiner": "木芯与玻纤结构的刻滑入门取向型号，26/27 全长度更新为 Active Camber，并提供部分加宽尺寸。日本官方含税 MSRP ¥93,500，按 2026-10-02 参考汇率折算约 ¥3,968 CNY（非中国零售价）。",
    "priceMin": 3968,
    "priceMax": 3968,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b674104b55988029a0eb887c953a0a1771b69a1584bad7cfaed1781d9bcb9729.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 60.5,
    "editorialScores": {
      "park": 3.2,
      "float": 4.8,
      "value": 8,
      "response": 6.2,
      "stability": 6.4,
      "forgiveness": 7.4
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "148 / 153N / 154 / 158 / 159W / 162 / 163W",
      "effectiveEdge": 1320,
      "sidecutRadii": "8.8/8.2/9.2 m",
      "waistWidth": 252,
      "stanceSetback": 35,
      "profile": "Active Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "Paulownia / Lightweight Poplar Composite Core",
      "fiberglass": "2-ply 65/35 + 3-ply 50/50 fiberglass reinforcement",
      "base": "P-Tex 3000 Graphite Sintered",
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
    },
    "highlights": [
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1320mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "252mm"
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
    "id": "01a12e89-5c9a-7ee9-a233-a9b14a7bd104",
    "slug": "gray-desperado-ti-type-r-2027",
    "title": "GRAY DESPERADO Ti Type-R 2027",
    "model": "DESPERADO Ti Type-R",
    "year": 2027,
    "oneLiner": "面向高水平刻滑的锤头板，采用变截面多段侧切、Vario Camber 与 X 形 0.4 mm Titanal；26/27 目录列 11 个标准/宽版尺码，日本官方含税 MSRP ¥198,000–¥209,000（CNY 数值仅作汇率换算，不代表中国零售价）。",
    "priceMin": 8405,
    "priceMax": 8872,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/df09879956fb3a768e0c5b73a0c385aa557efa0685afd231b6d4ba9c2d8835e4.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.8,
    "editorialScores": {
      "park": 2.4,
      "float": 6,
      "value": 6,
      "response": 9.3,
      "stability": 9,
      "forgiveness": 4.4
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "154 IIIn / 155 III / 156 IIIw / 159 IV / 160 IVw / 166 Vw / 167 Vew / 172 VI / 173 VIew / 178 VII / 179 VIIew",
      "length": 167,
      "widthVariant": "wide",
      "effectiveEdge": 1490,
      "sidecutRadii": "13.2/12.6/14.0 m",
      "waistWidth": 270,
      "stanceSetback": 60,
      "profile": "Vario Camber",
      "profileFamily": "hybrid",
      "shape": "Directional Hammerhead / TripleRadius",
      "core": "Wood Core",
      "fiberglass": "玻纤夹层；X 形 0.4 mm Titanal（官方结构图）",
      "base": "IS7500 Graphite Sintered",
      "manufacturer": "GRAY SNOWBOARDS",
      "flex": 9.4,
      "stiffnessScale": "N / W / T 分别代表板头 / 腰部 / 板尾硬度；官方按尺码分别给值，不应用一个数字概括整板",
      "scenes": [
        "carving"
      ],
      "useCase": "偏向压雪道与硬雪上的高速刻滑、连续走刃和主动控弯",
      "useCaseLimit": "高硬度和强支撑需要稳定的换刃与压板能力；新手容错、道具公园或深粉雪浮力不是主要取向",
      "season": "2026–2027（26/27）",
      "sizingNote": "11 个尺码覆盖 154–179 cm；同长度含标准、Wide 与 Extra Wide 版本，选码需同时核对腰宽、靴底长度、体重和目标弯型",
      "edgeSpecNote": "官方资料的尺码表与产品说明对刃角标注存在差异；选购前应以对应尺码实物或厂商确认值为准",
      "flexNote": "当前选中 167 Vew 的官方分区硬度为 N 8.7 / W 9.4 / T 8.9（10 分制）；其余尺码请查看尺码表",
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "167cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1490mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "270mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5cb0-76c2-adb0-13ff36137ef8",
    "slug": "gray-dsprd-ti-iz-2027",
    "title": "GRAY DSPRD Ti [iz] 2027",
    "model": "DSPRD Ti [iz]",
    "year": 2027,
    "oneLiner": "26/27 锤头刻滑型号，将 IZANAS 纤维置于芯材下方，并结合上缘 Titanal 金属带、玻纤结构与聚酰胺顶片。日本官方含税 MSRP ¥154,000，按 2026-10-02 参考汇率折算约 ¥6,537 CNY（非中国零售价）。",
    "priceMin": 6537,
    "priceMax": 6537,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/194d18378686666c43b7da7b11fc83d5394bafa23631251d0692bc4bc7cba06e.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.6,
    "editorialScores": {
      "park": 2.6,
      "float": 5.5,
      "value": 6.8,
      "response": 9,
      "stability": 8.7,
      "forgiveness": 4.5
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "I / IIn / II / IIw / III / IIIw / IVw / IV / Vw",
      "length": 157,
      "effectiveEdge": 1360,
      "sidecutRadii": "9.8/9.2/10.4 m",
      "waistWidth": 246,
      "stanceSetback": 30,
      "profile": "Single Camber (IIw wide only: Vario Camber)",
      "profileFamily": "camber",
      "shape": "Directional Hammerhead / TripleRadius",
      "core": "Wood Core + IZANAS Fiber",
      "fiberglass": "Glass + IZANAS beneath core + upper-edge Titanal ribbon",
      "base": "IS7500 Graphite",
      "scenes": [
        "carving"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "1360mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "246mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      }
    ]
  },
  {
    "id": "01a12e89-5cc1-7ebd-80a8-c40cd61952c1",
    "slug": "gray-dsprd-ti-type-x-ver-s-2027",
    "title": "GRAY DSPRD Ti Type-X ver.S 2027",
    "model": "DSPRD Ti Type-X ver.S",
    "year": 2027,
    "oneLiner": "面向高水平竞赛刻滑的 26/27 款 Type-X，针对高速大角度走刃优化；ver.S 使用烧结表层配置。日本官方含税 MSRP ¥198,000，按 2026-10-02 参考汇率折算约 ¥8,405 CNY（非中国零售价）。",
    "priceMin": 8405,
    "priceMax": 8405,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/486fa3a50a555b1a1663ba9af546b83ef39c9ee549873acfb3f573a9ead313c9.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 61.8,
    "editorialScores": {
      "park": 2,
      "float": 5.1,
      "value": 5.9,
      "response": 9.6,
      "stability": 9.3,
      "forgiveness": 3.8
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "152 ver.S / 161 ver.S",
      "profile": "Vario Camber",
      "profileFamily": "camber",
      "shape": "Directional Hammerhead",
      "core": "STD Core II",
      "fiberglass": "2-ply 65/35 + 3-ply 50/50 Fiberglass",
      "scenes": [
        "carving"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5cd1-7d29-b096-7b0085e73ebb",
    "slug": "gray-epic-2027",
    "title": "GRAY EPIC 2027",
    "model": "EPIC",
    "year": 2027,
    "oneLiner": "中等硬度的高端全双向板，Active Camber 与多半径侧切兼顾灵活性和脚下抓边，适合道具、公园及自由式滑行。日本官方含税 MSRP ¥126,500，按 2026-10-02 参考汇率折算约 ¥5,370 CNY（非中国零售价）。",
    "priceMin": 5370,
    "priceMax": 5370,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/4355cce3a272c8ebaca6cc3dd45e50448d2cc279bd8419fdeb52fe7e48301a4a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71,
    "editorialScores": {
      "park": 8.2,
      "float": 5.8,
      "value": 7,
      "response": 7.6,
      "stability": 7.3,
      "forgiveness": 6.6
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "38 / 41 / 44 / 48 / 51 / 54 / 57",
      "profile": "Active Camber",
      "profileFamily": "hybrid",
      "shape": "True Twin",
      "core": "Super Light Core",
      "fiberglass": "Mesh Fiberglass Plate",
      "base": "IS 7500 Sintered Base",
      "scenes": [
        "freestyle",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5ce0-7cde-a3aa-596e76cac4a8",
    "slug": "gray-lovebuzz-58-2027",
    "title": "GRAY LOVEBUZZ 58 2027",
    "model": "LOVEBUZZ 58",
    "year": 2027,
    "oneLiner": "158cm 全山地自由滑型号，低拱、长板头、大侧切半径与新月形板尾，覆盖雪道巡航到粉雪地形。日本官方含税 MSRP ¥93,500，按 2026-10-02 参考汇率折算约 ¥3,968 CNY（非中国零售价）。",
    "priceMin": 3968,
    "priceMax": 3968,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/88b50407a40ba4b820f8e0536fee31331544dc77a443c6fb337d52fc0077bbc3.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.6,
    "editorialScores": {
      "park": 6.8,
      "float": 7.7,
      "value": 8,
      "response": 7,
      "stability": 7,
      "forgiveness": 7.2
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "158 cm",
      "length": 158,
      "profile": "Single Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "2-ply 50/50 Paulownia Core",
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5cf1-7d71-a5ff-1e887d506ac4",
    "slug": "gray-prodigy-2027",
    "title": "GRAY PRODIGY 2027",
    "model": "PRODIGY",
    "year": 2027,
    "oneLiner": "GRAY 旗舰方向双向板，玻纤与 X 形碳纤结构强调快速回弹、控制力与中高速稳定，覆盖自由式跳台和全山地滑行。日本官方含税 MSRP ¥126,500，按 2026-10-02 参考汇率折算约 ¥5,370 CNY（非中国零售价）。",
    "priceMin": 5370,
    "priceMax": 5370,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/39c7a3fee9a947f6a9e60d71cb13e5836081541e133cf14a0036410dfcfeef5f.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.4,
    "editorialScores": {
      "park": 8.4,
      "float": 5.2,
      "value": 7.2,
      "response": 8.5,
      "stability": 8,
      "forgiveness": 5.8
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "46.5 / 51.5 / 51.5w / 53.5 / 55.5 / 55.5w / 57.5 / 57.5w",
      "profile": "Single Camber",
      "profileFamily": "camber",
      "shape": "Directional Twin",
      "core": "STD Core II",
      "fiberglass": "Fiberglass + X-shaped Carbon Roving",
      "scenes": [
        "all-mountain",
        "freestyle",
        "carving"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a1428d-09d2-75c7-8793-51fc80c8fec3",
    "slug": "gray-sonicalmach-2027",
    "title": "GRAY SONICALMACH 2027",
    "model": "SONICALMACH",
    "year": 2027,
    "oneLiner": "GRAY 26/27 MACH 系列的现行官方名称为 SONICALMACH，与 SONICALMACH LT 分开列示；含中低速刻滑与地形技巧款，以及更偏高速刻滑的 ver.C 和长板。",
    "priceMin": 6631,
    "priceMax": 7145,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "46 / 51 / 54 / 55w / 54 ver.C / 55w ver.C / 58 / 60w / 63w",
      "profile": "Single Camber",
      "profileFamily": "camber",
      "shape": "Directional；Directional Flex（按尺码与型号组变化）",
      "insertQuantity": "12+12",
      "sidecutDesign": "TripleRadius（三段复合侧切）",
      "core": "木芯结构（结构随尺码）；芯材下方 X 形碳纤维配置",
      "base": "IS7500 Graphite",
      "manufacturer": "GRAY SNOWBOARDS",
      "topsheet": "标准尺码组 ABS；ver.C 与长板组 Polyamide",
      "edge": "1.8 mm stainless steel",
      "sidewallAngle": "25°",
      "sidewallColor": "NEON RED",
      "officialCoreConstructionLegend": "目录标注 2ply 65/35、STD Core II、3ply 50/50，构造随尺码变化，未强行映射到每个尺码。",
      "scenes": [
        "carving",
        "freestyle"
      ],
      "officialSkillLevels": "刻滑 8/10；速度 8/10；专家 7/10；中级 8/10；入门 5/10；硬度 5/10（GRAY 官方图示，不是用户评分）",
      "formerSeriesName": "MACH",
      "season": "2026–2027（26/27）",
      "sizingNote": "目录将标准尺码组与 ver.C / 长板组分开描述；详情页尺码表记录已核实的部分几何数据。",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://graysnowboards.co.jp/product/",
      "priceStatus": "按 2026-10-02 汇率 1 JPY = 0.042451 CNY 折算，CNY 6631–7145 为日元官方含税 MSRP 的币种换算参考，不是中国零售价；不同尺码及版本分组价格不同。"
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
    "id": "01a12e89-5d06-7c7e-a063-6f37ad5b1d09",
    "slug": "gray-sonicalmach-lt-2027",
    "title": "GRAY SONICALMACH LT 2027",
    "model": "SONICALMACH LT",
    "year": 2027,
    "oneLiner": "26/27 跑滑与地形技巧取向雪板，软硬度设计搭配杨木与竹复合板芯；不同长度对应双向、方向双向或定向板形。日本官方含税 MSRP ¥93,500，按 2026-10-02 参考汇率折算约 ¥3,968 CNY（非中国零售价）。",
    "priceMin": 3968,
    "priceMax": 3968,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/7abf4bca5e0d712ff41bd78f9228091c7cb7fee40ad2551fe5124c78f96487b1.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69.2,
    "editorialScores": {
      "park": 7.6,
      "float": 5.4,
      "value": 8,
      "response": 6.8,
      "stability": 6.6,
      "forgiveness": 7.2
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "146 / 151 / 152w / 154 / 155w / 156ew / 160w / 161ew",
      "profile": "Single Camber（26/27 在线型号图表；日文目录另列 Vario Camber，冲突待确认）",
      "profileFamily": "camber",
      "shape": "True Twin / Directional Twin / Directional（随长度变化）",
      "core": "Poplar + Bamboo Wood Core",
      "scenes": [
        "carving",
        "freestyle",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5d16-79c7-9d0d-125cecdda965",
    "slug": "gray-sonicalmach-lt-ver-c-2027",
    "title": "GRAY SONICALMACH LT ver.C 2027",
    "model": "SONICALMACH LT ver.C",
    "year": 2027,
    "oneLiner": "26/27 碳条强化版本，在杨木与竹复合板芯下配置碳纤维，提升回弹；官方列出 54、55W、56EW 三种宽度版本。日本官方含税 MSRP ¥99,000，按 2026-10-02 参考汇率折算约 ¥4,203 CNY（非中国零售价）。",
    "priceMin": 4203,
    "priceMax": 4203,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/cb8196953856fa1605d59ac2f53e013ce84d1c717ca362cd04f6fa7814ca150f.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70.2,
    "editorialScores": {
      "park": 7.6,
      "float": 5.4,
      "value": 7.5,
      "response": 7.8,
      "stability": 7.2,
      "forgiveness": 6.5
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "154 ver.C / 155w ver.C / 156ew ver.C",
      "profile": "Single Camber（26/27 在线型号图表；日文目录另列 Vario Camber，冲突待确认）",
      "profileFamily": "camber",
      "core": "Poplar + Bamboo Wood Core",
      "fiberglass": "Carbon strips beneath core + fiberglass laminate",
      "scenes": [
        "carving",
        "freestyle"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5d24-752a-816d-afedf4004655",
    "slug": "gray-tycoon-type-s-iz-2027",
    "title": "GRAY TYCOON Type-S [iz] 2027",
    "model": "TYCOON Type-S [iz]",
    "year": 2027,
    "oneLiner": "26/27 全金属夹层结合 Aspen 木芯下方 IZANAS 纤维的刻滑型号，官方称其兼顾金属切边感与受控回弹，并针对 ALLFLEX、VIST 等分离式底板测试。日本官方含税 MSRP ¥198,000，按 2026-10-02 参考汇率折算约 ¥8,405 CNY（非中国零售价）。",
    "priceMin": 8405,
    "priceMax": 8405,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/86666072f823058f142c5f872cf7b6c58f517e4fb2f45fac3846495c4aa006d5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 62.2,
    "editorialScores": {
      "park": 2,
      "float": 5.5,
      "value": 5.8,
      "response": 9.8,
      "stability": 9.4,
      "forgiveness": 3.4
    },
    "brand": {
      "slug": "gray",
      "name": "GRAY",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "163 / 185",
      "profile": "Vario Camber",
      "shape": "Directional Alpine",
      "core": "Aspen Wood Core + IZANAS Fiber",
      "fiberglass": "1-ply 65/35 Fiberglass (top and bottom)",
      "scenes": [
        "carving"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5d35-712e-97fd-8ca7ae19a5cc",
    "slug": "jones-dream-weaver-2-0-2027",
    "title": "Women's Dream Weaver 2.0 Snowboard 2027 | Jones",
    "model": "Dream Weaver 2.0",
    "year": 2027,
    "oneLiner": "偏野雪浮力的女款全山地日常板，形状兼顾雪道巡航、粉雪和多变地形。官网美区标价 $549.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b5da471e522153ab8175f515f9a0d61fe06ed8eb3fbe37bedb3ae9b8dd5dcf85.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74,
    "editorialScores": {
      "park": 7.4,
      "float": 8.1,
      "value": 7.3,
      "response": 7.2,
      "stability": 6.8,
      "forgiveness": 7.8
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 148,
      "effectiveEdge": 1120,
      "sidecut": 7.1,
      "waistWidth": 241,
      "stanceSetback": 20,
      "profile": "CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "Master Core（Paulownia / Poplar）",
      "fiberglass": "Biax",
      "base": "Sintered 8000",
      "weight": 2300,
      "scenes": [
        "all-mountain",
        "powder"
      ],
      "officialPrice": "USD 549.95",
      "priceMarket": "原币 USD；来源商店 www.jonessnowboards.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.jonessnowboards.com/en-int/products/womens-dream-weaver-20-snowboard",
      "priceStatus": "当前同名产品系列官方挂牌价，页面未确认本档案年份；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.1m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "241mm"
      }
    ]
  },
  {
    "id": "01a12e89-5d48-7524-8daa-3a770969cf18",
    "slug": "jones-flagship-2027",
    "title": "Men's Flagship Snowboard | Jones",
    "model": "Flagship",
    "year": 2027,
    "oneLiner": "以陡坡、深雪和技术型自由滑为核心的定向板，边刃支撑和粉雪浮力都偏强，适合有经验的全山滑手。",
    "priceMin": 5400,
    "priceMax": 5400,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c74841814f9e9e46555af058502ce8fd9cc9769053c183c643b5dd97085bc35d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.2,
    "editorialScores": {
      "park": 4.5,
      "float": 8.8,
      "value": 6.5,
      "response": 9,
      "stability": 9.2,
      "forgiveness": 5.8
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "151 / 154 / 156W / 158 / 159W / 161 / 162W / 164 / 165W / 167 / 169W / 172",
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
      ],
      "officialPrice": "USD 749.95",
      "priceMarket": "原币 USD；来源商店 www.jonessnowboards.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.jonessnowboards.com/en-int/products/mens-flagship-snowboard",
      "priceStatus": "当前同名产品系列官方挂牌价，页面未确认本档案年份；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
    "id": "01a12e89-5d57-7ac4-8ddb-402865ee99af",
    "slug": "jones-flagship-pro-2027",
    "title": "Jones Men's Flagship PRO Snowboard 2027",
    "model": "Flagship PRO",
    "year": 2027,
    "oneLiner": "面向专家级大山自由滑的超硬定向板，2027 款升级玄武岩交叉铺层；美国官网 MSRP $949.95，按项目 USD/CNY 7.2 参考汇率折算，非中国零售价。",
    "priceMin": 6840,
    "priceMax": 6840,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/6d009c80ce330ead4cfd9e1cbd021d7b0d7311ce7c060b18e36a8ccdc34d3460.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76.1,
    "editorialScores": {
      "park": 5.7,
      "float": 9,
      "value": 5.8,
      "response": 9.4,
      "stability": 9.3,
      "forgiveness": 5.8
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "154 / 158 / 159W / 161 / 162W / 164 / 165W",
      "length": 161,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5d63-70d2-83cc-5af23094e4bd",
    "slug": "jones-freecarver-6000s-2027",
    "title": "Freecarver 6000s Snowboard | Jones",
    "model": "Freecarver 6000s",
    "year": 2027,
    "oneLiner": "为整备雪道短半径压弯设计的全正拱刻滑板，转弯节奏紧凑、边刃反馈直接，适合专注 carving 的进阶滑手。",
    "priceMin": 5040,
    "priceMax": 5040,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b2889c408a3f8e6e11a24cac301bf336b76eb3647907ccc52a59f67661f358b6.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.4,
    "editorialScores": {
      "park": 3.8,
      "float": 4.8,
      "value": 6.8,
      "response": 9.2,
      "stability": 8.8,
      "forgiveness": 4.8
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "150N / 150 / 154N / 154 / 158N / 158 / 162",
      "length": 154,
      "widthVariant": "standard",
      "effectiveEdge": 1280,
      "sidecut": 6.5,
      "waistWidth": 263,
      "stanceSetback": 40,
      "profile": "True Medium Camber",
      "profileFamily": "camber",
      "shape": "Carving Directional",
      "core": "Power Core",
      "fiberglass": "Biax Fiberglass",
      "base": "Sintered 8000 Base",
      "weight": 3000,
      "flex": 6,
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "263mm"
      }
    ]
  },
  {
    "id": "01a12e89-5d6f-7574-98cd-28922f55a807",
    "slug": "jones-frontier-2-0-2027",
    "title": "Men's Frontier 2.0 Snowboard | Jones",
    "model": "Frontier 2.0",
    "year": 2027,
    "oneLiner": "适合整季日常使用的全山定向板，转弯直观、变化雪况中容易掌控，并能在新雪里提供足够浮力。",
    "priceMin": 3960,
    "priceMax": 3960,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/952112879186d7d4f3577da6e3b913d2f6f19d762453ae754d4749370fbc347e.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.9,
    "editorialScores": {
      "park": 5.8,
      "float": 7.8,
      "value": 8,
      "response": 7.5,
      "stability": 7.7,
      "forgiveness": 8
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "150 / 153 / 155W / 156 / 158W / 159 / 161W / 162 / 164W / 165 / 167W",
      "length": 159,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5d87-747d-9cb6-8469b9fef2db",
    "slug": "jones-hovercraft-2026",
    "title": "Jones Hovercraft 2.0 2026",
    "model": "Hovercraft 2.0",
    "year": 2026,
    "oneLiner": "浮雪的标杆。板头宽度和后移量让它在新雪里像船一样浮着，树林里转向比看起来灵活得多。",
    "priceMin": 6999,
    "priceMax": 6999,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/075ce31016ec0151aa5e672ffe4b788dfaefffd51a21c9832c388142f727be80.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 64.4,
    "editorialScores": {
      "park": 1.5,
      "float": 10,
      "value": 6,
      "response": 7,
      "stability": 8.5,
      "forgiveness": 5
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 160,
      "effectiveEdge": 1260,
      "sidecut": 9.3,
      "waistWidth": 267,
      "stanceSetback": 0,
      "profile": "Camber + 大勺形板头",
      "profileFamily": "hybrid",
      "shape": "强定向锥形",
      "core": "FSC 白杨 / 竹",
      "fiberglass": "Triax Basalt",
      "base": "烧结 9000",
      "weight": 3200,
      "flex": 7,
      "damping": 8,
      "pop": 5.5,
      "turnRadiusFeel": "深雪里灵活，硬雪面偏钝",
      "scenes": [
        "powder"
      ],
      "warranty": 3,
      "selectionNotes": "官方 J.26 型号页面；160 代表尺码后移按官方表由 50 mm 修正为 0 mm。该表只用于 2026，不填入 2027 档案。",
      "compatibilitySources": "https://www.jonessnowboards.com/en-int/products/hovercraft-20-snowboard",
      "officialPrice": "USD 649.95",
      "priceMarket": "原币 USD；来源商店 www.jonessnowboards.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.jonessnowboards.com/en-int/products/hovercraft-20-snowboard",
      "priceStatus": "当前同名产品系列官方挂牌价，页面未确认本档案年份；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
        "value": "1260mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "9.3m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "267mm"
      }
    ]
  },
  {
    "id": "01a12e89-5d7a-7e6a-a0e5-6ae991ba713e",
    "slug": "jones-hovercraft-2-0-2027",
    "title": "Hovercraft 2.0 Snowboard | Jones",
    "model": "Hovercraft 2.0",
    "year": 2027,
    "oneLiner": "体积偏移的冲浪感定向粉雪板，用更宽的板腰换取浮力和低速灵活性，适合深雪、林间和低角度地形。",
    "priceMin": 4680,
    "priceMax": 4680,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1a1ad2717a1f1f563d6dd342ca7ee5f57f269e6b6bc5c74e041bdd6c66a9d9ae.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.3,
    "editorialScores": {
      "park": 4.2,
      "float": 9.2,
      "value": 7,
      "response": 7.9,
      "stability": 8.1,
      "forgiveness": 7.2
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1225,
      "sidecut": 9,
      "waistWidth": 263,
      "stanceSetback": 0,
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
      ],
      "priceCheckedAt": "2026-10-14",
      "priceStatus": "现有 CNY 4680 缺少可核查的中国销售渠道与报价日期，仍未确认；不得视为已核实的中国售价。"
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
        "value": "1225mm"
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
    "id": "01a12e89-5d92-7809-acee-f43a91f1da4f",
    "slug": "jones-howler-2027",
    "title": "Men's Howler Snowboard | Jones",
    "model": "Howler",
    "year": 2027,
    "oneLiner": "把强力正拱和自由式动作结合起来的高响应定向板，适合在技术地形、跳台和高速巡航之间切换的高手。",
    "priceMin": 5040,
    "priceMax": 5040,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/58f5d080cafd622260a40b8326419e682ea8c036b244b3c63a8eb6e099d0c149.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.8,
    "editorialScores": {
      "park": 7,
      "float": 7.2,
      "value": 6.4,
      "response": 9.1,
      "stability": 9,
      "forgiveness": 5.6
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "152 / 155 / 157W / 158 / 160W / 161 / 163W / 164",
      "length": 158,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5da0-78cf-ba32-3fd1c4a682a0",
    "slug": "jones-mind-expander-2-0-2027",
    "title": "Mind Expander 2.0 Snowboard | Jones",
    "model": "Mind Expander 2.0",
    "year": 2027,
    "oneLiner": "用冲浪思路重塑全山线路的定向板，适合在粉雪、自然地形和自由式动作中寻找不同走线的进阶用户。",
    "priceMin": 4536,
    "priceMax": 4536,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/360e3f72af9f9cb8c86c24bd3c3fb19092ad6e41c320eb933b6339a1a26bbb67.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75,
    "editorialScores": {
      "park": 6,
      "float": 8.8,
      "value": 7.1,
      "response": 8,
      "stability": 8,
      "forgiveness": 6.9
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "142 / 146 / 150 / 154 / 158 / 162 / 166",
      "length": 154,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5dac-72ad-b3d0-d9c67782fed2",
    "slug": "jones-mountain-twin-2026",
    "title": "Jones Mountain Twin 2026",
    "model": "Mountain Twin",
    "year": 2026,
    "oneLiner": "全山地定向双向板，硬雪抓边、switch 与跳台都能兼顾；高速会有板头 chatter，粉雪浮力也不及专门 freeride 板。",
    "priceMin": 4553,
    "priceMax": 4553,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/02b43d707fe6db5f4505c8ae0fe25cb992a1689dec5052af31e4de45824bfa42.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.9,
    "editorialScores": {
      "park": 7.5,
      "float": 7.5,
      "value": 8,
      "response": 7.5,
      "stability": 8,
      "forgiveness": 7
    },
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
      "profile": "Camber + 板头板尾微摇臂",
      "profileFamily": "hybrid",
      "shape": "定向双向",
      "core": "Master Core（杨木 / 泡桐 1:1）",
      "fiberglass": "Biax + BComp Carbon/Flax Stringers",
      "base": "烧结 8000",
      "weight": 2800,
      "flex": 6,
      "damping": 7.5,
      "pop": 7,
      "turnRadiusFeel": "中性，长短弧都好带",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 3,
      "priceMarket": "Jones 日本官方站 HASCO 25/26 商品页，日元挂牌价折算参考",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.hasco.co.jp/jonessnowboards/products_list/mens-mountain-twin-2/",
      "priceStatus": "Jones 日本官方站由 HASCO 运营，25/26 Mountain Twin 页面列含税挂牌价 JPY 107,800；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 4,553.20。页面未显示逐码库存，作为日本地区官方参考价，不是中国售价或当前可购报价；未计跨境运费、进口税及汇兑成本。原瑞士官方 CHF 579.95 历史报价仍保留在原始审计记录中。"
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
    "id": "01a12e89-5dba-74a7-b683-6f5b1dd344a3",
    "slug": "jones-mountain-twin-2027",
    "title": "Men's Mountain Twin Snowboard | Jones",
    "model": "Mountain Twin",
    "year": 2027,
    "oneLiner": "面向整山和自由式切换的定向双向板，压雪、侧击和自然地形都能保持平衡，适合想用一块板覆盖大多数日子的滑手。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/0e16c4f2dea9727abf5acc606e85d3962bf2251671f588fa395bde16ec6346d6.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76,
    "editorialScores": {
      "park": 7.7,
      "float": 6.9,
      "value": 7.5,
      "response": 8.1,
      "stability": 8,
      "forgiveness": 7.2
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "149 / 151 / 153W / 154 / 156W / 157 / 158UW / 159W / 160 / 161UW / 162W / 163 / 164UW / 165W / 168W",
      "length": 157,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5dc6-772c-8e60-87bdbb6f8473",
    "slug": "jones-rally-cat-2027",
    "title": "Men's Rally Cat Snowboard | Jones",
    "model": "Rally Cat",
    "year": 2027,
    "oneLiner": "轻松、灵活且带有明显玩心的全山双向板，适合在压雪道、侧击和小型地形之间不断换线的用户。",
    "priceMin": 3600,
    "priceMax": 3600,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/e6d49c8b38643b54609a477bf232d0777474ef7486c564942f35d47af1284084.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.8,
    "editorialScores": {
      "park": 8.2,
      "float": 5.8,
      "value": 8.1,
      "response": 7.1,
      "stability": 6.9,
      "forgiveness": 8.3
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "151 / 154 / 155W / 156 / 158 / 159W / 161 / 162W / 166W / 170W",
      "length": 156,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5dd3-7e00-87a5-76f5935783d6",
    "slug": "jones-storm-chaser-2027",
    "title": "Storm Chaser Snowboard | Jones",
    "model": "Storm Chaser",
    "year": 2027,
    "oneLiner": "面向深雪循环的超宽体积偏移定向板，强调低角度浮力和冲浪感，同时保留硬雪上的基本转弯能力。",
    "priceMin": 5256,
    "priceMax": 5256,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/d5bdead8fea935fb7b3b26aaf3113d054bf2d38856a9fea6dfcdaa3ee67b5ae6.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.7,
    "editorialScores": {
      "park": 3.8,
      "float": 9.6,
      "value": 6.6,
      "response": 8,
      "stability": 8.2,
      "forgiveness": 7
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "142 / 147 / 152 / 157",
      "length": 152,
      "widthVariant": "standard",
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5ddf-73dc-a5a9-d156e1916c1d",
    "slug": "jones-twin-sister-2027",
    "title": "Women's Twin Sister Snowboard 2027 | Jones",
    "model": "Twin Sister",
    "year": 2027,
    "oneLiner": "Jones 女款全山地畅销双向板，CamRock 和中等硬度兼顾刻滑、自由式与新雪中的浮力。官网美区标价 $599.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/6f6326bca65a06535074a288f439e0eb93d797c1da6abeead4bd69f62d1fd4fb.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.3,
    "editorialScores": {
      "park": 8,
      "float": 6.8,
      "value": 6.5,
      "response": 8,
      "stability": 7.8,
      "forgiveness": 6.7
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "140 / 143 / 146 / 149 / 152 / 155",
      "length": 149,
      "widthVariant": "standard",
      "effectiveEdge": 1150,
      "sidecut": 7.2,
      "waistWidth": 244,
      "stanceSetback": 0,
      "profile": "CamRock",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "Master Core",
      "fiberglass": "Biax Fiberglass",
      "weight": 2400,
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "149cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1150mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "7.2m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "244mm"
      }
    ]
  },
  {
    "id": "01a12e89-5dee-79d7-b4c2-c3effec076f4",
    "slug": "k2-alchemist-2027",
    "title": "K2 Alchemist 2027",
    "model": "Alchemist",
    "year": 2027,
    "oneLiner": "2027 大改款旗舰定向 freeride 板，S1 Pro Core 与 Recess3D 减轻摆动感、提升腰尾部可操控性；仍偏硬，面向进阶/专家骑手。",
    "priceMin": 6120,
    "priceMax": 6120,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a25ccbec8346a173a485817fa57f3fd49fc134e58f0351953fc20610c7bc9958.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.1,
    "editorialScores": {
      "park": 4,
      "float": 8,
      "value": 5.7,
      "response": 9.1,
      "stability": 9,
      "forgiveness": 6
    },
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1190,
      "sidecut": 7.8,
      "waistWidth": 250,
      "stanceSetback": 19,
      "profile": "Directional Camber",
      "profileFamily": "camber",
      "shape": "Tapered Directional / Traditional Shape",
      "core": "S1 Pro Core（Bamboo / Aspen / Paulownia）",
      "fiberglass": "SpaceGlass 鼻部嵌件 / HyperWeave 全碳双轴编织 / Spectral Braid",
      "base": "Wax-Infused Sintered 4001",
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ],
      "officialPrice": "USD 849.95",
      "priceMarket": "原币 USD；来源商店 k2snow.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://k2snow.com/en-us/p/alchemist-mens-snowboard-kb262025",
      "priceStatus": "对应目标年份的官方页面挂牌价；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
    "id": "01a12e89-5dfc-7a47-942a-4f6bc7c96217",
    "slug": "k2-excavator-2027",
    "title": "K2 Excavator 2027",
    "model": "Excavator",
    "year": 2027,
    "oneLiner": "Volume Shift 短宽体定向板，双半径侧切兼顾压雪道深弯与粉雪浮力；官方建议较日常板长缩短约 5 cm 选码。",
    "priceMin": 4536,
    "priceMax": 4536,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1f137cea322389a1e1198db5d143d58e8b5273251c05c5c3e44ed68a553ae29b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.4,
    "editorialScores": {
      "park": 6,
      "float": 8.5,
      "value": 7.4,
      "response": 8.3,
      "stability": 8,
      "forgiveness": 6.8
    },
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
      "core": "S1 Core (Bamboo / Aspen / Paulownia)",
      "fiberglass": "ICG 10 Biax Glass With Carbon",
      "base": "Wax-Infused Sintered 4001",
      "scenes": [
        "carving",
        "powder",
        "all-mountain"
      ],
      "officialPrice": "USD 629.95",
      "priceMarket": "原币 USD；来源商店 k2snow.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://k2snow.com/en-us/p/excavator-unisex-snowboard-kb261687",
      "priceStatus": "对应目标年份的官方页面挂牌价；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
    "id": "01a12e89-5e0c-7071-8b54-5850c651c460",
    "slug": "k2-passport-2027",
    "title": "K2 Passport 2027",
    "model": "Passport",
    "year": 2027,
    "oneLiner": "8 mm taper 的定向全山板，偏向压雪道刻滑与轻至中等粉雪；板感灵活且较 damp，可用于一板多用，但不是专用深粉或公园板。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2eddafe9c81f1e39e8951c3fb7662bc88a04f6c2e0b823f74a7e187d821cd2e3.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.2,
    "editorialScores": {
      "park": 6.5,
      "float": 7,
      "value": 7.1,
      "response": 8.1,
      "stability": 7.9,
      "forgiveness": 7.6
    },
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "effectiveEdge": 1180,
      "sidecutRadii": "6.0/8.0/5.5 m",
      "waistWidth": 255,
      "stanceSetback": 19,
      "profile": "Directional Combination Camber",
      "profileFamily": "hybrid",
      "shape": "Tapered Directional / Traditional Shape",
      "core": "A1 Core (Bamboo / Aspen / Paulownia)",
      "fiberglass": "ICG 10 Triax Glass With Carbon",
      "base": "Sintered 4000",
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ],
      "officialPrice": "USD 599.95",
      "priceMarket": "原币 USD；来源商店 k2snow.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://k2snow.com/en-de/p/passport-unisex-snowboard-kb261689",
      "priceStatus": "对应目标年份的官方页面挂牌价；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
    "id": "01a12e89-5e1e-73ca-976a-9dabf678c543",
    "slug": "korua-shapes-cafe-racer-2026",
    "title": "Korua Shapes Cafe Racer 2026",
    "model": "Cafe Racer",
    "year": 2026,
    "oneLiner": "全长 Camber 为刻滑提供持续抓边，顺滑过渡的板头也为软雪保留浮力；它以刻滑为核心，同时覆盖全山地形。",
    "priceMin": 6899,
    "priceMax": 6899,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/d8c09c850d30af1d93d4b7dc03627129d75b680ec909c43605b8db77be4518b5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.4,
    "editorialScores": {
      "park": 2,
      "float": 8.5,
      "value": 5.5,
      "response": 8,
      "stability": 9.5,
      "forgiveness": 3.5
    },
    "brand": {
      "slug": "korua-shapes",
      "name": "Korua Shapes",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 159,
      "effectiveEdge": 1200,
      "sidecut": 8.2,
      "waistWidth": 269,
      "stanceSetback": 35,
      "profile": "全长 Camber（板头平顺过渡）",
      "profileFamily": "camber",
      "shape": "定向锥形",
      "core": "轻质杨木芯",
      "fiberglass": "Biaxial",
      "base": "高级烧结底板",
      "flex": 7.5,
      "damping": 8.5,
      "pop": 5,
      "turnRadiusFeel": "以刻滑长弧为主",
      "scenes": [
        "carving",
        "powder"
      ],
      "warranty": 2,
      "priceCheckedAt": "2026-10-02",
      "priceStatus": "种子人民币 6899 元未找到中国渠道报价；品牌加拿大官网 CAD 829 仅作地区参考，不能视为中国售价。"
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
        "value": "1200mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.2m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "269mm"
      }
    ]
  },
  {
    "id": "01a12e89-5e30-7c2d-93ac-7ae2bf917a56",
    "slug": "lib-tech-t-rice-pro-2025",
    "title": "Lib Tech T.Rice Pro 2025",
    "model": "T.Rice Pro",
    "year": 2025,
    "oneLiner": "品牌将 T.Rice Pro 定位为全山自由式 Twin，采用 C2 混合板型与 Horsepower 构造，主打公园及全山多用途；独立实测与若干遗留字段仍待核。",
    "priceMin": 5699,
    "priceMax": 5699,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a8186603b23857513633df1eb3c517420b91f8d6b4c9246d043bd9090e7673a8.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.4,
    "editorialScores": {
      "park": 9,
      "float": 6.5,
      "value": 7,
      "response": 8,
      "stability": 7.5,
      "forgiveness": 6
    },
    "brand": {
      "slug": "lib-tech",
      "name": "Lib Tech",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "sidecut": 8.2,
      "waistWidth": 258,
      "stanceSetback": 0,
      "profile": "C2 Hybrid（官方定位）",
      "profileFamily": "hybrid",
      "shape": "Twin（品牌分类；未核为 True Twin）",
      "core": "Aspen / Paulownia 混合",
      "fiberglass": "Biax + Triax",
      "base": "Sintered（官方描述：competition-ready）",
      "weight": 2890,
      "flex": 6.5,
      "damping": 7,
      "pop": 8.5,
      "turnRadiusFeel": "Magne-Traction® 波浪边刃",
      "scenes": [
        "freestyle",
        "all-mountain"
      ],
      "warranty": 3,
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "157cm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.2m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "258mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a13e3c-2c28-7d7d-a5d9-038a379c2eb3",
    "slug": "moss-snowstick-u4-2027",
    "title": "MOSS Snowstick U4 2027",
    "model": "Snowstick U4",
    "year": 2027,
    "oneLiner": "151 cm 短菱形尾全山地雪浪板，传统定向正拱风格，强调快速换刃、林间机动和粉雪中的自然浮力；官网页面采集时显示不可用。",
    "priceMin": 4646,
    "priceMax": 4646,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/746ed84634f0cf1ed9e30ded9886827fe99c9bfe544a3106d61d2b38ab9b0a4b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "moss",
      "name": "MOSS",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 151,
      "effectiveEdge": 1016,
      "runningLength": 828,
      "sidecutRadii": "9.0/6.17 m",
      "waistWidth": 262,
      "noseWidth": 310,
      "tailWidth": 293,
      "stanceWidth": 520,
      "stanceRange": "480–560 mm",
      "stanceSetback": -45,
      "profile": "Snowsurf Camber 3 mm",
      "profileFamily": "camber",
      "shape": "Directional tapered outline, short diamond-cut tail",
      "core": "Poplar and bamboo",
      "base": "ISO High-Speed Graphite",
      "flex": 6,
      "scenes": [
        "all-mountain",
        "powder",
        "carving"
      ],
      "officialPrice": "JPY 110000（含税）",
      "priceMarket": "MOSS Snowstick 官方日本站 2027 款建议价",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://mosssnowstick.com/products/u4-2027",
      "priceStatus": "官方日本站含税价 JPY 110,000，按 ECB 2026-10-14 参考汇率折算 CNY 4,646.12；不是中国售价或成交价。页面采集时商品状态为不可用，库存、跨境配送及进口费用未计。"
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
        "value": "1016mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "262mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      }
    ]
  },
  {
    "id": "01a13e3c-2c31-7fbf-982a-857a3829a805",
    "slug": "moss-snowstick-wing-sw-67-2027",
    "title": "MOSS Snowstick WING SW 67 2027",
    "model": "Snowstick WING SW 67",
    "year": 2027,
    "oneLiner": "167 cm 中长型燕尾方向板，面向粉雪浮力与雪道长弧滑行；官方页面抓取时标记为不可用。",
    "priceMin": 5322,
    "priceMax": 5322,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/65e6dce9bb23078d7f53fa151000ded140c1d390ee373c9e0b47edb7c6545b7e.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "moss",
      "name": "MOSS",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 167,
      "effectiveEdge": 1080,
      "runningLength": 962,
      "sidecutRadii": "9.2/8.6 m",
      "waistWidth": 265,
      "noseWidth": 304,
      "tailWidth": 286,
      "stanceWidth": 520,
      "stanceRange": "460–580 mm",
      "stanceSetback": -39,
      "profile": "Snowsurf Camber 4 mm",
      "profileFamily": "camber",
      "shape": "Directional Swallowtail with wing shape",
      "core": "Poplar and bamboo",
      "base": "ISO High-Speed Graphite",
      "flex": 7,
      "scenes": [
        "powder",
        "all-mountain",
        "carving"
      ],
      "officialPrice": "JPY 126000（含税）",
      "priceMarket": "MOSS Snowstick 官方日本站 2027 款建议价",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://mosssnowstick.com/products/wing-sw-67-2027",
      "priceStatus": "官方日本站含税价 JPY 126,000，按 ECB 2026-10-14 参考汇率折算约 CNY 5,321.92；不是中国售价或成交价，页面采集时商品状态为不可用，库存、跨境配送和进口费用未计。"
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "167cm"
      },
      {
        "key": "effectiveEdge",
        "label": "有效边刃",
        "value": "1080mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "265mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      }
    ]
  },
  {
    "id": "01a12e89-5e40-7f06-a916-51ecc9b95363",
    "slug": "never-summer-proto-slinger-2025",
    "title": "Never Summer Proto Slinger 2025",
    "model": "Proto Slinger",
    "year": 2025,
    "oneLiner": "偏软、易压且有弹性的公园向双向板；非对称侧切帮助换刃和 carving，日常雪道可用，但不应把它当作深粉雪或高速刻滑专板。",
    "priceMin": 5499,
    "priceMax": 5499,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1827082f43c40f1e0dc1e0c633ab0d4ab7698915bc618352985c433cfa9fe6ff.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.9,
    "editorialScores": {
      "park": 9,
      "float": 5.5,
      "value": 7.5,
      "response": 8.5,
      "stability": 7,
      "forgiveness": 8
    },
    "brand": {
      "slug": "never-summer",
      "name": "Never Summer",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1190,
      "sidecutRadii": "8.18 / 7.36 m (VARIO; source order)",
      "waistWidth": 253,
      "stanceSetback": 0,
      "profile": "Original Rocker Camber（Shock Wave Rocker Camber）",
      "profileFamily": "hybrid",
      "shape": "不对称双向",
      "core": "NS Superlight Wood Core（白杨/泡桐/桦木）",
      "fiberglass": "Carbon VXR Laminate Technology",
      "base": "烧结 DuraSurf XT 5501",
      "flex": 4,
      "damping": 4,
      "pop": 8,
      "turnRadiusFeel": "非对称侧切帮助快速换刃，板感偏软、易压板",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 3,
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "1190mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "253mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "混合拱"
      }
    ]
  },
  {
    "id": "01a12e89-5e4e-7cdc-b7ee-80fdef4b55ad",
    "slug": "nitro-alternator-2027",
    "title": "Nitro Alternator 2027",
    "model": "Alternator",
    "year": 2027,
    "oneLiner": "定向全山自由式板，传统正拱与中宽腰设计面向山地跳跃、刻滑和变化雪况。Nitro 官方商品目录价 $599.90，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 4319,
    "priceMax": 4319,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1a2e886008c2bc389acddaf7c17b3da89b6709d77b4bc9afad6e8453d0d63537.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.4,
    "editorialScores": {
      "park": 7.6,
      "float": 7.2,
      "value": 7.4,
      "response": 8.4,
      "stability": 8.2,
      "forgiveness": 6.2
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "154 / 157 / 160 / 162",
      "length": 157,
      "widthVariant": "standard",
      "sidecutRadii": "10.8 / 6.8 / 10.8 m",
      "waistWidth": 254,
      "stanceSetback": -15,
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
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5e5b-7c52-8188-b571ea659d90",
    "slug": "nitro-banker-2027",
    "title": "Nitro Banker Snowboard 2027",
    "model": "Banker",
    "year": 2027,
    "oneLiner": "面向全山高速刻滑与粉雪地形的定向板，采用 True Camber、Powercore II 与烧结底板；官方标注硬度 8/10。",
    "priceMin": 5204,
    "priceMax": 5204,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9fc70b396b47956fa0693692808324dccb5b8f62ff9df132aaf6c14180dbc967.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75,
    "editorialScores": {
      "park": 6.7,
      "float": 7.5,
      "value": 7.3,
      "response": 8.7,
      "stability": 8.6,
      "forgiveness": 5.8
    },
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
      ],
      "priceMarket": "日本 Murasaki Sports 26/27 预售页；税含报价，非中国市场售价",
      "priceCheckedAt": "2026-10-02",
      "priceSource": "https://www.murasaki.jp/Form/Product/ProductDetail.aspx?bid=snow&pid=n05430101019993",
      "priceStatus": "日本零售商 2026/27 预售价 JPY 123,200（含税），按 ECB 2026-10-14 汇率折算 CNY 5,203.65。日本地区参考，不是中国售价或成交价；预售库存、跨境运输及进口费用未计。美国经销页面另列 USD 639.95，官方欧洲页列 EUR 649.90，地区价格不混用。来源与换算见 data/raw/snowboard/nitro/banker-price-conversion-2026-10-15.json。"
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
    "id": "01a12e89-5e68-7fcf-9ce0-8d07c3d20d06",
    "slug": "nitro-beast-2026",
    "title": "Nitro Beast 2026",
    "model": "Beast",
    "year": 2026,
    "oneLiner": "25/26 款高响应公园自由式板，True Camber 与 Twin 板型强调弹性、控刃和耐用性；零售 MSRP $689.95，按项目参考汇率 1 USD=¥7.2 折算约 ¥4,968 CNY。",
    "priceMin": 4968,
    "priceMax": 4968,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/35e5b15095418ad17d8c5d18a6bf69e6744209364d5290d8d339e48767aa850b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.2,
    "editorialScores": {
      "park": 9.2,
      "float": 5.4,
      "value": 6.4,
      "response": 9,
      "stability": 8.1,
      "forgiveness": 4.9
    },
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
      ],
      "selectionNotes": "2026 官方逐码表保留 mw 标记；未随意指定代表尺寸。",
      "compatibilitySources": "https://www.nitrosnowboards.com/products/beast-snowboard",
      "officialPrice": "EUR 729.9",
      "priceMarket": "原币 EUR；来源商店 www.nitrosnowboards.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/beast-snowboard",
      "priceStatus": "对应目标年份的官方页面挂牌价；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
    "id": "01a12e89-5e74-74fb-8f96-2056615dac46",
    "slug": "nitro-team-2026",
    "title": "Nitro Team 2026",
    "model": "Team",
    "year": 2026,
    "oneLiner": "25/26 Team 采用 Trüe Camber 与 Directional Twin 结构，强调全山控制和弹性，同时覆盖公园与多种雪况。",
    "priceMin": 4599,
    "priceMax": 4599,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/0e363238aa12c13ccbfb8e7d1e2e7a36243d19c22b2376ea30e623cddae8a9f8.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.9,
    "editorialScores": {
      "park": 7.5,
      "float": 6.5,
      "value": 9,
      "response": 7.5,
      "stability": 7.5,
      "forgiveness": 7
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 157,
      "runningLength": 1170,
      "sidecutRadii": "11.3 / 7.3 / 11.3 m",
      "waistWidth": 252,
      "stanceSetback": 15,
      "profile": "Trüe Camber",
      "profileFamily": "camber",
      "shape": "Directional Twin",
      "core": "Powerlite Core",
      "fiberglass": "Bi-Lite Laminates",
      "base": "Sintered EcoSpeed HD Base",
      "flex": 7,
      "damping": 7,
      "pop": 7.5,
      "turnRadiusFeel": "中性偏快，好带",
      "scenes": [
        "all-mountain",
        "freestyle"
      ],
      "warranty": 2,
      "selectionNotes": "2025–2026 Nitro 厂商经销目录（零售商托管）第 36 页复核；后移表原文 -15 mm，沿用本档案后移量 15 mm 的记法。多段半径完整保留；1170 mm 为 running length，不再误作有效刃长；目录未给整板重量，删除无官方依据的 2810 g。官网出现 157W，但该目录没有对应行，未补造。",
      "compatibilitySources": "https://www.nitrosnow.ca/products/2026-team；https://golgoda.com/PDF/25-26%20NITRO_compressed.pdf",
      "officialPrice": "CAD 455",
      "priceMarket": "原币 CAD；来源商店 www.nitrosnow.ca",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnow.ca/products/2026-team",
      "priceStatus": "对应目标年份的官方页面挂牌价；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
        "value": "252mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "7/10"
      }
    ]
  },
  {
    "id": "01a13e3c-2c39-7a73-af8a-665da52823a3",
    "slug": "nobaday-blackboard-6-sky-mirror-2026",
    "title": "NOBADAY 小黑板 Blackboard 6.0 Sky Mirror Carving",
    "model": "Blackboard 6.0 Sky Mirror Carving",
    "year": 2026,
    "oneLiner": "面向刻滑和全山地的方向性板，采用 Flat-Out-Camber、碳纤维补强与白杨木/山毛榉板芯；官网同页对硬度标注不一致，故不录入单一硬度值。",
    "priceMin": 4344,
    "priceMax": 4344,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a6df544f6ad74b03cd589389f6afc296b305d968355b55c74ab84aa6d59c27c0.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nobaday",
      "name": "NOBADAY",
      "nameCn": "小黑板"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "147 / 152 / 155 / 156W / 159 / 161W / 163W",
      "profile": "Flat-Out-Camber",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "Poplar and beech wood core",
      "fiberglass": "800g biaxial fiberglass",
      "base": "IS7500 sintered graphite",
      "construction": "2 X-shaped 25 mm carbon stringers; ICP2115 high-gloss mirror topsheet",
      "scenes": [
        "all-mountain",
        "carving"
      ],
      "brandStyleRatings": "全山地 6/10；刻滑 9/10；粉雪 5/10；平花 4/10；公园 8/10（品牌自评）",
      "officialPrice": "USD 649",
      "priceMarket": "NOBADAY 官方美国站",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://nobaday.com/products/blackboard-6-sky-mirror-carving-snowboard",
      "priceStatus": "官方美国站挂牌 USD 649，按 ECB 2026-10-14 参考汇率折算 CNY 4,343.58；不是中国售价或成交价，税费、跨境配送和进口费用未计。"
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
        "value": "全山地 · 刻滑"
      }
    ]
  },
  {
    "id": "01a13e3c-2c40-7afc-a01e-105710a60c8c",
    "slug": "nobaday-blackboard-pro-5-camber-2026",
    "title": "NOBADAY 小黑板 Blackboard Pro 5.0 Camber",
    "model": "Blackboard Pro 5.0 Camber",
    "year": 2026,
    "oneLiner": "全山地 True Twin 正拱板，官方标注硬度 5/10，尺码表提供 142–161 cm 八个长度；产品页未注明雪季。",
    "priceMin": 2670,
    "priceMax": 2670,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ff3fd3c93fedf493da9effca6c21e9e40a6fd7faf588da3534a879e0657cdaad.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nobaday",
      "name": "NOBADAY",
      "nameCn": "小黑板"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "142 / 145 / 148 / 151 / 153 / 155 / 157 / 161",
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "True Twin",
      "core": "Poplar wood core",
      "fiberglass": "Triax laminated fiberglass",
      "base": "IS7500 sintered graphite",
      "construction": "14 carbon stringers; PU sidewalls",
      "flex": 5,
      "scenes": [
        "all-mountain",
        "carving",
        "freestyle"
      ],
      "officialPrice": "USD 399",
      "priceMarket": "NOBADAY 官方美国站",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://nobaday.com/products/nbd-camber-snowboard",
      "priceStatus": "官方美国站挂牌 USD 399，按 ECB 2026-10-14 参考汇率折算约 CNY 2,670.40；不是中国售价或成交价，税费、跨境配送和进口费用未计。产品页未注明雪季。官方尺码表没有列出尾宽，故不补录。"
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
        "value": "5/10"
      },
      {
        "key": "scenes",
        "label": "适用场景",
        "value": "全山地 · 刻滑 · 自由式"
      }
    ]
  },
  {
    "id": "01a12e89-5e83-7586-a13f-cd92006ed30f",
    "slug": "ogasaka-ct-2026",
    "title": "OGASAKA CT 2026",
    "model": "CT",
    "year": 2026,
    "oneLiner": "面向从初级到高水平滑手的全能刻滑板，方向性板型与较均衡的软硬设定兼顾刻滑和日常滑行；25/26 官方含税价 ¥114,400，按 2026-10-02 参考汇率折算约 ¥4,856 CNY。",
    "priceMin": 4856,
    "priceMax": 4856,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/4c125496ae4d2c0a611612d05e50314a0b03337f270d99704fe06d5d62fb278b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.4,
    "editorialScores": {
      "park": 5.6,
      "float": 6,
      "value": 7.4,
      "response": 8.4,
      "stability": 8,
      "forgiveness": 7.5
    },
    "brand": {
      "slug": "ogasaka",
      "name": "OGASAKA",
      "nameCn": "小贺坂"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 156,
      "effectiveEdge": 1240,
      "sidecut": 8.4,
      "sidecutRadii": "8.7/8.4/8.7 m",
      "waistWidth": 247,
      "stanceSetback": 18,
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "Directional",
      "core": "NV Core",
      "fiberglass": "Glass Fiber Carbon Composite",
      "base": "Sintered Graphite",
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-15",
      "priceStatus": "2026-10-15 复核 OGASAKA 官方 25/26 CT 页：标准版含税 JPY 114,400、宽版含税 JPY 116,600。本档案代表 156 cm 标准版，按 2026-10-02 JPY/CNY 0.042451 折算为 CNY 4,856；这是日本官方挂牌价的历史汇率估值，不是中国售价，未核到中国销售报价或当前库存。"
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
        "value": "1240mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "8.4m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "247mm"
      }
    ]
  },
  {
    "id": "01a12e89-5e96-7d12-a472-5f0ff24e82c1",
    "slug": "ogasaka-fc-2026",
    "title": "OGASAKA FC 2026",
    "model": "FC",
    "year": 2026,
    "oneLiner": "半锤头轮廓的自由式刻滑板，长有效边刃强调抓雪和弯中稳定；25/26 官方 157cm 含税价 ¥126,500，按 2026-10-02 参考汇率折算约 ¥5,370 CNY。",
    "priceMin": 5370,
    "priceMax": 5370,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/437b293c6a43b1f4f810733495cfcc855b4c3d459da93886929fd96324fcb96e.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.6,
    "editorialScores": {
      "park": 3.4,
      "float": 5.8,
      "value": 6.8,
      "response": 9.2,
      "stability": 9,
      "forgiveness": 4.7
    },
    "brand": {
      "slug": "ogasaka",
      "name": "OGASAKA",
      "nameCn": "小贺坂"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "145 / 148 / 151 / 154 / 157 / 160 / 163 / 157W / 160W / 163W",
      "length": 157,
      "effectiveEdge": 1280,
      "sidecutRadii": "8.8/8.4 m",
      "waistWidth": 249,
      "stanceSetback": 28,
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "Directional Semi-Hammerhead",
      "core": "OGK2 Core",
      "fiberglass": "Glass Fiber + Carbon Ribbon Wide",
      "base": "Sintered Graphite",
      "scenes": [
        "carving",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-15",
      "priceStatus": "2026-10-15 复核 OGASAKA 官方 25/26 FC 页：标准版含税 JPY 126,500、宽版含税 JPY 128,700。本档案代表 157 cm 标准版，按 2026-10-02 JPY/CNY 0.042451 折算为 CNY 5,370；这是日本官方挂牌价的历史汇率估值，不是中国售价，未核到中国销售报价或当前库存。"
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
    "id": "01a1428d-09d9-7960-8cf8-205277ea7423",
    "slug": "ogasaka-fc-s-2027",
    "title": "OGASAKA FC-S 2027",
    "model": "FC-S",
    "year": 2027,
    "oneLiner": "26/27 FC 系列专家级刻滑板，针对高速推进和稳定性设计；官方称 S 指 Stiff，并更新了 flex balance。建议有成熟压弯能力的进阶滑手试板后选择。",
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": null,
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66,
    "editorialScores": {
      "park": 3.2,
      "float": 5.5,
      "value": 6.5,
      "response": 9.4,
      "stability": 9.3,
      "forgiveness": 4.5
    },
    "brand": {
      "slug": "ogasaka",
      "name": "OGASAKA",
      "nameCn": "小贺坂"
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "150 / 156 / 159 / 162 / 165 / 157W / 160W / 163W",
      "length": 162,
      "effectiveEdge": 1370,
      "sidecutRadii": "8.4 / 8.9 / 9.5 m",
      "waistWidth": 257,
      "noseWidth": 310,
      "tailWidth": 306,
      "stanceWidth": 560,
      "stanceSetback": 33,
      "profile": "Camber",
      "profileFamily": "camber",
      "shape": "自由式刻滑 / FC 系列专家型号",
      "contactLength": 1280,
      "core": "OGK2 Core",
      "fiberglass": "Glass Fiber + Carbon Sheet Wide",
      "base": "Sintered Graphite",
      "topsheet": "PA",
      "edge": "Stainless",
      "pcPlate": "Type-S",
      "soleFinish": "Stone Finish（convex sole）",
      "scenes": [
        "carving"
      ],
      "abilityLevel": "高阶至专家",
      "flexNote": "偏硬；26/27 官方标注 NEW FLEX，未给出可跨品牌比较的数值硬度",
      "officialPrice": "JPY 137,500（标准版含税）；宽版 JPY 139,700（含税）",
      "priceCheckedAt": "2026-10-15",
      "priceStatus": "OGASAKA 官方 26/27 页面公布标准版含税价 JPY 137,500、宽版含税价 JPY 139,700。本档案尺寸表展示标准宽 162 cm 版本，未换算为人民币；尚未核实中国大陆到手价及实时库存。"
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
        "value": "1370mm"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "257mm"
      },
      {
        "key": "profileFamily",
        "label": "板型族",
        "value": "正拱 Camber"
      }
    ]
  },
  {
    "id": "01a12e89-5ea6-7ef2-987f-37247da367c7",
    "slug": "ogasaka-shin-2026",
    "title": "OGASAKA SHIN 2026",
    "model": "SHIN",
    "year": 2026,
    "oneLiner": "SHIN 160 是介于 156 与 167 之间的中长全能粉雪板，较 156 浮力更强、比 167 更易操控，也面向希望兼顾刻滑的滑手；日本官网 25/26 含税价 ¥121,000，按 2026-10-02 汇率折算约 ¥5,137 CNY，仅为汇率估值，不是中国售价。",
    "priceMin": 5137,
    "priceMax": 5137,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2307fc308389eeaa60ae1e83e044f9812b0bd95abd5ba49b8cc228253afec480.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.9,
    "editorialScores": {
      "park": 5.5,
      "float": 9,
      "value": 6.8,
      "response": 8.1,
      "stability": 7.9,
      "forgiveness": 6.8
    },
    "brand": {
      "slug": "ogasaka",
      "name": "OGASAKA",
      "nameCn": "小贺坂"
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 160,
      "effectiveEdge": 1190,
      "sidecut": 9,
      "waistWidth": 260,
      "stanceSetback": 20,
      "shape": "Directional",
      "core": "OGK2 Core",
      "fiberglass": "Glass Fiber Carbon Composite + Carbon Sheet Wide",
      "base": "Sintered Graphite",
      "scenes": [
        "powder",
        "all-mountain"
      ],
      "priceCheckedAt": "2026-10-15",
      "priceStatus": "2026-10-15 复核 OGASAKA 官方 25/26 SHIN 160 页：含税日本挂牌价 JPY 121,000；按 2026-10-02 JPY/CNY 0.042451 折算为 CNY 5,137。这是日本官方挂牌价的历史汇率估值，不是中国售价，未核到中国销售报价或当前库存。"
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
        "value": "1190mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "9m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "260mm"
      }
    ]
  },
  {
    "id": "01a12e89-5eb5-7b3c-a5ff-a7247d9e9563",
    "slug": "ride-algorythm-2026",
    "title": "Ride Algorhythm 2026",
    "model": "Algorhythm",
    "year": 2026,
    "oneLiner": "全山定向双向板，官方定位覆盖公园跳台、粉雪线路与高速压雪道。",
    "priceMin": 7299,
    "priceMax": 7299,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/70b77c4babd31c9a422de3df4a7e754a15d35d66a52b92a5075f283ab9e70f12.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.6,
    "editorialScores": {
      "park": 2.5,
      "float": 9.5,
      "value": 5,
      "response": 8.5,
      "stability": 9,
      "forgiveness": 4
    },
    "brand": {
      "slug": "ride",
      "name": "Ride",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 160,
      "widthVariant": "wide",
      "effectiveEdge": 1197,
      "sidecut": 6.9,
      "sidecutRadii": "9.4 / 6.9 / 9.4 m",
      "waistWidth": 264,
      "stanceSetback": 19,
      "profile": "Standard Camber",
      "profileFamily": "camber",
      "shape": "Directional Twin",
      "core": "Performance Core（Aspen / Bamboo / Paulownia）",
      "fiberglass": "Pre-Cured Glass + Carbon Array 5 + Double Impact Plates",
      "base": "Sintered 4000",
      "flex": 8,
      "damping": 9,
      "pop": 6,
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ],
      "warranty": 3,
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "1197mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "6.9m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "264mm"
      }
    ]
  },
  {
    "id": "01a12e89-5ec3-707d-ac72-9926179b6868",
    "slug": "ride-deep-fake-2027",
    "title": "RIDE Deep Fake Snowboard 2027",
    "model": "Deep Fake",
    "year": 2027,
    "oneLiner": "高阶定向全山板，主打快速换刃、硬雪抓边与粉雪浮力；美国官网 MSRP $799.95，按项目 USD/CNY 7.2 参考汇率折算，非中国零售价。",
    "priceMin": 5760,
    "priceMax": 5760,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/e6a37ebbd613fcaeac96c72881cdd74ec4d863f71df27c7e74c180bdc74da434.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69.8,
    "editorialScores": {
      "park": 4.2,
      "float": 7.3,
      "value": 6.1,
      "response": 9,
      "stability": 9,
      "forgiveness": 5.4
    },
    "brand": {
      "slug": "ride",
      "name": "Ride",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "144 / 148 / 151 / 155 / 157 / 159 / 162 / 157W / 161W / 165W",
      "length": 157,
      "widthVariant": "standard",
      "effectiveEdge": 1190,
      "sidecutRadii": "9.8 / 6.7 / - m（entry / focus / exit；- 表示未提供）",
      "waistWidth": 251,
      "stanceSetback": -19,
      "profile": "Directional Extra Camber",
      "profileFamily": "hybrid",
      "shape": "Directional",
      "core": "Performance Core（白杨 / 竹 / 泡桐）",
      "fiberglass": "Pre-Cured Glass",
      "base": "Sintered Low Friction Race Base",
      "scenes": [
        "all-mountain",
        "powder"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5ed0-74aa-8257-73186424b8cc",
    "slug": "ride-warpig-2027",
    "title": "RIDE WARPIG Snowboard 2027",
    "model": "WARPIG",
    "year": 2027,
    "oneLiner": "宽体积短板型定向全山板，兼顾压雪道刻滑、跳台和粉雪；美国官网 MSRP $599.95，按项目 USD/CNY 7.2 参考汇率折算，非中国零售价。",
    "priceMin": 4320,
    "priceMax": 4320,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/be11885d5082fc848f39a5ea71cb22c7cc7aea1a0b9f4d26725a622ec66772d1.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 77.1,
    "editorialScores": {
      "park": 7.3,
      "float": 8.4,
      "value": 7.7,
      "response": 7.9,
      "stability": 7.7,
      "forgiveness": 7.3
    },
    "brand": {
      "slug": "ride",
      "name": "Ride",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "X-SMALL (142) / SMALL (148) / MEDIUM (151) / LARGE (154) / X-LARGE (158)",
      "length": 154,
      "widthVariant": "standard",
      "effectiveEdge": 1146,
      "sidecutRadii": "5.6 / - / 6.9 m（entry / focus / exit；- 表示未提供）",
      "waistWidth": 270,
      "stanceSetback": 0,
      "profile": "Zero Camber",
      "shape": "Directional volume-shifted",
      "core": "Performance Core（白杨 / 竹 / 泡桐）",
      "fiberglass": "Hybrid Glass",
      "base": "Sintered 4000",
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ],
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
    "id": "01a12e89-5edc-7b6d-b677-41d66bc9b82d",
    "slug": "salomon-assassin-2026",
    "title": "Salomon Assassin 2026",
    "model": "Assassin",
    "year": 2026,
    "oneLiner": "面向全山日常滑行的多用途板，方向性双向板型与 Rock Out Camber 兼顾浮雪、刻滑和自由式；25/26 MSRP $649.95，按项目参考汇率 1 USD=¥7.2 折算约 ¥4,680 CNY。",
    "priceMin": 4680,
    "priceMax": 4680,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b288f7269ace1a28363bd532998d20c1bff2abd5f7098a2c12ca13544ccaa983.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.7,
    "editorialScores": {
      "park": 8.1,
      "float": 6.8,
      "value": 7.1,
      "response": 7.8,
      "stability": 7.7,
      "forgiveness": 7.2
    },
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
      ],
      "selectionNotes": "2025/26 官方技术册第 117 页列出 150/153/156/159/162/165 和 158W/163W/168W。W 为加宽尺码；板重为各长度目录标称值。结合雪鞋外壳、体重和站姿选择，不把板腰单一参考值套用到所有尺码。",
      "compatibilitySources": "https://cdn.shopify.com/s/files/1/0673/9981/1381/files/FW25_digitalcatalogue_techbook.pdf?v=1736124811；https://salomon.jp/pages/snowboard-catalog",
      "officialPrice": "USD 649.95",
      "priceMarket": "原币 USD；来源商店 www.salomon.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.salomon.com/en-us/product/assassin-li1300",
      "priceStatus": "当前同名产品系列官方挂牌价，页面未确认本档案年份；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
    "id": "01a12e89-5eeb-7bb5-8226-c15114de635e",
    "slug": "salomon-assassin-pro-2027",
    "title": "Salomon Assassin Pro 2027",
    "model": "Assassin Pro",
    "year": 2027,
    "oneLiner": "全山与自由式兼顾的进阶型号，Rock Out Camber、Ghost Carbon Beams 与 Gunslinger Sidewalls 面向高响应滑行。2027 美区零售标价 $699.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 5040,
    "priceMax": 5040,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1efb095cdfb623634af524cc131ab467bbb636d256ba1764037812beed6c4a77.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76.6,
    "editorialScores": {
      "park": 8,
      "float": 7.4,
      "value": 6.3,
      "response": 8.8,
      "stability": 8.6,
      "forgiveness": 6.5
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "150 / 153 / 156 / 158W / 159 / 162 / 163W",
      "length": 150,
      "sidecut": 7.3,
      "waistWidth": 248,
      "profile": "Rock Out Camber",
      "profileFamily": "hybrid",
      "shape": "Directional Twin",
      "core": "Ghost Green Core / Popster Core",
      "fiberglass": "BIAX HD fiberglass",
      "base": "Sintered EG",
      "scenes": [
        "all-mountain",
        "freestyle",
        "powder"
      ],
      "officialPrice": "USD 699.95",
      "priceMarket": "原币 USD；来源商店 www.salomon.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.salomon.com/en-us/product/assassin-pro-li1301",
      "priceStatus": "当前同名产品系列官方挂牌价，页面未确认本档案年份；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
    },
    "highlights": [
      {
        "key": "length",
        "label": "长度",
        "value": "150cm"
      },
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
      }
    ]
  },
  {
    "id": "01a12e89-5efc-7006-bc6d-1d4949fdee05",
    "slug": "salomon-huck-knife-2027",
    "title": "Salomon Huck Knife 2027",
    "model": "Huck Knife",
    "year": 2027,
    "oneLiner": "以跳台、道具和公园自由式为主的真双向板，Quad Camber 取向强调弹性、响应和落地稳定。2027 美区零售标价 $579.95，按项目 USD/CNY 目录汇率折算。",
    "priceMin": 4176,
    "priceMax": 4176,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1e06ff852a64926f551ae81131e9aaeac2304dc742ade051706734ea402713de.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.3,
    "editorialScores": {
      "park": 9,
      "float": 4.8,
      "value": 7.1,
      "response": 8,
      "stability": 7.4,
      "forgiveness": 6.3
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "lengthOptions": "149 / 153 / 156 / 156W / 159 / 159W / 162",
      "length": 156,
      "sidecut": 7.5,
      "waistWidth": 255,
      "profile": "Quad Camber",
      "profileFamily": "camber",
      "shape": "True Twin",
      "core": "Popster；Basalt Booster",
      "fiberglass": "TRIAX HD 玻纤；30% 生物基树脂",
      "base": "Sintered",
      "scenes": [
        "freestyle"
      ],
      "officialPrice": "USD 579.95",
      "priceMarket": "原币 USD；来源商店 www.salomon.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.salomon.com/en-us/product/huck-knife-li1304",
      "priceStatus": "当前同名产品系列官方挂牌价，页面未确认本档案年份；可能含促销与变体价，不视为中国零售价或建议零售价。 现有人民币参考价未重新核实。"
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
        "value": "7.5m"
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
      }
    ]
  },
  {
    "id": "01a12e89-5f09-7dee-ad18-459f5f329e07",
    "slug": "salomon-sight-2026",
    "title": "Salomon Sight 2026",
    "model": "Sight",
    "year": 2026,
    "oneLiner": "偏全山与轻 freeride 的锥形定向板；Cross Profile 面向压雪稳定，Royal Cork Pads 帮助过滤硬雪振动。",
    "priceMin": 3299,
    "priceMax": 3299,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/663b8dfdb51ac74ec6712372e656d6f1be84df6c880993d2d11bb1e4aa9d8036.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.2,
    "editorialScores": {
      "park": 5,
      "float": 6,
      "value": 9,
      "response": 5,
      "stability": 5.5,
      "forgiveness": 9.5
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard",
    "specs": {
      "length": 153,
      "effectiveEdge": 1160,
      "sidecut": 6.8,
      "waistWidth": 250,
      "stanceSetback": 20,
      "profile": "Cross Profile Camber",
      "profileFamily": "hybrid",
      "shape": "锥形定向（Tapered Directional）",
      "core": "Aspen Strong Core",
      "fiberglass": "BA MD Fiberglass",
      "base": "Extruded EG",
      "weight": 2680,
      "flex": 4,
      "damping": 5.5,
      "pop": 4.5,
      "turnRadiusFeel": "Quadratic，易于入弯与换刃",
      "scenes": [
        "beginner",
        "all-mountain"
      ],
      "warranty": 2,
      "selectionNotes": "Salomon FW25 技术目录 PDF 第 11 页、印刷页 118，逐码复核；原文靴码数值保留单位，不解释为实测鞋底长度。",
      "compatibilitySources": "https://salomon.jp/pages/snowboard-catalog；https://cdn.shopify.com/s/files/1/0673/9981/1381/files/FW25_digitalcatalogue_techbook.pdf?v=1736124811",
      "priceCheckedAt": "2026-10-12",
      "priceStatus": "现有人民币参考价缺少可核查的中国销售渠道与报价日期，本轮未确认；不能视为已核实官方价格。"
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
        "value": "1160mm"
      },
      {
        "key": "sidecut",
        "label": "侧切半径",
        "value": "6.8m"
      },
      {
        "key": "waistWidth",
        "label": "板腰宽",
        "value": "250mm"
      }
    ]
  },
  {
    "id": "01a12e89-5f17-726d-ae23-1055118dc24d",
    "slug": "burton-cartel-re-flex-2027",
    "title": "Burton Cartel Re:Flex 2027",
    "model": "Cartel Re:Flex",
    "year": 2027,
    "oneLiner": "Cartel 系列通用安装版本，官方定位为兼顾响应与多场景的全能固定器。",
    "priceMin": 1951,
    "priceMax": 1951,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/adc2c69b5b161ef60a3628eabe2ca8b8524dc5599e7bd989abf4f9d128a9ac30.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex；兼容主要雪板安装系统。Burton 3D 系统需另购 3D Hinge Disc（不含）",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "30% 短切玻纤/尼龙复合材料",
      "ankleStrap": "Hammockstrap 2.0",
      "toeStrap": "Supergrip Capstrap",
      "buckles": "Smooth Glide",
      "bindingSizeGuide": "S：男靴 US 6–8 / EU 38–41；M：US 8–11 / EU 41–44；L：US 10+ / EU 43+",
      "highback": "单一组件结构",
      "highbackAdjustment": "DialFLAD 前倾角调节",
      "cushioning": "Re:Flex FullBED 全掌缓震",
      "terrain": [
        "all-mountain"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "按本型号官方表核对雪鞋 US 或 EU 码；男靴 US 8 与 10–11、女靴 US 9 与 11 分别落入相邻两档。重叠码不能仅按鞋码唯一选定，应以实际雪鞋试装并检查鞋底居中、绑带余量和后跟贴合。安装孔位按随附 Re:Flex 圆盘核对；Burton 3D 系统需另购适配圆盘。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-cartel-re-flex-snowboard-bindings-105391",
      "sizeChartScope": "官方推荐范围重叠：男靴 US 8 同属 S/M，US 10–11 同属 M/L；女靴 US 9 同属 S/M、US 11 同属 M/L。此表不是唯一尺码映射，须用实际雪鞋试装。",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.burton.com/en-au/products/mens-burton-cartel-re-flex-snowboard-bindings-105391",
      "seasonEvidence": "Burton 日本官方商品页标题标注 2027，色款代码为 27WIN-105391；据此归档为 2026/27（2027 款）。页面未直接写完整雪季日期；代码不代表首次上市时间或实时库存。",
      "priceMarket": "Burton 日本官方商店；型号 ID 105391、色款标识 27WIN-105391",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/en-jp/products/mens-burton-cartel-re-flex-snowboard-bindings-105391",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 105391 / 色款标识 27WIN-105391，标价 JPY 46,200；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 1,951.37。页面列出 S/M/L，S 码当时显示售罄。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
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
    "id": "01a12e89-5f23-72c2-a616-b1df14e2f6f3",
    "slug": "burton-cartel-x-re-flex-2027",
    "title": "Burton Cartel X Re:Flex 2027",
    "model": "Cartel X Re:Flex",
    "year": 2027,
    "oneLiner": "Cartel X 通用安装版本，面向需要更强支撑和控制的全山地滑行。",
    "priceMin": 2230,
    "priceMax": 2230,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/573be82c5f6f0dd038a567bc0a46a592d7bdb157f136aa99b44ea977d3389410.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 8.5,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "stiff",
      "mountingSystem": "Re:Flex：兼容主流雪板安装系统；旧款 Burton 3D 板需另购 3D Hinge Disc",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "45% 短切玻纤/尼龙复合材料",
      "ankleStrap": "Hammockstrap 2.0",
      "toeStrap": "Supergrip Capstrap 2.0",
      "buckles": "Smooth Glide 卡扣",
      "bindingSizeGuide": "Burton 男款官方尺码：S US 男靴 6–8 / EU 38–41；M 8–11 / EU 41–44；L 10+ / EU 43+",
      "highback": "Heel Hammock",
      "highbackAdjustment": "DialFLAD 前倾角调节",
      "cushioning": "Re:Flex FullBED 全掌缓震",
      "terrain": [
        "all-mountain",
        "freestyle",
        "freeride"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "按官方表核对雪鞋 US/EU 码；男靴 US 8 与 10–11、女靴 US 9 与 11 落入相邻两档，重叠码须用实际雪鞋试装，检查底盘承托、鞋头/后跟居中及绑带余量。雪板安装孔位按随附 Re:Flex 圆盘核对。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-cartel-x-re-flex-snowboard-bindings-222301",
      "sizeChartScope": "官方推荐范围重叠：男靴 US 8 同属 S/M，US 10–11 同属 M/L；女靴 US 9 同属 S/M、US 11 同属 M/L。此表不是唯一尺码映射，须用实际雪鞋试装。",
      "seasonEvidence": "Burton 日本官方商品页标题标注 2027，色款代码为 27WIN-222301；据此归档为 2026/27（2027 款）。页面未直接写完整雪季日期；代码不代表首次上市时间或实时库存。",
      "priceMarket": "Burton 日本官方商店；型号 ID 222301、色款标识 27WIN-222301",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/en-jp/products/mens-burton-cartel-x-re-flex-snowboard-bindings-222301",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 222301 / 色款标识 27WIN-222301，标价 JPY 52,800；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 2,230.14。页面列出 S/M/L，S 码当时显示售罄。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
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
        "value": "全山地 · 自由式 / 公园 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a12e89-5f31-775c-b590-6d1a1ae002b9",
    "slug": "burton-freestyle-re-flex-2027",
    "title": "Burton Freestyle Re:Flex 2027",
    "model": "Freestyle Re:Flex",
    "year": 2027,
    "oneLiner": "偏柔和脚感的传统绑带款，适合自由式与日常全山地使用。",
    "priceMin": 1022,
    "priceMax": 1022,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/75d68b76a300e1a6a50fda97d9c7cba301d37a465a1d6c3c75ef9b5515215c68.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex：兼容主流雪板安装系统；旧款 Burton 3D 板需另购 3D Hinge Disc",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Bomb-Proof 聚碳酸酯",
      "ankleStrap": "Reactstrap",
      "toeStrap": "Supergrip Capstrap",
      "buckles": "Smooth Glide 卡扣",
      "bindingSizeGuide": "Burton 男款官方尺码：S US 男靴 6–8 / EU 38–41；M 8–11 / EU 41–44；L 10+ / EU 43+",
      "highbackAdjustment": "MicroFLAD 前倾角调节",
      "cushioning": "Re:Flex FullBED 全掌缓震",
      "terrain": [
        "all-mountain",
        "freestyle",
        "freeride"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "按官方表核对雪鞋 US/EU 码；男靴 US 8 与 10–11、女靴 US 9 与 11 落入相邻两档，重叠码须用实际雪鞋试装，检查底盘承托、鞋头/后跟居中及绑带余量。雪板安装孔位按随附 Re:Flex 圆盘核对。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-freestyle-re-flex-snowboard-bindings-105441",
      "sizeChartScope": "官方推荐范围重叠：男靴 US 8 同属 S/M，US 10–11 同属 M/L；女靴 US 9 同属 S/M、US 11 同属 M/L。此表不是唯一尺码映射，须用实际雪鞋试装。",
      "seasonEvidence": "Burton 日本官方商品页标题标注 2027，色款代码为 27WIN-105441；据此归档为 2026/27（2027 款）。页面未直接写完整雪季日期；代码不代表首次上市时间或实时库存。",
      "priceMarket": "Burton 日本官方商店；型号 ID 105441、色款标识 27WIN-105441",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/mens-burton-freestyle-re-flex-snowboard-bindings-105441",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 105441 / 色款标识 27WIN-105441，标价 JPY 24,200；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 1,022.15。页面列出 S/M/L 尺码；具体库存以购买时选中的尺码为准。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计。"
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
        "value": "全山地 · 自由式 / 公园 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a12e89-5f40-7182-ac48-6161f27eb0ba",
    "slug": "burton-genesis-re-flex-2027",
    "title": "Burton Genesis Re:Flex 2027",
    "model": "Genesis Re:Flex",
    "year": 2027,
    "oneLiner": "采用 Genesis 缓震结构的绑带款，主打舒适脚感与全山地性能。",
    "priceMin": 2788,
    "priceMax": 2788,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/0a40d5f379bc1b90555df9f9cdc37d26d8341decc69a28239445d15e8a13b624.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.2,
    "editorialScores": {
      "value": 5,
      "comfort": 7.4,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex：兼容主流雪板安装系统；旧款 Burton 3D 板需另购 3D Hinge Disc",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "30% 短切玻纤/尼龙复合材料",
      "ankleStrap": "Hammockstrap",
      "toeStrap": "Supergrip Capstrap 2.0",
      "buckles": "Double Take 卡扣",
      "bindingSizeGuide": "Burton 男款官方尺码：S US 男靴 6–8 / EU 38–41；M 8–11 / EU 41–44；L 10+ / EU 43+",
      "highback": "Kickback Hammock",
      "highbackAdjustment": "MicroFLAD 前倾角调节",
      "cushioning": "Re:Flex FullBED 全掌缓震；B3 凝胶缓震",
      "terrain": [
        "all-mountain"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "按官方表核对雪鞋 US/EU 码；男靴 US 8 与 10–11、女靴 US 9 与 11 落入相邻两档，重叠码须用实际雪鞋试装，检查底盘承托、鞋头/后跟居中及绑带余量。雪板安装孔位按随附 Re:Flex 圆盘核对。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-genesis-re-flex-snowboard-bindings-105471",
      "sizeChartScope": "官方推荐范围重叠：男靴 US 8 同属 S/M，US 10–11 同属 M/L；女靴 US 9 同属 S/M、US 11 同属 M/L。此表不是唯一尺码映射，须用实际雪鞋试装。",
      "seasonEvidence": "Burton 日本官方商品页标题标注 2027，色款代码为 27WIN-105471；据此归档为 2026/27（2027 款）。页面未直接写完整雪季日期；代码不代表首次上市时间或实时库存。",
      "priceMarket": "Burton 日本官方商店；型号 ID 105471、色款标识 27WIN-105471",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/mens-burton-genesis-re-flex-snowboard-bindings-105471",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 105471 / 色款标识 27WIN-105471，标价 JPY 66,000；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 2,787.67。页面列出 S/M/L，S 码当时显示售罄。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
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
    "id": "01a12e89-5f4d-7ba1-80e7-f5d56c0bec25",
    "slug": "burton-lexa-x-est-2027",
    "title": "Burton Lexa X EST 2027",
    "model": "Lexa X EST",
    "year": 2027,
    "oneLiner": "Burton 女款 Lexa X EST 固定器，EST 结构对应 The Channel 安装系统。",
    "priceMin": 2230,
    "priceMax": 2230,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/d2fa9970b3902899fc5f687582d32d36f290844f12b2bae3238525dfe1a2f6f1.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.4,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 8.5,
      "convenience": 6.2,
      "versatility": 6.8
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "stiff",
      "mountingSystem": "EST：仅适用于 Burton The Channel 雪板；底部无硬件，支持更灵活的站姿调节",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "30% 短切玻纤/尼龙复合材料",
      "ankleStrap": "非对称 Hammockstrap",
      "toeStrap": "Supergrip Capstrap 2.0",
      "buckles": "Double Take 卡扣",
      "bindingSizeGuide": "Burton 女款官方尺码：S US 女靴 4–6 / EU 34–36.5；M 6–8 / EU 36.5–40；L 8+ / EU 40+",
      "highback": "Heel Hammock",
      "highbackAdjustment": "DialFLAD 前倾角调节，可调至零前倾",
      "cushioning": "FullBED 全掌缓震",
      "terrain": [
        "freeride",
        "carving"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "按女靴尺码查官方表；US 6 同属 S/M、US 8 同属 M/L，男靴 US 7 也同时落在 M/L。重叠码须用实际雪鞋试装，确认底盘承托、居中和绑带位置。此 EST 版本仅适用于 Burton The Channel，不适用于普通四孔雪板。",
      "compatibilitySources": "https://www.burton.com/en-us/products/womens-burton-lexa-x-est-snowboard-bindings-222331",
      "sizeChartScope": "官方推荐范围在边界码重叠：女靴 US 6 同属 S/M、US 8 同属 M/L；男靴 US 7 同属 M/L。不得把推荐区间当作唯一映射；用实际雪鞋试装并核对 EST 与板面 The Channel 兼容。",
      "seasonEvidence": "Burton 日本官方商品页标题标注 2027，色款代码为 27WIN-222331；据此归档为 2026/27（2027 款）。页面未直接写完整雪季日期；代码不代表首次上市时间或实时库存。",
      "officialPrice": "USD 349.95",
      "priceMarket": "Burton 日本官方商店；型号 ID 222331、色款标识 27WIN-222331",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/en-jp/products/womens-burton-lexa-x-est-snowboard-bindings-222331",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 222331 / 色款标识 27WIN-222331，标价 JPY 52,800；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 2,230.14。页面列出 S/M/L，S、L 码当时显示售罄。EST 版本仅适用于 Burton The Channel 安装系统。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
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
        "value": "野雪 / freeride · 刻滑"
      }
    ]
  },
  {
    "id": "01a12e89-5f5a-775f-a6a3-0b9449a5e3ba",
    "slug": "burton-mission-re-flex-2027",
    "title": "Burton Mission Re:Flex 2027",
    "model": "Mission Re:Flex",
    "year": 2027,
    "oneLiner": "Burton 入门进阶全山地绑带款，官方强调缓震与通用安装兼容。",
    "priceMin": 1626,
    "priceMax": 1626,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/4db9551d14d6b2f0f18c6789cec73ec31629138b3d1fd558f1aa7aa803862700.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex：兼容主流雪板安装系统；旧款 Burton 3D 板需另购 3D Hinge Disc",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "30% 短切玻纤/尼龙复合材料",
      "ankleStrap": "Reactstrap",
      "toeStrap": "Supergrip Capstrap",
      "buckles": "Smooth Glide 卡扣",
      "bindingSizeGuide": "Burton 男款官方尺码：S US 男靴 6–8 / EU 38–41；M 8–11 / EU 41–44；L 10+ / EU 43+",
      "highbackAdjustment": "DialFLAD 前倾角调节；高背可独立调节前倾与旋转",
      "cushioning": "Re:Flex FullBED 全掌缓震",
      "terrain": [
        "all-mountain"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "按官方表核对雪鞋 US/EU 码；男靴 US 8 与 10–11、女靴 US 9 与 11 落入相邻两档，重叠码须用实际雪鞋试装，检查底盘承托、鞋头/后跟居中及绑带余量。雪板安装孔位按随附 Re:Flex 圆盘核对。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-mission-re-flex-snowboard-bindings-105461",
      "sizeChartScope": "官方推荐范围重叠：男靴 US 8 同属 S/M，US 10–11 同属 M/L；女靴 US 9 同属 S/M、US 11 同属 M/L。此表不是唯一尺码映射，须用实际雪鞋试装。",
      "seasonEvidence": "Burton 日本官方商品页标题标注 2027，色款代码为 27WIN-105461；据此归档为 2026/27（2027 款）。页面未直接写完整雪季日期；代码不代表首次上市时间或实时库存。",
      "priceMarket": "Burton 日本官方商店；型号 ID 105461、色款标识 27WIN-105461",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/mens-burton-mission-re-flex-snowboard-bindings-105461",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 105461 / 色款标识 27WIN-105461，标价 JPY 38,500；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 1,626.14。页面列出 S/M/L，M、L 码当时显示售罄。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
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
    "id": "01a12e89-5f67-7d31-bf08-97978bae36bf",
    "slug": "burton-step-on-genesis-re-flex-2027",
    "title": "Burton Step On Genesis Re:Flex 2027",
    "model": "Step On Genesis Re:Flex",
    "year": 2027,
    "oneLiner": "结合 Step On 快穿与 Genesis 缓震结构；Re:Flex 安装兼容多种雪板系统。",
    "priceMin": 2788,
    "priceMax": 2788,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/88b7dad386e556f3c92687b1ffe577b4f02a8a3743dcc91cdf7cde0de515c2b9.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 7.3,
      "convenience": 8.8,
      "versatility": 6.8
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "step-in",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex：兼容主流雪板安装系统；旧款 Burton 3D 板需另购 3D Hinge Disc",
      "bootCompatibility": "仅配认证 Step On 专用雪鞋；男/女/儿童系列及固定器尺码必须匹配，不能使用普通绑带雪鞋。",
      "baseplateMaterial": "30% 短切玻纤/尼龙复合材料",
      "bindingSizeGuide": "Burton 男款 Step On 官方靴码：S US 6–8 / EU 38–41；M 8.5–10.5 / EU 41.5–43.5；L 11–13 / EU 44–46；XL 14–15 / EU 47–48。仅配对应男款 Step On 雪鞋",
      "highback": "Kickback Hammock",
      "highbackAdjustment": "DialFLAD 前倾角调节",
      "cushioning": "Re:Flex FullBED 全掌缓震",
      "terrain": [
        "all-mountain"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "只配 Burton 男款 Step On 雪鞋，并按 Step On 专用表逐半码对应；US 男 8 对 S、8.5 对 M，尺码档之间不重叠。试装确认前掌和后跟连接点正确扣合；不能使用普通绑带雪鞋。安装孔位按 Re:Flex 圆盘核对，旧款 Burton 3D 板需另购适配圆盘。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-step-on-genesis-re-flex-snowboard-bindings-229601；https://www.burton.com/en-us/pages/size-charts",
      "sizeChartScope": "男款 Step On 推荐范围按半码衔接、无重叠：US 6–8、8.5–10.5、11–13、14–15。必须匹配男款 Step On 雪鞋尺码；不得套用普通 Re:Flex 固定器尺码表。",
      "seasonEvidence": "Burton 日本官方商品页标题标注 2027，色款代码为 27WIN-229601；据此归档为 2026/27（2027 款）。页面未直接写完整雪季日期；代码不代表首次上市时间或实时库存。",
      "priceMarket": "Burton 日本官方商店；型号 ID 229601、色款标识 27WIN-229601",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/en-jp/products/mens-burton-step-on-genesis-re-flex-snowboard-bindings-229601",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 229601 / 色款标识 27WIN-229601，标价 JPY 66,000；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 2,787.67。页面列出 S/M/L/XL，XL 码当时显示售罄。仅兼容 Step On 雪鞋；税费口径以结账为准。此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
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
    "id": "01a12e89-5f73-746f-80f8-c2d81dd8f025",
    "slug": "burton-step-on-re-flex-2027",
    "title": "Burton Step On Re:Flex 2027",
    "model": "Step On Re:Flex",
    "year": 2027,
    "oneLiner": "Step On 快穿系统的 Re:Flex 版本，须与 Step On 雪鞋配套使用。",
    "priceMin": 1812,
    "priceMax": 1812,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/55e4c6a7eca7f8b6cea2ab884fac547d73aa7866b0ed99dae630e01b0a85f35d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 7.3,
      "convenience": 8.8,
      "versatility": 6.8
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "step-in",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex：兼容主流雪板安装系统；旧款 Burton 3D 板需另购 3D Hinge Disc",
      "bootCompatibility": "仅配认证 Step On 专用雪鞋；男/女/儿童系列及固定器尺码必须匹配，不能使用普通绑带雪鞋。",
      "baseplateMaterial": "30% 短切玻纤/尼龙复合材料",
      "bindingSizeGuide": "Burton 男款 Step On 官方靴码：S US 6–8 / EU 38–41；M 8.5–10.5 / EU 41.5–43.5；L 11–13 / EU 44–46；XL 14–15 / EU 47–48。仅配对应男款 Step On 雪鞋",
      "highbackAdjustment": "Step On FLAD 前倾角调节",
      "cushioning": "Re:Flex FullBED 全掌缓震",
      "terrain": [
        "all-mountain"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "只配 Burton 男款 Step On 雪鞋，并按 Step On 专用表逐半码对应；US 男 8 对 S、8.5 对 M，尺码档之间不重叠。试装确认前掌和后跟连接点正确扣合；不能使用普通绑带雪鞋。安装孔位按 Re:Flex 圆盘核对，旧款 Burton 3D 板需另购适配圆盘。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-step-on-re-flex-snowboard-bindings-172831；https://www.burton.com/en-us/pages/size-charts",
      "sizeChartScope": "男款 Step On 推荐范围按半码衔接、无重叠：US 6–8、8.5–10.5、11–13、14–15。必须匹配男款 Step On 雪鞋尺码；不得套用普通 Re:Flex 固定器尺码表。",
      "seasonEvidence": "Burton 日本官方商品页标题标注 2027，色款代码为 27WIN-172831；据此归档为 2026/27（2027 款）。页面未直接写完整雪季日期；代码不代表首次上市时间或实时库存。",
      "priceMarket": "Burton 日本官方商店；型号 ID 172831、色款标识 27WIN-172831",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/mens-burton-step-on-re-flex-snowboard-bindings-172831",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 172831 / 色款标识 27WIN-172831，标价 JPY 42,900；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 1,811.99。页面列出 S/M/L/XL，XL 码当时显示售罄。仅兼容 Step On 雪鞋；税费口径以结账为准。此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
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
    "id": "01a13d55-1a90-760d-9cc7-8a52ab032375",
    "slug": "burton-step-on-re-flex-womens-2027",
    "title": "Burton Women's Step On Re:Flex 2027",
    "model": "Women's Step On Re:Flex",
    "year": 2027,
    "oneLiner": "女款 Step On 快穿固定器，尺码需与女款 Step On 雪鞋对应；不得与男款 Step On 产品混搭。",
    "priceMin": 1812,
    "priceMax": 1812,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/5522809370067831cb865b394d24f6543db331c494028e1eed0151e374a2314e.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "step-in",
      "flexFeel": "medium",
      "mountingSystem": "Re:Flex：兼容当前主流雪板安装系统；2014 年前 Burton 3D 板需另购 3D Hinge Disc",
      "bootCompatibility": "仅兼容女款 Burton Step On 雪鞋；Burton 明确警示勿与男款 Step On 产品混搭。",
      "baseplateMaterial": "18% 短切玻纤/尼龙复合材料",
      "bindingSizeGuide": "Burton 女款 Step On 官方靴码：S 女靴 US 5–6 / EU 35–36.5；M 6.5–8.5 / EU 37–40.5；L 9–11 / EU 41–42。另有多个 CN 标注列，详见来源审计，不合并成单一换算。仅配对应女款 Step On 雪鞋。",
      "highbackAdjustment": "Step On FLAD 前倾角调节",
      "cushioning": "Re:Flex FullBED 全掌缓震",
      "terrain": [
        "all-mountain"
      ],
      "warranty": "底盘终身保修；绑带和高背自购买日起 1 年保修",
      "selectionNotes": "只配女款 Burton Step On 雪鞋，按专用表逐半码对应并试装确认前掌/后跟连接点扣合；尺码范围不与相邻档重叠。不得与男款或普通绑带产品混搭。Re:Flex 安装盘适配当前主流安装系统，2014 年前 Burton 3D 板需单独购买 3D Hinge Disc。",
      "compatibilitySources": "https://www.burton.com/en-us/products/womens-burton-step-on-re-flex-snowboard-bindings-172841；https://www.burton.com/en-us/pages/size-charts",
      "sizeChartScope": "女款 Step On 推荐 US 靴码按半码衔接、无重叠：5–6、6.5–8.5、9–11。必须匹配女款 Step On 雪鞋；Burton 原厂另列的 CN 标记列口径不同，不作为单一换算。",
      "seasonEvidence": "Burton 美国与日本官方商品页均标注 2027；日本官方变体代码为 27WIN-172841，归档为 2026/27（2027 款）。",
      "priceMarket": "Burton 日本官方商店；型号 ID 172841、色款标识 27WIN-172841",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/womens-burton-step-on-re-flex-snowboard-bindings-172841",
      "priceStatus": "Burton 日本官方商品页对应 2026/27 款型号 ID 172841 / 色款标识 27WIN-172841，标价 JPY 42,900；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 1,811.99。Murasaki Sports 日本零售预售页对 26-27 款 Black/S 列价 JPY 42,900，并显示 2026 年 11 月至 12 月下旬到货；该“在库あり”为可预订状态，不等于现货即时发货。虎窝淘聚合页列 CNY 2,598，标题匹配 26/27 与 172841，并称来源店为天猫 BURTON 官方旗舰店；其购买入口连续进入淘宝 s.click JavaScript 跳转包装页，未到达可读天猫详情，因此只记为国内价格候选。京东索引另出现同季、同型号 SKU 1728416FBJRG 的 S/M 选中变体，但未返回可读人民币价格或库存；不能据此确认候选价。主参考仍是日本地区价格，非中国售价；跨境配送、税费和进口费用另计。"
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
    "id": "01a12e89-5f80-7b2c-8a42-b42fe45d9cfc",
    "slug": "decathlon-snb-500-binding-2026",
    "title": "Decathlon SNB 500 2026",
    "model": "SNB 500",
    "year": 2026,
    "oneLiner": "国内京东可见 200+ 条评论的入门全山地款；官方列出 EVA 缓震和传统扣带。",
    "priceMin": 800,
    "priceMax": 800,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c7585d201162778d0b9bd481ef4722d7bb31f33a2c25c3993b86d17b13585ca1.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "decathlon",
      "name": "Decathlon",
      "nameCn": "迪卡侬"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "加拿大官方页列出 S–M 与 L–XL 的 US 男女范围；法国官方页列出 S–M 对应 EU 36–42、L–XL 对应 EU 43–47。地区页面的变体标签与范围有差异，不跨地区换算，需按实物标签和雪鞋试装。",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。法国官方页列 S–M 对应 EU 36–42、L–XL 对应 EU 43–47；商品变体选择器显示 M/L，需按实物标签和试装确认，不自行映射二者。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.decathlon.ca/en/p/snowboard-bindings-snb-500/336603/c227m8668654",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.decathlon.fr/p/fixations-snowboard-all-mountain-freestyle-adulte-snb-500-noir/336603/c1m8882775",
      "officialPrice": "CAD 170.00",
      "priceMarket": "Decathlon 加拿大官网当前 SNB 500 标价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.decathlon.ca/en/p/snowboard-bindings-snb-500/336603/c227m8668654",
      "priceStatus": "加拿大官网同商品 ID 8668654 当前标价 CAD 170；页面未标雪季，人民币仅为加拿大市场折算参考，不证明 2026 雪季，也不是中国售价。税费、运费和汇兑成本未计。"
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "传统绑带"
      }
    ]
  },
  {
    "id": "01a12e8a-43da-7064-ab11-4be44c744af3",
    "slug": "flow-fenix-binding-2027",
    "title": "Flow Fenix 2027",
    "model": "Fenix",
    "year": 2027,
    "oneLiner": "Flow 后入式固定器，官网描述其定位兼顾公园动作与雪场巡航。",
    "priceMin": 1807,
    "priceMax": 1807,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a5034d2a74946db4c8e4b34e09f8d5fdd8b89003f8cad9d34ee943dff8cf29c5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.4,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 6.9,
      "convenience": 8,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：S US 男/Youth 2–4.5 / EU 35–36；M 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nidecker.com/products/flow-fenix",
      "officialPrice": "USD 269.95",
      "priceMarket": "美国 Nidecker 官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nidecker.com/products/flow-fenix",
      "priceStatus": "页面变体 SKU N.27.BNU.FEF.400.2S.1 确认 2027 款；人民币为美国官网折算参考，不是中国售价，未计税费与跨境成本。"
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
    "id": "01a12e8a-43e7-7b5f-a9c3-47f376e2251b",
    "slug": "flow-fuse-binding-2026",
    "title": "Flow Fuse 2026",
    "model": "Fuse",
    "year": 2026,
    "oneLiner": "Flow 后入式固定器，Fusion 一体式绑带协助快速进入后仰高背结构。",
    "priceMin": 2141,
    "priceMax": 2141,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/5d4e33d0d9691e385a7ac918fb8296d7410ab8e003e1b8bdfcb90948b17e34a2.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70.6,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.8,
      "convenience": 8,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nidecker/Flow 2026 商品页标示 EU：M 37–41；L 41.5–44.5；XL 45–49.5。该商品页未将 EU 范围对应到 US 或 MP 尺码，暂不换算。",
      "terrain": [
        "all-mountain"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nidecker.com/products/flow-fuse-2026",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://eu.nidecker.com/en-int/products/flow-fuse-2026",
      "officialPrice": "USD 319.95",
      "priceMarket": "美国 Nidecker 官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nidecker.com/products/flow-fuse-2026",
      "priceStatus": "2026 官方商品页与 N.26 变体 SKU 对应本档案雪季；人民币为美国官网折算参考，不是中国售价，未计税费与跨境成本。"
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
    "id": "01a12e8a-43f3-791c-b03b-daa31700888a",
    "slug": "flow-fuse-hybrid-binding-2026",
    "title": "Flow Fuse Hybrid 2026",
    "model": "Fuse Hybrid",
    "year": 2026,
    "oneLiner": "Flow 后入式固定器的 Hybrid 绑带版本，保留传统双绑带脚感并支持快速穿脱。",
    "priceMin": 2141,
    "priceMax": 2141,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ace4bb27baf020d32ebc2d6df2b52e1b60ee2de73605373008a5d921a497d000.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70.6,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.8,
      "convenience": 8,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nidecker/Flow 2026 商品页标示 EU：M 37–41；L 41.5–44.5；XL 45–49.5。该商品页未将 EU 范围对应到 US 或 MP 尺码，暂不换算。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nidecker.com/products/flow-fuse-hybrid-2026",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://eu.nidecker.com/en-int/products/flow-fuse-hybrid-2026",
      "officialPrice": "USD 319.95",
      "priceMarket": "美国 Nidecker 官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nidecker.com/products/flow-fuse-hybrid-2026",
      "priceStatus": "2026 官方商品页显示 USD 319.95；页面包含 N.26 变体货号，人民币为美国官网折算参考，不是中国售价，未计税费与跨境成本。"
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
    "id": "01a12e8a-43fe-78a3-9da7-a3ab5ec27d56",
    "slug": "flow-nexus-binding-2027",
    "title": "Flow Nexus 2027",
    "model": "Nexus",
    "year": 2027,
    "oneLiner": "Flow 后入式固定器，官网介绍采用单片 Fusion 绑带与后仰高背穿脱结构。",
    "priceMin": 1472,
    "priceMax": 1472,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1248f661f5e66fbf5dd2a347d2497d39a37157fa46964da6bb1db2e255511d3c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67.1,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 6.4,
      "convenience": 8,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：S US 男/Youth 2–4.5 / EU 35–36；M 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nidecker.com/products/flow-nexus",
      "officialPrice": "USD 219.95",
      "priceMarket": "美国 Nidecker 官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nidecker.com/products/flow-nexus",
      "priceStatus": "页面变体 SKU N.27.BNU.NEF.001.2S.1 确认 2027 款；人民币为美国官网折算参考，不是中国售价，未计税费与跨境成本。"
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
    "id": "01a12e8a-440a-7598-9812-321aa9dbb1c7",
    "slug": "flow-nx2-carbon-binding-2027",
    "title": "Flow NX2 Carbon 2027",
    "model": "NX2 Carbon",
    "year": 2027,
    "oneLiner": "Flow 高背后仰式固定器，官网标注铝合金底板与碳纤维复合高背。",
    "priceMin": 2697,
    "priceMax": 2697,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/69b6395ce1b006faf6ac1c991c734360414ad5951cad620de156185d700a7f0e.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.6,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 9,
      "convenience": 8,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：M US 男/Youth 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nidecker.com/products/flow-nx2-carbon",
      "officialPrice": "EUR 359.99（促销价；原价 EUR 449.99）",
      "priceMarket": "Montaz 欧洲零售商 2026/27 在售商品；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.montaz.com/en/nidecker-flow-nx2-carbon-black-p249996.html",
      "priceStatus": "Montaz 页面列商品参考号 249996、季节 2026-2027，原价 EUR 449.99、促销价 EUR 359.99，核对时可加入购物车。Ski West 加拿大页也明确列 2027 款、标价 $549.99（页面未显式注明货币代码），作为地区交叉参考，不用于换算。人民币采用 Montaz 页面促销价折算，不是中国售价；运费及跨境费用未计。Nidecker 品牌官网当前页货号为 N.25，未用其价格映射到此档案。"
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
    "id": "01a12e8a-4415-749c-8b40-783f032a7e65",
    "slug": "flow-nx2-hybrid-binding-2027",
    "title": "Flow NX2 Hybrid 2027",
    "model": "NX2 Hybrid",
    "year": 2027,
    "oneLiner": "Flow NX2 系列后入式固定器，采用 Hybrid 绑带配置。",
    "priceMin": 2543,
    "priceMax": 2543,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/7a225b480cc011a721330248a53dc733fd2e67f73e962959ece9296f842551f1.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.4,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 8.5,
      "convenience": 8,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nidecker/Flow 官方尺码：M US 男/Youth 5–8 / EU 37–41；L 8.5–11 / EU 41.5–44.5；XL 11.5–15 / EU 45–49.5。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nidecker.com/products/flow-nx2-hybrid",
      "officialPrice": "USD 379.95",
      "priceMarket": "Nidecker 美国官网当前 Flow NX2 Hybrid N.27 商品价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nidecker.com/products/flow-nx2-hybrid?variant=47005505454255",
      "priceStatus": "美国官网商品页标价 USD 379.95，商品 SKU 为 N.27.BNU.N2H.001.3M.1，与 2027 档案货号前缀一致；按 ECB 汇率折算为美国市场参考，不是中国售价。税费与跨境成本未计。"
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
    "id": "01a12e89-5f9d-7124-9cf2-bc89fc9e1476",
    "slug": "flux-cv-2027",
    "title": "FLUX CV 2027",
    "model": "CV",
    "year": 2027,
    "oneLiner": "26-27 刻滑与全山地取向型号，官方介绍其加高脚床及可调节结构。",
    "priceMin": 2323,
    "priceMax": 2323,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/941bd9522e2920a2c6778ff6aa6dd1b6d44bebd68094ab8133839a79030fd778.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.4,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 8.1,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "flexFeel": "stiff",
      "mountingSystem": "FLUX Multi Disc；兼容 4x4 与 2H 安装，可前后或左右偏移 5/10 mm",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Super Transfer 底盘；Performance Blend 中等硬度材料；4Corner Stabilizer",
      "ankleStrap": "Waffle Strap 双层缓冲结构；UU Fit 环绕固定",
      "toeStrap": "F.T.M. Ver. 5.0；L-Guide 收纳带尾",
      "buckles": "Beer Buckle 棘轮扣，带开瓶器",
      "bindingSizeGuide": "XS: US 男 3 - 5.5 / US 女 4 - 6.5 / EU 34 - 37.5；S: US 男 4.5 - 7.5 / US 女 5.5 - 8.5 / EU 36 - 40.5；M: US 男 7 - 9.5 / US 女 8 - 10.5 / EU 40 - 42.5；L: US 男 9+ / EU 42+。边界和备注见逐码表。",
      "highback": "Buffalo Highback；Super Tough Nylon 中等硬度材料",
      "highbackAdjustment": "Slide Highback Rotation、Toolless Lever、Micro Adjuster；每格约 2.5° 前倾",
      "cushioning": "Boost FootOn 比标准脚床高 4 mm；Heel Up；可调 toe/heel cushion",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://flux-bindings.com/products/2627-cv；https://flux-bindings.com/pages/size-chart_binding",
      "officialPrice": "JPY 55,000（税込）",
      "priceMarket": "FLUX 日本官方店 2026/27 商品价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://flux-bindings.com/products/2627-cv",
      "priceStatus": "官方 26-27 CV 商品页列日元含税标价 JPY 55,000；按 ECB 汇率折算为日本市场参考，不是中国售价。跨境费用未计，核对时官网显示售罄。"
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
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      }
    ]
  },
  {
    "id": "01a12e89-5fa9-7114-8f42-944956ce3820",
    "slug": "flux-ds-2027",
    "title": "FLUX DS 2027",
    "model": "DS",
    "year": 2027,
    "oneLiner": "FLUX 自由式全能款，26-27 官方规格为 4 级硬度，采用 Cloud Strap 与可弯曲安装盘。",
    "priceMin": 2562,
    "priceMax": 2562,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2909cc5260260b24efee5ddb26b988d877b089010cb43bf3da7c0d7be0af3c3a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 64.6,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 6.6,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 4,
      "flexFeel": "mid-soft",
      "mountingSystem": "Flexible Disc 柔性旋转安装盘；官方页面未在本型号页进一步列明孔位兼容",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Super Ultima 底盘；Glass Reinforced Flexlite Grade 轻量弹性材料；Flat Bottom",
      "ankleStrap": "Cloud Strap 泡棉缓冲脚踝绑带",
      "toeStrap": "F.T.M. Duo 一体成型脚趾绑带，贴合靴头",
      "buckles": "Beer Buckle 棘轮扣，带开瓶器",
      "bindingSizeGuide": "XS: US 男 3 - 5.5 / US 女 4 - 6.5 / EU 34 - 37.5；S: US 男 4.5 - 7.5 / US 女 5.5 - 8.5 / EU 36 - 40.5；M: US 男 7 - 9.5 / US 女 8 - 10.5 / EU 40 - 42.5；L: US 男 9+ / EU 42+。边界和备注见逐码表。",
      "highback": "Resistor Highback；Super Tough Nylon 中等硬度材料",
      "highbackAdjustment": "Toolless Lever、五孔旋转调节、Micro Adjuster；每格约 2.5° 前倾",
      "cushioning": "FootOn 脚床、Cushion Stabilizer、可分别调整的 toe/heel cushion",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://flux-bindings.com/products/2627-ds；https://flux-bindings.com/pages/size-chart_binding",
      "seasonEvidence": "FLUX 官方商品页明确标注 26-27 Model（2026-10-14 复核）。",
      "officialPrice": "CNY 2562",
      "priceMarket": "FLUX 官方商品页归档结构化 Offer（CNY）；当前同页日本店展示 JPY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://flux-bindings.com/en/products/2627-ds",
      "priceStatus": "2026-10-12 归档的 FLUX 官方结构化变体 Offer 明确标为 CNY 2,562；归档变体均为可售。2026-10-14 同一官方商品页的人类可读价格显示 JPY 49,500，页面注明 26-27 Model 并显示售罄。归档 CNY 值的市场/货币切换原因尚未由官网说明，作为带日期的官方人民币报价保留，不代表中国现价；勿与当前日本挂牌价混为一谈。"
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
        "value": "4"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中偏软"
      }
    ]
  },
  {
    "id": "01a12e89-5fb5-760b-9f41-1aa6bf8024e0",
    "slug": "flux-gs-2026",
    "title": "FLUX GS 2026",
    "model": "GS",
    "year": 2026,
    "oneLiner": "女款全能固定器，官方介绍其沿用 DS 特性并兼顾活动范围与舒适度。",
    "priceMin": 1731,
    "priceMax": 2163,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9749865d52e4efc280f3eebbaeb88666c8e987e8b7e9e8e5b1f8cfc1224dfeaf.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.4,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 6.1,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 3,
      "flexFeel": "soft",
      "mountingSystem": "FLUX Multi Disc；兼容 4x4 与 2H 安装",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "女性专用 Vogue Baseplate，Performance Blend 中等弯曲复合材料",
      "ankleStrap": "Honeycomb Strap Ver 2.0 蜂窝轻量缓冲脚踝带",
      "toeStrap": "FTM Versa 双向脚背/脚趾绑带，适配不同靴型",
      "buckles": "Trigger Ratchet Buckle 加大扳机式棘轮扣",
      "bindingSizeGuide": "XS: US 男 3 - 5.5 / US 女 4 - 6.5 / EU 34 - 37.5；SM: US 男 6 - 8.5 / US 女 7 - 9.5 / EU 38 - 41.5。边界和备注见逐码表。",
      "highback": "Women's Resister Highback，Super Tough Nylon",
      "highbackAdjustment": "Micro Adjuster 每格约 2.5° 前倾",
      "cushioning": "FootOn 脚床、可调 toe/heel cushion 与可拆换 Custom Stabilizers",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://flux-bindings.com/products/2526gs；https://flux-bindings.com/pages/size-chart_binding",
      "seasonEvidence": "FLUX 官方商品页明确标注 25-26 Model（2026-10-14 复核）。",
      "officialPrice": "CNY 1731–2163",
      "priceMarket": "原币 CNY；来源商店 flux-bindings.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://flux-bindings.com/en/products/2526gs",
      "priceStatus": "2026-10-12 归档的 FLUX 官方结构化变体 Offer 为 CNY 1,731–2,163，含不同颜色/尺码变体；归档时有可售与售罄变体。2026-10-14 同一官方商品页标注 25-26 Model，日本商店页面显示 JPY 41,800、促销 JPY 33,440，且售罄。归档 CNY 值的市场/货币切换原因尚未由官网说明，作为带日期的官方人民币报价保留，不代表中国现价；勿与当前日本挂牌价混为一谈。"
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
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "柔软"
      }
    ]
  },
  {
    "id": "01a12e89-5fc1-7150-838c-b893dfbfc873",
    "slug": "flux-xf-2026",
    "title": "FLUX XF 2026",
    "model": "XF",
    "year": 2026,
    "oneLiner": "25-26 XF 型号，官方覆盖公园、刻滑、粉雪与全山地取向。",
    "priceMin": 2177,
    "priceMax": 2562,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a3aef664875a61a40d8505e70475800caa283d2c082d5ee507c3398f60f0e829.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.4,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 8.1,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "flexFeel": "stiff",
      "mountingSystem": "FLUX Multi Disc；兼容 4x4 与 2H 安装，可偏移安装",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Super Ultima 底盘，Glass Reinforced Tough Grade 复合材质；Boost FootOn+ 脚床",
      "ankleStrap": "Waffle Strap 双层缓冲结构，搭配 UU Fit 环绕固定",
      "toeStrap": "F.T.M. Ver 5.0 可翻转脚背/脚趾绑带，L-Guide 收纳带尾",
      "buckles": "Beer Buckle 棘轮扣",
      "bindingSizeGuide": "XS: US 男 3 - 5.5 / US 女 4 - 6.5 / EU 34 - 37.5；S: US 男 4.5 - 7.5 / US 女 5.5 - 8.5 / EU 36 - 40.5；M: US 男 7 - 9.5 / US 女 8 - 10.5 / EU 40 - 42.5；L: US 男 9+ / EU 42+。边界和备注见逐码表。",
      "highback": "RETRO-Mod 非对称内侧结构高背，Super Tough Nylon 中等弯曲材料",
      "highbackAdjustment": "Redux Lean Adjuster 与 Micro Adjuster；每格约 2.5° 前倾",
      "cushioning": "Boost FootOn+ 加高脚床、XF 专用响应稳定器与可调 toe/heel cushion",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://flux-bindings.com/products/2526xf；https://flux-bindings.com/pages/size-chart_binding",
      "seasonEvidence": "FLUX 官方商品页明确标注 25-26 Model（2026-10-14 复核）。",
      "officialPrice": "CNY 2177–2562",
      "priceMarket": "原币 CNY；来源商店 flux-bindings.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://flux-bindings.com/en/products/2526xf",
      "priceStatus": "2026-10-12 归档的 FLUX 官方结构化变体 Offer 为 CNY 2,177–2,562，含不同颜色/尺码变体；归档时有可售与售罄变体。2026-10-14 同一官方商品页标注 25-26 Model，日本商店页面显示 JPY 49,500、促销 JPY 42,075，且售罄。归档 CNY 值的市场/货币切换原因尚未由官网说明，作为带日期的官方人民币报价保留，不代表中国现价；勿与当前日本挂牌价混为一谈。"
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
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      }
    ]
  },
  {
    "id": "01a12e89-5fce-7f75-aa1c-e1aec90f182a",
    "slug": "flux-xv-2026",
    "title": "FLUX XV 2026",
    "model": "XV",
    "year": 2026,
    "oneLiner": "FLUX 高阶硬质型号，官方介绍其碳纤维高背与轻量化响应结构。",
    "priceMin": 3330,
    "priceMax": 3700,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ae44fd07abba2334ec1bb5df359063fc96b72444d587826387bad0a069bf7b96.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 9,
      "convenience": 6.2,
      "versatility": 6.8
    },
    "brand": {
      "slug": "flux",
      "name": "FLUX",
      "nameCn": "Flux"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 9,
      "flexFeel": "pro-stiff",
      "mountingSystem": "Carbon Multi Disc；兼容 4x4 与 2H 安装，可作 5/10 mm 偏移安装",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Super Ultima 碳纤维增强尼龙底盘；XV 专用大型 TPU Responsive Stabilizer",
      "ankleStrap": "Waffle Strap 双层缓冲绑带与 UU Fit 环绕式固定",
      "toeStrap": "F.T.M. Ver 5.0 Transfer 专用绑带；L-Guide 收纳带尾",
      "buckles": "Beer Buckle 棘轮扣，带快速收紧结构",
      "bindingSizeGuide": "XS: US 男 3 - 5.5 / US 女 4 - 6.5 / EU 34 - 37.5；S: US 男 4.5 - 7.5 / US 女 5.5 - 8.5 / EU 36 - 40.5；M: US 男 7 - 9.5 / US 女 8 - 10.5 / EU 40 - 42.5；L: US 男 9+ / EU 42+。边界和备注见逐码表。",
      "highback": "W-Props Carbon Reinforced 高背，含碳纤维增强与滑动衬片",
      "highbackAdjustment": "Redux Lean Adjuster 单动作调节；Micro Adjuster 每格约 2.5° 前倾",
      "cushioning": "Boost FootOn+ 脚床；可调 toe/heel cushion 与响应稳定器",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://flux-bindings.com/products/2526xv；https://flux-bindings.com/pages/size-chart_binding",
      "seasonEvidence": "FLUX 官方商品页明确标注 25-26 Model（2026-10-14 复核）。",
      "officialPrice": "CNY 3330–3700",
      "priceMarket": "原币 CNY；来源商店 flux-bindings.com",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://flux-bindings.com/en/products/2526xv",
      "priceStatus": "2026-10-12 归档的 FLUX 官方结构化变体 Offer 为 CNY 3,330–3,700，含不同尺码变体；归档时 1 个变体可售、3 个售罄。2026-10-14 同一官方商品页标注 25-26 Model，日本商店页面显示 JPY 71,500、促销 JPY 64,350，且售罄。归档 CNY 值的市场/货币切换原因尚未由官网说明，作为带日期的官方人民币报价保留，不代表中国现价；勿与当前日本挂牌价混为一谈。"
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
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "专业硬朗"
      }
    ]
  },
  {
    "id": "01a12e89-5fda-7c1f-8787-50c6add89137",
    "slug": "jones-mercury-binding-2026",
    "title": "Jones Mercury 2026",
    "model": "Mercury",
    "year": 2026,
    "oneLiner": "全地形 freeride 取向固定器，采用 SkateTech 力量传递结构。",
    "priceMin": 2701,
    "priceMax": 2701,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/7efba2dbc1f5df263b6fdf07e05bafad5e91fb76615c434208ff732e6b67f68b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.2,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 8.1,
      "convenience": 6.2,
      "versatility": 6.8
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "selectionNotes": "按 Jones Mercury 2026 官方尺码表分别核对男款或女款口径；EU 区间边界需结合对应口径与实物雪鞋试装，并检查后跟、绑带和鞋底居中。不要把 Mercury FASE 的表当成本型号规格。",
      "compatibilitySources": "https://www.jonessnowboards.com/en-int/products/mens-mercury-snowboard-binding-2026",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.jonessnowboards.com/products/mens-mercury-snowboard-binding-2026",
      "officialPrice": "JPY 58,000（含日本消费税 JPY 63,800）",
      "priceMarket": "日本 Jones 官方代理商 Hasco 2025/26 建议零售价；使用 ECB 参考汇率折算成人民币",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.hasco.co.jp/pdf/2526Jones-Overview.pdf",
      "priceStatus": "Hasco 2025/26 代理商产品总览列 Men's Mercury、Eclipse Black、S/M/L，未税 JPY 58,000、含税 JPY 63,800；按 2026-10-13 ECB EUR/JPY 176.91、EUR/CNY 7.4890 折算含税参考价 CNY 2,700.80。此为日本建议零售价折算，不是实时成交价或中国售价；未含跨境运输与进口费用。ECB 汇率仅供参考。"
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
      }
    ]
  },
  {
    "id": "01a12e89-5fe5-7696-b28e-dc26aa04e9ea",
    "slug": "jones-mercury-fase-binding-2026",
    "title": "Jones Mercury FASE 2026",
    "model": "Mercury FASE",
    "year": 2026,
    "oneLiner": "Mercury 加入 FASE 快速绑带系统，支持单手穿入并可回退传统绑带操作。",
    "priceMin": 2543,
    "priceMax": 2543,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/918c841f58bbf7630131316e5feed778bf82174351744dd8f5e07061e51e9c95.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70.2,
    "editorialScores": {
      "value": 5,
      "comfort": 7.1,
      "response": 7.3,
      "convenience": 8.3,
      "versatility": 6.8
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "fast-entry",
      "flexFeel": "medium",
      "mountingSystem": "Jones Universal Mounting Disk；兼容 4x4、2x4 与 Burton Channel/EST",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Fusion XR 玻纤尼龙复合底盘；三层 TPU/EVA Fusion Pad 缓震层",
      "ankleStrap": "DualFlex 脚踝带，硬质 TPU 中芯搭配柔软 TPU 边缘",
      "toeStrap": "Adaptive Fit 脚趾带，柔性外缘贴合鞋头，中心支撑脊与纹理内面锁定雪鞋",
      "buckles": "高等级铝合金卡扣；脚趾卡扣为 LSR 2.1 Auto-Lock",
      "bindingSizeGuide": "官方尺码：S 男 US 5–8 / 女 6.5–9.5；M 男 8.5–10.5 / 女 10–12；L 男 11–14 / 女 12.5–15.5",
      "highback": "AsymFlex 非对称高背，中偏硬脚感；内侧柔韧、外侧脊柱强化响应",
      "highbackAdjustment": "免工具双档前倾角调节；高背可折叠前翻",
      "cushioning": "Fusion Pad 三层 TPU/EVA 吸震；低接触面积底盘保留侧向板面弯曲",
      "warranty": "FASE 系统终身保修；Jones 其他部件保修按官网保修政策",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.jonessnowboards.com/en-int/products/mercury-fase-snowboard-binding-2026",
      "officialPrice": "USD 379.95",
      "priceMarket": "美国官网美元挂牌价；按 ECB 2026-10-14 参考汇率折算成人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.jonessnowboards.com/en-int/products/mercury-fase-snowboard-binding-2026",
      "priceStatus": "2026 官方商品页及 J.26 SKU 对应本档案雪季；人民币为汇率折算参考，不是中国售价，未计美国税费、汇兑和跨境成本。旧 CHF 359.95 来源 SKU 为 J.27，属 2027 款，已排除。"
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "快速穿脱"
      },
      {
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      }
    ]
  },
  {
    "id": "01a12e89-5ff1-7601-b8b9-0550df4fec6f",
    "slug": "jones-orion-binding-2026",
    "title": "Jones Orion 2026",
    "model": "Orion",
    "year": 2026,
    "oneLiner": "Jones 2026 全山地固定器，官方页面列出多场景取向与常规双绑带结构。",
    "priceMin": 2141,
    "priceMax": 2141,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/f7ddd896f5fca28e53115292e07d81b917b08ac06871a2e5bb263988871a9ff8.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.6,
    "editorialScores": {
      "value": 5,
      "comfort": 7.1,
      "response": 6.9,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "jones",
      "name": "Jones",
      "nameCn": "琼斯"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "mid-soft",
      "mountingSystem": "Jones Universal Mounting Disk；兼容 4x4、2x4 与 Burton Channel/EST",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "SkateTech Hanger、Kingpin、Post 与可换硬软衬套构成杠杆传力系统",
      "ankleStrap": "Comfort Flex 3D 脚踝绑带，均匀分压；Flip-It 可切换 Surf/Freeride 模式",
      "buckles": "ZyTech 纤维复合材料卡扣，搭配不锈钢弹簧与转轴",
      "bindingSizeGuide": "男款：S US 5–7 / M 7.5–10 / L 10.5+；女款：S US 5–8.5 / M 9–11.5",
      "highback": "Progressive Flex 非对称高背，中部支撑较硬、顶部更柔韧",
      "highbackAdjustment": "免工具前倾角调节",
      "cushioning": "全长 EVA Comfort Foam foot pillow；SkateTech 橡胶衬套吸收振动，硬/软衬套可调响应",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.jonessnowboards.com/products/mens-orion-snowboard-binding-2026",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.jonessnowboards.com/products/mens-orion-snowboard-binding-2026",
      "officialPrice": "USD 319.95",
      "priceMarket": "美国官网挂牌价；按 ECB 2026-10-14 参考汇率折算成人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.jonessnowboards.com/products/mens-orion-snowboard-binding-2026",
      "priceStatus": "2026 官方商品页及 J.26 SKU 对应本档案雪季；加拿大地区另显示 CAD 379.99，非同币种价差。人民币为美国官网价折算参考，不是中国售价，未计税费与跨境成本。"
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
        "value": "中偏软"
      }
    ]
  },
  {
    "id": "01a12e89-5ffd-7c2e-afba-b6e54197c154",
    "slug": "nidecker-kaon-plus-2026",
    "title": "Nidecker Kaon Plus 2026",
    "model": "Kaon Plus",
    "year": 2026,
    "oneLiner": "中硬度双绑带全能款，配备 Multi-Disk 与无工具绑带调节。",
    "priceMin": 2248,
    "priceMax": 2248,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/58f5125ef182459d6b7baaf7d750f40c219cec2caf006d7c73f525d805658a77.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67.6,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 7.8,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "nidecker",
      "name": "Nidecker",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "mid-stiff",
      "mountingSystem": "Offset Multi-Disk；兼容四孔安装与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Nylon+ Axis Kush Unibase（30% 玻纤/70% 尼龙），带固定后跟杯与摇臂边角",
      "ankleStrap": "Exo-Kush 双层脚踝带：EVA 缓冲层与支撑骨架组合",
      "toeStrap": "Hexo Toecap 2.0 AuxTech 3D 包角脚趾带，可左右脚互换",
      "buckles": "Aluminium Axion 铣削铝合金棘轮",
      "bindingSizeGuide": "官方 EU 靴码：S 35–36 / M 37–41 / L 41.5–44.5 / XL 45–49.5",
      "highback": "Nylon Meson Pro 非对称尼龙高背，强化脚跟侧支撑与能量传递",
      "cushioning": "BankBeds 2.5° 倾斜接触面；底盘摇臂边角帮助保留板面自然弯曲",
      "warranty": "Nidecker 官方 2+1 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://eu.nidecker.com/products/kaon-plus",
      "officialPrice": "CHF 279.95",
      "priceMarket": "Nidecker 欧盟官网 CHF 挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://eu.nidecker.com/products/kaon-plus",
      "priceStatus": "欧盟官方页货号 N.26.BNU.KAP.BK.2S.1 确认 2026 款；人民币为欧盟官网折算参考，不是中国售价，未计税费及跨境成本。"
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
      }
    ]
  },
  {
    "id": "01a12e89-6009-7275-8cdd-b25b4c71cbfe",
    "slug": "nidecker-lt-supermatic-2026",
    "title": "Nidecker LT Supermatic 2026",
    "model": "LT Supermatic",
    "year": 2026,
    "oneLiner": "Supermatic 轻量快速穿脱系列，侧重支撑、响应与快速进出。",
    "priceMin": 3212,
    "priceMax": 3212,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/4dcee91106dae206010618daef21573edd57d60f366f9493cdea70706ac7f828.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.4,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 8.5,
      "convenience": 8,
      "versatility": 6.8
    },
    "brand": {
      "slug": "nidecker",
      "name": "Nidecker",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "stiff",
      "mountingSystem": "Nidecker Offset Multi-Disk；兼容四孔安装与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Nylon+ Auto 玻纤增强尼龙底盘（30% 玻纤/70% 尼龙）",
      "ankleStrap": "Exo-Frame S Hybrid 单件 TPU 低轮廓脚踝带，轻量并便于鞋靴滑入",
      "toeStrap": "Hexo Toecap 2.0 3D 包角脚趾带，可左右脚互换微调贴合",
      "buckles": "LSR 2.0 Auto-Lock 双向自动锁止棘轮",
      "bindingSizeGuide": "官方男款 US 码：M 5.5–8 / L 8.5–10.5 / XL 11–13",
      "highback": "Nylon+ S Ultraback 玻纤增强尼龙高背（30% 玻纤/70% 尼龙），增加侧向支撑并内置快穿导向筋",
      "highbackAdjustment": "后仰高背触发 Drop IN 踩入机构与 Active Strap，前倾角调节",
      "cushioning": "BankBeds 2.5° 倾斜接触面；Slip-N-Grip 降低鞋底滑入摩擦",
      "warranty": "Nidecker 官方 2+1 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nidecker.com/products/lt-supermatic-2026",
      "officialPrice": "USD 479.95",
      "priceMarket": "美国 Nidecker 官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nidecker.com/products/lt-supermatic-2026",
      "priceStatus": "2026 官方页面和 N.26 SKU 确认雪季；人民币为美国官网价折算参考，不是中国售价，未计美国税费及跨境成本。"
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
      }
    ]
  },
  {
    "id": "01a12e89-6015-76fd-b68a-9278077e1a2a",
    "slug": "nidecker-og-supermatic-2026",
    "title": "Nidecker OG Supermatic 2026",
    "model": "OG Supermatic",
    "year": 2026,
    "oneLiner": "后入式快速穿脱固定器，可在需要时按传统绑带方式使用。",
    "priceMin": 2878,
    "priceMax": 2878,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a284ab2a4fb2f3ead7eea446e3fb7bba1ee8d9af1581dc7cc2d5345ccc51fffd.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69.6,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 7.8,
      "convenience": 8,
      "versatility": 6.8
    },
    "brand": {
      "slug": "nidecker",
      "name": "Nidecker",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "rear-entry",
      "flexFeel": "mid-stiff",
      "mountingSystem": "Nidecker Offset Multi-Disk；兼容四孔安装与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "Nylon+ Auto 玻纤增强尼龙底盘（30% 玻纤/70% 尼龙），带摇臂边角",
      "ankleStrap": "Exo-Frame Hybrid AuxTech 框架与 ExoSpines 结构，均匀分散压力",
      "toeStrap": "Hexo Toecap AuxTech 3D 伸展式脚趾带",
      "buckles": "LSR 2.0 Auto-Lock 双向自动锁止棘轮",
      "bindingSizeGuide": "官方 EU 码：S 35.5–37.5 / M 37.5–41 / L 41.5–44 / XL 44.5–47",
      "highback": "Nylon+ Ultraback，玻纤增强尼龙（30% 玻纤/70% 尼龙）",
      "highbackAdjustment": "一体式前倾角调节；后仰高背可触发 Drop IN 踩入机构与 Active Strap",
      "cushioning": "BankBeds 2.5° 倾斜接触面；Slip-N-Grip 降低鞋底滑入摩擦",
      "warranty": "Nidecker 官方 2+1 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://eu.nidecker.com/en-int/products/og-supermatic-2026",
      "officialPrice": "USD 429.95",
      "priceMarket": "美国 Nidecker 官方店挂牌价；欧盟官网另列 EUR 399.95；目录人民币参考按美国价折算",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nidecker.com/products/og-supermatic-2026",
      "priceStatus": "2026 官方页面和 N.26 SKU 确认雪季；人民币为美国官网价折算参考，不是中国售价，未计美国税费及跨境成本。"
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
      }
    ]
  },
  {
    "id": "01a12e89-602e-7029-8275-b850ccb8cd4d",
    "slug": "nidecker-orbit-binding-2027",
    "title": "Nidecker Orbit 2027",
    "model": "Orbit",
    "year": 2027,
    "oneLiner": "Nidecker 双绑带固定器，官方列出可调 heelcup、脚床、前绑带位置与高背旋转。",
    "priceMin": 1874,
    "priceMax": 1874,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c94d27369d65a47c79b122fb1b65e0567c23d2264f02013d806d5617ae54b585.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.8,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nidecker 美国官方商品页男款/Youth 尺码：M US 5–8；L 8.5–11；XL 11.5–15。",
      "terrain": [
        "all-mountain"
      ],
      "brandFlexScore": 3,
      "brandResortScore": 4,
      "brandPowScore": 3,
      "brandParkScore": 5,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nidecker.com/products/orbit",
      "officialPrice": "USD 279.95",
      "priceMarket": "Nidecker 美国官网当前 Orbit N.27 商品价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nidecker.com/en-int/products/orbit",
      "priceStatus": "美国官网商品页标价 USD 279.95，商品 SKU 为 N.27.BNU.OBS.744.3M.1，与 2027 档案货号前缀一致；按 ECB 汇率折算为美国市场参考，不是中国售价。税费与跨境成本未计。"
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
    "id": "01a12e89-603c-78d5-835d-819652f0dff2",
    "slug": "nitro-fate-binding-2027",
    "title": "Nitro Fate 女款 2027",
    "model": "Fate",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 女款全山地固定器，官方目录将其列为经典全山地型号。",
    "priceMin": 2246,
    "priceMax": 2246,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/cc8bef986d0bf20cb66ddb68727f164e27c64b918c525b9592a93bc248b54ca3.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nitro 女款官方尺码：S US 女 4–7.5 / MP 21–24.5 / EU 33.5–38；S/M US 女 6–11 / MP 23–28 / EU 36–43。区间有重叠，试穿确认。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 9,
      "brandResponseScore": 7,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/fate-womens-bindings-1",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/fate-womens-bindings-1",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 Fate 女款固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 299.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/fate-womens-bindings-1",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 299.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 2,245.95；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
    "id": "01a12e89-6048-7673-9456-face38088741",
    "slug": "nitro-one-binding-2027",
    "title": "Nitro One 2027",
    "model": "One",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 自由式全山地固定器，官方定位为兼顾山地滑行的自由式型号。",
    "priceMin": 2246,
    "priceMax": 2246,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/d3066d1024a37534c8541e38d328c542e770e795a34113eb7a78a187a6ec5737.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nitro One 官方尺码：M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 男 11–14 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 8,
      "brandResponseScore": 6,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/one-bindings-1",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/one-bindings-1",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 One 固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 299.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/one-bindings-1",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 299.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 2,245.95；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
    "id": "01a12e89-6053-7135-ba58-bf34d01d8c17",
    "slug": "nitro-phantom-binding-2027",
    "title": "Nitro Phantom 2027",
    "model": "Phantom",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 全山地固定器，官方列出 Universal Mini Disc 与 Channel 兼容信息。",
    "priceMin": 2995,
    "priceMax": 2995,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/54ccb75cdb57ec14bc1bc9e80d05fd115a75545a2e66f497baa687ff1cbf7636.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nitro Phantom 官方尺码：M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 男 11–14 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "brandComfortScore": 10,
      "brandResponseScore": 8,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/phantom-bindings-2",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/phantom-bindings-2",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 Phantom 固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 399.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/phantom-bindings-2",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 399.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 2,994.85；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
    "id": "01a12e89-605e-7183-ab7b-298767507e08",
    "slug": "nitro-phantom-plus-binding-2027",
    "title": "Nitro Phantom+ 2027",
    "model": "Phantom+",
    "year": 2027,
    "oneLiner": "Nitro 品牌响应 9/10、舒适 10/10；面向中级至专家级滑手的精准刻滑与自由滑固定器。",
    "priceMin": 3294,
    "priceMax": 3294,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/83c1ac6cb78cb4bfa434a619e4261342e0af70d7ed0ca66c71b6028476712b46.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69,
    "editorialScores": {
      "value": 5,
      "comfort": 6.5,
      "response": 9,
      "convenience": 6.2,
      "versatility": 6.8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "pro-stiff",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "ankleStrap": "Premium Locked Down 脚踝绑带：45° 密度泡棉、纤维增强 3D 支撑骨架",
      "toeStrap": "Übergrip PRO Integral 3D 脚趾绑带，防滑贴合不同鞋头",
      "buckles": "Speed Wheel 3.0 卡扣/棘轮；Cable Reinforced Connectors 内置不锈钢线缆加固",
      "bindingSizeGuide": "Nitro 男款：M US 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 11–14 / MP 29–32 / EU 44–48",
      "cushioning": "Air Plus Dampening、HYPER Foam、3° 倾斜脚床及 4 mm 后跟抬高",
      "terrain": [
        "freeride",
        "carving",
        "all-mountain"
      ],
      "brandComfortScore": 10,
      "brandResponseScore": 9,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/cs/collections/all-mens-bindings-26-27/products/phantom-bindings-3?variant=57278273716555",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.nitrosnowboards.com/cs/collections/all-mens-bindings-26-27/products/phantom-bindings-3?variant=57278273716555",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 Phantom+ 固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 439.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/phantom-bindings-3",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 439.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 3,294.41；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
        "value": "专业硬朗"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "野雪 / freeride · 刻滑 · 全山地"
      }
    ]
  },
  {
    "id": "01a12e89-6069-7d11-8e0d-3a242a74399d",
    "slug": "nitro-poison-binding-2027",
    "title": "Nitro Poison 女款 2027",
    "model": "Poison",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 女款全山地固定器，官方目录标注为 All-Mountain 系列。",
    "priceMin": 2620,
    "priceMax": 2620,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/6e3adc74bed9c418dd2c788854f2acf2749392e3a4d2ec21f5589ac395458363.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nitro Poison 女款官方尺码：S/M 单一尺码，适配 US 女码 6–11 / MP 23–28 / EU 36–43。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 10,
      "brandResponseScore": 8,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/poison-womens-bindings-1",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/poison-womens-bindings-1",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 Poison 女款固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 349.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/poison-womens-bindings-1",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 349.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 2,620.40；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
    "id": "01a12e89-6075-7a99-b8dd-f1e67ec76bd1",
    "slug": "nitro-rambler-binding-2027",
    "title": "Nitro Rambler 2027",
    "model": "Rambler",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 全地形绑带固定器，官方标注 Universal Mini Disc 兼容 2x4 与 Channel。",
    "priceMin": 1797,
    "priceMax": 1797,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/23483e2f3b4f8a231dbbaa0e8cdee93895a7eca943f25ac36387c36a40ca7b44.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nitro Rambler 官方尺码：M US 男 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 男 11–14 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain"
      ],
      "brandComfortScore": 7,
      "brandResponseScore": 5,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/rambler-bindings-1",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/rambler-bindings-1",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 Rambler 固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 239.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/rambler-bindings-1",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 239.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 1,796.61；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
    "id": "01a13d55-1a9b-7485-a0a3-a068163eb3bc",
    "slug": "nitro-step-on-mens-binding-2027",
    "title": "Nitro Step On Men's 2027",
    "model": "Step On Men's",
    "year": 2027,
    "oneLiner": "Nitro 男款 Step On 固定器；品牌标注响应 7/10、舒适 9/10，须配男款 Step On 雪鞋并按尺码表确认。",
    "priceMin": 2479,
    "priceMax": 2479,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/70bb334f09f56faca5c1651a5951a1e32263b6c044aff131d9544025438d405e.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "step-in",
      "mountingSystem": "Re:Flex；官方列出 2x4、4x4、3D 与 Burton Channel 安装孔位兼容",
      "bootCompatibility": "Nitro 官方 Step On 指南称其固定器兼容所有 Step On 雪鞋，但系统按性别和尺码区分：男款靴须配男款固定器；US 男 6–8 / 8.5–10.5 / 11–13 / 14–15 分别配 S/M/L/XL。跨品牌也须确认靴卡完全扣合。普通绑带雪鞋不兼容。",
      "bindingSizeGuide": "男款 S：US 6–8 / MP 24–26 / EU 38–41；M：US 8.5–10.5 / MP 26.5–28.5 / EU 41.5–43.5；L：US 11–13 / MP 29–31 / EU 44–46；XL：US 14–15 / MP 32–33 / EU 47–48。",
      "highback": "Step On 非对称高背；集成导入槽辅助雪鞋进入固定器，系统以三点连接并使用 Hook 2 弹簧脚趾钩",
      "cushioning": "Nitro HYPER Foam 脚床缓震",
      "terrain": [
        "all-mountain"
      ],
      "brandComfortScore": 9,
      "brandResponseScore": 7,
      "selectionNotes": "先选择合脚的男款 Step On 雪鞋，再按 US/MP 尺码选 S/M/L/XL 固定器，逐一确认后跟卡扣及两侧前掌卡齿完全锁定；Nitro 官方要求男鞋配男款固定器，勿跨男女系列混搭。安装前核对雪板 2x4、4x4、3D 或 Channel 孔位。",
      "compatibilitySources": "https://www.nitrosnowboards.com/products/step-on-mens-bindings-1；https://www.nitrosnowboards.com/pages/step-on",
      "sizeChartScope": "Nitro 官方 2027 男款 Step On 固定器尺码表；US 男 6–8、8.5–10.5、11–13、14–15 分档，无重叠。为 Step On 连接系统的推荐尺码，仍需与对应 Step On 雪鞋按尺码表匹配并实际检查扣合；页面尺码选项不代表实时库存。",
      "sizeChartCheckedAt": "2026-10-15",
      "sizeChartSource": "https://www.nitrosnowboards.com/products/step-on-mens-bindings-1",
      "seasonEvidence": "Nitro 官方商品页标题标注 2027，官方男款 26/27 集合页列出此型号；据此归档为 2026/27（2027 款），不据此推断首次上市时间或当前库存。",
      "officialPrice": "EUR 330.90",
      "priceMarket": "Nitro 欧洲官方男款固定器集合页（EUR 标价）",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/collections/all-mens-bindings-26-27",
      "priceStatus": "Nitro 欧洲官方男款集合页标价 EUR 330.90；按 ECB 2026-10-14 EUR/CNY 7.4925 折合 CNY 2,479.27。此为欧洲官方地区挂牌折算参考，不是中国售价；页面税费口径、跨境运费及进口费用以结账为准，尺码库存会变化。"
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "踩入式"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地"
      }
    ]
  },
  {
    "id": "01a13d55-1aa1-73cf-806b-dc6553bad038",
    "slug": "nitro-step-on-womens-binding-2027",
    "title": "Nitro Step On Women's 2027",
    "model": "Step On Women's",
    "year": 2027,
    "oneLiner": "Nitro 女款 Step On 固定器；品牌标注响应 7/10、舒适 9/10，须配女款 Step On 雪鞋并按尺码表确认。",
    "priceMin": 2472,
    "priceMax": 2472,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c45ac3e045c5c505c311481a67b04aca7d7534a2871ce7349b2b6243074fc17d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "step-in",
      "mountingSystem": "Re:Flex；官方列出 2x4、4x4、3D 与 Burton Channel 安装孔位兼容",
      "bootCompatibility": "Nitro 官方 Step On 指南称其固定器兼容所有 Step On 雪鞋，但系统按性别和尺码区分：女款靴须配女款固定器；US 女 5–6 / 6.5–8.5 / 9–11 分别配 S/M/L。跨品牌也须确认靴卡完全扣合。普通绑带雪鞋不兼容。",
      "bindingSizeGuide": "女款 S：US 5–6 / MP 22–23 / EU 35–36.5；M：US 6.5–8.5 / MP 23.5–25.5 / EU 37–40.5；L：US 9–11 / MP 26–28 / EU 41–43。",
      "highback": "Step On 非对称高背；集成导入槽辅助雪鞋进入固定器，系统以三点连接并使用 Hook 2 弹簧脚趾钩",
      "cushioning": "Nitro HYPER Foam 脚床缓震",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 9,
      "brandResponseScore": 7,
      "selectionNotes": "先选择合脚的女款 Step On 雪鞋，再按 US/MP 尺码选 S/M/L 固定器，逐一确认后跟卡扣及两侧前掌卡齿完全锁定；Nitro 官方要求女鞋配女款固定器，勿跨男女系列混搭。安装前核对雪板 2x4、4x4、3D 或 Channel 孔位。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/all-26-27/products/step-on-womens-bindings；https://www.nitrosnowboards.com/pages/step-on",
      "sizeChartScope": "Nitro 官方 2027 女款 Step On 固定器尺码表；US 女 5–6、6.5–8.5、9–11 分档，无重叠。为 Step On 连接系统的推荐尺码，仍需与对应 Step On 雪鞋按尺码表匹配并实际检查扣合；页面尺码选项不代表实时库存。",
      "sizeChartCheckedAt": "2026-10-15",
      "sizeChartSource": "https://www.nitrosnowboards.com/collections/all-26-27/products/step-on-womens-bindings",
      "seasonEvidence": "Nitro 官方页面标题标注 2027，官方女款 26/27 集合页列出此型号；据此归档为 2026/27（2027 款），不据此推断首次上市时间或当前库存。",
      "officialPrice": "EUR 329.90",
      "priceMarket": "Nitro 欧洲官方女款固定器集合页（EUR 标价）",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/cs/collections/all-womens-bindings-26-27",
      "priceStatus": "Nitro 欧洲官方女款集合页标价 EUR 329.90；按 ECB 2026-10-14 EUR/CNY 7.4925 折合 CNY 2,471.78。此为欧洲官方地区挂牌折算参考，不是中国售价；页面税费口径、跨境运费及进口费用以结账为准，尺码库存会变化。"
    },
    "highlights": [
      {
        "key": "entrySystem",
        "label": "穿脱系统",
        "value": "踩入式"
      },
      {
        "key": "terrain",
        "label": "适用场景",
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a12e89-6082-7c64-9e6f-8f2c95d7876a",
    "slug": "nitro-talent-binding-2027",
    "title": "Nitro Talent 2027",
    "model": "Talent",
    "year": 2027,
    "oneLiner": "Nitro 2026–27 男女通用固定器，品牌官方将其定位为普适型产品。",
    "priceMin": 1347,
    "priceMax": 1347,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b2b3390bfdeae034bffb1a663978124b6f0549a002e0c7ce78a90eee44fec321.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Nitro Talent 官方尺码：S US 男 3–6.5、女 3.5–7 / MP 21–24.5 / EU 33.5–38；M 男 7–10.5、女 7.5–11 / MP 25–28.5 / EU 38.5–43.5；L 男 11–14、女 11.5–14.5 / MP 29–32 / EU 44–48。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 7,
      "brandResponseScore": 4,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/talent-unisex-bindings-1",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.nitrosnowboards.com/collections/bindings-26-27/products/talent-unisex-bindings-1",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 Talent Unisex 固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 179.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/talent-unisex-bindings-1",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 179.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 1,347.27；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
    "id": "01a12e89-608d-72bd-8d77-37dbf205fe5e",
    "slug": "nitro-team-binding-2027",
    "title": "Nitro Team 2027",
    "model": "Team",
    "year": 2027,
    "oneLiner": "Nitro 品牌响应 7/10、舒适 9/10；面向中高级滑手的全山地固定器。",
    "priceMin": 2396,
    "priceMax": 2396,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/aa641986a0e54e9b64eda6a47c54cae2b9e7fda7598f7619912b44c68dc64032.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Burton Channel，较小盘面有助于保留板面自然弯曲",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "ankleStrap": "3D OptiFrame Locked Down 聚氨酯脚踝绑带，强调支撑与响应",
      "toeStrap": "Übergrip PRO 3D 注塑脚趾绑带，内侧防滑垫，适配不同鞋头",
      "buckles": "Speed Wheel 3.0 卡扣/棘轮；Cable Reinforced Connectors 内置不锈钢线缆加固梯带",
      "bindingSizeGuide": "Nitro 男款：M US 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L US 11–14 / MP 29–32 / EU 44–48",
      "cushioning": "Air Dampening 后跟缓震；3° 倾斜脚床",
      "terrain": [
        "all-mountain",
        "carving",
        "freestyle",
        "freeride"
      ],
      "brandComfortScore": 9,
      "brandResponseScore": 7,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/products/team-bindings-1",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.nitrosnowboards.com/products/team-bindings-1",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 Team 固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 319.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/team-bindings-1",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 319.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 2,395.73；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
        "value": "全山地 · 刻滑 · 自由式 / 公园 · 野雪 / freeride"
      }
    ]
  },
  {
    "id": "01a12e89-6099-7f8f-a48a-a6fcdc3a33f7",
    "slug": "nitro-team-pro-binding-2027",
    "title": "Nitro Team Pro 2027",
    "model": "Team Pro",
    "year": 2027,
    "oneLiner": "高响应自由式固定器；Nitro 品牌评分响应 8/10、舒适 9/10，建议中级至职业滑手。",
    "priceMin": 2695,
    "priceMax": 2695,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/5227d782191e17a36f55f6fae7d32b2af7e882040c7f8c5d28ccfa349ebfc907.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69.2,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 8.5,
      "convenience": 6.2,
      "versatility": 7.2
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "stiff",
      "mountingSystem": "Universal Mini Disc；兼容 2x4 与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "ankleStrap": "3D OptiPro 双组分聚氨酯脚踝绑带，兼顾响应、舒适与支撑",
      "toeStrap": "Übergrip PRO 3D 注塑脚趾绑带，防滑贴合不同鞋头",
      "buckles": "Speed Wheel 3.0 卡扣/棘轮；梯带与棘轮带内置不锈钢线缆加固",
      "bindingSizeGuide": "Nitro：S/M 男靴 US 5–10 / 女靴 5.5–10.5 / MP 23–28 / EU 36–43；M 男 US 7–10.5 / MP 25–28.5 / EU 38.5–43.5；L 男 US 11–14 / MP 29–32 / EU 44–48",
      "cushioning": "Air Dampening 后跟缓震、HYPER Foam 脚床与 3° 倾斜脚床",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "brandComfortScore": 9,
      "brandResponseScore": 8,
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/all-26-27/products/team-pro-bindings-1?variant=57277687005515",
      "sizeChartScope": "2027 官方页尺码选择器列 S/M、M、L；厂商推荐鞋码区间存在重叠：US 男 7–10 同时落入 S/M 与 M。区间是推荐范围，不是唯一映射、实装保证或实时库存。",
      "sizeChartCheckedAt": "2026-10-15",
      "bootFitEvidence": "Nitro 官方 2027 Team Pro 页面分别列出三档固定器尺码的 US/MP/EU 鞋码范围；S/M 与 M 在 US 男 7–10 区间重叠。应结合雪鞋外形实装检查底盘承托、鞋头/后跟居中、脚踝绑带位置及梯带余量，边界或重叠尺码需试装。",
      "sizeChartSource": "https://www.nitrosnowboards.com/collections/all-26-27/products/team-pro-bindings-1?variant=57277687005515",
      "seasonEvidence": "Nitro 官方 26/27 固定器集合页列出 Team Pro 固定器；据官方当季目录归档为 2026/27（2027），不据此推断首次上市年份或当前库存。来源：https://www.nitrosnowboards.com/collections/bindings-26-27",
      "officialPrice": "EUR 359.9",
      "priceMarket": "Nitro 欧洲官方商店；归档结构化变体报价（EUR）折算 CNY",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/team-pro-bindings-1",
      "priceStatus": "2026-10-12 官方结构化变体报价 EUR 359.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算 CNY 2,695.29；2026-10-14 重查商品页未显示价格，归档尺码变体均售罄。仅为欧洲价格的人民币折算参考，不是中国售价；价格可能已变化，跨境费用未计。"
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
        "value": "全山地 · 自由式 / 公园"
      }
    ]
  },
  {
    "id": "01a12e8a-4523-7af2-966c-d6eb48cd11b9",
    "slug": "rome-390-boss-aw-binding-2027",
    "title": "Rome 390 Boss AW 2027",
    "model": "390 Boss AW",
    "year": 2027,
    "oneLiner": "Rome 2026–27 AsymWrap 平台传统绑带款，官方定位兼顾自由式脚感与全山地用途。",
    "priceMin": 2342,
    "priceMax": 2342,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/cd0a9f3b473ba5e71237e83796ce996a1f2161776291f70d2a3b21857527e5cc.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.5,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.6,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "S: US 男 5 - 7 / US 女 6.5 - 8.5 / EU 36.5 - 39；M/L: US 男 7.5 - 10 / US 女 9 - 11.5 / EU 40 - 43；L/XL: US 男 10.5 - 12.5 / US 女 12 - 14 / EU 44 - 46。边界和备注见逐码表。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://romesnowboards.com/products/rome-390-boss-aw-2627-men-bindings",
      "officialPrice": "USD 349.95",
      "priceMarket": "Rome 美国官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://romesnowboards.com/products/rome-390-boss-aw-2627-men-bindings",
      "priceStatus": "Rome 2026/27 官方商品页标价；人民币为美国官网价折算参考，不是中国售价，未计美国税费与跨境成本。"
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
    "id": "01a12e8a-452e-7e96-a69f-69407360b0c4",
    "slug": "rome-390-boss-fw-binding-2027",
    "title": "Rome 390 Boss FW 2027",
    "model": "390 Boss FW",
    "year": 2027,
    "oneLiner": "Rome 2026–27 FullWrap 平台绑带款，官方强调落地支撑与稳定连接。",
    "priceMin": 2476,
    "priceMax": 2476,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/af43e4a37a4efed95a71119e07a16d166f5fbf64c4374c3cb844c70e4ffe2ea4.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 67.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 8.1,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "S: US 男 5 - 7 / US 女 6.5 - 8.5 / EU 36.5 - 39；M/L: US 男 7.5 - 10 / US 女 9 - 11.5 / EU 40 - 43；L/XL: US 男 10.5 - 12.5 / US 女 12 - 14 / EU 44 - 46。边界和备注见逐码表。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://us.romesnowboards.com/products/rome-390-boss-fw-2627-mens-snowboard-bindings",
      "officialPrice": "USD 369.95",
      "priceMarket": "Rome 美国官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://romesnowboards.com/products/rome-390-boss-fw-2627-mens-snowboard-bindings",
      "priceStatus": "Rome 2026/27 官方商品页标价；人民币为美国官网价折算参考，不是中国售价，未计美国税费与跨境成本。"
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
    "id": "01a12e8a-4539-764f-8991-82af1c595fa7",
    "slug": "rome-brass-aw-binding-2027",
    "title": "Rome Brass AW 女款 2027",
    "model": "Brass AW",
    "year": 2027,
    "oneLiner": "Rome 2026–27 女款 AsymWrap 传统绑带固定器，官方描述为偏灵活、易上手的脚感。",
    "priceMin": 2342,
    "priceMax": 2342,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/6fb5f282d4ebc2e6a5892134c3cbf3586e36e0f0f5a47423ad10a9257864f04a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.5,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.6,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "S: US 男 5 - 7 / US 女 6.5 - 8.5 / EU 36.5 - 39；M/L: US 男 7.5 - 10 / US 女 9 - 11.5 / EU 40 - 43；L/XL: US 男 10.5 - 12.5 / US 女 12 - 14 / EU 44 - 46。边界和备注见逐码表。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://romesnowboards.com/products/rome-brass-aw-2627-womens-snowboard-binding",
      "officialPrice": "USD 349.95",
      "priceMarket": "Rome 美国官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://romesnowboards.com/products/rome-brass-aw-2627-womens-snowboard-binding",
      "priceStatus": "Rome 2026/27 官方商品页标价；人民币为美国官网价折算参考，不是中国售价，未计美国税费与跨境成本。"
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
    "id": "01a12e8a-4545-754d-b87b-13a5bb686e50",
    "slug": "rome-katana-aw-binding-2027",
    "title": "Rome Katana AW 2027",
    "model": "Katana AW",
    "year": 2027,
    "oneLiner": "Rome 2026–27 传统绑带全山地固定器，官方主打调节范围与舒适性。",
    "priceMin": 2677,
    "priceMax": 2677,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/bff840088e4e0c69c26e835b23ceb9d9b28eb7cb8403a415c00fae9b3033dbc2.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 8.5,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "S: US 男 5 - 7 / US 女 6.5 - 8.5 / EU 36.5 - 39；M/L: US 男 7.5 - 10 / US 女 9 - 11.5 / EU 40 - 43；L/XL: US 男 10.5 - 12.5 / US 女 12 - 14 / EU 44 - 46。边界和备注见逐码表。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://romesnowboards.com/products/rome-katana-aw-2627-mens-snowboard-bindings",
      "officialPrice": "USD 399.95",
      "priceMarket": "Rome 美国官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://romesnowboards.com/products/rome-katana-aw-2627-mens-snowboard-bindings",
      "priceStatus": "Rome 2026/27 官方商品页标价；人民币为美国官网价折算参考，不是中国售价，未计美国税费与跨境成本。"
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
    "id": "01a12e8a-4551-723c-bcc3-4466505d8d62",
    "slug": "rome-katana-aw-fase-binding-2027",
    "title": "Rome Katana AW FASE 2027",
    "model": "Katana AW FASE",
    "year": 2027,
    "oneLiner": "Rome Katana AW 平台的 FASE 快速穿脱版本，官方主打可调节性与全山地适用。",
    "priceMin": 2878,
    "priceMax": 2878,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/72316959062e04274d27b9615cd13b13c01460da255e4c7c4207504bedce378b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 8.5,
      "convenience": 8.3,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "S: US 男 5 - 7 / US 女 6.5 - 8.5 / EU 36.5 - 39；M/L: US 男 7.5 - 10 / US 女 9 - 11.5 / EU 40 - 43；L/XL: US 男 10.5 - 12.5 / US 女 12 - 14 / EU 44 - 46。边界和备注见逐码表。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://romesnowboards.com/products/katana-asymwrap-fase-snowboard-bindings",
      "officialPrice": "USD 429.95",
      "priceMarket": "Rome 美国官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://romesnowboards.com/products/rome-katana-aw-fase-2627-mens-snowboard-bindings",
      "priceStatus": "Rome 2026/27 官方商品页标价 USD 429.95；人民币为美国官网价折算参考，不是中国售价，未计美国税费与跨境成本。"
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
    "id": "01a12e8a-455e-7d5c-9547-402cbb2cb4bb",
    "slug": "rome-katana-aw-pro-fase-binding-2027",
    "title": "Rome Katana AW Pro FASE 2027",
    "model": "Katana AW Pro FASE",
    "year": 2027,
    "oneLiner": "Rome 2026–27 碳纤维取向全山地固定器，结合 AsymWrap 平台与 FASE 快速穿脱系统。",
    "priceMin": 3011,
    "priceMax": 3011,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/5725d76bc5d04a0a8914cf37e598e9477b56c9740070bb9f387e3d44a6d68e2f.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.2,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 9,
      "convenience": 8.3,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "S: US 男 5 - 7 / US 女 6.5 - 8.5 / EU 36.5 - 39；M/L: US 男 7.5 - 10 / US 女 9 - 11.5 / EU 40 - 43；L/XL: US 男 10.5 - 12.5 / US 女 12 - 14 / EU 44 - 46。边界和备注见逐码表。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://romesnowboards.com/products/rome-katana-aw-pro-fase-2627-mens-snowboard-bindings",
      "officialPrice": "USD 449.95",
      "priceMarket": "Rome 美国官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://romesnowboards.com/products/rome-katana-aw-pro-fase-2627-mens-snowboard-bindings",
      "priceStatus": "Rome 2026/27 官方商品页标价；人民币为美国官网价折算参考，不是中国售价，未计美国税费与跨境成本。"
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
    "id": "01a12e8a-456a-717f-be5a-3f26afe96a1d",
    "slug": "rome-katana-fw-pro-binding-2027",
    "title": "Rome Katana FW Pro 2027",
    "model": "Katana FW Pro",
    "year": 2027,
    "oneLiner": "Rome 2026–27 FullWrap 碳纤维传统绑带款，面向高响应全山地滑行。",
    "priceMin": 3145,
    "priceMax": 3145,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ac472aac639a0ae7020589a70494c49eda565f6c22b68267be49783837c71f43.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 9,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "S: US 男 5 - 7 / US 女 6.5 - 8.5 / EU 36.5 - 39；M/L: US 男 7.5 - 10 / US 女 9 - 11.5 / EU 40 - 43；L/XL: US 男 10.5 - 12.5 / US 女 12 - 14 / EU 44 - 46。边界和备注见逐码表。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://romesnowboards.com/products/rome-katana-fw-pro-2627-mens-snowboard-bindings",
      "officialPrice": "USD 469.95",
      "priceMarket": "Rome 美国官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://romesnowboards.com/products/rome-katana-fw-pro-2627-mens-snowboard-bindings",
      "priceStatus": "Rome 2026/27 官方商品页标价；人民币为美国官网价折算参考，不是中国售价，未计美国税费与跨境成本。"
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
    "id": "01a12e8a-4576-748e-ada0-0f38bf4e4fca",
    "slug": "rome-volt-fase-binding-2027",
    "title": "Rome Volt FASE 2027",
    "model": "Volt FASE",
    "year": 2027,
    "oneLiner": "Rome 2026–27 快穿固定器新品，采用 MonoFrame 底盘与 FASE 系统。",
    "priceMin": 2208,
    "priceMax": 2208,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/16324b942244a90397e0ae3d66abbdb06cd4400c544c82babae50ce2722a09ab.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69.5,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.1,
      "convenience": 8.3,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "S: US 男 5.5 - 8 / US 女 7 - 9.5 / EU 37 - 40.5；M: US 男 7.5 - 10.5 / US 女 9 - 12 / EU 40 - 44；L: US 男 10.5 - 13 / US 女 12 - 14.5 / EU 44 - 47。边界和备注见逐码表。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://romesnowboards.com/products/rome-mens-volt-fase-2627-snowboard-bindings",
      "officialPrice": "USD 329.95",
      "priceMarket": "Rome 美国官方店挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://romesnowboards.com/products/rome-mens-volt-fase-2627-snowboard-bindings",
      "priceStatus": "Rome 2026/27 官方商品页标价；人民币为美国官网价折算参考，不是中国售价，未计美国税费与跨境成本。"
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
    "id": "01a12e89-60b8-7d8d-96b6-c0f33920fcb7",
    "slug": "salomon-district-binding-2026",
    "title": "Salomon DISTRICT 2026",
    "model": "DISTRICT",
    "year": 2026,
    "oneLiner": "采用 Shadow Fit 结构的全山地/自由式固定器，官网标注中等硬度。",
    "priceMin": 2007,
    "priceMax": 2007,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/8ca1f67bab52e0fe73f5463dda358ae84dc863d54aa5d0b78f37e94eae142f4d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Salomon 官方尺码页（2026-10-14 核对）：S EU 34.5–40.5 / US 男 3–8 / 女 3–9；M EU 40–43.5 / 男 7.5–10.5 / 女 8.5–11.5；L EU 43–47 / 男 10–13.5 / 女 11–14.5。尺码范围有重叠，具体试装以商品型号和雪鞋为准。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/district-li1289",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.salomon.com/es-es/sizingchart?category=snowboard-bindings&gender=men",
      "officialPrice": "USD 299.95",
      "priceMarket": "Salomon 美国官网 USD 挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.salomon.com/en-us/product/district-li1289",
      "priceStatus": "官方当前商品页列 USD 299.95；页面未直接标年款，价格仅作为同型号美国市场参考，不用于证明 2026 雪季，也不是中国售价。税费及跨境成本未计。"
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
    "id": "01a12e89-60c4-7daf-ba51-21c0ea7c1d0d",
    "slug": "salomon-district-pro-binding-2026",
    "title": "Salomon DISTRICT PRO 2026",
    "model": "DISTRICT PRO",
    "year": 2026,
    "oneLiner": "Salomon 当前全山地固定器系列中的进阶型号，国内零售目录可见该产品。",
    "priceMin": 2141,
    "priceMax": 2141,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9e6650b6d468fdc0f5e9761c1dd7341c29499b44b3ee7d0219159bd3a3715d8b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 8.5,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Salomon 官方尺码页（2026-10-14 核对）：S EU 34.5–40.5 / US 男 3–8 / 女 3–9；M EU 40–43.5 / 男 7.5–10.5 / 女 8.5–11.5；L EU 43–47 / 男 10–13.5 / 女 11–14.5。尺码范围有重叠，具体试装以商品型号和雪鞋为准。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/district-pro-li1290",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.salomon.com/es-es/sizingchart?category=snowboard-bindings&gender=men",
      "officialPrice": "USD 319.95",
      "priceMarket": "Salomon 美国官网 USD 挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.salomon.com/en-us/product/district-pro-li1290",
      "priceStatus": "官方当前商品页列 USD 319.95；页面未直接标年款，价格仅作为同型号美国市场参考，不用于证明 2026 雪季，也不是中国售价。税费及跨境成本未计。"
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
    "id": "01a12e89-60d1-7870-b378-42f033c56a70",
    "slug": "salomon-edb-binding-2026",
    "title": "Salomon EDB 2026",
    "model": "EDB",
    "year": 2026,
    "oneLiner": "Salomon 全山地固定器，官网当前目录同时提供该款与 EDB PRIME。",
    "priceMin": 1673,
    "priceMax": 1673,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/8e16e8bb5f70079ebb4d4c89de48ccb2a0751fa49d505d7dc9bbec11a90ece67.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "mountingSystem": "Universal Disc；兼容主要雪板安装系统",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Salomon 官方尺码页（2026-10-14 核对）：S EU 34.5–40.5 / US 男 3–8 / 女 3–9；M EU 40–43.5 / 男 7.5–10.5 / 女 8.5–11.5；L EU 43–47 / 男 10–13.5 / 女 11–14.5。尺码范围有重叠，具体试装以商品型号和雪鞋为准。",
      "terrain": [
        "all-mountain"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.salomon.com/en-us/c/men/winter-equipment/snowboard/bindings",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.salomon.com/es-es/sizingchart?category=snowboard-bindings&gender=men",
      "officialPrice": "USD 249.95",
      "priceMarket": "Salomon 美国官网当前型号挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.salomon.com/en-us/product/edb-li6675/L49304400",
      "priceStatus": "官方当前商品页列 USD 249.95，货号 L49304400；页面未直接标年款，价格仅作为同型号美国市场参考，不用于证明 2026 雪季，也不是中国售价。税费及跨境成本未计。"
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
    "id": "01a12e89-60dc-70ed-8576-1cc925af459e",
    "slug": "salomon-edb-prime-binding-2026",
    "title": "Salomon EDB PRIME 2026",
    "model": "EDB PRIME",
    "year": 2026,
    "oneLiner": "Salomon 全山地固定器，国内京东页面可见该型号评价，规格以官方型号页为准。",
    "priceMin": 1874,
    "priceMax": 1874,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/53b4f408645ddb6c82981f9a02ebf4bf0829f19ade1dd065bf2afb964b28b1a8.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 8.5,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Salomon 官方尺码页（2026-10-14 核对）：S EU 34.5–40.5 / US 男 3–8 / 女 3–9；M EU 40–43.5 / 男 7.5–10.5 / 女 8.5–11.5；L EU 43–47 / 男 10–13.5 / 女 11–14.5。尺码范围有重叠，具体试装以商品型号和雪鞋为准。",
      "terrain": [
        "all-mountain"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/edb-prime-li8710",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.salomon.com/es-es/sizingchart?category=snowboard-bindings&gender=men",
      "officialPrice": "USD 279.95",
      "priceMarket": "Salomon 美国官网 USD 挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.salomon.com/en-us/product/edb-prime-li8710",
      "priceStatus": "官方当前商品页列 USD 279.95；页面未直接标年款，价格仅作为同型号美国市场参考，不用于证明 2026 雪季，也不是中国售价。税费及跨境成本未计。"
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
    "id": "01a12e89-60e8-7bf5-ac7e-f0647a48c0d3",
    "slug": "salomon-highlander-binding-2026",
    "title": "Salomon HIGHLANDER 2026",
    "model": "HIGHLANDER",
    "year": 2026,
    "oneLiner": "Salomon 男款全山地固定器，官网列为当前产品型号。",
    "priceMin": 2543,
    "priceMax": 2543,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9dcd10f75d3e45b4c35d63ebd6f933070742a20ffdaf387fd299dbc13193d7c6.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 8.5,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Salomon 官方尺码页（2026-10-14 核对）：S EU 34.5–40.5 / US 男 3–8 / 女 3–9；M EU 40–43.5 / 男 7.5–10.5 / 女 8.5–11.5；L EU 43–47 / 男 10–13.5 / 女 11–14.5。尺码范围有重叠，具体试装以商品型号和雪鞋为准。",
      "terrain": [
        "all-mountain",
        "freeride"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/highlander-li8702",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.salomon.com/es-es/sizingchart?category=snowboard-bindings&gender=men",
      "officialPrice": "USD 379.95",
      "priceMarket": "Salomon 美国官网 USD 挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.salomon.com/en-us/product/highlander-li8702",
      "priceStatus": "官方当前商品页列 USD 379.95；页面未直接标年款，价格仅作为同型号美国市场参考，不用于证明 2026 雪季，也不是中国售价。税费及跨境成本未计。"
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
    "id": "01a12e89-60f3-7b40-8b7c-6f4d25c6a30c",
    "slug": "salomon-hologram-binding-2026",
    "title": "Salomon HOLOGRAM 2026",
    "model": "HOLOGRAM",
    "year": 2026,
    "oneLiner": "Salomon 全山地固定器，纳入品牌当前官方固定器目录。",
    "priceMin": 2409,
    "priceMax": 2409,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/dbeac35b580bb39e1293eed42b26edbd9fd8a934e4a468189622aaf9b1aa92e4.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 65.8,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Salomon 官方尺码页（2026-10-14 核对）：S EU 34.5–40.5 / US 男 3–8 / 女 3–9；M EU 40–43.5 / 男 7.5–10.5 / 女 8.5–11.5；L EU 43–47 / 男 10–13.5 / 女 11–14.5。尺码范围有重叠，具体试装以商品型号和雪鞋为准。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/hologram-li5326",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.salomon.com/es-es/sizingchart?category=snowboard-bindings&gender=men",
      "officialPrice": "USD 359.95",
      "priceMarket": "Salomon 美国官网 USD 挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.salomon.com/en-us/product/hologram-li5326",
      "priceStatus": "官方当前商品页列 USD 359.95；页面未直接标年款，价格仅作为同型号美国市场参考，不用于证明 2026 雪季，也不是中国售价。税费及跨境成本未计。"
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
    "id": "01a12e89-6100-7b06-90fa-d416a7e4b559",
    "slug": "salomon-pact-binding-2026",
    "title": "Salomon PACT 2026",
    "model": "PACT",
    "year": 2026,
    "oneLiner": "Salomon 男款全山地绑带固定器，官网将其列入当前单板固定器产品线。",
    "priceMin": 1071,
    "priceMax": 1071,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/ebd82c762464cc3ac83731bc376e14d15d207384f612b8e42a8a3702fd291938.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.5,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 6.4,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Salomon 官方尺码页（2026-10-14 核对）：S EU 34.5–40.5 / US 男 3–8 / 女 3–9；M EU 40–43.5 / 男 7.5–10.5 / 女 8.5–11.5；L EU 43–47 / 男 10–13.5 / 女 11–14.5。尺码范围有重叠，具体试装以商品型号和雪鞋为准。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/pact-li6862",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.salomon.com/es-es/sizingchart?category=snowboard-bindings&gender=men",
      "officialPrice": "USD 159.95",
      "priceMarket": "Salomon 美国官网 USD 挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.salomon.com/en-us/product/pact-li6862",
      "priceStatus": "官方当前商品页列 USD 159.95；页面未直接标年款，价格仅作为同型号美国市场参考，不用于证明 2026 雪季，也不是中国售价。税费及跨境成本未计。"
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
    "id": "01a12e89-610c-74bc-98e9-5ab4ac7b90f2",
    "slug": "salomon-rhythm-binding-2026",
    "title": "Salomon RHYTHM 2026",
    "model": "RHYTHM",
    "year": 2026,
    "oneLiner": "Salomon 入门进阶向全山地绑带固定器，官网列出柔和脚感与通用安装圆盘。",
    "priceMin": 1271,
    "priceMax": 1271,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/46269c0995665be9d83fc282348b7c463a167dd678d8be738a6b9180d66fb82f.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.5,
    "editorialScores": {
      "value": 5,
      "comfort": 6.2,
      "response": 6.4,
      "convenience": 6.2,
      "versatility": 7.6
    },
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
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "bindingSizeGuide": "Salomon 官方尺码页（2026-10-14 核对）：S EU 34.5–40.5 / US 男 3–8 / 女 3–9；M EU 40–43.5 / 男 7.5–10.5 / 女 8.5–11.5；L EU 43–47 / 男 10–13.5 / 女 11–14.5。尺码范围有重叠，具体试装以商品型号和雪鞋为准。",
      "terrain": [
        "all-mountain",
        "freestyle"
      ],
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/rhythm-li3345",
      "sizeChartCheckedAt": "2026-10-14",
      "sizeChartSource": "https://www.salomon.com/es-es/sizingchart?category=snowboard-bindings&gender=men",
      "officialPrice": "USD 189.95",
      "priceMarket": "Salomon 美国官网 USD 挂牌价；按 ECB 2026-10-14 汇率折算人民币",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.salomon.com/en-us/product/rhythm-li3345",
      "priceStatus": "官方当前商品页列 USD 189.95；页面未直接标年款，价格仅作为同型号美国市场参考，不用于证明 2026 雪季，也不是中国售价。税费及跨境成本未计。"
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
    "id": "01a12e89-611b-74f4-84a8-f399338c4365",
    "slug": "union-atlas-2027",
    "title": "Union Binding Company Atlas 2027",
    "model": "Atlas",
    "year": 2027,
    "oneLiner": "面向中高级滑手的中硬度全山地款，官方列出 8/10 硬度。",
    "priceMin": 2277,
    "priceMax": 2277,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/d884683231791f4c40c3707f39a448c5eb568ca2d7d0340a24a617c6ed59ef1b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 8.5,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 8,
      "flexFeel": "stiff",
      "mountingSystem": "Camber Disk + Washer；兼容 4x4、4x2 与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "S7 Duraflex CB 碳纤维注入尼龙底盘；Vaporlite HD 2.0 防水减震衬套；3D 挤压铝后跟杯",
      "ankleStrap": "Exoframe 5.0 三轴渐进弯曲脚踝绑带",
      "toeStrap": "TS 6.0 Dual-Layer UltraGrip 双层防滑脚趾绑带",
      "buckles": "Magnesium S1 镁合金棘轮扣，钢制底座",
      "bindingSizeGuide": "Union 官方表：男靴 S US 5.5–7.5 / M 8–10 / L 10.5–13；女靴 S 4.5–6.5 / M 7–9；具体按官方尺码表核对",
      "highback": "S22 Duraflex CB 高背",
      "highbackAdjustment": "Cam-Lock FLAD 前倾调节；Pins + Quick-Lock 免工具绑带调节",
      "cushioning": "Non-Stick HP EVA 防积雪脚床；Vaporlite HD 2.0 衬套；3° Canting",
      "warranty": "底盘与后跟杯终身保修；其他部件 1 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://unionbindingcompany.com/products/union-atlas-mens-snowboard-binding-2027；https://eu.unionbindingcompany.com/pages/disk-guide",
      "officialPrice": "USD 399.95",
      "priceMarket": "Union Binding Company 日本官方商店；2027 款商品页",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://unionbindingcompany.com/products/union-atlas-mens-snowboard-binding-2027",
      "priceStatus": "Union 日本官方商店 2027 款 Atlas 页面标价 JPY 53,900（含税），按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 2,276.60。页面尺码为 S/M/L，商品当时显示售罄；运费结账计算。日本官方店折算参考，不是中国售价或成交价，库存会变化。"
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
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      }
    ]
  },
  {
    "id": "01a12e89-6127-771c-b59e-e7edac25b6b0",
    "slug": "union-atlas-pro-2027",
    "title": "Union Binding Company Atlas Pro 2027",
    "model": "Atlas Pro",
    "year": 2027,
    "oneLiner": "采用锻造碳纤维等高响应结构，定位高阶全山地与强支撑滑行。",
    "priceMin": 2927,
    "priceMax": 2927,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b132ce906e6da15a39085e9b0f55fadc8d2d584adab6b9b2d3b4d4b6008caaa5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.2,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 9,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "pro-stiff",
      "mountingSystem": "Camber Disk + Washer；兼容 4x4、4x2 与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "S7 Duraflex CB 碳纤维注入尼龙底盘；Vaporlite HD 2.0 防水减震衬套",
      "ankleStrap": "Hybrid 2.0 TPE Core，V 型结构随鞋靴弯曲并兼顾支撑舒适",
      "toeStrap": "TS 6.0 Dual-Layer UltraGrip 双层防滑脚趾绑带",
      "buckles": "Magnesium S1 镁合金卡扣，铝合金底座",
      "bindingSizeGuide": "Union 官方尺码表：男靴 S US 6–8 / M 8.5–10.5 / L 11–13；女靴 S 5–6 / M 6.5–8.5 / L 9–11",
      "highback": "S14 Duraflex CB 碳纤维注入尼龙高背",
      "highbackAdjustment": "Integrated Dial 一体式前倾角调节",
      "cushioning": "Vaporlite HD 2.0 衬套、Forged Carbon 锻造碳踏板与 Non-Stick EVA；3° Canting",
      "warranty": "底盘与后跟杯终身保修；其余部件 2 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://unionbindingcompany.com/products/union-atlas-pro-unisex-snowboard-binding-2027；https://eu.unionbindingcompany.com/pages/disk-guide",
      "officialPrice": "USD 499.95",
      "priceMarket": "Union Binding Company 日本官方商店；2027 款商品页",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://unionbindingcompany.com/products/union-atlas-pro-unisex-snowboard-binding-2027",
      "priceStatus": "Union 日本官方商店 2027 款 Atlas Pro 页面标价 JPY 69,300（含税），按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 2,927.05。页面尺码为 S/M/L，商品当时显示售罄；运费结账计算。日本官方店折算参考，不是中国售价或成交价，库存会变化。"
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
        "value": "专业硬朗"
      }
    ]
  },
  {
    "id": "01a12e89-6133-774d-8141-0d165637e6f6",
    "slug": "union-force-2027",
    "title": "Union Binding Company Force 2027",
    "model": "Force",
    "year": 2027,
    "oneLiner": "Union 全山地工作马型固定器，官方列出 7/10 硬度与全地形定位。",
    "priceMin": 1951,
    "priceMax": 1951,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/f5e1d8abda88e603afec45441c51c0c9bc7a850274b1c8b2504bbeb721df2944.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.9,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 8.1,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 7,
      "flexFeel": "stiff",
      "mountingSystem": "Camber Disk；兼容 4x4、4x2 与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "S9 Duraflex ST 底盘；Molecular Bushing Suspension System 缓震衬套；3D 挤压铝后跟杯",
      "ankleStrap": "Exoframe 6.0 PU 芯脚踝绑带，兼顾贴合与缓冲",
      "toeStrap": "TS 5.0 UltraGrip 多位置防滑脚趾绑带",
      "buckles": "Magnesium S2 镁合金棘轮扣，钢制底座",
      "bindingSizeGuide": "Union 官方男靴尺码：S US 5.5–7.5 / M 8–10 / L 10.5–13 / XL 13–15",
      "highback": "S19 Duraflex ST 分层结构高背",
      "highbackAdjustment": "Cam-Lock FLAD 前倾调节；EXO Quick-Lock 免工具绑带调节",
      "cushioning": "Non-Stick HP EVA 防积雪脚床；Molecular Bushing Suspension System；3° Canting",
      "warranty": "底盘与后跟杯终身保修；其他部件 1 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://unionbindingcompany.com/products/union-force-mens-snowboard-binding-2027；https://eu.unionbindingcompany.com/pages/disk-guide",
      "officialPrice": "USD 349.95",
      "priceMarket": "Union Binding Company 日本官方商店；2027 款商品页",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://unionbindingcompany.com/products/union-force-mens-snowboard-binding-2027",
      "priceStatus": "Union 日本官方商店 2027 款 Force 页面标价 JPY 46,200（含税），按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 1,951.37。页面尺码为 S/M/L/XL，商品当时显示售罄；运费结账计算。日本官方店折算参考，不是中国售价或成交价，库存会变化。"
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
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "偏硬"
      }
    ]
  },
  {
    "id": "01a12e89-6141-7d30-904e-e1ca00b0fa83",
    "slug": "union-force-classic-2027",
    "title": "Union Binding Company Force Classic 2027",
    "model": "Force Classic",
    "year": 2027,
    "oneLiner": "Force 经典款全地形绑带固定器，官方页面列出 6/10 硬度。",
    "priceMin": 1766,
    "priceMax": 1766,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/98c06aa8cea0b624c9ec38def27ede3fb86e9dce76a9fd1e5b49678bf9758990.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.7,
    "editorialScores": {
      "value": 5,
      "comfort": 7.1,
      "response": 7.6,
      "convenience": 6.2,
      "versatility": 6.8
    },
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flex": 6,
      "flexFeel": "medium",
      "mountingSystem": "Camber Disk；兼容 4x4、4x2 与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "S4 Duraflex ST 底盘；Multi-Density Thermoformed EVA 缓震衬套；3D 挤压铝后跟杯",
      "ankleStrap": "Exoframe 4.0 轻量脚踝绑带",
      "toeStrap": "TS 2.1 UltraGrip 多位置防滑脚趾绑带，适配不同品牌雪鞋",
      "buckles": "Aluminum S2 铝合金棘轮扣，钢制底座",
      "bindingSizeGuide": "Union 官方男靴尺码：S US 5.5–7.5 / M 8–10 / L 10.5–13；官方页面当前列出 S、M、L",
      "highback": "S1 Duraflex ST 高背",
      "highbackAdjustment": "Cam-Lock FLAD 前倾调节；EXO Quick-Lock 免工具绑带调节",
      "cushioning": "Multi-Density Thermoformed EVA 缓震；3° Canting",
      "warranty": "底盘与后跟杯终身保修；其他部件 1 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://unionbindingcompany.com/products/union-force-classic-mens-snowboard-binding-2027；https://eu.unionbindingcompany.com/pages/disk-guide",
      "officialPrice": "JPY 41800",
      "priceMarket": "Union Binding Company 日本官方商店；2027 款官方商品页",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://unionbindingcompany.com/products/union-force-classic-mens-snowboard-binding-2027",
      "priceStatus": "Union 日本官方商店 2027 款 Force Classic 页面标价 JPY 41,800（含日本消费税），按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 1,765.53。页面列出 S/M/L 并显示售罄；运费结账计算。日本官方店折算参考，不是中国售价或成交价，跨境运输及进口费用未计，库存会变化。"
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
        "key": "flexFeel",
        "label": "硬度手感",
        "value": "中等"
      }
    ]
  },
  {
    "id": "01a12e89-614e-7879-9479-fc3a2b8c5a36",
    "slug": "union-legacy-2027",
    "title": "Union Binding Company Legacy 2027",
    "model": "Legacy",
    "year": 2027,
    "oneLiner": "偏柔软脚感的女款公园与自由式固定器，官方强调减震与板面自然弯曲。",
    "priceMin": 1812,
    "priceMax": 1812,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/68f91f6a01e7a61951057da38ebfa770ffa37aff9f8dd45791205ea8457b781d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 63.9,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 6.4,
      "convenience": 6.2,
      "versatility": 7.2
    },
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "soft",
      "mountingSystem": "Union Mini Disk；兼容 4x2 与 Burton Channel；不兼容 4x4 圆盘安装",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "S6 Duraflex ST；中等偏软自由式底盘，提供较自然的板面弯曲",
      "ankleStrap": "Forma Hybrid Memory Core，外侧响应、内侧带缓冲舒适衬垫",
      "toeStrap": "TS 2.1 UltraGrip，多位置安装，可适配不同品牌雪鞋",
      "buckles": "Aluminum S2 铝合金卡扣，钢制底座",
      "bindingSizeGuide": "女款官方参考：S US 女靴 4–6.5 / M 6.5–8.5 / L 9–11；另有跨性别尺码表",
      "highback": "S10 Duraflex ST",
      "highbackAdjustment": "Classic 前倾调节，需使用 3 号螺丝刀",
      "cushioning": "OTE Fused Vaporlite 2.0 缓震衬套；Mini Disk 结构保留板面自然弯曲",
      "warranty": "底盘与后跟杯终身保修；其余部件 1 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。 Mini Disk 支持 2x4 与 Channel，不支持 4x4 或旧 3D；不能套用 Universal Disk V2 的兼容范围。",
      "compatibilitySources": "https://unionbindingcompany.com/en-ca/products/union-legacy-womens-snowboard-binding-2027；https://eu.unionbindingcompany.com/pages/disk-guide",
      "officialPrice": "JPY 42900",
      "priceMarket": "Union Binding Company 日本官方商店；2027 款官方商品页",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://unionbindingcompany.com/en-ca/products/union-legacy-womens-snowboard-binding-2027",
      "priceStatus": "Union 日本官方商店 2027 款 Legacy 页面标价 JPY 42,900（含日本消费税），按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 1,811.99。页面列出 S/M/L 并显示售罄；运费结账计算。日本官方店折算参考，不是中国售价或成交价，跨境运输及进口费用未计，库存会变化。"
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
      }
    ]
  },
  {
    "id": "01a12e89-615c-7a51-9be6-c0043e202294",
    "slug": "union-trilogy-2027",
    "title": "Union Binding Company Trilogy 2027",
    "model": "Trilogy",
    "year": 2027,
    "oneLiner": "Union 女款全山地固定器，官方定位覆盖雪道、粉雪与公园场景。",
    "priceMin": 1951,
    "priceMax": 1951,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/51dc14fbee054701df1d4eedc2edb1babb6a29e7a8f8734ccd8ee4c2743715c3.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 68.2,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 7.8,
      "convenience": 6.2,
      "versatility": 7.6
    },
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "mid-stiff",
      "mountingSystem": "Camber Disk；兼容 4x4、4x2 与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "S9 Duraflex ST 高强度底盘；Molecular Bushing Suspension System",
      "ankleStrap": "Exoframe 6.0 PU Core，缓冲舒适与快速响应结合",
      "toeStrap": "TS 5.0 UltraGrip，多位置安装、防滑热塑材料",
      "buckles": "Magnesium S2 镁合金卡扣，钢制底座",
      "bindingSizeGuide": "女款官方参考：S US 女靴 4–6.5 / M 6.5–8.5 / L 9–11；另有跨性别尺码表",
      "highback": "S19 Duraflex ST 分层高背，兼顾边刃响应与扭转柔韧",
      "highbackAdjustment": "Cam-Lock 前倾角调节",
      "cushioning": "Molecular Bushing 悬挂衬套用于减震与吸收冲击",
      "warranty": "底盘与后跟杯终身保修；其余部件 2 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。",
      "compatibilitySources": "https://jp.unionbindingcompany.com/products/union-trilogy-womens-snowboard-binding-2027；https://eu.unionbindingcompany.com/pages/disk-guide",
      "officialPrice": "JPY 46200",
      "priceMarket": "Union Binding Company 日本官方商店；2027 款官方商品页",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.unionbindingcompany.com/products/union-trilogy-womens-snowboard-binding-2027",
      "priceStatus": "Union 日本官方商店 2027 款 Trilogy 页面标价 JPY 46,200（含日本消费税），按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 1,951.37。页面列出 S/M/L 并显示售罄；运费结账计算。日本官方店折算参考，不是中国售价或成交价，跨境运输及进口费用未计，库存会变化。"
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
      }
    ]
  },
  {
    "id": "01a12e89-6169-7ed8-ae1d-392f8e2bf91a",
    "slug": "union-ultra-2027",
    "title": "Union Binding Company Ultra 2027",
    "model": "Ultra",
    "year": 2027,
    "oneLiner": "以缓震和板感为重点的女款自由式固定器，官方介绍其悬挂式缓震结构。",
    "priceMin": 1998,
    "priceMax": 1998,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/5bd11edb1362a5f9b4f89be3e2d76614b9a54c39fcf7daea6c43284aca0bb6c5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 66.2,
    "editorialScores": {
      "value": 5,
      "comfort": 6.8,
      "response": 7.3,
      "convenience": 6.2,
      "versatility": 7.2
    },
    "brand": {
      "slug": "union",
      "name": "Union Binding Company",
      "nameCn": "Union"
    },
    "categorySlug": "snowboard-binding",
    "specs": {
      "entrySystem": "strap",
      "flexFeel": "medium",
      "mountingSystem": "非对称 Mini Disk；兼容 4x2 与 Burton Channel",
      "bootCompatibility": "常规单板雪鞋需按本固定器尺码表试装；绑带、鞋底外形和前后脚突出量均须核对，不保证任意品牌任意鞋款匹配。",
      "baseplateMaterial": "S11 Duraflex ST 非对称 Mini Disk 底盘；Moleculer 衬套与 TPE 外底",
      "ankleStrap": "Hybrid 1.0 PU Core，Exoframe 外层搭配柔软舒适内衬",
      "toeStrap": "TS 5.0 UltraGrip，多位置调节、防滑热塑材料",
      "buckles": "Magnesium S1 镁合金卡扣，钢制底座",
      "bindingSizeGuide": "女款官方参考：S US 女靴 4–6.5 / M 6.5–8.5 / L 9–11；另有跨性别尺码表",
      "highback": "S25 Ultra Duraflex ST，预压 6° 前倾",
      "highbackAdjustment": "Integrated 2-Stage 前倾角微调，使用 3 号螺丝刀",
      "cushioning": "Moleculer 衬套与 TPE 外底提供缓震和回弹；Union 标注固定器硬度 6/10",
      "warranty": "底盘与后跟杯终身保修；其余部件 2 年保修",
      "selectionNotes": "先按雪鞋品牌和实际尺码选固定器，再检查后跟贴合、绑带有效长度、鞋头/鞋跟居中；区间重叠或边界码要试装。雪板安装孔位另按随附圆盘核对。 Mini Disk 支持 2x4 与 Channel，不支持 4x4 或旧 3D；不能套用 Universal Disk V2 的兼容范围。",
      "compatibilitySources": "https://unionbindingcompany.com/products/union-ultra-womens-snowboard-binding-2027；https://eu.unionbindingcompany.com/pages/disk-guide",
      "officialPrice": "USD 329.95",
      "priceMarket": "Union Binding Company 日本官方商店；女款 2027 款商品页",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://unionbindingcompany.com/products/union-ultra-womens-snowboard-binding-2027",
      "priceStatus": "Union 日本官方商店女款 2027 Ultra 页面标价 JPY 47,300（含税），按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 1,997.83。页面尺码为 S/M/L，商品当时显示售罄；运费结账计算。日本官方店折算参考，不是中国售价或成交价，库存会变化。"
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
      }
    ]
  },
  {
    "id": "01a12e89-6178-7698-944d-dd7b5771c793",
    "slug": "burton-ion-boa-2027",
    "title": "Burton Ion BOA 2027",
    "model": "Ion BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；双区高功率 BOA。尺码与脚感以实际试穿为准。",
    "priceMin": 3856,
    "priceMax": 3856,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/77d75052614b2629a63095de0c01d1b3628191fd2fe14815cae625f319236276.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 79.4,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 8.6,
      "convenience": 8.9
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual Zone High Power Focus BOA：上下双区独立调节",
      "flex": "硬朗支撑（Burton 官方标注 Stiff & Aggressive）",
      "fit": "Regular 常规宽度",
      "liner": "Life Liner",
      "innerCuff": "Tuff Cuff Lite",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "outsole": "Autocant 外底；Burton 再生含量橡胶",
      "warmthFeatures": "DRYRIDE Heat Cycle 内衬",
      "sizeGuide": "官方男款尺码表覆盖 US 6–15、EU 38–48、UK 5–14、Mondo 24–33；半码对应以商品页逐码表为准",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-ion-boa-snowboard-boots-185791；https://www.burton.com/en-us/pages/size-charts",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Burton 美国官方商品页标题标注 Ion BOA 2027，变体色款代码为 27WIN-185791；据此确认对应 2026/27 雪季。",
      "officialPrice": "USD 689.95",
      "priceMarket": "Burton 日本官方商店；型号 ID 185791、色款标识 27WIN-185791",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/mens-burton-ion-boa-snowboard-boots-185791",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 185791 / 色款标识 27WIN-185791，标价 JPY 91,300；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 3,856.28。页面列出 Regular 宽度及男款 Mondo 尺码，31 码当时显示售罄。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual Zone High Power Focus BOA：上下双区独立调节"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "硬朗支撑（Burton 官方标注 Stiff & Aggressive）"
      }
    ]
  },
  {
    "id": "01a12e89-6184-7bf6-940f-24e7b21ba595",
    "slug": "burton-ion-step-on-2027",
    "title": "Burton Ion Step On 2027",
    "model": "Ion Step On",
    "year": 2027,
    "oneLiner": "官方档案型号；Speed Zone 系带与可调 BOA 压紧带，Step On 系统需配专用固定器。尺码与脚感以实际试穿为准。",
    "priceMin": 3763,
    "priceMax": 3763,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c33a9036db5c02b2471c77a083ef81a4d6421be8256628b13bfc1efca858e518.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 79.8,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 8.2,
      "support": 8.6,
      "convenience": 8
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Speed Zone 快速系带 + BOA 可调压紧带",
      "flex": "硬朗（Burton 官方标注 Stiff & Aggressive）",
      "fit": "Regular/Wide 宽度可选",
      "liner": "Life Liner",
      "innerCuff": "Tuff Cuff Lite",
      "bindingCompatibility": "认证 Step On 专用雪鞋；仅按对应性别系列和尺码配 Step On 固定器，不能作为普通绑带雪鞋使用。",
      "outsole": "Vibram Traction Lug 外底，Vibram EcoStep 橡胶；Step On 前掌连接卡齿",
      "warmthFeatures": "Sleeping Bag 反射隔热膜",
      "sizeGuide": "官方男款尺码表覆盖 US 6–15、EU 38–48、UK 5–14、Mondo 24–33；当前页面尺码范围 US 7–13，半码对应以商品页逐码表为准",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Step On 还需核对固定器男/女/儿童系列，普通绑带固定器不能仅因鞋码相同而替代。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-ion-step-on-snowboard-boots-203191；https://www.burton.com/en-us/pages/size-charts",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。 Wide 应与该品牌同型号标准版比较，不能视为跨品牌统一宽度。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Burton 美国官方商品页标题标注 Ion Step On 2027，变体色款代码为 27WIN-203191；据此确认对应 2026/27 雪季。页面同时说明该鞋仅兼容 Step On 固定器。",
      "officialPrice": "USD 619.95",
      "priceMarket": "Burton 日本官方商店；型号 ID 203191、色款标识 27WIN-203191",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/mens-burton-ion-step-on-snowboard-boots-203191",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 203191 / 色款标识 27WIN-203191，标价 JPY 89,100；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 3,763.36。页面列出 Regular/Wide 宽度及男款 Mondo 25–31 尺码；实时库存以结账页面所选变体为准。Step On 雪鞋只兼容 Burton Step On 固定器。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Speed Zone 快速系带 + BOA 可调压紧带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "硬朗（Burton 官方标注 Stiff & Aggressive）"
      }
    ]
  },
  {
    "id": "01a12e89-6190-75d3-9076-60199afa46b0",
    "slug": "burton-moto-boa-2027",
    "title": "Burton Moto BOA 2027",
    "model": "Moto BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；单 BOA 旋钮。尺码与脚感以实际试穿为准。",
    "priceMin": 1487,
    "priceMax": 1487,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/d44c9131d7727a11d9edf5085182148111b72133a4939ae89b8bc8c0ad6e9dee.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.3,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 6.7,
      "support": 6.2,
      "convenience": 8.3
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Single Zone BOA：单旋钮系带",
      "flex": "柔软、容错取向（Burton 官方描述）",
      "fit": "Regular 常规楦与 Wide 宽楦可选",
      "liner": "Imprint 1+ Liner",
      "innerCuff": "Integrated Lacing 一体式内靴系带",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "官方定位全地形与公园滑行",
      "outsole": "DynoLITE 外底，轻量缓震结构",
      "sizeGuide": "官方男款尺码表覆盖 US 6–15、EU 38–48、UK 5–14、Mondo 24–33；半码对应以商品页逐码表为准",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-moto-boa-snowboard-boots-131761；https://www.burton.com/en-us/pages/size-charts",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。 Wide 应与该品牌同型号标准版比较，不能视为跨品牌统一宽度。",
      "heatMolding": "官方当前页有热塑鞋胆的通用技术介绍，但本轮未核实该介绍是否对应本款所配鞋胆；具体型号、温度与流程须由专业店按品牌说明确认。",
      "seasonEvidence": "Burton 美国官方商品页标题标注 Moto BOA 2027，变体色款代码为 27WIN-131761；据此确认对应 2026/27 雪季。",
      "officialPrice": "USD 279.95",
      "priceMarket": "Burton 日本官方商店；型号 ID 131761、色款标识 27WIN-131761",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://jp.burton.com/ja-jp/products/mens-burton-moto-boa-snowboard-boots-131761",
      "priceStatus": "Burton 日本官方商品页对应 2027 款型号 ID 131761 / 色款标识 27WIN-131761，标价 JPY 35,200；按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算为 CNY 1,486.76。商品页列出宽度选项及 Mondo 尺码；页面当时 24、31、32、33 码显示售罄。税费口径以结账为准；此为日本官方店折算参考，不是中国售价，跨境配送及进口费用未计，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Single Zone BOA：单旋钮系带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "柔软、容错取向（Burton 官方描述）"
      }
    ]
  },
  {
    "id": "01a12e89-619c-7198-b6f6-f242a46564e2",
    "slug": "burton-photon-boa-2027",
    "title": "Burton Photon BOA 2027",
    "model": "Photon BOA",
    "year": 2027,
    "oneLiner": "官方档案型号；双区 BOA。尺码与脚感以实际试穿为准。",
    "priceMin": 3998,
    "priceMax": 3998,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/621c107205416d11915c9009c4798479fa3a5ad39375a74134b2a3837e00edf6.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 77.6,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 8.2,
      "support": 7.2,
      "convenience": 8.9
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual Zone BOA Lockdown：双区调节并加强脚跟锁定",
      "flex": "中等脚感（Burton 官方标注 Happy Medium）",
      "fit": "Regular/Wide 宽度可选",
      "liner": "Imprint 3 Liner",
      "innerCuff": "Focus Cuff",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "outsole": "Vibram Traction Lug 外底，Vibram EcoStep 橡胶",
      "warmthFeatures": "DRYRIDE Heat Cycle 内衬；反射隔热膜",
      "sizeGuide": "官方男款尺码表覆盖 US 6–15、EU 38–48、UK 5–14、Mondo 24–33；半码对应以商品页逐码表为准",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。",
      "compatibilitySources": "https://www.burton.com/en-us/products/mens-burton-photon-boa-snowboard-boots-150861；https://www.burton.com/en-us/pages/size-charts",
      "fitEvidence": "Burton 日本官方 Photon BOA 2027 页面按颜色变体代码 27WIN-150861 确认提供 Wide 选项。Burton 官方宽版指南明确称所有标记为 Wide 的 Burton 雪鞋均使用同尺码 Regular 外壳，并在前掌与中足连接处以弹性氯丁橡胶鞋胆面板替代泡棉，从而增加该处空间；此处是将品牌通用规则应用于已确认的 Photon Wide 变体，不是 Photon 专属拆解或毫米测量。品牌建议结合脚长测量、试穿、多款比较和锁跟情况判断；宽街鞋（EE 或更宽）及整日挤压、热点、麻木或脚趾发冷者可考虑 Wide，但鞋码本身不能单独决定宽度。Photon 2027 未公布鞋楦毫米宽度或脚背容积。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Burton 美国官方商品页标题标注 Photon BOA 2027，变体色款代码为 27WIN-150861；据此确认对应 2026/27 雪季。",
      "officialPrice": "USD 479.95",
      "priceMarket": "中国零售挂牌参考；SPADERS 黑桃滑雪俱乐部微信店铺的 26/27 Photon BOA Black",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://detail.youzan.com/show/goods?alias=1yaa3wlsebfamck&from_source=gbox_seo",
      "priceStatus": "SPADERS 黑桃滑雪俱乐部微信认证店铺页面标注 26/27 Burton Photon BOA Black，挂牌 CNY 3,998，支持立即购买；页面显示运费范围 CNY 0–200，但没有商品货号、尺码选项或库存明细，因此仅作为中国零售商挂牌参考，不能称作 Burton 官方价或实际成交价。Burton 日本官方同型号 ID 150861、色款代码 27WIN-150861 页面标价 JPY 69,300，按 ECB 2026-10-13 汇率折算 CNY 2,933.63，继续保留为独立地区对照。日本 BURTON 正规取扱零售页另列 26/27 Photon BOA Wide、Chinchilla Gray、型号 150861，挂牌 JPY 69,300；页面显示 Mondo 26、27、27.5 等尺码残量较少且其他尺码有货或缺货，属于日本单店瞬时库存快照，不等于品牌全球尺码范围或中国库存。跨境运费和进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual Zone BOA Lockdown：双区调节并加强脚跟锁定"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等脚感（Burton 官方标注 Happy Medium）"
      }
    ]
  },
  {
    "id": "01a13d55-1aa7-736c-985a-5414703a61d9",
    "slug": "burton-felix-step-on-womens-2027",
    "title": "Burton Women's Felix Step On 2027",
    "model": "Women's Felix Step On",
    "year": 2027,
    "oneLiner": "女款中等脚感 Step On 雪鞋，双区 BOA 与 Vibram 外底；仅配 Burton Step On 固定器。",
    "priceMin": 3347,
    "priceMax": 3347,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/275087c025fe3b227fab131a34202a0ee5b48cf37a2082ec7667897fb963c35d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76.8,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 8.2,
      "support": 7.2,
      "convenience": 8.3
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Sequence BOA：双路径单旋钮调节",
      "flex": "中等脚感（Burton 官方标注 Happy Medium）",
      "fit": "女款 Regular/Wide 可选；页面列出 US 女 5–10 尺码选项",
      "liner": "Imprint 3 女款鞋胆，可热塑",
      "innerCuff": "Focus Cuff",
      "bindingCompatibility": "仅兼容 Step On 固定器，不能用于普通绑带固定器。Nitro 官方指南说明 Nitro Step On 固定器兼容所有 Step On 雪鞋，但须使用女款固定器并按尺码表配码；本款女 US 5–6 / 6.5–8.5 / 9–10 分别对应女款 S/M/L。跨品牌实装仍应确认靴卡完全扣合。",
      "terrain": "Burton 官方定位全地形（all-terrain versatility）",
      "outsole": "Vibram Traction Lug / Vibram EcoStep；Step On 前掌连接卡齿",
      "warmthFeatures": "DRYRIDE Heat Cycle 内衬",
      "sizeGuide": "商品页尺码选择器列女 US 5、6、6.5、7、7.5、8、8.5、9、9.5、10；Burton 女款转换表对应 EU 35–42、UK 3–8、Mondo 22–27。码数列表不代表当前有货。",
      "selectionNotes": "按穿雪袜后的较长脚查 Burton 女款尺码表，再试穿核对脚趾余量、脚背压力和屈膝锁跟。女款 Burton 与 Nitro Step On 固定器表均按 US 5–6 为 S、6.5–8.5 为 M、9–11 为 L；需选择女款固定器并实扣确认。官网尺码选择器显示选项不等于库存。",
      "compatibilitySources": "https://www.burton.com/en-us/products/womens-burton-felix-step-on-snowboard-boots-172861；https://www.burton.com/en-us/products/womens-burton-step-on-re-flex-snowboard-bindings-172841；https://www.nitrosnowboards.com/pages/step-on；https://www.nitrosnowboards.com/collections/all-26-27/products/step-on-womens-bindings；https://www.burton.com/en-us/pages/size-charts",
      "fitEvidence": "Burton 商品页确认 Regular/Wide 两种宽度选项；未提供该款鞋楦毫米宽度或脚背容积，宽度需试穿确定。",
      "heatMolding": "商品页确认 Imprint 3 可热塑；热塑不能替代正确尺码和锁跟检查，操作按 Burton 指引由专业店完成。",
      "seasonEvidence": "Burton 美国官方商品页标题标注 2027，Black 变体代码为 27WIN-172861，据此归档为 2026/27（2027 款）。",
      "officialPrice": "USD 499.95",
      "priceMarket": "Burton 美国官方商店",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.burton.com/en-us/products/womens-burton-felix-step-on-snowboard-boots-172861",
      "priceStatus": "Burton 美国官方商品页标价 USD 499.95；按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.489 折合 CNY 3,346.55。该数值是美国地区官方挂牌折算参考，不是中国售价，未计跨境运费、税费及进口成本；页面尺码与库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Sequence BOA：双路径单旋钮调节"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等脚感（Burton 官方标注 Happy Medium）"
      }
    ]
  },
  {
    "id": "01a13d55-1aad-7d53-899a-0fd7dddf746a",
    "slug": "burton-highshot-step-on-womens-2027",
    "title": "Burton Women's Highshot Step On 2027",
    "model": "Women's Highshot Step On",
    "year": 2027,
    "oneLiner": "女款中偏硬脚感 Step On 雪鞋，单区 BOA 与 3M Thinsulate 保暖；仅配 Burton Step On 固定器。",
    "priceMin": 2095,
    "priceMax": 2095,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/df0255aeab1f39fec930f13b0fe024d5943ce73d05e0f6e0fabae7f4ab60203b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 78.5,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 8.2,
      "support": 7.9,
      "convenience": 8.3
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Sequence BOA 单旋钮",
      "flex": "中偏硬、支撑取向（Burton 官方描述 medium-stiff）",
      "fit": "女款 Regular/Wide 可选；官方尺码选择器列 US 女 5–11",
      "liner": "Imprint 2，含 3M Thinsulate，可热塑",
      "innerCuff": "Lock-Up Cuff",
      "bindingCompatibility": "仅兼容 Step On 固定器，不能用于普通绑带固定器。Nitro 官方指南说明 Nitro Step On 固定器兼容所有 Step On 雪鞋，但须使用女款固定器并按尺码表配码；本款女 US 5–6 / 6.5–8.5 / 9–11 分别对应女款 S/M/L。跨品牌实装仍应确认靴卡完全扣合。",
      "terrain": "Burton 官方定位 all-around / all-terrain",
      "outsole": "Step On 外底；Burton 再生橡胶，官方称含 20% 再生橡胶",
      "warmthFeatures": "3M Thinsulate 保温层",
      "sizeGuide": "商品页尺码选择器列女 US 5–11（半码档）；Burton 女款转换表对应 EU 35–43、UK 3–9、Mondo 22–28。尺码选项不代表当前有货。",
      "selectionNotes": "按穿雪袜后的较长脚查 Burton 女款尺码表，并试穿确认锁跟、脚背压力和宽度。女款 Burton 与 Nitro Step On 固定器表均按 US 5–6 为 S、6.5–8.5 为 M、9–11 为 L；需选择女款固定器并实扣确认。商品页的尺码选项不代表库存。",
      "compatibilitySources": "https://www.burton.com/en-us/products/womens-burton-highshot-step-on-snowboard-boots-303011；https://www.burton.com/en-us/products/womens-burton-step-on-re-flex-snowboard-bindings-172841；https://www.nitrosnowboards.com/pages/step-on；https://www.nitrosnowboards.com/collections/all-26-27/products/step-on-womens-bindings；https://www.burton.com/en-us/pages/size-charts",
      "fitEvidence": "官方商品页列 Regular/Wide 选项，未公布该款毫米鞋楦宽度或脚背容积；以实穿为准。",
      "heatMolding": "官方商品页标示热塑鞋胆；热塑不能替代正确尺码与锁跟检查，按品牌流程由专业店操作。",
      "seasonEvidence": "Burton 美国、日本官方商品页标题标注 2027，Black 变体代码为 27WIN-303011，据此归档为 2026/27（2027 款）。",
      "officialPrice": "JPY 49,500",
      "priceMarket": "Burton 日本官方商店",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://jp.burton.com/en-jp/products/womens-burton-highshot-step-on-snowboard-boots-303011",
      "priceStatus": "Burton 日本官方商品页标价 JPY 49,500；按 ECB 2026-10-13 EUR/JPY 176.91、EUR/CNY 7.489 折合 CNY 2,095.45。该数值是日本地区官方挂牌折算参考，不是中国售价；页面税费和跨境配送以结账为准，未计进口成本。尺码选项与库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Sequence BOA 单旋钮"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中偏硬、支撑取向（Burton 官方描述 medium-stiff）"
      }
    ]
  },
  {
    "id": "01a13d55-1ab4-7699-938f-715166d974f7",
    "slug": "burton-highshot-x-step-on-womens-2027",
    "title": "Burton Women's Highshot X Step On 2027",
    "model": "Women's Highshot X Step On",
    "year": 2027,
    "oneLiner": "女款硬朗支撑型 Step On 雪鞋，双区 BOA 内置踝部吊带与 Vibram 外底；仅配 Burton Step On 固定器。",
    "priceMin": 3213,
    "priceMax": 3213,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1783df9a3e96f0d9adcb32d37deed6fa8dd1540499791ab4893040493c83670c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 81.7,
    "editorialScores": {
      "fit": 8.5,
      "value": 5,
      "warmth": 8.2,
      "support": 8.6,
      "convenience": 8.9
    },
    "brand": {
      "slug": "burton",
      "name": "Burton",
      "nameCn": "伯顿"
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual Zone BOA 内置踝部吊带：上下鞋壳分区调节并收紧脚踝",
      "flex": "硬朗支撑（Burton 官方描述 firm/supportive）",
      "fit": "女款 Regular/Wide 可选；官方尺码选择器列 US 女 5–11",
      "liner": "Asym Imprint 3，可热塑",
      "innerCuff": "Ankle Hammock 踝部吊带",
      "bindingCompatibility": "仅兼容 Step On 固定器，不能用于普通绑带固定器。Nitro 官方指南说明 Nitro Step On 固定器兼容所有 Step On 雪鞋，但须使用女款固定器并按尺码表配码；本款女 US 5–6 / 6.5–8.5 / 9–11 分别对应女款 S/M/L。跨品牌实装仍应确认靴卡完全扣合。",
      "terrain": "Burton 官方定位 all-around / all-terrain",
      "outsole": "X Firm Vibram Step On 外底 / Vibram EcoStep，官方称鞋底橡胶含 30% 再生材料",
      "warmthFeatures": "DRYRIDE Heat Cycle 内衬",
      "sizeGuide": "商品页尺码选择器列女 US 5–11（半码档）；Burton 女款转换表对应 EU 35–43、UK 3–9、Mondo 22–28。尺码选项不代表当前有货。",
      "selectionNotes": "按穿雪袜后的较长脚查 Burton 女款尺码表，并试穿确认脚跟保持、脚背舒适和宽度。女款 Burton 与 Nitro Step On 固定器表均按 US 5–6 为 S、6.5–8.5 为 M、9–11 为 L；需选择女款固定器并实扣确认。商品页尺码选项不代表实时库存。",
      "compatibilitySources": "https://www.burton.com/en-us/products/womens-burton-highshot-x-step-on-snowboard-boots-303021；https://www.burton.com/en-us/products/womens-burton-step-on-re-flex-snowboard-bindings-172841；https://www.nitrosnowboards.com/pages/step-on；https://www.nitrosnowboards.com/collections/all-26-27/products/step-on-womens-bindings；https://www.burton.com/en-us/pages/size-charts",
      "fitEvidence": "官方商品页列 Regular/Wide 选项，未公布该款毫米鞋楦宽度或脚背容积；以实穿为准。",
      "heatMolding": "官方商品页标示热塑鞋胆；热塑不能替代正确尺码与锁跟检查，按品牌流程由专业店操作。",
      "seasonEvidence": "Burton 美国、日本官方商品页标题标注 2027，Nightshade Purple 变体代码为 27WIN-303021，据此归档为 2026/27（2027 款）。",
      "officialPrice": "JPY 75,900",
      "priceMarket": "Burton 日本官方商店",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://jp.burton.com/en-jp/products/womens-burton-highshot-x-step-on-snowboard-boots-303021",
      "priceStatus": "Burton 日本官方商品页标价 JPY 75,900；按 ECB 2026-10-13 EUR/JPY 176.91、EUR/CNY 7.489 折合 CNY 3,213.02。该数值是日本地区官方挂牌折算参考，不是中国售价；页面税费和跨境配送以结账为准，未计进口成本。尺码选项与库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual Zone BOA 内置踝部吊带：上下鞋壳分区调节并收紧脚踝"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "硬朗支撑（Burton 官方描述 firm/supportive）"
      }
    ]
  },
  {
    "id": "01a12e89-61a8-7398-8cfc-b526421b92cd",
    "slug": "k2-boundary-2027",
    "title": "K2 Boundary 2027",
    "model": "Boundary",
    "year": 2027,
    "oneLiner": "官方档案型号；BOA 系带。尺码与脚感以实际试穿为准。",
    "priceMin": 2342,
    "priceMax": 2342,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b2c0046d3a4dd03e7df71cbead8d509120daf6d71134ce899339efc9662fd7b7.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.1,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 7.3,
      "convenience": 8.9
    },
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 Zonal BOA Fit System（H5 与 M+2 旋钮，分别调节鞋面上下区域）",
      "flex": "官方页面仅以 Playful–Precise 视觉轴展示脚感，未给出单一硬度值",
      "fit": "Intuition Control Foam 3D 热塑鞋胆，3 点内靴束带及内外 J-Bar 辅助跟部贴合",
      "liner": "Intuition Control Foam 3D 热塑鞋胆",
      "innerCuff": "3 点束带与内外 J-Bar；独立活动式鞋口",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "Freeride、Big Mountain、Freestyle、Powder（K2 官方列出的用途）",
      "outsole": "This Grips! 橡胶外底，EVA 双密度中底与 Harshmellow 减震",
      "footbed": "Harshmellow Insole；鞋底另含 EVA 双密度中底与 Harshmellow 减震材料",
      "sizeGuide": "官方男款当前可选 US 7–13；K2 官方换算表覆盖 US 5–15、EU 36.5–50、CM 23–33，具体换算按商品页尺码表",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。",
      "compatibilitySources": "https://k2snow.com/en-us/p/boundary-mens-snowboard-boot-kb261666?color=brown",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "K2 美国官方男款雪鞋目录将 Boundary 列为 2027 款，并显示 USD 349.95；直接商品页为同一型号货号 KB261666。",
      "officialPrice": "USD 349.95",
      "priceMarket": "K2 美国官方商店；2027 男款商品目录",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://k2snow.com/en-us/c/snowboard-boots/mens-snowboard-boots/",
      "priceStatus": "2026-10-14 K2 美国官方 2027 男款商品目录标价 USD 349.95，按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 折算为 CNY 2,342.49。仅为美国官方店折算参考，不是中国售价；汇率仅供参考，税费、配送及进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 Zonal BOA Fit System（H5 与 M+2 旋钮，分别调节鞋面上下区域）"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "官方页面仅以 Playful–Precise 视觉轴展示脚感，未给出单一硬度值"
      }
    ]
  },
  {
    "id": "01a12e89-61b5-7067-b6ff-b29a5436bfbe",
    "slug": "k2-maysis-2027",
    "title": "K2 Maysis 2027",
    "model": "Maysis",
    "year": 2027,
    "oneLiner": "采用双区 BOA 与 Conda 脚跟固定系统，搭配热塑 Intuition 鞋胆。",
    "priceMin": 2543,
    "priceMax": 2543,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2a653606e818b1fa38abaee916268f052a5c5f81e58ed110e3e9528294725954.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 76.1,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 7.3,
      "convenience": 8.9
    },
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 Zonal BOA（H5 与 M+2 旋钮）+ Conda 内靴 BOA 脚跟束带",
      "flex": "官方页面仅以 Playful–Precise 视觉轴展示脚感，未给出单一硬度值",
      "fit": "Conda 束带收紧脚跟；内外 J-Bar 减少脚跟抬起；Intuition Control Foam 3D 热塑鞋胆",
      "liner": "Intuition Control Foam 3D 热塑鞋胆；含 S’Cafe 咖啡渣网布层",
      "innerCuff": "Conda 内靴系带提供脚跟固定与脚踝支撑",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "Freeride、Big Mountain、Freestyle、Powder（K2 官方列出的用途）",
      "outsole": "This Grips! 双橡胶外底；EVA 双密度中底与 Harshmellow 减震",
      "warmthFeatures": "Intuition Control Foam 3D 热塑鞋胆；K2 官方描述其提供保暖与舒适，未列独立反射隔热膜",
      "footbed": "Harshmellow Plus Insole；鞋底另含 EVA 双密度中底与 Harshmellow 减震材料",
      "sizeGuide": "官方男款可选 US 5–15；K2 官方换算表列有 US、EU、UK 与 CM 对照，具体半码映射见商品页尺码表",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。",
      "compatibilitySources": "https://k2snow.com/en-us/p/maysis-mens-snowboard-boot-kb261665?color=black",
      "fitEvidence": "K2 未公布常规 Maysis 的绝对鞋楦宽度或脚背容积。官方 2027 Maysis Wide（KB261664）页面称壳体与鞋胆均比常规版宽 7 mm；这是相对型号差值，不是特定尺码的 last 宽度，也不等于实测脚型适配结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "K2 美国官方商品页标题为 K2 Maysis Men's Snowboard Boots 2027；价格与型号直接对应。",
      "officialPrice": "USD 379.95",
      "priceMarket": "K2 美国官方商店；2027 男款商品页",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://k2snow.com/en-us/p/maysis-mens-snowboard-boot-kb261665",
      "priceStatus": "K2 美国官方 2027 商品页标价 USD 379.95，按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 折算 CNY 2,543.30，仍作为主参考。Murasaki 日本零售商另列 K2 MAYSIS 男款 26-27 含税价 JPY 64,900，按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 2,741.21；作为日本地区零售价交叉参考，不是中国售价，商品页未显示 K2 厂商货号。页面标示预计 2026 年 11 月至 12 月下旬到货，所选 23 cm 线上无货，不能推断其它尺码库存。两地价格均未含跨境运输及进口费用，汇率为参考值而非交易汇率。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 Zonal BOA（H5 与 M+2 旋钮）+ Conda 内靴 BOA 脚跟束带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "官方页面仅以 Playful–Precise 视觉轴展示脚感，未给出单一硬度值"
      }
    ]
  },
  {
    "id": "01a13d55-1abb-7c62-8665-890778ec42dc",
    "slug": "k2-maysis-wide-2027",
    "title": "K2 Maysis Wide 2027",
    "model": "Maysis Wide",
    "year": 2027,
    "oneLiner": "Maysis 常规版的宽版；K2 标注鞋壳和鞋胆均宽 7 mm，搭配双区 BOA 与 Conda 锁跟系统。",
    "priceMin": 2543,
    "priceMax": 2543,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/5e01a55e742038f6a511f0e13a1f7c1dd87a8b59d8b91d087676ebcd8d2f4ba9.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 77.6,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 8.2,
      "support": 7.3,
      "convenience": 8.7
    },
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 BOA（H5 与 M+2 旋钮）+ Conda 内靴系带",
      "flex": "官方页面以 Playful–Precise 视觉轴展示脚感，未给单一硬度值",
      "fit": "K2 标注 Maysis Wide 的鞋壳和鞋胆均比 Maysis 常规版宽 7 mm；这是同型号的相对差值，不是绝对鞋楦宽度",
      "liner": "Intuition Control Foam 3D 热塑鞋胆；含 S’Cafe 咖啡渣网布层",
      "innerCuff": "Conda 内靴系带提供脚跟固定与脚踝支撑",
      "bindingCompatibility": "普通单板固定器需按具体品牌尺码表核对并实装确认鞋底、后跟与绑带；K2 页面未标 Step On 接口，不当作 Step On 专用鞋使用。",
      "terrain": "Freeride、Big Mountain、Freestyle、Powder（K2 官方列出的用途）",
      "outsole": "This Grips! 双橡胶外底；EVA 双密度中底与 Harshmellow 减震",
      "warmthFeatures": "Intuition Control Foam 3D 热塑鞋胆；K2 官方描述其提供保暖与舒适，未列独立反射隔热膜",
      "footbed": "Harshmellow Plus Insole；鞋底另含 EVA 双密度中底与 Harshmellow 减震材料",
      "sizeGuide": "K2 官方 Maysis Wide 2027 页面列男款 US 6–13 可选；换算表覆盖 US、EU、UK 与 CM，实际可购尺码以商品页实时选项为准",
      "selectionNotes": "按穿雪袜后的较长脚查 K2 男款尺码表，再试穿检查脚趾接触、脚跟抬起和宽度压力。7 mm 是 Maysis Wide 相对常规版的壳体与鞋胆差值，不可当作鞋楦绝对宽度或跨品牌宽度标准。",
      "compatibilitySources": "https://k2snow.com/en-us/p/maysis-wide-mens-snowboard-boots-kb261664?Color=BLACK&Size=8",
      "fitEvidence": "K2 官方同季 Maysis Wide 商品页明确写明 liner 和 shell 均比常规 Maysis 宽 7 mm；未公布毫米制 last 宽度或脚背容积。",
      "heatMolding": "官方页面说明 Intuition 鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变鞋壳宽度。流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "K2 美国官方商品页标题标注 Maysis Wide Men's Snowboard Boots 2027，商品路径含款号 KB261664。",
      "officialPrice": "USD 379.95",
      "priceMarket": "K2 美国官方商店；2027 男款 Wide 商品页",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://k2snow.com/en-us/p/maysis-wide-mens-snowboard-boots-kb261664",
      "priceStatus": "K2 美国官方 2027 商品页标价 USD 379.95，按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 折算 CNY 2,543.30；美国市场折算参考，不是中国售价。Alpen Online 日本零售页对应 26/27 款号 KB26166400，含税挂牌 JPY 64,900，按 ECB 2026-10-14 EUR/JPY 177.39、EUR/CNY 7.4925 折算 CNY 2,741.21；页面列 25.5–28.0 cm 选项，但显示店铺无库存且订单可能取消。美国页未核实各尺码实时库存；两地价格均未计跨境运输和进口费用。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 BOA（H5 与 M+2 旋钮）+ Conda 内靴系带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "官方页面以 Playful–Precise 视觉轴展示脚感，未给单一硬度值"
      }
    ]
  },
  {
    "id": "01a12e89-61c1-7975-a98d-08aa11f4e9ee",
    "slug": "k2-raider-2027",
    "title": "K2 Raider 2027",
    "model": "Raider",
    "year": 2027,
    "oneLiner": "单 BOA 外壳闭合搭配 Fast-In 内靴系带，面向入门与进阶滑手。",
    "priceMin": 1874,
    "priceMax": 1874,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/5114dd145b6a2bd27f15aa29e007c957fbd24b37a5400ae71fb23870735dd525.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.9,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 7.3,
      "convenience": 8.1
    },
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "单区 H5 Coiler BOA + Fast-In 内靴系带",
      "flex": "官方页面仅以 Playful–Precise 视觉轴展示脚感，未给出单一硬度值",
      "fit": "Intuition Comfort Foam 3D 热塑鞋胆；内外 J-Bar 支撑脚踝并减少脚跟抬起",
      "liner": "Intuition Comfort Foam 3D 热塑鞋胆",
      "innerCuff": "Fast-In 内靴系带与内外 J-Bar 脚踝支撑",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "K2 官方列出的适用场景为 Big Mountain、Powder；产品说明面向入门与进阶滑手",
      "outsole": "RollSole 外底，支持脚部内侧活动",
      "warmthFeatures": "Intuition Comfort Foam 3D 热塑鞋胆；官方描述为保暖、透气，未列独立反射隔热膜",
      "footbed": "Harshmellow Insole；鞋款介绍另说明 EVA 鞋垫",
      "sizeGuide": "官方男款可选 US 6–15；K2 官方换算表列有 US、EU、UK 与 CM 对照，具体半码映射见商品页尺码表",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。",
      "compatibilitySources": "https://k2snow.com/en-us/p/raider-mens-snowboard-boots-kb261667?color=sand",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "K2 美国官方商品页标题为 K2 Raider Men's Snowboard Boots 2027；价格与型号直接对应。",
      "officialPrice": "USD 279.95",
      "priceMarket": "K2 美国官方商店；2027 男款商品页",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://k2snow.com/en-us/p/raider-mens-snowboard-boots-kb261667",
      "priceStatus": "2026-10-14 K2 美国官方 2027 商品页标价 USD 279.95，按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 折算为 CNY 1,873.92。仅为美国官方店折算参考，不是中国售价；汇率仅供参考，税费、配送及进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "单区 H5 Coiler BOA + Fast-In 内靴系带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "官方页面仅以 Playful–Precise 视觉轴展示脚感，未给出单一硬度值"
      }
    ]
  },
  {
    "id": "01a12e89-61cc-724b-a49f-1787849e9612",
    "slug": "k2-taro-tamai-snowsurfer-rs-2027",
    "title": "K2 Taro Tamai Snowsurfer RS 2027",
    "model": "Taro Tamai Snowsurfer RS",
    "year": 2027,
    "oneLiner": "双区 BOA、F.O.R.M. Wrap 与可拆舌片支撑，采用偏柔软的冲浪式脚感。",
    "priceMin": 4485,
    "priceMax": 4485,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/37496de78c1c70977796987992759bb1c27e9667f91d6d0d3475a1115b9ef1f7.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.4,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 6.2,
      "convenience": 8.9
    },
    "brand": {
      "slug": "k2",
      "name": "K2",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 H5 Coiler BOA，独立调节鞋面上下区域",
      "flex": "偏柔软、冲浪式脚感；两片可拆舌片支撑可调整内外侧弯曲",
      "fit": "F.O.R.M. 三片式包裹结构，Intuition Pro Foam 3D Wrap 热塑鞋胆，3 点可调/可拆束带",
      "liner": "Intuition Pro Foam 3D Wrap 热塑鞋胆，带 SpaceHeater 保温层",
      "innerCuff": "可调/可拆 3 点束带与 J-Bar 脚踝支撑",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "Freeride、Powder（K2 官方列出的用途）",
      "outsole": "Vibram Rollsole 外底与 Eco-Harshmellow 减震",
      "warmthFeatures": "SpaceHeater 反射保温层；95% 消费后再生咖啡渣网布有助于吸湿除味",
      "footbed": "Eco-Harshmellow Pro Insole；官方描述具备减震与全天舒适性",
      "sizeGuide": "官方男款可选 US 6–12；K2 官方换算表列有 US、EU、UK 与 CM 对照，具体半码映射见商品页尺码表",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。",
      "compatibilitySources": "https://k2snow.com/en-us/p/taro-tamai-snowsurfer-rs-mens-snowboard-boot-kb261654?color=black-brown",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "K2 美国官方男款雪鞋目录将 Taro Tamai Snowsurfer RS 列为 2027 款，并显示 USD 669.95；对应档案商品型号为 RS 男款。",
      "officialPrice": "USD 669.95",
      "priceMarket": "K2 美国官方商店；2027 男款商品目录",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://k2snow.com/en-us/c/snowboard-boots/mens-snowboard-boots/",
      "priceStatus": "2026-10-14 K2 美国官方 2027 男款商品目录标价 USD 669.95，按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 折算为 CNY 4,484.50。仅为美国官方店折算参考，不是中国售价；汇率仅供参考，税费、配送及进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 H5 Coiler BOA，独立调节鞋面上下区域"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "偏柔软、冲浪式脚感；两片可拆舌片支撑可调整内外侧弯曲"
      }
    ]
  },
  {
    "id": "01a12e89-61d8-7afa-b472-1706ec459393",
    "slug": "nitro-bianca-tls-plus-2027",
    "title": "Nitro Bianca TLS+ 2027",
    "model": "Bianca TLS+",
    "year": 2027,
    "oneLiner": "女款中等硬度全山地雪鞋，采用 TLS+、Cloud 10 鞋胆与 Vibram 冰雪外底。",
    "priceMin": 4118,
    "priceMax": 4118,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9b3234bc3878609fcda39b7c7cae35b3053f5d160a392a7c675160994af7fc18.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.5,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 7.2,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS+ 双区快速系带",
      "flex": "中等硬度（Nitro 官方描述）",
      "fit": "女款 Cloud 10 鞋胆，3D 后跟结构与定向防滑内衬；可选 Internal Ankle Support",
      "liner": "Women's Cloud 10，预成型 Thermacell 热塑鞋胆",
      "innerCuff": "ILS 内靴固定系统、Power Strap、可选 Internal Ankle Support",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方定位适合刻滑雪道、粉雪与天然地形",
      "outsole": "Vibram Icetrek 橡胶与 Arctic Grip All Terrain 湿冰抓地技术",
      "warmthFeatures": "Therminator Shield 反射隔热层",
      "footbed": "Ortholite High Cup Triple Density 鞋垫；EVA 中底、Air Dampening 与 D3O 缓震",
      "sizeGuide": "官方女款 US 6–11.5 / Mondopoint 23.0–28.5 / EU 36–43⅓ / UK 4–9.5",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/bianca-tls-womens-boots-1；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方商品页标题标注 The 2027 Nitro Bianca TLS+ Womens Boots；商品变体 SKU 与价格快照相符。",
      "officialPrice": "EUR 549.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT21018-102-230",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/bianca-tls-womens-boots-1",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 549.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 4,118.20。仅为 Nitro 欧洲官方商店折算参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 230 Mondo 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS+ 双区快速系带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等硬度（Nitro 官方描述）"
      }
    ]
  },
  {
    "id": "01a13d55-1ac1-7216-a224-b2f8f1a63d2d",
    "slug": "nitro-fate-step-on-tls-womens-2027",
    "title": "Nitro Fate Step On TLS 女款 2027",
    "model": "Fate Step On TLS Women's",
    "year": 2027,
    "oneLiner": "女款高响应全山地 Step On 雪鞋，TLS 双区系带、可调鞋舌硬度与 BOA 后跟锁定。",
    "priceMin": 4345,
    "priceMax": 4345,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/352d27d243a73e2db56f7bb36f4e139179f61babf7b94b107a17d15d5970b027.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 78.9,
    "editorialScores": {
      "fit": 7.9,
      "value": 5,
      "warmth": 8.2,
      "support": 8.2,
      "convenience": 8.9
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 双区快速系带；Micro Adjustable Heel Lock Pro 由 BOA H5 微调后跟锁定",
      "flex": "官方响应评分 8/10；不等同于统一硬度等级",
      "fit": "女款进阶全山地定位；内部 Power Strap、Armored Spine 与可调 Power Tongue Stiffener",
      "liner": "官方页面列 TLS 系统与热塑鞋胆技术；型号页未明确标出鞋胆名称，故不推定具体 Cloud 型号",
      "innerCuff": "Micro Adjustable Heel Lock Pro（BOA H5）、Internal Power Strap、Armored Spine",
      "bindingCompatibility": "Step On 专用雪鞋，只能配 Step On 固定器；Nitro 官方要求女鞋配女款、男鞋配男款并匹配尺码。该款女鞋 MP 22–23 配 Nitro 女款 S，MP 23.5–25.5 配 M，MP 26–28 配 L；其他品牌 Step On 女款固定器亦须按其尺码表核对并实装确认。普通绑带固定器不兼容。",
      "terrain": "全山地；官方列举雪道、粉雪、天然地形及雪场日常滑行",
      "outsole": "Nitro Step On 专用橡胶外底，部分配色再生橡胶最高占 3%；EVA 中底与 Therminator Shield",
      "warmthFeatures": "Therminator Shield 鞋底隔热层；EVA 中底提供隔热缓震",
      "footbed": "型号页未披露鞋垫型号",
      "sizeGuide": "官方女款 US 5–11 / Mondopoint 22–28 cm / EU 35–43 / UK 3–9；该型号页面尺码选项为 MP 22、23、23.5、24、24.5、25、25.5、26、26.5、27、28 cm",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长脚为准，并按 Nitro 女款贴身 +10 mm、标准 +15 mm、宽松 +20 mm 的原厂建议选 Mondopoint；再试穿检查脚趾、脚背压力与锁跟。该加量建议只适用于 Nitro 指南，不替代试穿。Step On 另须按女款固定器及尺码配套、确认各连接点完全卡合。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/fate-step-on-tls-wmn-boots?variant=57277715710283；https://www.nitrosnowboards.com/pages/step-on；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官方给出舒适评分 9/10、响应评分 8/10 和用途描述；没有公开可跨品牌比较的鞋楦毫米宽度或脚背容积。官方评分不是本地实测。",
      "heatMolding": "选购前应由专业店核对适用鞋胆及热塑流程；热塑不能补救错误尺码或改变鞋壳结构。",
      "seasonEvidence": "Nitro 官方 2026/27 雪鞋集合和 2027 型号页列出 Fate Step On TLS 女款；归档为 2026/27（2027），不表示首次上市年份。",
      "officialPrice": "EUR 579.9",
      "priceMarket": "Nitro 欧洲官方商店；代表页面变体 SKU 13BT21019-102-220",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/collections/step-on-boots-26-27",
      "priceStatus": "Nitro 欧洲官方 2026/27 集合挂牌 EUR 579.90，按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 4,344.90。仅为欧洲地区参考，不是中国售价；税费、配送及进口成本未计。页面尺码选项不保证库存或结账可售。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 双区快速系带；Micro Adjustable Heel Lock Pro 由 BOA H5 微调后跟锁定"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "官方响应评分 8/10；不等同于统一硬度等级"
      }
    ]
  },
  {
    "id": "01a13d55-1ac9-7fd0-b903-759f269c33d5",
    "slug": "nitro-monarch-step-on-tls-womens-2027",
    "title": "Nitro Monarch Step On TLS 女款 2027",
    "model": "Monarch Step On TLS Women's",
    "year": 2027,
    "oneLiner": "女款舒适取向全山地 Step On 雪鞋，TLS 双区系带、BOA 踝带与 Cloud 3 鞋胆。",
    "priceMin": 3671,
    "priceMax": 3671,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/93d782c327870dba924b4df352d79fcf4bbf8e70b8050565468096c6c0ba84b0.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.5,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 7.4,
      "support": 7.3,
      "convenience": 8.9
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 双区快速系带；另配 BOA 踝带增加锁跟与支撑",
      "flex": "官方响应评分 5/10；不等同于统一硬度等级",
      "fit": "女款初中级进阶全山地定位，强调舒适、保暖与稳定脚跟",
      "liner": "Women's Cloud 3；Thermacell 预成型、支持热塑、Re/Lace 鞋胆锁定、DLS 系带、支撑框架及 3D 鞋舌/后跟",
      "innerCuff": "BOA 踝带、Interlock 鞋胆后跟固定系统与 Armored Spine",
      "bindingCompatibility": "Step On 专用雪鞋，只能配 Step On 固定器；Nitro 官方要求女鞋配女款、男鞋配男款并匹配尺码。按官方页面可确认的女款尺码：MP 23 配 Nitro 女款 S，MP 23.5–25.5 配 M，MP 26–28 配 L；MP22 选项因产品页尺码冲突需先确认。其他品牌 Step On 女款固定器亦须按其尺码表核对并实装确认。普通绑带固定器不兼容。",
      "terrain": "全山地；官方列举雪道、天然地形与雪场日常滑行",
      "outsole": "Nitro Step On 专用橡胶外底，部分配色再生橡胶最高占 3%；EVA 中底",
      "warmthFeatures": "EVA 中底提供缓震与隔热；原厂定位强调长时间滑行保暖",
      "footbed": "Anatomical Footbed 人体工学鞋垫",
      "sizeGuide": "型号页尺码选项为 MP 22、23、23.5、24、24.5、25、25.5、26、26.5、27、28 cm；同页 Size Info 标注女款 US 5.5–11 / MP 23–28.5 / EU 36–43⅓ / UK 4–9.5，和尺码选项首档及末档不完全一致，购买前需向门店确认。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长脚为准，并按 Nitro 女款贴身 +10 mm、标准 +15 mm、宽松 +20 mm 的原厂建议选 Mondopoint；再试穿检查脚趾、脚背压力与锁跟。该加量建议只适用于 Nitro 指南，不替代试穿。该型号产品页的尺码选择器与 Size Info 范围存在冲突，先向店铺确认实际尺码。",
      "compatibilitySources": "https://www.nitrosnowboards.com/products/monarch-step-on-tls-womens-boots；https://www.nitrosnowboards.com/pages/step-on；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官方舒适评分 8/10、响应评分 5/10；其尺码选择器与文字范围不完全一致。评分为品牌自评，不是本地实测；未公开可跨品牌比较的鞋楦毫米宽度或脚背容积。",
      "heatMolding": "Cloud 3 鞋胆支持热塑；按品牌温度流程或由专业店操作。热塑不能补救错误尺码或改变鞋壳结构。",
      "seasonEvidence": "Nitro 官方 2026/27 Step On 雪鞋集合列出 Monarch Step On TLS 女款，型号页提供尺码及技术信息；归档为 2026/27（2027），不表示首次上市年份。",
      "officialPrice": "EUR 489.9",
      "priceMarket": "Nitro 欧洲官方商店；代表型号页 SKU 848726-001-220",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/collections/step-on-boots-26-27",
      "priceStatus": "Nitro 欧洲官方 2026/27 集合挂牌 EUR 489.90，按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 3,670.58。仅为欧洲地区参考，不是中国售价；税费、配送及进口成本未计。页面尺码选项不保证库存或结账可售。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 双区快速系带；另配 BOA 踝带增加锁跟与支撑"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "官方响应评分 5/10；不等同于统一硬度等级"
      }
    ]
  },
  {
    "id": "01a13d55-1ad0-77e2-9c70-aa5a349edbd5",
    "slug": "nitro-scala-step-on-boa-womens-2027",
    "title": "Nitro Scala Step On BOA 女款 2027",
    "model": "Scala Step On BOA Women's",
    "year": 2027,
    "oneLiner": "女款易上手全山地 Step On 雪鞋，单区 BOA、ILS 内靴固定与轻量 EVA 中底。",
    "priceMin": 2771,
    "priceMax": 2771,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/e783cad1e0504d39c0125845847383f2a49919ee8a8c8f7cec9e8d401e85bdbb.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.4,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 7.4,
      "support": 6.4,
      "convenience": 8.3
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA 单旋钮系统，官方描述为从上到下均匀贴合",
      "flex": "官方响应评分 4/10；不等同于统一硬度等级",
      "fit": "女款初中级全山地进阶定位；Armored Spine 与 Internal Ankle Support",
      "liner": "ILS 内部系带系统固定鞋胆；官方型号页未标明鞋胆型号，不推定 Cloud 版本",
      "innerCuff": "Armored Spine 后跟加固；ILS 防止鞋胆滑移；Internal Ankle Support 可选",
      "bindingCompatibility": "Step On 专用雪鞋，只能配 Step On 固定器；Nitro 官方要求女鞋配女款、男鞋配男款并匹配尺码。该款女鞋 MP 22–23 配 Nitro 女款 S，MP 23.5–25.5 配 M，MP 26–28 配 L；其他品牌 Step On 女款固定器亦须按其尺码表核对并实装确认。普通绑带固定器不兼容。",
      "terrain": "全山地进阶；官方列举雪道、雪场日常滑行及公园/自由式进阶",
      "outsole": "Nitro Step On 专用橡胶外底，部分配色再生橡胶最高占 3%；EVA 中底",
      "warmthFeatures": "EVA 中底提供缓震与隔热",
      "footbed": "型号页未披露鞋垫型号",
      "sizeGuide": "官方女款 US 5–11 / Mondopoint 22–28 cm / EU 35–43 / UK 3–9；该型号页面尺码选项为 MP 22、23、23.5、24、24.5、25、25.5、26、26.5、27、28 cm",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长脚为准，并按 Nitro 女款贴身 +10 mm、标准 +15 mm、宽松 +20 mm 的原厂建议选 Mondopoint；再试穿检查脚趾、脚背压力与锁跟。该加量建议只适用于 Nitro 指南，不替代试穿。Step On 另须按女款固定器及尺码配套、确认各连接点完全卡合。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/all-26-27/products/scala-step-on-boa-wmn-boots?variant=57277722820939；https://www.nitrosnowboards.com/pages/step-on；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官方舒适评分 7/10、响应评分 4/10；初级/中级进阶定位为品牌说明，不是实测结果。未公开可跨品牌比较的鞋楦毫米宽度或脚背容积。",
      "heatMolding": "选购前应由专业店核对具体鞋胆是否支持热塑及相应流程；热塑不能补救错误尺码或改变鞋壳结构。",
      "seasonEvidence": "Nitro 官方 2026/27 雪鞋集合列出 Scala Step On BOA 女款；型号页标题为 The 2027 Nitro Scala Step On BOA Women's Boots，归档为 2026/27（2027），不表示首次上市年份。",
      "officialPrice": "EUR 369.9",
      "priceMarket": "Nitro 欧洲官方商店；代表型号页 SKU 13BT21024-101-220",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/collections/step-on-boots-26-27",
      "priceStatus": "Nitro 欧洲官方 2026/27 集合挂牌 EUR 369.90，按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 2,771.48。仅为欧洲地区参考，不是中国售价；税费、配送及进口成本未计。页面尺码选项不保证库存或结账可售。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA 单旋钮系统，官方描述为从上到下均匀贴合"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "官方响应评分 4/10；不等同于统一硬度等级"
      }
    ]
  },
  {
    "id": "01a12e89-61e4-7425-a8e7-2663352f2a16",
    "slug": "nitro-sentinel-boa-2027",
    "title": "Nitro Sentinel BOA 2027",
    "model": "Sentinel BOA",
    "year": 2027,
    "oneLiner": "双区 BOA 闭合，Cloud 3 热塑鞋胆与 Interlock 脚跟固定结构。",
    "priceMin": 2471,
    "priceMax": 2471,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/535378c7ac7ff9f68e714c49528506a78d93ac9ebbf824839903741c1b611394.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 7.4,
      "support": 7.5,
      "convenience": 8.9
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "双区 BOA Fit System（M+2 与 H4 Coiler）",
      "flex": "舒适、支撑与平衡脚感（Nitro 官方描述，未公布数值硬度）",
      "fit": "Interlock 系统将鞋胆脚跟与鞋壳连接；3D 后跟结构与记忆泡棉",
      "liner": "Cloud 3 热塑鞋胆，带 Re/Lace、DLS 直连系带与支撑框架",
      "innerCuff": "Interlock 脚跟锁定与加固后跟",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举雪道、雪场日常滑行与进阶练习",
      "outsole": "EVA 外底，局部橡胶耐磨/抓地补强",
      "warmthFeatures": "Nitro 官方称 EVA 外底提供热隔离；未列反射式隔热膜",
      "footbed": "Anatomical 人体工学鞋垫",
      "sizeGuide": "官方男款 US 7–14 / Mondopoint 25.0–32.0 / EU 38⅔–48 / UK 6–13",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/sentinel-boa-boots-1；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方商品页标题标注 The 2027 Nitro Sentinel BOA Boots；商品变体 SKU 与价格快照相符。",
      "officialPrice": "EUR 329.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11014-103-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/sentinel-boa-boots-1",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 329.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 2,470.62。仅为 Nitro 欧洲官方商店折算参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "双区 BOA Fit System（M+2 与 H4 Coiler）"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "舒适、支撑与平衡脚感（Nitro 官方描述，未公布数值硬度）"
      }
    ]
  },
  {
    "id": "01a13d55-1ad7-71de-98e4-2fad941013cd",
    "slug": "nitro-sentinel-step-on-boa-2027",
    "title": "Nitro Sentinel Step On BOA 2027",
    "model": "Sentinel Step On BOA",
    "year": 2027,
    "oneLiner": "中等硬度全山地 Step On 雪鞋，单区 BOA、Cloud 3 鞋胆与内部踝部支撑。",
    "priceMin": 2771,
    "priceMax": 2771,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a88cbc40971b57ae280361daa0ce97a54421e44454336014f348c2e0738a250a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.5,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 7.4,
      "support": 7.2,
      "convenience": 7.7
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "BOA Fit System 单区旋钮，官方描述为自上而下均匀贴合",
      "flex": "中等硬度定位；官方响应评分 5/10，不等同于统一硬度等级",
      "fit": "男款全山地舒适/中等响应定位；Armored Spine、ILS 内部系带和 Internal Ankle Support",
      "liner": "Cloud 3；预成型 Thermacell、可热塑、Re/Lace、DLS、支撑框架、3D 鞋舌和后跟、Flex Toe",
      "innerCuff": "ILS 内靴固定系统、Armored Spine；Internal Ankle Support 用于分散鞋带压力并提供额外支撑",
      "bindingCompatibility": "Step On 专用雪鞋，只能配 Step On 固定器；Nitro 官方要求男鞋配男款、女鞋配女款并按尺码匹配。该男鞋 US 6–8 配 Nitro 男款 S、8.5–10.5 配 M、11–13 配 L、14–15 配 XL；其他品牌 Step On 固定器须按其尺码表核对并实装。普通绑带固定器不兼容。",
      "terrain": "全山地；雪道、公园、自由式进阶及雪场日常滑行",
      "outsole": "Nitro Step On 专用橡胶外底，部分配色再生橡胶最高占 3%；EVA 中底",
      "warmthFeatures": "EVA 中底提供缓震与隔热",
      "footbed": "Ortholite High Cup Dual Density 鞋垫",
      "sizeGuide": "官方男款 US 7–15 / Mondopoint 25–33 cm / EU 40–48 / UK 6–14；型号页列出 MP 25、25.5、26、26.5、27、27.5、28、28.5、29、29.5、30、31、32、33 cm",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长脚为准，按 Nitro 男款贴身 +5 mm、标准 +10 mm、宽松 +15 mm 的原厂建议选 Mondopoint；再试穿检查脚趾、脚背压力与锁跟。加量规则只适用 Nitro 指南，不替代试穿。Step On 还须按男款固定器尺码配套并确认连接点完全卡合。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/sentinel-step-on-boa-boots?variant=57277708304715；https://www.nitrosnowboards.com/pages/step-on；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官方舒适评分 5/10、响应评分 5/10，属于品牌自评；没有公开可跨品牌比较的鞋楦毫米宽度或脚背容积。",
      "heatMolding": "Cloud 3 鞋胆支持热塑；按品牌规定流程或由专业店操作。热塑不能补救错误尺码或改变鞋壳结构。",
      "seasonEvidence": "Nitro 官方 2026/27 Step On 雪鞋集合列出 Sentinel Step On BOA；型号页标题标注 The 2027 Nitro Sentinel Step On BOA Boots，归档为 2026/27（2027），不表示首次上市年份。",
      "officialPrice": "EUR 369.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11013-101-250",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/collections/step-on-boots-26-27",
      "priceStatus": "Nitro 欧洲官方 2026/27 集合挂牌 EUR 369.90，按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 2,771.48。仅为欧洲地区参考，不是中国售价；税费、配送及进口成本未计。页面尺码选项不保证库存或结账可售。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "BOA Fit System 单区旋钮，官方描述为自上而下均匀贴合"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等硬度定位；官方响应评分 5/10，不等同于统一硬度等级"
      }
    ]
  },
  {
    "id": "01a12e89-61f1-72b7-a20b-3262daa2b50d",
    "slug": "nitro-sentinel-tls-2027",
    "title": "Nitro Sentinel TLS 2027",
    "model": "Sentinel TLS",
    "year": 2027,
    "oneLiner": "TLS 双区快速系带，Cloud 3 热塑鞋胆与 Interlock 脚跟固定结构。",
    "priceMin": 2096,
    "priceMax": 2096,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/7fdb01831fc71bf00e1baba083b34ea6b5cd9244f619985158062fe0c578b234.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.7,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 7.4,
      "support": 7.5,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱",
      "flex": "舒适、支撑与平衡脚感（Nitro 官方描述，未公布数值硬度）",
      "fit": "Interlock 系统将鞋胆脚跟与鞋壳连接；3D 后跟结构与记忆泡棉",
      "liner": "Cloud 3 热塑鞋胆，带 Re/Lace、DLS 直连系带与支撑框架",
      "innerCuff": "Interlock 脚跟锁定与加固后跟",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举雪道、雪场日常滑行与进阶练习",
      "outsole": "EVA 外底，局部橡胶耐磨/抓地补强",
      "warmthFeatures": "Nitro 官方称 EVA 外底提供热隔离；未列反射式隔热膜",
      "footbed": "Anatomical 人体工学鞋垫",
      "sizeGuide": "官方男款 US 7–14 / Mondopoint 25.0–32.0 / EU 38⅔–48 / UK 6–13",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/sentinel-tls-boots-1；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方商品页标题标注 The 2027 Nitro Sentinel TLS Boots；商品变体 SKU 与价格快照相符。",
      "officialPrice": "EUR 279.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11015-102-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/sentinel-tls-boots-1",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 279.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 2,096.17。仅为 Nitro 欧洲官方商店折算参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "舒适、支撑与平衡脚感（Nitro 官方描述，未公布数值硬度）"
      }
    ]
  },
  {
    "id": "01a12e89-61fd-76f2-83cd-8f619c34f058",
    "slug": "nitro-tangent-tls-2027",
    "title": "Nitro Tangent TLS 2027",
    "model": "Tangent TLS",
    "year": 2027,
    "oneLiner": "偏柔和、适合进阶过程的全山地雪鞋，TLS 双区系带，配 Cloud 1 鞋胆。",
    "priceMin": 1797,
    "priceMax": 1797,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/3b5f59998d1ba4b157ab4aa9922ebfa8856d30cd23df9db22a2ab9431779791b.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 70.4,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 7.4,
      "support": 6.2,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱",
      "flex": "偏柔和、易于进阶（Nitro 官方描述）",
      "fit": "Interlock 系统将鞋胆脚跟与鞋壳连接",
      "liner": "Cloud 1 热塑鞋胆，带 Re/Lace Liner Locker 与 DLS 直连系带",
      "innerCuff": "Interlock 脚跟锁定与加固后跟",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地进阶；官方定位为日常雪场滑行",
      "outsole": "全橡胶外底，强调耐磨与抓地",
      "warmthFeatures": "EVA 鞋垫提供隔热（Nitro 官方鞋胆规格）",
      "footbed": "EVA 鞋垫，提供缓震与隔热",
      "sizeGuide": "官方男款 US 7–14 / Mondopoint 25.0–32.0 / EU 38⅔–48 / UK 6–13",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/tangent-tls-boots-1；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方商品页标题标注 The 2027 Nitro Tangent TLS Boots；商品变体 SKU 与价格快照相符。",
      "officialPrice": "EUR 239.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11017-101-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/tangent-tls-boots-1",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 239.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 1,796.61。仅为 Nitro 欧洲官方商店折算参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "偏柔和、易于进阶（Nitro 官方描述）"
      }
    ]
  },
  {
    "id": "01a12e89-6209-7a51-87f4-d298cdde1007",
    "slug": "nitro-team-boa-2027",
    "title": "Nitro Team BOA 2027",
    "model": "Team BOA",
    "year": 2027,
    "oneLiner": "Nitro 全山地 Team 平台，双高功率 BOA，配 Vibram 外底与 Air Dampening。",
    "priceMin": 3968,
    "priceMax": 3968,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/a314468a0848e64b2a1439e99e867c35b146e6f89a0c0bda37e56b61e73c0020.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.8,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 7.5,
      "convenience": 7.7
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual High Power BOA H5 双旋钮分区调节",
      "flex": "平衡、多用途脚感（官方未标数值硬度）",
      "fit": "标准宽度；ILS 内靴固定系统与 Armored Spine 脚跟加固",
      "liner": "Cloud 9 热塑鞋胆，Re/Lace 锁定结构与 3D 后跟构造",
      "innerCuff": "ILS 内靴固定系统；Armored Spine 与加固后跟",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举刻滑、雪场、公园、粉雪与天然地形",
      "outsole": "Vibram ECOSTEP 橡胶外底，含最高 3% 再生橡胶",
      "warmthFeatures": "Therminator Shield 鞋底反射隔热层",
      "footbed": "Ortholite High Cup Dual Density 鞋垫；EVA 中底与 Air Dampening 缓震",
      "sizeGuide": "官方男款 US 7–15 / Mondopoint 25.0–33.0 / EU 38⅔–49⅓ / UK 6–14",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/team-boa-boots-1；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方商品页标题标注 The 2027 Nitro Team BOA Boots；商品变体 SKU 与价格快照相符。",
      "officialPrice": "EUR 529.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11006-103-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/team-boa-boots-1",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 529.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 3,968.42。仅为 Nitro 欧洲官方商店折算参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual High Power BOA H5 双旋钮分区调节"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "平衡、多用途脚感（官方未标数值硬度）"
      }
    ]
  },
  {
    "id": "01a12e89-6215-74ef-a749-6e6a2349c4f7",
    "slug": "nitro-team-pro-mk-tls-2027",
    "title": "Nitro Team Pro MK TLS 2027",
    "model": "Team Pro MK TLS",
    "year": 2027,
    "oneLiner": "Marcus Kleveland 签名款自由式雪鞋，TLS 系带并可调节硬度与支撑。",
    "priceMin": 3968,
    "priceMax": 3968,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2eca41687a7e717b4b9f71003e562a3be5a5a4dcbe05c8ff58d92c3b2487881d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 78,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 8.6,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱",
      "flex": "可通过 Power Tongue Stiffener 调节支撑与弯曲感；官方未给数值等级",
      "fit": "Armored Shell 支撑结构、ILS 内靴固定与可选 Internal Ankle Support",
      "liner": "Cloud 9 热塑鞋胆，3D 后跟结构与 Response ExoFrame",
      "innerCuff": "Shell Power Strap、ILS 内靴固定与加固后跟",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "自由式/全山地；官方签名款定位覆盖雪场和公园滑行",
      "outsole": "Vibram ECOSTEP 橡胶外底，含最高 3% 再生橡胶",
      "warmthFeatures": "Therminator Shield 反射隔热层；Speed Gaiter 防雪防潮",
      "footbed": "Ortholite High Cup Dual Density 鞋垫；EVA 中底与 Air Dampening 缓震",
      "sizeGuide": "官方男款 US 7–15 / Mondopoint 25.0–33.0 / EU 38⅔–49⅓ / UK 6–14",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/team-pro-mk-tls-boots-1；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方商品页标题标注 The 2027 Nitro Team Pro MK TLS Boots；商品变体 SKU 与价格快照相符。",
      "officialPrice": "EUR 529.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11004-101-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/team-pro-mk-tls-boots-1",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 529.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 3,968.42。仅为 Nitro 欧洲官方商店折算参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "可通过 Power Tongue Stiffener 调节支撑与弯曲感；官方未给数值等级"
      }
    ]
  },
  {
    "id": "01a13d55-1ade-7a47-a649-d90582c8c877",
    "slug": "nitro-team-step-on-tls-2027",
    "title": "Nitro Team Step On TLS 2027",
    "model": "Team Step On TLS",
    "year": 2027,
    "oneLiner": "高响应全山地 Step On 雪鞋，TLS 双区系带、可调硬度鞋舌与 BOA 微调后跟锁定。",
    "priceMin": 4345,
    "priceMax": 4345,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/7b7635b7a17a49d48ff50dc80097ba9913ff5b85a8740155c9b6f3aca7366cd7.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 78.9,
    "editorialScores": {
      "fit": 7.9,
      "value": 5,
      "warmth": 8.2,
      "support": 8.2,
      "convenience": 8.9
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS 双区系带；BOA H5 Micro Adjustable Heel Lock Pro 微调后跟锁定",
      "flex": "官方响应评分 8/10；Power Tongue Stiffener 可调支撑，不等同于统一硬度等级",
      "fit": "男款高阶全山地定位；Power Strap、可调鞋舌、Armored Spine 与 Heel Lock Pro",
      "liner": "Cloud 9；预成型 Thermacell、支持热塑、Re/Lace、DLS、Response ExoFrame、3D 鞋舌/后跟及 Flex Toe",
      "innerCuff": "Micro Adjustable Heel Lock Pro（BOA H5）、Internal Power Strap、Armored Spine",
      "bindingCompatibility": "Step On 专用雪鞋，只能配 Step On 固定器；Nitro 官方要求男鞋配男款、女鞋配女款并按尺码匹配。该男鞋 US 6–8 配 Nitro 男款 S、US 8.5–10.5 配 M、US 11–13 配 L、US 14–15 配 XL；其他品牌 Step On 固定器须按其尺码表核对并实装。普通绑带固定器不兼容。",
      "terrain": "全山地；官方列举雪道、粉雪、公园及天然地形",
      "outsole": "Nitro Step On 专用橡胶外底，部分配色再生橡胶最高占 3%；EVA 中底",
      "warmthFeatures": "Therminator Shield 鞋底隔热层；EVA 中底提供缓震与隔热",
      "footbed": "Ortholite High Cup Dual Density 鞋垫",
      "sizeGuide": "官方男款 US 7–15 / Mondopoint 25–33 cm / EU 40–48 / UK 6–14；型号页列出 MP 25、25.5、26、26.5、27、27.5、28、28.5、29、29.5、30、31、32、33 cm",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长脚为准，按 Nitro 男款贴身 +5 mm、标准 +10 mm、宽松 +15 mm 的原厂建议选 Mondopoint；再试穿检查脚趾、脚背压力与锁跟。加量规则只适用 Nitro 指南，不替代试穿。Step On 还须按男款固定器尺码配套并确认连接点完全卡合。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/all-26-27/products/team-step-on-tls-boots?variant=57277700211019；https://www.nitrosnowboards.com/pages/step-on；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官方舒适评分 9/10、响应评分 8/10，为品牌自评；没有公开可跨品牌比较的鞋楦毫米宽度或脚背容积。",
      "heatMolding": "Cloud 9 鞋胆支持热塑；按品牌规定流程或由专业店操作。热塑不能补救错误尺码或改变鞋壳结构。",
      "seasonEvidence": "Nitro 官方 2026/27 Step On 雪鞋集合列出 Team Step On TLS；型号页标题标注 The 2027 Nitro Team Step On TLS Boots，归档为 2026/27（2027），不表示首次上市年份。",
      "officialPrice": "EUR 579.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11002-102-285",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/collections/step-on-boots-26-27",
      "priceStatus": "Nitro 欧洲官方 2026/27 集合挂牌 EUR 579.90，按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 4,344.90。仅为欧洲地区参考，不是中国售价；税费、配送及进口成本未计。页面尺码选项不保证库存或结账可售。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS 双区系带；BOA H5 Micro Adjustable Heel Lock Pro 微调后跟锁定"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "官方响应评分 8/10；Power Tongue Stiffener 可调支撑，不等同于统一硬度等级"
      }
    ]
  },
  {
    "id": "01a12e89-6222-7252-a5f7-3a3d2684278d",
    "slug": "nitro-team-tls-2027",
    "title": "Nitro Team TLS 2027",
    "model": "Team TLS",
    "year": 2027,
    "oneLiner": "Nitro 全山地 Team 平台，TLS 双区快速系带，配 Vibram 外底与 Air Dampening。",
    "priceMin": 3594,
    "priceMax": 3594,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/aa513db518205f245f921566900aa228ae0096fa006900c46ed9ee14b8711ee5.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.3,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 7.5,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱",
      "flex": "平衡、多用途脚感（官方未标数值硬度）",
      "fit": "标准宽度；ILS 内靴固定系统与 Armored Spine 脚跟加固",
      "liner": "Cloud 9 热塑鞋胆，Re/Lace 锁定结构与 3D 后跟构造",
      "innerCuff": "ILS 内靴固定系统；Armored Spine 与加固后跟",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举刻滑、雪场、公园、粉雪与天然地形",
      "outsole": "Vibram ECOSTEP 橡胶外底，含最高 3% 再生橡胶",
      "warmthFeatures": "Therminator Shield 鞋底反射隔热层",
      "footbed": "Ortholite High Cup Dual Density 鞋垫；EVA 中底与 Air Dampening 缓震",
      "sizeGuide": "官方男款 US 7–15 / Mondopoint 25.0–33.0 / EU 38⅔–49⅓ / UK 6–14",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/team-tls-boots-1；https://www.nitrosnowboards.com/collections/boots-26-27/products/team-tls-wide-boots-1；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "Nitro 2027 Team TLS 官方页称本型号另有较宽版，供需要额外空间的宽脚滑手选择，并称标准版与宽版保留 Team 的多用途脚感与全山地性能。原厂未公布鞋楦毫米差、壳体宽度差或脚背容积；宽版对应独立型号 Nitro Team TLS Wide（13BT11007），不可据此推算数值或跨品牌适配。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方商品页标题标注 The 2027 Nitro Team TLS Boots；商品变体 SKU 与价格快照相符。",
      "officialPrice": "EUR 479.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11008-102-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/team-tls-boots-1",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 479.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 3,593.97。仅为 Nitro 欧洲官方商店折算参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "平衡、多用途脚感（官方未标数值硬度）"
      }
    ]
  },
  {
    "id": "01a12e89-622e-75b8-8a53-606d733e5ae4",
    "slug": "nitro-team-tls-wide-2027",
    "title": "Nitro Team TLS Wide 2027",
    "model": "Team TLS Wide",
    "year": 2027,
    "oneLiner": "Team TLS 宽版；Nitro 官方称宽版贴合比标准版宽 4 mm，但未说明具体测量口径。",
    "priceMin": 3594,
    "priceMax": 3594,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/2dee2c986411c636f5c40a8ddcc6a981f9676b062d97992b0bac2c78d2ec6862.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 77.1,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 8.2,
      "support": 7.5,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱",
      "flex": "平衡、多用途脚感（官方未标数值硬度）",
      "fit": "Nitro 德国官方 26/27 页面称 Wide 版贴合比标准版宽 4 mm；未说明测量部位、尺码差异或数值是否对应鞋楦/鞋壳/鞋胆。",
      "liner": "Cloud 9 热塑鞋胆，Re/Lace 锁定结构与 3D 后跟构造",
      "innerCuff": "ILS 内靴固定系统；Armored Spine 与加固后跟",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举刻滑、雪场、公园、粉雪与天然地形",
      "outsole": "Vibram ECOSTEP 橡胶外底，含最高 3% 再生橡胶",
      "warmthFeatures": "Therminator Shield 鞋底反射隔热层",
      "footbed": "Ortholite High Cup Dual Density 鞋垫；EVA 中底与 Air Dampening 缓震",
      "sizeGuide": "官方男款 US 7–15 / Mondopoint 25.0–33.0 / EU 38⅔–49⅓ / UK 6–14",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/team-tls-wide-boots-1；https://www.nitrosnowboards.com/collections/boots-26-27/products/team-tls-boots-1；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "Nitro 德国官方 26/27 Team TLS Wide 页面明确称 Wide 版提供比标准版宽 4 mm 的贴合；未定义所指测量部位或方法，也未说明是否按尺码变化。品牌还称该款适合需要额外空间的宽脚滑手。4 mm 仅作为原厂相对贴合描述，不解释为鞋楦、鞋壳或鞋胆的实测宽度；逐尺码楦宽和脚背容积仍未公布，不作跨品牌标准。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方商品页标题标注 The 2027 Nitro Team TLS Wide Boots；商品变体 SKU 与价格快照相符。",
      "officialPrice": "EUR 479.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 13BT11007-101-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/team-tls-wide-boots-1",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 479.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 3,593.97。仅为 Nitro 欧洲官方商店折算参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "平衡、多用途脚感（官方未标数值硬度）"
      }
    ]
  },
  {
    "id": "01a12e89-623a-743b-9253-58be2a8fc6fc",
    "slug": "nitro-venture-boa-2027",
    "title": "Nitro Venture BOA 2027",
    "model": "Venture BOA",
    "year": 2027,
    "oneLiner": "全山地雪鞋，双 BOA 调节、Cloud 6 热塑鞋胆与 EVA 外底。",
    "priceMin": 2995,
    "priceMax": 2995,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/fc2183aba68551b2fe4f1163e7af39b4eb3daa4f77e01363fd9a7163335c127d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 73.6,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 7.5,
      "convenience": 8.9
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual BOA Fit System：M+2 平台与 H4 Coiler 双区调节",
      "flex": "平衡支撑与响应脚感（Nitro 官方描述，未公布数值硬度）",
      "fit": "全山地多用途定位；ILS 内靴固定系统帮助减少脚跟滑动",
      "liner": "Cloud 6 热塑鞋胆，支持热塑定型、Re/Lace 锁定、3D 鞋舌与后跟结构、Response ExoFrame、记忆垫和 Flex Toe",
      "innerCuff": "ILS 内靴固定系统；3D 后跟结构与 Response ExoFrame 提供脚跟锁定和支撑",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举雪道、粉雪、天然地形、侧坡跳台与公园",
      "outsole": "EVA 外底，配局部橡胶耐磨/抓地补强；部分配色再生橡胶最高占 3%",
      "warmthFeatures": "EVA 外底提供热隔离（Nitro 官方说明）",
      "footbed": "Ortholite High Cup 鞋垫；高回弹缓震",
      "sizeGuide": "官方男款 US 7–14 / Mondopoint 25.0–32.0 / EU 38⅔–48 / UK 6–13",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/venture-boa-boots；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方 2026/27 雪鞋目录（boots-26-27）列有 Venture BOA，目录挂牌 EUR 399.90；档案据该官方目录归入 2026/27（2027）。页面标题未单独印年份，季节结论依官方目录上下文。",
      "officialPrice": "EUR 399.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 848717-001-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/venture-boa-boots",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 399.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 2,994.85；2026-10-15 官方 2026/27 雪鞋目录仍列 EUR 399.90。仅为 Nitro 欧洲官方店参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual BOA Fit System：M+2 平台与 H4 Coiler 双区调节"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "平衡支撑与响应脚感（Nitro 官方描述，未公布数值硬度）"
      }
    ]
  },
  {
    "id": "01a12e89-6245-73b2-a861-1a89694f920e",
    "slug": "nitro-venture-pro-tls-2027",
    "title": "Nitro Venture Pro TLS 2027",
    "model": "Venture Pro TLS",
    "year": 2027,
    "oneLiner": "中等硬度全山地雪鞋，TLS 双区系带、Vibram ECOSTEP 外底与 Cloud 6 鞋胆。",
    "priceMin": 2996,
    "priceMax": 2996,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/8a19e53e461eb7e6c23126fe4761c191e41842d8d91d3e3e83a044bef68c854a.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.7,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 7.4,
      "support": 7.2,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱",
      "flex": "中等硬度（Nitro 官方描述，未公布数值等级）",
      "fit": "标准版型；官方另有 Wide 宽版型号",
      "liner": "Cloud 6 热塑鞋胆，支持热塑定型、Re/Lace 锁定、3D 鞋舌与后跟结构、Response ExoFrame、记忆垫和 Flex Toe",
      "innerCuff": "ILS 内靴固定系统与 3D 后跟结构",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举刻滑雪道、粉雪、天然地形与日常雪场滑行",
      "outsole": "Vibram ECOSTEP 橡胶外底，含最高 3% 再生橡胶",
      "warmthFeatures": "EVA 中底提供隔热与缓震；Speed Gaiter 防雪防潮并帮助保持干暖",
      "footbed": "Ortholite High Cup Dual Density 双密度鞋垫",
      "sizeGuide": "官方男款 US 7–14 / Mondopoint 25.0–32.0 / EU 38⅔–48 / UK 6–13",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/venture-pro-tls-boots；https://www.nitrosnowboards.com/products/venture-pro-tls-wide-boots；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "Nitro 官方 2026/27 Venture Pro TLS Wide 页面称宽版在前掌提供额外空间，同时保留支撑、全山地响应与耐用性；这是厂商的定性版型说明。原厂未公布常规版与 Wide 的逐尺码楦宽或壳宽差，也未给脚背容积数据，不推算毫米值或跨品牌适配。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方 2026/27 雪鞋目录（boots-26-27）列有 Venture Pro TLS，目录挂牌 EUR 399.90；档案据该官方目录归入 2026/27（2027）。页面标题未单独印年份，季节结论依官方目录上下文。",
      "officialPrice": "EUR 399.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 848713-004-250",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/products/venture-pro-tls-boots",
      "priceStatus": "Nitro 官方 2026/27 雪鞋集合页于 2026-10-15 复核仍列 EUR 399.90，按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 2,996.25。仅为 Nitro 欧洲官方店地区参考，不是中国售价；税费、配送与进口费用未计。历史 2026-10-12 欧元价快照保存在 data/raw/snowboard-boot/nitro-eur-price-conversions-2026-10-14.json；集合页价与变体选项不代表实时库存。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等硬度（Nitro 官方描述，未公布数值等级）"
      }
    ]
  },
  {
    "id": "01a13d55-1ae5-7e79-bb1b-6ea6f50602d5",
    "slug": "nitro-venture-pro-tls-wide-2027",
    "title": "Nitro Venture Pro TLS Wide 2027",
    "model": "Venture Pro TLS Wide",
    "year": 2027,
    "oneLiner": "中等硬度全山地宽版雪鞋；Nitro 官方称 Wide 为前掌提供额外空间。",
    "priceMin": 2996,
    "priceMax": 2996,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/9a5233ed72b11708804f15c8a81b82e80d2daef69ad64b305b2424af2874e251.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.7,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 7.4,
      "support": 7.2,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱",
      "flex": "中等硬度（Nitro 官方描述，未公布数值等级）",
      "fit": "Wide 宽版；Nitro 官方称相对标准版的版型宽 4 mm，并说明额外空间在前掌。原厂未说明这 4 mm 对应鞋壳、鞋胆或哪一种单独测量值；不能作为绝对楦宽或逐尺码宽度差。",
      "liner": "Cloud 6 热塑鞋胆，Re/Lace 锁定、3D 鞋舌与后跟结构、Response ExoFrame、记忆垫和 Flex Toe",
      "innerCuff": "ILS 内靴固定系统与 3D 后跟结构",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举刻滑雪道、粉雪、天然地形与日常雪场滑行",
      "outsole": "Vibram ECOSTEP 橡胶外底，含最高 3% 再生橡胶",
      "warmthFeatures": "EVA 中底隔热与缓震；Speed Gaiter 防雪防潮并帮助保持干暖",
      "footbed": "Ortholite High Cup Dual Density 双密度鞋垫",
      "sizeGuide": "Nitro 官方商品页男款 US 7–14 / Mondopoint 25.0–32.0 / EU 38⅔–48 / UK 6–13；这是商品尺码范围，不代表每码实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查 Nitro 尺码表，再核对前掌压力、脚背舒适度和屈膝时的锁跟。Nitro 官方 Wide 说明指前掌额外空间，不等于提供更高脚背或更宽脚跟的保证；先选雪鞋再选固定器，不把其他品牌鞋码直接换算。",
      "compatibilitySources": "https://www.nitrosnowboards.com/products/venture-pro-tls-wide-boots；https://www.nitrosnowboards.com/collections/boots-26-27；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "Nitro 官方 26/27 德文款号页称 Wide 版型比标准版宽 4 mm，并说明额外空间在前掌，同时保留 Venture Pro 的支撑感、全山地响应和耐用性。官网未说明 4 mm 是鞋壳、鞋胆或哪种测量的变化；没有公布绝对楦宽、逐尺码宽度差、壳体/鞋胆各自增宽量或脚背容积；不把相对值转成个体适配保证。",
      "heatMolding": "官方 Cloud 6 鞋胆可热塑，Nitro Thermacell 可随穿着贴合；热塑不能补救错误尺码或保证脚型适配。具体流程按品牌说明并由专业店确认。",
      "seasonEvidence": "Nitro 官方商品分类路径 boots-26-27 列出 Venture Pro TLS Wide，与官方商品页型号一致，确认对应 2026/27 雪季；代表商品变体 SKU 为 848712-001-250。",
      "officialPrice": "EUR 399.90",
      "priceMarket": "Nitro 欧洲官方商店；2026/27 雪鞋商品集合页挂牌价",
      "priceCheckedAt": "2026-10-15",
      "priceSource": "https://www.nitrosnowboards.com/collections/boots-26-27",
      "priceStatus": "Nitro 欧洲官方 2026/27 商品集合页挂牌 EUR 399.90，按 ECB 2026-10-14 EUR/CNY 7.4925 折算 CNY 2,996.25。仅为欧洲官方地区参考，不是中国售价；税费、配送和进口费用未计。商品页尺码选项不是实时库存证明。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等硬度（Nitro 官方描述，未公布数值等级）"
      }
    ]
  },
  {
    "id": "01a12e89-6251-7894-8a0f-6f3e5371d723",
    "slug": "nitro-venture-step-on-tls-2027",
    "title": "Nitro Venture Step On TLS 2027",
    "model": "Venture Step On TLS",
    "year": 2027,
    "oneLiner": "Step On 专用全山地雪鞋，TLS 双区系带、可调踝带与 Cloud 6 鞋胆。",
    "priceMin": 3669,
    "priceMax": 3669,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/e7cb2e9a0d4cdf920b76eaac53bc956fc73478ccc5cb9019fcf7ba5579285b9d.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 75.5,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 7.4,
      "support": 7.7,
      "convenience": 8.9
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱；另有 BOA 可调踝带",
      "flex": "支撑感可调；官方未给数值硬度等级",
      "fit": "全山地多用途定位；ILS 内靴固定系统与 Armored Spine 后跟加固",
      "liner": "Cloud 6 热塑鞋胆，支持热塑定型、Re/Lace 锁定、3D 鞋舌与后跟结构、Response ExoFrame、记忆垫和 Flex Toe",
      "innerCuff": "ILS 内靴固定系统、Armored Spine 3D 后跟加固及 BOA 可调踝带",
      "bindingCompatibility": "认证 Step On 专用雪鞋；Nitro 官方要求男鞋配男款、女鞋配女款并按尺码匹配。该男鞋 US 7–8 配 Nitro 男款 S，US 8.5–10.5 配 M，US 11–13 配 L，US 14 配 XL；其他品牌 Step On 固定器仍按其尺码表核对并实装。不能作为普通绑带固定器雪鞋使用。",
      "terrain": "全山地；官方列举雪道、粉雪、天然地形与公园",
      "outsole": "Nitro Step On 专用高抓地耐磨橡胶外底，配 EVA 中底；部分配色再生橡胶最高占 3%",
      "warmthFeatures": "EVA 中底提供缓震与隔热（Nitro 官方说明）",
      "footbed": "Ortholite High Cup 鞋垫",
      "sizeGuide": "官方男款 US 7–14 / Mondopoint 25.0–32.0 / EU 38⅔–48 / UK 6–13",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。 Step On 还需核对固定器男/女/儿童系列，普通绑带固定器不能仅因鞋码相同而替代。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/venture-step-on-tls-boots；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方 2026/27 雪鞋目录（boots-26-27）列有 Venture Step On TLS，目录挂牌 EUR 489.90；档案据该官方目录归入 2026/27（2027）。Nitro 2025/26 经销商手册也列出该型号，说明该款可能延续销售；年份代表当前核验的 2026/27 目录，不代表首次上市年份。",
      "officialPrice": "EUR 489.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 848716-001-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/venture-step-on-tls-boots",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 489.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 3,668.86；2026-10-15 官方 2026/27 雪鞋目录仍列 EUR 489.90。仅为 Nitro 欧洲官方店参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱；另有 BOA 可调踝带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "支撑感可调；官方未给数值硬度等级"
      }
    ]
  },
  {
    "id": "01a12e89-625e-7205-9048-533a0c7494e8",
    "slug": "nitro-venture-tls-2027",
    "title": "Nitro Venture TLS 2027",
    "model": "Venture TLS",
    "year": 2027,
    "oneLiner": "全山地雪鞋，TLS 双区快速系带、Cloud 6 热塑鞋胆与 EVA 外底。",
    "priceMin": 2620,
    "priceMax": 2620,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/1406beb8859528aa287632681d041f640f67088d3e3016c16532da9ac272583f.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.3,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 7.5,
      "convenience": 8
    },
    "brand": {
      "slug": "nitro",
      "name": "Nitro",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱",
      "flex": "平衡支撑与响应脚感（Nitro 官方描述，未公布数值硬度）",
      "fit": "全山地多用途定位；ILS 内靴固定系统帮助减少脚跟滑动",
      "liner": "Cloud 6 热塑鞋胆，支持热塑定型、Re/Lace 锁定、3D 鞋舌与后跟结构、Response ExoFrame、记忆垫和 Flex Toe",
      "innerCuff": "ILS 内靴固定系统与 3D 后跟结构",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方列举雪道、粉雪、天然地形、侧坡跳台与公园",
      "outsole": "EVA 外底，配局部橡胶耐磨/抓地补强；部分配色再生橡胶最高占 3%",
      "warmthFeatures": "EVA 外底提供热隔离（Nitro 官方说明）",
      "footbed": "Ortholite High Cup 鞋垫；高回弹缓震",
      "sizeGuide": "官方男款 US 7–14 / Mondopoint 25.0–32.0 / EU 38⅔–48 / UK 6–13",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 Nitro 官网将男款脚长加量分为贴身 +5 mm、标准 +10 mm、宽松 +15 mm；女款分别 +10/+15/+20 mm。这是 Nitro 自身的拟合参考，不可套用于其他品牌。",
      "compatibilitySources": "https://www.nitrosnowboards.com/collections/boots-26-27/products/venture-tls-boots；https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Nitro 官方 2026/27 雪鞋目录（boots-26-27）列有 Venture TLS，目录挂牌 EUR 349.90；档案据该官方目录归入 2026/27（2027）。页面标题未单独印年份，季节结论依官方目录上下文。",
      "officialPrice": "EUR 349.9",
      "priceMarket": "Nitro 欧洲官方商店；代表变体 SKU 848718-001-250",
      "priceCheckedAt": "2026-10-12",
      "priceSource": "https://www.nitrosnowboards.com/products/venture-tls-boots",
      "priceStatus": "官方商品变体价格快照于 2026-10-12 记录为 EUR 349.90，按 ECB 2026-10-13 EUR/CNY 7.4890 折算为 CNY 2,620.40；2026-10-15 官方 2026/27 雪鞋目录仍列 EUR 349.90。仅为 Nitro 欧洲官方店参考，不是中国售价；税费、配送及进口费用未计。快照中代表变体 US 7 显示缺货，库存会变化。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "TLS Twin Lacing 双区快速系带，Dyneema 鞋带与 Bail Out 快速松脱"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "平衡支撑与响应脚感（Nitro 官方描述，未公布数值硬度）"
      }
    ]
  },
  {
    "id": "01a12e89-626a-73b4-8b81-1c2300633b44",
    "slug": "salomon-dialogue-dual-boa-2027",
    "title": "Salomon Dialogue Dual BOA 2027",
    "model": "Dialogue Dual BOA",
    "year": 2027,
    "oneLiner": "中等硬度全山地/自由式雪鞋，Dual Zone BOA 与 Precision Harness 3.0 锁跟。",
    "priceMin": 2878,
    "priceMax": 2878,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/04b3ae6f17cd234537a30a6ca3b7282433cf37e07d075adb0bde7d3959826476.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.9,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 7.2,
      "convenience": 8.9
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌",
      "flex": "中等（Salomon 官方分类）",
      "fit": "标准宽度；全山地/自由式取向，适合中级至高阶",
      "liner": "Response 全热塑性能鞋胆，踝部衬垫、魔术贴闭合与 Flexform 鞋头；Full Custom Fit 多密度泡棉",
      "innerCuff": "Precision Harness 3.0 内部鞋跟带环绕前掌并锁定脚跟与踝部",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方描述强调渐进式自由式表现",
      "outsole": "DAMPLite+ 外底，结合冬季橡胶、EVA 缓震与 Contagrip 抓地橡胶",
      "footbed": "OrthoLite C2 双密度鞋垫与 Quickdry 快干鞋垫",
      "sizeGuide": "美国官方商品页尺码 US 男 7–13.5；FW2026/27 日本官方目录列 Mondopoint 25–29.5 cm。目录范围按颜色款式列出，不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/dialogue-dual-boa-li9150/L49277200；https://www.salomon.com/en-us/product/dialogue-dual-boa-wide-li9184；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "Salomon 美国官方将本款 Dialogue Dual BOA L49277200 标为 Regular，并单独销售同季 Dialogue Dual BOA Wide L45448100；常规款页面未公布楦宽毫米值或脚背容积。官方的 107 mm 提示指测量滑手本人脚宽，且当前尺码指南页面属于女款分类，不能当作雪鞋尺码参数或常规/Wide 的差值。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录列 Dialogue Dual BOA 系列：黑色 L49277200、Team Grey L49278500、Rainy Day L49259900；各色范围 Mondopoint 25–29.5 cm，日版目录建议零售价未税 JPY 59,000 / 含税 JPY 64,900。Team Grey 是目录色款，不代表另一个不同结构的型号。",
      "officialPrice": "USD 429.95",
      "priceMarket": "Salomon 美国官方商店；货号 L49277200",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/dialogue-dual-boa-li9150",
      "priceStatus": "当前同名型号美国官方挂牌价按 ECB 2026-10-13 汇率折算为 CNY 2,877.99；雪季由 Salomon FW2026/27 日本官方目录核实。日版目录另列未税 JPY 59,000、含税 JPY 64,900；美国折算价不是中国售价，未计税费、配送与进口费用。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等（Salomon 官方分类）"
      }
    ]
  },
  {
    "id": "01a12e89-6277-7f10-bafb-0425036624e4",
    "slug": "salomon-dialogue-dual-boa-team-2027",
    "title": "Salomon Dialogue Dual BOA Team 2027",
    "model": "Dialogue Dual BOA Team",
    "year": 2027,
    "oneLiner": "中等硬度全山地/自由式雪鞋，Team 配色版本采用双区 BOA 与 Precision Harness 3.0。",
    "priceMin": 2878,
    "priceMax": 2878,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/391f6fb5c9f523f1d70333f289dbd8f254d78b94d6efb6c4172c971140fc6d92.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72.9,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 7.2,
      "convenience": 8.9
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌",
      "flex": "中等（Salomon 官方分类）",
      "fit": "标准宽度；全山地/自由式取向，适合中级至高阶",
      "liner": "Response 全热塑性能鞋胆，踝部衬垫、魔术贴闭合与 Flexform 鞋头；Full Custom Fit 多密度泡棉",
      "innerCuff": "Precision Harness 3.0 内部鞋跟带环绕前掌并锁定脚跟与踝部",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；沿用 Dialogue Dual BOA 平台的自由式取向",
      "outsole": "DAMPLite+ 外底，结合冬季橡胶、EVA 缓震与 Contagrip 抓地橡胶",
      "footbed": "OrthoLite C2 双密度鞋垫与 Quickdry 快干鞋垫",
      "sizeGuide": "美国官方商品页尺码 US 男 7–13.5；FW2026/27 日本官方目录将 Team Grey 色款列为 Mondopoint 25–29.5 cm。目录范围不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/dialogue-dual-boa-team-li9182；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录将 Dialogue Dual BOA 的 Team Grey 色款列为货号 L49278500，尺码 Mondopoint 25–29.5 cm；日版目录同系列建议零售价未税 JPY 59,000、含税 JPY 64,900。目录将其列作颜色变体，不证明它是独立结构型号。",
      "officialPrice": "USD 429.95",
      "priceMarket": "Salomon 美国官方商店；货号 L49278500",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/dialogue-dual-boa-team-li9182",
      "priceStatus": "当前同名型号美国官方挂牌价按 ECB 2026-10-13 汇率折算为 CNY 2,877.99；雪季由 Salomon FW2026/27 日本官方目录核实。日版目录另列未税 JPY 59,000、含税 JPY 64,900；美国折算价不是中国售价，未计税费、配送与进口费用。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等（Salomon 官方分类）"
      }
    ]
  },
  {
    "id": "01a12e89-6284-7e3d-8825-5f3e75660335",
    "slug": "salomon-dialogue-dual-boa-wide-2027",
    "title": "Salomon Dialogue Dual BOA Wide 2027",
    "model": "Dialogue Dual BOA Wide",
    "year": 2027,
    "oneLiner": "宽楦中等硬度全山地/自由式雪鞋，双区 BOA 调节并配 Precision Harness 3.0 锁跟。",
    "priceMin": 2878,
    "priceMax": 2878,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/888ee39253f5d2bb7cb96e37881c6cb62bd2a489422d954c0f0bdf97d5bace0c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.7,
    "editorialScores": {
      "fit": 8.3,
      "value": 5,
      "warmth": 6.7,
      "support": 7.2,
      "convenience": 8.9
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌",
      "flex": "中等（Salomon 官方分类）",
      "fit": "宽楦；官方说明按宽脚解剖结构设计",
      "liner": "Response 全热塑性能鞋胆，踝部衬垫、魔术贴闭合与 Flexform 鞋头；Full Custom Fit 多密度泡棉",
      "innerCuff": "Precision Harness 3.0 内部鞋跟带环绕前掌并锁定脚跟与踝部",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；偏自由式取向",
      "outsole": "DAMPLite+ 外底，结合冬季橡胶、EVA 缓震与 Contagrip 抓地橡胶",
      "footbed": "OrthoLite C2 双密度鞋垫与 Quickdry 快干鞋垫",
      "sizeGuide": "美国官方商品页 US 男 7–13.5；FW2026/27 日本官方雪鞋目录对 L45448100 黑色 Wide 款列 Mondopoint 25–30.5 cm，普通颜色列 25–29.5 cm。地区尺码范围与库存不可互推；目录范围不是实时可售承诺。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/dialogue-dual-boa-wide-li9184；https://www.salomon.com/en-us/product/dialogue-dual-boa-li9150/L49277200；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "Salomon 官方将此商品明确标为 Wide，并称其采用适应宽脚的解剖结构；同季 Dialogue Dual BOA 常规款 L49277200 则标为 Regular。两页未公布该款逐尺码楦宽、脚背容积或 Wide 与 Regular 的毫米差。Salomon 尺码指南提到的 107 mm 是脚宽测量筛选值，不是此雪鞋的鞋楦宽度；相关页面为女款雪鞋分类，作为品牌测量提示使用，不转换为本款适配承诺。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录在 Dialogue Dual BOA 栏目单列黑色 Wide 款货号 L45448100，尺码 Mondopoint 25–30.5 cm；普通颜色为 25–29.5 cm。目录建议零售价未税 JPY 59,000、含税 JPY 64,900。来源为 Salomon 日本官网发布的官方季节目录；尺码选项不代表库存，Wide 不能据此换算为鞋楦毫米或跨品牌宽度。",
      "officialPrice": "USD 429.95",
      "priceMarket": "Salomon 美国官方商店；货号 L45448100",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/dialogue-dual-boa-wide-li9184",
      "priceStatus": "当前同名型号美国官方挂牌价按 ECB 2026-10-13 汇率折算为 CNY 2,877.99；雪季由 Salomon FW2026/27 日本官方目录核实。日版目录另列未税 JPY 59,000、含税 JPY 64,900；美国折算价不是中国售价，未计税费、配送与进口费用。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等（Salomon 官方分类）"
      }
    ]
  },
  {
    "id": "01a12e89-6290-79b8-bc6b-fde042af3f21",
    "slug": "salomon-echo-dual-boa-2027",
    "title": "Salomon Echo Dual BOA 2027",
    "model": "Echo Dual BOA",
    "year": 2027,
    "oneLiner": "全山地/自由滑取向，中等至偏硬脚感，Precision Harness 2.0 锁跟并配 MTN GOAT 外底。",
    "priceMin": 3146,
    "priceMax": 3146,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/b68bfc7517672aff2e697dc8d91dc979e085321277f45b59f06014b6272dd8ca.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 77.6,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 7.9,
      "convenience": 8.9
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌",
      "flex": "中等至偏硬（官方分档；定性描述为中等支撑）",
      "fit": "标准宽度；全山地与自由滑定位，适合进阶/高阶",
      "liner": "Precision 全热塑鞋胆，配泡棉踝部包裹与 Precision Harness 2.0",
      "innerCuff": "Precision Harness 2.0 内置脚跟/踝部固定结构",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地/自由滑；官方定位用于多地形滑行",
      "outsole": "MTN GOAT 橡胶外底，含 30% 天然橡胶；Fuze Surge 中底",
      "warmthFeatures": "鞋头区域含 78% 再生 3M Thinsulate 保暖材料；雪裙阻挡进雪",
      "footbed": "Relief 羊毛鞋垫（100% 天然羊毛、86% 再生泡棉）；Quickdry 快干结构",
      "sizeGuide": "官方男款页面尺码 US 7–13.5；FW2026/27 日本官方目录列该颜色 Mondopoint 25–29.5 cm，目录尺码不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/echo-dual-boa-li8035；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录列 Echo Dual BOA，货号 L49298000（Brown），尺码 Mondopoint 25–29.5 cm；日版目录建议零售价未税 JPY 68,000、含税 JPY 74,800。美国商品页价格仍作为美国市场参考。",
      "officialPrice": "USD 469.95",
      "priceMarket": "Salomon 美国官方商店；商品货号 L49298000",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/echo-dual-boa-li8035",
      "priceStatus": "2026-10-14 Salomon 美国官方页标价 USD 469.95（货号 L49298000），按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 折算为 CNY 3,145.74；雪季由 FW2026/27 日本官方目录核实，日版目录另列未税 JPY 68,000、含税 JPY 74,800。美国折算价不是中国售价，税费、配送与进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等至偏硬（官方分档；定性描述为中等支撑）"
      }
    ]
  },
  {
    "id": "01a12e89-629d-7306-80ca-c536fdb406f2",
    "slug": "salomon-faction-boa-2027",
    "title": "Salomon Faction BOA 2027",
    "model": "Faction BOA",
    "year": 2027,
    "oneLiner": "新手进阶全山地雪鞋，柔软脚感、单 BOA 系带与轻量 Feather 1.0 外底。",
    "priceMin": 1874,
    "priceMax": 1874,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/fe4a9649794393ed3f3eb5d2e7f2ae43543cfc255d47c0c6b5561d0b152a46cf.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69.5,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 6.2,
      "convenience": 8.3
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "单 BOA Coiler 系带，H4 Coiler 快速收线，TX3 纺织鞋带",
      "flex": "柔软（Salomon 官方分类）",
      "fit": "标准宽度；全山地定位，官方适用等级为新手/中级",
      "liner": "Universal 热塑鞋胆，Full Custom Fit 多密度泡棉",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；适用于新手至中级滑手",
      "outsole": "Feather 1.0 轻量外底：EVA 与 Contagrip 橡胶组合，吸震并提供抓地",
      "footbed": "Imprint 舒适鞋垫",
      "sizeGuide": "官方男款页面尺码 US 7–13.5；FW2026/27 日本官方目录对应货号 Mondopoint 25–30.5 cm，目录尺码不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/faction-boa-li9008；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录列 Faction BOA，货号 L49270000（Olive），尺码 Mondopoint 25–30.5 cm；日版目录建议零售价未税 JPY 46,000、含税 JPY 50,600。美国商品页价格仍作为美国市场参考。",
      "officialPrice": "USD 279.95",
      "priceMarket": "Salomon 美国官方商店；商品货号 L49270000",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/faction-boa-li9008",
      "priceStatus": "2026-10-14 Salomon 美国官方页标价 USD 279.95（货号 L49270000），按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 折算为 CNY 1,873.92；雪季由 FW2026/27 日本官方目录核实，日版目录另列未税 JPY 46,000、含税 JPY 50,600。美国折算价不是中国售价，税费、配送与进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "单 BOA Coiler 系带，H4 Coiler 快速收线，TX3 纺织鞋带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "柔软（Salomon 官方分类）"
      }
    ]
  },
  {
    "id": "01a12e89-62aa-7781-b03a-a2f5a0c80933",
    "slug": "salomon-launch-boa-sj-boa-2027",
    "title": "Salomon Launch BOA SJ BOA 2027",
    "model": "Launch BOA SJ BOA",
    "year": 2027,
    "oneLiner": "中等硬度全山地/自由式雪鞋，单 BOA 系带与 Str8jkt Pro 三点锁跟系统。",
    "priceMin": 2610,
    "priceMax": 2610,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/efaf64191ee878d67e3ec0dfcc4c472cbef85d2cc87be57b059b7ef8723e4f1c.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 72,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 7.2,
      "convenience": 8.3
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "单 BOA Coiler 系带；BOA 驱动 Str8jkt Pro 三点式脚跟锁定",
      "flex": "中等（Salomon 官方分类）",
      "fit": "标准宽度；全山地/自由式取向，适合中级至高阶",
      "liner": "Comfort 热塑鞋胆，柔软包裹并采用 Full Custom Fit 多密度泡棉",
      "innerCuff": "Str8jkt BOA Pro 三点式鞋跟带，滑动扣具可微调贴合",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地/自由式",
      "outsole": "Feather 2.0 轻量外底：EVA 与 Contagrip 橡胶组合，提供抓地和吸震",
      "footbed": "OrthoLite C2 双密度鞋垫",
      "sizeGuide": "官方男款页面尺码 US 7–13.5；FW2026/27 日本官方目录依颜色列 Mondopoint 25–30.5 cm 或 25–29.5 cm，目录尺码不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/launch-boa-sj-boa-li5670；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录列 Launch BOA SJ BOA，Black L47403000、White L49261400、Blue Night L49272000、Kelp L49262200；尺码按颜色为 Mondopoint 25–30.5 cm 或 25–29.5 cm。日版目录建议零售价未税 JPY 54,000、含税 JPY 59,400。",
      "officialPrice": "USD 389.95",
      "priceMarket": "Salomon 美国官方商店；货号 L49272000",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/launch-boa-sj-boa-li5670",
      "priceStatus": "当前同名型号美国官方挂牌价按 ECB 2026-10-13 汇率折算为 CNY 2,610.24；雪季与颜色尺码由 Salomon FW2026/27 日本官方目录核实，日版目录另列未税 JPY 54,000、含税 JPY 59,400。美国折算价不是中国售价，税费、配送与进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "单 BOA Coiler 系带；BOA 驱动 Str8jkt Pro 三点式脚跟锁定"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等（Salomon 官方分类）"
      }
    ]
  },
  {
    "id": "01a12e89-62b9-7557-b402-5f9d878515dc",
    "slug": "salomon-malamute-dual-boa-2027",
    "title": "Salomon Malamute Dual BOA 2027",
    "model": "Malamute Dual BOA",
    "year": 2027,
    "oneLiner": "偏硬自由滑雪鞋，Power Frame 强化鞋身、可选 Dyna Flex 舌片与 MTN GOAT 外底。",
    "priceMin": 3347,
    "priceMax": 3347,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/28edbe9dd86f4b9f836bf44437fa2b111d9e65f2c61a810d116ca2027bac0879.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 79.4,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 8.2,
      "support": 8.6,
      "convenience": 8.9
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌",
      "flex": "偏硬（Salomon 官方分类）；可选 Dyna Flex 舌片加强支撑",
      "fit": "标准宽度；自由滑定位，适合进阶/高阶",
      "liner": "Precision 全热塑鞋胆，泡棉踝部包裹与 Precision Harness 2.0",
      "innerCuff": "Precision Harness 2.0 锁定脚跟与踝部；Power Frame RPU 鞋身强化",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "自由滑/全山地；偏向进阶及高阶滑行",
      "outsole": "MTN GOAT 橡胶外底，含 30% 天然橡胶；Fuze Surge 中底",
      "warmthFeatures": "78% 再生 3M Thinsulate 保暖材料；Fuze Surge 中底",
      "footbed": "Relief 羊毛鞋垫（100% 天然羊毛、86% 再生泡棉）；Quickdry 快干结构",
      "sizeGuide": "官方男款页面尺码 US 6–13.5；FW2026/27 日本官方目录对应货号 Mondopoint 24–29.5 cm，目录尺码不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/malamute-dual-boa-li8071；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录列 Malamute Dual BOA，货号 L47773300（Black），尺码 Mondopoint 24–29.5 cm；日版目录建议零售价未税 JPY 69,000、含税 JPY 75,900。美国商品页价格仍作为美国市场参考。",
      "officialPrice": "USD 499.95",
      "priceMarket": "Salomon 美国官方商店；商品货号 L47773300",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/malamute-dual-boa-li8071",
      "priceStatus": "2026-10-14 Salomon 美国官方页标价 USD 499.95（货号 L47773300），按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 折算为 CNY 3,346.55；雪季由 FW2026/27 日本官方目录核实，日版目录另列未税 JPY 69,000、含税 JPY 75,900。美国折算价不是中国售价，税费、配送与进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Dual Zone BOA 双区调节：上区控制支撑与弯曲感，下区锁定前掌"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "偏硬（Salomon 官方分类）；可选 Dyna Flex 舌片加强支撑"
      }
    ]
  },
  {
    "id": "01a12e89-62c8-786d-bd64-6eb4147d78ff",
    "slug": "salomon-titan-boa-2027",
    "title": "Salomon Titan BOA 2027",
    "model": "Titan BOA",
    "year": 2027,
    "oneLiner": "柔软全山地入门雪鞋，单 BOA 系带、Universal 热塑鞋胆与轻量 D-Light 外底。",
    "priceMin": 1807,
    "priceMax": 1807,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/57697942d111ce361d988406ab8bc26dfafc977a861b0ac56cbf0b15d51f38e1.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 69.5,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 6.2,
      "convenience": 8.3
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "单 BOA 系带，H4 BOA 旋钮与 TX3 纺织鞋带",
      "flex": "柔软（Salomon 官方分类）",
      "fit": "标准宽度；全山地用途，官方适用等级为新手/中级",
      "liner": "Universal 热塑鞋胆，Full Custom Fit 多密度泡棉",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；新手至中级",
      "outsole": "D-Light 低轮廓全 EVA 外底，轻量并提供缓震与板感",
      "footbed": "Imprint 舒适耐用鞋垫",
      "sizeGuide": "官方男款页面尺码 US 7–13.5；FW2026/27 日本官方目录对应货号 Mondopoint 25–30.5 cm，目录尺码不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/titan-boa-lg5971；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录列 Titan BOA，货号 L47242900（Black），尺码 Mondopoint 25–30.5 cm；日版目录建议零售价未税 JPY 40,000、含税 JPY 44,000。美国商品页价格仍作为美国市场参考。",
      "officialPrice": "USD 269.95",
      "priceMarket": "Salomon 美国官方商店；货号 L47242900",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/titan-boa-lg5971",
      "priceStatus": "当前同名型号美国官方挂牌价按 ECB 2026-10-13 汇率折算为 CNY 1,806.99；雪季由 FW2026/27 日本官方目录核实，日版目录另列未税 JPY 40,000、含税 JPY 44,000。美国折算价不是中国售价，税费、配送与进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "单 BOA 系带，H4 BOA 旋钮与 TX3 纺织鞋带"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "柔软（Salomon 官方分类）"
      }
    ]
  },
  {
    "id": "01a12e89-62d4-7ae2-9a68-45478ef35c81",
    "slug": "salomon-trek-2027",
    "title": "Salomon Trek 2027",
    "model": "Trek",
    "year": 2027,
    "oneLiner": "登山巡航取向单板雪鞋，铰接式鞋口配 Hike & Ride BOA，适合上坡行走与下坡滑行。",
    "priceMin": 4016,
    "priceMax": 4016,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/c11dc910a95a13c2dc299e28e021156ecca7b4ede0450c48082b8e81015fc020.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 74.6,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 8.6,
      "convenience": 7.7
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "Hike & Ride BOA 可调行走活动范围，另配传统鞋带与 Powerstrap",
      "flex": "偏硬（Salomon 官方分类）",
      "fit": "标准宽度；Touring 登山巡航用途，官方适用等级为高阶",
      "liner": "Drive 支撑型透气鞋胆，带 Split-Mode 活动区；Full Custom Fit Pro 热塑多密度泡棉",
      "innerCuff": "可调内部鞋跟带固定鞋胆；Powerstrap 可调支撑",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "雪场外巡航/登山用途；铰接式鞋口支持上坡活动与下坡锁定",
      "outsole": "MTN GOAT 橡胶外底，含 30% 天然橡胶；Contagrip W 抓地配方与 Fuze Surge 中底",
      "footbed": "OrthoLite C3 双密度鞋垫，带成型后跟杯",
      "sizeGuide": "官方男款页面尺码 US 7–12.5；FW2026/27 日本官方目录对应货号 Mondopoint 25–29.5 cm，目录尺码不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/trek-lg8695；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录列 Trek，货号 L47033600（Black），尺码 Mondopoint 25–29.5 cm；日版目录建议零售价未税 JPY 71,000、含税 JPY 78,100。目录将 Trek 列为 Touring 款；美国商品页价格仍作为美国市场参考。",
      "officialPrice": "USD 599.95",
      "priceMarket": "Salomon 美国官方商店；货号 L47033600",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/trek-lg8695",
      "priceStatus": "当前同名型号美国官方挂牌价按 ECB 2026-10-13 汇率折算为 CNY 4,015.93；雪季由 FW2026/27 日本官方目录核实，日版目录另列未税 JPY 71,000、含税 JPY 78,100。美国折算价不是中国售价，税费、配送与进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "Hike & Ride BOA 可调行走活动范围，另配传统鞋带与 Powerstrap"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "偏硬（Salomon 官方分类）"
      }
    ]
  },
  {
    "id": "01a12e89-62e3-7373-a880-db12e9a5ac74",
    "slug": "salomon-x-approach-lace-sj-boa-2027",
    "title": "Salomon X Approach Lace SJ BOA 2027",
    "model": "X Approach Lace SJ BOA",
    "year": 2027,
    "oneLiner": "中等硬度公园/自由式取向雪鞋，传统鞋带搭配 BOA 驱动 Str8jkt 脚跟锁定。",
    "priceMin": 2342,
    "priceMax": 2342,
    "priceCurrency": "CNY",
    "coverUrl": "https://youpu.tos-cn-beijing.volces.com/product-images/mirror/fe3f49c06e70f9bd4deffd833d4ac595f1df416a5ecad4148177edbff779c303.webp",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": 71.1,
    "editorialScores": {
      "fit": 7.7,
      "value": 5,
      "warmth": 6.7,
      "support": 7.2,
      "convenience": 7.7
    },
    "brand": {
      "slug": "salomon",
      "name": "Salomon",
      "nameCn": null
    },
    "categorySlug": "snowboard-boot",
    "specs": {
      "lacingSystem": "传统鞋带；BOA 驱动 Str8jkt 脚跟锁定系统",
      "flex": "中等（Salomon 官方分类）",
      "fit": "标准宽度；官方标注男女通用，全山地/自由式定位",
      "liner": "Comfort 全热塑鞋胆，柔软包裹与 Full Custom Fit 多密度泡棉",
      "innerCuff": "BOA 激活 Str8jkt 鞋跟带，减少脚跟抬起",
      "bindingCompatibility": "常规单板雪鞋；先按固定器尺码表核对鞋码，再实装检查鞋底、后跟与绑带。不可作为 Step On 专用鞋使用，快穿固定器也需核对具体型号范围。",
      "terrain": "全山地；官方说明为公园/自由式雪鞋",
      "outsole": "Feather 2.0 轻量外底：EVA 与 Contagrip 橡胶组合，提供抓地和吸震",
      "footbed": "OrthoLite C2 双密度鞋垫",
      "sizeGuide": "官方男女通用页面尺码 US 5–13.5；FW2026/27 日本官方目录列 Mondopoint 23–29.5 cm，目录尺码不代表实时库存。",
      "selectionNotes": "穿实际滑雪袜测量双脚脚长，以较长一侧查本品牌尺码表，再核对脚宽、脚背压力和屈膝时的锁跟。先选雪鞋再选固定器；不要把不同品牌的 EU/US 码作统一换算，也不要用单板腰宽直接断言鞋底不会拖雪。 足长区间与 MONDO 是官网不同列，不能用区间端点替代 MONDO。",
      "compatibilitySources": "https://www.salomon.com/en-us/product/x-approach-lace-sj-boa-li5866；https://www.salomon.com/en-us/sizingchart?category=women-snowboard-boots&gender=women",
      "fitEvidence": "官网未公布可跨品牌比较的鞋楦毫米宽度或脚背容积；现有宽楦/贴合描述属于厂家标注，不等于适合某种脚型的实测结论。",
      "heatMolding": "官方当前型号页提及鞋胆可热塑；热塑有助于贴合，但不等于能补救错误尺码或改变外壳结构。温度、流程与适用鞋胆须按品牌说明，由专业店确认。",
      "seasonEvidence": "Salomon 官方 FW2026/27 单板雪鞋目录列 X Approach Lace SJ BOA，货号 L45418900（Silver）、L49271800（Black）、L49271900（Team），尺码 Mondopoint 23–29.5 cm；日版目录建议零售价未税 JPY 52,000、含税 JPY 57,200。该款为男女通用型号。",
      "officialPrice": "USD 349.95",
      "priceMarket": "Salomon 美国官方商店；货号 L45418900",
      "priceCheckedAt": "2026-10-14",
      "priceSource": "https://www.salomon.com/en-us/product/x-approach-lace-sj-boa-li5866",
      "priceStatus": "当前同名型号美国官方挂牌价按 ECB 2026-10-13 汇率折算为 CNY 2,342.49；雪季由 FW2026/27 日本官方目录核实，日版目录另列未税 JPY 52,000、含税 JPY 57,200。美国折算价不是中国售价，税费、配送与进口费用未计。"
    },
    "highlights": [
      {
        "key": "lacingSystem",
        "label": "闭合系统",
        "value": "传统鞋带；BOA 驱动 Str8jkt 脚跟锁定系统"
      },
      {
        "key": "flex",
        "label": "硬度",
        "value": "中等（Salomon 官方分类）"
      }
    ]
  },
  {
    "id": "01a12e89-62f0-75e6-8e5c-3d2c1c9c0172",
    "slug": "amazfit-t-rex-3-pro-48mm-2026",
    "title": "T-Rex 3 PRO 五級鈦合金智慧手錶",
    "model": "T-Rex 3 Pro 48mm",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://cdn.shopify.com/s/files/1/0464/1475/8043/files/A_588e7798-a148-463d-9fb1-e931356cea73.jpg?v=1779843822&width=1000",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-62fb-72d2-9623-4327be704ae9",
    "slug": "sirui-t-1204sk-2026",
    "title": "思锐T-S系列三脚架 - 广东思锐光学股份有限公司官网",
    "model": "T-1204SK",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://s2.sirui.com/mobile/products/protripodts2018020907B.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-6305-7cf0-bd8c-1f1e029b9513",
    "slug": "dji-osmo-pocket-3-2023",
    "title": "Osmo Pocket 3 - 技术参数 - DJI 大疆创新",
    "model": "Osmo Pocket 3",
    "year": 2023,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www-cdn.djiits.com/dps/57a9ccada7944fb81cdc9a8e4d3bcc70.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
    "id": "01a12e89-6312-7f87-bf02-34e0cb8f3cc7",
    "slug": "godox-sl60iibi-2026",
    "title": "SL60IID/SL60IIBi-神牛产品-Godox神牛 - 官方网站",
    "model": "SL60IIBi",
    "year": 2026,
    "oneLiner": null,
    "priceMin": null,
    "priceMax": null,
    "priceCurrency": "CNY",
    "coverUrl": "https://www.godox.com.cn/static/upload/image/20230222/1677053116948945.jpg",
    "ratingOverall": null,
    "ratingCount": 0,
    "favoriteCount": 0,
    "composite": null,
    "editorialScores": null,
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
