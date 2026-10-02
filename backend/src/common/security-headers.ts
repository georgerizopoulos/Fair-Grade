import type { NextFunction, Request, Response } from 'express';

// Headers for a JSON-only API (registered in main.ts). Nothing here is served
// as a page, so the CSP forbids everything; responses carry per-user data, so
// they must not be cached by shared proxies. HSTS is sent only on HTTPS
// requests (with TRUST_PROXY set, behind a TLS-terminating proxy as well).
export function securityHeaders(
  req: Pick<Request, 'secure'>,
  res: Pick<Response, 'setHeader'>,
  next: NextFunction,
) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; frame-ancestors 'none'",
  );
  res.setHeader('Cache-Control', 'no-store');
  if (req.secure) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=15552000; includeSubDomains',
    );
  }
  next();
}
