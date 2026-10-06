"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { INTRO } from "@/content/home";
import { coverScale, PHOTO_CARD_ASPECT } from "@/lib/images";
import { INTRO_SEEN_KEY } from "@/lib/intro";

type Phase = "greeting" | "photos" | "sentence" | "leaving" | "done";

/** How long the greeting and its loading bar stay on screen, in ms. */
const GREETING_MS = 1800;

/** When each phase starts, in ms from mount. Tune the whole intro here. */
const TIMELINE: [Exclude<Phase, "greeting">, number][] = [
  ["photos", GREETING_MS],
  ["sentence", 3600],
  ["leaving", 7000],
  ["done", 8100],
];

/** Where each photo lies in the pile, back to front: offset (in % of the
 *  photo) and rotation. They overlap, but never sit exactly on each other. */
const PILE = [
  { x: "-42%", y: "-7%", r: "-8deg" },
  { x: "40%", y: "4%", r: "6deg" },
  { x: "-2%", y: "9%", r: "-2deg" },
];

/** How the intro ended: played through (the photos landed in the hero) or skipped. */
type Ending = "landed" | "skip";

function markSeen(ending: Ending) {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Storage blocked — the intro will just play again next time.
  }
  document.documentElement.dataset.intro = ending;
}

/**
 * Sends each polaroid to its photo's resting place in the hero fan. The
 * pile's untransformed box is centred in the overlay, so the target is the
 * distance from the overlay's centre to the slot's centre, scaled to the
 * slot's width and turned to its tilt.
 */
function aimAtHero(overlay: HTMLElement, stack: HTMLElement) {
  const slots = document.querySelectorAll<HTMLElement>(".hero-fan-item");
  const polaroids = stack.querySelectorAll<HTMLElement>(".intro-polaroid");
  const cx = overlay.clientWidth / 2;
  const cy = overlay.clientHeight / 2;
  polaroids.forEach((polaroid, i) => {
    const slot = slots[i];
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    polaroid.style.setProperty("--tx", `${rect.left + rect.width / 2 - cx}px`);
    polaroid.style.setProperty("--ty", `${rect.top + rect.height / 2 - cy}px`);
    polaroid.style.setProperty("--ts", String(rect.width / stack.offsetWidth));
    polaroid.style.setProperty("--tr", `${slot.dataset.tilt ?? 0}deg`);
  });
}

/**
 * The home page intro, modelled on context-con.com: greeting with a loading
 * bar, a loose pile of three polaroids, one sentence, then the polaroids fly
 * into the hero and become its photos. Plays once per session; click,
 * Escape, Enter, Space or the Skip button end it at once.
 */
export default function Intro() {
  const [phase, setPhase] = useState<Phase>("greeting");

  const overlay = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const finish = useCallback(
    (ending: Ending) => {
      clearTimers();
      markSeen(ending);
      setPhase("done");
    },
    [clearTimers],
  );

  const skip = useCallback(() => finish("skip"), [finish]);

  // Phase timers. Already seen (the <head> script marked <html>) means the
  // schedule is just "done" on the next tick — CSS keeps it invisible meanwhile.
  useEffect(() => {
    const seen = document.documentElement.dataset.intro === "skip";
    const schedule: typeof TIMELINE = seen ? [["done", 0]] : TIMELINE;
    timers.current = schedule.map(([next, at]) =>
      window.setTimeout(() => {
        if (next === "done") return finish(seen ? "skip" : "landed");
        if (next === "leaving" && overlay.current && stack.current) aimAtHero(overlay.current, stack.current);
        setPhase(next);
      }, at),
    );
    return clearTimers;
  }, [finish, clearTimers]);

  // Keyboard skip and scroll lock while visible.
  useEffect(() => {
    if (phase === "done" || document.documentElement.dataset.intro === "skip") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        skip();
      }
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
    };
  }, [phase, skip]);

  if (phase === "done") return null;

  const { greeting, sentence, photos } = INTRO;

  return (
    <div ref={overlay} className="intro" data-phase={phase} onClick={skip} role="presentation">
      <div className="intro-greeting" style={{ "--greet": `${GREETING_MS}ms` } as CSSProperties}>
        <p>{greeting}</p>
        <span className="intro-bar" aria-hidden />
      </div>

      <div ref={stack} className="intro-stack" aria-hidden>
        {photos.map((photo, i) => {
          const pile = PILE[i % PILE.length];
          return (
            <figure
              key={photo.src.src}
              className="intro-polaroid"
              style={{ "--i": i, "--px": pile.x, "--py": pile.y, "--r": pile.r } as CSSProperties}
            >
              <div>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  // The pile is at most 240px wide; a wider photo is drawn wider than that.
                  sizes={`${Math.ceil(240 * coverScale(photo.src, PHOTO_CARD_ASPECT))}px`}
                 
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover"
                />
              </div>
            </figure>
          );
        })}
      </div>

      <p className="intro-sentence">
        {sentence.before}
        <span className="text-blue">{sentence.highlight}</span>
        {sentence.after}
      </p>

      <button type="button" className="intro-skip" onClick={skip}>
        Skip
      </button>
    </div>
  );
}
