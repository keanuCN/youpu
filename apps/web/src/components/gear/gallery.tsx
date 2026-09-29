import { useState } from "react";
import { cn } from "@/lib/utils";
import { isAiGeneratedImageUrl, preferProductThumbnail } from "@/lib/image-url";
import { SafeImage } from "./safe-image";
import type { GalleryShot } from "@/types";

/** 详情页只显示可信的商品图，完整保留原图比例。 */
export function Gallery({
  shots,
  alt,
}: {
  shots: GalleryShot[];
  alt: string;
}) {
  const [idx, setIdx] = useState(0);
  const productShots = shots.filter((shot) => !isAiGeneratedImageUrl(shot.url));
  const selectedIdx = Math.min(idx, Math.max(productShots.length - 1, 0));
  const active = productShots[selectedIdx];
  if (!active) return <div aria-hidden="true" className="aspect-[4/3] sm:aspect-[5/4]" />;

  return (
    <div className="flex flex-col gap-3">
      <figure className="group relative aspect-[4/3] overflow-hidden border border-border bg-secondary sm:aspect-[5/4]">
        <SafeImage
          key={active.url}
          src={active.url}
          alt={`${alt} · ${active.label}`}
          loading="eager"
          fetchPriority="high"
          fallbackLabel={alt}
          fallbackClassName="p-4 sm:p-6"
          fallbackMode="empty"
          className="h-full w-full object-contain p-4 sm:p-6"
        />
        <figcaption className="mono-label absolute bottom-0 left-0 bg-background/90 px-2.5 py-1.5">
          {String(selectedIdx + 1).padStart(2, "0")} / {String(productShots.length).padStart(2, "0")} · {active.label}
        </figcaption>
      </figure>

      {productShots.length > 1 ? (
        <div className="thin-scroll flex gap-2 overflow-x-auto pb-1">
          {productShots.map((s, i) => (
            <button
              key={`${s.url}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`查看 ${s.label}`}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden border bg-secondary transition-colors sm:h-20 sm:w-20",
                i === idx ? "border-foreground" : "border-border hover:border-muted-foreground",
              )}
            >
              <SafeImage
                src={preferProductThumbnail(s.url)}
                alt=""
                loading="lazy"
                fallbackLabel={`${alt} · ${s.label}`}
                fallbackMode="muted"
                className="h-full w-full object-contain p-2"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
