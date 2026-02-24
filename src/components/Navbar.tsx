"use client";

import { useState, useEffect } from "react";

const links = [
  { href: "#experience", label: "经历" },
  { href: "#skills", label: "技能" },
  { href: "#articles", label: "文章" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(14,17,23,0.9)" : "transparent",
        borderBottom: scrolled ? "1px solid #2a3347" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      <div
        className="container"
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="#home"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-1)",
            textDecoration: "none",
          }}
        >
          wrm<span style={{ color: "var(--accent)" }}>.</span>io
        </a>

        <nav style={{ display: "flex", gap: 28 }} className="desktop-nav">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "none",
            color: "var(--text-2)",
            padding: 4,
          }}
          aria-label="菜单"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {menuOpen ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          style={{
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
            padding: "12px 24px 20px",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "11px 0",
                borderBottom: "1px solid var(--border-light)",
                fontFamily: "var(--mono)",
                fontSize: 13,
                color: "var(--text-2)",
                textDecoration: "none",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
