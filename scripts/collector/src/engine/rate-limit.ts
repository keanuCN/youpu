export class DomainRateLimiter {
  private readonly lastRequestAt = new Map<string, number>();

  async waitFor(url: string, minIntervalMs: number): Promise<void> {
    const origin = new URL(url).origin;
    const last = this.lastRequestAt.get(origin);
    const waitMs = last === undefined ? 0 : Math.max(0, last + minIntervalMs - Date.now());
    if (waitMs > 0) {
      await new Promise<void>((resolvePromise) => setTimeout(resolvePromise, waitMs));
    }
    this.lastRequestAt.set(origin, Date.now());
  }
}
