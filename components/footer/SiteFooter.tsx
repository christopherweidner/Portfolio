import { EMAIL, SOCIALS } from "@/content/contact";

const link =
  "font-display uppercase tracking-[0.04em] text-ink transition-colors hover:text-blue-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue";

/**
 * The CONTACT band at the bottom of every page. The giant word is decoration;
 * the real heading is visually hidden so the band still reads as a section.
 */
export default function SiteFooter() {
  return (
    <footer aria-labelledby="site-footer-heading" className="overflow-hidden bg-band px-6 pb-10 pt-14 text-center">
      <h2 id="site-footer-heading" className="sr-only">
        Contact
      </h2>
      <p aria-hidden className="select-none font-display text-giant uppercase leading-[0.8] text-ground">
        Contact
      </p>

      <a href={`mailto:${EMAIL}`} className={`mt-8 inline-block text-[clamp(1.1rem,2.6vw,1.5rem)] ${link}`}>
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

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        © {new Date().getFullYear()} Christopher Weidner
      </p>
    </footer>
  );
}
