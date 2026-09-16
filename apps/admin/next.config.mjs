/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ['@youpu/schema'],
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
};

export default nextConfig;
