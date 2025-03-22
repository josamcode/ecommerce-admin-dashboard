/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["via.placeholder.com", "images.unsplash.com", "localhost"],
  },
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
