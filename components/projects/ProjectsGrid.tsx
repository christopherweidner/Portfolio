"use client";

import { useState } from "react";
import ProjectSheet from "@/components/projects/ProjectSheet";
import ProjectTile from "@/components/projects/ProjectTile";
import type { Project } from "@/content/projects";
import { GRID_TILTS } from "@/lib/motion";

/** The /projects grid. Owns which project's sheet is open. */
export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="mx-auto mt-20 grid max-w-5xl justify-items-center gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <li key={i} className="w-full max-w-[18rem]">
            <ProjectTile project={project} tilt={GRID_TILTS[i % GRID_TILTS.length]} onOpen={() => setOpen(i)} />
          </li>
        ))}
      </ul>
      <ProjectSheet project={open === null ? null : projects[open]} onClose={() => setOpen(null)} />
    </>
  );
}
