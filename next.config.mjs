/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Dev proxy: call Express backend via same-origin path to avoid cross-origin issues in preview browsers.
    return [
      {
        source: "/api-ext/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ]
  },
}

export default nextConfig
