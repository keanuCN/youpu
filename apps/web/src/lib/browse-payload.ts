import type { GearItem } from "@/types";

/** 列表页不展示详情分析或尺码表；详情页仍从完整商品数据读取。 */
export function compactBrowseItem(gear: GearItem): GearItem {
  return {
    ...gear,
    gallery: gear.hero ? [] : gear.gallery.slice(0, 1),
    sizeSpecs: undefined,
    equipmentSizeChart: undefined,
    fitGuide: undefined,
    whoFor: [],
    analysis: { verdict: "", strengths: [], weaknesses: [], fits: [], notFits: [] },
  };
}
