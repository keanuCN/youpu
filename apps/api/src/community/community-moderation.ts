export type CommunityRiskResult = {
  risk: 'clear' | 'watch';
  reasons: string[];
};

export function evaluateCommunityRisk(input: {
  content?: string | null;
  overall?: number;
  duplicate?: boolean;
}): CommunityRiskResult {
  const reasons: string[] = [];
  const normalized = (input.content ?? '').replace(/\s+/g, '').toLowerCase();

  if (['加微信', '微信号', '二维码', '返现', '刷单', '私聊转账'].some((term) => normalized.includes(term))) {
    reasons.push('promotion');
  }
  if (!normalized && (input.overall === 1 || input.overall === 5)) {
    reasons.push('extreme-rating-without-context');
  }
  if (input.duplicate) reasons.push('duplicate-content');

  return { risk: reasons.length ? 'watch' : 'clear', reasons };
}
