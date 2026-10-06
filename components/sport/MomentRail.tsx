"use client";

import { useEffect, useState, type MouseEvent } from "react";

type Props = {
  /** One entry per moment, in page order. `id` is the moment's element id. */
  items: { id: string; label: string }[];
};

/** The band of the viewport that decides which moment is current. */
const ROOT_MARGIN = "-45% 0px -45% 0px";

/**
 * The dot menu at the right edge of the Sport page. The current moment's dot
 * is larger and shows its year; the others show theirs on hover or focus.
 * The dots are plain anchor links, so they work without JavaScript; with it
 * they scroll smoothly (unless reduced motion is asked for).
 */
export default function MomentRail({ items }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(elements.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string, index: number) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActive(index);
  };

  return (
    <nav aria-label="Years" className="moment-rail">
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={i === active ? "location" : undefined}
              onClick={(event) => jump(event, item.id, i)}
            >
              <span className="moment-rail-label">{item.label}</span>
              <span className="moment-rail-dot" aria-hidden />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
