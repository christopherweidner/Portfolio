import type { CSSProperties } from "react";
import type { Line } from "@/content/learning";

type Props = {
  lines: Line[];
  pinned: string | null;
  onHover: (id: string | null) => void;
  onPin: (id: string) => void;
};

/**
 * The key. Also the primary way to explore on a touch screen, where there is
 * no hover — tapping a line isolates it.
 */
export default function LineLegend({ lines, pinned, onHover, onPin }: Props) {
  return (
    <ul className="mt-4 flex flex-col">
      {lines.map((line) => (
        <li key={line.id}>
          <button
            type="button"
            onMouseEnter={() => onHover(line.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(line.id)}
            onBlur={() => onHover(null)}
            onClick={() => onPin(line.id)}
            aria-pressed={pinned === line.id}
            className={[
              "flex w-full items-center gap-3 rounded-[3px] px-2.5 py-2 text-left transition-colors",
              "hover:bg-blue/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue",
              pinned === line.id ? "bg-blue/10" : "",
            ].join(" ")}
          >
            <span
              className="h-[5px] w-[22px] shrink-0 rounded-full"
              style={{ background: `var(--line-${line.tone})` } as CSSProperties}
            />
            <span className="text-[13px] font-medium text-ink">{line.name}</span>
            <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-faint">
              {line.note}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
