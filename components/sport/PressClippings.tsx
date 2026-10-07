"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TiltCard from "@/components/ui/TiltCard";
import type { Clipping } from "@/content/sport";
import { GRID_TILTS } from "@/lib/motion";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * The newspaper clippings, pinned side by side. Each card shows the top of
 * the clipping; opening it shows the whole page large, with a link to the
 * article online where there is one.
 */
export default function PressClippings({ clippings }: { clippings: Clipping[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const clipping = open === null ? null : clippings[open];

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (clipping && !element.open) element.showModal();
    if (!clipping && element.open) element.close();
  }, [clipping]);

  // The page behind must not scroll while a clipping is open.
  useEffect(() => {
    if (!clipping) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [clipping]);

  return (
    <>
      <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {clippings.map((item, i) => (
          <li key={item.image}>
            <TiltCard tilt={GRID_TILTS[i % GRID_TILTS.length]} onClick={() => setOpen(i)} label={`Read clipping: ${item.headline}`}>
              <div className="clipping-board">
                <div className="clipping-paper">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
                    className="object-cover object-left-top"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-label">
                  {item.outlet} · {item.date}
                </span>
                <h3 className="font-display text-[1.6rem] uppercase leading-[0.95] text-ink text-balance">{item.headline}</h3>
                <span aria-hidden className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-blue">
                  Read clipping <span className="project-card-arrow">→</span>
                </span>
              </div>
            </TiltCard>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-labelledby="clipping-title"
        onClose={() => setOpen(null)}
        onPointerDown={(event) => {
          pressedBackdrop.current = event.target === event.currentTarget;
        }}
        onClick={(event) => {
          // Press and release must both land on the backdrop to close.
          if (pressedBackdrop.current && event.target === event.currentTarget) setOpen(null);
          pressedBackdrop.current = false;
        }}
        className="project-sheet"
      >
        {clipping ? (
          <div className="flex flex-col gap-5 p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">
                  {clipping.outlet} · {clipping.date}
                </span>
                <h2 id="clipping-title" className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase leading-[0.95] text-ink">
                  {clipping.headline}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className={`grid size-10 flex-none place-items-center rounded-full bg-ground-soft text-xl leading-none text-ink transition-colors hover:text-blue ${focusRing}`}
              >
                ×
              </button>
            </div>

            <div className="rounded-[18px] bg-ground-soft p-3 sm:p-5">
              <Image
                src={clipping.image}
                alt={clipping.alt}
                width={clipping.width}
                height={clipping.height}
                sizes="(min-width: 1024px) 52rem, 92vw"
                className="mx-auto h-auto max-h-[75vh] w-auto rounded-[6px] shadow-[var(--card-shadow)]"
              />
            </div>

            {clipping.href ? (
              <a
                href={clipping.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`self-center font-mono text-[12px] uppercase tracking-[0.14em] text-blue underline-offset-4 hover:underline ${focusRing}`}
              >
                Read online ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
