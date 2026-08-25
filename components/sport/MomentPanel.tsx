import type { Moment } from "@/content/sport";

type Props = {
  moments: Moment[];
  index: number;
  onPrevious: () => void;
  onNext: () => void;
};

const ARROW = [
  "pointer-events-auto grid size-9 place-items-center rounded-full",
  "bg-blue text-ground transition",
  "disabled:opacity-30 enabled:hover:scale-105",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue",
].join(" ");

/**
 * The written half of a moment, plus the controls that move between them.
 *
 * Every moment is rendered into the same grid cell and all but one is hidden.
 * The block therefore always takes the height of the LONGEST entry, so the
 * controls beneath it never shift when you step through. Reserving a fixed
 * min-height would break the moment someone writes a longer paragraph; this
 * adapts to whatever is in content/sport.ts.
 */
export default function MomentPanel({ moments, index, onPrevious, onNext }: Props) {
  const total = moments.length;

  return (
    <div className="relative flex flex-col gap-6">
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute -top-28 right-0 hidden select-none lg:block",
          "whitespace-pre-line text-right font-serif text-era font-medium",
          "leading-[0.88] tracking-[-0.03em] text-[#E7E1D4]",
        ].join(" ")}
      >
        {moments[index].era}
      </span>

      <div className="grid">
        {moments.map((moment, i) => {
          const active = i === index;
          return (
            <div
              key={moment.year + moment.title}
              aria-hidden={!active}
              inert={!active}
              className={[
                "col-start-1 row-start-1 flex flex-col gap-4",
                "transition-opacity duration-300",
                active ? "opacity-100" : "pointer-events-none opacity-0",
              ].join(" ")}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-label opacity-70">
                {moment.eyebrow}
              </span>

              <h2 className="font-serif text-2xl font-medium tracking-[-0.01em] sm:text-3xl">
                {moment.title}
              </h2>

              <p className="max-w-[44ch] text-[13.5px] leading-relaxed text-ink-soft">
                {moment.body}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={index === 0}
          aria-label="Previous moment"
          className={ARROW}
        >
          &#8592;
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === total - 1}
          aria-label="Next moment"
          className={ARROW}
        >
          &#8594;
        </button>
        <span className="font-mono text-xs tabular-nums tracking-[0.06em] text-label">
          <b className="font-medium text-blue">{index + 1}</b> of {total}
        </span>
      </div>
    </div>
  );
}
