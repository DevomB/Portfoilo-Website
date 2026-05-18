import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import PokerLab from "@/app/components/PokerLab";

export const metadata: Metadata = {
  title: "Poker Equity Calculator",
  description:
    "Live Monte Carlo poker equity simulation powered by the poker-calculations C++ engine.",
};

export default function PokerLabPage() {
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
            <p className="font-mono text-fluid-xs text-accent tracking-wide mb-2">
              // demoexperience/poker-lab
            </p>
            <h1 className="text-fluid-4xl font-bold tracking-tight text-ink">
              Poker Equity Calculator
            </h1>
            <p className="mt-2 text-fluid-base text-muted max-w-xl">
              Monte Carlo simulation via the{" "}
              <a
                href="https://www.npmjs.com/package/poker-calculations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dim transition-colors"
              >
                poker-calculations
              </a>{" "}
              C++ engine. Enter hole cards and an optional board to run equity.
            </p>
          </div>

          <PokerLab />
        </div>
      </main>
    </>
  );
}
