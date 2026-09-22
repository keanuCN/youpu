import assert from 'node:assert/strict';
import test from 'node:test';
import { summarizeArtifactDiff } from './audit-comparison';
import type { ArtifactDiff } from './diff';

function diff(overrides: Partial<ArtifactDiff>): ArtifactDiff {
  return {
    slug: 'test-product-2026',
    status: 'changed',
    rawContentChanged: true,
    normalizedSpecChanged: true,
    previousHashes: { rawContentHash: 'old-raw', normalizedSpecHash: 'old-spec' },
    currentHashes: { rawContentHash: 'new-raw', normalizedSpecHash: 'new-spec' },
    specChanges: [
      { path: 'weight', kind: 'changed', previous: 1000, current: 900 },
      { path: 'oldField', kind: 'removed', previous: '保留', current: null },
    ],
    ...overrides,
  };
}

test('classifies a normalized specification change as a review update', () => {
  assert.deepEqual(summarizeArtifactDiff(diff({})), {
    status: 'changed',
    rawContentChanged: true,
    normalizedSpecChanged: true,
    changedFieldCount: 2,
    removedFieldCount: 1,
    decision: 'review-update',
  });
});

test('distinguishes unchanged, raw-only and new candidates', () => {
  assert.equal(summarizeArtifactDiff(diff({ status: 'unchanged', rawContentChanged: false, normalizedSpecChanged: false, specChanges: [] })).decision, 'unchanged');
  assert.equal(summarizeArtifactDiff(diff({ normalizedSpecChanged: false, specChanges: [] })).decision, 'raw-only');
  assert.equal(summarizeArtifactDiff(diff({ status: 'new', normalizedSpecChanged: true })).decision, 'new-candidate');
});
