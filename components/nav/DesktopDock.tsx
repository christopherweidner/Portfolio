"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveRoute, NAV_LINKS } from "@/content/navigation";

/**
 * The floating glass dock. Desktop only — on a phone six links in a
 * horizontally scrolling capsule is a bad control, and MobileMenu replaces it
 * entirely below `md`.
 */
export default function DesktopDock() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 hidden justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:flex"
    >
      <div className="glass no-scrollbar pointer-events-auto flex max-w-full gap-1 overflow-x-auto rounded-full p-[5px]">
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActiveRoute(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[12.5px] transition-colors ${
                active
                  ? "bg-blue font-medium text-ground"
                  : "text-label hover:bg-white/40 hover:text-blue"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
