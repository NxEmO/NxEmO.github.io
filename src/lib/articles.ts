import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { mergeArticleSummaries, normalizeZhihuArticles } from "./zhihu.mjs";

export type ArticleSummary = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  source: "site" | "zhihu";
  slug?: string;
  externalUrl?: string;
};

export type LocalArticle = ArticleSummary & {
  source: "site";
  slug: string;
  html: string;
};

export const ARTICLES_DIRECTORY = path.join(process.cwd(), "content", "articles");
export const ZHIHU_SNAPSHOT_PATH = path.join(process.cwd(), "data", "zhihu.json");

function requiredString(data: Record<string, unknown>, key: string, filename: string) {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${filename}: missing required frontmatter: ${key}`);
  }
  return value.trim();
}

function normalizeDate(value: unknown, filename: string) {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${filename}: invalid frontmatter date`);
  }
  return date.toISOString();
}

export async function parseArticle(source: string, filename: string): Promise<LocalArticle> {
  const parsed = matter(source);
  const data = parsed.data as Record<string, unknown>;
  const title = requiredString(data, "title", filename);
  const excerpt = requiredString(data, "excerpt", filename);
  const slug = requiredString(data, "slug", filename);
  const publishedAt = normalizeDate(data.date, filename);
  const html = String(await remark().use(remarkHtml).process(parsed.content));

  return {
    id: slug,
    title,
    excerpt,
    publishedAt,
    source: "site",
    slug,
    html,
  };
}

function newestFirst<T extends { publishedAt: string; id: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const dateOrder = b.publishedAt.localeCompare(a.publishedAt);
    return dateOrder || a.id.localeCompare(b.id);
  });
}

export async function loadLocalArticles(directory = ARTICLES_DIRECTORY): Promise<LocalArticle[]> {
  let filenames: string[];
  try {
    filenames = await fs.readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const articles = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map(async (filename) => {
        const source = await fs.readFile(path.join(directory, filename), "utf8");
        return parseArticle(source, filename);
      })
  );
  return newestFirst(articles);
}

export async function getLocalArticleSummaries(): Promise<ArticleSummary[]> {
  return (await loadLocalArticles()).map((article) => {
    const { html, ...summary } = article;
    void html;
    return summary;
  });
}

export async function getLocalArticle(slug: string): Promise<LocalArticle | null> {
  const article = (await loadLocalArticles()).find((item) => item.slug === slug);
  return article ?? null;
}

export async function getZhihuArticleSummaries(): Promise<ArticleSummary[]> {
  try {
    const snapshot = JSON.parse(await fs.readFile(ZHIHU_SNAPSHOT_PATH, "utf8")) as unknown;
    return normalizeZhihuArticles(snapshot);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getWritingSummaries(): Promise<ArticleSummary[]> {
  const [local, zhihu] = await Promise.all([getLocalArticleSummaries(), getZhihuArticleSummaries()]);
  return mergeArticleSummaries(local, zhihu);
}
