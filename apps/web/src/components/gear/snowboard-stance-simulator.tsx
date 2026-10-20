'use client';

import { useState } from 'react';

const presets = [
  { label: '新手建议', front: 15, rear: -6 },
  { label: '±0° 双零', front: 0, rear: 0 },
  { label: '轻微八字', front: 15, rear: -9 },
  { label: '对称八字', front: 15, rear: -15 },
  { label: '不对称八字', front: 18, rear: -9 },
  { label: '一顺角', front: 18, rear: 9 },
];

function formatAngle(angle: number) {
  return `${angle > 0 ? '+' : ''}${angle}°`;
}

function Footprint({ angle, label, side }: { angle: number; label: string; side: 'front' | 'rear' }) {
  return (
    <div
      className={`absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${side === 'front' ? 'left-[69%]' : 'left-[31%]'}`}
      aria-label={`${label} ${angle > 0 ? '+' : ''}${angle} 度`}
    >
      <svg viewBox="0 0 72 144" className="h-[84px] w-[42px] drop-shadow-[0_3px_5px_rgba(24,35,45,0.16)] transition-transform duration-300 ease-out sm:h-[96px] sm:w-[48px]" style={{ transform: `rotate(${angle}deg)` }} role="img" aria-hidden="true">
        <g>
          <path d="M34 8 C24 8 18 15 16 27 L11 59 C9 70 13 82 16 95 L21 125 C23 138 29 143 37 143 C45 143 50 138 52 125 L58 95 C60 82 63 70 60 59 L55 27 C53 15 46 8 39 8 C37 7 35 7 34 8Z" fill="#fbfaf6" stroke="#243746" strokeWidth="2" />
          <path d="M21 57 C27 51 45 51 51 57 L48 78 C42 84 30 84 24 78Z" fill="#dce9ee" stroke="#668093" strokeWidth="1.3" />
          <path d="M25 105 C30 100 42 100 47 105 L44 125 C42 132 30 132 28 125Z" fill="#e8edf0" stroke="#8295a1" strokeWidth="1.2" />
          <path d="M25 89 C30 85 42 85 47 89" fill="none" stroke="#a8b4bb" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="19" r="3.2" fill="#e8f2f5" stroke="#243746" strokeWidth="1.2" />
          <circle cx="27" cy="12" r="3.6" fill="#e8f2f5" stroke="#243746" strokeWidth="1.2" />
          <circle cx="36" cy="9" r="4.1" fill="#e8f2f5" stroke="#243746" strokeWidth="1.2" />
          <circle cx="45" cy="12" r="4.7" fill="#e8f2f5" stroke="#243746" strokeWidth="1.2" />
          <circle cx="52" cy="19" r="5" fill="#e8f2f5" stroke="#243746" strokeWidth="1.2" />
        </g>
      </svg>
      <span className="mt-1 whitespace-nowrap rounded-sm bg-background/90 px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums text-primary sm:text-[11px]">
        {label} {angle > 0 ? '+' : ''}{angle}°
      </span>
    </div>
  );
}

export function SnowboardStanceSimulator() {
  const [frontAngle, setFrontAngle] = useState(15);
  const [rearAngle, setRearAngle] = useState(-6);
  // Angles are relative to the board: positive points toward the nose, negative toward the tail.
  const shownFrontAngle = frontAngle;
  const shownRearAngle = rearAngle;

  return (
    <section id="stance-simulator" aria-labelledby="stance-simulator-title" className="scroll-mt-32 mt-8 border-y border-border bg-secondary/30 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono-label text-primary">站姿角度模拟 · 俯视图</p>
          <h3 id="stance-simulator-title" className="mt-2 text-lg font-medium tracking-tight">转动脚印，看看站姿变化</h3>
        </div>
        <p className="text-xs text-muted-foreground">俯视示意 · 非安装刻度</p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-center lg:gap-8">
        <div className="relative h-[216px] overflow-hidden border border-border/80 bg-[#f4f3ef] sm:h-[252px]" aria-label={`板头朝右，前脚 ${shownFrontAngle} 度，后脚 ${shownRearAngle} 度`}>
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#9aa4aa 0.6px, transparent 0.6px)', backgroundSize: '14px 14px' }} />
          <svg viewBox="0 0 600 160" className="absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2" role="img" aria-label="雪板轮廓与固定器安装孔位">
            <path d="M51 80 C54 50 76 22 112 18 C168 12 222 26 300 30 C378 26 432 12 488 18 C524 22 546 50 549 80 C546 110 524 138 488 142 C432 148 378 134 300 130 C222 134 168 148 112 142 C76 138 54 110 51 80Z" fill="#e7e5dc" stroke="#263d4a" strokeWidth="2.5" />
            <path d="M65 80 C68 54 87 32 117 28 C174 22 226 36 300 39 C374 36 426 22 483 28 C513 32 532 54 535 80 C532 106 513 128 483 132 C426 138 374 124 300 121 C226 124 174 138 117 132 C87 128 68 106 65 80Z" fill="none" stroke="#9aa6a8" strokeWidth="1" />
            <path d="M76 80 H524" stroke="#72838a" strokeWidth="1" strokeDasharray="5 6" opacity="0.55" />
            <path d="M78 80 C81 58 97 38 121 33 M522 80 C519 58 503 38 479 33" fill="none" stroke="#2b55bb" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
            {[174, 426].map((center) => (
              <g key={center} fill="#f4f3ef" stroke="#87969b" strokeWidth="1.5">
                <circle cx={center} cy="64" r="4" />
                <circle cx={center} cy="80" r="4" />
                <circle cx={center} cy="96" r="4" />
              </g>
            ))}
            <text x="300" y="88" textAnchor="middle" fill="#738188" fontSize="8" letterSpacing="2">中心线</text>
          </svg>
          <div className="absolute left-[7%] top-1/2 -translate-y-1/2 rounded-sm bg-[#f4f3ef]/85 px-1.5 py-1 font-mono text-[9px] tracking-[0.16em] text-muted-foreground">板尾</div>
          <div className="absolute right-[6%] top-1/2 -translate-y-1/2 rounded-sm bg-[#f4f3ef]/85 px-1.5 py-1 text-right font-mono text-[9px] tracking-[0.12em] text-primary">板头 →</div>
          <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-sm bg-[#f4f3ef]/90 px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-primary">脚尖侧刃 ↑</div>
          <Footprint angle={shownFrontAngle} label="前脚" side="front" />
          <Footprint angle={shownRearAngle} label="后脚" side="rear" />
        </div>

        <div>
          <div className="flex flex-wrap gap-2" aria-label="常见角度预设">
            {presets.map((preset) => {
              const selected = frontAngle === preset.front && rearAngle === preset.rear;
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setFrontAngle(preset.front);
                    setRearAngle(preset.rear);
                  }}
                  className={`min-h-9 border px-3 text-xs transition-colors ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary hover:text-primary'}`}
                >
                  {preset.front === 0 && preset.rear === 0
                    ? preset.label
                    : `${preset.label} ${formatAngle(preset.front)} / ${formatAngle(preset.rear)}`}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="block text-xs">
              <span className="flex items-center justify-between gap-3"><span>前脚角度</span><strong className="font-mono tabular-nums text-primary">{shownFrontAngle > 0 ? '+' : ''}{shownFrontAngle}°</strong></span>
              <input aria-label="前脚角度" className="mt-2 w-full accent-primary" type="range" min="-42" max="42" step="3" value={shownFrontAngle} onChange={(event) => setFrontAngle(Number(event.target.value))} />
            </label>
            <label className="block text-xs">
              <span className="flex items-center justify-between gap-3"><span>后脚角度</span><strong className="font-mono tabular-nums text-primary">{shownRearAngle > 0 ? '+' : ''}{shownRearAngle}°</strong></span>
              <input aria-label="后脚角度" className="mt-2 w-full accent-primary" type="range" min="-42" max="42" step="3" value={shownRearAngle} onChange={(event) => setRearAngle(Number(event.target.value))} />
            </label>
          </div>

          <p className="mt-4 text-xs leading-5 text-muted-foreground">角度以雪板为参照：正角朝板头，负角朝板尾。图中不区分 Regular / Goofy，前脚和后脚按板头方向标识。新手可从前脚 +15°、后脚 −6° 开始；图示不代表固定器圆盘的实际刻度，安装时请核对固定器刻度和说明。</p>
        </div>
      </div>
    </section>
  );
}
