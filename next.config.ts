import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.amazon.com', // Added Amazon hostname
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http', // Added http protocol for amazon if needed
        hostname: 'www.amazon.com',
        port: '',
        pathname: '/**',
      },
       { // Added pattern for images stored directly on Amazon S3
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
