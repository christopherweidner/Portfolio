import me1 from "@/public/intro/me-1.jpg";
import me2 from "@/public/intro/me-2.jpg";
import me3 from "@/public/intro/me-3.jpg";

/**
 * The home page intro: a greeting, three photos, one sentence, and the hero text.
 *
 * `sentence` is split so one word can be coloured.
 *
 * Photos are imported (above) rather than referenced by path, so the site
 * knows each one's real size — landscape photos in the portrait cards are
 * then downloaded wide enough to stay sharp — and a replaced file shows up
 * at once instead of being served from a cache. To change a photo, overwrite
 * public/intro/me-1.jpg … me-3.jpg, or import another file. Order: first is
 * the left card, second the middle, third the right.
 */
export const INTRO = {
  greeting: "Hi, I'm Christopher",
  sentence: {
    before: "I'm a computer science student who wants to build something in preventive ",
    highlight: "health",
    after: ".",
  },
  photos: [
    { src: me1, alt: "Christopher" },
    { src: me2, alt: "Christopher" },
    { src: me3, alt: "Christopher" },
  ],
};

/** The lines of the home page's first screen. */
export const HERO = {
  location: "Potsdam, Deutschland",
  name: "Christopher Weidner",
  subtitle: "Athlete, CS Student & Human",
};
