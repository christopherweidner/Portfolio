import HeroPhotos from "@/components/home/HeroPhotos";
import { EMAIL } from "@/content/contact";
import { HERO } from "@/content/home";

/**
 * My name, three photos fixed in the centre, who I am, and where to find me.
 */
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-page flex-col items-center justify-center overflow-x-clip px-4 pb-16 pt-16 text-center">
      <h1 className="font-display text-giant uppercase leading-[1]">{HERO.name}</h1>

      <div className="mt-[clamp(1rem,3vw,2.5rem)]">
        <HeroPhotos />
      </div>

      <p className="mt-[clamp(3rem,7vw,5.5rem)] font-display text-display uppercase leading-[1.05] text-ink-faint">
        {HERO.subtitle}
      </p>

      <div className="reveal mt-[clamp(2.5rem,6vw,4.5rem)] flex flex-col items-center gap-1.5">
        <p className="font-display text-[15px] uppercase tracking-[0.06em] text-ink">{HERO.location}</p>
        <a
          href={`mailto:${EMAIL}`}
          className="text-[12.5px] text-ink-soft transition-colors duration-[var(--dur-fast)] hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          {EMAIL}
        </a>
      </div>
    </section>
  );
}
