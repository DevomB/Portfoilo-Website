import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/(chrome)/Navbar";
import Landscape from "@/app/(poker)/Landscape";

export const metadata: Metadata = {
  title: "The Landscape",
  description:
    "All 169 starting hands as a terrain — height is equity against the range you paint, computed live by the poker-calculations engine, exact on the river. Deal a board and watch it deform.",
};

export default function LandscapePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <Link
            href="/projects/poker-bot"
            className="inline-flex items-center gap-1.5 font-mono text-fluid-xs text-muted transition-colors hover:text-ink mb-8"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            back to project
          </Link>

          <div className="mb-8">
            <p className="font-mono text-fluid-xs text-secondary tracking-wide mb-2">{"// landscape"}</p>
            <h1 className="font-title text-fluid-4xl font-bold tracking-tight text-ink">The Landscape</h1>
            <p className="mt-2 text-fluid-base text-muted max-w-xl">
              Every one of the 169 starting hands as terrain. Height is equity, computed live by
              the C++ engine behind{" "}
              <a
                href="https://www.npmjs.com/package/poker-calculations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dim transition-colors"
              >
                poker-calculations
              </a>
              . Paint the range you put your opponent on and every height re-prices against it —
              sampled showdowns before the river, exact on it. Deal a board and watch the
              mountains move; switch to random opponents to see the map without a read.
            </p>
          </div>

          <Landscape />
        </div>
      </main>
    </>
  );
}
