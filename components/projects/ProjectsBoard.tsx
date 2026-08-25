"use client";

import { useCallback, useState } from "react";
import { PROJECTS } from "@/content/projects";
import ProjectBackdrop from "./ProjectBackdrop";
import ProjectRow from "./ProjectRow";

/**
 * Composition root for the Projects page.
 *
 * Two pieces of state, kept apart on purpose:
 *   active — which panel is showing. Follows hover and focus, so the picture
 *            changes as you move through the list without committing to anything.
 *   open   — which row is expanded. Only changes on a click.
 *
 * Merging them would mean the description opened and closed as the mouse
 * drifted across the list, which is unusable.
 */
export default function ProjectsBoard() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const toggle = useCallback((i: number) => {
    setOpen((current) => (current === i ? null : i));
  }, []);

  return (
    <section className="relative min-h-svh">
      {/* Panel: full height at the right on desktop, a band above the list on phones. */}
      <div className="relative mx-6 mb-8 h-[220px] sm:mx-12 lg:absolute lg:inset-y-0 lg:right-0 lg:m-0 lg:h-auto lg:w-[46%]">
        <ProjectBackdrop projects={PROJECTS} activeIndex={active} />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col justify-center px-6 pb-36 pt-8 sm:px-12 lg:w-[54%] lg:pt-24">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-label opacity-70">
            Projects
          </span>
          <p className="max-w-[42ch] text-[13.5px] leading-relaxed text-ink-soft">
            Things I have built and put in front of people. This page is honest
            about being early.
          </p>
        </div>

        <ul className="mt-10 flex flex-col">
          {PROJECTS.map((project, i) => (
            <ProjectRow
              key={i}
              project={project}
              index={i}
              active={i === active}
              open={open === i}
              onActivate={() => setActive(i)}
              onToggle={() => toggle(i)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
