"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Compass, RotateCcw } from "lucide-react";
import { GearRow } from "@/components/gear/gear-card";
import { ScoreMark } from "@/components/gear/primitives";
import { PageHead } from "@/components/layout/section-head";
import { Button } from "@/components/ui/button";
import { CATEGORIES, SNOWBOARD, getCategory } from "@/data/categories";
import { GEAR } from "@/data/boards";
import { CATALOG_SNAPSHOT } from "@/data/catalog-snapshot";
import { cloudRecommendations } from "@/lib/api";
import { hasHardcoreIndex } from "@/lib/gear-state";
import { recommend, type QuizAnswers, type Recommendation } from "@/lib/domain";
import { saveQuiz } from "@/lib/store";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const LIVE_CATEGORIES = Object.values(CATEGORIES).filter((category) => category.status === "live");

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const categorySlug = getCategory(requestedCategory ?? "")?.status === "live" ? requestedCategory! : "snowboard";
  const category = getCategory(categorySlug) ?? SNOWBOARD;
  const questions = category.quizTemplate;
  const supported = questions.length > 0;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<Recommendation[] | null>(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [resultNotice, setResultNotice] = useState("");
  const requestId = useRef(0);

  useEffect(() => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setValidationMessage("");
    setResultNotice("");
    setBusy(false);
    requestId.current += 1;
    track("recommend_start", { survey: { category: categorySlug } });
  }, [categorySlug]);

  const q = questions[step];
  const progress = questions.length ? Math.round(((step + 1) / questions.length) * 100) : 0;

  const pick = (value: string) => {
    if (!q) return;
    setValidationMessage("");
    let next: QuizAnswers;
    if (q.multi) {
      const cur = (answers[q.key as keyof QuizAnswers] as string[] | undefined) ?? [];
      const list = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
      next = { ...answers, [q.key]: list } as QuizAnswers;
      setAnswers(next);
      // 多选不自动跳题：由「下一题 / 看结果」按钮推进（与题目文案一致）
      return;
    }
    next = { ...answers, [q.key]: value } as QuizAnswers;
    setAnswers(next);

    if (step < questions.length - 1) {
      window.setTimeout(() => setStep((s) => s + 1), 180);
      return;
    }
    finish(next);
  };

  const finish = async (a: QuizAnswers) => {
    if (busy) return;
    if ((a.weightKg && (!/^\d{1,3}(?:\.\d)?$/.test(a.weightKg) || Number(a.weightKg) < 20 || Number(a.weightKg) > 200)) ||
      (a.bootEu && (!/^\d{2}(?:\.\d)?$/.test(a.bootEu) || Number(a.bootEu) < 25 || Number(a.bootEu) > 55))) {
      setValidationMessage('请填写 20–200 kg 的体重和 25–55 的 EU 鞋码，或留空使用体重区间。');
      return;
    }
    const missingIndex = questions.findIndex((question) => !hasQuizAnswer(a[question.key as keyof QuizAnswers]));
    if (missingIndex >= 0) {
      setStep(missingIndex);
      setValidationMessage(`请先完成第 ${missingIndex + 1} 题「${questions[missingIndex]?.question ?? "问卷问题"}」。`);
      return;
    }

    const generation = ++requestId.current;
    setBusy(true);
    setResultNotice("");
    let recs: Recommendation[];
    const controller = new AbortController();
    let timeout: number | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timeout = window.setTimeout(() => { controller.abort(); reject(new Error('请求超时')); }, 20_000);
    });
    try {
      const response = await Promise.race([cloudRecommendations(categorySlug, a as Record<string, unknown>, controller.signal), deadline]);
      recs = response.picks.map((pick) => {
        const snapshot = CATALOG_SNAPSHOT.find((item) => item.slug === pick.slug);
        const gear = GEAR.find((item) => item.id === pick.slug || (snapshot && item.categorySlug === categorySlug &&
          item.model === snapshot.model && item.year === snapshot.year && item.brand.toLowerCase() === snapshot.brand.name.toLowerCase()));
        if (!gear) throw new Error('目录需要更新');
        const fitNote = pick.reasons.find((reason) => reason.startsWith('官方尺码表') || reason.startsWith('尺码适配待核'));
        return { gear, match: pick.match, fallback: pick.fallback, fitNote,
          reasons: pick.reasons.filter((reason) => reason !== fitNote) };
      });
    } catch {
      recs = recommend(a, categorySlug);
      if (generation === requestId.current) setResultNotice('暂时无法获取线上推荐，以下为本地预览，未确认同步至账号；恢复连接后请重测。');
    } finally {
      window.clearTimeout(timeout);
      if (generation === requestId.current) setBusy(false);
    }
    if (generation !== requestId.current) return;
    setResult(recs);
    track("recommend_complete", {
      survey: a as Record<string, unknown>,
      result_ids: recs.map((r) => r.gear.id),
      fallback: recs.some((r) => r.fallback),
    });
    saveQuiz({
      categorySlug,
      answers: a as Record<string, string | string[]>,
      picks: recs.map((r) => ({ gearId: r.gear.id, match: r.match, reasons: r.reasons, fallback: r.fallback })),
    });
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setValidationMessage("");
    setResultNotice("");
    requestId.current += 1;
  };

  const selected = (value: string) => {
    if (!q) return false;
    const cur = answers[q.key as keyof QuizAnswers];
    return Array.isArray(cur) ? cur.includes(value) : cur === value;
  };

  const selectCategory = (slug: string) => {
    router.replace(slug === "snowboard" ? "/quiz" : `/quiz?category=${encodeURIComponent(slug)}`);
  };

  if (!supported) {
    return (
      <div className="mx-auto max-w-[820px] px-5 py-10 sm:px-8">
        <PageHead
          kicker="RECOMMENDATION QUIZ"
          title={`${category.name}选装备问卷`}
          titleEn="Find Your Gear"
          desc="问卷需要先建立对应品类的评分维度和推荐规则，当前不使用单板问题套用到其他装备。"
        />
        <CategorySwitch categorySlug={categorySlug} onChange={selectCategory} />
        <div className="mt-10 border border-dashed border-border py-20 text-center">
          <p className="text-[15px] font-medium">{category.name}问卷待补充</p>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            当前已有单板问卷。{category.name}的使用场景、关键参数和推荐权重整理完成后，再开放独立问卷。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href={`/browse/${categorySlug}`} className="mono-label bg-foreground px-5 py-3 text-background hover:bg-primary">
              先看{category.name}档案
            </Link>
            <button type="button" onClick={() => selectCategory("snowboard")} className="mono-label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background">
              做单板问卷
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (busy) return <div className="mx-auto max-w-[820px] px-5 py-16" role="status">正在核对尺码资料并生成推荐……</div>;

  if (result) {
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
        <PageHead
          kicker="RECOMMENDATION RESULT"
          title={result.length ? "适合继续比较的单板" : "暂未找到符合尺码条件的单板"}
          titleEn="Your Shortlist"
          desc="排序综合使用场景、硬度偏好、水平与官方尺码资料。相对推荐分用于比较候选，不代表适配概率；待核人民币价格不参与预算和性价比计分。"
          aside={
            <Button variant="outline" onClick={reset} className="mono-label h-9 gap-1.5 rounded-none border-border px-4 text-[12px]">
              <RotateCcw size={13} strokeWidth={1.6} /> 重测一次
            </Button>
          }
        />

        {resultNotice ? <p role="status" className="mt-4 border border-border px-4 py-3 text-[13px]">{resultNotice}</p> : null}

        {(answers.weightKg || answers.bootEu) ? <p className="mt-4 text-[13px] text-muted-foreground">
          尺码条件：{answers.weightKg ? `${answers.weightKg} kg` : '所选体重区间'}{answers.bootEu ? ` · EU ${answers.bootEu}` : ''}。优先列出官方表可核对的候选，资料不足的型号会明确标为待核。
        </p> : null}

        <div className="mt-10 space-y-6">
          {result.map((r, i) => (
            <article key={r.gear.id} className={cn("border p-5 sm:p-7", i === 0 ? "border-foreground" : "border-border")}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  <span className={cn("mono-data text-[40px] leading-none tnum", i === 0 ? "text-primary" : "text-muted-foreground/40")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="mono-label">
                      {r.gear.brand} · {r.gear.year}
                    </p>
                    <h2 className="mt-1 text-[24px] leading-none font-medium tracking-tight">{r.gear.model}</h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mono-data text-[34px] leading-none text-primary tnum">{r.match}</p>
                  <p className="mono-label mt-1.5">相对推荐分</p>
                </div>
              </div>

              <div className="mt-4 h-[5px] bg-border">
                <span className="animate-bar-grow block h-full bg-primary" style={{ width: `${r.match}%` }} />
              </div>

              <ul className="mt-5 grid gap-2 sm:grid-cols-3">
                {r.reasons.length ? (
                  r.reasons.map((reason) => (
                    <li key={reason} className="border-l-2 border-primary bg-accent/40 px-3 py-2 text-[12.5px] leading-relaxed">
                      {reason}
                    </li>
                  ))
                ) : (
                  <li className="border-l-2 border-border px-3 py-2 text-[12.5px] text-muted-foreground">
                    当前资料不足以给出明确的匹配理由，请继续核对产品参数。
                  </li>
                )}
              </ul>

              <p className="mt-4 border-t border-border pt-4 text-[13px] leading-relaxed">{r.fitNote}</p>

              {r.fallback ? (
                <p className="mono-label mt-4 border border-dashed border-border px-3 py-2 text-muted-foreground">
                  提示：这件装备与部分偏好不符，请结合尺码资料和使用场景继续比较。
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <ScoreMark value={r.gear.composite} size="sm" />
                <span className="mono-label">{hasHardcoreIndex(r.gear) ? `进阶指数 ${r.gear.hardcore}` : '进阶指数待补'}</span>
                <span className="mono-label">硬度 {r.gear.flexValue}/10</span>
                <div className="flex-1" />
                <Link
                  href={`/gear/${r.gear.id}`}
                  className="mono-label flex items-center gap-1.5 border border-foreground px-4 py-2 hover:bg-foreground hover:text-background"
                >
                  查看完整档案 <ArrowRight size={13} strokeWidth={1.6} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-12">
          <p className="mono-label mb-3">你的作答 / ANSWERS</p>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {questions.map((qq) => {
              const v = answers[qq.key as keyof QuizAnswers];
              const label = Array.isArray(v)
                ? v.map((x) => qq.options.find((o) => o.value === x)?.label ?? x).join("、")
                : (qq.options.find((o) => o.value === v)?.label ?? "未作答");
              return (
                <div key={qq.key} className="bg-background p-4">
                  <p className="mono-label">{qq.question}</p>
                  <p className="mt-1.5 text-[13.5px] font-medium">{label || "未作答"}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <p className="mono-label mb-2">也可以直接横向拉表</p>
          <div className="border border-border">
            {result.map((r) => (
              <GearRow key={r.gear.id} gear={r.gear} note={`相对推荐分 ${r.match} · ${r.reasons[0] ?? "匹配理由待补"}`} from="recommend" />
            ))}
          </div>
          <Link href="/compare" className="mono-label mt-4 inline-block bg-foreground px-5 py-3 text-background hover:bg-primary">
            去对比坞横向比较
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[820px] px-5 py-10 sm:px-8">
      <PageHead
        kicker="RECOMMENDATION QUIZ"
        title={`${category.name}选装备问卷`}
        titleEn="Find Your Gear"
        desc={`${questions.length} 个问题，可选填写实际体重和雪鞋 EU 尺码。作答保存在当前浏览器；登录后会同步至账号。`}
      />

      <CategorySwitch categorySlug={categorySlug} onChange={selectCategory} />

      <section className="mt-6 border-b border-border pb-6">
        <p className="mono-label mb-3">尺码条件 / 可选，优先于体重区间</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-[13px]">实际体重（kg）
            <input type="number" min="20" max="200" step="0.1" value={answers.weightKg ?? ""}
              onChange={(event) => setAnswers((current) => ({ ...current, weightKg: event.target.value }))}
              className="mt-2 block w-full border border-border bg-background px-3 py-2" placeholder="例如 72" />
          </label>
          <label className="text-[13px]">雪鞋 EU 尺码
            <input type="number" min="25" max="55" step="0.1" value={answers.bootEu ?? ""}
              onChange={(event) => setAnswers((current) => ({ ...current, bootEu: event.target.value }))}
              className="mt-2 block w-full border border-border bg-background px-3 py-2" placeholder="以雪鞋标签为准，例如 42.5" />
          </label>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">仅按官方表中的 kg / EU 范围核对。没有明确单位的资料保留为待核，不将日常鞋码换算成雪鞋外长。</p>
      </section>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="mono-label">
            问题 {String(step + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
          </p>
          <p className="mono-data text-[12px] text-muted-foreground tnum">{progress}%</p>
        </div>
        <div className="mt-2 h-[3px] bg-border">
          <span
            className="block h-full bg-foreground transition-all duration-500"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
        {validationMessage ? (
          <p role="alert" className="mono-label mt-3 border border-destructive/50 px-3 py-2 text-destructive">
            {validationMessage}
          </p>
        ) : null}
      </div>

      <div className="mt-10 border border-foreground p-6 sm:p-9">
        <div className="flex items-start gap-4">
          <Compass size={22} strokeWidth={1.3} className="mt-1 shrink-0 text-primary" />
          <div>
            <h2 className="text-[26px] leading-tight font-medium tracking-tight sm:text-[30px]">{q?.question}</h2>
            {q?.hint ? <p className="mono-label mt-2">{q.hint}</p> : null}
            {q?.multi ? <p className="mono-label mt-1 text-primary">可多选，选完点下方「下一题」</p> : null}
          </div>
        </div>

        <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
          {q?.options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => pick(o.value)}
              aria-pressed={selected(o.value)}
              className={cn(
                "group flex items-start gap-3 border p-4 text-left transition-colors",
                selected(o.value) ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
              )}
            >
              <span className={cn("mono-data mt-[2px] shrink-0 text-[12px] tnum", selected(o.value) ? "text-background/60" : "text-muted-foreground")}>
                {String(q.options.indexOf(o) + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-medium">{o.label}</span>
                {o.desc ? (
                  <span className={cn("mt-1 block text-[12px] leading-relaxed", selected(o.value) ? "text-background/70" : "text-muted-foreground")}>
                    {o.desc}
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="mono-label h-8 gap-1.5 rounded-none px-3 text-[12px] disabled:opacity-30"
          >
            <ArrowLeft size={13} strokeWidth={1.6} /> 上一题
          </Button>

          <div className="flex items-center gap-2">
            {q?.multi ? (
              <Button
                onClick={() => (step < questions.length - 1 ? setStep((s) => s + 1) : finish(answers))}
                disabled={((answers[q.key as keyof QuizAnswers] as string[] | undefined) ?? []).length === 0}
                className="mono-label h-9 gap-1.5 rounded-none bg-foreground px-5 text-[12px] hover:bg-primary disabled:opacity-30"
              >
                {step < questions.length - 1 ? "下一题" : "看结果"} <ArrowRight size={13} strokeWidth={1.6} />
              </Button>
            ) : (
              <span className="mono-label text-muted-foreground">点选一项自动进入下一题</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {questions.map((qq, i) => (
          <button
            key={qq.key}
            type="button"
            onClick={() => setStep(i)}
            aria-label={`跳到第 ${i + 1} 题`}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "mono-data h-7 w-7 border text-[12px] transition-colors tnum",
              i === step
                ? "border-foreground bg-foreground text-background"
                : answers[qq.key as keyof QuizAnswers]
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-foreground",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <p className="mono-label mt-8 border-t border-border pt-4">
        问卷结果会存入个人中心的「我的问卷」，登录后可随时回看。
        <Link href="/auth" className="story-link ml-1 text-primary">
          去登录
        </Link>
      </p>
    </div>
  );
}

function hasQuizAnswer(value: QuizAnswers[keyof QuizAnswers] | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

function CategorySwitch({ categorySlug, onChange }: { categorySlug: string; onChange: (slug: string) => void }) {
  return (
    <div className="thin-scroll mt-8 flex items-center gap-1.5 overflow-x-auto border-b border-foreground pb-3">
      <span className="mono-label mr-1 shrink-0 text-muted-foreground">品类</span>
      {LIVE_CATEGORIES.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() => onChange(category.slug)}
          className={cn(
            "mono-label shrink-0 border px-3.5 py-2 transition-colors",
            categorySlug === category.slug ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
