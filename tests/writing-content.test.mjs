import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("writing index and homepage mount the unified writing section", () => {
  const page = read("src/app/writing/page.tsx");
  const homepage = read("src/app/page.tsx");
  const section = read("src/components/WritingSection.tsx");

  assert.match(page, /getWritingSummaries/);
  assert.match(homepage, /WritingSection/);
  assert.match(section, /ArticleCard/);
  assert.match(section, /No writing yet/);
});

test("sidebar provides home and writing navigation with active paths", () => {
  const sidebar = read("src/components/Sidebar.tsx");

  assert.match(sidebar, /usePathname/);
  assert.match(sidebar, /import Link from "next\/link"/);
  assert.match(sidebar, /href="\//);
  assert.match(sidebar, /href="\/writing\//);
  assert.match(sidebar, /<Link href="\//);
  assert.match(sidebar, /sidebar-link active/);
  assert.match(sidebar, /startsWith\("\/articles\/"\)/);
});

test("article cards label sources and protect external links", () => {
  const card = read("src/components/ArticleCard.tsx");

  assert.match(card, /Zhihu/);
  assert.match(card, /target: \"_blank\"/);
  assert.match(card, /rel: \"noopener noreferrer\"/);
  assert.match(card, /\/articles\//);
});
