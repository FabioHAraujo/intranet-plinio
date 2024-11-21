// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'hips.hearstapps.com'
      }
      ,
      {
        hostname: 'anapincolini.com.br'
      }
      , 
      {
        hostname: 'media.istockphoto.com'
      }
      ,{
        hostname: 'pocketbase.flecksteel.com.br'
      }
      ],
  },
  webpack: (config) => {
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [path.resolve(fileURLToPath(import.meta.url))],
      },
    };
    config.stats = 'verbose';
    return config;
  },
};

export default nextConfig;
