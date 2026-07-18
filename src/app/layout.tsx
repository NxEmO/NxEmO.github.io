import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NxEmO — Graphics Programmer | Whither Studio",
  description: "NxEmO 的个人主页，以及 Whither Studio 的线上入口。",
  keywords: ["NxEmO", "Whither Studio", "游戏开发"],
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
