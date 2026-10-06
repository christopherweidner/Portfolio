import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { IMPRESSUM } from "@/content/legal";

export const metadata: Metadata = {
  title: "Impressum — Christopher Weidner",
  robots: { index: false },
};

export default function Impressum() {
  return <LegalPage text={IMPRESSUM} />;
}
