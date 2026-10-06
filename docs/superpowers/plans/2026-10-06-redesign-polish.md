# Redesign Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** More whitespace and a location/email line on the home page, a reference-style cursor trail for the hero photos, no layout jump between pages, the old contact layout back, project tiles that open a large sheet, and a rebuilt Sport page as a year story.

**Architecture:** Same stack and primitives as the redesign. New shared pieces: an `--ease-spring` token, a button variant of `TiltCard`, a `Reveal` scroll wrapper, `ProjectMedia` (three uses), a native-`<dialog>` `ProjectSheet`. Client components stay small: `HeroPhotos`, `ProjectsGrid`, `FeaturedProjects`, `ProjectSheet`, `Reveal`, `FooterGate`. Pages stay Server Components.

**Tech Stack:** Next.js 16.3.2, React 19.2, Tailwind CSS v4, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-06-redesign-polish-design.md`

## Global Constraints

- Read `AGENTS.md` first; Next 16 differs from training data. next/image: never `priority`; use `fetchPriority="high"` if needed.
- Colours, typefaces and design tokens only in `app/styles/tokens.css`. No hex values elsewhere; use Tailwind tokens or `var(--…)`.
- `"use client"` only on the small interactive component; pages stay Server Components.
- Presentational components hold no state; the feature's composition root owns it.
- Pointer/animation values are written to element styles via refs, never React state per frame.
- Every `useEffect` that subscribes must clean up (listeners, observers, style changes).
- Every interaction: keyboard path, visible cobalt focus ring (`focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue`), `prefers-reduced-motion` fallback, touch fallback.
- Light design only. `globals.css` contains only `@import`s.
- Display type: `font-display uppercase`. Body: Plex Sans; labels: Plex Mono.
- `npm test`, `npm run lint`, `npm run build` end clean (no warnings).
- Commit messages end with exactly `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Map

| File | Status | Responsibility |
| --- | --- | --- |
| `app/styles/tokens.css` | modify | `--ease-spring`, `scrollbar-gutter`; later drop `--text-era`, `--plate` |
| `app/styles/cards.css` | modify | Springy hover with slight scale; button reset |
| `components/ui/TiltCard.tsx` | modify | `onClick` + `label` → renders a `<button>` |
| `components/ui/Reveal.tsx`, `app/styles/effects.css` | create / modify | Reveal-on-scroll wrapper + CSS |
| `app/about/page.tsx` | modify | Page-head reveal |
| `components/footer/FooterGate.tsx`, `app/layout.tsx`, `app/contact/page.tsx` | create / modify | Old contact layout, no footer on /contact |
| `components/projects/ProjectMedia.tsx` | create | Image or cobalt gradient (3 uses) |
| `components/projects/ProjectSheet.tsx`, `app/styles/sheet.css` | create | Large project sheet (`<dialog>`) |
| `components/projects/ProjectTile.tsx`, `components/projects/ProjectsGrid.tsx` | create | Square tiles + grid owning the sheet |
| `components/projects/ProjectCard.tsx`, `components/home/FeaturedProjects.tsx`, `app/projects/page.tsx` | modify | Open the sheet |
| `content/home.ts`, `components/home/Hero.tsx`, `components/home/HeroPhotos.tsx`, `app/styles/home.css` | modify / create | Top line, spacing, cursor trail |
| `components/home/LatestPosts.tsx`, `components/footer/SiteFooter.tsx` | modify | Spacing |
| `components/sport/MomentSection.tsx`, `app/sport/page.tsx`, `content/sport.ts` | create / modify | Year story |
| `components/sport/{SportTimeline,TimelineTrack,MomentPanel,RoamingPlate}.tsx`, `hooks/useAnchoredDrift.ts`, `lib/geometry.ts`, `app/styles/timeline.css` | delete | Old Sport page |
| `lib/motion.ts` | modify | Drop `DRIFT`, `REVEAL_STEP` |

---

### Task 1: Foundations — spring easing, no jump, reveal, button cards

**Files:** Modify `app/styles/tokens.css`, `app/styles/cards.css`, `app/styles/effects.css`, `components/ui/TiltCard.tsx`, `app/about/page.tsx`. Create `components/ui/Reveal.tsx`.

**Interfaces:**
- Produces: CSS var `--ease-spring`; `TiltCard({ tilt?, href?, onClick?: () => void, label?: string, className?, children })` — with `onClick` renders `<button type="button" aria-label={label}>`; `Reveal({ children, className? })` default export from `@/components/ui/Reveal`.

- [ ] **Step 1: Tokens — `app/styles/tokens.css`**

Inside `:root`, after `--card-shadow`, add:

```css
  /* A springy ease-out that overshoots a little, like the reference site. */
  --ease-spring: linear(0, 0.3 6%, 0.8 14%, 1.06 21%, 1.11 26%, 1.07 33%, 1 44%, 0.98 52%, 1 70%, 1);
```

In the base-element section add, before `body {`:

```css
/* Reserve the scrollbar's width on every page, so moving between a short
   page (no scrollbar) and a long one does not shift the content sideways. */
html {
  scrollbar-gutter: stable;
}
```

- [ ] **Step 2: Springy hover — `app/styles/cards.css`**

Replace the `.tilt-card` `transition` line with `transition: transform 600ms var(--ease-spring);`. Replace both hover/focus transforms `translateY(-6px) rotate(0deg)` with `translateY(-8px) rotate(0deg) scale(1.03)`. Add a button reset at the end of the `.tilt-card` rule block (new rule):

```css
button.tilt-card {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
}
```

- [ ] **Step 3: `components/ui/TiltCard.tsx`** — full file:

```tsx
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  /** Rotation in degrees. Negative leans left. */
  tilt?: number;
  /** Makes the whole card one link. */
  href?: string;
  /** Makes the whole card one button. Takes precedence over `href`. */
  onClick?: () => void;
  /** Accessible name for a button card whose content is only an image. */
  label?: string;
  className?: string;
  children: ReactNode;
};

/**
 * The site's card: rounded, shadowed, slightly tilted. Purely presentational.
 * A card with `href` or `onClick` is one control and straightens on hover and
 * focus.
 */
export default function TiltCard({ tilt = 0, href, onClick, label, className = "", children }: Props) {
  const style = { "--tilt": `${tilt}deg` } as CSSProperties;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={label} data-interactive className={`tilt-card ${className}`} style={style}>
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} data-interactive className={`tilt-card block ${className}`} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <div className={`tilt-card ${className}`} style={style}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: `components/ui/Reveal.tsx`**

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** How far inside the viewport an element must be before it reveals. */
const ROOT_MARGIN = "0px 0px -12% 0px";

/**
 * Fades and lifts its content in the first time it scrolls into view. The
 * hidden state only applies when scripting is on (see effects.css), so the
 * content is never lost without JavaScript.
 */
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.shown = "";
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`}>
      {children}
    </div>
  );
}
```

In `app/styles/effects.css`, after the `reveal` section, add:

```css
/* ---------------- reveal on scroll ----------------
   Used by components/ui/Reveal.tsx. Hidden only when scripting runs,
   so the content is never stuck invisible without JavaScript.
--------------------------------------- */

@media (scripting: enabled) {
  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 700ms ease,
      transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal-on-scroll[data-shown] {
    opacity: 1;
    transform: none;
  }
}
```

and inside the existing final `@media (prefers-reduced-motion: reduce)` block add `.reveal-on-scroll { opacity: 1; transform: none; transition: none; }`.

- [ ] **Step 5: About page head — `app/about/page.tsx`**

Make the head match /projects: `<main className="flex-1 px-6 pb-24 pt-12 sm:px-10">`, inner `<div className="mx-auto max-w-6xl">`, h1 `className="reveal font-display text-display uppercase leading-[0.9]"`, paragraph `className="reveal mt-4 max-w-[52ch] text-[15px] leading-relaxed"` with `style={{ "--d": "120ms" } as CSSProperties}` (import `type CSSProperties` from react). Text stays "Coming soon.".

- [ ] **Step 6: Verify** — `npm test && npm run lint && npm run build` clean.

- [ ] **Step 7: Commit**

```bash
git add -A app components
git commit -m "feat(design): spring easing, stable scrollbar gutter, reveal wrapper, button cards"
```

---

### Task 2: Contact page as before, no footer there

**Files:** Create `components/footer/FooterGate.tsx`. Modify `app/layout.tsx`, `app/contact/page.tsx`.

- [ ] **Step 1: `components/footer/FooterGate.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Pages that show their own contact details and must not repeat the footer band. */
const WITHOUT_FOOTER = ["/contact"];

/** Renders the site footer everywhere except on the pages listed above. */
export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return WITHOUT_FOOTER.includes(pathname) ? null : children;
}
```

In `app/layout.tsx`: import it and wrap: `<FooterGate><SiteFooter /></FooterGate>` (SiteFooter stays a Server Component passed as children).

- [ ] **Step 2: `app/contact/page.tsx`** — full file:

```tsx
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { EMAIL, INVITATION, SOCIALS } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact — Christopher Weidner",
  description:
    "Get in touch with Christopher Weidner — founders building in health, coaches, and anyone who trains and codes.",
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * The invitation, the address and the profiles, centred. No JavaScript of its
 * own; the site footer band is left out on this page (see FooterGate).
 */
export default function Contact() {
  return (
    <main className="flex-1">
      <section className="flex min-h-page flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex w-full max-w-[62ch] flex-col items-center gap-8">
          <span className="reveal font-mono text-[11px] uppercase tracking-[0.16em] text-label">Get in touch</span>

          <div className="flex flex-col gap-4">
            {INVITATION.map((line, i) => (
              <p
                key={i}
                className="reveal text-[16px] leading-relaxed text-ink-soft"
                style={{ "--d": `${120 + i * 110}ms` } as CSSProperties}
              >
                {line}
              </p>
            ))}
          </div>

          <a
            href={`mailto:${EMAIL}`}
            className={`reveal mt-2 block max-w-full break-words font-display text-[clamp(1.75rem,6vw,4.5rem)] uppercase leading-[1] text-blue decoration-[3px] underline-offset-[10px] hover:underline ${focusRing}`}
            style={{ "--d": "380ms" } as CSSProperties}
          >
            {EMAIL}
          </a>

          <ul
            className="reveal mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            style={{ "--d": "480ms" } as CSSProperties}
          >
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.description}
                  className={`font-mono text-[12px] uppercase tracking-[0.14em] text-label underline-offset-4 transition-colors hover:text-blue hover:underline ${focusRing}`}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify** — `npm test && npm run lint && npm run build` clean.

- [ ] **Step 4: Commit**

```bash
git add -A app components
git commit -m "feat(contact): centred contact page again, without the footer band"
```

---

### Task 3: Project tiles and the project sheet

**Files:** Create `components/projects/ProjectMedia.tsx`, `components/projects/ProjectSheet.tsx`, `app/styles/sheet.css`, `components/projects/ProjectTile.tsx`, `components/projects/ProjectsGrid.tsx`. Modify `components/projects/ProjectCard.tsx`, `components/home/FeaturedProjects.tsx`, `app/projects/page.tsx`, `app/globals.css`.

**Interfaces:**
- Consumes: `TiltCard` with `onClick`/`label` (Task 1), `--ease-spring` (Task 1), `GRID_TILTS`.
- Produces: `ProjectMedia({ project, sizes, className? })`; `ProjectSheet({ project: Project | null; onClose: () => void })`; `ProjectTile({ project, tilt?, onOpen })`; `ProjectsGrid({ projects })`; `ProjectCard({ project, tilt?, titleAs?, className?, onOpen? })`.

- [ ] **Step 1: `components/projects/ProjectMedia.tsx`**

```tsx
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  /** next/image `sizes` for where this is shown. */
  sizes: string;
  className?: string;
};

/**
 * A project's screenshot, or its cobalt gradient until there is one. Fills
 * its parent; the parent decides the shape.
 */
export default function ProjectMedia({ project, sizes, className = "" }: Props) {
  return (
    <div className={`media h-full w-full ${className}`} style={{ "--pa": project.angle ?? "150deg" } as CSSProperties}>
      {project.image ? (
        <Image src={project.image} alt={project.alt ?? ""} fill sizes={sizes} className="object-cover" />
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: `ProjectCard` uses it and can open the sheet** — replace the media `<div>` block in `components/projects/ProjectCard.tsx` with `<ProjectMedia project={project} sizes="(min-width: 1024px) 22rem, 80vw" className="min-h-0 flex-1" />`, remove the now-unused `Image`/`CSSProperties` imports, add prop `onOpen?: () => void` to `Props` and the signature, and change the TiltCard to:

```tsx
    <TiltCard tilt={tilt} onClick={onOpen} label={onOpen ? `Open project: ${project.title}` : undefined} className={`flex aspect-[4/5] flex-col ${className}`}>
```

(`href` is no longer passed to the card; the link moves into the sheet.) Note: `ProjectMedia` has `h-full`; inside the flex column the `flex-1 min-h-0` decides the height — keep both classes.

- [ ] **Step 3: `app/styles/sheet.css`** and import it in `app/globals.css` after `home.css`:

```css
/* ============================================================
   PROJECT SHEET
   The large panel a project opens into. A native modal <dialog>:
   it traps focus, closes on Escape and returns focus itself.
   ============================================================ */

.project-sheet {
  width: min(56rem, calc(100vw - 2rem));
  max-height: 88vh;
  margin: auto;
  padding: 0;
  border: 0;
  border-radius: 28px;
  background: var(--ground);
  color: var(--ink-soft);
  box-shadow: var(--card-shadow);
  overflow: auto;
}

.project-sheet::backdrop {
  background: color-mix(in oklab, var(--ink) 45%, transparent);
}

.project-sheet[open] { animation: sheet-in 450ms var(--ease-spring) both; }
.project-sheet[open]::backdrop { animation: backdrop-in 250ms ease both; }

@keyframes sheet-in {
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to   { opacity: 1; transform: none; }
}

@keyframes backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .project-sheet[open],
  .project-sheet[open]::backdrop { animation: none; }
}
```

- [ ] **Step 4: `components/projects/ProjectSheet.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import ProjectMedia from "@/components/projects/ProjectMedia";
import type { Project } from "@/content/projects";

type Props = {
  /** The project to show; null keeps the sheet closed. */
  project: Project | null;
  onClose: () => void;
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * A project, large. Controlled by the parent: pass a project to open it,
 * null to close it. Escape, the × button and a click on the backdrop all
 * report onClose.
 */
export default function ProjectSheet({ project, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (project && !element.open) element.showModal();
    if (!project && element.open) element.close();
  }, [project]);

  // The page behind must not scroll while the sheet is open.
  useEffect(() => {
    if (!project) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [project]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-sheet-title"
      onClose={onClose}
      onClick={(event) => {
        // Only the backdrop is the dialog itself; the content sits in the inner div.
        if (event.target === event.currentTarget) onClose();
      }}
      className="project-sheet"
    >
      {project ? (
        <div className="flex flex-col gap-6 p-5 sm:p-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`grid size-10 place-items-center rounded-full bg-ground-soft text-xl leading-none text-ink transition-colors hover:text-blue ${focusRing}`}
            >
              ×
            </button>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
            <ProjectMedia project={project} sizes="(min-width: 1024px) 56rem, 92vw" />
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="project-sheet-title" className="font-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-[0.95]">
              {project.title}
            </h2>
            {project.meta ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">{project.meta}</span>
            ) : null}
            <p className="max-w-[60ch] text-[16px] leading-relaxed">{project.summary}</p>
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 self-start font-mono text-[12px] uppercase tracking-[0.14em] text-blue underline-offset-4 hover:underline ${focusRing}`}
              >
                Visit ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
```

- [ ] **Step 5: `components/projects/ProjectTile.tsx`**

```tsx
import TiltCard from "@/components/ui/TiltCard";
import ProjectMedia from "@/components/projects/ProjectMedia";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  tilt?: number;
  onOpen: () => void;
};

/**
 * One project in the /projects grid: a square card that opens the sheet,
 * with the title and a short line underneath. Purely presentational.
 */
export default function ProjectTile({ project, tilt = 0, onOpen }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <TiltCard tilt={tilt} onClick={onOpen} label={`Open project: ${project.title}`} className="aspect-square max-w-[18rem]">
        <ProjectMedia project={project} sizes="18rem" />
      </TiltCard>
      <h2 className="mt-7 font-display text-2xl uppercase leading-none text-ink">{project.title}</h2>
      {project.meta ? (
        <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-label">{project.meta}</span>
      ) : null}
      <p className="mt-2 line-clamp-2 max-w-[30ch] text-[14px] leading-relaxed">{project.summary}</p>
    </div>
  );
}
```

- [ ] **Step 6: `components/projects/ProjectsGrid.tsx`**

```tsx
"use client";

import { useState } from "react";
import ProjectSheet from "@/components/projects/ProjectSheet";
import ProjectTile from "@/components/projects/ProjectTile";
import type { Project } from "@/content/projects";
import { GRID_TILTS } from "@/lib/motion";

/** The /projects grid. Owns which project's sheet is open. */
export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="mx-auto mt-20 grid max-w-5xl justify-items-center gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <li key={i} className="w-full max-w-[18rem]">
            <ProjectTile project={project} tilt={GRID_TILTS[i % GRID_TILTS.length]} onOpen={() => setOpen(i)} />
          </li>
        ))}
      </ul>
      <ProjectSheet project={open === null ? null : projects[open]} onClose={() => setOpen(null)} />
    </>
  );
}
```

- [ ] **Step 7: `app/projects/page.tsx`** — replace the `<ul>…</ul>` with `<ProjectsGrid projects={PROJECTS} />`, centre the head (`text-center` on the wrapper, `mx-auto` on the intro paragraph), add `style={{ "--d": "120ms" } as CSSProperties}` and `reveal` to the intro paragraph, remove the `ProjectCard` and `GRID_TILTS` imports.

- [ ] **Step 8: Carousel opens the sheet — `components/home/FeaturedProjects.tsx`**

Add `const [sheet, setSheet] = useState<number | null>(null);` next to the other state (before the early return). Pass `onOpen={offset === 0 ? () => setSheet(i) : undefined}` to `ProjectCard`. After the live-region `<p>`, render `<ProjectSheet project={sheet === null ? null : projects[sheet]} onClose={() => setSheet(null)} />` and import it. The existing `onClickCapture` swipe guard keeps a drag from opening the sheet.

- [ ] **Step 9: Verify** — `npm test && npm run lint && npm run build` clean.

- [ ] **Step 10: Commit**

```bash
git add -A app components
git commit -m "feat(projects): square tiles and a project sheet, also from the carousel"
```

---

### Task 4: Home — top line, spacing, hero photo trail

**Files:** Modify `content/home.ts`, `components/home/Hero.tsx`, `app/styles/home.css`, `components/home/FeaturedProjects.tsx`, `components/home/LatestPosts.tsx`, `components/footer/SiteFooter.tsx`. Create `components/home/HeroPhotos.tsx`.

**Interfaces:** Produces `HERO.location: string`; `HeroPhotos()` default export (client).

- [ ] **Step 1: `content/home.ts`** — `HERO` becomes:

```ts
/** The lines at the top of the home page. */
export const HERO = {
  location: "Berlin, Deutschland",
  name: "Christopher Weidner",
  subtitle: "Athlete, Builder & Writer",
};
```

- [ ] **Step 2: `components/home/HeroPhotos.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { INTRO } from "@/content/home";

/** Resting tilt and vertical offset per photo, left to right. */
const FAN = [
  { tilt: -9, y: "1.5rem" },
  { tilt: -2, y: "0rem" },
  { tilt: 7, y: "2rem" },
];
/** Cursor travel in px before the next photo jumps to it. */
const TRAIL_STEP = 90;
/** The most a photo tilts from cursor speed, in degrees. */
const MAX_TILT = 18;
/** Degrees of tilt per px/ms of horizontal cursor speed. */
const TILT_PER_SPEED = 14;

/**
 * The hero's three photos. At rest they are a fan; while a mouse moves over
 * the hero they take turns jumping to the cursor, leaning with its speed,
 * and spring back into the fan when it leaves. Touch and reduced motion keep
 * the fan still. Decorative, so hidden from assistive tech.
 */
export default function HeroPhotos() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fan = root.current;
    const section = fan?.closest("section");
    if (!fan || !section) return;
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const slots = Array.from(fan.querySelectorAll<HTMLElement>(".hero-fan-item"));
    let next = 0;
    let layer = 1;
    let last: { x: number; t: number } | null = null;
    let placed: { x: number; y: number } | null = null;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const speed = last ? (event.clientX - last.x) / Math.max(event.timeStamp - last.t, 1) : 0;
      last = { x: event.clientX, t: event.timeStamp };
      if (placed && Math.hypot(event.clientX - placed.x, event.clientY - placed.y) < TRAIL_STEP) return;
      placed = { x: event.clientX, y: event.clientY };

      const slot = slots[next % slots.length];
      next += 1;
      const photo = slot.querySelector<HTMLElement>(".hero-trail");
      if (!photo) return;
      const rest = slot.getBoundingClientRect();
      const dx = event.clientX - (rest.left + rest.width / 2);
      const dy = event.clientY - (rest.top + rest.height / 2);
      const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, speed * TILT_PER_SPEED));
      photo.style.translate = `${dx}px ${dy}px`;
      photo.style.rotate = `${tilt}deg`;
      layer += 1;
      slot.style.zIndex = String(layer);
    };

    const onLeave = () => {
      last = null;
      placed = null;
      for (const slot of slots) {
        const photo = slot.querySelector<HTMLElement>(".hero-trail");
        if (photo) {
          photo.style.translate = "";
          photo.style.rotate = "";
        }
        slot.style.zIndex = "";
      }
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="hero-fan">
      {INTRO.photos.map((photo, i) => (
        <div
          key={photo.src}
          className="hero-fan-item"
          style={{ "--i": i, "--y": FAN[i % FAN.length].y } as CSSProperties}
        >
          <div className="hero-trail">
            <TiltCard tilt={FAN[i % FAN.length].tilt} className="aspect-[4/5] w-full">
              <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 15rem, 22vw" className="object-cover" />
            </TiltCard>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: `app/styles/home.css`** — add `position: relative;` to `.hero-fan-item` (so its z-index applies), then append:

```css
/* The part of each photo that follows the cursor. HeroPhotos writes
   `translate` and `rotate` here; the slot keeps the resting place. */
.hero-trail {
  transition:
    translate 900ms var(--ease-spring),
    rotate 900ms var(--ease-spring);
  will-change: translate, rotate;
}

@media (prefers-reduced-motion: reduce) {
  .hero-trail { transition: none; }
}
```

and update the file's header comment to mention the cursor trail.

- [ ] **Step 4: `components/home/Hero.tsx`** — full file:

```tsx
import HeroPhotos from "@/components/home/HeroPhotos";
import { EMAIL } from "@/content/contact";
import { HERO } from "@/content/home";

/**
 * Where I am, my name, three photos that follow the cursor, what I do.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-page flex-col items-center justify-center overflow-x-clip px-4 pb-28 pt-16 text-center">
      <div className="reveal flex flex-col items-center gap-1.5">
        <p className="font-display text-[15px] uppercase tracking-[0.06em] text-ink">{HERO.location}</p>
        <a
          href={`mailto:${EMAIL}`}
          className="text-[12.5px] text-ink-soft transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          {EMAIL}
        </a>
      </div>

      <h1 className="mt-[clamp(2.5rem,6vw,4.5rem)] font-display text-giant uppercase leading-[0.85]">{HERO.name}</h1>

      <div className="mt-[clamp(1rem,3vw,2.5rem)]">
        <HeroPhotos />
      </div>

      <p className="mt-[clamp(3rem,7vw,5.5rem)] font-display text-display uppercase leading-[0.9] text-ink-faint">
        {HERO.subtitle}
      </p>
    </section>
  );
}
```

- [ ] **Step 5: Section spacing**

| File | Old | New |
| --- | --- | --- |
| `components/home/FeaturedProjects.tsx` section | `overflow-x-clip px-6 py-24 sm:px-10` | `overflow-x-clip px-6 py-28 sm:px-10 sm:py-44` |
| `components/home/FeaturedProjects.tsx` carousel | `mt-14` | `mt-20` |
| `components/home/FeaturedProjects.tsx` controls | `mt-10 flex` | `mt-14 flex` |
| `components/home/LatestPosts.tsx` section | `px-6 py-24 sm:px-10` | `px-6 py-28 sm:px-10 sm:py-44` |
| `components/home/LatestPosts.tsx` list | `mt-14` | `mt-20` |
| `components/home/LatestPosts.tsx` link wrapper | `mt-12` | `mt-16` |
| `components/footer/SiteFooter.tsx` footer | `pb-10 pt-14` | `pb-12 pt-24` |
| `components/footer/SiteFooter.tsx` email | `mt-8` | `mt-10` |

- [ ] **Step 6: Verify** — `npm test && npm run lint && npm run build` clean.

- [ ] **Step 7: Commit**

```bash
git add -A app components content
git commit -m "feat(home): location line, more whitespace, hero photos follow the cursor"
```

---

### Task 5: Sport page as a year story

**Files:** Create `components/sport/MomentSection.tsx`. Modify `app/sport/page.tsx`, `content/sport.ts`, `lib/motion.ts`, `app/styles/tokens.css`, `app/globals.css`. Delete `components/sport/SportTimeline.tsx`, `TimelineTrack.tsx`, `MomentPanel.tsx`, `RoamingPlate.tsx`, `hooks/useAnchoredDrift.ts`, `lib/geometry.ts`, `app/styles/timeline.css`.

**Interfaces:** Consumes `TiltCard`, `Reveal` (Task 1). Produces `SPORT_INTRO: string` in `@/content/sport`; `MomentSection({ moment: Moment; flip: boolean })`.

- [ ] **Step 1: `content/sport.ts`**

- Header comment: replace "change what the timeline says" with "change what the Sport page says", and "the track spaces itself from the number of moments" with "the page lays out one section per moment, alternating sides".
- Remove the `era` field (its doc comment and type line) from `Moment` and delete every `era: "…",` line in `MOMENTS`. Keep every other field and value.
- Add above `MOMENTS`:

```ts
/** The line under the page title; also the page's meta description. */
export const SPORT_INTRO =
  "Twenty hours a week at the Olympic Training Centre in Potsdam, the German national team, and what the water taught me.";
```

- [ ] **Step 2: `components/sport/MomentSection.tsx`**

```tsx
import Image from "next/image";
import type { CSSProperties } from "react";
import TiltCard from "@/components/ui/TiltCard";
import type { Moment } from "@/content/sport";

type Props = {
  moment: Moment;
  /** Photo on the right instead of the left (from md up). */
  flip: boolean;
};

/**
 * One station of the Sport story: a giant grey year, the photo as a tilted
 * card overlapping it, and the text beside. Purely presentational.
 */
export default function MomentSection({ moment, flip }: Props) {
  return (
    <article className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={flip ? "md:order-2" : ""}>
        <p className="select-none font-display text-giant uppercase leading-[0.8] text-ink-faint">{moment.year}</p>
        <TiltCard tilt={flip ? 3 : -3} className="relative z-10 -mt-[clamp(1.5rem,5vw,4rem)]">
          <div
            className="media w-full"
            style={{ aspectRatio: moment.aspect ?? "3/2", "--pa": moment.angle ?? "150deg" } as CSSProperties}
          >
            {moment.image ? (
              <Image src={moment.image} alt={moment.alt ?? ""} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
            ) : null}
          </div>
        </TiltCard>
      </div>

      <div className={`flex flex-col gap-4 ${flip ? "md:order-1 md:items-end md:text-right" : ""}`}>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-label">{moment.eyebrow}</span>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95]">{moment.title}</h2>
        <p className="max-w-[46ch] text-[15px] leading-relaxed">{moment.body}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: `app/sport/page.tsx`** — full file:

```tsx
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import MomentSection from "@/components/sport/MomentSection";
import Reveal from "@/components/ui/Reveal";
import { MOMENTS, SPORT_INTRO } from "@/content/sport";

export const metadata: Metadata = {
  title: "Sport — Christopher Weidner",
  description: SPORT_INTRO,
};

/** The swimming years, one section per station. */
export default function Sport() {
  return (
    <main className="flex-1 px-6 pb-32 pt-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">Sport</h1>
        <p className="reveal mt-4 max-w-[52ch] text-[15px] leading-relaxed" style={{ "--d": "120ms" } as CSSProperties}>
          {SPORT_INTRO}
        </p>

        <ol className="mt-24 flex flex-col gap-32 sm:gap-44">
          {MOMENTS.map((moment, i) => (
            <li key={moment.year + moment.title}>
              <Reveal>
                <MomentSection moment={moment} flip={i % 2 === 1} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Delete the old page and its leftovers**

```bash
git rm -q components/sport/SportTimeline.tsx components/sport/TimelineTrack.tsx components/sport/MomentPanel.tsx components/sport/RoamingPlate.tsx hooks/useAnchoredDrift.ts lib/geometry.ts app/styles/timeline.css
```

Remove `@import "./styles/timeline.css";` from `app/globals.css`. In `lib/motion.ts` delete `DRIFT` and `REVEAL_STEP` (keep `GRID_TILTS` and the header comment). Then run:

`grep -rn "DRIFT\|REVEAL_STEP\|useAnchoredDrift\|lib/geometry\|timeline\|\.plate\|text-era\|--text-era\|bg-marker\|--plate\|color-marker\|\.era\|era:" app components hooks lib content`

Expected remaining hits: only the `--text-era` and `--plate`/`--color-marker` definitions in `tokens.css`. Delete those three definitions (they have no users left). If `hooks/` is now empty, remove the directory. Any other hit: fix it.

- [ ] **Step 5: Verify** — `npm test && npm run lint && npm run build` clean.

- [ ] **Step 6: Commit**

```bash
git add -A app components hooks lib content
git commit -m "feat(sport): the swimming years as a year story with scroll reveal"
```

---

### Task 6: Final check (controller)

- [ ] `npm test && npm run lint && npm run build`, `npm ci` — clean.
- [ ] Browser at desktop and 375px: top line + email link; more whitespace; hero trail follows the mouse and springs back on leave (no trail on mobile); /about ↔ /projects no sideways jump (`document.documentElement.clientWidth` equal on both); page-head reveal on every page; /contact centred without footer band, footer present elsewhere; projects tiles hover + sheet (click, ×, Esc, backdrop, focus returns, page does not scroll behind); carousel centre card opens the sheet, a drag does not; Sport story with alternating sides and scroll reveal; no console errors.
- [ ] Screenshots for Christopher.
