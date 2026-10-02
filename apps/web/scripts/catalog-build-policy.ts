export function shouldExportCatalogBeforeBuild(env: { CONTENT_EXPORT_API_BASE?: string }): boolean {
  return Boolean(env.CONTENT_EXPORT_API_BASE?.trim());
}

export function getStaticExportConfigurationProblems(env: {
  NEXT_OUTPUT?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_API_BASE?: string;
  CONTENT_EXPORT_API_BASE?: string;
}): string[] {
  if (env.NEXT_OUTPUT !== "export") return [];

  const problems: string[] = [];
  if (!isPublicHttpsUrl(env.NEXT_PUBLIC_SITE_URL)) {
    problems.push("NEXT_PUBLIC_SITE_URL 必须设置为正式 HTTPS 域名");
  }
  if (!isPublicHttpsUrl(env.NEXT_PUBLIC_API_BASE)) {
    problems.push("NEXT_PUBLIC_API_BASE 必须设置为正式 HTTPS API 地址");
  }
  if (!isPublicHttpsUrl(env.CONTENT_EXPORT_API_BASE)) {
    problems.push("CONTENT_EXPORT_API_BASE 必须设置为正式 HTTPS 目录 API 地址");
  }
  return problems;
}

function isPublicHttpsUrl(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname !== "localhost" &&
      !url.hostname.endsWith(".localhost") &&
      url.hostname !== "127.0.0.1" &&
      url.hostname !== "::1"
    );
  } catch {
    return false;
  }
}

export function shouldRejectCatalogCountDecrease(
  existingCount: number,
  incomingCount: number,
  env: { CONTENT_EXPORT_ALLOW_COUNT_DECREASE?: string },
): boolean {
  return incomingCount < existingCount && env.CONTENT_EXPORT_ALLOW_COUNT_DECREASE !== "true";
}
