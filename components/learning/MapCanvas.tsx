import type { Line } from "@/content/learning";
import { VIEWBOX } from "@/content/learning";
import { toPathData } from "@/lib/network";

type Props = {
  lines: Line[];
  /** Id of the line to isolate, or null for all. */
  focus: string | null;
};

const SIDE_OFFSET = {
  left: { dx: -18, dy: -18, anchor: "end" },
  right: { dx: 18, dy: -18, anchor: "start" },
  up: { dx: 0, dy: -24, anchor: "middle" },
  down: { dx: 0, dy: 30, anchor: "middle" },
} as const;

/**
 * The drawn network: one path per line, plus the line's name at each terminus
 * the way a transit map labels its destinations. Presentational — the stop
 * markers are real buttons layered over this by LearningMap.
 */
export default function MapCanvas({ lines, focus }: Props) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      role="img"
      aria-label="A transit map of the subjects I am learning and where they overlap"
      className="absolute inset-0 h-full w-full"
    >
      {lines.map((line) => (
        <path
          key={line.id}
          className="line-path"
          data-on={focus === line.id}
          d={toPathData(line.route)}
          fill="none"
          stroke={`var(--line-${line.tone})`}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {lines.flatMap((line) =>
        line.termini.map((terminus, i) => {
          const o = SIDE_OFFSET[terminus.label];
          return (
            <text
              key={`${line.id}-${i}`}
              className="line-name"
              data-on={focus === line.id}
              x={terminus.at.x + o.dx}
              y={terminus.at.y + o.dy}
              textAnchor={o.anchor}
              fontFamily="var(--font-mono)"
              fontSize={11}
              fontWeight={600}
              letterSpacing="1.4"
              fill={`var(--line-${line.tone})`}
            >
              {line.name.toUpperCase()}
            </text>
          );
        }),
      )}
    </svg>
  );
}
