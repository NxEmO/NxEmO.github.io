import { skills } from "@/lib/resume";

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        padding: "80px 0",
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <div className="container">
        <div className="section-label">Skills</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "28px 40px",
          }}
        >
          {skills.map((group, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                {group.category}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {group.items.map((item, j) => (
                  <span key={j} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
