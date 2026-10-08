import Reveal from "@/components/ui/Reveal";
import { ABOUT } from "@/content/about";

/** A few paragraphs about me, between the hero and the featured projects. */
export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-[var(--bar-h)] px-6 py-28 sm:px-10 sm:py-44">
      <h2 id="about-heading" className="text-center font-display text-section uppercase leading-none">
        About
      </h2>
      <Reveal className="mx-auto mt-12 flex max-w-[60ch] flex-col gap-5">
        {ABOUT.map((paragraph, i) => (
          <p key={i} className="text-[16px] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </Reveal>
    </section>
  );
}
