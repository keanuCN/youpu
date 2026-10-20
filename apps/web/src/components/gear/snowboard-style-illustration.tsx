const styleImages: Record<string, { src: string; alt: string }> = {
  "style-all-mountain": {
    src: "/images/education/snowboard/all-mountain.webp",
    alt: "单板滑手在整备雪道与侧坡之间巡航，展示全山滑行",
  },
  "style-carving": {
    src: "/images/education/snowboard/carving.webp",
    alt: "单板滑手压低重心在整备雪道上完成刻滑转弯",
  },
  "style-flatground": {
    src: "/images/education/snowboard/flatground.webp",
    alt: "单板滑手在平整雪道上练习低速压板动作",
  },
  "style-park": {
    src: "/images/education/snowboard/park.webp",
    alt: "单板滑手沿公园宽箱道具平衡滑行",
  },
  "style-jumps": {
    src: "/images/education/snowboard/jumps.webp",
    alt: "单板滑手从小型跳台起跳，前方可见落地区",
  },
  "style-halfpipe": {
    src: "/images/education/snowboard/halfpipe.webp",
    alt: "单板滑手沿 U 形半管的管壁滑行",
  },
  "style-freeride": {
    src: "/images/education/snowboard/freeride.webp",
    alt: "单板滑手在雪场开放区域的松软雪面上转弯",
  },
};

export function SnowboardStyleIllustration({ id }: { id: string }) {
  const image = styleImages[id] ?? {
    src: "/images/education/snowboard/all-mountain.webp",
    alt: "单板滑手在整备雪道与侧坡之间巡航，展示全山滑行",
  };
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    // Native lazy loading keeps below-the-fold education images out of the initial request burst.
    <img
      src={`${basePath}${image.src}`}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
    />
  );
}

export function SnowboardSetupStepIllustration({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["雪鞋贴合示意", "固定器与雪鞋连接示意", "雪板尺码示意"];
  return (
    <svg viewBox="0 0 360 132" role="img" aria-label={labels[step - 1]} className="h-28 w-full text-foreground/65">
      <rect width="360" height="132" className="fill-secondary/60" />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
        {step === 1 ? <>
          <path d="M166 20c-13 11-18 24-18 42v18c0 9 7 15 17 15h39c15 0 23-11 18-22l-13-26c-4-8-8-18-9-27Z" className="fill-background" />
          <path d="m166 32 31 2m-37 13 43 2m-46 14 50 1m-54 12 45 1" />
          <path d="M149 85c-10 9-17 15-16 23h101c-1-8-6-13-15-15" className="stroke-primary" />
          <path d="M73 106h214" className="stroke-foreground/15" />
        </> : null}
        {step === 2 ? <>
          <path d="M145 27c-11 13-13 26-11 44l4 24c2 9 12 14 22 14h38c12 0 20-9 16-20l-12-29c-4-10-7-21-8-33Z" className="fill-background" />
          <path d="M111 53c15-11 34-14 54-13m-55 41c17-10 39-13 59-11" className="stroke-primary" />
          <path d="M90 45h-13v52h13m172-52h13v52h-13M102 43c-13 14-13 42 0 56m158-56c13 14 13 42 0 56" />
          <path d="M73 108h214" className="stroke-foreground/15" />
        </> : null}
        {step === 3 ? <>
          <path d="M180 14c-18 20-27 39-24 62l8 37c2 8 7 12 16 12s14-4 16-12l8-37c3-23-6-42-24-62Z" className="fill-background" />
          <path d="M165 58h30m-34 18h38m-35 15h32" className="stroke-primary" />
          <path d="M66 111h228m-30-10 30 10-30 10m-168-20-30 10 30 10" className="stroke-foreground/35" />
        </> : null}
      </g>
      <text x="18" y="23" className="fill-muted-foreground" fontSize="10" letterSpacing="1.3">先合脚，再匹配，最后选板</text>
    </svg>
  );
}
