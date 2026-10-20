const styleLabels: Record<string, string> = {
  "style-all-mountain": "全山路线示意",
  "style-carving": "刻滑弧线示意",
  "style-flatground": "平花动作示意",
  "style-park": "公园道具示意",
  "style-jumps": "跳台线路示意",
  "style-halfpipe": "半管线路示意",
  "style-freeride": "自由骑线路示意",
};

function Illustration({ id }: { id: string }) {
  switch (id) {
    case "style-carving":
      return <>
        <path d="M48 235C155 215 130 100 257 91S366 221 481 205 531 129 602 103" />
        <path d="M48 259C176 244 145 128 264 119S371 246 494 229 548 157 602 134" className="stroke-primary/30" />
        <path d="M84 77h78M426 66h105M318 286h90" className="stroke-foreground/15" />
        <circle cx="253" cy="104" r="5" className="fill-primary" />
        <circle cx="487" cy="217" r="5" className="fill-primary" />
      </>;
    case "style-flatground":
      return <>
        <path d="M0 238h640" className="stroke-foreground/15" />
        <path d="M296 68c-21 28-27 57-25 101l5 96c1 18 13 29 24 29s23-11 24-29l5-96c2-44-4-73-25-101-2-3-6-3-8 0Z" className="fill-background" />
        <path d="M296 68c-21 28-27 57-25 101l5 96c1 18 13 29 24 29s23-11 24-29l5-96c2-44-4-73-25-101-2-3-6-3-8 0Z" />
        <ellipse cx="228" cy="202" rx="55" ry="31" transform="rotate(-24 228 202)" strokeDasharray="5 7" />
        <ellipse cx="409" cy="167" rx="61" ry="34" transform="rotate(21 409 167)" strokeDasharray="5 7" />
        <path d="m197 165 14-2-5 13M440 202l-14 3 5-13" />
      </>;
    case "style-park":
      return <>
        <path d="M34 245h570" className="stroke-foreground/15" />
        <path d="M57 241 192 195l39 46Z" className="fill-primary/10" />
        <path d="M57 241 192 195l39 46" />
        <path d="M344 208h205" strokeWidth="7" />
        <path d="M360 221v25m172-25v25" />
        <path d="M94 171c46-17 92-26 134-29m131 31c52-38 103-39 155-37" strokeDasharray="5 8" />
        <circle cx="430" cy="95" r="17" className="fill-primary/15" />
      </>;
    case "style-jumps":
      return <>
        <path d="M32 249h576" className="stroke-foreground/15" />
        <path d="M50 246 180 208l40 38Z" className="fill-primary/10" />
        <path d="M50 246 180 208l40 38" />
        <path d="M198 205C262 78 393 57 503 170" strokeDasharray="7 8" />
        <path d="m493 153 13 17-21 3" />
        <g transform="translate(342 91) rotate(-17)">
          <path d="M-4-31c-9 10-11 20-10 34l3 25c1 7 4 11 8 11s7-4 8-11l3-25c1-14-1-24-10-34Z" className="fill-background" />
          <circle cx="0" cy="-43" r="9" className="fill-primary/25" />
        </g>
        <path d="M444 231h115" />
      </>;
    case "style-halfpipe":
      return <>
        <path d="M36 100 96 253Q320 328 544 253L604 100" strokeWidth="8" />
        <path d="M67 128 119 239Q320 298 521 239L573 128" className="stroke-primary/25" />
        <path d="M99 218C146 264 191 279 242 280S343 277 385 253 463 198 510 142" strokeDasharray="6 8" />
        <path d="m497 146 15-9-1 18" />
        <path d="M83 84h95M464 84h95" className="stroke-foreground/15" />
      </>;
    case "style-freeride":
      return <>
        <path d="M18 238 140 89l83 100L327 61l114 139L526 93l96 145Z" className="fill-primary/5" />
        <path d="M18 238 140 89l83 100L327 61l114 139L526 93l96 145" />
        <path d="M124 121 140 89l17 32m-27-9h22l-11-18Zm177-22 23-46 23 46m-37-13h28l-14-27Zm210 41 25-49 24 49m-39-14h29l-14-27Z" className="fill-primary/10" />
        <path d="M390 147C349 156 353 187 317 196s-24 31-61 37-34 16-54 20" strokeDasharray="6 8" />
        <circle cx="390" cy="147" r="5" className="fill-primary" />
      </>;
    default:
      return <>
        <path d="M18 238 150 88l85 108L351 57l113 145L546 96l76 142Z" className="fill-primary/5" />
        <path d="M18 238 150 88l85 108L351 57l113 145L546 96l76 142" />
        <path d="M89 208C152 171 178 152 224 147s71 21 120 14 75-54 148-76" strokeDasharray="7 8" />
        <circle cx="89" cy="208" r="5" className="fill-primary" />
        <circle cx="492" cy="85" r="5" className="fill-primary" />
      </>;
  }
}

export function SnowboardStyleIllustration({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 640 320" role="img" aria-label={styleLabels[id] ?? "单板滑行风格示意图"} className="h-full w-full">
      <rect width="640" height="320" className="fill-secondary/60" />
      <circle cx="528" cy="74" r="23" className="fill-primary/10" />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" className="text-foreground/65">
        <Illustration id={id} />
      </g>
      <path d="M20 279h600" className="stroke-foreground/10" />
      <text x="24" y="302" className="fill-muted-foreground" fontSize="10" letterSpacing="1.4">示意图 · 线路与动作因场地而异</text>
    </svg>
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
