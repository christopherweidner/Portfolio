"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectSheet from "@/components/projects/ProjectSheet";
import type { Project } from "@/content/projects";
import { offsetFrom, wrapIndex } from "@/lib/carousel";

/** Horizontal travel in px before a drag counts as a swipe. */
const SWIPE_THRESHOLD = 40;
/** Neighbour tilt in degrees. */
const NEIGHBOUR_TILT = 8;

const roundButton =
  "grid size-11 place-items-center rounded-full bg-ground text-ink shadow-[var(--card-shadow)] transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * The home page's featured projects: one large card in the middle, tilted
 * neighbours peeking in. Buttons, arrow keys and swipes move it; it never
 * moves on its own.
 */
export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const count = projects.length;
  const [active, setActive] = useState(0);
  const [sheet, setSheet] = useState<number | null>(null);
  const dragStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const go = useCallback((step: number) => setActive((current) => wrapIndex(current + step, count)), [count]);

  if (count === 0) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      // The centre slide goes inert after the move; keep focus in the carousel.
      if (event.target !== event.currentTarget) event.currentTarget.focus();
      go(event.key === "ArrowLeft" ? -1 : 1);
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    dragStart.current = event.clientX;
    swiped.current = false;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };

  return (
    <section aria-labelledby="featured-projects" className="overflow-x-clip px-6 py-28 sm:px-10 sm:py-44">
      <div className="text-center">
        <h2 id="featured-projects" className="font-display text-section uppercase leading-none">
          Featured Projects
        </h2>
        <p className="mt-3 text-[15px]">What I am building, and what comes next.</p>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
        onClickCapture={(event) => {
          if (swiped.current) {
            event.preventDefault();
            event.stopPropagation();
            swiped.current = false;
          }
        }}
        className="carousel mx-auto select-none mt-20 max-w-5xl touch-pan-y rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-blue"
      >
        {projects.map((project, i) => {
          const offset = offsetFrom(active, i, count);
          const shown = Math.abs(offset) <= 1;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={offset !== 0}
              inert={offset !== 0}
              data-offset={shown ? offset : "hidden"}
              onDragStart={(e) => e.preventDefault()}
              className="carousel-slide"
            >
              <ProjectCard
                project={project}
                tilt={offset * NEIGHBOUR_TILT}
                onOpen={offset === 0 ? () => setSheet(i) : undefined}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-14 flex items-center justify-center gap-5">
        <button type="button" onClick={() => go(-1)} aria-label="Previous project" className={roundButton}>
          ←
        </button>
        <span aria-hidden className="min-w-[6ch] text-center font-mono text-[11px] uppercase tracking-[0.14em] text-label">
          {active + 1} / {count}
        </span>
        <button type="button" onClick={() => go(1)} aria-label="Next project" className={roundButton}>
          →
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {projects[active].title}, {active + 1} of {count}
      </p>

      <ProjectSheet project={sheet === null ? null : projects[sheet]} onClose={() => setSheet(null)} />
    </section>
  );
}
