module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://infird.com; style-src 'self' 'unsafe-inline'; img-src 'self' https:; font-src 'self';",
          },
        ],
      },
    ];
  },
};
