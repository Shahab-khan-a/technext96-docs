/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Disable static optimization for full dynamic rendering like local
  reactStrictMode: true,
  // Ensure proper SSR behavior
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;