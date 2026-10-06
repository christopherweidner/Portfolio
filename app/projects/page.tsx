import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import { PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects — Christopher Weidner",
  description:
    "Things Christopher Weidner has built and shipped, with the decisions behind them.",
};

export default function Projects() {
  return (
    <main className="flex-1 px-6 pb-24 pt-12 sm:px-10">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">Projects</h1>
        <p
          className="reveal mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed"
          style={{ "--d": "120ms" } as CSSProperties}
        >
          Things I have built and shipped, with the decisions behind them.
        </p>

        <ProjectsGrid projects={PROJECTS} />
      </div>
    </main>
  );
}
