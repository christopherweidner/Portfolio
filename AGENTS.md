<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
## Project conventions

Structure, so new code lands in the right place.

| Directory | Holds | Rule |
| --- | --- | --- |
| `app/` | Routes only | A folder here means a URL. Nothing else lives here. |
| `app/styles/` | CSS partials | `globals.css` imports and contains no rules of its own. |
| `components/` | React components | Grouped per feature (`components/sport/`) once there is more than one. |
| `hooks/` | Reusable behaviour | Must not know about any specific page. |
| `lib/` | Pure functions and constants | No DOM, no React, no side effects. Unit-testable. |
| `content/` | Editorial data | Text and facts. Edited often, imported by components. |
| `public/` | Static assets | Photos per page, e.g. `public/sport/`. |

Rules:

- **Colours and typefaces are defined once**, in `app/styles/tokens.css`. Never
  hardcode a hex value in a component; use a Tailwind token (`bg-ground`,
  `text-ink`) or `var(--blue)`.
- **`"use client"` goes as far down the tree as possible.** Mark the small
  interactive component, never a whole page. Pages stay Server Components so
  they can export `metadata`.
- **State for what a person sees change, refs for what moves every frame.**
  Pointer and animation values are written to `style.transform` directly.
- **Every `useEffect` that subscribes must clean up** — cancel animation
  frames, remove listeners, clear timers.
- **Presentational components hold no state.** They take props and report
  intent upward. Only the composition root of a feature is stateful.
- **Extract when there is a second use or a genuinely distinct
  responsibility** — never preemptively.
- Every interaction needs a keyboard path, a visible focus state, a
  `prefers-reduced-motion` fallback, and a touch fallback where it relies on
  a pointer.
- This is a committed light design. Do not add dark-mode variants.
