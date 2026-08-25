"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sport", label: "Sport" },
  { href: "/learning", label: "Learning" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="glass no-scrollbar pointer-events-auto flex max-w-full gap-1 overflow-x-auto rounded-full p-[5px]">
        {LINKS.map(({ href, label }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] transition-colors sm:px-4 ${
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
