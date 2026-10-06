import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { EMAIL, INVITATION, SOCIALS } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact — Christopher Weidner",
  description:
    "Get in touch with Christopher Weidner — founders building in health, coaches, and anyone who trains and codes.",
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * The invitation, the address and the profiles, centred. No JavaScript of its
 * own; the site footer band is left out on this page (see FooterGate).
 */
export default function Contact() {
  return (
    <main className="flex-1">
      <section className="flex min-h-page flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex w-full max-w-[62ch] flex-col items-center gap-8">
          <h1 className="reveal font-mono text-[11px] uppercase tracking-[0.16em] text-label!">Get in touch</h1>

          <div className="flex flex-col gap-4">
            {INVITATION.map((line, i) => (
              <p
                key={i}
                className="reveal text-[16px] leading-relaxed text-ink-soft"
                style={{ "--d": `${120 + i * 110}ms` } as CSSProperties}
              >
                {line}
              </p>
            ))}
          </div>

          <a
            href={`mailto:${EMAIL}`}
            className={`reveal mt-2 block max-w-full break-words font-display text-[clamp(1.75rem,6vw,4.5rem)] uppercase leading-[1] text-blue decoration-[3px] underline-offset-[10px] hover:underline ${focusRing}`}
            style={{ "--d": "380ms" } as CSSProperties}
          >
            {EMAIL}
          </a>

          <ul
            className="reveal mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            style={{ "--d": "480ms" } as CSSProperties}
          >
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.description}
                  className={`font-mono text-[12px] uppercase tracking-[0.14em] text-label underline-offset-4 transition-colors hover:text-blue hover:underline ${focusRing}`}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
