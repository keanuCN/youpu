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
  const images = [
    { src: "setup-boot.webp", alt: "店员协助检查单板雪鞋贴合度与脚跟固定" },
    { src: "setup-binding.webp", alt: "将单板雪鞋放入固定器，检查鞋底居中和绑带位置" },
    { src: "setup-board.webp", alt: "店员根据滑雪者身高比较单板长度" },
  ];
  const image = images[step - 1];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return <img
    src={`${basePath}/images/education/snowboard/${image.src}`}
    alt={image.alt}
    loading="lazy"
    decoding="async"
    className="h-full w-full object-cover"
  />;
}
