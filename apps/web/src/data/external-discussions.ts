export interface ExternalDiscussion {
  url: string;
  label: string;
  excerpt: string;
  scope: string;
}

// Model-level pointers only: a post does not establish a review of this exact season.
export const EXTERNAL_DISCUSSIONS: Record<string, ExternalDiscussion[]> = {
  "gray-desperado-ti-type-r-2026": [
    { url: "https://www.douyin.com/video/7440024998602919178", label: "Type-R 红树使用演示", excerpt: "Type R 红树使用说明书。为防止大家由于上一个视频错误理解 Type-R 的使用方法，由 Gray Snowboards 滑手做下正确演示。", scope: "帖子提到 Type-R，未确认雪季。" },
    { url: "https://www.douyin.com/video/7326033031687458067", label: "Type-R 红树滑行分享", excerpt: "只管发力，其他交给红树 Type R。", scope: "帖子提到 Type-R，未确认雪季。" },
  ],
  "gray-desperado-ti-type-r-2027": [
    { url: "https://www.douyin.com/video/7440024998602919178", label: "Type-R 红树使用演示", excerpt: "Type R 红树使用说明书。为防止大家由于上一个视频错误理解 Type-R 的使用方法，由 Gray Snowboards 滑手做下正确演示。", scope: "帖子提到 Type-R，未确认雪季。" },
    { url: "https://www.douyin.com/video/7326033031687458067", label: "Type-R 红树滑行分享", excerpt: "只管发力，其他交给红树 Type R。", scope: "帖子提到 Type-R，未确认雪季。" },
  ],
  "salomon-huck-knife-2027": [
    { url: "https://www.douyin.com/video/7594448507995061929", label: "Huck Knife 测评分享", excerpt: "自费滑雪板测评之 SALOMON HUCK KNIFE（HK）。", scope: "帖子提到 Huck Knife，未确认雪季或细分版本；正文未采集到具体体验。" },
  ],
  "burton-custom-camber-2027": [
    { url: "https://www.douyin.com/video/7671235948251929984", label: "Custom 与 Custom X 试滑对比", excerpt: "2627 雪季这两个热门怎么选，customx 和 custom 新款试滑！硬度居然能搞错？但是真的好用！！！", scope: "帖子提到 2026/27 雪季及两个系列，具体配置请以原帖为准。" },
  ],
  "burton-custom-x-camber-2027": [
    { url: "https://www.douyin.com/video/7671235948251929984", label: "Custom 与 Custom X 试滑对比", excerpt: "2627 雪季这两个热门怎么选，customx 和 custom 新款试滑！硬度居然能搞错？但是真的好用！！！", scope: "帖子提到 2026/27 雪季及两个系列，具体配置请以原帖为准。" },
  ],
  "nitro-alternator-2027": [
    { url: "https://www.douyin.com/video/7345054859307142436", label: "Alternator 测评分享", excerpt: "Nitro 雪板 Alternator 简单小测评！性能抛开放一边，光看到图案设计我就走不动道儿了！", scope: "帖子提到 Alternator，未确认雪季。" },
  ],
};
