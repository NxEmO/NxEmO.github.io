export type ArticleSummary = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  source: "site" | "zhihu";
  slug?: string;
  externalUrl?: string;
};
export { normalizeZhihuArticles, mergeArticleSummaries } from "./zhihu.mjs";
