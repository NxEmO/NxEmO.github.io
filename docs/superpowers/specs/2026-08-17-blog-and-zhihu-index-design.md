# Blog and Zhihu Index Design

## Goal

Extend the NxEmO homepage into a static personal blog and project site while keeping Zhihu as a distribution channel. New Zhihu articles should appear in the site's writing index as cards containing a title, excerpt, date, and external link; the full Zhihu body is not mirrored into the site.

## Scope

### In scope

- Static site articles authored as Markdown/MDX in the repository.
- A unified writing index that can list both local articles and external Zhihu articles.
- A typed Zhihu article metadata snapshot stored in the repository.
- A GitHub Actions scheduled sync entry point that uses an officially permitted Zhihu API/RSS adapter when credentials/configuration are present.
- Last-known-good snapshot behavior when the sync cannot retrieve new data.
- External-link labeling and accessible article-card markup.

### Out of scope

- Copying or rendering full Zhihu article bodies.
- Scraping authenticated pages, cookies, or private browser state.
- Comments, likes, login, or a database-backed CMS.
- Migrating historical Zhihu articles automatically.

## Architecture

The site remains a Next.js static export deployed to GitHub Pages. Local articles are build-time content. Zhihu data is a build-time JSON snapshot. The browser never calls Zhihu directly.

```text
Official Zhihu API/RSS adapter (optional credentials)
        -> sync script
        -> data/zhihu.json
        -> Next.js static build
        -> GitHub Pages
```

The sync adapter must be replaceable: provider-specific URL/authentication logic stays outside React components. Until an official endpoint is configured, the checked-in snapshot may be maintained manually without changing the page contract.

## Data model

```ts
type ArticleSource = "site" | "zhihu";

type ArticleSummary = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string; // ISO 8601
  source: ArticleSource;
  slug?: string; // required for source: "site"
  externalUrl?: string; // required for source: "zhihu"
};
```

`data/zhihu.json` contains only normalized summaries. Syncing is idempotent by stable Zhihu article ID or URL, preserves newest-first order, and never deletes a previously known article solely because a later fetch failed.

## Routing and UI

- `/writing/` lists local and Zhihu summaries together, with a visible source label.
- `/articles/[slug]/` renders full local Markdown/MDX posts as statically generated pages.
- Zhihu cards use normal external anchors with `target="_blank"` and `rel="noopener noreferrer"`.
- The existing homepage gets a compact writing entry point; the full index owns the list.
- Empty-state copy explains that new writing will appear after the next sync/build.

## Sync and deployment

- Add a scheduled GitHub Actions job (daily) that runs the sync script and commits `data/zhihu.json` only when content changes.
- Credentials, if required by the official adapter, are read from GitHub Actions Secrets and never committed.
- Sync failures must fail soft: preserve the checked-in snapshot and report a clear workflow warning/error without publishing empty data.
- The normal push workflow remains the deployment path; a successful sync commit triggers the existing static build.
- No client-side fetch to Zhihu is used, avoiding CORS, runtime availability, and layout-scraping failures.

## SEO and attribution

- Local posts get per-route metadata, stable slugs, and are eligible for sitemap/RSS generation.
- External cards link to the original Zhihu URL and identify Zhihu as the source.
- If a local post is later cross-posted to Zhihu, the two URLs are linked to each other and the site remains the canonical content owner by convention.

## Testing and acceptance

- Unit/content tests validate the article-summary schema, source-specific required fields, stable ordering, and deduplication.
- Component tests validate source labels, external link attributes, and local article links.
- Sync tests cover a successful fetch, duplicate articles, malformed records, and preserving the last snapshot on failure.
- `npm run lint`, `node --test`, and `npm run build` must pass.
- Acceptance: adding a local MDX file creates a persistent `/articles/<slug>/` page; adding a normalized Zhihu record creates a card that opens the supplied original URL; a failed sync does not erase existing cards.

