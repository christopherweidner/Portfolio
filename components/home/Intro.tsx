"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { INTRO } from "@/content/home";
import { coverScale, PHOTO_CARD_ASPECT } from "@/lib/images";
import { INTRO_SEEN_KEY } from "@/lib/intro";

type Phase = "greeting" | "photos" | "sentence" | "leaving" | "done";

/** How long the greeting and its loading bar stay on screen, in ms. */
const GREETING_MS = 1800;

/** How long the hand-over takes: the photos flying into the hero and the
 *  page fading in behind them, in ms. */
const LEAVE_MS = 1500;

/** Delay between the photos setting off, in ms. */
const LEAVE_STAGGER_MS = 80;

const LEAVING_AT = 7000;

/** When each phase starts, in ms from mount. Tune the whole intro here. */
const TIMELINE: [Exclude<Phase, "greeting">, number][] = [
  ["photos", GREETING_MS],
  ["sentence", 3600],
  ["leaving", LEAVING_AT],
  // The last photo sets off two staggers late; land with room to spare.
  ["done", LEAVING_AT + LEAVE_MS + 2 * LEAVE_STAGGER_MS + 150],
];

/** Where each photo lies in the pile: offset (in % of the photo), rotation
 *  and when it arrives. Left, middle, right — the same order and lean as the
 *  hero fan they fly into, so no photo crosses another on the way. The middle
 *  one arrives last, so each photo lands on the one before and the middle
 *  ends on top, as in the fan. */
const PILE = [
  { x: "-42%", y: "5%", r: "-8deg", arrives: 0 },
  { x: "-1%", y: "-3%", r: "-2deg", arrives: 2 },
  { x: "41%", y: "8%", r: "6deg", arrives: 1 },
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
 * Sends each polaroid to its photo's resting place in the hero fan. The pile
 * stays where the sentence shrank it to, so only the polaroids move and each
 * travels in one straight, even line. Targets are therefore in the pile's
 * own, scaled coordinates: the distance from its centre to the slot's
 * centre, divided by the pile's scale. --k is the polaroid's final size on
 * screen relative to its unscaled size, for the radius and shadow to match
 * the hero card exactly on arrival.
 */
function aimAtHero(stack: HTMLElement) {
  const slots = document.querySelectorAll<HTMLElement>(".hero-fan-item");
  const polaroids = stack.querySelectorAll<HTMLElement>(".intro-polaroid");
  const box = stack.getBoundingClientRect();
  const scale = box.width / stack.offsetWidth;
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  polaroids.forEach((polaroid, i) => {
    const slot = slots[i];
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    const k = rect.width / stack.offsetWidth;
    polaroid.style.setProperty("--tx", `${(rect.left + rect.width / 2 - cx) / scale}px`);
    polaroid.style.setProperty("--ty", `${(rect.top + rect.height / 2 - cy) / scale}px`);
    polaroid.style.setProperty("--ts", String(k / scale));
    polaroid.style.setProperty("--k", String(k));
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

  const stack = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const ending = useRef<Ending>("skip");

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const finish = useCallback(
    (how: Ending) => {
      clearTimers();
      ending.current = how;
      setPhase("done");
    },
    [clearTimers],
  );

  // Reveal the hero fan in the same commit that removes the overlay, before
  // the browser paints: the polaroids and the cards never show at once.
  useLayoutEffect(() => {
    if (phase === "done") markSeen(ending.current);
  }, [phase]);

  const skip = useCallback(() => finish("skip"), [finish]);

  // Phase timers. Already seen (the <head> script marked <html>) means the
  // schedule is just "done" on the next tick — CSS keeps it invisible meanwhile.
  useEffect(() => {
    const seen = document.documentElement.dataset.intro === "skip";
    const schedule: typeof TIMELINE = seen ? [["done", 0]] : TIMELINE;
    timers.current = schedule.map(([next, at]) =>
      window.setTimeout(() => {
        if (next === "done") return finish(seen ? "skip" : "landed");
        if (next === "leaving" && stack.current) aimAtHero(stack.current);
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
    <div
      className="intro"
      data-phase={phase}
      onClick={skip}
      role="presentation"
      style={{ "--leave": `${LEAVE_MS}ms`, "--leave-stagger": `${LEAVE_STAGGER_MS}ms` } as CSSProperties}
    >
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
              style={{ "--i": pile.arrives, "--px": pile.x, "--py": pile.y, "--r": pile.r } as CSSProperties}
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
