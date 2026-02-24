export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-light)",
        padding: "24px 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-3)",
          }}
        >
          王若淼 · {new Date().getFullYear()}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-3)",
          }}
        >
          Built with Next.js · 知乎文章每日自动同步
        </span>
      </div>
    </footer>
  );
}
