/**
 * The home page intro: a greeting, three photos, one sentence, and the hero text.
 *
 * `sentence` is split so one word can be coloured. Replace the photos by
 * overwriting public/intro/me-1.jpg … me-3.jpg.
 */
export const INTRO = {
  greeting: "Hi, I'm Christopher",
  // Placeholder — Christopher will supply the final sentence.
  sentence: {
    before: "I'm building software for preventive ",
    highlight: "health",
    after: ".",
  },
  photos: [
    { src: "/intro/me-1.jpg", alt: "Christopher" },
    { src: "/intro/me-2.jpg", alt: "Christopher" },
    { src: "/intro/me-3.jpg", alt: "Christopher" },
  ],
};

/** The giant lines at the top of the home page. */
export const HERO = {
  name: "Christopher Weidner",
  subtitle: "Athlete, Builder & Writer",
};
