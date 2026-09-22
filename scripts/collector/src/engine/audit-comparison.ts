import type { ArtifactDiff } from './diff';

export type AuditComparisonDecision = 'new-candidate' | 'unchanged' | 'raw-only' | 'review-update';

export interface AuditComparisonSummary {
  status: ArtifactDiff['status'];
  rawContentChanged: boolean;
  normalizedSpecChanged: boolean;
  changedFieldCount: number;
  removedFieldCount: number;
  decision: AuditComparisonDecision;
}

export function summarizeArtifactDiff(diff: ArtifactDiff): AuditComparisonSummary {
  const removedFieldCount = diff.specChanges.filter((change) => change.kind === 'removed').length;
  const changedFieldCount = diff.specChanges.length;
  let decision: AuditComparisonDecision;
  if (diff.status === 'new') decision = 'new-candidate';
  else if (diff.status === 'unchanged') decision = 'unchanged';
  else if (diff.normalizedSpecChanged) decision = 'review-update';
  else decision = 'raw-only';

  return {
    status: diff.status,
    rawContentChanged: diff.rawContentChanged,
    normalizedSpecChanged: diff.normalizedSpecChanged,
    changedFieldCount,
    removedFieldCount,
    decision,
  };
}
