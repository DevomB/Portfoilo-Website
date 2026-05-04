import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Devom Brahmbhatt · Builder & engineer",
    template: "%s · Devom Brahmbhatt",
  },
  description:
    "Full-stack developer building Roosevelt Connect, WebWork Innovations, and Virtual Medical Missions — Next.js, Flutter, PostgreSQL, C++.",
  openGraph: {
    title: "Devom Brahmbhatt",
    description:
      "Portfolio with Monte Carlo PokerLab, experience timeline, and outbound credential links.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
