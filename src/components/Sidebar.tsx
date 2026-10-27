"use client";

import { usePathname } from "next/navigation";
import { profile } from "@/lib/resume";
import Icon from "./Icon";

export default function Sidebar({ articleCount = 0 }: { articleCount?: number }) {
  const pathname = usePathname() ?? "/";
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const homeActive = normalizedPath === "/";
  const writingActive = normalizedPath === "/writing" || normalizedPath.startsWith("/articles/");

  return (
    <aside className="sidebar" aria-label="个人资料">
      <section className="profile-card glass-panel">
        <div className="profile-cover" />
        <div className="profile-avatar" aria-hidden="true">N<span>·</span></div>
        <a href="/" className="sidebar-brand">{profile.name}</a>
        <p className="profile-role">Game Developer</p>
        <p className="sidebar-tagline">{profile.studio}</p>
        <div className="profile-socials">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="访问 NxEmO 的 GitHub"><Icon name="github" /></a>
          <a href={`mailto:${profile.email}`} aria-label={`发送邮件至 ${profile.email}`}><Icon name="mail" /></a>
        </div>
        <a href="/writing/" className="profile-count"><strong>{articleCount.toString().padStart(2, "0")}</strong><span>文章与笔记</span><Icon name="arrow" /></a>
        <nav className="sidebar-nav" aria-label="页面导航">
          <a className={homeActive ? "sidebar-link active" : "sidebar-link"} href="/" aria-current={homeActive ? "page" : undefined}><Icon name="home" />首页<span>Home</span></a>
          <a className={writingActive ? "sidebar-link active" : "sidebar-link"} href="/writing/" aria-current={writingActive ? "page" : undefined}><Icon name="book" />文章<span>Writing</span></a>
        </nav>
      </section>
      <section className="sidebar-note glass-panel">
        <h2><Icon name="spark" /> 关于这里</h2>
        <p>游戏开发、学习记录，<br />还有那些值得留下的想法。</p>
        <a href={`mailto:${profile.email}`} className="sidebar-email">{profile.email} <Icon name="arrow" /></a>
      </section>
      <div className="sidebar-caption">STAY CURIOUS. KEEP BUILDING.</div>
    </aside>
  );
}
