"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { MOMENTS } from "@/content/sport";
import { anchorAt, type Point } from "@/lib/geometry";
import { useAnchoredDrift } from "@/hooks/useAnchoredDrift";
import { DRIFT } from "@/lib/motion";
import MomentPanel from "./MomentPanel";
import RoamingPlate from "./RoamingPlate";
import TimelineTrack from "./TimelineTrack";

/**
 * Composition root for the Sport page.
 *
 * Owns which moment is showing and wires the drift interaction. Everything it
 * renders is presentational, which keeps "use client" contained to this file.
 *
 * Height: locked to the viewport from `md` up, where the drift lives and the
 * page must not scroll. Below that it grows and the page scrolls normally —
 * a fixed viewport on a phone means unreadable type.
 */
export default function SportTimeline() {
  const [index, setIndex] = useState(0);

  const stageRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // Memoised because they land in the hook's dependency array. Rebuilt every
  // render, they would tear down and restart the animation loop each time.
  // Home is a fraction of the stage: a quarter across, just above the middle.
  // Move the photo left/right with x, up/down with y. Nothing else to tune.
  const region = useMemo(
    () =>
      anchorAt({ x: 0.26, y: 0.48 }, DRIFT.range, {
        top: 150,
        right: 24,
        bottom: 110,
        left: 32,
      }),
    [],
  );

  const moveDot = useCallback((point: Point) => {
    const dot = dotRef.current;
    if (!dot) return;
    dot.style.transform =
      "translate3d(" + point.x + "px, " + point.y + "px, 0) translate(-50%, -50%)";
  }, []);

  useAnchoredDrift({
    stageRef,
    targetRef: plateRef,
    region,
    onPointerMove: moveDot,
  });

  const moment = MOMENTS[index];

  const goPrevious = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(
    () => setIndex((i) => Math.min(MOMENTS.length - 1, i + 1)),
    [],
  );

  return (
    <section
      ref={stageRef}
      data-pointer="out"
      className={[
        "cursor-hidden relative",
        "min-h-svh overflow-x-clip",
        "md:h-svh md:overflow-hidden",
      ].join(" ")}
    >
      {/* Drifts with the pointer. Only rendered where a fine pointer exists. */}
      <RoamingPlate
        moment={moment}
        plateRef={plateRef}
        sizes="(min-width: 1280px) 460px, 380px"
        priority={index === 0}
        className="pointer-events-none absolute left-0 top-0 hidden h-[240px] md:block lg:h-[290px] xl:h-[320px]"
      />

      <span aria-hidden ref={dotRef} className="cursor-dot z-20" />

      <div className="pointer-events-none relative z-10 flex min-h-svh flex-col md:h-full">
        <div className="px-6 pt-8 sm:px-12 sm:pt-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-label opacity-70">
            Swimming
          </span>
          <TimelineTrack
            moments={MOMENTS}
            activeIndex={index}
            onSelect={setIndex}
          />
        </div>

        <div className="grid flex-1 items-start gap-8 px-6 pb-28 pt-8 sm:px-12 md:grid-cols-2 md:pt-14">
          <div className="hidden md:block" />

          <div className="flex flex-col gap-7">
            {/* On phones the photo sits in the flow above the text. */}
            <RoamingPlate
              moment={moment}
              sizes="(min-width: 640px) 330px, 260px"
              className="h-[180px] shrink-0 sm:h-[220px] md:hidden"
            />
            <MomentPanel
              moments={MOMENTS}
              index={index}
              onPrevious={goPrevious}
              onNext={goNext}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
