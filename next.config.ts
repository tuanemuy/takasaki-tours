import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/@libsql/**/*",
      "./node_modules/.pnpm/@libsql+client@0.14.0/**/*",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
