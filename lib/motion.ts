/**
 * Shared motion constants.
 *
 * These are design decisions, not implementation details — they belong in
 * one place so the whole site moves at the same speed.
 */

export const DRIFT = {
  /** Maximum px an anchored element travels from the centre of its region. */
  range: 58,
  /** Easing applied per frame, 0–1. Lower is lazier. */
  lag: 0.12,
} as const;

/** Delay between staggered entrance elements, in ms. */
export const REVEAL_STEP = 280;
