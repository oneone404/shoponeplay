import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['shoponeplay.com', '192.168.1.109', '192.168.1.109:3000'],
  images: {
    qualities: [75],
    localPatterns: [
      {
        pathname: '/uploads/**',
      },
      {
        pathname: '/images/**',
      }
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
      },
      {
        protocol: 'https',
        hostname: 'qr.sepay.vn',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'accone.vn',
      }
    ],
  },
};

export default nextConfig;
