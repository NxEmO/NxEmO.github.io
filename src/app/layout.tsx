import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whither Studio",
  description:
    "游戏引擎开发 / 图形渲染工程师，腾讯 IEG 天美 G1 工作室实习生，专注 UE5 全局光照、渲染管线与光线追踪。",
  keywords: ["游戏引擎", "图形程序", "UE5", "全局光照", "渲染管线", "光线追踪"],
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
