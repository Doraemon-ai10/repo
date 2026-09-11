import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  trailingSlash: true,
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return [
      { source: '/roblox/:path*', destination: '/' },
      { source: '/freefire/:path*', destination: '/' },
      { source: '/games', destination: '/' },
      { source: '/servers', destination: '/' },
      { source: '/about', destination: '/' },
      { source: '/donate', destination: '/' },
    ];
  },
};

export default nextConfig;
