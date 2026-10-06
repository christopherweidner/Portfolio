"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Pages that show their own contact details and must not repeat the footer band. */
const WITHOUT_FOOTER = ["/contact"];

/** Renders the site footer everywhere except on the pages listed above. */
export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return WITHOUT_FOOTER.includes(pathname) ? null : children;
}
