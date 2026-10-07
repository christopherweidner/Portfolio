/** Splits plain text into paragraphs at blank lines ("\n\n"), dropping empty ones. */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
