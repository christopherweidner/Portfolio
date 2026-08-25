import type { Metadata } from "next";
import SportTimeline from "@/components/sport/SportTimeline";

export const metadata: Metadata = {
  title: "Sport — Christopher Weidner",
  description:
    "Twenty hours a week at the Olympic Training Centre in Potsdam, the German national team, and what the water taught me.",
};

/**
 * Stays a Server Component so it can export metadata. All interactivity is
 * inside SportTimeline.
 */
export default function Sport() {
  return (
    <main className="flex-1">
      <SportTimeline />
    </main>
  );
}
