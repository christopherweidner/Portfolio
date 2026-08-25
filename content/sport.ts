/**
 * Editorial content for the Sport page.
 *
 * This is the only file you need to edit to change what the timeline says.
 * Add, remove or reorder entries and the layout follows — the track spaces
 * itself from the number of moments.
 *
 * TODO: every year below is a placeholder. Replace them.
 */

export type Moment = {
  /** Printed under the timeline track. */
  year: string;
  /** The huge ghosted words behind the text. "\n" forces a line break. */
  era: string;
  /** Small mono label above the title. */
  eyebrow: string;
  title: string;
  body: string;
  /** Photos live in /public/sport/ — reference them as "/sport/name.jpg". */
  image?: string;
  /** Required whenever `image` is set. Describes the photo, not the moment. */
  alt?: string;
  /** Placeholder gradient angle, used only while `image` is empty. */
  angle?: string;
  /**
   * The photo's own aspect ratio, as a CSS value: "3/2" for landscape,
   * "2/3" or "3/4" for portrait. The plate is sized from this, so photos are
   * never cropped — the frame changes shape instead. Defaults to "3/2".
   */
  aspect?: string;
};

export const MOMENTS: Moment[] = [
  {
    year: "2010",
    era: "First\nstrokes",
    eyebrow: "01 — Beginning",
    title: "First club, first laps",
    body:
      "My parents signed me up so I could keep myself above water. I kept moving up a group at a time and never stopped.",
    image: "/sport/bamberg-open.jpg",
    alt:
      "A young swimmer in a white GER cap and blue jammers standing poolside " +
      "among other competitors at an outdoor meet.",
    aspect: "3/2",
  },
  {
    year: "2015",
    era: "Into the\nsystem",
    eyebrow: "02 — Potsdam",
    title: "Olympic Training Centre",
    body:
      "Moving into the training centre in Potsdam. Structured coaching, a squad " +
      "around me, and the first year the sport asked for real hours.",
    angle: "30deg",
  },
  {
    year: "2018",
    era: "Twenty hours\na week",
    eyebrow: "03 — The routine",
    title: "Twenty hours in the water",
    body:
      "Two sessions most days, plus land work. Almost none of it feels like " +
      "progress on the day. All of it is the progress.",
    angle: "210deg",
  },
  {
    year: "2021",
    era: "National\nteam",
    eyebrow: "04 — Selection",
    title: "German national team",
    body:
      "Called up to represent Germany. The standard moves, and everything you " +
      "thought was fast becomes the new baseline.",
    angle: "95deg",
  },
  {
    year: "2022",
    era: "Junior\nEuropeans",
    eyebrow: "05 — Result",
    title: "Fourth, Junior European Championships",
    body:
      "Fourth at the Junior European Championships. Close enough to the podium " +
      "to know exactly which details cost it.",
    angle: "260deg",
  },
  {
    year: "2026",
    era: "Now",
    eyebrow: "06 — Now",
    title: "Training and building",
    body:
      "Still in the water, now alongside computer science at the " +
      "Hasso-Plattner-Institut. The same method pointed at a second thing.",
    angle: "340deg",
  },
];
