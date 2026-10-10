/**
 * Controls the locally curated cold-start layer (ratings, comments and rank votes).
 * API-backed community data and user-submitted content are never controlled by this flag.
 */
export function isCuratedBaselineEnabled(env?: { NEXT_PUBLIC_CURATED_BASELINE?: string }): boolean {
  const configured = env ? env.NEXT_PUBLIC_CURATED_BASELINE : process.env.NEXT_PUBLIC_CURATED_BASELINE;
  return configured !== "false";
}
