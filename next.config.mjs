/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/sellers',
          destination: 'https://tradetoppers.esoftideas.com/esi-api/requests/seller/',
        },
      ];
    },
  };
  
  export default nextConfig;
  