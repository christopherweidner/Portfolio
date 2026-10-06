import { describe, expect, it } from "vitest";
import { offsetFrom, wrapIndex } from "./carousel";

describe("wrapIndex", () => {
  it("wraps forwards and backwards", () => {
    expect(wrapIndex(3, 3)).toBe(0);
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(7, 3)).toBe(1);
  });
});

describe("offsetFrom", () => {
  it("is 0 for the active slide", () => {
    expect(offsetFrom(1, 1, 3)).toBe(0);
  });

  it("puts neighbours at -1 and +1, wrapping around", () => {
    expect(offsetFrom(0, 1, 3)).toBe(1);
    expect(offsetFrom(0, 2, 3)).toBe(-1);
    expect(offsetFrom(2, 0, 3)).toBe(1);
  });

  it("takes the shorter way round", () => {
    expect(offsetFrom(0, 4, 6)).toBe(-2);
    expect(offsetFrom(0, 2, 6)).toBe(2);
  });

  it("handles one and two slides", () => {
    expect(offsetFrom(0, 0, 1)).toBe(0);
    expect(offsetFrom(0, 1, 2)).toBe(1);
    expect(offsetFrom(1, 0, 2)).toBe(1);
  });
});
