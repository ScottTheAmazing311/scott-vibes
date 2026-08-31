import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  async redirects() {
    return [
      { source: "/coded-creations", destination: "/creative", permanent: true },
      { source: "/writing", destination: "/creative", permanent: true },
      { source: "/work", destination: "/professional", permanent: true },
      { source: "/potpourri", destination: "/other", permanent: true },
    ];
  },
};

export default nextConfig;
