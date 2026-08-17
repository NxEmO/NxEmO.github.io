# Sidebar Writing Navigation Design

## Goal

Add a desktop sidebar navigation that links to the homepage and the complete writing index, with the current page visibly highlighted.

## User experience

- The sidebar shows `Home` and `Writing` on both the homepage and the writing index.
- `Home` links to `/` so it returns from any page, including `/writing/` and article detail pages.
- `Writing` links to `/writing/` and shows every article already returned by `getWritingSummaries()`.
- The active destination uses the existing `.sidebar-link.active` styling.
- The existing mobile top bar remains unchanged because this request is scoped to the desktop sidebar.

## Architecture

`Sidebar` becomes a small client component and reads the current pathname with Next.js `usePathname()`. It renders stable absolute links instead of hash links, so static GitHub Pages output works consistently on the homepage, writing index, and article routes. The existing `/writing/` page and `WritingSection` remain the single source of truth for the article list.

## Active-state rules

- `/` is active only on the exact homepage path.
- `/writing/` and `/articles/<slug>/` treat `Writing` as active, so article detail pages remain within the writing area.
- A trailing slash is normalized before comparison because GitHub Pages serves static routes with trailing slashes.

## Testing

Add source-level tests that assert the sidebar exposes the two absolute links, uses `usePathname`, applies the active class, and that the brand points to `/`. Keep the existing writing-content tests for the writing index and article cards. Run the full Node test suite, TypeScript no-emit check, ESLint, and `git diff --check` before pushing.

## Scope exclusions

- No changes to article data synchronization.
- No changes to mobile navigation or responsive layout.
- No new dependencies.
