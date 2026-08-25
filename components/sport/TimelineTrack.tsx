import type { Moment } from "@/content/sport";

type Props = {
  moments: Moment[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/** Evenly spaces n markers across the full width, first at 0%, last at 100%. */
function positionOf(index: number, total: number): number {
  return total === 1 ? 50 : (index / (total - 1)) * 100;
}

/**
 * The horizontal track: one marker per moment, with years labelled beneath.
 *
 * Below `sm` the labels would collide, so only the active year is shown and
 * it sits centred under the track instead of at its marker's position.
 */
export default function TimelineTrack({ moments, activeIndex, onSelect }: Props) {
  const total = moments.length;

  return (
    <div>
      <div className="relative mt-5 h-px bg-rule">
        {moments.map((moment, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={moment.year + moment.title}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`${moment.year} — ${moment.title}`}
              aria-current={active ? "true" : undefined}
              style={{ left: `${positionOf(index, total)}%` }}
              className={[
                "pointer-events-auto absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
                "rounded-full transition-all",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue",
                active
                  ? "size-[11px] bg-blue ring-4 ring-blue/15"
                  : "size-[9px] bg-marker hover:bg-blue-light",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* sm and up: every year, positioned under its marker */}
      <div className="relative hidden h-8 sm:block">
        {moments.map((moment, index) => (
          <span
            key={moment.year + moment.title}
            style={{ left: `${positionOf(index, total)}%` }}
            className={[
              "absolute top-4 -translate-x-1/2 whitespace-nowrap",
              "font-mono text-[10px] tracking-[0.1em]",
              index === activeIndex
                ? "font-medium text-blue"
                : "text-ink-soft opacity-55",
            ].join(" ")}
          >
            {moment.year}
          </span>
        ))}
      </div>

      {/* below sm: the active year only */}
      <div className="flex h-8 items-end justify-center sm:hidden">
        <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-blue">
          {moments[activeIndex].year}
        </span>
      </div>
    </div>
  );
}
