export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative h-svh overflow-hidden">
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
            Swimming taught me that anything worth building is just small details repeated for years. I’m doing the same thing with software now — and pointing it at preventive health.
          </p>
        </div>
      </section>
    </main>
  );
}
