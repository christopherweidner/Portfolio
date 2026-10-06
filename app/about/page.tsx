import type { Metadata } from "next";

export const metadata: Metadata = { title: "About — Christopher Weidner" };

export default function About() {
  return (
    <main className="flex-1 px-6 pb-16 pt-12">
      <div className="mx-auto flex max-w-[68ch] flex-col gap-6">
        <h1 className="font-display text-display uppercase leading-[0.9]">About</h1>
        <p className="leading-relaxed">Coming soon.</p>
      </div>
    </main>
  );
}
