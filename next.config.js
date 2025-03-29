module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'none'",
              "script-src 'self' 'unsafe-inline' blob: https://accounts.google.com https://apis.google.com",
              "script-src-elem 'self' 'unsafe-inline' blob: https://accounts.google.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://*.googleusercontent.com",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co https://supabase.co https://accounts.google.com https://apis.google.com",
              "frame-src 'self' https://accounts.google.com",
              "manifest-src 'self'",
              "object-src 'none'",
              "base-uri 'none'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "report-uri /api/csp-report",
              "upgrade-insecure-requests",
              "block-all-mixed-content",
              "require-trusted-types-for 'script'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), autoplay=(), document-domain=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), sync-xhr=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};
