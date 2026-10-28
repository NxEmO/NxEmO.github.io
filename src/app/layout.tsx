import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import WaterBackground from "@/components/WaterBackground";
import StarField from "@/components/StarField";
import MusicPlayer from "@/components/MusicPlayer";

// Restore appearance before the first paint; the page also works without JavaScript.
const appearanceScript = `(function(){try{var options={theme:['auto','light','dark'],glass:['frosted','clear'],rain:['off','on'],water:['on','off']};Object.keys(options).forEach(function(key){var value=localStorage.getItem('nxemo-'+key);if(options[key].includes(value))document.documentElement.dataset[key]=value;});}catch(e){}})();`;

export const metadata: Metadata = {
  title: "NxEmO | Whither Studio",
  description: "NxEmO 的个人主页、个人文章索引，以及 Whither Studio 的线上入口。",
  keywords: ["NxEmO", "Whither Studio", "游戏开发"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="auto" data-glass="frosted" data-rain="off" data-water="on" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: appearanceScript }} /></head>
      <body>
        <WaterBackground />
        <StarField />
        <a className="skip-link" href="#main-content">跳转到内容</a>
        <SiteHeader />
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
