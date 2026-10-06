/**
 * The projects list.
 *
 * Deliberately three empty slots. Nothing invented — the site is public and a
 * plausible-looking fake project is worse than an honest gap.
 *
 * To fill one in: replace `title`, write a real `summary`, add `href` if it is
 * live, and add `image` + `alt` once there is a screenshot. The moment `image`
 * is set the placeholder gradient disappears and `angle` can go.
 */

export type Project = {
  title: string;
  /** Small mono text beside the title. Leave empty to show nothing. */
  meta: string;
  /** One or two lines, shown on the card (clamped to three lines). */
  summary: string;
  /** A live URL, if there is one. Cards without it are not links. */
  href?: string;
  /** Screenshots live in /public/projects/. */
  image?: string;
  /** Required whenever `image` is set. */
  alt?: string;
  /** Placeholder gradient angle, used only while `image` is empty. */
  angle?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Coming soon",
    meta: "",
    summary:
      "The first one is being built. When it ships it will appear here, along with what I decided, what I got wrong, and how many people actually used it.",
    angle: "150deg",
  },
  {
    title: "Coming soon",
    meta: "",
    summary: "Reserved.",
    angle: "40deg",
  },
  {
    title: "Coming soon",
    meta: "",
    summary: "Reserved.",
    angle: "255deg",
  },
];
