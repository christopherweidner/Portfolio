import Link from "next/link";
import { EMAIL, SOCIALS } from "@/content/contact";
import { LEGAL_LINKS } from "@/content/navigation";

const link =
  "font-display uppercase tracking-[0.04em] text-ink transition-colors duration-[var(--dur-fast)] hover:text-blue-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * The CONTACT band at the bottom of every page. The giant word is decoration;
 * the real heading is visually hidden so the band still reads as a section.
 */
export default function SiteFooter() {
  return (
    <footer aria-labelledby="site-footer-heading" className="overflow-hidden bg-band px-6 pb-12 pt-24 text-center">
      <h2 id="site-footer-heading" className="sr-only">
        Contact
      </h2>
      <p aria-hidden className="select-none font-display text-giant uppercase leading-[0.8] text-ground">
        Contact
      </p>

      <a href={`mailto:${EMAIL}`} className={`mt-10 inline-block text-[clamp(1.1rem,2.6vw,1.5rem)] ${link}`}>
        {EMAIL}
      </a>

      <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {SOCIALS.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.description}
              className={`text-[15px] ${link}`}
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center justify-center gap-x-5 gap-y-2 font-mono sm:flex-row text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        <p>© {new Date().getFullYear()} Christopher Weidner</p>
        <div className="flex gap-5">
          {LEGAL_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-blue-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
