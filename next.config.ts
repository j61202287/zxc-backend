import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/zxcprime-backend/:path*",
      },
    ];
  },
};

export default nextConfig;
