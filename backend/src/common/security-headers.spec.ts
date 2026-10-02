import { securityHeaders } from './security-headers.js';

function run(secure: boolean) {
  const headers: Record<string, string> = {};
  const next = vi.fn();
  securityHeaders(
    { secure },
    {
      setHeader: (name: string, value: string) => {
        headers[name] = value;
        return undefined as never;
      },
    },
    next,
  );
  return { headers, next };
}

describe('securityHeaders', () => {
  it('sets the baseline headers and calls next', () => {
    const { headers, next } = run(false);
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Referrer-Policy']).toBe('no-referrer');
    expect(headers['Content-Security-Policy']).toContain("default-src 'none'");
    expect(headers['Cache-Control']).toBe('no-store');
    expect(next).toHaveBeenCalledOnce();
  });

  it('sends HSTS only on secure requests', () => {
    expect(run(false).headers['Strict-Transport-Security']).toBeUndefined();
    expect(run(true).headers['Strict-Transport-Security']).toContain(
      'max-age=',
    );
  });
});
