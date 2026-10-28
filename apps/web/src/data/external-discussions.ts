export interface ExternalDiscussion {
  url: string;
  platform?: "抖音" | "小红书";
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
    { platform: "小红书", url: "https://www.xiaohongshu.com/explore/6a9aacf3000000002b026bb5", label: "Huck Knife 公园玩法讨论", excerpt: "自由式板里，太多产品要么硬到劝退，要么软到没反馈。", scope: "作者讨论 Huck Knife 的公园定位，内容属于观点分享，不代表站内实测。" },
  ],
  "jones-howler-2027": [
    { platform: "小红书", url: "https://www.xiaohongshu.com/explore/696a25aa0000000021033846", label: "Howler 试滑分享", excerpt: "道内刃感非常清晰，板头减震材料能够过滤高速滑行时产生的震动，面对烂雪也非常稳定。", scope: "作者称试滑 158 cm，地点万龙；感谢 Jones 提供接触新品的机会。为个人感受，不代表本站实测。" },
  ],
  "jones-flagship-2027": [
    { platform: "小红书", url: "https://www.xiaohongshu.com/explore/69b3a860000000001a0216a4", label: "Flagship 试滑分享", excerpt: "速度越快，它越灵活。速度慢了，反而有点拧不动。", scope: "作者称在日本白马试滑 158 cm，通过 Jones 活动获得试滑机会。为个人感受，不代表本站实测。" },
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
