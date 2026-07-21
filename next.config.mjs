import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable Webpack cache in development to prevent HMR compiler corruption crashes
      config.cache = false;
      
      // Optimize watchOptions to prevent file system watch delays and HMR race conditions
      config.watchOptions = {
        ignored: ['**/node_modules', '**/.next'],
        aggregateTimeout: 300,
        poll: false
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
