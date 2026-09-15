import type { RobotsResult } from './types';

interface RobotsRule {
  kind: 'allow' | 'disallow';
  path: string;
  line: number;
}

interface RobotsGroup {
  agents: string[];
  rules: RobotsRule[];
}

const ROBOTS_TIMEOUT_MS = 10_000;

export async function checkRobots(url: string, userAgent: string): Promise<RobotsResult> {
  const targetUrl = new URL(url);
  const robotsUrl = new URL('/robots.txt', targetUrl).href;
  const fetchedAt = new Date().toISOString();

  try {
    const response = await fetch(robotsUrl, {
      headers: { 'user-agent': userAgent },
      signal: AbortSignal.timeout(ROBOTS_TIMEOUT_MS),
    });

    if (response.status === 404) {
      return {
        robotsUrl,
        fetchedAt,
        status: response.status,
        allowed: true,
        reason: 'robots.txt 不存在，按无额外规则处理',
      };
    }

    if (!response.ok) {
      return {
        robotsUrl,
        fetchedAt,
        status: response.status,
        allowed: false,
        reason: `robots.txt 请求失败（HTTP ${response.status}），为安全起见跳过`,
      };
    }

    const body = await response.text();
    const groups = parseRobots(body);
    const rules = selectRules(groups, userAgent);
    const requestPath = `${targetUrl.pathname}${targetUrl.search}`;
    const matched = rules
      .filter((rule) => matchesRule(rule.path, requestPath))
      .sort((a, b) => b.path.length - a.path.length || (a.kind === 'allow' ? -1 : 1))[0];

    if (!matched) {
      return {
        robotsUrl,
        fetchedAt,
        status: response.status,
        allowed: true,
        reason: '未匹配到 Disallow 规则',
      };
    }

    return {
      robotsUrl,
      fetchedAt,
      status: response.status,
      allowed: matched.kind === 'allow',
      reason: matched.kind === 'allow' ? '匹配到 Allow 规则' : '匹配到 Disallow 规则',
      matchedRule: `${matched.kind.toUpperCase()} ${matched.path}（第 ${matched.line} 行）`,
    };
  } catch (error) {
    return {
      robotsUrl,
      fetchedAt,
      status: null,
      allowed: false,
      reason: `robots.txt 无法访问：${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function parseRobots(body: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | undefined;

  body.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.split('#', 1)[0]?.trim() ?? '';
    if (!line) return;
    const separator = line.indexOf(':');
    if (separator < 0) return;
    const directive = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (directive === 'user-agent') {
      if (!current || current.rules.length > 0) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      return;
    }

    if (directive !== 'allow' && directive !== 'disallow') return;
    if (!current) {
      current = { agents: ['*'], rules: [] };
      groups.push(current);
    }
    current.rules.push({ kind: directive, path: value, line: index + 1 });
  });

  return groups;
}

function selectRules(groups: RobotsGroup[], userAgent: string): RobotsRule[] {
  const normalizedAgent = userAgent.toLowerCase();
  const exactGroups = groups.filter((group) =>
    group.agents.some((agent) => agent !== '*' && normalizedAgent.includes(agent)),
  );
  if (exactGroups.length > 0) return exactGroups.flatMap((group) => group.rules);
  return groups.filter((group) => group.agents.includes('*')).flatMap((group) => group.rules);
}

function matchesRule(rulePath: string, requestPath: string): boolean {
  if (!rulePath) return false;
  const escaped = rulePath.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}`).test(requestPath);
}
