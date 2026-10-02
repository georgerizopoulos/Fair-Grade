import { checkEnv, parseTrustProxy } from './env.js';

describe('checkEnv', () => {
  it('passes a minimal development environment without warnings', () => {
    expect(checkEnv({ DATABASE_URL: 'file:./dev.db' })).toEqual({
      errors: [],
      warnings: [],
    });
  });

  it('names a missing DATABASE_URL and a bad PORT', () => {
    const { errors } = checkEnv({ PORT: 'abc' });
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain('DATABASE_URL');
    expect(errors[1]).toContain('PORT');
  });

  it('warns in production about CORS_ORIGIN and missing AWS keys', () => {
    const { errors, warnings } = checkEnv({
      DATABASE_URL: 'file:./prod.db',
      NODE_ENV: 'production',
    });
    expect(errors).toEqual([]);
    expect(warnings.join(' ')).toContain('CORS_ORIGIN');
    expect(warnings.join(' ')).toContain('AWS_ACCESS_KEY_ID');
  });

  it('is quiet in production when everything is configured, or the AI worker is off', () => {
    const base = {
      DATABASE_URL: 'file:./prod.db',
      NODE_ENV: 'production',
      CORS_ORIGIN: 'https://fairgrade.example',
    };
    expect(
      checkEnv({
        ...base,
        AWS_ACCESS_KEY_ID: 'id',
        AWS_SECRET_ACCESS_KEY: 'secret',
      }).warnings,
    ).toEqual([]);
    expect(checkEnv({ ...base, AI_WORKER: 'off' }).warnings).toEqual([]);
  });
});

describe('parseTrustProxy', () => {
  it('maps the env value to what Express expects', () => {
    expect(parseTrustProxy(undefined)).toBe(false);
    expect(parseTrustProxy('')).toBe(false);
    expect(parseTrustProxy('false')).toBe(false);
    expect(parseTrustProxy('true')).toBe(true);
    expect(parseTrustProxy('1')).toBe(1);
    expect(parseTrustProxy('loopback')).toBe('loopback');
  });
});
