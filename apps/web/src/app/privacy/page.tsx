import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私说明",
  description: "有谱网站访问统计与个人信息处理说明。",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="mono-label">YOUPU · PRIVACY</p>
      <h1 className="serif-display mt-3 text-4xl">隐私说明</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
        <p>为了解网站访问者的大致地域分布并改进内容，我们会在访问行为统计时，根据连接 IP 在服务器本地推断省级或国家级地区。</p>
        <p>我们只将推断出的地区标签与统计事件一同保存，用于管理后台的汇总分析；不保存原始 IP、城市、精确坐标，也不会将 IP 发送给第三方地理位置服务。地域识别可能受代理、运营商网络出口和数据库覆盖影响，因此仅供趋势参考。</p>
        <p>访问统计事件最长保存 180 天，之后由系统自动清理。你可以通过网站公布的商务联系渠道提出查询、更正或删除相关个人信息的请求。</p>
      </div>
    </main>
  );
}
