import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const { normalizeZhihuArticles, mergeArticleSummaries } = await import("../src/lib/zhihu.ts");
const { syncZhihu } = await import("../scripts/sync-zhihu.mjs");

test("normalizes and deduplicates Zhihu article records", () => {
  const articles = normalizeZhihuArticles([
    {
      id: "first",
      title: "First",
      excerpt: "A short summary.",
      publishedAt: "2026-08-17T00:00:00.000Z",
      url: "https://zhuanlan.zhihu.com/p/100",
    },
    {
      id: "first",
      title: "Duplicate",
      excerpt: "Should be ignored.",
      publishedAt: "2026-08-16T00:00:00.000Z",
      url: "https://zhuanlan.zhihu.com/p/100",
    },
  ]);

  assert.deepEqual(articles, [
    {
      id: "first",
      title: "First",
      excerpt: "A short summary.",
      publishedAt: "2026-08-17T00:00:00.000Z",
      source: "zhihu",
      externalUrl: "https://zhuanlan.zhihu.com/p/100",
    },
  ]);
});

test("rejects malformed Zhihu records", () => {
  assert.throws(
    () =>
      normalizeZhihuArticles([
        {
          id: "bad",
          title: "Missing URL",
          excerpt: "No URL.",
          publishedAt: "2026-08-17T00:00:00.000Z",
        },
      ]),
    /externalUrl|url/
  );
});

test("merges local and Zhihu summaries newest first without mutation", () => {
  const local = [
    {
      id: "local",
      title: "Local",
      excerpt: "Local article.",
      publishedAt: "2026-08-16T00:00:00.000Z",
      source: "site",
      slug: "local",
    },
  ];
  const zhihu = [
    {
      id: "zhihu",
      title: "Zhihu",
      excerpt: "Zhihu article.",
      publishedAt: "2026-08-17T00:00:00.000Z",
      source: "zhihu",
      externalUrl: "https://zhuanlan.zhihu.com/p/101",
    },
  ];

  assert.deepEqual(mergeArticleSummaries(local, zhihu).map((item) => item.id), ["zhihu", "local"]);
  assert.deepEqual(local.map((item) => item.id), ["local"]);
});

test("keeps the previous snapshot when sync fails", async () => {
  const directory = await mkdtemp(path.join(process.cwd(), ".tmp-zhihu-"));
  const snapshotPath = path.join(directory, "zhihu.json");
  const previous = JSON.stringify([{ id: "old" }]);
  await writeFile(snapshotPath, previous, "utf8");

  await assert.rejects(
    () =>
      syncZhihu({
        sourceUrl: "https://example.invalid/articles",
        snapshotPath,
        fetchImpl: async () => {
          throw new Error("network unavailable");
        },
      }),
    /network unavailable/
  );

  assert.equal(await readFile(snapshotPath, "utf8"), previous);
  await rm(directory, { recursive: true, force: true });
});
