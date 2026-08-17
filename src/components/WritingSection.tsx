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
      <p className="section-label">Writing</p>
      {visibleArticles.length === 0 ? (
        <p className="writing-empty">No writing yet. New notes will appear here after the next sync.</p>
      ) : (
        <div className="article-list">
          {visibleArticles.map((article) => (
            <ArticleCard key={`${article.source}:${article.id}`} article={article} />
          ))}
        </div>
      )}
      {compact && articles.length > visibleArticles.length && (
        <a className="view-all-btn writing-view-all" href="/writing/">
          View all writing →
        </a>
      )}
    </section>
  );
}

