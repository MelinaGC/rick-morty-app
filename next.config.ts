import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['rickandmortyapi.com'],
  },
};

export default nextConfig;
