import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  experimental: {
    reactCompiler: true,

  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "anahigobbi.com",
        protocol: "https"
      }
    ],
  }
};

export default nextConfig;
