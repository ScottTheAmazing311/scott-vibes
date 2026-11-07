import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  // Headway is a self-contained static app built from ~/headway (see public/headway/README.md)
  async rewrites() {
    return [{ source: "/headway", destination: "/headway/index.html" }];
  },
  async headers() {
    return [
      { source: "/headway", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/headway/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
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
