/**
 * Pure geometry for bounded, pointer-reactive motion.
 *
 * Nothing here touches the DOM, React, or the window. Every export is a
 * function of its arguments, which means all of it can be unit-tested
 * without a browser. Keep it that way — DOM work belongs in the hook.
 */

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

/** The area an element's CENTRE is allowed to occupy, in stage pixels. */
export type Box = { minX: number; maxX: number; minY: number; maxY: number };

/** Distances from the stage edges, in pixels. */
export type Insets = { top: number; right: number; bottom: number; left: number };

/** Computes a Box from the stage and the element that has to fit inside it. */
export type RegionFn = (stage: Size, element: Size) => Box;

export function clamp(value: number, min: number, max: number): number {
  if (min > max) return min;
  return Math.min(Math.max(value, min), max);
}

export function centreOf(box: Box): Point {
  return { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 };
}

/**
 * A region centred on a point expressed as a FRACTION of the stage, allowing
 * `travel` pixels of movement in each direction, clamped so the element stays
 * fully inside the stage with `margin` to spare.
 *
 * Fractions rather than insets because they are what you actually want to
 * reason about: {x: 0.24, y: 0.5} is "a quarter across, halfway down", and
 * nudging the element left is one digit rather than arithmetic on four.
 */
export function anchorAt(home: Point, travel: number, margin: Insets): RegionFn {
  return (stage, element) => {
    const halfW = element.width / 2;
    const halfH = element.height / 2;

    // Hard limits: the element may never leave the stage.
    const edgeMinX = margin.left + halfW;
    const edgeMaxX = Math.max(edgeMinX, stage.width - margin.right - halfW);
    const edgeMinY = margin.top + halfH;
    const edgeMaxY = Math.max(edgeMinY, stage.height - margin.bottom - halfH);

    const hx = stage.width * home.x;
    const hy = stage.height * home.y;

    return {
      minX: clamp(hx - travel, edgeMinX, edgeMaxX),
      maxX: clamp(hx + travel, edgeMinX, edgeMaxX),
      minY: clamp(hy - travel, edgeMinY, edgeMaxY),
      maxY: clamp(hy + travel, edgeMinY, edgeMaxY),
    };
  };
}

/**
 * Where an element should sit given the pointer: it leans from the centre
 * of its box toward the cursor, never travelling further than `range`, and
 * never leaving the box.
 *
 * Returns the box centre when the stage has no size yet, which happens on
 * the first frame after mount.
 */
export function anchoredTarget(
  pointer: Point,
  stage: Size,
  box: Box,
  range: number,
): Point {
  const home = centreOf(box);
  if (stage.width <= 0 || stage.height <= 0) return home;

  const dx = (pointer.x - stage.width / 2) / (stage.width / 2);
  const dy = (pointer.y - stage.height / 2) / (stage.height / 2);

  return {
    x: clamp(home.x + dx * range, box.minX, box.maxX),
    y: clamp(home.y + dy * range, box.minY, box.maxY),
  };
}

/** One easing step from `from` toward `to`. `ease` of 1 arrives immediately. */
export function approach(from: Point, to: Point, ease: number): Point {
  return {
    x: from.x + (to.x - from.x) * ease,
    y: from.y + (to.y - from.y) * ease,
  };
}
