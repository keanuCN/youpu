import { useState } from "react";
import { cn } from "@/lib/utils";
import { SafeImage } from "./safe-image";
import type { GalleryShot } from "@/types";

/** 详情页图集：主图 + 缩略图轨道，灰度→彩色签名交互 */
export function Gallery({
  shots,
  alt,
  fit = "cover",
}: {
  shots: GalleryShot[];
  alt: string;
  fit?: "cover" | "contain";
}) {
  const [idx, setIdx] = useState(0);
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const active = shots[idx] ?? shots[0];
  if (!active) {
    return (
      <div className="flex aspect-[4/3] items-start border border-border bg-secondary p-3 sm:aspect-[5/4]">
        <span className="mono-label text-muted-foreground">暂无图片</span>
      </div>
    );
  }
  const imageUnavailable = !active.url || failedUrls.includes(active.url);

  return (
    <div className="flex flex-col gap-3">
      <figure className="group relative aspect-[4/3] overflow-hidden border border-border bg-secondary sm:aspect-[5/4]">
        {imageUnavailable ? (
          <div role="img" aria-label={`${alt}，暂无图片`} className="flex h-full w-full items-start bg-secondary p-3">
            <span className="mono-label text-muted-foreground">暂无图片</span>
          </div>
        ) : (
          <SafeImage
            key={active.url}
            src={active.url}
            alt={`${alt} · ${active.label}`}
            fallbackLabel={alt}
            fallbackMode="muted"
            fallbackClassName={cn("p-8 sm:p-12", fit === "contain" ? "" : "p-0")}
            className={cn("plate h-full w-full", fit === "contain" ? "object-contain p-8 sm:p-12" : "object-cover")}
            onError={() => setFailedUrls((current) => current.includes(active.url) ? current : [...current, active.url])}
          />
        )}
        <figcaption className="mono-label absolute bottom-0 left-0 bg-background/90 px-2.5 py-1.5">
          {String(idx + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")} · {active.label}
        </figcaption>
      </figure>

      {shots.length > 1 ? (
        <div className="thin-scroll flex gap-2 overflow-x-auto pb-1">
          {shots.map((s, i) => (
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
                src={s.url}
                alt=""
                loading="lazy"
                fallbackLabel={`${alt} · ${s.label}`}
                fallbackMode="muted"
                className={cn(
                  "h-full w-full",
                  fit === "contain" ? "object-contain p-2" : "object-cover",
                  i === idx ? "" : "grayscale",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
