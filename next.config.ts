import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/@libsql/**/*",
      "./node_modules/.pnpm/@libsql+client@*/**/*",
      "./node_modules/.pnpm/@libsql+core@*/**/*",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
