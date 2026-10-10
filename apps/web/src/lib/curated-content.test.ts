import assert from "node:assert/strict";
import test from "node:test";

import { GEAR, reviewCount, userRating } from "@/data/boards";
import { allReviews, voteCount } from "@/lib/domain";
import { hasUserRating } from "@/lib/gear-state";
import type { Persisted } from "@/lib/persisted";
import type { Review } from "@/types";
import { isCuratedBaselineEnabled } from "./curated-content";

test("the curated baseline is enabled by default and can be switched off", () => {
  assert.equal(isCuratedBaselineEnabled({}), true);
  assert.equal(isCuratedBaselineEnabled({ NEXT_PUBLIC_CURATED_BASELINE: "true" }), true);
  assert.equal(isCuratedBaselineEnabled({ NEXT_PUBLIC_CURATED_BASELINE: "false" }), false);
});

test("turning off the baseline hides curated data but preserves user submissions", () => {
  const original = process.env.NEXT_PUBLIC_CURATED_BASELINE;
  const gear = GEAR.find((item) => Object.values(item.ratingDist).some((count) => count > 0));
  assert.ok(gear);
  const userReview: Review = {
    id: "real-user-review",
    gearId: gear.id,
    userKey: "account-1",
    authorName: "真实用户",
    authorMeta: { years: 2, heightCm: 170, level: "中级", resort: "" },
    rating: 4,
    content: "持续使用后的真实反馈。",
    images: [],
    parentId: null,
    createdAt: "2026-10-10T00:00:00Z",
  };
  const state = { userReviews: [userReview], votes: {} } as Persisted;

  try {
    delete process.env.NEXT_PUBLIC_CURATED_BASELINE;
    assert.equal(hasUserRating(gear), true);
    assert.ok(reviewCount(gear) > 0);
    assert.ok(allReviews(state, gear.id).some((review) => review.id.startsWith("r-")));

    process.env.NEXT_PUBLIC_CURATED_BASELINE = "false";
    assert.equal(hasUserRating(gear), false);
    assert.equal(userRating(gear), 0);
    assert.equal(reviewCount(gear), 0);
    assert.deepEqual(allReviews(state, gear.id).map((review) => review.id), [userReview.id]);
    assert.equal(voteCount(state, "overall", gear.id), 0);
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_CURATED_BASELINE;
    else process.env.NEXT_PUBLIC_CURATED_BASELINE = original;
  }
});
