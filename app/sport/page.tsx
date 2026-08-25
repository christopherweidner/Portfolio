import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sport — Christopher Weidner" };

export default function Sport() {
  return (
    <main className="flex-1 px-6 pb-32 pt-28">
      <div className="mx-auto flex max-w-[68ch] flex-col gap-6">
        <h1 className="font-serif text-5xl font-normal">Sport</h1>
        <p className="leading-relaxed">Coming soon.</p>
      </div>
    </main>
  );
}
