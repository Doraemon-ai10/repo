import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  async rewrites() {
    return [
      { source: '/games', destination: '/' },
      { source: '/servers', destination: '/' },
      { source: '/about', destination: '/' },
      { source: '/donate', destination: '/' },
    ];
  },
};

export default nextConfig;
