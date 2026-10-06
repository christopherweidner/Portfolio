import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { DATENSCHUTZ } from "@/content/legal";

export const metadata: Metadata = {
  title: "Datenschutz — Christopher Weidner",
  robots: { index: false },
};

export default function Datenschutz() {
  return <LegalPage text={DATENSCHUTZ} />;
}
