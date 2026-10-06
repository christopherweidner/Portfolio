"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { INTRO } from "@/content/home";
import { INTRO_SEEN_KEY } from "@/lib/intro";

type Phase = "greeting" | "photos" | "sentence" | "leaving" | "done";

/** When each phase starts, in ms from mount. Tune the whole intro here. */
const TIMELINE: [Exclude<Phase, "greeting">, number][] = [
  ["photos", 1600],
  ["sentence", 3400],
  ["leaving", 6800],
  ["done", 7400],
];

/** Stack rotation per photo, back to front. */
const ROTATIONS = ["-7deg", "5deg", "-2deg"];

function markSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Storage blocked — the intro will just play again next time.
  }
  document.documentElement.dataset.intro = "skip";
}

/**
 * The home page intro, modelled on context-con.com: greeting, a stack of
 * three polaroids, one sentence, then the page. Plays once per session;
 * click, Escape, Enter, Space or the Skip button end it at once.
 */
export default function Intro() {
  const [phase, setPhase] = useState<Phase>("greeting");

  const finish = useCallback(() => {
    markSeen();
    setPhase("done");
  }, []);

  // Phase timers. Already seen (the <head> script marked <html>) means the
  // schedule is just "done" on the next tick — CSS keeps it invisible meanwhile.
  useEffect(() => {
    const skip = document.documentElement.dataset.intro === "skip";
    const schedule: typeof TIMELINE = skip ? [["done", 0]] : TIMELINE;
    const timers = schedule.map(([next, at]) =>
      window.setTimeout(() => (next === "done" ? finish() : setPhase(next)), at),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [finish]);

  // Keyboard skip and scroll lock while visible.
  useEffect(() => {
    if (phase === "done") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        finish();
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
  }, [phase, finish]);

  if (phase === "done") return null;

  const { greeting, sentence, photos } = INTRO;

  return (
    <div className="intro" data-phase={phase} onClick={finish} role="presentation">
      <p className="intro-greeting">{greeting}</p>

      <div className="intro-stack" aria-hidden>
        {photos.map((photo, i) => (
          <figure
            key={photo.src}
            className="intro-polaroid"
            style={{ "--i": i, "--r": ROTATIONS[i % ROTATIONS.length] } as React.CSSProperties}
          >
            <div>
              <Image src={photo.src} alt={photo.alt} fill sizes="240px" priority className="object-cover" />
            </div>
          </figure>
        ))}
      </div>

      <p className="intro-sentence">
        {sentence.before}
        <span className="text-blue">{sentence.highlight}</span>
        {sentence.after}
      </p>

      <button type="button" className="intro-skip" onClick={finish}>
        Skip
      </button>
    </div>
  );
}
