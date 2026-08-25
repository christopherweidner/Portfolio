export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative h-svh overflow-hidden bg-ground">
        <div aria-hidden className="absolute inset-0">
          <span
            className="bloom left-[-8%] top-[16%] h-[62%] w-[62%]"
            style={
              {
                "--bloom-blur": "90px",
                "--bloom-opacity": "0.8",
                "--bloom-speed": "40s",
              } as React.CSSProperties
            }
          />
          <span
            className="bloom right-[-6%] top-[8%] h-[66%] w-[58%]"
            style={
              {
                "--bloom-color": "var(--blue-light)",
                "--bloom-blur": "84px",
                "--bloom-opacity": "0.85",
                "--bloom-speed": "48s",
              } as React.CSSProperties
            }
          />
          <span
            className="bloom bottom-[-14%] left-[22%] h-[46%] w-[56%]"
            style={
              {
                "--bloom-blur": "70px",
                "--bloom-opacity": "0.7",
              } as React.CSSProperties
            }
          />
          <div className="grain" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 pb-24 text-center">
          <h1 className="reveal font-serif text-display leading-[0.95] tracking-[-0.03em]">
            Christopher
            <br />
            <i>Weidner</i>
          </h1>

          <p
            className="reveal max-w-[42ch] text-[15px] leading-relaxed text-ink-soft"
            style={{ "--d": "280ms" } as React.CSSProperties}
          >
            Swimming taught me that anything worth building is just small details repeated for years. I'm doing the same thing with software now — and pointing it at preventive health.
          </p>
        </div>

        <div className="absolute inset-x-0 top-0 flex flex-wrap justify-between gap-4 px-6 pt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-label">
          <span>Hasso-Plattner-Institut</span>
          <span>German national swim team</span>
          <span>Potsdam, Germany</span>
        </div>
      </section>
    </main>
  );
}
