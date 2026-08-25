import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  index: number;
  active: boolean;
  open: boolean;
  onActivate: () => void;
  onToggle: () => void;
};

/**
 * One row of the list. Presentational: it reports hover, focus and clicks
 * upward and decides nothing for itself.
 */
export default function ProjectRow({
  project,
  index,
  active,
  open,
  onActivate,
  onToggle,
}: Props) {
  return (
    <li className="border-t border-rule/70 first:border-t-0">
      <button
        type="button"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-baseline gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue sm:gap-6"
      >
        <span
          className={[
            "shrink-0 font-mono text-[11px] tabular-nums tracking-[0.12em] transition-colors",
            active ? "text-blue" : "text-ink-faint",
          ].join(" ")}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={[
            "font-serif text-[clamp(1.6rem,4.2vw,3rem)] font-medium leading-[1.05]",
            "tracking-[-0.02em] transition-colors duration-300",
            active ? "text-blue" : "text-ink",
          ].join(" ")}
        >
          {project.title}
        </span>

        {project.meta ? (
          <span
            className={[
              "ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity",
              active ? "text-blue opacity-100" : "text-ink-faint opacity-70",
            ].join(" ")}
          >
            {project.meta}
          </span>
        ) : null}
      </button>

      {/* Height-animated rather than mounted and unmounted, so it slides. */}
      <div
        className={[
          "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col items-start gap-3 pb-6 pl-10 pr-2 sm:pl-14">
            <p className="max-w-[46ch] text-[13.5px] leading-relaxed text-ink-soft">
              {project.summary}
            </p>
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
              >
                <span className="link-underline inline-block">Visit &#8599;</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
