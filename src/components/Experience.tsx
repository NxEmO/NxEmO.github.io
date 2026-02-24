import { experiences } from "@/lib/resume";

export default function Experience() {
  return (
    <section id="experience" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 className="section-title" style={{ marginBottom: 48 }}>
          实习经历
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {experiences.map((exp, i) => (
            <div key={i} className="card" style={{ padding: 32 }}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e2e8f0" }}>
                      {exp.company}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "3px 10px",
                        borderRadius: 100,
                        background: "rgba(56,189,248,0.08)",
                        border: "1px solid rgba(56,189,248,0.2)",
                        color: "#38bdf8",
                      }}
                    >
                      {exp.department}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: 4 }}>
                    {exp.role}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#475569",
                    padding: "4px 10px",
                    background: "#0d1220",
                    borderRadius: 6,
                    border: "1px solid #1e2d45",
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.period}
                </span>
              </div>

              {/* Highlights */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {exp.highlights.map((h, j) => (
                  <div key={j} className="highlight-item">
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#cbd5e1",
                        marginBottom: 6,
                        fontSize: "0.95rem",
                      }}
                    >
                      {h.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#64748b",
                        lineHeight: 1.75,
                      }}
                    >
                      {h.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
