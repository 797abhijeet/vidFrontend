/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    disableOptimizedLoading: true,
  },
  outputFileTracing: false,
};

module.exports = nextConfig;
