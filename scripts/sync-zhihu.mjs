import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { normalizeZhihuArticles } from "../src/lib/zhihu.ts";

const DEFAULT_SNAPSHOT_PATH = path.resolve("data/zhihu.json");

async function readExisting(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

export async function syncZhihu({
  sourceUrl = process.env.ZHIHU_ARTICLES_URL,
  token = process.env.ZHIHU_API_TOKEN,
  snapshotPath = DEFAULT_SNAPSHOT_PATH,
  fetchImpl = fetch,
} = {}) {
  if (!sourceUrl) {
    console.log("::notice::ZHIHU_ARTICLES_URL is not configured; keeping the current snapshot.");
    return { updated: false, skipped: true, count: 0 };
  }

  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetchImpl(sourceUrl, { headers });
  if (!response.ok) {
    throw new Error(`Zhihu sync failed with HTTP ${response.status}`);
  }

  const articles = normalizeZhihuArticles(await response.json());
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

