/**
 * The learning network, drawn as a transit map.
 *
 * ── HOW TO EDIT ──────────────────────────────────────────────────────────
 *
 * Add a stop:  append to a line's `stops`. Its `at` must lie ON that line's
 *              route. Nothing else to update — if another line already has a
 *              stop at the same point it becomes an interchange by itself.
 *
 * Add a line:  append to LINES with a new `tone` (1-6, defined in tokens.css)
 *              and a `route`. Every segment must be horizontal, vertical or
 *              exactly 45 degrees; in development the console tells you if one
 *              is not. Termini carry the line's name on the map.
 *
 * Fill a stop: replace `title` and write a `body`. Leave `title` as
 *              "Coming soon" and the shared placeholder text is used.
 *
 * Coordinates are in the VIEWBOX space below, not pixels on screen; the map
 * scales to whatever width it is given.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Point = { x: number; y: number };
export type Side = "up" | "down" | "left" | "right";

export type Stop = {
  at: Point;
  /** Which side of the marker the label sits on. Keep it off the line. */
  label: Side;
  title: string;
  /** Omit while the stop is still a placeholder. */
  body?: string;
};

export type Line = {
  id: string;
  name: string;
  /** Small mono note in the legend. */
  note: string;
  /** Which --line-N colour token to use. Defined in styles/tokens.css. */
  tone: 1 | 2 | 3 | 4 | 5 | 6;
  /** Corner points in order. Horizontal, vertical or 45-degree segments only. */
  route: Point[];
  /** Ends that carry the line name, and which way the label points. */
  termini: { at: Point; label: Side }[];
  stops: Stop[];
};

export const VIEWBOX = { width: 1000, height: 620 };

/** Used for any stop still titled "Coming soon". */
export const PLACEHOLDER_BODY =
  "Nothing written here yet. Each stop will hold one thing I learned — the course " +
  "or the paper, what it actually taught me, and whether it was worth the time. " +
  "The honest verdicts are the point.";

/** Used for a placeholder stop that sits on more than one line. */
export const INTERCHANGE_BODY =
  "An interchange: a point where two of these actually meet. Those crossings have " +
  "been the most useful part of studying two things at once, and this is where I " +
  "will write about them.";

export const LINES: Line[] = [
  {
    id: "cs",
    name: "Computer science",
    note: "Hasso-Plattner-Institut",
    tone: 1,
    route: [
      { x: 100, y: 200 },
      { x: 340, y: 200 },
      { x: 380, y: 240 },
      { x: 620, y: 240 },
      { x: 660, y: 200 },
      { x: 900, y: 200 },
    ],
    termini: [
      { at: { x: 100, y: 200 }, label: "left" },
      { at: { x: 900, y: 200 }, label: "right" },
    ],
    stops: [
      { at: { x: 100, y: 200 }, label: "up", title: "Coming soon" },
      { at: { x: 240, y: 200 }, label: "up", title: "Coming soon" },
      { at: { x: 500, y: 240 }, label: "up", title: "Coming soon" },
      { at: { x: 780, y: 200 }, label: "up", title: "Coming soon" },
      { at: { x: 900, y: 200 }, label: "up", title: "Coming soon" },
    ],
  },
  {
    id: "health",
    name: "Health & physiology",
    note: "Self-taught",
    tone: 2,
    route: [
      { x: 100, y: 420 },
      { x: 300, y: 420 },
      { x: 380, y: 340 },
      { x: 620, y: 340 },
      { x: 700, y: 420 },
      { x: 900, y: 420 },
    ],
    termini: [
      { at: { x: 100, y: 420 }, label: "left" },
      { at: { x: 900, y: 420 }, label: "right" },
    ],
    stops: [
      { at: { x: 100, y: 420 }, label: "down", title: "Coming soon" },
      { at: { x: 200, y: 420 }, label: "down", title: "Coming soon" },
      { at: { x: 320, y: 400 }, label: "left", title: "Coming soon" },
      { at: { x: 500, y: 340 }, label: "down", title: "Coming soon" },
      { at: { x: 800, y: 420 }, label: "down", title: "Coming soon" },
      { at: { x: 900, y: 420 }, label: "down", title: "Coming soon" },
    ],
  },
  {
    id: "coaching",
    name: "Coaching & teaching",
    note: "Trainerschein",
    tone: 3,
    route: [
      { x: 500, y: 110 },
      { x: 500, y: 510 },
    ],
    termini: [
      { at: { x: 500, y: 110 }, label: "up" },
      { at: { x: 500, y: 510 }, label: "down" },
    ],
    stops: [
      { at: { x: 500, y: 110 }, label: "up", title: "Coming soon" },
      { at: { x: 500, y: 240 }, label: "right", title: "Coming soon" },
      { at: { x: 500, y: 340 }, label: "right", title: "Coming soon" },
      { at: { x: 500, y: 400 }, label: "right", title: "Coming soon" },
      { at: { x: 500, y: 510 }, label: "down", title: "Coming soon" },
    ],
  },
  {
    id: "building",
    name: "Building things",
    note: "Projects",
    tone: 4,
    route: [
      { x: 180, y: 520 },
      { x: 300, y: 400 },
      { x: 620, y: 400 },
      { x: 720, y: 300 },
      { x: 900, y: 300 },
    ],
    termini: [
      { at: { x: 180, y: 520 }, label: "down" },
      { at: { x: 900, y: 300 }, label: "right" },
    ],
    stops: [
      { at: { x: 180, y: 520 }, label: "down", title: "Coming soon" },
      { at: { x: 320, y: 400 }, label: "down", title: "Coming soon" },
      { at: { x: 500, y: 400 }, label: "right", title: "Coming soon" },
      { at: { x: 620, y: 400 }, label: "down", title: "Coming soon" },
      { at: { x: 900, y: 300 }, label: "up", title: "Coming soon" },
    ],
  },
];
