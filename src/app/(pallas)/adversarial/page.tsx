import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/(chrome)/Navbar";
import AdversarialTape from "@/app/(pallas)/AdversarialTape";

export const metadata: Metadata = {
  title: "Adversarial Tape",
  description:
    "Athena's Pallas, running in your browser, hunts for the price path that makes a strategy lose the most — endpoints pinned, so it can only reorder time.",
};

export default function AdversarialPage() {
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
            <p className="font-mono text-fluid-xs text-secondary tracking-wide mb-2">{"// adversarial-tape"}</p>
            <h1 className="font-title text-fluid-4xl font-bold tracking-tight text-ink">Adversarial Tape</h1>
            <p className="mt-2 text-fluid-base text-muted max-w-2xl">
              A backtest is something to attack, not admire. Pick a textbook strategy and the
              engine —{" "}
              <a
                href="https://crates.io/crates/athenas-pallas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dim transition-colors"
              >
                Athena&apos;s Pallas
              </a>
              , compiled for your browser and running in this tab — searches for the price path
              that makes it lose the most. The first and last close are pinned: it cannot crash
              the market, only reorder time. What survives that is real. What doesn&apos;t was
              path risk all along.
            </p>
          </div>

          <AdversarialTape />
        </div>
      </main>
    </>
  );
}
