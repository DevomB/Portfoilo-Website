/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["poker-calculations"],
  // The Card Sum Options Desk is priced by a Python Function (api/carddesk.py)
  // that Vercel serves at /api/carddesk in production. `next dev` knows nothing
  // about it, so in development the same path is proxied to the local stand-in
  // started by `pnpm dev:desk`.
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [{ source: "/api/carddesk", destination: "http://127.0.0.1:8001/api/carddesk" }];
  },
};

module.exports = nextConfig;
