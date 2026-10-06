"use client";

import { useEffect, useRef } from "react";
import ProjectMedia from "@/components/projects/ProjectMedia";
import type { Project } from "@/content/projects";

type Props = {
  /** The project to show; null keeps the sheet closed. */
  project: Project | null;
  onClose: () => void;
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * A project, large. Controlled by the parent: pass a project to open it,
 * null to close it. Escape, the × button and a click on the backdrop all
 * report onClose.
 */
export default function ProjectSheet({ project, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (project && !element.open) element.showModal();
    if (!project && element.open) element.close();
  }, [project]);

  // The page behind must not scroll while the sheet is open.
  useEffect(() => {
    if (!project) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [project]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-sheet-title"
      onClose={onClose}
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        // Only the backdrop is the dialog itself; the content sits in the inner
        // div. Both press and release must land there, so selecting text and
        // letting go outside does not close the sheet.
        if (pressedBackdrop.current && event.target === event.currentTarget) onClose();
        pressedBackdrop.current = false;
      }}
      className="project-sheet"
    >
      {project ? (
        <div className="flex flex-col gap-6 p-5 sm:p-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`grid size-10 place-items-center rounded-full bg-ground-soft text-xl leading-none text-ink transition-colors hover:text-blue ${focusRing}`}
            >
              ×
            </button>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
            <ProjectMedia project={project} sizes="(min-width: 1024px) 56rem, 92vw" />
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="project-sheet-title" className="font-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-[0.95]">
              {project.title}
            </h2>
            {project.meta ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">{project.meta}</span>
            ) : null}
            <p className="max-w-[60ch] text-[16px] leading-relaxed">{project.summary}</p>
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 self-start font-mono text-[12px] uppercase tracking-[0.14em] text-blue underline-offset-4 hover:underline ${focusRing}`}
              >
                Visit ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
