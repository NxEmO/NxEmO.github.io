import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { normalizeZhihuApiResponse, normalizeZhihuArticles } from "../src/lib/zhihu.mjs";

const DEFAULT_SNAPSHOT_PATH = path.resolve("data/zhihu.json");
const DEFAULT_API_URL = "https://developer.zhihu.com/api/v1/user/contents";

async function readExisting(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

export async function syncZhihu({
  sourceUrl = process.env.ZHIHU_API_URL || DEFAULT_API_URL,
  token = process.env.ZHIHU_API_TOKEN,
  snapshotPath = DEFAULT_SNAPSHOT_PATH,
  fetchImpl = fetch,
  now = () => Math.floor(Date.now() / 1000),
} = {}) {
  if (!token) {
    console.log("::notice::ZHIHU_API_TOKEN is not configured; keeping the current snapshot.");
    return { updated: false, skipped: true, count: 0 };
  }

  const allArticles = [];
  let offset = "0";

  while (true) {
    const requestUrl = new URL(sourceUrl);
    requestUrl.searchParams.set("ContentType", "article");
    requestUrl.searchParams.set("Limit", "50");
    requestUrl.searchParams.set("SortField", "ts");
    requestUrl.searchParams.set("SortOrder", "desc");
    if (offset !== "0") requestUrl.searchParams.set("Offset", offset);

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Request-Timestamp": String(now()),
    };
    const response = await fetchImpl(requestUrl, { headers });
    if (!response.ok) {
      throw new Error(`Zhihu sync failed with HTTP ${response.status}`);
    }

    const page = normalizeZhihuApiResponse(await response.json());
    allArticles.push(...page.articles);
    if (page.isEnd || !page.nextOffset) break;
    if (page.nextOffset === offset) throw new Error("Zhihu API pagination did not advance");
    offset = page.nextOffset;
  }

  const articles = normalizeZhihuArticles(allArticles);
  const nextSnapshot = `${JSON.stringify(articles, null, 2)}\n`;
  const currentSnapshot = await readExisting(snapshotPath);
  if (currentSnapshot === nextSnapshot) {
    return { updated: false, skipped: false, count: articles.length };
  }

  const temporaryPath = `${snapshotPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, nextSnapshot, "utf8");
  await rename(temporaryPath, snapshotPath);
  return { updated: true, skipped: false, count: articles.length };
}

const invokedFile = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedFile) {
  syncZhihu().catch((error) => {
    console.error(`::error::${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
