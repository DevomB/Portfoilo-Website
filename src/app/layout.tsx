import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Geist_Mono, Instrument_Serif } from "next/font/google";
import MotionProvider from "./components/MotionProvider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Brand voice for the wordmark only: an editorial serif italic set against the
// grotesque and the mono. Italic is the only style the mark uses, so that is
// the only face shipped.
const brand = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-brand",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Devom Brahmbhatt — Trader · Engineer · Researcher",
    template: "%s · Devom Brahmbhatt",
  },
  description:
    "Devom Brahmbhatt — Trader · Engineer · Researcher. Building resilient APIs, data-intensive systems, and applied simulations. Roosevelt Connect, Virtual Medical Missions, WebWork Innovations.",
  openGraph: {
    title: "Devom Brahmbhatt — Trader · Engineer · Researcher",
    description:
      "Backend Engineer: PostgreSQL, Node, C++, Next.js. Portfolio, projects, and live demos.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${bricolage.variable} ${mono.variable} ${brand.variable} font-sans antialiased`}
      >
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
