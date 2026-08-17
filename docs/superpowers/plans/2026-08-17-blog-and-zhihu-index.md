# Blog and Zhihu Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax and must be completed in order.

**Goal:** Add a static Markdown blog and a unified writing index that displays future Zhihu article summaries as external links.

**Architecture:** Keep `output: "export"` and generate every local article route at build time. Store normalized Zhihu summaries in `data/zhihu.json`; a provider-neutral sync script updates that snapshot from an officially permitted JSON API/RSS adapter when configured, and the browser never calls Zhihu directly.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Markdown parsed with `gray-matter` + `remark` + `remark-html`, Node `node:test`, GitHub Actions, GitHub Pages.

## Global Constraints

- Full local articles are Markdown/MDX content owned by this repository; Zhihu cards contain metadata and an external URL only.
- No password, cookie, CAPTCHA, authenticated browser state, or page scraping is used.
- `data/zhihu.json` is last-known-good and must not be replaced by an empty snapshot after a failed sync.
- The browser never fetches Zhihu at runtime; sync happens before the static build.
- Existing branding remains NxEmO / Whither Studio and the current static-export deployment remains the publishing path.

---

### Task 1: Add the article content model and static route generation

**Files:**
- Create: `content/articles/.gitkeep`
- Create: `src/lib/articles.ts`
- Create: `src/app/articles/[slug]/page.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/articles.test.mjs`

**Interfaces:**
- `loadLocalArticles(): Promise<LocalArticle[]>` reads `content/articles/*.md` and returns frontmatter plus rendered HTML.
- `getLocalArticleSummaries(): Promise<ArticleSummary[]>` returns newest-first local cards.
- `getLocalArticle(slug: string): Promise<LocalArticle | null>` returns one article or `null`.
- `generateStaticParams()` in the route returns `{ slug: string }[]` for all local articles.

- [ ] **Step 1: Write the failing parser tests**

Create `tests/articles.test.mjs` that writes a temporary Markdown fixture with `title`, `excerpt`, `date`, and `slug` frontmatter, then asserts the parser returns a stable slug, ISO date, excerpt, and HTML paragraph. Add a second assertion that missing required frontmatter is rejected with a descriptive error.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/articles.test.mjs`

Expected: FAIL because `src/lib/articles.ts` and the parser contract do not exist yet.

- [ ] **Step 3: Add the Markdown dependencies and minimal loader**

Add `gray-matter`, `remark`, and `remark-html` to `dependencies`. Implement `src/lib/articles.ts` with a `LocalArticle` type, frontmatter validation, filesystem reads from `content/articles`, `remark().use(html).process(...)`, and newest-first sorting by `date` then `slug`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/articles.test.mjs`

Expected: PASS with no warnings.

- [ ] **Step 5: Add the statically generated article route**

Create `src/app/articles/[slug]/page.tsx` that calls `generateStaticParams`, renders the article title/date/body, calls `notFound()` for an unknown slug, and exports per-page `generateMetadata`. Keep the route server-rendered and compatible with `output: "export"`.

- [ ] **Step 6: Run the focused test and commit**

Run: `node --test tests/articles.test.mjs`

Commit:

```bash
git add content/articles src/lib/articles.ts src/app/articles package.json package-lock.json tests/articles.test.mjs
git commit -m "feat: add static markdown article routes"
```

### Task 2: Add the normalized Zhihu snapshot and safe sync script

**Files:**
- Create: `data/zhihu.json`
- Create: `src/lib/zhihu.ts`
- Create: `scripts/sync-zhihu.mjs`
- Modify: `package.json`
- Test: `tests/zhihu.test.mjs`

**Interfaces:**
- `ArticleSummary` is `{ id, title, excerpt, publishedAt, source, slug?, externalUrl? }`.
- `normalizeZhihuArticles(input: unknown): ArticleSummary[]` validates, deduplicates by `id` or `externalUrl`, and sorts newest-first.
- `mergeArticleSummaries(local, zhihu): ArticleSummary[]` returns one newest-first list without mutating inputs.
- `sync-zhihu.mjs` reads `ZHIHU_ARTICLES_URL` and optional `ZHIHU_API_TOKEN`, fetches JSON, normalizes it, and atomically replaces `data/zhihu.json` only after success.

- [ ] **Step 1: Write the failing snapshot tests**

Create `tests/zhihu.test.mjs` covering: valid records normalize to `source: "zhihu"`; duplicate IDs collapse to one record; malformed records are rejected; merge output is newest-first; and a failed sync leaves the previous JSON snapshot unchanged.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/zhihu.test.mjs`

Expected: FAIL because the normalizer and sync module do not exist yet.

- [ ] **Step 3: Implement the pure normalizer and merger**

Implement `src/lib/zhihu.ts` with explicit field checks, URL validation for `https://zhuanlan.zhihu.com/` or `https://www.zhihu.com/`, ISO date parsing, deduplication, and immutable sorting. Keep it independent of React and filesystem APIs so the tests exercise real behavior directly.

- [ ] **Step 4: Implement the provider-neutral sync script**

Implement `scripts/sync-zhihu.mjs` using Node `fetch`. Accept either a JSON array or `{ articles: [...] }`; map each record to the normalizer's fields; send `Authorization: Bearer <token>` only when `ZHIHU_API_TOKEN` is set; write through a temporary file and rename on success. If `ZHIHU_ARTICLES_URL` is absent, emit a GitHub Actions notice and exit successfully without changing the snapshot. If fetch, JSON, validation, or write fails, retain the existing snapshot and exit non-zero with an actionable error.

- [ ] **Step 5: Run the focused tests and commit**

Run: `node --test tests/zhihu.test.mjs`

Commit:

```bash
git add data/zhihu.json src/lib/zhihu.ts scripts/sync-zhihu.mjs package.json tests/zhihu.test.mjs
git commit -m "feat: add safe Zhihu article snapshot sync"
```

### Task 3: Build the unified writing index and homepage entry point

**Files:**
- Create: `src/app/writing/page.tsx`
- Create: `src/components/WritingSection.tsx`
- Create: `src/components/ArticleCard.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/lib/articles.ts`
- Modify: `src/app/globals.css`
- Test: `tests/writing-content.test.mjs`

**Interfaces:**
- `getWritingSummaries(): Promise<ArticleSummary[]>` merges local and Zhihu summaries.
- `ArticleCard` renders a local link for `source: "site"` and an external link with `target="_blank"` and `rel="noopener noreferrer"` for `source: "zhihu"`.

- [ ] **Step 1: Write the failing content contract tests**

Create `tests/writing-content.test.mjs` that asserts the writing route and components exist, source labels are present, external-link attributes are present, and the homepage mounts `WritingSection`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/writing-content.test.mjs`

Expected: FAIL because the route and components do not exist.

- [ ] **Step 3: Implement the article card and writing section**

Create accessible cards with a heading, excerpt, date, source label, and visible action text. Use the existing mono/dark visual language and keep the empty state useful when no local or Zhihu items exist.

- [ ] **Step 4: Implement `/writing/` and mount a compact homepage section**

Create the static writing index using `getWritingSummaries`, add a compact preview beneath the hero, and link to `/writing/`. Do not add a client-side Zhihu fetch.

- [ ] **Step 5: Run the focused test and commit**

Run: `node --test tests/writing-content.test.mjs`

Commit:

```bash
git add src/app/writing src/components/ArticleCard.tsx src/components/WritingSection.tsx src/app/page.tsx src/lib/articles.ts src/app/globals.css tests/writing-content.test.mjs
git commit -m "feat: add unified writing index"
```

### Task 4: Schedule snapshot sync and harden deployment

**Files:**
- Create: `.github/workflows/sync-zhihu.yml`
- Modify: `.github/workflows/deploy.yml`
- Modify: `README.md`
- Test: `tests/workflow-config.test.mjs`

**Interfaces:**
- The sync workflow runs daily and on manual dispatch, has `contents: write`, and commits only changed `data/zhihu.json`.
- The deploy workflow builds the committed static snapshot and no longer references a nonexistent `Scrape Zhihu Articles` workflow.

- [ ] **Step 1: Write the failing workflow tests**

Create `tests/workflow-config.test.mjs` that reads both workflow files and asserts the sync schedule/manual dispatch, write permission, secret names, deploy trigger, and absence of the stale workflow name.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/workflow-config.test.mjs`

Expected: FAIL because the sync workflow and cleaned deploy trigger do not exist.

- [ ] **Step 3: Add the scheduled workflow and remove stale coupling**

Create the workflow with `cron: "17 3 * * *"`, `workflow_dispatch`, Node setup, `npm ci`, `npm run sync:zhihu`, and a guarded commit/push step. Remove `workflow_run` for `Scrape Zhihu Articles` from deploy while retaining push and manual deployment.

- [ ] **Step 4: Document configuration without secrets**

Update README with the content directory, `ZHIHU_ARTICLES_URL`, `ZHIHU_API_TOKEN`, snapshot behavior, and the fact that full Zhihu bodies are not mirrored.

- [ ] **Step 5: Run the focused test and commit**

Run: `node --test tests/workflow-config.test.mjs`

Commit:

```bash
git add .github/workflows README.md tests/workflow-config.test.mjs
git commit -m "ci: schedule Zhihu article index sync"
```

### Task 5: Full verification and static export review

**Files:**
- Verify: all files changed by Tasks 1-4

- [ ] **Step 1: Install dependencies from the lockfile**

Run: `npm ci`

- [ ] **Step 2: Run all tests**

Run: `node --test tests/*.test.mjs`

Expected: all tests pass, including snapshot failure preservation and workflow contracts.

- [ ] **Step 3: Run lint and production build**

Run: `npm run lint` and `npm run build`

Expected: lint exits 0 and Next.js generates static pages for `/`, `/writing/`, and every local article slug.

- [ ] **Step 4: Inspect the generated export**

Verify `out/writing/index.html` exists, external Zhihu URLs appear only as anchors, and no client bundle contains a Zhihu fetch URL or token.

- [ ] **Step 5: Check the final diff and commit**

Run: `git diff --check` and `git status --short`.

Commit any final fixes with:

```bash
git add .
git commit -m "chore: verify blog and Zhihu integration"
```

