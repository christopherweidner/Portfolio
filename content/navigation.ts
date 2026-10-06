/**
 * The site's navigation.
 *
 * One list, read by the top bar (components/nav/TopBar.tsx). Home is reached
 * through the name in the bar, so it is not listed. Adding a page must never
 * mean editing two files, so the links and the active-route rule live here.
 */

export type NavLink = {
  href: string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/sport", label: "Sport" },
  { href: "/contact", label: "Contact" },
];

/**
 * Home needs an exact match; every other route matches its prefix so that a
 * future /projects/some-slug still highlights Projects.
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
