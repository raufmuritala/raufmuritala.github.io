import type { NextConfig } from "next";

/**
 * Static export configuration for GitHub Pages.
 * - output: "export"      → builds plain HTML/CSS/JS into ./out
 * - trailingSlash: true   → /projects/foo/ resolves to a real folder on Pages
 * - images.unoptimized    → GitHub Pages has no image optimization server
 *
 * No basePath is needed: this is a user site served from the domain root
 * (https://raufmuritala.github.io).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
