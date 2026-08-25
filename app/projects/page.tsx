import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects — Christopher Weidner" };

export default function Projects() {
  return (
    <main className="flex-1 px-6 pb-32 pt-28">
      <div className="mx-auto flex max-w-[68ch] flex-col gap-6">
        <h1 className="font-serif text-5xl font-normal">Projects</h1>
        <p className="leading-relaxed">Coming soon.</p>
      </div>
    </main>
  );
}
