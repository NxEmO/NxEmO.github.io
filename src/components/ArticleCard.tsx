import type { ArticleSummary } from "@/lib/articles";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(new Date(value));
}

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  const isZhihu = article.source === "zhihu";
  const href = isZhihu ? article.externalUrl : `/articles/${encodeURIComponent(article.slug ?? "")}/`;

  return (
    <article className="article-card">
      <div className="article-card-meta">
        <span>{formatDate(article.publishedAt)}</span>
        <span className="article-source">{isZhihu ? "Zhihu" : "NxEmO"}</span>
      </div>
      <h2 className="article-card-title">
        <a
          href={href}
          {...(isZhihu
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {article.title}
        </a>
      </h2>
      <p className="article-card-excerpt">{article.excerpt}</p>
      <a
        className="article-card-action"
        href={href}
        {...(isZhihu
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {isZhihu ? "Read on Zhihu ↗" : "Read article →"}
      </a>
    </article>
  );
}

