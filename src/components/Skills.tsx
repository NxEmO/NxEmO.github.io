import { skills } from "@/lib/resume";
import FadeUp from "./FadeUp";

export default function Skills() {
  return (
    <section
      id="skills"
      className="section"
      style={{ borderTop: "1px solid var(--border-light)" }}
    >
      <div className="section-label">Skills</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "32px 40px",
        }}
      >
          {skills.map((group, i) => (
            <FadeUp key={i} delay={i * 60} spring>
            <div
              style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "inline-block",
                  opacity: 0.6,
                }}
              />
              {group.category}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {group.items.map((item, j) => (
                <span key={j} className="tag">
                  {item}
                </span>
              ))}
            </div>
            </FadeUp>
          ))}
      </div>
    </section>
  );
}
