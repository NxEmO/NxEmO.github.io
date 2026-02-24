import { experiences } from "@/lib/resume";

export default function Experience() {
  return (
    <section id="experience" style={{ padding: "80px 0" }}>
      <div className="container">
        <div className="section-label">Experience</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {experiences.map((exp, i) => (
            <div key={i}>
              {/* Job header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "start",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--text-1)",
                      marginBottom: 4,
                    }}
                  >
                    {exp.role}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                      color: "var(--text-3)",
                    }}
                  >
                    {exp.company} &nbsp;·&nbsp; {exp.department}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--text-3)",
                    paddingTop: 3,
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.period}
                </span>
              </div>

              {/* Highlights */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginBottom: 48,
                }}
              >
                {exp.highlights.map((h, j) => (
                  <div key={j} className="highlight-item">
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text-2)",
                        marginBottom: 5,
                      }}
                    >
                      {h.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-3)",
                        lineHeight: 1.75,
                      }}
                    >
                      {h.desc}
                    </div>
                  </div>
                ))}
              </div>

              {i < experiences.length - 1 && (
                <hr className="divider" style={{ marginBottom: 48 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
