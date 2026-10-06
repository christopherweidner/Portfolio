import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ABOUT } from "@/content/about";

export const metadata: Metadata = { title: "About — Christopher Weidner" };

export default function About() {
  return (
    <main className="flex-1 px-6 pb-24 pt-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="reveal text-center font-display text-display uppercase leading-[0.9]">About</h1>
        <div className="mx-auto mt-6 flex max-w-[60ch] flex-col gap-5">
          {ABOUT.map((paragraph, i) => (
            <p
              key={i}
              className="reveal text-[16px] leading-relaxed"
              style={{ "--d": `${120 + i * 90}ms` } as CSSProperties}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
