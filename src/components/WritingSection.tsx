import type { ArticleSummary } from "@/lib/articles";
import ArticleCard from "./ArticleCard";

type WritingSectionProps = {
  articles: ArticleSummary[];
  compact?: boolean;
};

export default function WritingSection({ articles, compact = false }: WritingSectionProps) {
  const visibleArticles = compact ? articles.slice(0, 3) : articles;

  return (
    <section id="writing" className="section writing-section">
      <div className="section-heading">
        <div><p className="section-eyebrow">THE NOTEBOOK</p><h2>{compact ? "最近文章" : "文章与笔记"}<span className="section-count">{articles.length}</span></h2></div>
        {compact ? <a href="/writing/" className="view-all-btn">全部文章 <span aria-hidden="true">↗</span></a> : <span className="writing-subtitle">记录思考，也记录实践。</span>}
      </div>
      {visibleArticles.length === 0 ? (
        <div className="writing-empty glass-panel"><p>笔记正在酝酿中。</p><p lang="en">No writing yet. New notes will appear here after the next sync.</p></div>
      ) : (
        <div className="article-list">
          {visibleArticles.map((article) => (
            <ArticleCard key={`${article.source}:${article.id}`} article={article} />
          ))}
        </div>
      )}
      {compact && articles.length > visibleArticles.length && (
        <a className="view-all-btn writing-view-all" href="/writing/">
          查看全部文章 →
        </a>
      )}
    </section>
  );
}

