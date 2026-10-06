"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveRoute, NAV_LINKS } from "@/content/navigation";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * The site's only navigation: a plain bar at the top. Every link is visible
 * at every width — on a phone the links move to their own row and scroll
 * sideways instead of hiding behind a menu button.
 */
export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-[var(--bar-h)] border-b border-rule bg-ground/90 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <Link href="/" className={`self-start font-display text-[1.2rem] uppercase leading-none tracking-[0.02em] text-ink sm:self-auto ${focusRing}`}>
          Christopher Weidner
        </Link>

        <ul className="no-scrollbar -mx-4 -my-2 flex gap-6 overflow-x-auto px-4 py-2 sm:m-0 sm:overflow-visible sm:p-0">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActiveRoute(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`block whitespace-nowrap py-1 text-[14px] decoration-blue decoration-[1.5px] underline-offset-[6px] transition-colors ${focusRing} ${
                    active ? "text-ink underline" : "text-label hover:text-blue"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
