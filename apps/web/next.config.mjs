/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@youpu/schema"],
  // 静态导出（内测站部署用）：纯前端产物交给 nginx，无需 Node 运行时
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
