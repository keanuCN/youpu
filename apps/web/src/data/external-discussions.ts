export interface ExternalDiscussion {
  url: string;
  label: string;
  scope: string;
}

// Model-level pointers only: a post does not establish a review of this exact season.
export const EXTERNAL_DISCUSSIONS: Record<string, ExternalDiscussion[]> = {
  "gray-desperado-ti-type-r-2026": [
    { url: "https://www.douyin.com/video/7440024998602919178", label: "Type-R 红树使用演示", scope: "帖子提到 Type-R，未确认雪季。" },
    { url: "https://www.douyin.com/video/7326033031687458067", label: "Type-R 红树滑行分享", scope: "帖子提到 Type-R，未确认雪季。" },
  ],
  "gray-desperado-ti-type-r-2027": [
    { url: "https://www.douyin.com/video/7440024998602919178", label: "Type-R 红树使用演示", scope: "帖子提到 Type-R，未确认雪季。" },
    { url: "https://www.douyin.com/video/7326033031687458067", label: "Type-R 红树滑行分享", scope: "帖子提到 Type-R，未确认雪季。" },
  ],
  "salomon-huck-knife-2027": [
    { url: "https://www.douyin.com/video/7594448507995061929", label: "Huck Knife 测评分享", scope: "帖子提到 Huck Knife，未确认雪季或细分版本。" },
  ],
  "burton-custom-camber-2027": [
    { url: "https://www.douyin.com/video/7671235948251929984", label: "Custom 与 Custom X 试滑对比", scope: "帖子提到 2026/27 雪季及两个系列，具体配置请以原帖为准。" },
  ],
  "burton-custom-x-camber-2027": [
    { url: "https://www.douyin.com/video/7671235948251929984", label: "Custom 与 Custom X 试滑对比", scope: "帖子提到 2026/27 雪季及两个系列，具体配置请以原帖为准。" },
  ],
  "nitro-alternator-2027": [
    { url: "https://www.douyin.com/video/7345054859307142436", label: "Alternator 测评分享", scope: "帖子提到 Alternator，未确认雪季。" },
  ],
};
