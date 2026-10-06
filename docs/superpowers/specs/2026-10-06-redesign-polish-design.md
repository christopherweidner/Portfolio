# Redesign Polish — Design

Date: 2026-10-06
Status: approved in chat
Builds on: `2026-10-06-redesign-design.md` (tokens, TiltCard, ProjectCard,
PostTile, carousel, footer stay)
Reference: https://spencergabor.work

## Decisions (from chat)

| Topic | Decision |
| --- | --- |
| Home spacing | Much more whitespace between and inside sections |
| Top line | `BERLIN, DEUTSCHLAND` + email, centred above the hero name |
| Hero photos | Behave like the reference: follow the cursor as a trail, spring back on leave |
| Page changes | No horizontal jump; every page head fades in like /projects |
| Contact | Back to the earlier centred layout (label, invitation, big email, socials); no footer band on /contact |
| Projects | Centred square tiles like "More Work", hover straighten + lift, text below, click opens a large sheet |
| Sport | Rebuilt as a year story (giant grey year, tilted photo card, text; alternating sides; reveal on scroll) |

## 1. Home spacing and top line

- Hero gets a top info block, centred: `BERLIN, DEUTSCHLAND` in
  `font-display uppercase` (~14px, tracking), below it the email as a
  `mailto:` link in Plex at 12–13px, `text-ink-soft` (small text, so not
  `ink-faint`), hover `text-blue`.
  Text: `HERO.location` in `content/home.ts`; email from `content/contact.ts`.
- Vertical rhythm: sections `py-32 sm:py-44` (was `py-24`); hero name/photos/
  subtitle gaps roughly doubled; section heading → content gap `mt-20`;
  LatestPosts "All posts" link `mt-16`. Mobile keeps at least `py-24`.

## 2. Hero photo trail (reference behaviour)

- Resting: the existing fan (three TiltCards, tilts −9/−2/+7°).
- Pointer (mouse/pen, `pointer: fine`) moving inside the hero section:
  every time the cursor has travelled ≥ ~90px since the last placement, the
  next photo (round-robin) jumps to the cursor position, centred on it, on top
  of the others, rotated by the horizontal velocity (clamped to ±18°).
  Movement uses a springy transition (CSS `linear()` spring easing, ~0.9s on
  `translate`/`rotate`).
- Pointer leaves the hero section → all photos spring back to the fan.
- Positions/rotations are written to element styles via refs (no React state
  per frame); listeners attached in an effect and removed on cleanup.
- `prefers-reduced-motion` or coarse pointer (touch): no trail, static fan.
- Photos stay decorative (`aria-hidden`), so no keyboard path is needed.

## 3. Page transitions

- `html { scrollbar-gutter: stable; }` in a base stylesheet: the content no
  longer shifts when a page with/without scrollbar is opened.
- Every page head (H1 + intro line) uses the same `reveal` entrance with the
  same stagger as /projects: About, Contact, Sport, Blog list, Blog post,
  Projects.

## 4. Contact page

- Layout as before the redesign, restyled: centred column, small mono label
  "Get in touch", the `INVITATION` paragraphs, the email as a large
  `font-display uppercase` mailto link (cobalt, hover underline), the
  `SOCIALS` as small mono links. Staggered `reveal`.
- The site footer band is not rendered on `/contact` (it would repeat the
  same links). Mechanism: a small client `FooterGate` around the server
  `SiteFooter` in the root layout that returns nothing when
  `usePathname() === "/contact"`.

## 5. Projects grid and project sheet

- `/projects`: centred grid (1/2/3 columns, max ~64rem), each item:
  - a square `TiltCard` (image or cobalt gradient), small alternating tilt;
    hover/focus straightens, lifts and scales slightly with spring easing;
  - below the card (not inside): title (`font-display uppercase`), meta,
    one-line summary (clamped to 2 lines).
  - The card is a `button` that opens the project sheet.
- **Project sheet** (`components/projects/ProjectSheet.tsx`, client): native
  `<dialog>` opened with `showModal()`; large white rounded panel
  (max ~56rem, ~88vh), close button (×) top-right, closes on Esc and on
  backdrop click; content: image or gradient (large), title, meta, full
  summary, "Visit ↗" link (new tab, `rel="noopener noreferrer"`) when `href`
  is set. Focus returns to the opening button on close. Body scroll locked
  while open (dialog default + `overflow: hidden` on `html`). Open/close
  fade+scale, reduced-motion: no animation.
- The home carousel's centre card opens the same sheet (neighbours stay
  inert). `ProjectCard` gains an optional `onOpen` and renders as a button
  when given it; `href` is no longer used directly on the card.
- The sheet has no URL of its own (out of scope).

## 6. Sport page — year story

- Page head: `SPORT` (display) + one intro line (Plex), `reveal`.
- One section per `MOMENTS` entry, alternating image left/right on ≥ md,
  stacked on mobile:
  - giant year in `font-display text-giant text-ink-faint` behind/above,
  - photo as `TiltCard` (tilt ±3°, aspect from `moment.aspect`, default
    3/2), cobalt gradient (`.media`, `--pa: moment.angle`) when no image,
  - eyebrow (mono, label colour), title (display uppercase), body (Plex).
- Each section fades/slides in when it enters the viewport (one client
  `Reveal` wrapper using IntersectionObserver, unobserves after first show;
  reduced motion: visible immediately).
- Removed: `SportTimeline`, `TimelineTrack`, `MomentPanel`, `RoamingPlate`,
  `hooks/useAnchoredDrift.ts`, `lib/geometry.ts`, `app/styles/timeline.css`,
  `DRIFT` (and any other export of `lib/motion.ts` left unused), the `era`
  field of `Moment` and its values. Verify each with grep before deleting.

## Accessibility and motion

- Sheet: `aria-labelledby` the project title; close button labelled; Esc;
  focus trap is native to modal `<dialog>`.
- All new interactive elements keyboard reachable with the cobalt focus ring.
- Reduced motion: no trail, no reveal motion, no sheet animation, no hover
  transforms.

## Verification

- `npm test`, `npm run lint`, `npm run build` clean (no warnings).
- Browser (desktop + 375px): top line, spacing, hero trail + spring back,
  no jump between /about ↔ /projects, page-head reveal everywhere, contact
  page without footer, projects tiles hover + sheet open/close (click, Esc,
  backdrop, ×, focus return), carousel centre opens sheet, sport story +
  scroll reveal, no console errors.

## Out of scope

Sheet URLs / deep links, project galleries with several images, new content.
