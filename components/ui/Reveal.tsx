"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** How far inside the viewport an element must be before it reveals. */
const ROOT_MARGIN = "0px 0px -12% 0px";

/**
 * Fades and lifts its content in the first time it scrolls into view. The
 * hidden state only applies when scripting is on (see effects.css), so the
 * content is never lost without JavaScript.
 */
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.shown = "";
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`}>
      {children}
    </div>
  );
}
