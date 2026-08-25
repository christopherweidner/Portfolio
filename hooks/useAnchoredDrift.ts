"use client";

import { useEffect, type RefObject } from "react";
import {
  anchoredTarget,
  approach,
  centreOf,
  type Box,
  type Point,
  type RegionFn,
  type Size,
} from "@/lib/geometry";
import { DRIFT } from "@/lib/motion";

export type AnchoredDriftOptions = {
  /** The element pointer movement is measured against. */
  stageRef: RefObject<HTMLElement | null>;
  /** The element that drifts. Its transform is written directly. */
  targetRef: RefObject<HTMLElement | null>;
  /** Where the target is allowed to go. Memoise this — see note below. */
  region: RegionFn;
  range?: number;
  lag?: number;
  /** Called on every pointer move, in stage coordinates. */
  onPointerMove?: (point: Point) => void;
  onPointerLeave?: () => void;
};

/**
 * Makes an element lean toward the pointer without leaving a bounded region,
 * easing back to its home position when the pointer leaves.
 *
 * Position is written straight to `style.transform` rather than held in state.
 * A pointer fires 60–120 events a second; re-rendering at that rate would
 * crawl. State is for things a person should see change, refs for things that
 * move every frame.
 *
 * Does nothing on touch devices or where the pointer is coarse, and snaps
 * instead of easing when the visitor has asked for reduced motion.
 *
 * `region` and the callbacks belong in the dependency array, so pass values
 * that are stable across renders (useMemo / useCallback) or the effect will
 * tear down and rebuild on every render.
 */
export function useAnchoredDrift({
  stageRef,
  targetRef,
  region,
  range = DRIFT.range,
  lag = DRIFT.lag,
  onPointerMove,
  onPointerLeave,
}: AnchoredDriftOptions): void {
  useEffect(() => {
    const stage = stageRef.current;
    const target = targetRef.current;
    if (!stage || !target) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let stageSize: Size = { width: 0, height: 0 };
    let box: Box = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    let want: Point = { x: 0, y: 0 };
    let at: Point = { x: 0, y: 0 };

    function measure() {
      const rect = stage!.getBoundingClientRect();
      stageSize = { width: rect.width, height: rect.height };
      box = region(stageSize, {
        width: target!.offsetWidth,
        height: target!.offsetHeight,
      });
    }

    function goHome() {
      want = centreOf(box);
    }

    measure();
    goHome();
    at = { ...want };

    function handleMove(event: PointerEvent) {
      const rect = stage!.getBoundingClientRect();
      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      want = anchoredTarget(pointer, stageSize, box, range);
      stage!.dataset.pointer = "in";
      onPointerMove?.(pointer);
    }

    function handleLeave() {
      stage!.dataset.pointer = "out";
      goHome();
      onPointerLeave?.();
    }

    let frame = 0;
    function tick() {
      at = approach(at, want, reduced ? 1 : lag);
      target!.style.transform =
        "translate3d(" + at.x + "px, " + at.y + "px, 0) translate(-50%, -50%)";
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    let resizeTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        measure();
        goHome();
      }, 120);
    }

    stage.addEventListener("pointermove", handleMove);
    stage.addEventListener("pointerleave", handleLeave);
    window.addEventListener("resize", handleResize);

    // The plate changes shape between moments (portrait photos vs landscape),
    // so a window resize listener alone would leave the region stale.
    const observer = new ResizeObserver(() => {
      measure();
      goHome();
    });
    observer.observe(stage);
    observer.observe(target);

    // Without this the loop and the listeners survive navigation. After five
    // visits to this page you would have five loops running.
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      observer.disconnect();
      stage.removeEventListener("pointermove", handleMove);
      stage.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [stageRef, targetRef, region, range, lag, onPointerMove, onPointerLeave]);
}
