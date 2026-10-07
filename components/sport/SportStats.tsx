"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { SPORT_STATS } from "@/content/sport";
import { countAt, countProgress, ordinal } from "@/lib/count";
import { GRID_TILTS } from "@/lib/motion";

/** How long each count takes, in ms. */
const COUNT_MS = 1800;

/** When each card starts counting, in ms from load — just after the page has risen in. */
const DELAYS = [350, 500, 650, 800];

/** The podium, left to right as it stands: place and step height. */
const PODIUM = [
  { place: 2, h: "74%" },
  { place: 1, h: "100%" },
  { place: 3, h: "58%" },
  { place: 4, h: "44%" },
];

type Format = "number" | "ordinal";

const show = (format: Format, n: number) => (format === "ordinal" ? ordinal(Math.max(1, n)) : String(n));

/**
 * The numbers at the top of the Sport page: national medals, national
 * records, the place at the Junior Europeans and the years trained. Each
 * counts up once as the page loads, and its picture fills in with it — medals
 * pop in one by one, records are entered on the board, the podium rises place
 * by place, the calendar fills year by year.
 *
 * The server renders the final values, so they are right without JavaScript
 * and with reduced motion. Every frame writes the count and its progress
 * (--p, 0 to 1) straight to the DOM; the CSS turns --p into the picture.
 */
export default function SportStats() {
  const list = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (!list.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stats = [...list.current.querySelectorAll<HTMLElement>("[data-to]")];
    const end = Math.max(...DELAYS) + COUNT_MS;

    const draw = (elapsed: number) => {
      stats.forEach((stat, i) => {
        const p = countProgress(elapsed, DELAYS[i] ?? 0, COUNT_MS);
        stat.style.setProperty("--p", String(p));
        const out = stat.querySelector<HTMLElement>("[data-count]");
        const text = show(stat.dataset.format as Format, countAt(Number(stat.dataset.to), p));
        if (out && out.textContent !== text) out.textContent = text;
      });
    };

    // Back to zero before the first paint, then count.
    draw(0);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      draw(now - start);
      if (now - start < end) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const { medals, records, europeans, years } = SPORT_STATS;
  const calendar = Array.from({ length: years.value }, (_, i) => years.since + i);

  return (
    <ul ref={list} className="grid gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
      <Stat i={0} to={medals.value} format="number" suffix={medals.suffix} label={medals.label} n={medals.value}>
        <div className="stat-medals">
          {Array.from({ length: medals.value }, (_, i) => (
            <svg key={i} className="stat-medal" viewBox="0 0 24 38" style={{ "--i": i } as CSSProperties}>
              <path className="stat-medal-ribbon" d="M5 0h6l4 15h-6zM19 0h-6l-4 15h6z" />
              <circle className="stat-medal-disc" cx="12" cy="26" r="11" />
              <circle className="stat-medal-ring" cx="12" cy="26" r="7" />
            </svg>
          ))}
        </div>
      </Stat>

      <Stat i={1} to={records.list.length} format="number" label={records.label} n={records.list.length}>
        <ol className="stat-records">
          {records.list.map((record, i) => (
            <li key={i} className="stat-record" style={{ "--i": i } as CSSProperties}>
              <span className="stat-record-tag">NR</span>
              {record}
            </li>
          ))}
        </ol>
      </Stat>

      <Stat i={2} to={europeans.place} format="ordinal" label={europeans.label} n={PODIUM.length}>
        <div className="stat-podium">
          {PODIUM.map(({ place, h }) => (
            <span
              key={place}
              className="stat-step"
              data-mine={place === europeans.place ? "" : undefined}
              style={{ "--i": place - 1, "--h": h } as CSSProperties}
            >
              {place}
            </span>
          ))}
        </div>
      </Stat>

      <Stat i={3} to={years.value} format="number" suffix={years.suffix} label={years.label} n={years.value}>
        <div className="stat-calendar">
          <p className="stat-calendar-head">Since {years.since}</p>
          <div className="stat-calendar-grid">
            {calendar.map((year, i) => (
              <span key={year} className="stat-year" style={{ "--i": i } as CSSProperties}>
                <span>{year}</span>
              </span>
            ))}
          </div>
        </div>
      </Stat>
    </ul>
  );
}

type StatProps = {
  i: number;
  to: number;
  format: Format;
  suffix?: string;
  label: string;
  /** How many marks the picture has; each lights up at its share of the count. */
  n: number;
  children: ReactNode;
};

/** One card: the picture, the number and what it counts. */
function Stat({ i, to, format, suffix, label, n, children }: StatProps) {
  return (
    <li className="stat" data-to={to} data-format={format} style={{ "--n": n } as CSSProperties}>
      <TiltCard tilt={GRID_TILTS[i % GRID_TILTS.length]} className="flex h-full flex-col gap-6 p-7">
        <div aria-hidden className="flex h-28 items-end">
          {children}
        </div>
        <div>
          <p className="font-display text-[clamp(3.25rem,6vw,4.75rem)] uppercase leading-[0.85] text-ink tabular-nums">
            <span data-count>{show(format, to)}</span>
            {suffix ? <span className="text-blue">{suffix}</span> : null}
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-label">{label}</p>
        </div>
      </TiltCard>
    </li>
  );
}
