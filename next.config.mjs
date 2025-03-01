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
  };
  
  export default nextConfig;
  