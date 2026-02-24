import { skills } from "@/lib/resume";

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        padding: "100px 24px",
        background: "linear-gradient(180deg, transparent, rgba(13,18,32,0.6), transparent)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 className="section-title" style={{ marginBottom: 48 }}>
          技能栈
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {skills.map((group, i) => (
            <div key={i} className="card" style={{ padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))",
                    border: "1px solid rgba(56,189,248,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CategoryIcon index={i} />
                </div>
                <span
                  style={{
                    fontWeight: 600,
                    color: "#cbd5e1",
                    fontSize: "0.9rem",
                  }}
                >
                  {group.category}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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

const icons = [
  // Graphics API
  <svg key={0} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
  </svg>,
  // Engine
  <svg key={1} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>,
  // Rendering
  <svg key={2} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M12 2a10 10 0 0 0 0 20" />
    <path d="M2 12h20" />
    <path d="M12 2c2.76 3.62 4 7.27 4 10S14.76 18.38 12 22" />
    <path d="M12 2C9.24 5.62 8 9.27 8 12s1.24 6.38 4 10" />
  </svg>,
  // GPU
  <svg key={3} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
  </svg>,
  // Debug
  <svg key={4} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 8v4M12 16h.01" />
  </svg>,
  // Engineering
  <svg key={5} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>,
];

function CategoryIcon({ index }: { index: number }) {
  return icons[index % icons.length];
}
