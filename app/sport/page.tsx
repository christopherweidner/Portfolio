import type { Metadata } from "next";
import type { CSSProperties } from "react";
import MomentRail from "@/components/sport/MomentRail";
import MomentSection from "@/components/sport/MomentSection";
import Reveal from "@/components/ui/Reveal";
import { MOMENTS, SPORT_INTRO } from "@/content/sport";

export const metadata: Metadata = {
  title: "Sport — Christopher Weidner",
  description: SPORT_INTRO,
};

const momentId = (i: number) => `moment-${i + 1}`;

/** The swimming years, one section per station, with a dot menu to jump between them. */
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

        <ol className="mt-24 flex flex-col gap-32 sm:gap-44">
          {MOMENTS.map((moment, i) => (
            <li key={moment.year + moment.title} id={momentId(i)} className="scroll-mt-[calc(var(--bar-h)+3rem)]">
              <Reveal>
                <MomentSection moment={moment} flip={i % 2 === 1} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <MomentRail items={MOMENTS.map((moment, i) => ({ id: momentId(i), label: moment.year }))} />
    </main>
  );
}
