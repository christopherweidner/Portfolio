/**
 * Where the background blooms sit on each route.
 *
 * The field itself lives in the root layout and is never unmounted, so
 * changing route only changes these numbers — CSS transitions do the morph.
 * Adding a page means adding a key here; anything unlisted gets `default`.
 *
 * Keep every arrangement at THREE blooms. They are matched by position in the
 * array, so a route with a different count would make one pop in or vanish
 * instead of travelling. To retire a bloom on a page, push it off-screen and
 * drop its opacity — see "/contact".
 *
 * Coordinates are the bloom's centre in vw / vh. Values outside 0–100 sit
 * off-screen, which is how you get a bloom that only bleeds in from an edge.
 */

export type Bloom = {
  x: number;
  y: number;
  /** Scale applied to the base 60vw x 60vh circle. Unequal values make an ellipse. */
  sx: number;
  sy: number;
  blur: number;
  opacity: number;
  /** Drift cycle in seconds. Keep these mutually indivisible so they never sync up. */
  speed: number;
  tone?: "base" | "light";
};

export const BLOOMS: Record<string, Bloom[]> = {
  /**
   * Home — a diagonal cluster with real weight. The name sits in the middle of
   * it, so this is the only page where the blooms are allowed to be loud.
   */
  "/": [
    { x: 23, y: 47, sx: 1.03, sy: 1.03, blur: 90, opacity: 0.8, speed: 40 },
    { x: 77, y: 41, sx: 0.97, sy: 1.1, blur: 84, opacity: 0.85, speed: 47, tone: "light" },
    { x: 50, y: 91, sx: 0.93, sy: 0.77, blur: 70, opacity: 0.7, speed: 57 },
  ],

  /**
   * About — a low horizontal band. The upper middle is deliberately empty for
   * the pool, and the widest bloom sits below the fold so scrolling reveals it.
   */
  "/about": [
    { x: 6, y: 64, sx: 1.12, sy: 0.8, blur: 108, opacity: 0.48, speed: 43 },
    { x: 97, y: 72, sx: 1.0, sy: 0.88, blur: 96, opacity: 0.46, speed: 51, tone: "light" },
    { x: 50, y: 118, sx: 1.35, sy: 0.6, blur: 92, opacity: 0.3, speed: 61 },
  ],

  /**
   * Sport — driven into opposite corners and dimmed. The timeline runs edge to
   * edge here and a photograph moves across it, so the middle stays clear.
   */
  "/sport": [
    { x: 12, y: 86, sx: 1.0, sy: 0.85, blur: 104, opacity: 0.5, speed: 46 },
    { x: 93, y: 15, sx: 0.95, sy: 1.05, blur: 96, opacity: 0.46, speed: 53, tone: "light" },
    { x: 64, y: 112, sx: 0.9, sy: 0.7, blur: 88, opacity: 0.28, speed: 59 },
  ],

  /**
   * Learning — two tall blooms bleeding in from the sides, framing a reading
   * column. Long prose lives here and nothing may sit behind the text.
   */
  "/learning": [
    { x: -8, y: 34, sx: 0.88, sy: 1.25, blur: 100, opacity: 0.52, speed: 45 },
    { x: 108, y: 64, sx: 0.88, sy: 1.25, blur: 100, opacity: 0.5, speed: 55, tone: "light" },
    { x: 50, y: -16, sx: 1.25, sy: 0.7, blur: 94, opacity: 0.3, speed: 67 },
  ],

  /**
   * Projects — top-heavy. Weight above the fold, clear paper below, so cards
   * and screenshots sit on a quiet ground rather than on colour.
   */
  "/projects": [
    { x: 28, y: -6, sx: 1.15, sy: 0.85, blur: 92, opacity: 0.56, speed: 42 },
    { x: 84, y: 10, sx: 0.95, sy: 0.9, blur: 88, opacity: 0.5, speed: 49, tone: "light" },
    { x: 12, y: 106, sx: 1.0, sy: 0.75, blur: 96, opacity: 0.26, speed: 63 },
  ],

  /**
   * Contact — one bloom, centred and low, with the other two pushed off-stage.
   * The page is four lines long; a single mass reads as an ending rather than
   * as another composition.
   */
  "/contact": [
    { x: 50, y: 76, sx: 1.28, sy: 1.05, blur: 104, opacity: 0.68, speed: 50 },
    { x: 122, y: 22, sx: 0.8, sy: 0.8, blur: 90, opacity: 0.2, speed: 58, tone: "light" },
    { x: -24, y: 18, sx: 0.8, sy: 0.8, blur: 90, opacity: 0.18, speed: 66 },
  ],

  /** Anything not listed above. */
  default: [
    { x: 84, y: 18, sx: 0.95, sy: 1.0, blur: 96, opacity: 0.5, speed: 44, tone: "light" },
    { x: 10, y: 88, sx: 1.0, sy: 0.85, blur: 104, opacity: 0.45, speed: 52 },
    { x: 52, y: -10, sx: 0.85, sy: 0.7, blur: 88, opacity: 0.3, speed: 60 },
  ],
};

export function bloomsFor(pathname: string): Bloom[] {
  return BLOOMS[pathname] ?? BLOOMS.default;
}
