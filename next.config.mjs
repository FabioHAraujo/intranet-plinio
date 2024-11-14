// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['hips.hearstapps.com', 'anapincolini.com.br', 'media.istockphoto.com', 'pocketbase.flecksteel.com.br'],
  },
  webpack: (config) => {
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [path.resolve(fileURLToPath(import.meta.url))],
      },
    };
    return config;
  },
};

export default nextConfig;
