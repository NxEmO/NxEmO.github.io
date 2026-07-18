export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-light)",
        padding: "28px 0 48px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-3)" }}>
          NxEmO · {new Date().getFullYear()} · Whither Studio
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-3)" }}>
          Based on Land1ngW&apos;s design · Built with Next.js
        </span>
      </div>
    </footer>
  );
}
