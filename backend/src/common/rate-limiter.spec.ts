import { RateLimiter, describeWait } from './rate-limiter.js';

describe('RateLimiter', () => {
  let now = 0;
  const clock = () => now;
  beforeEach(() => {
    now = 1_000_000;
  });

  it('lets a key through until it has used up its attempts', () => {
    const limiter = new RateLimiter(3, 60_000, clock);
    for (let i = 0; i < 3; i++) {
      expect(limiter.retryAfter('a')).toBe(0);
      limiter.hit('a');
    }
    expect(limiter.retryAfter('a')).toBe(60);
  });

  it('counts each key on its own', () => {
    const limiter = new RateLimiter(1, 60_000, clock);
    limiter.hit('a');
    expect(limiter.retryAfter('a')).toBeGreaterThan(0);
    expect(limiter.retryAfter('b')).toBe(0);
  });

  it('reports the time left in the window, and opens again after it', () => {
    const limiter = new RateLimiter(1, 60_000, clock);
    limiter.hit('a');
    now += 45_000;
    expect(limiter.retryAfter('a')).toBe(15);
    now += 15_000;
    expect(limiter.retryAfter('a')).toBe(0);
    limiter.hit('a'); // a fresh window
    expect(limiter.retryAfter('a')).toBe(60);
  });

  it('reset clears a key', () => {
    const limiter = new RateLimiter(1, 60_000, clock);
    limiter.hit('a');
    limiter.reset('a');
    expect(limiter.retryAfter('a')).toBe(0);
  });

  it('keeps memory bounded: expired windows go first, then the oldest key', () => {
    const limiter = new RateLimiter(1, 60_000, clock, 2);
    limiter.hit('old');
    now += 61_000;
    limiter.hit('b');
    limiter.hit('c'); // full: "old" expired, so it is dropped, not "b"
    expect(limiter.retryAfter('b')).toBeGreaterThan(0);
    expect(limiter.retryAfter('c')).toBeGreaterThan(0);

    limiter.hit('d'); // still full, nothing expired: the oldest ("b") goes
    expect(limiter.retryAfter('b')).toBe(0);
    expect(limiter.retryAfter('c')).toBeGreaterThan(0);
    expect(limiter.retryAfter('d')).toBeGreaterThan(0);
  });
});

describe('describeWait', () => {
  it('uses seconds under a minute and rounds minutes up', () => {
    expect(describeWait(1)).toBe('1 second');
    expect(describeWait(45)).toBe('45 seconds');
    expect(describeWait(60)).toBe('1 minute');
    expect(describeWait(61)).toBe('2 minutes');
    expect(describeWait(900)).toBe('15 minutes');
  });
});
