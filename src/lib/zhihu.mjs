const ZHIHU_URL = /^https:\/\/(?:zhuanlan\.zhihu\.com|www\.zhihu\.com)\//;

function asRecord(value, index) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Zhihu article ${index + 1} must be an object`);
  }
  return value;
}

function requiredString(record, keys, label, index) {
  for (const key of keys) {
    if (typeof record[key] === "string" && record[key].trim() !== "") {
      return record[key].trim();
    }
  }
  throw new Error(`Zhihu article ${index + 1} is missing ${label}`);
}

function normalizeDate(record, index) {
  const value = record.publishedAt ?? record.published_at ?? record.date;
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Zhihu article ${index + 1} has an invalid publishedAt`);
  }
  return date.toISOString();
}

function deduplicate(items) {
  const ids = new Set();
  const urls = new Set();
  return items.filter((item) => {
    if (ids.has(item.id) || (item.externalUrl && urls.has(item.externalUrl))) return false;
    ids.add(item.id);
    if (item.externalUrl) urls.add(item.externalUrl);
    return true;
  });
}

function newestFirst(items) {
  return [...items].sort((a, b) => {
    const dateOrder = b.publishedAt.localeCompare(a.publishedAt);
    return dateOrder || a.id.localeCompare(b.id);
  });
}

export function normalizeZhihuArticles(input) {
  const records = Array.isArray(input)
    ? input
    : input && typeof input === "object" && Array.isArray(input.articles)
      ? input.articles
      : null;

  if (!records) throw new Error("Zhihu response must be an array or an object with an articles array");

  const articles = records.map((value, index) => {
    const record = asRecord(value, index);
    const externalUrl = requiredString(record, ["externalUrl", "url", "link"], "an externalUrl", index);
    if (!ZHIHU_URL.test(externalUrl)) {
      throw new Error(`Zhihu article ${index + 1} has an unsupported externalUrl`);
    }

    return {
      id: requiredString(record, ["id", "articleId"], "an id", index),
      title: requiredString(record, ["title", "name"], "a title", index),
      excerpt: requiredString(record, ["excerpt", "summary", "description"], "an excerpt", index),
      publishedAt: normalizeDate(record, index),
      source: "zhihu",
      externalUrl,
    };
  });

  return newestFirst(deduplicate(articles));
}

export function mergeArticleSummaries(local, zhihu) {
  return newestFirst(deduplicate([...local, ...zhihu]));
}

