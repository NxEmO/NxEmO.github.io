import { profile } from "@/lib/resume";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #1e2d45",
        padding: "32px 24px",
        textAlign: "center",
        color: "#475569",
        fontSize: "0.8rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p>
          © {new Date().getFullYear()} {profile.name} · 构建于 Next.js 15 ·
          自动部署至 GitHub Pages
        </p>
        <p style={{ marginTop: 6, color: "#334155" }}>
          知乎文章由 GitHub Actions 每日自动同步
        </p>
      </div>
    </footer>
  );
}
