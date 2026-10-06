# Site Redesign (Spencer Gabor style) — Design

Date: 2026-10-06
Status: approved in chat
Builds on: `2026-10-06-intro-blog-nav-design.md` (intro, blog, top bar stay)
Reference: https://spencergabor.work — white ground, huge condensed uppercase
headlines, tilted rounded cards with soft shadows, featured carousel with
tilted neighbours, tile grid, giant "CONTACT" footer band.

## Decisions (from chat)

| Question | Decision |
| --- | --- |
| Colours / fonts | New condensed headline face; body stays IBM Plex; white/light-grey ground; cobalt stays the only accent |
| Structure | Home becomes a showcase page; About, Projects, Blog, Sport, Contact stay separate pages in the new look; top bar stays |
| Card content | Featured carousel shows only the 4 projects, as cobalt colour cards until they have images |
| Background effects | BloomField and grain removed everywhere |
| Hero subtitle | ATHLETE, BUILDER & WRITER |

## 1. Visual system

### Tokens (`app/styles/tokens.css`)

- `--ground: #FFFFFF` — page background.
- `--ground-soft: #F2F2F0` — grey bands (footer), tile backgrounds.
- `--ink: #111111`, `--ink-soft: #2A2D33` (body), `--ink-faint: #8A8F98`
  (large grey display text; ≥ 3:1 on white for large text), `--rule: #E6E6E3`.
- `--blue`, `--blue-light`, `--blue-deep`, `--label` unchanged.
- `--card-shadow`: soft two-layer shadow, defined once, e.g.
  `0 1px 2px rgb(17 17 17 / 0.06), 0 18px 40px -18px rgb(17 17 17 / 0.35)`.
- Remove tokens only the removed effects used (`--plate` if unused).
- Fonts: add **Anton** (Google Fonts, 400) as `--font-display`; keep IBM Plex
  Sans/Mono. Remove Cormorant Garamond; every `font-serif` use moves to
  `font-display` (uppercase) or Plex, per the rules below.

### Typography rules

- Page H1 and section headings: `font-display uppercase`, tight leading
  (~0.9), slight negative tracking avoided (Anton is already condensed).
- Display sizes as tokens: `--text-giant: clamp(3.5rem, 13vw, 11rem)` (hero
  name, footer CONTACT), `--text-display: clamp(2.75rem, 8vw, 6rem)` (page H1),
  `--text-section: clamp(2rem, 5vw, 3.25rem)` (section heads).
- Long text (post titles in lists, card titles) uses `font-display uppercase`
  at small sizes only when ≤ ~6 words; article body stays Plex.
- Blog article: H1 display; `h2/h3` display uppercase; blockquote Plex italic
  with a cobalt left rule.

### Card primitive (`components/ui/TiltCard.tsx`, presentational)

- Rounded (`rounded-[22px]`), `overflow-hidden`, `box-shadow: var(--card-shadow)`.
- Props: `tilt` (deg, default 0), `children`, optional `href` (renders a
  `Link`), `className`.
- Hover/focus-visible (pointer devices): rotates to 0deg and lifts
  (`translateY(-6px)`), 300ms ease. Visible cobalt focus ring.
- `prefers-reduced-motion`: no transform transitions; tilt stays static.

## 2. Home page

Order (all inside `app/page.tsx`, a Server Component):

1. **Intro** — unchanged behaviour; restyled to Anton uppercase text on white.
2. **Hero** (`components/home/Hero.tsx`)
   - `CHRISTOPHER WEIDNER` in `--text-giant`, ink, centred, one or two lines.
   - Three photos from `INTRO.photos` fanned below/overlapping the name as
     TiltCards (tilts ≈ -9°, -2°, +7°, slight vertical offsets), overlapping
     horizontally like the reference.
   - `ATHLETE, BUILDER & WRITER` in `--text-giant`-ish size, `--ink-faint`.
   - Text lives in `content/home.ts` (`HERO = { name, subtitle }`).
   - Load-in: cards fan out from a stack (CSS only, staggered), once; reduced
     motion: static.
3. **Featured Projects** (`components/home/FeaturedProjects.tsx`, client)
   - Heading `FEATURED PROJECTS` + one-line Plex subtitle.
   - Carousel of `PROJECTS`: the active card is large and upright, its
     neighbours smaller, tilted (±8°) and partly off-screen; others hidden.
   - Controls: prev/next round buttons below (aria-labels), ←/→ keys when the
     carousel has focus, horizontal swipe on touch (pointer events with a
     threshold). Wraps around. `aria-roledescription="carousel"`, slides
     labelled "n of 4", live region announces the active title.
   - Card content: `ProjectCard` (see §3) — image if `project.image`, else a
     cobalt colour field using the project's `angle` gradient with the title.
4. **Latest Posts** (`components/home/LatestPosts.tsx`, server)
   - Heading `LATEST POSTS`; up to 3 newest posts from `getAllPosts()` as
     TiltCard tiles (alternating small tilts) with date, title, summary; link
     "All posts →" to `/blog`. Hidden entirely when there are no posts.
5. **Footer** (site-wide, see §4).

## 3. Sub-pages

- **Top bar**: same structure; name in `font-display uppercase`; white
  background with `--rule` hairline. `--bar-h` unchanged unless the new type
  needs it.
- **Projects** (`/projects`): page H1 `PROJECTS`, then a responsive grid
  (1/2/3 columns) of `ProjectCard`s with alternating small tilts — the
  reference's "More work" grid. `ProjectCard` (`components/projects/ProjectCard.tsx`)
  is shared with the home carousel: square-ish TiltCard, image or colour
  field, title, meta, summary, link when `href` is set. `ProjectsBoard`,
  `ProjectRow`, `ProjectBackdrop` are removed if nothing else uses them.
- **Blog** (`/blog`, `/blog/[slug]`): H1 display; list becomes a grid of
  TiltCard tiles (same tile as Latest Posts — extract `PostTile` since it has
  two uses); article page restyled per typography rules.
- **Sport** (`/sport`): behaviour unchanged (timeline, drift, panels). Era
  headings/titles move to display font; the roaming photo plate gets the card
  radius + `--card-shadow`; colours follow the new tokens.
- **About** (`/about`): H1 `ABOUT` in display; text unchanged ("Coming soon.").
- **Contact** (`/contact`): H1 `CONTACT`-style page head + the `INVITATION`
  paragraphs. The email and socials are shown by the footer directly below,
  so the page no longer repeats them.

## 4. Footer (`components/footer/SiteFooter.tsx`, server, in root layout)

- Full-width `--ground-soft` band at the bottom of every page.
- Giant `CONTACT` in white (`--ground`) Anton, centred, `--text-giant`;
  decorative (`aria-hidden`), with a visually hidden real heading "Contact".
- Below: email (mailto link) and the `SOCIALS` links in small display caps,
  then a small "© <year> Christopher Weidner" line.
- Hidden while the intro overlay is up (overlay covers it).

## 5. Removed

`components/BloomField.tsx`, `lib/blooms.ts`, the grain element and their CSS
in `effects.css` (`.bloom*`, `.grain*`), Cormorant font loading, and project
components replaced by `ProjectCard`. Verify each with grep before deleting.
`.glass` is removed if unused.

## 6. Accessibility and motion

- Every interactive element: keyboard reachable, visible cobalt focus ring.
- Carousel: buttons + arrow keys + swipe; never auto-advances.
- `prefers-reduced-motion`: no fan-in, no hover transforms, carousel changes
  without sliding.
- Giant grey text uses `--ink-faint` (large-text contrast ≥ 3:1).
- No dark-mode variants (committed light design).

## Verification

- `npm test`, `npm run lint`, `npm run build` clean (no warnings), `npm ci` ok.
- Browser at 1280px and 375px: hero fan, carousel via buttons/keys/swipe,
  latest posts, footer on every page, sub-pages restyled, no horizontal page
  scroll, no console errors, reduced-motion fallback (static).

## Out of scope

New content (project images, about text), animations beyond the listed ones,
CMS, dark mode.
