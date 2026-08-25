import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const serif = Cormorant_Garamond({
  variable: "--font-serif-face",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
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
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ground text-ink-soft">
        {children}
        <Nav />
      </body>
    </html>
  );
}
