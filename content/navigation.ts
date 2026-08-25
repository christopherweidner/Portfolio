/**
 * The site's navigation.
 *
 * One list, read by both the desktop dock and the mobile menu. They look
 * nothing alike and share no markup — but adding a page must never mean
 * editing two files, so the links and the active-route rule live here.
 */

export type NavLink = {
  href: string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sport", label: "Sport" },
  { href: "/learning", label: "Learning" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

/**
 * Home needs an exact match; every other route matches its prefix so that a
 * future /projects/some-slug still highlights Projects.
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
