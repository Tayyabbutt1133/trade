/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['tradetopper.esoftideas.com'],
  },
  };
  
  export default nextConfig;
  