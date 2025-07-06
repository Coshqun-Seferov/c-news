/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "admin.ilkin.site",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "admin.ilkin.site",
        port: "",
        pathname: "/media/**",
      },
    ],
    unoptimized: true,
  },
  // Дополнительные настройки для production
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
}

module.exports = nextConfig
