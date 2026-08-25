/**
 * Transit-map maths.
 *
 * Pure: no DOM, no React, no side effects. Every export is a function of its
 * arguments, so all of it can be unit-tested without a browser.
 */

import type { Line, Point, Stop } from "@/content/learning";

export function pointKey(p: Point): string {
  return `${p.x}:${p.y}`;
}

/** Turns a route into SVG path data. */
export function toPathData(route: Point[]): string {
  if (route.length === 0) return "";
  const [first, ...rest] = route;
  return `M${first.x} ${first.y}` + rest.map((p) => ` L${p.x} ${p.y}`).join("");
}

/**
 * True when a segment is horizontal, vertical or exactly 45 degrees. That
 * constraint is what makes a transit map read as one rather than as a
 * flowchart, so it is worth enforcing.
 */
export function isOctolinear(a: Point, b: Point): boolean {
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(b.y - a.y);
  return dx === 0 || dy === 0 || dx === dy;
}

/** Every segment in every line that breaks the rule. Empty means the map is clean. */
export function findOffAxisSegments(
  lines: Line[],
): { line: string; from: Point; to: Point }[] {
  const bad: { line: string; from: Point; to: Point }[] = [];
  for (const line of lines) {
    for (let i = 1; i < line.route.length; i++) {
      const from = line.route[i - 1];
      const to = line.route[i];
      if (!isOctolinear(from, to)) bad.push({ line: line.id, from, to });
    }
  }
  return bad;
}

export type ResolvedStop = {
  key: string;
  stop: Stop;
  /** Every line passing through this point, in declaration order. */
  lines: Line[];
  /** True when more than one line stops here. */
  isInterchange: boolean;
};

/**
 * Collapses the per-line stop lists into one list of unique points.
 *
 * Interchanges are derived, never declared: two lines with a stop at the same
 * coordinate produce one marker carrying both. Adding a line that happens to
 * cross an existing stop creates the interchange with no further edits.
 */
export function resolveStops(lines: Line[]): ResolvedStop[] {
  const order: string[] = [];
  const byKey = new Map<string, ResolvedStop>();

  for (const line of lines) {
    for (const stop of line.stops) {
      const key = pointKey(stop.at);
      const existing = byKey.get(key);

      if (existing) {
        existing.lines.push(line);
        existing.isInterchange = true;
        // A filled-in stop wins over a placeholder from another line.
        if (existing.stop.title === "Coming soon" && stop.title !== "Coming soon") {
          existing.stop = stop;
        }
      } else {
        order.push(key);
        byKey.set(key, { key, stop, lines: [line], isInterchange: false });
      }
    }
  }

  return order.map((key) => byKey.get(key)!);
}
