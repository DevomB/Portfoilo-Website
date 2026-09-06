import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/(chrome)/Navbar";
import Mirage from "@/app/(pallas)/Mirage";

export const metadata: Metadata = {
  title: "The Mirage",
  description:
    "A backtest-overfitting experiment: Athena's Pallas sweeps a parameter grid in your browser, three procedures pick a strategy, and a held-out year says which one was a mirage.",
};

export default function MiragePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <Link
            href="/projects/athenas-pallas"
            className="inline-flex items-center gap-1.5 font-mono text-fluid-xs text-muted transition-colors hover:text-ink mb-8"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            back to project
          </Link>

          <div className="mb-8">
            <p className="font-mono text-fluid-xs text-secondary tracking-wide mb-2">{"// mirage"}</p>
            <h1 className="font-title text-fluid-4xl font-bold tracking-tight text-ink">The Mirage</h1>
            <p className="mt-2 text-fluid-base text-muted max-w-2xl">
              Sweep a parameter grid over a year of prices and something always looks good. The
              question is whether it was there. This runs the experiment:{" "}
              <a
                href="https://crates.io/crates/athenas-pallas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dim transition-colors"
              >
                Athena&apos;s Pallas
              </a>
              , compiled for your browser, backtests every cell of the grid in-sample, then three
              procedures each pick a strategy — the in-sample peak, the plateau around it, and a
              walk-forward that re-picks every quarter — and a held-out year they never saw grades
              them. A shuffled-world test says how often luck alone produces the peak. Plant a
              signal in the world, or leave it as noise, and watch which procedure is fooled.
            </p>
          </div>

          <Mirage />
        </div>
      </main>
    </>
  );
}
