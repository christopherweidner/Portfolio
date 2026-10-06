import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { INVITATION } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact — Christopher Weidner",
  description:
    "Get in touch with Christopher Weidner — founders building in health, coaches, and anyone who trains and codes.",
};

/**
 * The invitation. Email and profiles sit in the site footer directly below,
 * so this page does not repeat them. No JavaScript of its own.
 */
export default function Contact() {
  return (
    <main className="flex-1 px-6 pb-24 pt-12 text-center sm:px-10">
      <div className="mx-auto flex max-w-[62ch] flex-col items-center gap-7">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">Get in touch</h1>
        {INVITATION.map((line, i) => (
          <p
            key={i}
            className="reveal text-[16px] leading-relaxed text-ink-soft"
            style={{ "--d": `${120 + i * 110}ms` } as CSSProperties}
          >
            {line}
          </p>
        ))}
        <p className="reveal font-mono text-[11px] uppercase tracking-[0.14em] text-label" style={{ "--d": "380ms" } as CSSProperties}>
          Email and profiles below ↓
        </p>
      </div>
    </main>
  );
}
