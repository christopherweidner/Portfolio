import { describe, expect, it } from "vitest";
import { paragraphs } from "./text";

describe("paragraphs", () => {
  it("splits at blank lines and trims", () => {
    expect(paragraphs("One.\n\n  Two.  \n \nThree.")).toEqual(["One.", "Two.", "Three."]);
  });

  it("keeps single line breaks inside a paragraph and drops empty ones", () => {
    expect(paragraphs("A\nB\n\n\n\n")).toEqual(["A\nB"]);
  });
});
