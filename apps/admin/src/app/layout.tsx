import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '有谱后台 | M3 本地工作台',
  description: '有谱产品资料库管理后台',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
