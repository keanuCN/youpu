"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Camera, CornerDownRight, Flag, MessageSquare, ThumbsUp, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewCount, userRating } from "@/data/boards";
import {
  cloudCreateRating,
  cloudCreateReply,
  cloudCreateReport,
  cloudUploadRatingImages,
  cloudDeleteRating,
  cloudRatings,
  cloudToggleHelpful,
  hasCloudSession,
  productRefForGear,
  type CloudRating,
  type CloudRatingsResponse,
} from "@/lib/api";
import { helpfulOf, iHelpful, repliesOf, topLevelReviews } from "@/lib/domain";
import { timeAgo } from "@/lib/format";
import { addReview, deleteReview, pushNotification, toggleHelpful, useCurrentUser, usePersisted, type Persisted } from "@/lib/store";
import { track } from "@/lib/track";
import { hasUserRating } from "@/lib/gear-state";
import { LoadingStatus } from "@/components/gear/data-state";
import { cn } from "@/lib/utils";
import type { GearItem, Review, ReviewerMeta } from "@/types";
import { useAuthGate } from "@/store/app-shell";
import { Stars } from "./primitives";
import { SafeImage } from "./safe-image";

type ReviewCopy = {
  experienceLabel: string;
  levelLabel: string;
  summary: string;
  placeLabel: string;
  placePlaceholder: string;
  contentPlaceholder: string;
  showHeight: boolean;
  showWeight: boolean;
};

const DEFAULT_REVIEW_COPY: ReviewCopy = {
  experienceLabel: "使用年限",
  levelLabel: "水平",
  summary: "使用年限 / 水平 / 场地",
  placeLabel: "常用场地",
  placePlaceholder: "如 城市公园 / 湖库",
  contentPlaceholder: "在哪些场景、使用了多久？它哪里超出预期，哪里让你后悔？",
  showHeight: false,
  showWeight: false,
};

const REVIEW_COPY: Record<string, ReviewCopy> = {
  snowboard: {
    experienceLabel: "雪龄",
    levelLabel: "滑行水平",
    summary: "雪龄 / 体重 / 水平 / 场地",
    placeLabel: "常滑场地",
    placePlaceholder: "如 崇礼 · 万龙",
    contentPlaceholder: "在什么雪况、什么速度、滑了几天？它哪里超出预期，哪里让你后悔？",
    showHeight: true,
    showWeight: true,
  },
  "badminton-racket": {
    experienceLabel: "球龄",
    levelLabel: "打法水平",
    summary: "球龄 / 体重 / 打法 / 场馆",
    placeLabel: "常打场馆",
    placePlaceholder: "如 北京 · 室内木地板",
    contentPlaceholder: "在什么场馆、采用什么打法、打了多久？它哪里超出预期，哪里让你后悔？",
    showHeight: true,
    showWeight: true,
  },
  "casting-rod": {
    experienceLabel: "钓龄",
    levelLabel: "钓法水平",
    summary: "钓龄 / 水域 / 钓法",
    placeLabel: "常钓水域",
    placePlaceholder: "如 湖库 · 溪流",
    contentPlaceholder: "在什么水域、使用什么饵和钓法、钓了多久？它哪里超出预期，哪里让你后悔？",
    showHeight: false,
    showWeight: false,
  },
  "action-cam": {
    experienceLabel: "拍摄年限",
    levelLabel: "拍摄水平",
    summary: "拍摄年限 / 场景 / 设备",
    placeLabel: "常用场景",
    placePlaceholder: "如 骑行 / 滑雪 / 潜水",
    contentPlaceholder: "在哪些运动或旅行场景使用了多久？画质、防抖、续航哪里超出预期，哪里让你后悔？",
    showHeight: false,
    showWeight: false,
  },
  "road-bike": {
    experienceLabel: "骑行年限",
    levelLabel: "骑行水平",
    summary: "骑行年限 / 路线 / 车型",
    placeLabel: "常骑路线",
    placePlaceholder: "如 城市绕圈 / 山路爬坡 / 长途",
    contentPlaceholder: "在什么路线、骑了多久？舒适性、爬坡、操控和维护成本哪里超出预期，哪里让你后悔？",
    showHeight: true,
    showWeight: true,
  },
  mtb: {
    experienceLabel: "骑行年限",
    levelLabel: "骑行水平",
    summary: "骑行年限 / 路线 / 车型",
    placeLabel: "常骑路线",
    placePlaceholder: "如 林道 / XC 赛道 / Bike Park",
    contentPlaceholder: "在什么路线、骑了多久？爬坡、悬挂、下坡操控和维护成本哪里超出预期，哪里让你后悔？",
    showHeight: true,
    showWeight: true,
  },
};

function reviewCopyForCategory(categorySlug: string): ReviewCopy {
  return REVIEW_COPY[categorySlug] ?? DEFAULT_REVIEW_COPY;
}

export function ReviewPanel({
  gear,
  onSummaryChange,
}: {
  gear: GearItem;
  onSummaryChange?: (summary: CloudRatingsResponse["summary"] | null) => void;
}) {
  const copy = reviewCopyForCategory(gear.categorySlug);
  const persisted = usePersisted();
  const [mode, setMode] = useState<"helpful" | "latest">("helpful");
  const [remoteRatings, setRemoteRatings] = useState<CloudRating[]>([]);
  const [remoteSummary, setRemoteSummary] = useState<CloudRatingsResponse["summary"] | null>(null);
  const [ratingLoading, setRatingLoading] = useState(true);
  const productRef = productRefForGear(gear);
  useEffect(() => {
    let alive = true;
    setRatingLoading(true);
    setRemoteRatings([]);
    setRemoteSummary(null);
    onSummaryChange?.(null);
    cloudRatings(productRef, mode)
      .then((response) => {
        if (!alive) return;
        setRemoteRatings(response.items);
        setRemoteSummary(response.summary);
        onSummaryChange?.(response.summary);
        setRatingLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setRemoteRatings([]);
        setRemoteSummary(null);
        onSummaryChange?.(null);
        setRatingLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [onSummaryChange, productRef, mode]);
  const remoteIds = useMemo(() => new Set(remoteRatings.map((rating) => rating.id)), [remoteRatings]);
  const viewState = useMemo(() => mergeCloudRatings(persisted, gear.id, remoteRatings), [persisted, gear.id, remoteRatings]);
  const list = useMemo(() => topLevelReviews(viewState, gear.id, mode), [viewState, gear.id, mode]);
  const localSummary = {
    overall: hasUserRating(gear) ? userRating(gear) : null,
    count: reviewCount(gear),
    distribution: gear.ratingDist,
  };
  const summary = remoteSummary && (remoteSummary.count > 0 || remoteRatings.length > 0) ? remoteSummary : localSummary;
  const ratingReady = summary.overall !== null && (summary.count > 0 || remoteRatings.length > 0);
  const avg = summary.overall ?? 0;

  return (
    <section className="space-y-8">
      <div className="grid gap-8 border border-border p-5 lg:grid-cols-[240px_1fr]">
        <div>
          <p className="mono-data text-[52px] leading-none tnum">{ratingReady ? summary.overall!.toFixed(1) : "—"}</p>
          {ratingReady ? <Stars value={avg} size={14} className="mt-2" /> : <p className="mono-label mt-2">暂无评分</p>}
          <p className="mono-label mt-2">{ratingReady ? `${summary.count} 条实测评分` : "等待首批实测"}</p>
        </div>
        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const key = String(star) as "1" | "2" | "3" | "4" | "5";
            const n = summary.distribution[key] ?? 0;
            const p = summary.count ? Math.round((n / summary.count) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="mono-data w-6 shrink-0 text-[12px] text-muted-foreground tnum">{star}★</span>
                <span className="h-[6px] flex-1 bg-border">
                  <span
                    className="animate-bar-grow block h-full bg-foreground"
                    style={{ width: `${p}%`, animationDelay: `${(5 - star) * 70}ms` }}
                  />
                </span>
                <span className="mono-data w-10 shrink-0 text-right text-[12px] text-muted-foreground tnum">{p}%</span>
              </div>
            );
          })}
          <p className="mono-label pt-2">评分来自标注了{copy.summary}的实测用户</p>
          {ratingLoading ? <LoadingStatus label="正在读取最新实测数据" className="pt-1" /> : null}
        </div>
      </div>

      <ReviewForm gear={gear} />

      <div>
        <div className="rule-heavy mb-4 flex items-center justify-between gap-3 pb-2.5">
          <p className="mono-label">实测评论 · {list.length} 条主楼</p>
          <div className="flex gap-1">
            {(["helpful", "latest"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "mono-label border px-2.5 py-1 transition-colors",
                  mode === m ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
                )}
              >
                {m === "helpful" ? "最有帮助" : "最新"}
              </button>
            ))}
          </div>
        </div>

        {list.length ? (
          <ul className="space-y-0">
            {list.map((r) => (
              <ReviewItem key={r.id} review={r} gear={gear} copy={copy} persisted={viewState} isCloudReview={remoteIds.has(r.id)} />
            ))}
          </ul>
        ) : (
          <p className="border border-dashed border-border py-12 text-center text-[13px] text-muted-foreground">
            还没有实测评论，来做第一个。
          </p>
        )}
      </div>
    </section>
  );
}

function ReviewItem({ review, gear, copy, persisted, isCloudReview }: { review: Review; gear: GearItem; copy: ReviewCopy; persisted: Persisted; isCloudReview: boolean }) {
  const { requireAuth } = useAuthGate();
  const me = useCurrentUser();
  const [replying, setReplying] = useState(false);
  const profile = me.profile;
  const replies = repliesOf(persisted, review.id);
  const helpful = helpfulOf(persisted, review);
  const mine = iHelpful(persisted, review);
  const cloudProfile = profile as (typeof profile & { remoteId?: string }) | null;
  const isMine = !!profile && (review.userKey === profile.userKey || review.userKey === cloudProfile?.remoteId);

  const onHelpful = () => {
    requireAuth(() => {
      const added = toggleHelpful(review.id);
      if (isCloudReview && hasCloudSession()) {
        void cloudToggleHelpful(review.id)
          .then((result) => {
            if (result.helpful !== added) toggleHelpful(review.id);
          })
          .catch(() => {
            toggleHelpful(review.id);
            toast.error("云端有帮助状态同步失败");
          });
      }
      if (added && review.userKey && review.userKey !== profile?.userKey) {
        pushNotification({
          userKey: review.userKey,
          type: "helpful",
          title: "你的评论被标记为有帮助",
          body: `${profile?.username ?? "有人"} 觉得你对 ${gear.model} 的评价有帮助`,
          link: `/gear/${gear.id}`,
        });
      }
    }, "标记有帮助需要先登录");
  };

  return (
    <li className="border-b border-border py-5">
      <article className="flex gap-3.5">
        <Avatar seed={review.authorName} name={review.authorName} size={34} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="text-[13.5px] font-medium">{review.authorName}</span>
            <Stars value={review.rating} size={11} />
            <span className="mono-label">{timeAgo(review.createdAt)}</span>
            {isMine ? <span className="mono-label bg-primary px-1.5 py-[2px] text-primary-foreground">我的</span> : null}
          </div>
          <ReviewerMetaLine meta={review.authorMeta} copy={copy} />
          <p className="mt-2.5 text-[13.5px] leading-[1.75] whitespace-pre-line">{review.content}</p>

          {review.images.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.images.map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noreferrer" className="block h-20 w-20 overflow-hidden border border-border">
                  <SafeImage
                    src={u}
                    alt=""
                    loading="lazy"
                    fallbackLabel="评论图片"
                    fallbackMode="muted"
                    className="plate h-full w-full object-cover"
                  />
                </a>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onHelpful}
              className={cn(
                "mono-label flex items-center gap-1.5 border px-2 py-1 transition-colors",
                mine ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground",
              )}
            >
              <ThumbsUp size={11} strokeWidth={1.8} className={mine ? "fill-current" : undefined} />
              有帮助 {helpful}
            </button>
            <button
              type="button"
              onClick={() => requireAuth(() => setReplying((v) => !v), "回复评论需要先登录")}
              className="mono-label flex items-center gap-1.5 border border-border px-2 py-1 transition-colors hover:border-foreground"
            >
              <MessageSquare size={11} strokeWidth={1.8} />
              回复
            </button>
            {isMine ? (
              <button
                type="button"
                onClick={() => {
                  if (isCloudReview && hasCloudSession()) {
                    void cloudDeleteRating(review.id)
                      .then(() => {
                        deleteReview(review.id);
                        toast("评论已删除");
                      })
                      .catch((error) => toast.error(error instanceof Error ? error.message : "删除失败"));
                  } else {
                    deleteReview(review.id);
                    toast("评论已删除");
                  }
                }}
                className="mono-label flex items-center gap-1.5 px-2 py-1 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 size={11} strokeWidth={1.8} />
                删除
              </button>
            ) : null}
            {!isMine ? (
              <button
                type="button"
                onClick={() => requireAuth(() => {
                  if (!hasCloudSession()) {
                    toast("当前是本机演示账号，举报需要连接本地 API");
                    return;
                  }
                  void cloudCreateReport("rating", review.id, "内容不当或不准确")
                    .then(() => toast.success("已提交举报，后台会进行处理"))
                    .catch((error) => toast.error(error instanceof Error ? error.message : "举报失败"));
                }, "举报内容需要先登录")}
                className="mono-label flex items-center gap-1.5 px-2 py-1 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Flag size={11} strokeWidth={1.8} />
                举报
              </button>
            ) : null}
          </div>

          {replying ? <ReplyForm gear={gear} parentId={review.id} cloudParent={isCloudReview} onDone={() => setReplying(false)} /> : null}

          {replies.length ? (
            <ul className="mt-4 space-y-3 border-l border-border pl-4">
              {replies.map((r) => (
                <li key={r.id} className="flex gap-2.5">
                  <CornerDownRight size={13} strokeWidth={1.6} className="mt-1 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[12.5px] font-medium">{r.authorName}</span>
                      <span className="mono-label">{timeAgo(r.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed">{r.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </li>
  );
}

function ReviewerMetaLine({ meta, copy }: { meta: ReviewerMeta; copy: ReviewCopy }) {
  const parts = [
    `${meta.years} 年${copy.experienceLabel}`,
    copy.showHeight && meta.heightCm ? `${meta.heightCm}cm` : null,
    copy.showWeight && meta.weightKg ? `${meta.weightKg}kg` : null,
    meta.level,
    meta.resort,
  ].filter(Boolean) as string[];
  return <p className="mono-label mt-1.5">{parts.join(" · ")}</p>;
}

function ReplyForm({ gear, parentId, cloudParent, onDone }: { gear: GearItem; parentId: string; cloudParent: boolean; onDone: () => void }) {
  const [text, setText] = useState("");
  const me = useCurrentUser();
  const profile = me.profile;
  const submit = async () => {
    if (text.trim().length < 2) {
      toast.error("回复内容太短");
      return;
    }
    if (cloudParent && hasCloudSession()) {
      try {
        await cloudCreateReply(parentId, text.trim());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "回复发布失败");
        return;
      }
    }
    addReview({
      gearId: gear.id,
      rating: 5,
      content: text.trim(),
      images: [],
      authorName: profile?.username ?? "匿名",
      authorMeta: profile
        ? { years: profile.years, heightCm: profile.heightCm, weightKg: profile.weightKg, level: profile.level, resort: profile.resort }
        : { years: 1, heightCm: 0, level: "中级", resort: "" },
      parentId,
    });
    track("reply_submit", { rating_id: parentId });
    toast.success("回复已发布");
    setText("");
    onDone();
  };
  return (
    <div className="mt-3 border border-border p-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="补充你的使用条件或不同意见…"
        className="min-h-16 resize-y rounded-none border-border text-[13px]"
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onDone} className="h-7 rounded-none text-[12px]">
          取消
        </Button>
        <Button size="sm" onClick={submit} className="h-7 rounded-none bg-foreground text-[12px] hover:bg-primary">
          发布回复
        </Button>
      </div>
    </div>
  );
}

function ReviewForm({ gear }: { gear: GearItem }) {
  const copy = reviewCopyForCategory(gear.categorySlug);
  const { requireAuth } = useAuthGate();
  const me = useCurrentUser();
  const profile = me.profile;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const profileMeta = [
    profile ? `${profile.years} 年${copy.experienceLabel}` : null,
    copy.showHeight && profile?.heightCm ? `${profile.heightCm}cm` : null,
    copy.showWeight && profile?.weightKg ? `${profile.weightKg}kg` : null,
    profile?.level,
    profile?.resort,
  ].filter(Boolean);

  const submit = async () => {
    if (uploading) return;
    if (!rating) {
      toast.error("请先打分");
      return;
    }
    if (content.trim().length < 10) {
      toast.error("实测内容至少 10 个字，写清你的使用条件");
      return;
    }
    setUploading(true);
    let imageUrls: string[] = [];
    if (files.length && !hasCloudSession()) {
      toast.error("上传实测照片需要先登录并连接账号服务");
      setUploading(false);
      return;
    }
    if (hasCloudSession()) {
      try {
        imageUrls = await cloudUploadRatingImages(files);
        const riderProfile: Record<string, unknown> = {
          years: Number(profile?.years) || 1,
          level: levelToApi(profile?.level ?? "中级"),
          home_resort: profile?.resort.trim() || undefined,
        };
        if (copy.showHeight) riderProfile.height = profile?.heightCm ?? 175;
        if (copy.showWeight) riderProfile.weight = Number(profile?.weightKg) || 70;
        await cloudCreateRating(productRefForGear(gear), {
          overall: rating,
          content: content.trim(),
          images: imageUrls,
          riderProfile,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "评论发布失败");
        setUploading(false);
        return;
      }
    }
    addReview({
      gearId: gear.id,
      rating,
      content: content.trim(),
      images: imageUrls,
      authorName: profile?.username ?? "匿名档案员",
      authorMeta: {
        years: Number(profile?.years) || 1,
        heightCm: copy.showHeight ? profile?.heightCm ?? 175 : 0,
        weightKg: copy.showWeight ? Number(profile?.weightKg) || undefined : undefined,
        level: profile?.level ?? "中级",
        resort: profile?.resort.trim() ?? "",
      },
    });
    track("rating_submit", { product_id: gear.id });
    toast.success("实测评论已发布");
    setRating(0);
    setContent("");
    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="border border-foreground">
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2.5">
        <p className="mono-label">写下你的实测 / FIELD REPORT</p>
        <Link href="/me" className="mono-label text-primary hover:underline">使用条件来自个人档案 · 编辑</Link>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i} 星`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => requireAuth(() => setRating(i), "发布评论需要先登录")}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <StarIcon filled={i <= (hover || rating)} />
              </button>
            ))}
          </div>
          <span className="mono-data text-[12px] text-muted-foreground tnum">
            {rating ? `${rating}.0 / 5` : "未打分"}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border py-3">
          <p className="mono-label text-muted-foreground">
            本次使用条件：{profileMeta.length ? profileMeta.join(" · ") : "请先完善个人档案"}
          </p>
          <Link href="/me" className="mono-label text-primary hover:underline">前往个人信息中心</Link>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder={copy.contentPlaceholder}
          className="min-h-24 resize-y rounded-none border-border text-[13px] leading-relaxed"
        />

        <div className="space-y-2">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 border border-border px-3 text-[12px] transition-colors hover:border-foreground">
            <Camera size={14} />
            上传实测照片（最多 5 张）
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => {
                const selected = Array.from(event.currentTarget.files ?? []);
                const valid = selected.filter((file) => {
                  if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
                    toast.error(`${file.name} 格式不支持，请选择 JPEG、PNG 或 WebP`);
                    return false;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error(`${file.name} 超过 10 MB`);
                    return false;
                  }
                  return true;
                });
                setFiles((current) => [...current, ...valid].slice(0, 5));
                if (files.length + valid.length > 5) toast.error("每条实测最多上传 5 张照片");
                event.currentTarget.value = "";
              }}
            />
          </label>
          {previews.length ? (
            <div className="flex flex-wrap gap-2">
              {previews.map((url, index) => (
                <div key={`${files[index]?.name}-${index}`} className="relative h-20 w-20 border border-border">
                  <img src={url} alt={`实测照片 ${index + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label={`移除第 ${index + 1} 张照片`}
                    onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    className="absolute right-0 top-0 bg-foreground p-1 text-background"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <p className="mono-label text-muted-foreground">
            已选 {files.length}/5 张 · 单张不超过 10 MB；支持 JPEG、PNG、WebP。需登录并连接账号服务，照片会自动压缩后保存。
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label">{content.trim().length} / 10 字起</p>
          <Button
            disabled={uploading}
            onClick={() => requireAuth(() => void submit(), "发布评论需要先登录")}
            className="h-9 rounded-none bg-foreground px-6 text-[12.5px] tracking-wide hover:bg-primary"
          >
            {uploading ? "正在上传…" : "发布实测"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3.05-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z"
        fill={filled ? "var(--color-primary)" : "none"}
        stroke={filled ? "var(--color-primary)" : "var(--color-input)"}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function levelToApi(level: string): "beginner" | "intermediate" | "advanced" | "expert" {
  if (level === "新手") return "beginner";
  if (level === "进阶") return "advanced";
  if (level === "高阶") return "expert";
  return "intermediate";
}

function mergeCloudRatings(base: Persisted, gearId: string, ratings: CloudRating[]): Persisted {
  if (!ratings.length) return base;
  const cloudReviews: Review[] = [];
  const duplicate = (review: Review) =>
    base.userReviews.some((item) => item.gearId === gearId && item.authorName === review.authorName && item.content === review.content);
  for (const rating of ratings) {
    const authorMeta = reviewerMeta(rating.riderProfile, rating.author.riderProfile);
    const review: Review = {
      id: rating.id,
      gearId,
      userKey: rating.author.id,
      authorName: rating.author.nickname,
      authorMeta,
      rating: rating.overall,
      content: rating.content ?? "",
      images: rating.images ?? [],
      parentId: null,
      createdAt: rating.createdAt,
      seedHelpful: rating.helpfulCount,
    };
    if (!duplicate(review)) cloudReviews.push(review);
    for (const reply of rating.replies) {
      const replyReview: Review = {
        id: reply.id,
        gearId,
        userKey: reply.author.id,
        authorName: reply.author.nickname,
        authorMeta,
        rating: 5,
        content: reply.content,
        images: [],
        parentId: rating.id,
        createdAt: reply.createdAt,
      };
      if (!duplicate(replyReview)) cloudReviews.push(replyReview);
    }
  }
  return { ...base, userReviews: [...cloudReviews, ...base.userReviews] };
}

function reviewerMeta(...values: unknown[]): ReviewerMeta {
  const merged = values.find((value) => value && typeof value === "object" && !Array.isArray(value)) as Record<string, unknown> | undefined;
  const levelMap: Record<string, string> = { beginner: "新手", intermediate: "中级", advanced: "进阶", expert: "高阶" };
  return {
    years: Number(merged?.years ?? 1),
    heightCm: Number(merged?.height ?? 0),
    weightKg: Number(merged?.weight ?? 0) || undefined,
    level: levelMap[String(merged?.level ?? "intermediate")] ?? "中级",
    resort: String(merged?.home_resort ?? ""),
  };
}
