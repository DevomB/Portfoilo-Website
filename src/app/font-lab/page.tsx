import type { Metadata } from "next";
import {
  Anybody,
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Space_Grotesk,
} from "next/font/google";
import FontLab from "./FontLab";

export const metadata: Metadata = {
  title: "Font Lab",
  description: "Private type specimen — not linked from the site.",
  robots: { index: false, follow: false },
};

/* Every candidate is loaded ONLY on this route. Nothing here touches the site. */
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--f-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--f-geist-mono", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--f-space-grotesk", display: "swap" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-plex-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-plex-mono", display: "swap" });
/* Anybody carries a width axis — that is the whole point of the Expanse pairing. */
const anybody = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--f-anybody", display: "swap" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--f-instrument-sans", display: "swap" });

const fontVars = [
  bricolage.variable,
  geist.variable,
  geistMono.variable,
  spaceGrotesk.variable,
  plexSans.variable,
  plexMono.variable,
  anybody.variable,
  instrumentSans.variable,
].join(" ");

export default function FontLabPage() {
  return (
    <div className={fontVars}>
      <FontLab />
    </div>
  );
}
