import Image from "next/image";
import type { CSSProperties } from "react";
import TiltCard from "@/components/ui/TiltCard";
import type { Moment } from "@/content/sport";

type Props = {
  moment: Moment;
  /** Photo on the right instead of the left (from md up). */
  flip: boolean;
};

/**
 * One station of the Sport story: a grey year or season, the photo as a
 * tilted card overlapping it, and the text beside. Purely presentational.
 */
export default function MomentSection({ moment, flip }: Props) {
  const paragraphs = moment.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={flip ? "md:order-2" : ""}>
        {/* One size for every label, sized so a season like 2020/2021 still fits one line. */}
        <p className="select-none whitespace-nowrap font-display text-[clamp(2.75rem,6.5vw,5.25rem)] uppercase leading-[0.85] text-ink-faint">
          {moment.year}
        </p>
        <TiltCard tilt={flip ? 3 : -3} className="relative z-10 -mt-[clamp(0.35rem,1vw,0.85rem)]">
          <div
            className="media w-full"
            style={{ aspectRatio: moment.aspect ?? "3/2", "--pa": moment.angle ?? "150deg" } as CSSProperties}
          >
            {moment.image ? (
              <Image src={moment.image} alt={moment.alt ?? ""} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
            ) : null}
          </div>
        </TiltCard>
      </div>

      <div className={`flex flex-col gap-4 ${flip ? "md:order-1" : ""}`}>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-label">{moment.eyebrow}</span>
        <h2 className="font-display text-[clamp(1.85rem,3.5vw,2.75rem)] uppercase leading-[0.95]">{moment.title}</h2>
        <div className="flex max-w-[58ch] flex-col gap-4 text-[16px] leading-[1.75] text-pretty">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
