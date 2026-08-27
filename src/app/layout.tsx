import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Devom Brahmbhatt — Backend Engineer",
    template: "%s · Devom Brahmbhatt",
  },
  description:
    "Devom Brahmbhatt — Backend Engineer. Building resilient APIs, data-intensive systems, and applied simulations. Roosevelt Connect, Virtual Medical Missions, WebWork Innovations.",
  openGraph: {
    title: "Devom Brahmbhatt — Backend Engineer",
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
        className={`${bricolage.variable} ${mono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
