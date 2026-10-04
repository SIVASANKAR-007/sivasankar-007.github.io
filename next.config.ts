import type { NextConfig } from "next";

/**
 * Static export so the site can be hosted anywhere (GitHub Pages, Netlify, S3…).
 * For a GitHub Pages *project* site set NEXT_PUBLIC_BASE_PATH=/<repo-name> at build time
 * (the included workflow does this automatically).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const config: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;
