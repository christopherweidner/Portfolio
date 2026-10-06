import type { Metadata } from "next";
import { Anton, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav/Nav";
import SiteFooter from "@/components/footer/SiteFooter";
import FooterGate from "@/components/footer/FooterGate";
import { INTRO_GATE_SCRIPT } from "@/lib/intro";

const display = Anton({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  variable: "--font-sans-face",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Christopher Weidner",
  description:
    "Swimming taught me that anything worth building is just small details repeated for years. I'm doing the same thing with software now — and pointing it at preventive health.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE_SCRIPT }} />
        <noscript>
          <style>{".intro{display:none}"}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-ground text-ink-soft">
        <Nav />
        {children}
        <FooterGate><SiteFooter /></FooterGate>
      </body>
    </html>
  );
}
