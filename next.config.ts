import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,  // Creates blog/index.html instead of blog.html
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
