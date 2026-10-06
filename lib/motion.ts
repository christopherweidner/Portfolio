/**
 * Shared motion constants.
 *
 * These are design decisions, not implementation details — they belong in
 * one place so the whole site moves at the same speed.
 */

/** Tilts for card grids, cycled by index so neighbours lean differently. */
export const GRID_TILTS = [-2, 1.5, -1, 2] as const;
