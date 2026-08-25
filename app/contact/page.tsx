import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { EMAIL, INVITATION, SOCIALS } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact — Christopher Weidner",
  description:
    "Get in touch with Christopher Weidner — founders building in health, coaches, and anyone who trains and codes.",
};

/**
 * Deliberately a Server Component with no interactivity at all: this page ships
 * zero JavaScript of its own. The background bloom comes from the shared field
 * in the root layout, which is already arranged for this route.
 */
export default function Contact() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-svh flex-col items-center justify-center px-6 pb-36 pt-24 text-center">
        <div className="flex w-full max-w-[62ch] flex-col items-center gap-7">
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.16em] text-label opacity-70">
            Get in touch
          </span>

          <div className="flex flex-col gap-4">
            {INVITATION.map((line, i) => (
              <p
                key={i}
                className="reveal text-[15px] leading-relaxed text-ink-soft"
                style={{ "--d": `${120 + i * 110}ms` } as CSSProperties}
              >
                {line}
              </p>
            ))}
          </div>

          <a
            href={`mailto:${EMAIL}`}
            className="reveal mt-2 block max-w-full text-blue"
            style={{ "--d": "380ms" } as CSSProperties}
          >
            <span
              className="link-underline inline-block break-words font-serif text-[clamp(1.55rem,5.4vw,3.75rem)] font-medium leading-[1.1] tracking-[-0.02em]"
              style={{ "--u": "2px" } as CSSProperties}
            >
              {EMAIL}
            </span>
          </a>

          <ul
            className="reveal mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
            style={{ "--d": "480ms" } as CSSProperties}
          >
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.description}
                  className="font-mono text-[11px] uppercase tracking-[0.14em] text-label transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  <span className="link-underline inline-block">{social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
