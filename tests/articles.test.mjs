import assert from "node:assert/strict";
import test from "node:test";

const { parseArticle } = await import("../src/lib/articles.ts");

test("parses article frontmatter and renders a paragraph", async () => {
  const article = await parseArticle(
    `---
title: Graphics Notes
excerpt: A short note about rendering.
date: 2026-08-17
slug: graphics-notes
---

Hello **rendering**.
`,
    "graphics-notes.md"
  );

  assert.deepEqual(
    {
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      publishedAt: article.publishedAt,
    },
    {
      title: "Graphics Notes",
      excerpt: "A short note about rendering.",
      slug: "graphics-notes",
      publishedAt: "2026-08-17T00:00:00.000Z",
    }
  );
  assert.match(article.html, /<p>Hello <strong>rendering<\/strong>\.<\/p>/);
});

test("rejects article frontmatter without a title", async () => {
  await assert.rejects(
    () =>
      parseArticle(
        `---
excerpt: Missing title.
date: 2026-08-17
---

Body.
`,
        "missing-title.md"
      ),
    /missing required frontmatter: title/
  );
});

