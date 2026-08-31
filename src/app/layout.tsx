import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Geist_Mono, Goldman } from "next/font/google";
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

// Brand face for the wordmark only. Goldman bold — wide, geometric, a little
// arcade — self-hosted like the others so there is no runtime request to
// Google and no swap flash. Bold is the only weight the mark uses.
const brand = Goldman({
  subsets: ["latin"],
  weight: "700",
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
