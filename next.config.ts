import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export", // Enabled for Firebase Hosting static export
  images: {
    unoptimized: true // Required for next/image when using static export
  }
};

export default nextConfig;
