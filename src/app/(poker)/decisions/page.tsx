import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/(chrome)/Navbar";
import RiverDecisions from "@/app/(poker)/RiverDecisions";

export const metadata: Metadata = {
  title: "Geometry of Decisions",
  description:
    "A river decision surface over all 169 hands: paint what you believe about your opponent, and watch fold, call and raise trade places. Every value can be checked by hand.",
};

export default function DecisionsPage() {
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
            <p className="font-mono text-fluid-xs text-secondary tracking-wide mb-2">{"// decisions"}</p>
            <h1 className="font-title text-fluid-4xl font-bold tracking-tight text-ink">Geometry of Decisions</h1>
            <p className="mt-2 text-fluid-base text-muted max-w-2xl">
              Heads-up on the river. The opponent has bet. The terrain is every hand you could be
              holding: its height is the value of your best action, its colour is which action that
              is. Paint what you believe about the opponent — the range they arrive with, how much of
              it they bet for value, how much they bluff, whether they fold to a raise — and the
              surface moves. Showdowns are scored by the C++ engine behind{" "}
              <a
                href="https://www.npmjs.com/package/poker-calculations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dim transition-colors"
              >
                poker-calculations
              </a>
              ; the game on top is small enough that every number can be checked by hand.
            </p>
          </div>

          <RiverDecisions />
        </div>
      </main>
    </>
  );
}
