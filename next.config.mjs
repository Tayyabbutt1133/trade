import ReactComponentName from "react-scan/react-component-name/webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['tradetoppers.esoftideas.com', 'tradetoppers.com'],
  },
  webpack: (config, { dev, isServer }) => {
    // Enable react-scan only in production and client-side
    if (!dev && !isServer) {
      config.plugins.push(ReactComponentName({}));
    }
    return config;
  },
};

export default nextConfig;
