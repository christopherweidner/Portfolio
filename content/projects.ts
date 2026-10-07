/**
 * The projects list.
 *
 * Real projects first, then empty slots. Nothing invented — the site is
 * public and a plausible-looking fake project is worse than an honest gap.
 *
 * To fill a slot in: replace `title`, write a real `summary` (and `body` for
 * the full story), add `href` if it is live, and add `image` + `alt` once
 * there is a screenshot. The moment `image` is set the placeholder gradient
 * disappears and `angle` can go.
 */

export type Project = {
  title: string;
  /** Small mono text beside the title. Leave empty to show nothing. */
  meta: string;
  /** One or two lines, shown on the card (clamped to three lines). */
  summary: string;
  /**
   * The full story, shown when the project is opened. Plain text; a blank
   * line ("\n\n") starts a new paragraph. Without it, the summary is shown.
   */
  body?: string;
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
    title: "Pura",
    meta: "Built for myself · not launched yet",
    summary:
      "A tool I built for myself that automates deciding what to eat and shopping for it.",
    body:
      "Pura came from a problem of my own. I was very focused and diligent about my nutrition, and I wanted it to be perfect. That was really hard, because of the friction of having to shop for groceries and decide what to eat every single day.\n\nSo I built a tool for myself that automates this process. It has worked great for me.\n\nI thought about launching it, but haven't yet. The website is still up, and I will see whether I finish Pura for the public. If there is demand, I will publish it.",
    href: "https://www.pura-app.de/",
    image: "/projects/pura.jpg",
    alt:
      "A bowl seen from above: seared salmon with dill and lemon, green " +
      "asparagus, roasted cherry tomatoes and a grain salad.",
  },
  {
    title: "Creative Solutions",
    meta: "Freelance agency · video & web",
    summary:
      "My freelance agency: video work for local businesses, and websites and Shopify shops for clients and for myself.",
    body:
      "Creative Solutions is the name I freelance under.\n\nOn the video side, I made videos for local businesses.\n\nOn the web side, I built websites, both for myself and for clients, and set up Shopify shops.",
    image: "/projects/creative-solutions.jpg",
    alt: "The Creative Solutions logo: a light blue chevron pointing upwards on a pale grey ground.",
  },
  {
    title: "Coming soon",
    meta: "",
    summary: "Reserved.",
    angle: "255deg",
  },
];
