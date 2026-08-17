import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const { normalizeZhihuApiResponse, normalizeZhihuArticles, mergeArticleSummaries } = await import("../src/lib/zhihu.mjs");
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

test("normalizes an official Zhihu user contents response", () => {
  const createdAt = Math.floor(Date.parse("2026-08-17T00:00:00.000Z") / 1000);

  assert.deepEqual(
    normalizeZhihuApiResponse({
      Code: 0,
      Data: {
        Items: [
          {
            ContentType: "article",
            Url: "https://zhuanlan.zhihu.com/p/100",
            CreatedAt: createdAt,
            Title: "Official article",
            Summary: "Official summary.",
          },
        ],
        Paging: { IsEnd: false, NextOffset: "50", Totals: 51 },
      },
    }),
    {
      articles: [
        {
          id: "https://zhuanlan.zhihu.com/p/100",
          title: "Official article",
          excerpt: "Official summary.",
          publishedAt: "2026-08-17T00:00:00.000Z",
          source: "zhihu",
          externalUrl: "https://zhuanlan.zhihu.com/p/100",
        },
      ],
      isEnd: false,
      nextOffset: "50",
    }
  );
});

test("syncs all official Zhihu pages with bearer auth and a timestamp", async () => {
  const directory = await mkdtemp(path.join(process.cwd(), ".tmp-zhihu-api-"));
  const snapshotPath = path.join(directory, "zhihu.json");
  const responses = [
    {
      ok: true,
      status: 200,
      json: async () => ({
        Code: 0,
        Data: {
          Items: [{ ContentType: "article", Url: "https://zhuanlan.zhihu.com/p/100", CreatedAt: 1776297600, Title: "First", Summary: "One" }],
          Paging: { IsEnd: false, NextOffset: "50", Totals: 2 },
        },
      }),
    },
    {
      ok: true,
      status: 200,
      json: async () => ({
        Code: 0,
        Data: {
          Items: [{ ContentType: "article", Url: "https://zhuanlan.zhihu.com/p/101", CreatedAt: 1776211200, Title: "Second", Summary: "Two" }],
          Paging: { IsEnd: true, Totals: 2 },
        },
      }),
    },
  ];
  const calls = [];

  const result = await syncZhihu({
    sourceUrl: "https://developer.zhihu.com/api/v1/user/contents",
    token: "test-token",
    now: () => 1776384000,
    snapshotPath,
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return responses.shift();
    },
  });

  assert.equal(result.count, 2);
  assert.equal(calls.length, 2);
  assert.equal(new URL(calls[0].url).searchParams.get("ContentType"), "article");
  assert.equal(new URL(calls[0].url).searchParams.get("Limit"), "50");
  assert.equal(new URL(calls[1].url).searchParams.get("Offset"), "50");
  assert.equal(calls[0].options.headers.Authorization, "Bearer test-token");
  assert.equal(calls[0].options.headers["X-Request-Timestamp"], "1776384000");
  assert.match(await readFile(snapshotPath, "utf8"), /First/);

  await rm(directory, { recursive: true, force: true });
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
        token: "test-token",
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
