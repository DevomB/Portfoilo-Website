import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import CardDesk from "@/app/components/CardDesk";

export const metadata: Metadata = {
  title: "Card Sum Options Desk",
  description:
    "Options on the sum of drawn cards — theo and Greeks re-priced live by the cardquant Python package.",
};

export default function CardDeskPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <Link
            href="/projects/cardquant"
            className="inline-flex items-center gap-1.5 font-mono text-fluid-xs text-muted transition-colors hover:text-ink mb-8"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            back to project
          </Link>

          <div className="mb-8">
            <p className="font-mono text-fluid-xs text-secondary tracking-wide mb-2">
              {"// card-desk"}
            </p>
            <h1 className="font-title text-fluid-4xl font-bold tracking-tight text-ink">
              Card Sum Options Desk
            </h1>
            <p className="mt-2 text-fluid-base text-muted max-w-xl">
              IMC&apos;s mock trading game as a desk. Draw cards one at a time and watch theo and
              the Greeks re-price across every strike — computed exactly by the{" "}
              <a
                href="https://pypi.org/project/cardquant/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-dim transition-colors"
              >
                cardquant
              </a>{" "}
              Python package, running unmodified on CPython.
            </p>
          </div>

          <CardDesk />
        </div>
      </main>
    </>
  );
}
