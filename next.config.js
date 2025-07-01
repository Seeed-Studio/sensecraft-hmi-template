/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material', 'framer-motion', 'date-fns'],
  },
  webpack: (config, { isServer }) => {
    // 优化构建大小
    config.optimization = {
      ...config.optimization,
      minimize: true,
    }
    return config
  },
}

module.exports = nextConfig 