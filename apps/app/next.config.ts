import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Redirect from /course/:url to /courses/:url
  async redirects() {
    return [
      {
        source: "/course/:url", //blog url
        destination: "/courses/:url", //new blog url
        permanent: true, // 301 redirect
      },
    ];
  },
  serverExternalPackages: ["cloudinary"],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
