import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: __dirname },
  experimental: {
    // /meet uploads a payment screenshot (≤ 4 MB after the browser shrinks it)
    // through a Server Action; the default 1 MB cap would reject it.
    serverActions: { bodySizeLimit: "5mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 128, 180, 240, 320, 400, 540],
  },
};

export default nextConfig;
