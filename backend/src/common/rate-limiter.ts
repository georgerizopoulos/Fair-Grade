// Fixed-window attempt counter, kept in memory. Pure logic, no Nest imports.
//
//   const limiter = new RateLimiter(10, 15 * 60_000); // 10 per 15 minutes
//   const wait = limiter.retryAfter(key);              // 0, or seconds to wait
//   limiter.hit(key);                                  // count one attempt
//   limiter.reset(key);                                // e.g. after a good login
//
// A window starts at the first hit for a key. State is per process, so with
// several backend instances each one counts on its own (fine for one server).
export class RateLimiter {
  private readonly entries = new Map<
    string,
    { count: number; resetAt: number }
  >();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
    private readonly maxKeys = 10_000,
  ) {}

  // 0 when the key may go ahead, otherwise the seconds until its window ends.
  retryAfter(key: string): number {
    const entry = this.live(key);
    if (!entry || entry.count < this.max) return 0;
    return Math.max(1, Math.ceil((entry.resetAt - this.now()) / 1000));
  }

  hit(key: string): void {
    const entry = this.live(key);
    if (entry) {
      entry.count += 1;
      return;
    }
    if (this.entries.size >= this.maxKeys) this.makeRoom();
    this.entries.set(key, { count: 1, resetAt: this.now() + this.windowMs });
  }

  reset(key: string): void {
    this.entries.delete(key);
  }

  private live(key: string) {
    const entry = this.entries.get(key);
    if (entry && entry.resetAt <= this.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }

  // Keeps memory bounded: drop expired windows, then the oldest key if still full.
  private makeRoom() {
    const now = this.now();
    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) this.entries.delete(key);
    }
    if (this.entries.size >= this.maxKeys) {
      const oldest = this.entries.keys().next();
      if (!oldest.done) this.entries.delete(oldest.value);
    }
  }
}

// "45 seconds", "1 minute", "12 minutes", for error messages.
export function describeWait(seconds: number): string {
  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}
