import type { Metadata } from "next";
import type { CSSProperties } from "react";
import MomentRail from "@/components/sport/MomentRail";
import MomentSection from "@/components/sport/MomentSection";
import PressClippings from "@/components/sport/PressClippings";
import SportStats from "@/components/sport/SportStats";
import Reveal from "@/components/ui/Reveal";
import { MOMENTS, PRESS, SPORT_INTRO, SPORT_STATS } from "@/content/sport";

export const metadata: Metadata = {
  title: "Sport — Christopher Weidner",
  description: SPORT_INTRO,
};

const momentId = (i: number) => `moment-${i + 1}`;

/**
 * The swimming years: the statistics first, then one section per station,
 * with a dot menu to jump between them, and the press coverage at the end.
 */
export default function Sport() {
  return (
    // The extra padding from lg up keeps the text clear of the dot menu on the
    // right; it is on both sides so the page stays centred.
    <main className="flex-1 px-6 pb-32 pt-12 sm:px-10 lg:px-36">
      <div className="mx-auto max-w-6xl">
        <h1 className="reveal text-center font-display text-display uppercase leading-[0.9]">Sport</h1>
        <p
          className="reveal mt-8 text-center text-[clamp(1.1rem,1.7vw,1.4rem)] leading-[1.6] text-ink-soft text-balance"
          style={{ "--d": "120ms" } as CSSProperties}
        >
          {SPORT_INTRO}
        </p>

        <section aria-labelledby="sport-stats" className="reveal mt-20" style={{ "--d": "240ms" } as CSSProperties}>
          <h2 id="sport-stats" className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-label">
            {SPORT_STATS.label}
          </h2>
          <SportStats />
        </section>

        <p className="mt-24 flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-label">
          {SPORT_STATS.journey}
          <svg aria-hidden viewBox="0 0 12 16" className="journey-arrow h-4 w-3 text-blue">
            <path d="M6 1v13M1 9l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </p>

        <ol className="mt-16 flex flex-col gap-32 sm:gap-44">
          {MOMENTS.map((moment, i) => (
            <li key={moment.year + moment.title} id={momentId(i)} className="scroll-mt-[calc(var(--bar-h)+3rem)]">
              <Reveal>
                <MomentSection moment={moment} flip={i % 2 === 1} />
              </Reveal>
            </li>
          ))}
        </ol>

        <section aria-labelledby="sport-press" className="mt-40 sm:mt-56">
          <Reveal>
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-label">{PRESS.label}</p>
            <h2 id="sport-press" className="mt-3 text-center font-display text-section uppercase leading-none">
              {PRESS.title}
            </h2>
          </Reveal>

          <div className="mt-16">
            <PressClippings clippings={PRESS.clippings} />
          </div>

          <Reveal>
            <div className="mx-auto mt-24 max-w-3xl">
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-label">{PRESS.linksLabel}</h3>
              <ul className="border-b border-ink/10">
                {PRESS.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="press-link">
                      <span className="press-link-year font-mono text-[11px] tracking-[0.1em] text-label">{link.year}</span>
                      <span className="text-[15px] leading-snug">
                        {link.headline}
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-label">
                          {link.outlet}
                        </span>
                      </span>
                      <span aria-hidden className="stat-record-arrow">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>
      </div>

      <MomentRail items={MOMENTS.map((moment, i) => ({ id: momentId(i), label: moment.year }))} />
    </main>
  );
}
