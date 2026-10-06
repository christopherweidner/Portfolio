import type { LegalDocument } from "@/content/legal";

/**
 * A plain, readable page for the legal texts. Shared by Impressum and
 * Datenschutz; the text itself lives in content/legal.ts.
 */
export default function LegalPage({ text }: { text: LegalDocument }) {
  return (
    <main lang="de" className="flex-1 px-6 pb-32 pt-12 sm:px-10">
      <div className="mx-auto max-w-[68ch]">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">{text.title}</h1>
        {text.lead ? <p className="mt-8 text-[17px] leading-[1.7]">{text.lead}</p> : null}

        <div className="mt-12 flex flex-col gap-10">
          {text.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-label!">{section.heading}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line text-[15px] leading-[1.75]">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
