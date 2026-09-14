"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Compass, RotateCcw } from "lucide-react";
import { GearRow } from "@/components/gear/gear-card";
import { ScoreMark } from "@/components/gear/primitives";
import { PageHead } from "@/components/layout/section-head";
import { Button } from "@/components/ui/button";
import { SNOWBOARD } from "@/data/categories";
import { recommend, type QuizAnswers, type Recommendation } from "@/lib/domain";
import { saveQuiz } from "@/lib/store";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const QUESTIONS = SNOWBOARD.quizTemplate;

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<Recommendation[] | null>(null);

  useEffect(() => {
    track("recommend_start", { survey: {} });
  }, []);

  const q = QUESTIONS[step];
  const progress = Math.round((step / QUESTIONS.length) * 100);

  const pick = (value: string) => {
    if (!q) return;
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

    if (step < QUESTIONS.length - 1) {
      window.setTimeout(() => setStep((s) => s + 1), 180);
      return;
    }
    finish(next);
  };

  const finish = (a: QuizAnswers) => {
    const recs = recommend(a);
    setResult(recs);
    track("recommend_complete", {
      survey: a as Record<string, unknown>,
      result_ids: recs.map((r) => r.gear.id),
      fallback: recs.some((r) => r.fallback),
    });
    saveQuiz({
      categorySlug: "snowboard",
      answers: a as Record<string, string | string[]>,
      picks: recs.map((r) => ({ gearId: r.gear.id, match: r.match, reasons: r.reasons, fallback: r.fallback })),
    });
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const selected = (value: string) => {
    if (!q) return false;
    const cur = answers[q.key as keyof QuizAnswers];
    return Array.isArray(cur) ? cur.includes(value) : cur === value;
  };

  if (result) {
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
        <PageHead
          kicker="RECOMMENDATION RESULT"
          title="为你匹配的三件装备"
          titleEn="Your Shortlist"
          desc="匹配度由场景命中、预算区间、体重对应板长、硬度偏好、水平适配与优先项加权得出，下方逐条列出计分理由。"
          aside={
            <Button variant="outline" onClick={reset} className="mono-label h-9 gap-1.5 rounded-none border-border px-4 text-[12px]">
              <RotateCcw size={13} strokeWidth={1.6} /> 重测一次
            </Button>
          }
        />

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
                  <p className="mono-data text-[34px] leading-none text-primary tnum">{r.match}%</p>
                  <p className="mono-label mt-1.5">匹配度</p>
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
                    没有明显短板，属于「什么都不差」的稳妥选择。
                  </li>
                )}
              </ul>

              {r.fallback ? (
                <p className="mono-label mt-4 border border-dashed border-border px-3 py-2 text-muted-foreground">
                  提示：按你给出的条件，这件装备是妥协解。放宽预算或场景后会有更贴合的选择。
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <ScoreMark value={r.gear.composite} size="sm" />
                <span className="mono-label">进阶指数 {r.gear.hardcore}</span>
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
            {QUESTIONS.map((qq) => {
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
              <GearRow key={r.gear.id} gear={r.gear} note={`匹配度 ${r.match}% · ${r.reasons[0] ?? "稳妥选择"}`} from="recommend" />
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
        title="60 秒选装备问卷"
        titleEn="Find Your Gear"
        desc={`${QUESTIONS.length} 个问题，不收集任何个人信息。`}
      />

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="mono-label">
            问题 {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
          </p>
          <p className="mono-data text-[12px] text-muted-foreground tnum">{progress}%</p>
        </div>
        <div className="mt-2 h-[3px] bg-border">
          <span
            className="block h-full bg-foreground transition-all duration-500"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
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
                onClick={() => (step < QUESTIONS.length - 1 ? setStep((s) => s + 1) : finish(answers))}
                disabled={((answers[q.key as keyof QuizAnswers] as string[] | undefined) ?? []).length === 0}
                className="mono-label h-9 gap-1.5 rounded-none bg-foreground px-5 text-[12px] hover:bg-primary disabled:opacity-30"
              >
                {step < QUESTIONS.length - 1 ? "下一题" : "看结果"} <ArrowRight size={13} strokeWidth={1.6} />
              </Button>
            ) : (
              <span className="mono-label text-muted-foreground">点选一项自动进入下一题</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {QUESTIONS.map((qq, i) => (
          <button
            key={qq.key}
            type="button"
            onClick={() => setStep(i)}
            aria-label={`跳到第 ${i + 1} 题`}
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
