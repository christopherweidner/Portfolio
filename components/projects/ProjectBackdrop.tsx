import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";

type Props = {
  projects: Project[];
  activeIndex: number;
};

/**
 * The large panel that changes as you move through the list.
 *
 * Every project is rendered as its own layer and crossfaded by opacity, rather
 * than swapping the source of one element. Swapping would flash while the new
 * image decodes; layering means the next one is already painted and only has
 * to fade up.
 *
 * Purely presentational.
 */
export default function ProjectBackdrop({ projects, activeIndex }: Props) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-l-[3px]">
      {projects.map((project, i) => {
        const active = i === activeIndex;
        return (
          <div
            key={i}
            className={[
              "media absolute inset-0 transition-all duration-700 ease-out",
              active ? "scale-100 opacity-100" : "scale-105 opacity-0",
            ].join(" ")}
            style={{ "--pa": project.angle ?? "150deg" } as CSSProperties}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.alt ?? ""}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority={i === 0}
              />
            ) : null}
          </div>
        );
      })}

      {/* Softens the panel where it meets the paper on its left edge. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ground/70 to-transparent" />
    </div>
  );
}
