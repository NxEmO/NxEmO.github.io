import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function listFiles(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listFiles(path) : [path];
    });
}

const sourceFiles = listFiles(join(repoRoot, "src"))
  .filter((path) => /\.(?:css|ts|tsx)$/.test(path))
  .map((path) => ({
    path: relative(repoRoot, path).replaceAll("\\", "/"),
    text: readFileSync(path, "utf8"),
  }));
const source = sourceFiles.map(({ path, text }) => `\n--- ${path}\n${text}`).join("");
const readme = readFileSync(join(repoRoot, "README.md"), "utf8");

test("uses NxEmO as the person and Whither Studio as the studio", () => {
  assert.match(source, /NxEmO — Graphics Programmer \| Whither Studio/);
  assert.match(source, /const NAMES = \["NxEmO", "Whither Studio"\]/);
  assert.match(source, /NxEmO · \{new Date\(\)\.getFullYear\(\)\}/);
  assert.match(source, /Whither Studio/);
  assert.doesNotMatch(source, /Based on Land1ngW(?:'|’|&apos;)s design/);
  assert.match(source, /Next\.js 16 · React 19 · TypeScript · GitHub Pages/);
});

test("contains none of the inherited profile or placeholder copy", () => {
  const forbidden = [
    "Test Name",
    "You-know-Who",
    'phone: "test"',
    "待修改",
    "腾讯 IEG",
    "天美 G1 工作室",
    "山西大学",
    "游戏引擎开发 · 图形渲染工程师",
    "知乎文章每日自动同步",
    "Writing section disabled",
  ];

  for (const phrase of forbidden) {
    assert.equal(source.includes(phrase), false, `found inherited copy: ${phrase}`);
  }
});

test("does not mount inherited resume, skills, or writing sections", () => {
  const page = readFileSync(join(repoRoot, "src/app/page.tsx"), "utf8");
  const resume = readFileSync(join(repoRoot, "src/lib/resume.ts"), "utf8");

  for (const component of ["Experience", "Skills", "Articles"]) {
    assert.equal(page.includes(component), false, `${component} is still mounted`);
  }

  for (const dataset of ["education", "experiences", "skills"]) {
    assert.equal(resume.includes(`export const ${dataset}`), false, `${dataset} data remains`);
  }
});

test("offers a reduced-motion mode", () => {
  const css = readFileSync(join(repoRoot, "src/app/globals.css"), "utf8");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("README accurately attributes the design without claiming article sync", () => {
  assert.match(readme, /NxEmO/);
  assert.match(readme, /Whither Studio/);
  assert.match(readme, /Land1ngW/);
  assert.match(readme, /Next\.js 16/);
  assert.equal(readme.includes("每日同步知乎文章"), false);
});
