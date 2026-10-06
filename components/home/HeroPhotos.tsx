import Image from "next/image";
import type { CSSProperties } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { INTRO } from "@/content/home";
import { coverScale, PHOTO_CARD_ASPECT } from "@/lib/images";

/** Resting tilt and vertical offset per photo, left to right. */
const FAN = [
  { tilt: -9, y: "1.5rem" },
  { tilt: -2, y: "0rem" },
  { tilt: 7, y: "2rem" },
];

const heroSizes = (scale: number) =>
  `(min-width: 1024px) ${+(15 * scale).toFixed(2)}rem, ${+(22 * scale).toFixed(2)}vw`;

/**
 * The hero's three photos: the intro's polaroids, come to rest as a fan in
 * the centre. The intro reads each slot's position and tilt to land on it.
 * Decorative, so hidden from assistive tech.
 */
export default function HeroPhotos() {
  return (
    <div aria-hidden className="hero-fan">
      {INTRO.photos.map((photo, i) => (
        <div
          key={photo.src.src}
          className="hero-fan-item"
          data-tilt={FAN[i % FAN.length].tilt}
          style={{ "--i": i, "--y": FAN[i % FAN.length].y } as CSSProperties}
        >
          <TiltCard tilt={FAN[i % FAN.length].tilt} className="aspect-[4/5] w-full">
            {/* Eager: the fan is on the first screen, and hidden while the intro
                plays — lazy loading would wait until the hand-over and land empty cards.
                Sizes follow the card's width (clamp(7rem, 22vw, 15rem)), times how much
                wider a landscape photo is drawn than the card. */}
            <Image
              src={photo.src}
              alt=""
              fill
              loading="eager"
              quality={90}
              sizes={heroSizes(coverScale(photo.src, PHOTO_CARD_ASPECT))}
              className="object-cover"
            />
          </TiltCard>
        </div>
      ))}
    </div>
  );
}
