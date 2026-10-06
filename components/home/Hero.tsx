import Image from "next/image";
import type { CSSProperties } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { HERO, INTRO } from "@/content/home";

/** Tilt and vertical offset per photo, left to right. */
const FAN = [
  { tilt: -9, y: "1.5rem" },
  { tilt: -2, y: "0rem" },
  { tilt: 7, y: "2rem" },
];

/**
 * Name, three fanned photos, what I do. The photos are the intro's, so the
 * stack the intro ends on reappears here spread out.
 */
export default function Hero() {
  return (
    <section className="flex min-h-page flex-col items-center justify-center overflow-x-clip px-4 py-12 text-center">
      <h1 className="font-display text-giant uppercase leading-[0.85]">{HERO.name}</h1>

      <div aria-hidden className="hero-fan -mt-[clamp(0.5rem,3vw,2.5rem)]">
        {INTRO.photos.map((photo, i) => (
          <div
            key={photo.src}
            className="hero-fan-item"
            style={{ "--i": i, "--y": FAN[i % FAN.length].y } as CSSProperties}
          >
            <TiltCard tilt={FAN[i % FAN.length].tilt} className="aspect-[4/5] w-full">
              <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 15rem, 22vw" className="object-cover" />
            </TiltCard>
          </div>
        ))}
      </div>

      <p className="mt-[clamp(1.5rem,4vw,3rem)] font-display text-display uppercase leading-[0.9] text-ink-faint">
        {HERO.subtitle}
      </p>
    </section>
  );
}
