import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Space_Grotesk } from "next/font/google";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const heading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Devom Brahmbhatt",
    template: "%s · Devom Brahmbhatt",
  },
  description:
    "Devom Brahmbhatt — full-stack work on Roosevelt Connect, WebWork Innovations, Virtual Medical Missions. Next.js, Flutter, PostgreSQL, C++.",
  openGraph: {
    title: "Devom Brahmbhatt",
    description:
      "Personal site: resume sections, PokerLab (Monte Carlo NLHE equity), and links.",
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
    <html lang="en">
      <body
        className={`${sans.variable} ${heading.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
