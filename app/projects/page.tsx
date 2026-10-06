import type { Metadata } from "next";
import ProjectCard from "@/components/projects/ProjectCard";
import { PROJECTS } from "@/content/projects";
import { GRID_TILTS } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Projects — Christopher Weidner",
  description:
    "Things Christopher Weidner has built and shipped, with the decisions behind them.",
};

export default function Projects() {
  return (
    <main className="flex-1 px-6 pb-24 pt-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">Projects</h1>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed">
          Things I have built and shipped, with the decisions behind them.
        </p>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <li key={i}>
              <ProjectCard project={project} tilt={GRID_TILTS[i % GRID_TILTS.length]} titleAs="h2" />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
