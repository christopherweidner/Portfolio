/**
 * Contact details and the invitation copy.
 *
 * Editorial data, so it lives here rather than in the component. Changing an
 * address or adding a profile touches only this file.
 */

export const EMAIL = "mail@christopherweidner.de";

export type Social = {
  label: string;
  href: string;
  /** What a screen reader announces, since the label alone is ambiguous. */
  description: string;
};

export const SOCIALS: Social[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/christopher.wdnr",
    description: "Christopher Weidner on Instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/christopher-weidner-81a691250/",
    description: "Christopher Weidner on LinkedIn",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@christopherweidner",
    description: "Christopher Weidner on YouTube",
  },
];

/**
 * Naming who you want to hear from is the difference between a contact page
 * and a working one. A bare address gets nothing.
 */
export const INVITATION = [
  "I would rather hear from you than not. Founders building something in health, coaches, students who train and study at the same time, and anyone who wants to argue about whether prevention is worth the effort — all welcome.",
  "If you are not sure it is worth sending, send it anyway. I read everything and I answer.",
];
