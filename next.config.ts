
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  experimental: {
    serverActions: false,
  }
};

module.exports = nextConfig;
