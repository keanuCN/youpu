"use client";

import { useEffect, useState } from "react";

function SideAdSlot({ side, reveal }: { side: "left" | "right"; reveal: number }) {
  const label = side === "left" ? "左侧广告位" : "右侧广告位";

  return (
    <aside
      aria-label={label}
      aria-hidden={reveal === 0}
      data-ad-slot={`${side}-skyscraper`}
      className="fixed top-1/2 z-20 hidden h-[min(600px,calc(100vh-144px))] w-40 flex-col items-center justify-center border border-dashed border-border bg-secondary/35 px-4 text-center transition-[opacity,transform] duration-300 ease-out min-[1840px]:flex max-[739px]:hidden"
      style={{
        [side]: "max(24px, calc((100vw - 1400px) / 2 - 196px))",
        opacity: reveal,
        transform: `translateY(-50%) translateX(${(side === "left" ? -1 : 1) * 12 * (1 - reveal)}px)`,
        pointerEvents: reveal === 0 ? "none" : "auto",
      }}
    >
      <span className="mono-label border border-border px-2 py-1 text-muted-foreground">广告位</span>
      <p className="mt-4 text-sm font-medium">品牌与雪场展示</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">竖版广告素材预留区域</p>
      <p className="mono-label mt-6 text-muted-foreground">160 × 600</p>
    </aside>
  );
}

export function SideAdSlots() {
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateReveal = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = document.getElementById("home-hero");
        const revealAfter = hero
          ? hero.getBoundingClientRect().bottom + window.scrollY
          : 320;
        const progress = Math.max(0, Math.min(1, (window.scrollY - revealAfter) / 240));
        setReveal(progress);
      });
    };

    updateReveal();
    window.addEventListener("scroll", updateReveal, { passive: true });
    window.addEventListener("resize", updateReveal);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateReveal);
      window.removeEventListener("resize", updateReveal);
    };
  }, []);

  return (
    <>
      <SideAdSlot side="left" reveal={reveal} />
      <SideAdSlot side="right" reveal={reveal} />
    </>
  );
}
