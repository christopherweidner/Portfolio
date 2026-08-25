"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LINES, VIEWBOX } from "@/content/learning";
import { findOffAxisSegments, resolveStops } from "@/lib/network";
import LineLegend from "./LineLegend";
import MapCanvas from "./MapCanvas";
import StopDetail from "./StopDetail";
import StopMarker from "./StopMarker";

/**
 * Composition root for the Learning page.
 *
 * Everything on screen is derived from content/learning.ts. Adding a stop or a
 * whole line is a data edit — the paths, the markers, the legend and the
 * interchanges all fall out of it.
 *
 * Three pieces of state, kept apart on purpose:
 *   selected — which stop the panel is showing. Follows hover and focus.
 *   hovered  — a line being previewed from the legend. Clears on leave.
 *   pinned   — a line held isolated by a click. Survives the mouse leaving,
 *              which is the only way this works on a touch screen.
 */
export default function LearningMap() {
  const stops = useMemo(() => resolveStops(LINES), []);
  const [selectedKey, setSelectedKey] = useState(stops[2]?.key ?? stops[0].key);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const focus = hovered ?? pinned;
  const selected =
    stops.find((s) => s.key === selectedKey) ?? stops[0];

  const pin = useCallback((id: string) => {
    setPinned((current) => (current === id ? null : id));
  }, []);

  // A drawing aid, not a runtime check: tells you in development if a route
  // segment is not horizontal, vertical or 45 degrees, which is the one rule
  // that keeps this looking like a transit map.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const bad = findOffAxisSegments(LINES);
    if (bad.length > 0) {
      console.warn(
        "[learning map] these segments are not octolinear:",
        bad.map((s) => `${s.line}: ${s.from.x},${s.from.y} → ${s.to.x},${s.to.y}`),
      );
    }
  }, []);

  return (
    <section className="relative min-h-svh px-6 pb-36 pt-14 sm:px-12 sm:pt-16">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-label opacity-70">
          Learning
        </span>
        <h1 className="font-serif text-[clamp(2rem,5vw,3.6rem)] font-normal leading-none tracking-[-0.02em]">
          The network
        </h1>
        <p className="max-w-[48ch] text-[13.5px] leading-relaxed text-ink-soft">
          Lines are what I am studying. Stops are individual pieces. The double
          rings are interchanges — the points where two of them actually meet.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <div
            className="map relative w-full"
            data-focus={focus ?? undefined}
            style={{ aspectRatio: `${VIEWBOX.width} / ${VIEWBOX.height}` }}
          >
            <MapCanvas lines={LINES} focus={focus} />
            {stops.map((resolved) => (
              <StopMarker
                key={resolved.key}
                resolved={resolved}
                selected={resolved.key === selectedKey}
                focus={focus}
                onSelect={() => setSelectedKey(resolved.key)}
              />
            ))}
          </div>

          <LineLegend
            lines={LINES}
            pinned={pinned}
            onHover={setHovered}
            onPin={pin}
          />
        </div>

        <StopDetail resolved={selected} />
      </div>
    </section>
  );
}
