import type { Metadata } from "next";
import LearningMap from "@/components/learning/LearningMap";

export const metadata: Metadata = {
  title: "Learning — Christopher Weidner",
  description:
    "Computer science, health, coaching and building — what I am studying, where it overlaps, and what I actually thought of it.",
};

export default function Learning() {
  return (
    <main className="flex-1">
      <LearningMap />
    </main>
  );
}
