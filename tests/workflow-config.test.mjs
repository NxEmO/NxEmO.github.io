import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Zhihu sync workflow runs on a schedule with repository write access", () => {
  const workflow = read(".github/workflows/sync-zhihu.yml");

  assert.match(workflow, /cron:\s*["']17 3 \* \* \*["']/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /contents:\s*write/);
  assert.match(workflow, /ZHIHU_ARTICLES_URL/);
  assert.match(workflow, /ZHIHU_API_TOKEN/);
  assert.match(workflow, /npm run sync:zhihu/);
});

test("deployment workflow has no stale Zhihu scraper trigger", () => {
  const workflow = read(".github/workflows/deploy.yml");

  assert.doesNotMatch(workflow, /Scrape Zhihu Articles/);
  assert.match(workflow, /branches:\s*\[main\]/);
});

