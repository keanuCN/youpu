/** 编辑拟定的产品个性标签，不代表用户评价、排名或实测结论。 */
export const PRODUCT_PERSONALITY_TAGS: Readonly<Record<string, string | readonly string[]>> = {
  "gray-desperado-ti-type-r-2026": ["一顺天花板", "夯中夯", "保值"],
  "gray-desperado-ti-type-r-2027": ["一顺天花板", "夯中夯", "保值"],
  "donek-knapton-twin-custom-2026": ["大刀", "八字之王"],
  "nitro-team-tls-2027": "现代刑具",
  "nitro-team-boa-2027": "现代刑具",
  "nobaday-blackboard-6-sky-mirror-2026": "小黑板",
  "nobaday-blackboard-pro-5-camber-2026": "小黑板",
  "ogasaka-fc-s-2027": "刻滑进阶派",
  "ogasaka-fc-2026": "道内刻滑派",
  "jones-freecarver-9000s-2025": "大弯走刃派",
  "jones-freecarver-9000s-2027": "大弯走刃派",
  "jones-freecarver-6000s-2025": "短弯走刃派",
  "jones-freecarver-6000s-2027": "短弯走刃派",
  "jones-flagship-2025": "大山自由骑",
  "jones-flagship-2027": "大山自由骑",
  "burton-custom-camber-2026": "全山经典",
  "burton-custom-camber-2027": "全山经典",
  "salomon-huck-knife-2027": "公园进阶派",
  "salomon-huck-knife-pro-2027": "公园性能派",
  "ride-warpig-2027": "短宽小钢炮",
  "capita-super-doa-2027": "自由式性能派",
  "lib-tech-golden-orca-2027": "粉雪自由骑",
  "sp-base-2026": "快穿入门派",
  "sp-core-2026": "快穿全山派",
};

export function personalityTagsFor(id: string): readonly string[] {
  const tags = PRODUCT_PERSONALITY_TAGS[id];
  return typeof tags === "string" ? [tags] : tags ?? [];
}
