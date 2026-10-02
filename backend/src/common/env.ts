// Startup checks for the environment (main.ts runs them before Nest boots).
// Pure logic: errors stop the backend with a message that names the variable,
// warnings are only logged. JWT_SECRET is checked in auth.module.ts.
export interface EnvReport {
  errors: string[];
  warnings: string[];
}

export function checkEnv(env: Record<string, string | undefined>): EnvReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!env.DATABASE_URL) {
    errors.push(
      'DATABASE_URL is not set (for SQLite use DATABASE_URL=file:./dev.db in backend/.env)',
    );
  }
  if (env.PORT !== undefined && !/^\d{1,5}$/.test(env.PORT)) {
    errors.push(`PORT must be a number, got "${env.PORT}"`);
  }

  if (env.NODE_ENV === 'production') {
    if (!env.CORS_ORIGIN) {
      warnings.push(
        'CORS_ORIGIN is not set: it defaults to http://localhost:3000, so a browser on your real domain is blocked. Set it to the frontend URL.',
      );
    }
    const awsKeys = env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY;
    if (env.AI_WORKER !== 'off' && !awsKeys) {
      warnings.push(
        'AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY are not set: AI grading only works with another credential source (instance role, profile); otherwise submitted papers end up AI_FAILED.',
      );
    }
  }

  return { errors, warnings };
}

// TRUST_PROXY for Express: unset or "false" → off, "true" → trust every hop,
// a number → that many hops, anything else ("loopback", a CIDR list) as is.
// Needed behind a reverse proxy so request.ip is the client and not the proxy.
export function parseTrustProxy(
  value: string | undefined,
): boolean | number | string {
  if (value === undefined || value === '' || value === 'false') return false;
  if (value === 'true') return true;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}
