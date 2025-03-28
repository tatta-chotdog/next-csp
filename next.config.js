module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://accounts.google.com https://apis.google.com https://*.gstatic.com https://*.youtube.com",
              "script-src-elem 'self' 'unsafe-inline' blob: https://accounts.google.com https://apis.google.com https://*.gstatic.com https://*.youtube.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.googleusercontent.com https://*.gstatic.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://supabase.co https://accounts.google.com https://www.googleapis.com https://*.youtube.com",
              "frame-src 'self' https://accounts.google.com https://*.youtube.com https://*.supabase.co",
              "frame-ancestors 'self'",
              "form-action 'self' https://accounts.google.com https://*.supabase.co",
              "base-uri 'self'",
              "block-all-mixed-content",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};
