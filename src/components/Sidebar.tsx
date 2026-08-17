"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { profile } from "@/lib/resume";

export default function Sidebar() {
  const pathname = usePathname() ?? "/";
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const homeActive = normalizedPath === "/";
  const writingActive =
    normalizedPath === "/writing" || normalizedPath.startsWith("/articles/");

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-brand">
        {profile.name}
      </Link>
      <div className="sidebar-tagline">{profile.studio}</div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <Link className={homeActive ? "sidebar-link active" : "sidebar-link"} href="/">
          Home
        </Link>
        <Link className={writingActive ? "sidebar-link active" : "sidebar-link"} href="/writing/">
          Writing
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
        <div>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </div>
      </div>
    </aside>
  );
}
