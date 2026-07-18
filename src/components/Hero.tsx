import { profile } from "@/lib/resume";
import FadeUp from "./FadeUp";
import TypewriterTitle from "./TypewriterTitle";

export default function Hero() {
  return (
    <section
      id="home"
      className="section"
      style={{
        minHeight: "calc(100vh - 96px)",
        paddingTop: 120,
        paddingBottom: 96,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <FadeUp immediate delay={0}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            borderRadius: 20,
            background: "rgba(96,165,250,0.08)",
            border: "1px solid rgba(96,165,250,0.2)",
            marginBottom: 20,
          }}
        >
          <span className="status-dot" />
          <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--accent)" }}>
            {profile.studio}
          </span>
        </div>
      </FadeUp>

      <FadeUp immediate delay={120}>
        <TypewriterTitle />
      </FadeUp>

      <FadeUp immediate delay={240}>
        <p
          style={{
            fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
            color: "var(--text-2)",
            marginBottom: 36,
            lineHeight: 1.5,
          }}
        >
          Game Developer · {profile.studio}
        </p>
      </FadeUp>

      <FadeUp immediate delay={360}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <a href={`mailto:${profile.email}`} className="contact-link">
            <MailIcon />
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-link">
            <GithubIcon />
            GitHub
          </a>
        </div>
      </FadeUp>
    </section>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8l10 6 10-6" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
