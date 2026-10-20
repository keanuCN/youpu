"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/image-url";

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
      <p className="mt-4 text-sm font-medium">商务合作请联系</p>
      <p className="mono-label mt-2 break-all text-foreground">vx15833770890</p>
      <Image
        src={resolveImageUrl("/images/contact/wechat-business-qr.png")}
        alt="商务合作微信二维码"
        width={640}
        height={640}
        className="mt-3 h-32 w-32 shrink-0 bg-white object-contain p-1"
      />
      <p className="mono-label mt-2 text-muted-foreground">微信扫码添加</p>
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
