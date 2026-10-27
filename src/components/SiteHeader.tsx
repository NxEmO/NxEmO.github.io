"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { profile } from "@/lib/resume";
import Icon from "./Icon";

type Theme = "auto" | "light" | "dark";
const themeLabels = { auto: "自动", light: "浅色", dark: "深色" };
const nextTheme: Record<Theme, Theme> = { auto: "light", light: "dark", dark: "auto" };

function subscribe(callback: () => void) {
  window.addEventListener("appearance-change", callback);
  return () => window.removeEventListener("appearance-change", callback);
}

function setPreference(key: "theme" | "glass" | "rain", value: string) {
  document.documentElement.dataset[key] = value;
  try { localStorage.setItem(`nxemo-${key}`, value); } catch { /* Controls also work without browser storage. */ }
  window.dispatchEvent(new Event("appearance-change"));
}

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const writingActive = pathname.startsWith("/writing") || pathname.startsWith("/articles/");
  const theme = useSyncExternalStore(subscribe, () => (document.documentElement.dataset.theme ?? "auto") as Theme, () => "auto" as Theme);
  const frosted = useSyncExternalStore(subscribe, () => document.documentElement.dataset.glass !== "clear", () => true);
  const rainy = useSyncExternalStore(subscribe, () => document.documentElement.dataset.rain === "on", () => false);

  return (
    <header className="site-header glass-panel">
      <a href="/" className="header-brand" aria-label={`${profile.name} 首页`}><span className="brand-mark">N<span>·</span></span><span>{profile.name}</span></a>
      <nav className="header-nav" aria-label="主导航">
        <a href="/" className={!writingActive && pathname === "/" ? "nav-link active" : "nav-link"} aria-current={pathname === "/" ? "page" : undefined}><Icon name="home" /> 首页</a>
        <a href="/writing/" className={writingActive ? "nav-link active" : "nav-link"} aria-current={writingActive ? "page" : undefined}><Icon name="book" /> 文章</a>
        <a href={`mailto:${profile.email}`} className="nav-link nav-contact"><Icon name="mail" /> 联系</a>
      </nav>
      <div className="appearance-controls" aria-label="外观设置">
        <button type="button" className="appearance-button" onClick={() => setPreference("theme", nextTheme[theme])} title={`主题：${themeLabels[theme]}，点击切换为${themeLabels[nextTheme[theme]]}`} aria-label={`主题：${themeLabels[theme]}，切换为${themeLabels[nextTheme[theme]]}`}><Icon name={theme === "light" ? "sun" : theme === "dark" ? "moon" : "auto"} /><span>{themeLabels[theme]}</span></button>
        <button type="button" className="appearance-button" aria-pressed={frosted} onClick={() => setPreference("glass", frosted ? "clear" : "frosted")} title={frosted ? "关闭磨砂效果" : "开启磨砂效果"} aria-label="磨砂效果"><Icon name="glass" /><span>磨砂</span></button>
        <button type="button" className="appearance-button" aria-pressed={rainy} onClick={() => setPreference("rain", rainy ? "off" : "on")} title={rainy ? "关闭雨滴效果" : "开启雨滴效果"} aria-label="雨滴效果"><Icon name="rain" /><span>雨滴</span></button>
      </div>
    </header>
  );
}
