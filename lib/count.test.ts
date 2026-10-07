import { describe, expect, it } from "vitest";
import { countAt, countProgress, ordinal } from "./count";

describe("countProgress", () => {
  it("is 0 before the delay and 1 once the duration has passed", () => {
    expect(countProgress(100, 200, 1000)).toBe(0);
    expect(countProgress(1200, 200, 1000)).toBe(1);
    expect(countProgress(5000, 200, 1000)).toBe(1);
  });

  it("eases out: past halfway at the halfway point", () => {
    expect(countProgress(700, 200, 1000)).toBeGreaterThan(0.5);
  });
});

describe("countAt", () => {
  it("counts in whole numbers from 0 to the target", () => {
    expect(countAt(10, 0)).toBe(0);
    expect(countAt(10, 0.54)).toBe(5);
    expect(countAt(10, 1)).toBe(10);
  });
});

describe("ordinal", () => {
  it("writes places", () => {
    expect([1, 2, 3, 4].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th"]);
    expect([11, 12, 13, 21, 22, 101].map(ordinal)).toEqual(["11th", "12th", "13th", "21st", "22nd", "101st"]);
  });
});
