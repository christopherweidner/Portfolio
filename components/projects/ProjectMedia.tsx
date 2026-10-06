import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  /** next/image `sizes` for where this is shown. */
  sizes: string;
  className?: string;
};

/**
 * A project's screenshot, or its cobalt gradient until there is one. Fills
 * its parent; the parent decides the shape.
 */
export default function ProjectMedia({ project, sizes, className = "" }: Props) {
  return (
    <div className={`media h-full w-full ${className}`} style={{ "--pa": project.angle ?? "150deg" } as CSSProperties}>
      {project.image ? (
        <Image src={project.image} alt={project.alt ?? ""} fill sizes={sizes} className="object-cover" />
      ) : null}
    </div>
  );
}
