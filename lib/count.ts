/**
 * Counting up. Pure helpers for number animations: how far along a count is
 * at a given moment, and how to write a place.
 */

/** Fast at first, settling gently on the final value. */
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Eased progress from 0 to 1 of a count that starts `delay` ms in and
 * lasts `duration` ms, at `elapsed` ms.
 */
export function countProgress(elapsed: number, delay: number, duration: number) {
  const t = Math.min(Math.max((elapsed - delay) / duration, 0), 1);
  return easeOutCubic(t);
}

/** The value shown at progress `p`: whole numbers only, never past `to`. */
export const countAt = (to: number, p: number) => Math.round(to * p);

/** 1 → "1st", 2 → "2nd", 3 → "3rd", 4 → "4th", 11 → "11th", 22 → "22nd". */
export function ordinal(n: number) {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
}
