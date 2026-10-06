# Intro, Blog and Top Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a context-con-style personal intro to the home page, replace the Learning page with a Markdown blog, and replace the dock/mobile menu with one plain top bar.

**Architecture:** Next.js 16 App Router, pages stay Server Components. The blog reads `content/blog/*.md` at build time through `lib/blog.ts` (gray-matter + marked) and is statically generated. The intro is one client component overlaying the home page, gated per session by an inline `<head>` script that sets `data-intro="skip"` on `<html>` before first paint. The top bar is one client component reading `content/navigation.ts`.

**Tech Stack:** Next.js 16.3.2, React 19.2, Tailwind CSS v4 (CSS-first `@theme`/`@utility`), TypeScript, Vitest (new, unit tests for `lib/blog.ts` only), gray-matter, marked.

**Spec:** `docs/superpowers/specs/2026-10-06-intro-blog-nav-design.md`

## Global Constraints

- Read `AGENTS.md` first. Next 16 differs from training data; dynamic `params` is a `Promise` and must be awaited. Type pages with the global `PageProps<'/blog/[slug]'>` helper.
- Colours and typefaces are defined only in `app/styles/tokens.css`. Never hardcode a hex value in a component; use Tailwind tokens (`text-ink`, `bg-ground`, `text-blue`, `border-rule`, `text-label`) or `var(--…)`.
- `"use client"` only on the small interactive component. Pages stay Server Components.
- Every `useEffect` that subscribes must clean up (timers, listeners, style changes).
- Every interaction needs a keyboard path, a visible focus state (`focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue`), and a `prefers-reduced-motion` fallback.
- Light design only. No dark-mode variants.
- `globals.css` only contains `@import`s.
- About, Sport, Projects, Contact keep their content and look; only spacing that existed for the old bottom dock changes.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Map

| File | Status | Responsibility |
| --- | --- | --- |
| `lib/blog.ts` | create | Parse/validate/render Markdown posts; list and look up posts |
| `lib/blog.test.ts` | create | Unit tests for `lib/blog.ts` |
| `vitest.config.ts` | create | Vitest config (node environment) |
| `content/blog/hello-world.md` | create | Sample post |
| `app/blog/page.tsx` | create | Post list |
| `app/blog/[slug]/page.tsx` | create | Single post |
| `app/styles/blog.css` | create | Article typography |
| `app/learning/`, `components/learning/`, `content/learning.ts`, `lib/network.ts`, `app/styles/network.css` | delete | Learning page |
| `lib/blooms.ts` | modify | `/learning` key → `/blog`; prefix fallback for `/blog/<slug>` |
| `content/navigation.ts` | modify | Links: drop Home, Learning → Blog, new order |
| `components/nav/TopBar.tsx` | create | Sticky top navigation |
| `components/nav/Nav.tsx` | modify | Render `TopBar` only |
| `components/nav/DesktopDock.tsx`, `components/nav/MobileMenu.tsx`, `app/styles/menu.css` | delete | Old navigation |
| `app/styles/nav.css` | create | `--bar-h` and `h-page`/`min-h-page` utilities |
| `app/layout.tsx` | modify | Nav before children; intro gate script in `<head>` |
| `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `components/projects/ProjectsBoard.tsx`, `components/sport/SportTimeline.tsx` | modify | Heights/paddings for a top bar instead of a bottom dock |
| `content/home.ts` | create | Intro copy and photo list |
| `lib/intro.ts` | create | Session key + inline gate script string |
| `components/home/Intro.tsx` | create | Intro overlay (client) |
| `app/styles/intro.css` | create | Intro layout and keyframes |
| `public/intro/me-1.jpg … me-3.jpg` | create | Placeholder photos (copies of sport photos) |
| `app/globals.css` | modify | Import list |

---

### Task 0: Restore local tooling config

The `.claude/` folder (dev-server `launch.json`, settings) was untracked and got stashed with the old WIP. Restore only that folder.

- [ ] **Step 1:** Run `git checkout stash@{0}^3 -- .claude 2>/dev/null || git restore --source='stash@{0}^3' -- .claude` then `git reset -q .claude` so it stays untracked. Expected: `ls .claude` lists files. If `.claude/launch.json` does not exist, create it:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 3000 }
  ]
}
```

No commit (untracked tooling).

---

### Task 1: Blog library

**Files:**
- Create: `lib/blog.ts`, `lib/blog.test.ts`, `vitest.config.ts`
- Modify: `package.json` (deps + `test` script)

**Interfaces:**
- Produces:
  - `type PostMeta = { slug: string; title: string; date: string; summary: string; draft: boolean }`
  - `type Post = PostMeta & { html: string }`
  - `parsePost(slug: string, source: string): Post` — throws `Error` mentioning `${slug}.md` when `title`, `date` or `summary` is missing/invalid
  - `getAllPosts(options?: { dir?: string; includeDrafts?: boolean }): PostMeta[]` — newest first; `includeDrafts` defaults to `process.env.NODE_ENV !== "production"`
  - `getPost(slug: string, options?: { dir?: string; includeDrafts?: boolean }): Post | null`
  - `formatDate(date: string): string` — `"2026-10-06"` → `"6 October 2026"`
  - `BLOG_DIR: string` — absolute path to `content/blog`

- [ ] **Step 1: Install dependencies**

Run: `npm install gray-matter marked && npm install -D vitest`
Then add to `package.json` `scripts`: `"test": "vitest run"`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Write the failing tests — `lib/blog.test.ts`**

```ts
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { formatDate, getAllPosts, getPost, parsePost } from "./blog";

const post = (fm: string, body = "Hello **world**.") => `---\n${fm}\n---\n\n${body}\n`;

function fixtureDir(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "blog-"));
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
  return dir;
}

describe("parsePost", () => {
  it("reads front matter and renders markdown", () => {
    const p = parsePost("first", post('title: First\ndate: 2026-10-06\nsummary: "A start."'));
    expect(p).toMatchObject({ slug: "first", title: "First", date: "2026-10-06", summary: "A start.", draft: false });
    expect(p.html).toContain("<strong>world</strong>");
  });

  it("keeps an unquoted YAML date as YYYY-MM-DD", () => {
    expect(parsePost("d", post("title: D\ndate: 2026-01-02\nsummary: S")).date).toBe("2026-01-02");
  });

  it("names the file when a field is missing", () => {
    expect(() => parsePost("broken", post("title: X\ndate: 2026-10-06"))).toThrow(/broken\.md.*summary/);
  });

  it("rejects a malformed date", () => {
    expect(() => parsePost("bad", post("title: X\ndate: 6.10.2026\nsummary: S"))).toThrow(/bad\.md.*date/);
  });

  it("reads draft: true", () => {
    expect(parsePost("d", post("title: D\ndate: 2026-01-02\nsummary: S\ndraft: true")).draft).toBe(true);
  });
});

describe("getAllPosts / getPost", () => {
  const dir = fixtureDir({
    "older.md": post("title: Older\ndate: 2025-05-01\nsummary: O"),
    "newer.md": post("title: Newer\ndate: 2026-02-01\nsummary: N"),
    "secret.md": post("title: Secret\ndate: 2026-09-01\nsummary: S\ndraft: true"),
    "notes.txt": "ignored",
  });

  it("lists posts newest first without drafts", () => {
    expect(getAllPosts({ dir, includeDrafts: false }).map((p) => p.slug)).toEqual(["newer", "older"]);
  });

  it("includes drafts when asked", () => {
    expect(getAllPosts({ dir, includeDrafts: true }).map((p) => p.slug)).toEqual(["secret", "newer", "older"]);
  });

  it("finds a post by slug", () => {
    expect(getPost("newer", { dir, includeDrafts: false })?.title).toBe("Newer");
  });

  it("returns null for unknown, hidden-draft or unsafe slugs", () => {
    expect(getPost("missing", { dir, includeDrafts: false })).toBeNull();
    expect(getPost("secret", { dir, includeDrafts: false })).toBeNull();
    expect(getPost("../package", { dir, includeDrafts: true })).toBeNull();
  });

  it("returns an empty list when the folder does not exist", () => {
    expect(getAllPosts({ dir: join(dir, "nope") })).toEqual([]);
  });
});

describe("formatDate", () => {
  it("formats in British English, independent of timezone", () => {
    expect(formatDate("2026-10-06")).toBe("6 October 2026");
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./blog`.

- [ ] **Step 5: Implement `lib/blog.ts`**

```ts
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * The blog.
 *
 * One post is one Markdown file in content/blog. The file name is the URL
 * slug; the front matter carries title, date (YYYY-MM-DD) and summary, and
 * `draft: true` keeps a post out of production builds. Publishing is
 * committing the file.
 *
 * Posts are written by the site owner and committed to the repo, so the
 * rendered HTML is trusted and not sanitised.
 */

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  draft: boolean;
};

export type Post = PostMeta & { html: string };

type Options = { dir?: string; includeDrafts?: boolean };

export const BLOG_DIR = join(process.cwd(), "content", "blog");

const SLUG = /^[a-z0-9-]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function requireString(slug: string, field: string, value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`content/blog/${slug}.md: missing "${field}" in front matter`);
  }
  return value.trim();
}

/** YAML turns an unquoted 2026-10-06 into a Date; bring it back to text. */
function toIsoDate(slug: string, value: unknown): string {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  if (typeof text !== "string" || !ISO_DATE.test(text)) {
    throw new Error(`content/blog/${slug}.md: "date" must be YYYY-MM-DD`);
  }
  return text;
}

export function parsePost(slug: string, source: string): Post {
  const { data, content } = matter(source);
  return {
    slug,
    title: requireString(slug, "title", data.title),
    date: toIsoDate(slug, data.date),
    summary: requireString(slug, "summary", data.summary),
    draft: data.draft === true,
    html: marked.parse(content, { async: false }),
  };
}

function resolve(options: Options = {}) {
  return {
    dir: options.dir ?? BLOG_DIR,
    includeDrafts: options.includeDrafts ?? process.env.NODE_ENV !== "production",
  };
}

function readPost(dir: string, slug: string): Post {
  return parsePost(slug, readFileSync(join(dir, `${slug}.md`), "utf8"));
}

export function getAllPosts(options?: Options): PostMeta[] {
  const { dir, includeDrafts } = resolve(options);
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readPost(dir, file.slice(0, -3)))
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ html: _html, ...meta }) => meta);
}

export function getPost(slug: string, options?: Options): Post | null {
  const { dir, includeDrafts } = resolve(options);
  if (!SLUG.test(slug) || !existsSync(join(dir, `${slug}.md`))) return null;

  const post = readPost(dir, slug);
  return includeDrafts || !post.draft ? post : null;
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: all tests PASS. Then `npm run lint` — if it flags `_html` as unused, replace the destructuring map with `.map((post) => ({ slug: post.slug, title: post.title, date: post.date, summary: post.summary, draft: post.draft }))`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/blog.ts lib/blog.test.ts
git commit -m "feat(blog): markdown post library with tests"
```

---

### Task 2: Blog pages, and Learning removed

**Files:**
- Create: `content/blog/hello-world.md`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/styles/blog.css`
- Modify: `app/globals.css`, `lib/blooms.ts`, `content/navigation.ts`, `app/styles/tokens.css`
- Delete: `app/learning/`, `components/learning/`, `content/learning.ts`, `lib/network.ts`, `app/styles/network.css`

**Interfaces:**
- Consumes: `getAllPosts`, `getPost`, `formatDate`, `PostMeta` from `@/lib/blog`.
- Produces: `NAV_LINKS` = About, Projects, Blog, Sport, Contact (Home removed). `isActiveRoute` unchanged.

- [ ] **Step 1: Sample post — `content/blog/hello-world.md`**

```md
---
title: Hello, world
date: 2026-10-06
summary: Why this blog exists and what will end up here.
---

This is where I write things down — about building software, about sport,
and about whatever I am learning at the moment.

## How posts work

Every post is a Markdown file in the repository. Writing a post means adding
a file; publishing it means committing it.

- Short notes are fine.
- Long essays are fine too.

> Small details, repeated for years.
```

- [ ] **Step 2: List page — `app/blog/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Christopher Weidner",
  description: "Notes on building software, sport and what I am learning.",
};

export default function Blog() {
  const posts = getAllPosts();

  return (
    <main className="flex-1 px-6 pb-16 pt-12">
      <div className="mx-auto w-full max-w-[68ch]">
        <h1 className="reveal font-serif text-era leading-none tracking-[-0.02em]">Blog</h1>

        {posts.length === 0 ? (
          <p className="mt-10 text-ink-faint">Nothing here yet.</p>
        ) : (
          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">
                    {formatDate(post.date)}
                  </time>
                  <h2 className="mt-2 font-serif text-[1.75rem] leading-tight transition-colors group-hover:text-blue">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed">{post.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Post page — `app/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";

/** Only the generated slugs exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return { title: `${post.title} — Christopher Weidner`, description: post.summary };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <main className="flex-1 px-6 pb-16 pt-12">
      <article className="mx-auto w-full max-w-[68ch]">
        <Link
          href="/blog"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-label transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          ← All posts
        </Link>

        <header className="mt-8">
          <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">
            {formatDate(post.date)}
          </time>
          <h1 className="mt-3 font-serif text-era leading-[1.02] tracking-[-0.02em]">{post.title}</h1>
        </header>

        <div className="prose-post mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
}
```

- [ ] **Step 4: Article typography — `app/styles/blog.css`**

```css
/* ============================================================
   BLOG ARTICLE
   Typography for rendered Markdown. Scoped to .prose-post so it
   never leaks into the rest of the site.
   ============================================================ */

.prose-post {
  font-size: 17px;
  line-height: 1.7;
  color: var(--ink-soft);
}

.prose-post > * + * { margin-top: 1.25em; }

.prose-post h2,
.prose-post h3 {
  font-family: var(--font-serif);
  line-height: 1.15;
  margin-top: 2em;
}
.prose-post h2 { font-size: 2rem; }
.prose-post h3 { font-size: 1.5rem; }

.prose-post a {
  color: var(--blue);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose-post a:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 3px;
}

.prose-post ul,
.prose-post ol { padding-left: 1.25em; }
.prose-post ul { list-style: disc; }
.prose-post ol { list-style: decimal; }
.prose-post li + li { margin-top: 0.4em; }

.prose-post blockquote {
  border-left: 2px solid var(--blue);
  padding-left: 1em;
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-style: italic;
  color: var(--ink);
}

.prose-post code {
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: var(--ground-soft);
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 0.1em 0.35em;
}
.prose-post pre {
  overflow-x: auto;
  background: var(--ground-soft);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 1em;
}
.prose-post pre code { border: 0; padding: 0; background: none; }

.prose-post img { max-width: 100%; height: auto; border-radius: 6px; }
.prose-post hr { border: 0; border-top: 1px solid var(--rule); }
```

- [ ] **Step 5: Remove Learning**

```bash
git rm -r -q app/learning components/learning content/learning.ts lib/network.ts app/styles/network.css
```

In `app/globals.css` replace the line `@import "./styles/network.css";` with `@import "./styles/blog.css";`.

Run: `grep -rn "learning\|lib/network\|--line-" app components hooks lib content --include=*.ts --include=*.tsx --include=*.css`
Expected hits: only `lib/blooms.ts` (the `/learning` key) and the `--line-1…6` definitions in `app/styles/tokens.css`. If `--line-*` has no other users, delete those six lines and their comment block from `tokens.css`. Keep `timeline.css`, `hooks/useAnchoredDrift.ts`, `lib/geometry.ts`, `lib/motion.ts` — Sport uses them.

- [ ] **Step 6: Blooms for the blog — `lib/blooms.ts`**

Rename the `"/learning"` key to `"/blog"` and update its comment's first word from `Learning` to `Blog`. Replace `bloomsFor` with:

```ts
export function bloomsFor(pathname: string): Bloom[] {
  const section = `/${pathname.split("/")[1] ?? ""}`;
  return BLOOMS[pathname] ?? BLOOMS[section] ?? BLOOMS.default;
}
```

- [ ] **Step 7: Navigation links — `content/navigation.ts`**

```ts
export const NAV_LINKS: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/sport", label: "Sport" },
  { href: "/contact", label: "Contact" },
];
```

Update the file's header comment: the links are read by the top bar (`components/nav/TopBar.tsx`); Home is reached through the name in the bar. (The old dock still compiles with this list until Task 3.)

- [ ] **Step 8: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass; build output lists `/blog` and `/blog/hello-world` as static, no `/learning`.

Start the dev server (preview_start `dev`) and check: `/blog` shows "Hello, world" with date "6 October 2026"; clicking opens the post with heading, list and blockquote styled; "← All posts" returns; `/blog/nope` and `/learning` show the 404 page; no console errors.

- [ ] **Step 9: Commit**

```bash
git add -A app content lib
git commit -m "feat(blog): replace the learning map with a markdown blog"
```

---

### Task 3: Top bar navigation

**Files:**
- Create: `components/nav/TopBar.tsx`, `app/styles/nav.css`
- Modify: `components/nav/Nav.tsx`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `components/projects/ProjectsBoard.tsx`, `components/sport/SportTimeline.tsx`
- Delete: `components/nav/DesktopDock.tsx`, `components/nav/MobileMenu.tsx`, `app/styles/menu.css`

**Interfaces:**
- Consumes: `NAV_LINKS`, `isActiveRoute` from `@/content/navigation`.
- Produces: CSS custom property `--bar-h`; Tailwind utilities `h-page` and `min-h-page` (= viewport height minus the bar).

- [ ] **Step 1: `app/styles/nav.css`**

```css
/* ============================================================
   TOP BAR
   The bar's height is fixed so full-screen sections can subtract
   it. Two rows on a phone (name, then links), one row from sm up.
   ============================================================ */

:root { --bar-h: 5.75rem; }

@media (min-width: 40rem) {
  :root { --bar-h: 3.75rem; }
}

@utility h-page { height: calc(100svh - var(--bar-h)); }
@utility min-h-page { min-height: calc(100svh - var(--bar-h)); }
```

In `app/globals.css` replace `@import "./styles/menu.css";` with `@import "./styles/nav.css";`, then `git rm -q app/styles/menu.css`.

- [ ] **Step 2: `components/nav/TopBar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveRoute, NAV_LINKS } from "@/content/navigation";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * The site's only navigation: a plain bar at the top. Every link is visible
 * at every width — on a phone the links move to their own row and scroll
 * sideways instead of hiding behind a menu button.
 */
export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-[var(--bar-h)] border-b border-rule bg-ground/90 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <Link href="/" className={`self-start font-serif text-[1.35rem] leading-none text-ink sm:self-auto ${focusRing}`}>
          Christopher Weidner
        </Link>

        <ul className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActiveRoute(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`block whitespace-nowrap py-1 text-[14px] decoration-blue decoration-[1.5px] underline-offset-[6px] transition-colors ${focusRing} ${
                    active ? "text-ink underline" : "text-label hover:text-blue"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: `components/nav/Nav.tsx`**

```tsx
import TopBar from "./TopBar";

/**
 * Navigation for the whole site. One component at every width, so there is
 * no viewport switch and nothing to flash on first paint. Links live in
 * content/navigation.ts.
 */
export default function Nav() {
  return <TopBar />;
}
```

Then: `git rm -q components/nav/DesktopDock.tsx components/nav/MobileMenu.tsx`

- [ ] **Step 4: Layout order — `app/layout.tsx`**

Move `<Nav />` so it renders before `{children}` (sticky needs it at the top of the flow):

```tsx
      <body className="min-h-full flex flex-col bg-ground text-ink-soft">
        <BloomField />
        <div aria-hidden className="grain-field" />
        <Nav />
        {children}
      </body>
```

- [ ] **Step 5: Heights and paddings that assumed a bottom dock**

Make exactly these replacements:

| File | Old | New |
| --- | --- | --- |
| `app/page.tsx` | `relative h-svh overflow-hidden` | `relative h-page overflow-hidden` |
| `app/page.tsx` | `gap-6 px-6 pb-24 text-center` | `gap-6 px-6 text-center` |
| `app/about/page.tsx` | `flex-1 px-6 pb-32 pt-28` | `flex-1 px-6 pb-16 pt-12` |
| `app/contact/page.tsx` | `min-h-svh flex-col items-center justify-center px-6 pb-36 pt-24` | `min-h-page flex-col items-center justify-center px-6 pb-16 pt-12` |
| `components/projects/ProjectsBoard.tsx` | `relative min-h-svh` | `relative min-h-page` |
| `components/projects/ProjectsBoard.tsx` | `flex min-h-svh flex-col justify-center px-6 pb-36 pt-8` | `flex min-h-page flex-col justify-center px-6 pb-16 pt-8` |
| `components/sport/SportTimeline.tsx` | `"min-h-svh overflow-x-clip"` | `"min-h-page overflow-x-clip"` |
| `components/sport/SportTimeline.tsx` | `"md:h-svh md:overflow-hidden"` | `"md:h-page md:overflow-hidden"` |
| `components/sport/SportTimeline.tsx` | `relative z-10 flex min-h-svh flex-col md:h-full` | `relative z-10 flex min-h-page flex-col md:h-full` |
| `components/sport/SportTimeline.tsx` | `px-6 pb-28 pt-8 sm:px-12` | `px-6 pb-12 pt-8 sm:px-12` |

Run `grep -rn "svh" app components --include=*.tsx` — expected: no hits.

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build` — expected pass.

In the browser (dev server), at desktop width and with `resize_window` preset `mobile`:
- Bar is at the top on every page; name links home; current page link is underlined with `aria-current="page"`.
- Mobile: two rows, all five links reachable by horizontal scroll, no menu button.
- Tab through: name then five links, each with visible blue outline.
- Home hero, Sport and Projects fit the viewport below the bar on desktop without a page scrollbar on Sport (`document.documentElement.scrollHeight === innerHeight` on `/sport` at ≥768px wide).
- No console errors. Reset viewport with preset `desktop`.

- [ ] **Step 7: Commit**

```bash
git add -A app components
git commit -m "feat(nav): one plain top bar instead of dock and mobile menu"
```

---

### Task 4: Intro

**Files:**
- Create: `content/home.ts`, `lib/intro.ts`, `components/home/Intro.tsx`, `app/styles/intro.css`, `public/intro/me-1.jpg`, `public/intro/me-2.jpg`, `public/intro/me-3.jpg`
- Modify: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`

**Interfaces:**
- Produces:
  - `INTRO: { greeting: string; sentence: { before: string; highlight: string; after: string }; photos: { src: string; alt: string }[] }` from `@/content/home`
  - `INTRO_SEEN_KEY = "intro-seen"`, `INTRO_GATE_SCRIPT: string` from `@/lib/intro`

- [ ] **Step 1: Placeholder photos**

```bash
mkdir -p public/intro
cp public/sport/jem.jpg public/intro/me-1.jpg
cp public/sport/lfsh.jpg public/intro/me-2.jpg
cp public/sport/sw-gym.jpg public/intro/me-3.jpg
```

Christopher replaces these three files with portraits later; names stay the same.

- [ ] **Step 2: `content/home.ts`**

```ts
/**
 * The home page intro: a greeting, three photos, one sentence.
 *
 * `sentence` is split so one word can be coloured. Replace the photos by
 * overwriting public/intro/me-1.jpg … me-3.jpg.
 */
export const INTRO = {
  greeting: "Hi, I'm Christopher",
  // Placeholder — Christopher will supply the final sentence.
  sentence: {
    before: "I'm building software for preventive ",
    highlight: "health",
    after: ".",
  },
  photos: [
    { src: "/intro/me-1.jpg", alt: "Christopher" },
    { src: "/intro/me-2.jpg", alt: "Christopher" },
    { src: "/intro/me-3.jpg", alt: "Christopher" },
  ],
};
```

- [ ] **Step 3: `lib/intro.ts`**

```ts
/**
 * The intro plays once per browser session. This script runs in <head>
 * before first paint and marks <html> when the intro must not show — already
 * seen this session, or reduced motion requested — so CSS can hide the
 * overlay before it is ever drawn. Storage can throw (private mode, blocked
 * site data); then the intro simply plays.
 */
export const INTRO_SEEN_KEY = "intro-seen";

export const INTRO_GATE_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}"))d.dataset.intro="skip"}catch(e){}if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.intro="skip"})();`;
```

- [ ] **Step 4: `app/styles/intro.css`**

```css
/* ============================================================
   INTRO
   Phases are driven by data-phase on .intro, set from Intro.tsx:
   greeting → photos → sentence → leaving. Everything else here is
   transitions keyed off that attribute.
   ============================================================ */

.intro {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: var(--ground);
  cursor: pointer;
  transition: opacity 600ms ease;
}

html[data-intro="skip"] .intro { display: none; }
.intro[data-phase="leaving"] { opacity: 0; pointer-events: none; }

/* Every layer shares the one grid cell so they stack in the centre. */
.intro > * { grid-area: 1 / 1; }

.intro-greeting {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  letter-spacing: -0.02em;
  color: var(--ink);
  animation: intro-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: opacity 400ms ease, transform 400ms ease;
}
.intro:not([data-phase="greeting"]) .intro-greeting {
  opacity: 0;
  transform: translateY(-12px);
}

.intro-stack {
  position: relative;
  width: min(56vw, 240px);
  aspect-ratio: 5 / 6;
  transition: transform 800ms cubic-bezier(0.65, 0, 0.35, 1);
}
.intro[data-phase="sentence"] .intro-stack,
.intro[data-phase="leaving"] .intro-stack {
  transform: translateY(36svh) scale(0.38);
}

.intro-polaroid {
  position: absolute;
  inset: 0;
  padding: 8px 8px 30px;
  background: var(--ground-soft);
  box-shadow: 0 18px 40px -18px color-mix(in oklab, var(--ink) 45%, transparent);
  opacity: 0;
  transform: rotate(var(--r));
}
.intro:not([data-phase="greeting"]) .intro-polaroid {
  animation: intro-fly 750ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 180ms);
}
.intro-polaroid > div { position: relative; width: 100%; height: 100%; overflow: hidden; }

.intro-sentence {
  max-width: 18ch;
  padding: 0 1.5rem;
  text-align: center;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--ink);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 600ms ease 500ms, transform 600ms ease 500ms;
}
.intro[data-phase="sentence"] .intro-sentence,
.intro[data-phase="leaving"] .intro-sentence {
  opacity: 1;
  transform: none;
}

.intro-skip {
  position: fixed;
  right: max(1.25rem, env(safe-area-inset-right));
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--label);
}
.intro-skip:hover { color: var(--blue); }
.intro-skip:focus-visible { outline: 2px solid var(--blue); outline-offset: 4px; }

@keyframes intro-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}

@keyframes intro-fly {
  from { opacity: 0; transform: translateY(60svh) rotate(calc(var(--r) * -3)); }
  to   { opacity: 1; transform: rotate(var(--r)); }
}

@media (prefers-reduced-motion: reduce) {
  .intro { display: none; }
}
```

In `app/globals.css` add `@import "./styles/intro.css";` as the last line.

- [ ] **Step 5: `components/home/Intro.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { INTRO } from "@/content/home";
import { INTRO_SEEN_KEY } from "@/lib/intro";

type Phase = "greeting" | "photos" | "sentence" | "leaving" | "done";

/** When each phase starts, in ms from mount. Tune the whole intro here. */
const TIMELINE: [Exclude<Phase, "greeting">, number][] = [
  ["photos", 1600],
  ["sentence", 3400],
  ["leaving", 6800],
  ["done", 7400],
];

/** Stack rotation per photo, back to front. */
const ROTATIONS = ["-7deg", "5deg", "-2deg"];

function markSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Storage blocked — the intro will just play again next time.
  }
  document.documentElement.dataset.intro = "skip";
}

/**
 * The home page intro, modelled on context-con.com: greeting, a stack of
 * three polaroids, one sentence, then the page. Plays once per session;
 * click, Escape, Enter, Space or the Skip button end it at once.
 */
export default function Intro() {
  const [phase, setPhase] = useState<Phase>("greeting");

  const finish = useCallback(() => {
    markSeen();
    setPhase("done");
  }, []);

  // Phase timers. Already seen (the <head> script marked <html>) means the
  // schedule is just "done" on the next tick — CSS keeps it invisible meanwhile.
  useEffect(() => {
    const skip = document.documentElement.dataset.intro === "skip";
    const schedule: typeof TIMELINE = skip ? [["done", 0]] : TIMELINE;
    const timers = schedule.map(([next, at]) =>
      window.setTimeout(() => (next === "done" ? finish() : setPhase(next)), at),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [finish]);

  // Keyboard skip and scroll lock while visible.
  useEffect(() => {
    if (phase === "done") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        finish();
      }
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
    };
  }, [phase, finish]);

  if (phase === "done") return null;

  const { greeting, sentence, photos } = INTRO;

  return (
    <div className="intro" data-phase={phase} onClick={finish} role="presentation">
      <p className="intro-greeting">{greeting}</p>

      <div className="intro-stack" aria-hidden>
        {photos.map((photo, i) => (
          <figure
            key={photo.src}
            className="intro-polaroid"
            style={{ "--i": i, "--r": ROTATIONS[i % ROTATIONS.length] } as React.CSSProperties}
          >
            <div>
              <Image src={photo.src} alt={photo.alt} fill sizes="240px" priority className="object-cover" />
            </div>
          </figure>
        ))}
      </div>

      <p className="intro-sentence">
        {sentence.before}
        <span className="text-blue">{sentence.highlight}</span>
        {sentence.after}
      </p>

      <button type="button" className="intro-skip" onClick={finish}>
        Skip
      </button>
    </div>
  );
}
```

Note: the scroll-lock effect re-runs on each phase change; that is fine because it restores and re-applies `overflow` symmetrically.

- [ ] **Step 6: Mount it — `app/page.tsx`**

Add `import Intro from "@/components/home/Intro";` at the top and render `<Intro />` as the first child of `<main>`. The page stays a Server Component.

- [ ] **Step 7: Gate script — `app/layout.tsx`**

Add `import { INTRO_GATE_SCRIPT } from "@/lib/intro";`. Add `suppressHydrationWarning` to `<html>` (the script changes a data attribute on it before hydration). Insert directly inside `<html>`, before `<body>`:

```tsx
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE_SCRIPT }} />
      </head>
```

- [ ] **Step 8: Verify**

Run: `npm test && npm run lint && npm run build` — all pass.

In the browser, in a fresh tab on `/` (first clear storage with `javascript_tool`: `sessionStorage.clear(); delete document.documentElement.dataset.intro; location.reload()`):
- Screenshots at ~0.8 s, ~2.5 s, ~5 s: greeting; polaroid stack centred; stack small at the bottom with the sentence and "health" in blue. At ~8 s the home hero and top bar are visible; `sessionStorage.getItem("intro-seen") === "1"`.
- Reload: no intro, no flash (screenshot immediately after reload shows the hero).
- Clear storage again and reload; press Escape at ~1 s → intro gone immediately. Repeat with a click and with Tab → Skip button (visible focus ring) → Enter.
- During the intro `document.documentElement.style.overflow === "hidden"`; after it, `""`.
- `resize_window` with `colorScheme` is not needed; for reduced motion run `javascript_tool`: `matchMedia("(prefers-reduced-motion: reduce)").matches` — if the pane cannot emulate it, confirm the CSS rule exists in the built stylesheet and the gate script branch by reading `INTRO_GATE_SCRIPT`.
- Navigate to `/about`, clear storage, client-navigate home via the bar name → intro plays; afterwards navigate away and back → no intro.
- Mobile preset: polaroids and sentence fit, Skip button reachable. Reset to `desktop`.
- No console errors or hydration warnings.

- [ ] **Step 9: Commit**

```bash
git add -A app components content lib public/intro
git commit -m "feat(home): context-con style intro, once per session"
```

---

### Task 5: Final check

- [ ] **Step 1:** `npm test && npm run lint && npm run build` — all pass.
- [ ] **Step 2:** Browser pass over `/`, `/about`, `/projects`, `/blog`, `/blog/hello-world`, `/sport`, `/contact` at desktop and mobile widths: top bar correct, active link correct, no console errors, nothing hidden behind the bar.
- [ ] **Step 3:** Screenshot of home (after intro), blog list and one intro frame for Christopher.
- [ ] **Step 4:** `git status` clean except untracked `.claude/`. Report what still needs Christopher: three portrait photos in `public/intro/`, the final intro sentence in `content/home.ts`.
