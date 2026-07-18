# NxEmO Brand Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将主页彻底去模板化，只展示已确认的 NxEmO、Whither Studio 和联系方式，并删除原作者履历与文章内容。

**Architecture:** 保留现有 Next.js 单页与视觉组件，只缩减页面数据和区块。使用 Node 内置测试对源码中的品牌契约和禁用内容做回归检查，再以 ESLint、生产构建和响应式检查验证实现。

**Tech Stack:** Next.js 16、React 19、TypeScript、CSS、Node.js `node:test`

## Global Constraints

- 主身份必须是 `NxEmO`，工作室必须是 `Whither Studio`。
- `Land1ngW` 只能作为设计来源致谢出现。
- 不保留原作者的教育、工作经历、技能、文章或职位头衔。
- 不新增未经用户确认的个人信息、履历或技术能力。
- 不新增依赖，不改变静态导出与 GitHub Pages 部署结构。

---

### Task 1: Add brand-content regression tests

**Files:**
- Create: `tests/brand-content.test.mjs`

**Interfaces:**
- Consumes: repository source files under `src/` and `README.md`
- Produces: a Node test suite executed with `node --test tests/brand-content.test.mjs`

- [ ] **Step 1: Write the failing tests**

Create a test that recursively reads text files under `src/` and asserts that confirmed brand copy exists, inherited profile phrases do not exist, removed sections are not mounted, and reduced-motion CSS exists.

- [ ] **Step 2: Run the tests to verify RED**

Run: `node --test tests/brand-content.test.mjs`

Expected: FAIL because `Test Name`、`待修改`、腾讯/山西大学履历、旧区块引用和旧页脚声明仍存在。

- [ ] **Step 3: Commit the failing contract test**

Run:

```bash
git add tests/brand-content.test.mjs
git commit -m "test: define NxEmO homepage content contract"
```

### Task 2: Replace inherited profile content with confirmed brands

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/lib/resume.ts`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/TypewriterTitle.tsx`
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/components/MobileTopbar.tsx`
- Modify: `src/components/Footer.tsx`
- Delete: `src/components/Experience.tsx`
- Delete: `src/components/Skills.tsx`
- Delete: `src/components/Articles.tsx`

**Interfaces:**
- Consumes: `profile` and `navSections` from `src/lib/resume.ts`
- Produces: a minimal homepage containing only confirmed identity, studio, GitHub and email information

- [ ] **Step 1: Implement the minimal content changes**

Set metadata title to `NxEmO — Graphics Programmer | Whither Studio`; reduce profile data to `name`, `studio`, `email`, and `github`; make navigation home-only; remove Experience/Skills/Articles from the page; remove the education card and inherited role claims; set the hero copy to `Game Developer · Whither Studio`; and make the typewriter rotate only `NxEmO` and `Whither Studio`.

- [ ] **Step 2: Fix React lint issues while preserving behavior**

Move the empty-string typewriter transition into the timer callback so no effect body calls state setters synchronously. Remove unused icon and state declarations.

- [ ] **Step 3: Run the brand-content tests to verify GREEN**

Run: `node --test tests/brand-content.test.mjs`

Expected: all tests pass.

- [ ] **Step 4: Commit the homepage content changes**

Run:

```bash
git add src tests/brand-content.test.mjs
git commit -m "feat: align homepage with NxEmO brand"
```

### Task 3: Improve motion and copy fidelity

**Files:**
- Modify: `src/app/globals.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: current CSS variables and animation class names
- Produces: readable secondary text, reduced-motion behavior, and accurate project documentation

- [ ] **Step 1: Add reduced-motion behavior and improve secondary text**

Change `--text-3` from `#4a5568` to a readable blue-gray and add `@media (prefers-reduced-motion: reduce)` rules that disable smooth scrolling, CSS animations and nonessential transitions.

- [ ] **Step 2: Update README**

State that the site is NxEmO's homepage and Whither Studio presence, based on Land1ngW's design, built with Next.js 16, and deployed to GitHub Pages. Do not claim article synchronization.

- [ ] **Step 3: Run the brand-content tests**

Run: `node --test tests/brand-content.test.mjs`

Expected: all tests pass.

- [ ] **Step 4: Commit accessibility and documentation changes**

Run:

```bash
git add src/app/globals.css README.md
git commit -m "chore: refine motion and project attribution"
```

### Task 4: Full verification

**Files:**
- Verify: all changed files

**Interfaces:**
- Consumes: completed implementation
- Produces: evidence that the static site is clean and buildable

- [ ] **Step 1: Run tests**

Run: `node --test tests/brand-content.test.mjs`

Expected: 0 failures.

- [ ] **Step 2: Run lint**

Run: `eslint .`

Expected: 0 errors and 0 warnings.

- [ ] **Step 3: Run the production build**

Run: `next build`

Expected: successful static generation of `/` and `/_not-found`.

- [ ] **Step 4: Inspect the final diff and forbidden strings**

Run: `git diff --check` and search `src/` for the removed template phrases.

Expected: no whitespace errors and no inherited profile content.

- [ ] **Step 5: Check responsive layout**

Serve the built static export and inspect desktop, 390px and 320px viewports for horizontal overflow and visible brand hierarchy.

Expected: no horizontal overflow; NxEmO is the primary name and Whither Studio is visibly secondary.
