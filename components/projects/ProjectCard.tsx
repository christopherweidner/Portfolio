import Image from "next/image";
import type { CSSProperties } from "react";
import TiltCard from "@/components/ui/TiltCard";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  tilt?: number;
  /** h2 on /projects (under the page h1), h3 inside a home section. */
  titleAs?: "h2" | "h3";
  className?: string;
};

/**
 * One project as a card: the screenshot, or a cobalt gradient until there is
 * one, then title, meta and summary. Used by the home carousel and /projects.
 */
export default function ProjectCard({ project, tilt = 0, titleAs: Title = "h3", className = "" }: Props) {
  return (
    <TiltCard tilt={tilt} href={project.href} className={`flex aspect-[4/5] flex-col ${className}`}>
      <div
        className="media min-h-0 flex-1"
        style={{ "--pa": project.angle ?? "150deg" } as CSSProperties}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.alt ?? ""}
            fill
            sizes="(min-width: 1024px) 22rem, 80vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-2 p-5 text-left">
        <Title className="font-display text-2xl uppercase leading-none text-ink">{project.title}</Title>
        {project.meta ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-label">{project.meta}</span>
        ) : null}
        <p className="line-clamp-3 text-[14px] leading-relaxed">{project.summary}</p>
      </div>
    </TiltCard>
  );
}
