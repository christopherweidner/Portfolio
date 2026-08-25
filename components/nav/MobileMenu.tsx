"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { EMAIL, SOCIALS } from "@/content/contact";
import { isActiveRoute, NAV_LINKS } from "@/content/navigation";

/**
 * The phone menu: one glass button, and a full-screen sheet.
 *
 * Translucent rather than opaque, so the background blooms stay visible behind
 * the page names. It also carries the email and socials, which makes it the
 * hub of the site rather than only a list of routes.
 *
 * Hidden from `md` up, where DesktopDock takes over.
 */
export default function MobileMenu() {
  const pathname = usePathname();
  const sheetId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Rather than a boolean kept in sync with the route, state records WHICH
  // route the menu was opened on. Openness is then derived: navigate, and it
  // closes by itself. This component lives in the root layout and never
  // unmounts, so a boolean would need an effect to reset it — and state synced
  // by an effect is state waiting to be wrong.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const close = useCallback(() => setOpenedOn(null), []);
  const toggle = useCallback(
    () => setOpenedOn((current) => (current === pathname ? null : pathname)),
    [pathname],
  );

  // While the sheet is open the page behind it must not scroll.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Escape closes, focus moves into the sheet and returns to the trigger, and
  // Tab cycles inside it. A menu covering the whole screen is a modal, and a
  // modal that leaks focus to the page underneath is unusable with a keyboard.
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    const focusable = sheet.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusable[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenedOn(null);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div data-menu-open={open} className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={sheetId}
        className="glass fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[60] inline-flex -translate-x-1/2 items-center gap-2.5 rounded-full px-5 py-3 text-[13px] text-label focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
      >
        <span className="flex flex-col gap-[3px]">
          <span className="menu-bar" />
          <span className="menu-bar" />
        </span>
        {open ? "Close" : "Menu"}
      </button>

      <div
        id={sheetId}
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`menu-sheet fixed inset-0 z-50 flex flex-col px-6 pb-28 pt-8 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-label opacity-65">
          Menu
        </span>

        <nav aria-label="Pages" className="mt-7 flex flex-col">
          {NAV_LINKS.map(({ href, label }, i) => {
            const active = isActiveRoute(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={close}
                className={`flex items-baseline gap-3 border-t border-rule py-3 ${
                  open ? "reveal" : ""
                }`}
                style={{ "--d": `${60 + i * 45}ms` } as CSSProperties}
              >
                <span
                  className={`font-mono text-[9px] tracking-[0.1em] ${
                    active ? "text-blue" : "text-ink-faint"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-serif text-[30px] font-medium leading-none tracking-[-0.02em] ${
                    active ? "text-blue" : "text-ink"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-label opacity-85">
          <a href={`mailto:${EMAIL}`} onClick={close} className="w-fit">
            <span className="link-underline inline-block">{EMAIL}</span>
          </a>
          <div className="flex gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.description}
              >
                <span className="link-underline inline-block">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
