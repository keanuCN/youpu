function SideAdSlot({ side }: { side: "left" | "right" }) {
  const label = side === "left" ? "左侧广告位" : "右侧广告位";

  return (
    <aside
      aria-label={label}
      data-ad-slot={`${side}-skyscraper`}
      className="fixed top-1/2 z-20 hidden h-[min(600px,calc(100vh-144px))] w-40 -translate-y-1/2 flex-col items-center justify-center border border-dashed border-border bg-secondary/35 px-4 text-center min-[1840px]:flex max-[739px]:hidden"
      style={{ [side]: "max(24px, calc((100vw - 1400px) / 2 - 196px))" }}
    >
      <span className="mono-label border border-border px-2 py-1 text-muted-foreground">广告位</span>
      <p className="mt-4 text-sm font-medium">品牌与雪场展示</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">竖版广告素材预留区域</p>
      <p className="mono-label mt-6 text-muted-foreground">160 × 600</p>
    </aside>
  );
}

export function SideAdSlots() {
  return (
    <>
      <SideAdSlot side="left" />
      <SideAdSlot side="right" />
    </>
  );
}
