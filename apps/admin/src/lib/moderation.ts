const moderationReasonLabels: Record<string, string> = {
  promotion: '推广/导流',
  'extreme-rating-without-context': '极端评分缺少说明',
  'duplicate-content': '重复内容',
};

export function formatModerationReason(reason: string): string {
  return moderationReasonLabels[reason] ?? '未知风险原因';
}

export function formatModerationReasons(reasons: string[]): string[] {
  return reasons.map(formatModerationReason);
}
