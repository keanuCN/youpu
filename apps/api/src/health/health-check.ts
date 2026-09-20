export const HEALTH_CHECK_TIMEOUT_MS = 1_000;

export async function checkWithTimeout(
  probe: () => Promise<boolean>,
  timeoutMs = HEALTH_CHECK_TIMEOUT_MS,
): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const probeResult = Promise.resolve()
    .then(probe)
    .then((value) => Boolean(value), () => false);
  const timeoutResult = new Promise<boolean>((resolve) => {
    timer = setTimeout(() => resolve(false), timeoutMs);
  });

  try {
    return await Promise.race([probeResult, timeoutResult]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
