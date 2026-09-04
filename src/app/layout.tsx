import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Anybody,
  Bricolage_Grotesque,
  Geist_Mono,
  IBM_Plex_Sans,
  Space_Grotesk,
} from "next/font/google";
import MotionProvider from "./components/MotionProvider";

/* The type system, one family per role. Decided in the font lab, 2026-09-03.
   Roles are exposed to Tailwind as font-sans / font-display / font-title /
   font-mono / font-wordmark — see tailwind.config.js. */

/* body copy, row names, taglines — the default */
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

/* the hero, the splash, and small UI chrome (nav links, buttons, pills) */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/* page titles on project, demo, and legal pages */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

/* everything machine-facing: // labels, dates, numerals, code, terminals */
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/* the footer wordmark only — run wide via its width axis */
const anybody = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-wordmark",
  display: "swap",
});

/* metadataBase is what turns the opengraph-image / twitter-image / apple-icon
   file conventions into absolute URLs in the <head>. Without it, previews on
   iMessage, LinkedIn, and X get a relative path and render a blank card. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devomb.com";

/* One title and one description, shared by <head>, Open Graph, and Twitter —
   and kept in step with the hero, which reads Trader · Engineer · Researcher. */
const TITLE = "Devom Brahmbhatt — Trader · Engineer · Researcher";
const DESCRIPTION =
  "Trader, engineer, and researcher. Systems that hold up under real traffic — PostgreSQL, Node, C++, Next.js — plus a C++ poker equity engine you can run live.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Devom B",
    template: "%s · Devom B",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "devomb.com",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
        className={`${plexSans.variable} ${bricolage.variable} ${spaceGrotesk.variable} ${mono.variable} ${anybody.variable} font-sans antialiased`}
      >
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
