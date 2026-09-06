import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/(chrome)/Navbar";
import Counterexample from "@/app/(ananke)/Counterexample";

export const metadata: Metadata = {
  title: "Counterexample",
  description:
    "Ananke, running in your browser, records a payment workflow until an invariant breaks, replays it deterministically, shrinks the failing scenario to a minimal repro, and forks a different future from the step before.",
};

export default function CounterexamplePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <Link
            href="/projects/ananke"
            className="inline-flex items-center gap-1.5 font-mono text-fluid-xs text-muted transition-colors hover:text-ink mb-8"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            back to project
          </Link>

          <div className="mb-8">
            <p className="font-mono text-fluid-xs text-secondary tracking-wide mb-2">{"// counterexample"}</p>
            <h1 className="font-title text-fluid-4xl font-bold tracking-tight text-ink">Counterexample</h1>
            <p className="mt-2 text-fluid-base text-muted max-w-2xl">
              A payment system with a bug in it. Authorizations, partial captures, refunds, voids and
              redelivered commands run through{" "}
              <a
                href="https://github.com/DevomB/Ananke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dim transition-colors"
              >
                Ananke
              </a>
              , the deterministic event runtime, compiled from OCaml to run in this tab. Every command,
              event and invariant check lands in a trace; the run stops the moment an invariant breaks.
              Then the runtime does what a debugger should: replays the trace and proves it identical,
              shrinks forty commands to the handful that reproduce the bug, and forks the world at the
              step before to show the future that would have been fine.
            </p>
          </div>

          <Counterexample />
        </div>
      </main>
    </>
  );
}
