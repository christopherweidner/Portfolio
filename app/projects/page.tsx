import type { Metadata } from "next";
import ProjectsBoard from "@/components/projects/ProjectsBoard";

export const metadata: Metadata = {
  title: "Projects — Christopher Weidner",
  description:
    "Things Christopher Weidner has built and shipped, with the decisions behind them.",
};

export default function Projects() {
  return (
    <main className="flex-1">
      <ProjectsBoard />
    </main>
  );
}
