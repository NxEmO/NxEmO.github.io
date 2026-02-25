import FadeUp from "./FadeUp";

export default function Articles() {
  return (
    <section
      id="articles"
      className="section"
      style={{
        borderTop: "1px solid var(--border-light)",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div className="section-label" style={{ marginBottom: 0 }}>
          Writing
        </div>
      </div>

      <FadeUp>
        <EmptyState />
      </FadeUp>
    </section>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        paddingTop: 20,
        fontFamily: "var(--mono)",
        fontSize: 12,
        color: "var(--text-3)",
        lineHeight: 2,
      }}
    >
      <div>// Writing section disabled</div>
      <div>// You can add your own blog or projects here.</div>
    </div>
  );
}