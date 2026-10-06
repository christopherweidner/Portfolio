import TiltCard from "@/components/ui/TiltCard";
import ProjectMedia from "@/components/projects/ProjectMedia";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  tilt?: number;
  onOpen: () => void;
};

/**
 * One project in the /projects grid: a square card that opens the sheet,
 * with the title and a short line underneath. Purely presentational.
 */
export default function ProjectTile({ project, tilt = 0, onOpen }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <TiltCard tilt={tilt} onClick={onOpen} label={`Open project: ${project.title}`} className="aspect-square max-w-[18rem]">
        <ProjectMedia project={project} sizes="18rem" />
      </TiltCard>
      <h2 className="mt-7 font-display text-2xl uppercase leading-none text-ink">{project.title}</h2>
      {project.meta ? (
        <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-label">{project.meta}</span>
      ) : null}
      <p className="mt-2 line-clamp-2 max-w-[30ch] text-[14px] leading-relaxed">{project.summary}</p>
    </div>
  );
}
