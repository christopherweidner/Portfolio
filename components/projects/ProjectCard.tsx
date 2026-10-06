import TiltCard from "@/components/ui/TiltCard";
import ProjectMedia from "@/components/projects/ProjectMedia";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  tilt?: number;
  /** When given, the card is a button that reports this. */
  onOpen?: () => void;
};

/**
 * One project as a card: the screenshot, or a cobalt gradient until there is
 * one, then title, meta and summary. Used by the home carousel.
 */
export default function ProjectCard({ project, tilt = 0, onOpen }: Props) {
  return (
    <TiltCard tilt={tilt} onClick={onOpen} label={onOpen ? `Open project: ${project.title}` : undefined} className="flex aspect-[4/5] flex-col">
      <ProjectMedia project={project} sizes="(min-width: 1024px) 22rem, 80vw" className="min-h-0 flex-1" />

      <div className="flex flex-col gap-2 p-5 text-left">
        <h3 className="font-display text-2xl uppercase leading-none text-ink">{project.title}</h3>
        {project.meta ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-label">{project.meta}</span>
        ) : null}
        <p className="line-clamp-3 text-[14px] leading-relaxed">{project.summary}</p>
      </div>
    </TiltCard>
  );
}
