"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { INTRO } from "@/content/home";

/** Resting tilt and vertical offset per photo, left to right. */
const FAN = [
  { tilt: -9, y: "1.5rem" },
  { tilt: -2, y: "0rem" },
  { tilt: 7, y: "2rem" },
];
/** Cursor travel in px before the next photo jumps to it. */
const TRAIL_STEP = 90;
/** The most a photo tilts from cursor speed, in degrees. */
const MAX_TILT = 18;
/** Degrees of tilt per px/ms of horizontal cursor speed. */
const TILT_PER_SPEED = 14;

/**
 * The hero's three photos. At rest they are a fan; while a mouse moves over
 * the hero they take turns jumping to the cursor, leaning with its speed,
 * and spring back into the fan when it leaves. Touch and reduced motion keep
 * the fan still. Decorative, so hidden from assistive tech.
 */
export default function HeroPhotos() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fan = root.current;
    const section = fan?.closest("section");
    if (!fan || !section) return;
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const slots = Array.from(fan.querySelectorAll<HTMLElement>(".hero-fan-item"));
    let next = 0;
    let layer = 1;
    let last: { x: number; t: number } | null = null;
    let placed: { x: number; y: number } | null = null;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const speed = last ? (event.clientX - last.x) / Math.max(event.timeStamp - last.t, 1) : 0;
      last = { x: event.clientX, t: event.timeStamp };
      if (placed && Math.hypot(event.clientX - placed.x, event.clientY - placed.y) < TRAIL_STEP) return;
      placed = { x: event.clientX, y: event.clientY };

      const slot = slots[next % slots.length];
      next += 1;
      const photo = slot.querySelector<HTMLElement>(".hero-trail");
      if (!photo) return;
      const rest = slot.getBoundingClientRect();
      const dx = event.clientX - (rest.left + rest.width / 2);
      const dy = event.clientY - (rest.top + rest.height / 2);
      const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, speed * TILT_PER_SPEED));
      photo.style.translate = `${dx}px ${dy}px`;
      photo.style.rotate = `${tilt}deg`;
      layer += 1;
      slot.style.zIndex = String(layer);
    };

    const onLeave = () => {
      last = null;
      placed = null;
      for (const slot of slots) {
        const photo = slot.querySelector<HTMLElement>(".hero-trail");
        if (photo) {
          photo.style.translate = "";
          photo.style.rotate = "";
        }
        slot.style.zIndex = "";
      }
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="hero-fan">
      {INTRO.photos.map((photo, i) => (
        <div
          key={photo.src}
          className="hero-fan-item"
          style={{ "--i": i, "--y": FAN[i % FAN.length].y } as CSSProperties}
        >
          <div className="hero-trail">
            <TiltCard tilt={FAN[i % FAN.length].tilt} className="aspect-[4/5] w-full">
              <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 15rem, 22vw" className="object-cover" />
            </TiltCard>
          </div>
        </div>
      ))}
    </div>
  );
}
