import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalArticle, loadLocalArticles } from "@/lib/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
const EMPTY_ARTICLE_SLUG = "__empty__";

export async function generateStaticParams() {
  const articles = await loadLocalArticles();
  return articles.length ? articles.map(({ slug }) => ({ slug })) : [{ slug: EMPTY_ARTICLE_SLUG }];
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getLocalArticle(slug);
  if (!article && slug === EMPTY_ARTICLE_SLUG) {
    return {
      title: "Writing | NxEmO",
      robots: { index: false, follow: false },
    };
  }
  if (!article) return {};

  return {
    title: `${article.title} | NxEmO`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getLocalArticle(slug);
  if (!article && slug === EMPTY_ARTICLE_SLUG) {
    return (
      <main className="article-page">
        <div className="article-page-inner">
          <a className="article-back-link" href="/writing/">
            ← Writing
          </a>
          <article className="writing-empty-page">
            <p className="section-label">Article</p>
            <h1>Writing starts here</h1>
            <p className="writing-empty">There are no local articles yet. New notes will appear here after they are published.</p>
          </article>
        </div>
      </main>
    );
  }
  if (!article) notFound();

  return (
    <main className="article-page">
      <div className="article-page-inner">
        <a className="article-back-link" href="/writing/">
          ← Writing
        </a>
        <article>
          <header className="article-header">
            <p className="section-label">Article</p>
            <h1>{article.title}</h1>
            <p className="article-date">
              {new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" }).format(
                new Date(article.publishedAt)
              )}
            </p>
          </header>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />
        </article>
      </div>
    </main>
  );
}
