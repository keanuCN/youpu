import type { RatingListQueryInput } from '@youpu/schema';

export type RatingQueryRow = {
  id: string;
  riderProfile: Record<string, unknown>;
  helpfulCount: number;
  createdAt: Date;
};

export function hasCompleteRiderProfile(profile: Record<string, unknown>): boolean {
  const hasLevel = typeof profile.level === 'string';
  const additional = ['years', 'height', 'weight', 'home_resort'].filter((key) => profile[key] !== undefined).length;
  return hasLevel && additional >= 1;
}

export function filterAndSortRatings<T extends RatingQueryRow>(
  rows: T[],
  query: RatingListQueryInput,
  viewerProfile?: Record<string, unknown>,
): T[] {
  const filtered = rows
    .filter((row) => query.profile !== 'complete' || hasCompleteRiderProfile(row.riderProfile))
    .filter((row) => !query.level || row.riderProfile.level === query.level);

  return [...filtered].sort((a, b) => compareRatings(a, b, query.sort, viewerProfile));
}

function compareRatings(
  a: RatingQueryRow,
  b: RatingQueryRow,
  sort: RatingListQueryInput['sort'],
  viewerProfile?: Record<string, unknown>,
): number {
  if (sort === 'latest') return compareLatest(a, b);
  if (sort === 'similar' && viewerProfile && Object.keys(viewerProfile).length > 0) {
    const similarity = similarityScore(b.riderProfile, viewerProfile) - similarityScore(a.riderProfile, viewerProfile);
    if (similarity !== 0) return similarity;
  }
  return compareHelpful(a, b);
}

function compareHelpful(a: RatingQueryRow, b: RatingQueryRow): number {
  if (a.helpfulCount !== b.helpfulCount) return b.helpfulCount - a.helpfulCount;
  return compareLatest(a, b);
}

function compareLatest(a: RatingQueryRow, b: RatingQueryRow): number {
  const createdAt = b.createdAt.getTime() - a.createdAt.getTime();
  if (createdAt !== 0) return createdAt;
  return a.id.localeCompare(b.id);
}

function similarityScore(rowProfile: Record<string, unknown>, viewerProfile: Record<string, unknown>): number {
  let score = 0;
  if (typeof viewerProfile.level === 'string' && rowProfile.level === viewerProfile.level) score += 1000;

  for (const key of ['years', 'height', 'weight', 'home_resort']) {
    if (rowProfile[key] === undefined) continue;
    score += 1;
    if (viewerProfile[key] !== undefined && Object.is(rowProfile[key], viewerProfile[key])) score += 10;
  }

  return score;
}
