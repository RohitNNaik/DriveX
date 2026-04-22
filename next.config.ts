import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from trying to bundle Node.js-only packages
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
