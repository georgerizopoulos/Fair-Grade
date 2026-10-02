import type { NextConfig } from "next";

// Baseline browser hardening for every page. There is no CSP on purpose: Next's
// inline scripts need a nonce setup, which is a separate piece of work.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Browsers only honour this over HTTPS, so it does nothing on http://localhost.
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
