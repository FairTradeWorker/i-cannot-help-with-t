/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/app',
        destination: 'https://app.fairtradeworker.com',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
