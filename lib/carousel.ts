/**
 * Index maths for a looping carousel. Pure, so the component only decides
 * what to render.
 */

export function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}

/**
 * Where slide `index` sits relative to the active one: 0 is centre, -1 the
 * left neighbour, +1 the right one, larger values further out. Goes the
 * shorter way round the ring; a tie (exactly opposite) counts as positive.
 */
export function offsetFrom(active: number, index: number, count: number): number {
  const ahead = wrapIndex(index - active, count);
  return ahead > count / 2 ? ahead - count : ahead;
}
