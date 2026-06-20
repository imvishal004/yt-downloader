import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow large responses for video downloads
    serverActions: {
      bodySizeLimit: "2gb",
    },
  },
  // Increase the response size limit for API routes
  serverExternalPackages: [],
};

export default nextConfig;
