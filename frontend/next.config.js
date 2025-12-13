/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [], // Add your remotion package if needed
  
  webpack: (config, { isServer }) => {
    // Add TypeScript loader for external .tsx files
    config.module.rules.push({
      test: /\.tsx?$/,
      include: [
        // Add path to your remotion source
        require('path').resolve(__dirname, '../remotion/src'),
      ],
      use: [
        {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      ],
    });
    
    return config;
  },
};

module.exports = nextConfig;