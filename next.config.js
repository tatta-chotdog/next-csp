module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' blob: https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.googleusercontent.com; font-src 'self'; connect-src 'self' https://*.supabase.co https://supabase.co https://accounts.google.com https://apis.google.com; frame-src 'self' https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; report-uri /api/csp-report;",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' blob: https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.googleusercontent.com; font-src 'self'; connect-src 'self' https://*.supabase.co https://supabase.co https://accounts.google.com https://apis.google.com; frame-src 'self' https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; report-uri /api/csp-report;",
          },
        ],
      },
    ];
  },
};
