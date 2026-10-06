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
 * One station of the Sport story: a giant grey year, the photo as a tilted
 * card overlapping it, and the text beside. Purely presentational.
 */
export default function MomentSection({ moment, flip }: Props) {
  return (
    <article className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={flip ? "md:order-2" : ""}>
        <p className="select-none font-display text-giant uppercase leading-[0.8] text-ink-faint">{moment.year}</p>
        <TiltCard tilt={flip ? 3 : -3} className="relative z-10 -mt-[clamp(0.5rem,1.5vw,1.25rem)]">
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

      <div className={`flex flex-col gap-4 ${flip ? "md:order-1 md:items-end md:text-right" : ""}`}>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-label">{moment.eyebrow}</span>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95]">{moment.title}</h2>
        <p className="max-w-[46ch] text-[15px] leading-relaxed">{moment.body}</p>
      </div>
    </article>
  );
}
