export function shouldExportCatalogBeforeBuild(env: { CONTENT_EXPORT_API_BASE?: string }): boolean {
  return Boolean(env.CONTENT_EXPORT_API_BASE?.trim());
}

export function shouldRejectCatalogCountDecrease(
  existingCount: number,
  incomingCount: number,
  env: { CONTENT_EXPORT_ALLOW_COUNT_DECREASE?: string },
): boolean {
  return incomingCount < existingCount && env.CONTENT_EXPORT_ALLOW_COUNT_DECREASE !== "true";
}
