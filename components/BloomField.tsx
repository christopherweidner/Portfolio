"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { bloomsFor } from "@/lib/blooms";

/**
 * The cobalt background, shared by every page.
 *
 * This is rendered once in the root layout and deliberately never unmounts —
 * that is the whole trick. Navigating only swaps the numbers on each bloom, so
 * the CSS transition carries them from one arrangement to the next instead of
 * the old set disappearing and a new set fading in.
 *
 * Two nested elements per bloom, because both need the transform:
 *   .bloom-anchor  position and shape, transitioned on route change
 *   .bloom         the endless ambient drift
 * One element cannot hold a transition and a keyframe animation on the same
 * property without them fighting.
 */
export default function BloomField() {
  const pathname = usePathname();
  const blooms = bloomsFor(pathname);

  return (
    <div aria-hidden className="bloom-field">
      {blooms.map((bloom, i) => (
        <div
          key={i}
          className="bloom-anchor"
          style={{
            transform: `translate(calc(${bloom.x}vw - 50%), calc(${bloom.y}vh - 50%)) scale(${bloom.sx}, ${bloom.sy})`,
            opacity: bloom.opacity,
          }}
        >
          <div
            className="bloom"
            style={
              {
                "--bloom-color":
                  bloom.tone === "light" ? "var(--blue-light)" : "var(--blue)",
                "--bloom-blur": `${bloom.blur}px`,
                "--bloom-speed": `${bloom.speed}s`,
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}
