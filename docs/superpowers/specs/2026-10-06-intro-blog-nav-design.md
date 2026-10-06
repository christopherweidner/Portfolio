# Intro, Blog and Navigation — Design

Date: 2026-10-06
Status: approved in chat

## Goal

Make the portfolio easier to use without losing its look. Keep colours
(`app/styles/tokens.css`) and typefaces. About, Sport, Projects and Contact
pages stay unchanged.

Three changes:

1. A short personal intro on the home page, modelled on context-con.com.
2. Replace the Learning page with a Markdown blog.
3. Replace the desktop dock and mobile overlay menu with one plain top bar.

## 1. Intro

### Sequence

| Step | What the visitor sees | Approx. time |
| --- | --- | --- |
| 1 | "Hi, I'm Christopher" fades/scales in, centred | 0.0–1.6 s |
| 2 | Greeting fades out; three polaroids fly in and settle as a slightly rotated stack in the centre | 1.6–3.4 s |
| 3 | Stack shrinks and moves to the bottom edge | 3.4–4.2 s |
| 4 | The sentence appears centred; one word coloured `var(--blue)` | 4.2–6.8 s |
| 5 | Overlay fades out, revealing the existing home page | 6.8–7.4 s |

Timings live as constants in the component so they can be tuned in one place.

### Behaviour

- Runs on `/` only, once per browser session (`sessionStorage` key
  `intro-seen`). All storage access is wrapped in try/catch; if storage is
  unavailable the intro plays and is simply not remembered.
- Skippable at any time by: click/tap anywhere, Escape, Enter or Space, or a
  visible "Skip" button (bottom-right, keyboard focusable, visible focus ring).
- `prefers-reduced-motion: reduce` → intro is not shown.
- While the intro is shown, page scroll is locked; the lock is released on
  finish/skip and on unmount.
- Avoid a flash of the home page before the intro: the overlay renders
  server-side visible; a tiny inline script in the layout sets
  `data-intro="skip"` on `<html>` when the session flag is set or reduced
  motion is requested, and CSS hides the overlay in that case. The client
  component then unmounts it.
- Every timer and listener is cleaned up in effect teardown.

### Content

`content/home.ts`:

```ts
export const INTRO = {
  greeting: "Hi, I'm Christopher",
  sentence: { before: "…", highlight: "…", after: "…" }, // placeholder until Christopher supplies it
  photos: [
    { src: "/intro/me-1.jpg", alt: "…" },
    { src: "/intro/me-2.jpg", alt: "…" },
    { src: "/intro/me-3.jpg", alt: "…" },
  ],
};
```

Photos: Christopher will add `public/intro/me-1.jpg … me-3.jpg`. Until then
the build uses placeholders (existing sport photos are acceptable as temporary
stand-ins) so nothing 404s.

### Files

- `components/home/Intro.tsx` — `"use client"`, owns intro state.
- `app/styles/intro.css` — keyframes and polaroid styling, imported by
  `globals.css`.
- `app/page.tsx` — renders `<Intro />` above the existing hero; remains a
  Server Component.

## 2. Blog

### Authoring

- One post = one file: `content/blog/<slug>.md`.
- Front matter: `title` (string), `date` (YYYY-MM-DD), `summary` (string).
  Optional `draft: true` hides a post from production builds.
- Body: plain Markdown. Publishing = committing the file.

### Routes

- `app/blog/page.tsx` — list, newest first: date, title (link), summary.
  Empty state text if there are no posts.
- `app/blog/[slug]/page.tsx` — article: title, date, rendered body in a
  narrow readable column, "← All posts" link. `generateStaticParams` for all
  slugs, `generateMetadata` from front matter, `notFound()` for unknown slugs.

### Library

- `lib/blog.ts` — `getAllPosts()` and `getPost(slug)`. Reads
  `content/blog`, parses front matter with `gray-matter`, renders Markdown
  with `marked`. Validates required fields and throws a clear build-time
  error naming the file if one is missing. Pure apart from the file read
  (server-only).
- New dependencies: `gray-matter`, `marked`.
- Styles: `app/styles/blog.css` for article typography (headings, lists,
  links, code, blockquote) using tokens only.
- One sample post ships so the pages are not empty.

### Removal of Learning

Delete `app/learning/`, `components/learning/`, `content/learning.ts`, and
anything only Learning uses — verify with grep before deleting:
`app/styles/network.css`, `app/styles/timeline.css` (check Sport first),
`hooks/useAnchoredDrift.ts` (check Sport first), `lib/` helpers used only by
the map, and the `--line-*` tokens.

## 3. Navigation

- Replace `DesktopDock` and `MobileMenu` with one `components/nav/TopBar.tsx`
  rendered by `Nav.tsx`.
- Layout: sticky bar at the top, `bg-ground` with a `--rule` hairline.
  Left: "Christopher Weidner" linking to `/`. Right: About · Projects · Blog ·
  Sport · Contact.
- Mobile: name on the first row, links on a second, horizontally scrollable
  row — every link always visible, no burger.
- Active link: underline + `aria-current="page"`. Visible focus ring on all
  links.
- `content/navigation.ts` stays the single source of links: Learning →
  Blog, Home removed from the list (the name links home). `isActiveRoute`
  unchanged.
- Pages that relied on bottom padding for the dock get that padding reviewed;
  the home hero accounts for the top bar's height.
- Remove `app/styles/menu.css` if nothing else uses it.
- The bar is hidden while the intro overlay is visible (overlay sits above it
  by z-index).

## Verification

- `npm run lint` and `npm run build` pass.
- In the browser: intro plays once per session; Skip button, click and keys
  skip it; reload in the same session shows no intro; reduced motion shows no
  intro; no console errors.
- `/blog` lists the sample post; `/blog/<slug>` renders it; unknown slug 404s;
  `/learning` 404s.
- Top bar on desktop and at 375 px width: all links reachable, active state
  correct, keyboard focus visible.

## Out of scope

Tags, RSS, comments, search, pagination, CMS. Add when there is a second
reason to.
