import type { CSSProperties } from "react";
import { VIEWBOX } from "@/content/learning";
import type { ResolvedStop } from "@/lib/network";

type Props = {
  resolved: ResolvedStop;
  selected: boolean;
  focus: string | null;
  onSelect: () => void;
};

/**
 * One station. A real button rather than an SVG circle, so it is reachable by
 * keyboard and announced properly — an <svg> shape would be neither.
 */
export default function StopMarker({ resolved, selected, focus, onSelect }: Props) {
  const { stop, lines, isInterchange } = resolved;
  const onFocusedLine = focus !== null && lines.some((l) => l.id === focus);

  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      aria-pressed={selected}
      data-interchange={isInterchange}
      data-side={stop.label}
      data-on={onFocusedLine}
      aria-label={`${isInterchange ? "Interchange" : "Stop"} on ${lines
        .map((l) => l.name)
        .join(" and ")}: ${stop.title}`}
      className="stop absolute grid size-[34px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      style={
        {
          left: `${(stop.at.x / VIEWBOX.width) * 100}%`,
          top: `${(stop.at.y / VIEWBOX.height) * 100}%`,
          "--stop-tone": `var(--line-${lines[0].tone})`,
        } as CSSProperties
      }
    >
      <span className="stop-dot" />
      <span className="stop-label">{stop.title}</span>
    </button>
  );
}
