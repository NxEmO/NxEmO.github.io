import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalArticle, loadLocalArticles } from "@/lib/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await loadLocalArticles();
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getLocalArticle(slug);
  if (!article) return {};

  return {
    title: `${article.title} | NxEmO`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getLocalArticle(slug);
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

