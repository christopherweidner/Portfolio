import { describe, expect, it } from "vitest";
import { coverScale } from "./images";

describe("coverScale", () => {
  it("is 1 when the photo has the frame's shape", () => {
    expect(coverScale({ width: 800, height: 1000 }, 4 / 5)).toBe(1);
  });

  it("is 1 when the photo is taller than the frame (cropped top and bottom)", () => {
    expect(coverScale({ width: 4000, height: 6000 }, 4 / 5)).toBe(1);
  });

  it("is how many frame-widths a wider photo is drawn across", () => {
    // 3:2 landscape in a 4:5 card: drawn 1.5 / 0.8 = 1.875 card-widths wide.
    expect(coverScale({ width: 2048, height: 1365 }, 4 / 5)).toBeCloseTo(1.875, 2);
  });
});
