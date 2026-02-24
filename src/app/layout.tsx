import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "王若淼 | 游戏引擎 · 图形程序工程师",
  description:
    "王若淼，华南理工大学软件工程，腾讯 IEG 天美工作室游戏引擎开发实习生，专注 UE5、全局光照、渲染管线与光线追踪方向。",
  keywords: ["游戏引擎", "图形程序", "UE5", "全局光照", "渲染管线", "光线追踪"],
  openGraph: {
    title: "王若淼 | 游戏引擎 · 图形程序工程师",
    description: "专注 UE5 渲染管线、全局光照系统与光线追踪技术。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
