"use client";

import { useEffect, useState } from "react";
import { navSections, profile } from "@/lib/resume";

export default function Sidebar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <aside className="sidebar">
      {/* Brand */}
      <a href="#home" className="sidebar-brand">
        {profile.name.split("1").map((part, i, arr) =>
          i < arr.length - 1 ? (
            <span key={i}>
              {part}
              <span className="dot">1</span>
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </a>
      <div className="sidebar-tagline">Graphics / Engine Dev</div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navSections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`sidebar-link${active === id ? " active" : ""}`}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: active === id ? "var(--accent)" : "var(--text-3)",
                minWidth: 16,
              }}
            >
              {String(navSections.findIndex((s) => s.id === id) + 1).padStart(2, "0")}
            </span>
            {label}
          </a>
        ))}
      </nav>

      {/* Footer */}
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
