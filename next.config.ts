import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useWasmBinary: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
