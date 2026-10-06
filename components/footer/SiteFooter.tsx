import Link from "next/link";
import { EMAIL, SOCIALS } from "@/content/contact";
import { LEGAL_LINKS } from "@/content/navigation";

const link =
  "font-display uppercase tracking-[0.04em] text-ground decoration-2 underline-offset-[6px] transition-colors duration-[var(--dur-fast)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ground";

/**
 * The cobalt CONTACT band at the bottom of every page. The giant word is
 * decoration; the real heading is visually hidden so the band still reads as
 * a section. Everything on it is white — dark text does not read on cobalt.
 */
export default function SiteFooter() {
  return (
    <footer aria-labelledby="site-footer-heading" className="overflow-hidden bg-blue px-6 pb-10 pt-14 text-center">
      <h2 id="site-footer-heading" className="sr-only">
        Contact
      </h2>
      <p aria-hidden className="select-none font-display text-section uppercase leading-none tracking-[0.02em] text-ground">
        Contact
      </p>

      <a href={`mailto:${EMAIL}`} className={`mt-5 inline-block text-[clamp(1rem,1.8vw,1.15rem)] ${link}`}>
        {EMAIL}
      </a>

      <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {SOCIALS.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.description}
              className={`text-[13px] ${link}`}
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center justify-center gap-x-5 gap-y-2 font-mono sm:flex-row text-[10px] uppercase tracking-[0.16em] text-ground/80">
        <p>© {new Date().getFullYear()} Christopher Weidner</p>
        <div className="flex gap-5">
          {LEGAL_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-ground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ground"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
