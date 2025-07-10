/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['admin.ilkin.site'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.ilkin.site',
        port: '',
        pathname: '/media/**',
      },
    ],
    unoptimized: true,
  },
  env: {
    API_URL: 'https://admin.ilkin.site/api',
  },
}

export default nextConfig
