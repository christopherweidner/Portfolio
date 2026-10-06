import type { Metadata } from "next";
import type { CSSProperties } from "react";
import MomentSection from "@/components/sport/MomentSection";
import Reveal from "@/components/ui/Reveal";
import { MOMENTS, SPORT_INTRO } from "@/content/sport";

export const metadata: Metadata = {
  title: "Sport — Christopher Weidner",
  description: SPORT_INTRO,
};

/** The swimming years, one section per station. */
export default function Sport() {
  return (
    <main className="flex-1 px-6 pb-32 pt-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">Sport</h1>
        <p className="reveal mt-4 max-w-[52ch] text-[15px] leading-relaxed" style={{ "--d": "120ms" } as CSSProperties}>
          {SPORT_INTRO}
        </p>

        <ol className="mt-24 flex flex-col gap-32 sm:gap-44">
          {MOMENTS.map((moment, i) => (
            <li key={moment.year + moment.title}>
              <Reveal>
                <MomentSection moment={moment} flip={i % 2 === 1} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
