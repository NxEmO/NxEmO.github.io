import { profile } from "@/lib/resume";

export default function MobileTopbar() {
  return (
    <>
      <div className="mobile-topbar">
        <a
          href="#home"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text-1)",
            textDecoration: "none",
          }}
        >
          {profile.name}
        </a>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-3)" }}>
          {profile.studio}
        </span>
      </div>

      <div style={{ height: 52, display: "block" }} className="mobile-spacer" />

      <style>{`
        @media (min-width: 769px) { .mobile-spacer { display: none; } }
      `}</style>
    </>
  );
}
