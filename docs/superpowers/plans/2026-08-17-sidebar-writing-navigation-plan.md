# Sidebar Writing Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add desktop sidebar links for `Home` and `Writing`, with path-aware active highlighting and homepage return behavior.

**Architecture:** Keep the existing static `/writing/` route and article data flow. Convert `Sidebar` into a small client component that reads `usePathname()`, normalizes trailing slashes, and marks `Home` active for `/` or `Writing` active for `/writing/` and `/articles/<slug>/`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS modules via `src/app/globals.css`, Node test runner.

## Global Constraints

- Keep the feature desktop-only; do not alter `MobileTopbar` or responsive layout.
- Use absolute static links: `/` and `/writing/`.
- Reuse the existing `.sidebar-link` and `.sidebar-link.active` styles.
- Do not add dependencies or change article synchronization.
- Verify with the full Node test suite, TypeScript no-emit, ESLint, and `git diff --check`.

### Task 1: Add failing sidebar navigation tests

**Files:**
- Modify: `tests/writing-content.test.mjs`
- Test: `tests/writing-content.test.mjs`

**Interfaces:**
- Consumes: the existing source-file reader and Node `assert`/`test` imports.
- Produces: regression coverage for the sidebar's links and active-path logic.

- [x] **Step 1: Write the failing test**

Add this test after the existing writing-index test:

```js
test("sidebar provides home and writing navigation with active paths", () => {
  const sidebar = read("src/components/Sidebar.tsx");

  assert.match(sidebar, /usePathname/);
  assert.match(sidebar, /href="\\/"/);
  assert.match(sidebar, /href="\\/writing\\/"/);
  assert.match(sidebar, /sidebar-link active/);
  assert.match(sidebar, /startsWith\\("\\/articles\\/"\\)/);
});
```

- [x] **Step 2: Run the focused test to verify it fails**

Run:

```powershell
$node='C:\\Users\\郭\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe'
& $node --experimental-strip-types --test --test-isolation=none tests/writing-content.test.mjs
```

Expected: FAIL because `Sidebar.tsx` does not yet import `usePathname` or render navigation links.

### Task 2: Implement path-aware sidebar navigation

**Files:**
- Modify: `src/components/Sidebar.tsx`

**Interfaces:**
- Consumes: `profile` from `@/lib/resume`, Next.js `usePathname()`.
- Produces: a sidebar with absolute `Home` and `Writing` links and active classes.

- [x] **Step 1: Add client pathname state and path normalization**

At the top of `Sidebar.tsx`, add the client directive and import:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { profile } from "@/lib/resume";
```

Inside the component, derive the normalized route and active states:

```tsx
const pathname = usePathname();
const normalizedPath = pathname.replace(/\\/+$/, "") || "/";
const homeActive = normalizedPath === "/";
const writingActive =
  normalizedPath === "/writing" || normalizedPath.startsWith("/articles/");
```

- [x] **Step 2: Make the brand return to the homepage and render the nav**

Change the brand link to `href="/"`, replace the empty `.sidebar-nav` div with:

```tsx
<nav className="sidebar-nav" aria-label="Primary navigation">
  <a className={`sidebar-link${homeActive ? " active" : ""}`} href="/">
    Home
  </a>
  <a className={`sidebar-link${writingActive ? " active" : ""}`} href="/writing/">
    Writing
  </a>
</nav>
```

Keep the existing tagline and footer unchanged.

- [x] **Step 3: Run the focused test to verify it passes**

Run the Task 1 command again. Expected: all writing-content tests PASS.

### Task 3: Run the complete verification suite

**Files:**
- No additional files.

**Interfaces:**
- Consumes: the completed sidebar implementation and regression tests.
- Produces: verified source ready to commit and deploy.

- [x] **Step 1: Run all tests**

```powershell
$node='C:\\Users\\郭\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe'
& $node --experimental-strip-types --test --test-isolation=none tests/*.test.mjs
```

Expected: all tests PASS.

- [x] **Step 2: Run type, lint, and whitespace checks**

```powershell
$node='C:\\Users\\郭\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe'
$env:Path='C:\\Users\\郭\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin;'+$env:Path
& $node node_modules\\typescript\\bin\\tsc --noEmit
& $node node_modules\\eslint\\bin\\eslint.js .
git diff --check
```

Expected: each command exits successfully with no diagnostics.

### Task 4: Commit and deploy

**Files:**
- Commit: `docs/superpowers/specs/2026-08-17-sidebar-writing-navigation-design.md`, `docs/superpowers/plans/2026-08-17-sidebar-writing-navigation-plan.md`, `tests/writing-content.test.mjs`, `src/components/Sidebar.tsx`

**Interfaces:**
- Consumes: verified navigation changes.
- Produces: a `main` branch commit deployed by the existing GitHub Pages workflow.

- [x] **Step 1: Review the worktree and commit**

```powershell
git status --short
git diff --check
git add src/components/Sidebar.tsx tests/writing-content.test.mjs docs/superpowers/plans/2026-08-17-sidebar-writing-navigation-plan.md
git commit -m "feat: add sidebar writing navigation"
```

- [x] **Step 2: Push the verified commit**

```powershell
git push origin main
```

Expected: push advances `main`; GitHub Actions deploys the updated static site.
