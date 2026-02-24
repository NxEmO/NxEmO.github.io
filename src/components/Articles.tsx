import articlesData from "../../data/articles.json";

interface Article {
  id: number;
  title: string;
  url: string;
  excerpt: string;
  voteup_count: number;
  comment_count: number;
  created: number;
  updated: number;
  thumbnail?: string | null;
}

interface ArticlesData {
  updated_at: string;
  articles: Article[];
}

const data = articlesData as ArticlesData;

function formatDate(timestamp: number): string {
  if (!timestamp) return "";
  const d = new Date(timestamp * 1000);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function Articles() {
  const articles = data.articles;
  const updatedAt = data.updated_at;
  const isEmpty = !articles || articles.length === 0;

  return (
    <section id="articles" style={{ padding: "100px 24px 120px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div>
            <h2 className="section-title">知乎文章</h2>
            {updatedAt && (
              <p style={{ fontSize: "0.78rem", color: "#475569", marginTop: 16 }}>
                最后更新：{updatedAt}
              </p>
            )}
          </div>
          <a
            href="https://www.zhihu.com/people/wrm-66-76"
            target="_blank"
            rel="noopener noreferrer"
            className="view-all-btn"
          >
            查看全部
            <ExternalLinkIcon />
          </a>
        </div>

        {isEmpty ? (
          <EmptyState />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="article-card"
    >
      {article.thumbnail && (
        <div
          style={{
            width: "100%",
            height: 160,
            overflow: "hidden",
            background: "#0d1220",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.thumbnail}
            alt={article.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#e2e8f0",
            lineHeight: 1.5,
            marginBottom: 10,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p
            style={{
              fontSize: "0.82rem",
              color: "#64748b",
              lineHeight: 1.65,
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            {article.excerpt}
          </p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid #1e2d45",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#475569" }}>
            {formatDate(article.created)}
          </span>
          <div style={{ display: "flex", gap: 14, color: "#475569", fontSize: "0.78rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <ThumbsUpIcon />
              {formatNumber(article.voteup_count)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CommentIcon />
              {formatNumber(article.comment_count)}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        border: "1px dashed #1e2d45",
        borderRadius: 16,
        color: "#475569",
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>📄</div>
      <p style={{ fontSize: "0.95rem", marginBottom: 8 }}>文章数据尚未同步</p>
      <p style={{ fontSize: "0.8rem" }}>
        GitHub Actions 每天自动从知乎拉取 · 首次需要手动运行 Workflow
      </p>
      <a
        href="https://www.zhihu.com/people/wrm-66-76"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "10px 20px",
          borderRadius: 8,
          background: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.25)",
          color: "#38bdf8",
          textDecoration: "none",
          fontSize: "0.85rem",
        }}
      >
        前往知乎查看文章
      </a>
    </div>
  );
}

function ThumbsUpIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
