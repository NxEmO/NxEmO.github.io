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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function Articles() {
  const articles = data.articles;
  const updatedAt = data.updated_at;
  const isEmpty = !articles || articles.length === 0;

  return (
    <section
      id="articles"
      style={{
        padding: "80px 0 120px",
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div className="section-label" style={{ marginBottom: 0, flex: 1 }}>
            Writing
          </div>
          <a
            href="https://www.zhihu.com/people/wrm-66-76"
            target="_blank"
            rel="noopener noreferrer"
            className="view-all-btn"
          >
            知乎主页
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>

        {updatedAt && (
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text-3)",
              marginBottom: 28,
              marginTop: -16,
            }}
          >
            同步于 {updatedAt}
          </div>
        )}

        {isEmpty ? (
          <EmptyState />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {articles.map((article, i) => (
              <ArticleRow
                key={article.id}
                article={article}
                isLast={i === articles.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleRow({
  article,
  isLast,
}: {
  article: Article;
  isLast: boolean;
}) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "start",
        gap: 20,
        padding: "18px 0",
        borderBottom: isLast ? "none" : "1px solid var(--border-light)",
        textDecoration: "none",
        transition: "background 0.1s",
      }}
      className="article-row"
    >
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-1)",
            lineHeight: 1.5,
            marginBottom: 4,
            transition: "color 0.15s",
          }}
          className="article-row-title"
        >
          {article.title}
        </div>
        {article.excerpt && (
          <div
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              lineHeight: 1.65,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.excerpt}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-3)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          {formatNum(article.voteup_count)}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-3)",
          }}
        >
          {formatDate(article.created)}
        </span>
      </div>

      <style>{`
        .article-row:hover .article-row-title { color: var(--accent); }
      `}</style>
    </a>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "60px 0",
        borderTop: "1px solid var(--border-light)",
        color: "var(--text-3)",
        fontFamily: "var(--mono)",
        fontSize: 13,
      }}
    >
      <p>// 首次运行 GitHub Actions 后文章将自动同步</p>
      <p style={{ marginTop: 6 }}>
        // 或前往{" "}
        <a
          href="https://www.zhihu.com/people/wrm-66-76"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          知乎主页
        </a>{" "}
        查看
      </p>
    </div>
  );
}
