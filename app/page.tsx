import Intro from "@/components/home/Intro";

export default function Home() {
  return (
    <main className="flex-1">
      <Intro />
      <section className="relative h-page overflow-hidden">
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
          <h1 className="reveal font-display text-giant uppercase leading-[0.85]">
            Christopher Weidner
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
