/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase Hosting - static export
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
