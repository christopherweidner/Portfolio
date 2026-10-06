import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = { title: "About — Christopher Weidner" };

export default function About() {
  return (
    <main className="flex-1 px-6 pb-24 pt-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">About</h1>
        <p className="reveal mt-4 max-w-[52ch] text-[15px] leading-relaxed" style={{ "--d": "120ms" } as CSSProperties}>
          Coming soon.
        </p>
      </div>
    </main>
  );
}
